/**
 * Custom Dataset Ingestion Engine
 * Parses user CSV, JSON, or ISO 20022 XML datasets, validates balances,
 * runs the value provenance engine, and updates live ledger states.
 */

import { CanonicalTransaction, Channel, Currency, InstitutionId, ISO20022MessageType } from '../../types';
import { parsePacs008Xml, parseLegacyJson } from '../adapters/iso20022';
import { ledgerInstance } from '../ledger/ledger';

export interface IngestionPreviewItem {
  id: string;
  sourceAccount: string;
  targetAccount: string;
  amount: number;
  channel: Channel;
  timestamp: string;
  isOriginTheft?: boolean;
  format: 'CSV' | 'JSON' | 'ISO20022_XML';
  status: 'VALID' | 'WARNING' | 'ERROR';
  note?: string;
}

export interface IngestionResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  injectedDisputedAmount: number;
  errors: string[];
  newAccountsCreated: number;
}

/**
 * Parses raw CSV string formatted as:
 * from_account,to_account,amount,channel,from_bank,to_bank,is_fraud_origin,narrative
 */
export function parseTransactionCsv(csvText: string): IngestionPreviewItem[] {
  const lines = csvText.trim().split('\n');
  const items: IngestionPreviewItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || (i === 0 && line.toLowerCase().includes('from_account'))) {
      continue;
    }

    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 3) continue;

    const fromAcc = cols[0];
    const toAcc = cols[1];
    const amount = parseFloat(cols[2]) || 0;
    const channel = (cols[3]?.toUpperCase() as Channel) || 'UPI';
    const isOrigin = cols[6]?.toLowerCase() === 'true' || cols[6] === '1';

    items.push({
      id: `CSV-ROW-${i}`,
      sourceAccount: fromAcc,
      targetAccount: toAcc,
      amount,
      channel,
      timestamp: new Date().toISOString(),
      isOriginTheft: isOrigin,
      format: 'CSV',
      status: amount > 0 && fromAcc && toAcc ? 'VALID' : 'ERROR',
      note: isOrigin ? 'Disputed Fraud Origin Point' : undefined,
    });
  }

  return items;
}

/**
 * Executes live batch ingestion into TraceMesh ledger
 */
export function executeBatchIngestion(items: IngestionPreviewItem[]): IngestionResult {
  let successful = 0;
  let failed = 0;
  let injectedDisputedAmount = 0;
  let newAccountsCreated = 0;
  const errors: string[] = [];

  const existingAccounts = new Map(ledgerInstance.getAccounts().map((a) => [a.id, a]));

  for (const item of items) {
    if (item.status === 'ERROR') {
      failed++;
      errors.push(`Row ${item.id}: Invalid parameters`);
      continue;
    }

    try {
      // Auto-provision accounts if they don't exist yet in synthetic ledger
      let debtor = existingAccounts.get(item.sourceAccount);
      let creditor = existingAccounts.get(item.targetAccount);

      if (!debtor) {
        const instId: InstitutionId = item.sourceAccount.includes('HDFC')
          ? 'HDFCINBB'
          : item.sourceAccount.includes('ICIC')
          ? 'ICICINBB'
          : item.sourceAccount.includes('AXIS') || item.sourceAccount.includes('UTIB')
          ? 'UTIBINBB'
          : 'SBININBB';

        const initialBal = item.isOriginTheft ? item.amount * 1.5 : item.amount * 2;
        debtor = {
          id: item.sourceAccount,
          accountNumberMasked: `${instId.substring(0, 4)}••••${Math.floor(1000 + Math.random() * 9000)}`,
          customerId: `CUST-${item.sourceAccount.replace('ACC-', '')}`,
          institutionId: instId,
          accountType: 'SAVINGS',
          totalBalance: initialBal,
          cleanValue: initialBal,
          taintedValue: 0,
          taintPercentage: 0,
          status: 'ACTIVE',
          activeLienAmount: 0,
          branch: 'Synthetic Ingested Node',
          lastUpdated: new Date().toISOString(),
        };
        // Directly push into ledger state
        (ledgerInstance as any).accounts.set(debtor.id, debtor);
        existingAccounts.set(debtor.id, debtor);
        newAccountsCreated++;
      }

      if (!creditor) {
        const instId: InstitutionId = item.targetAccount.includes('HDFC')
          ? 'HDFCINBB'
          : item.targetAccount.includes('ICIC')
          ? 'ICICINBB'
          : item.targetAccount.includes('AXIS') || item.targetAccount.includes('UTIB')
          ? 'UTIBINBB'
          : 'SBININBB';

        const initialBal = 50000;
        creditor = {
          id: item.targetAccount,
          accountNumberMasked: `${instId.substring(0, 4)}••••${Math.floor(1000 + Math.random() * 9000)}`,
          customerId: `CUST-${item.targetAccount.replace('ACC-', '')}`,
          institutionId: instId,
          accountType: 'CURRENT',
          totalBalance: initialBal,
          cleanValue: initialBal,
          taintedValue: 0,
          taintPercentage: 0,
          status: 'ACTIVE',
          activeLienAmount: 0,
          branch: 'Synthetic Ingested Node',
          lastUpdated: new Date().toISOString(),
        };
        (ledgerInstance as any).accounts.set(creditor.id, creditor);
        existingAccounts.set(creditor.id, creditor);
        newAccountsCreated++;
      }

      const tx: CanonicalTransaction = {
        transactionId: `TXN-CUSTOM-${Math.floor(100000 + Math.random() * 900000)}`,
        messageId: `MSG-CUSTOM-${Date.now()}`,
        endToEndId: `E2E-CUSTOM-${Date.now()}`,
        instructionId: `INST-CUSTOM-${Date.now()}`,
        timestamp: item.timestamp,
        amount: item.amount,
        currency: 'INR',
        debtorAccountId: debtor.id,
        debtorCustomerId: debtor.customerId,
        debtorInstitutionId: debtor.institutionId,
        creditorAccountId: creditor.id,
        creditorCustomerId: creditor.customerId,
        creditorInstitutionId: creditor.institutionId,
        channel: item.channel,
        purpose: item.isOriginTheft ? 'REPORTED_FRAUD_THEFT' : 'COMMINGLED_TRANSFER',
        remittanceInformation: item.isOriginTheft ? 'FRAUDULENT THEFT INJECTION' : 'Inter-bank settlement',
        status: 'SETTLED',
        rawMessageRef: '',
      };

      ledgerInstance.processCanonicalTransaction(tx, item.isOriginTheft || false, 'CASE-2026-00041');

      if (item.isOriginTheft) {
        injectedDisputedAmount += item.amount;
      }
      successful++;
    } catch (err: any) {
      failed++;
      errors.push(`Row ${item.id}: ${err.message}`);
    }
  }

  return {
    totalProcessed: items.length,
    successful,
    failed,
    injectedDisputedAmount,
    errors,
    newAccountsCreated,
  };
}
