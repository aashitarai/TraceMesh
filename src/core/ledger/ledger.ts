/**
 * TraceMesh Core Ledger & Provenance Transaction Engine
 * Immutable double-entry state, cryptographic block hashing, and graph projection.
 */

import { generatePacs008Xml, parsePacs008Xml } from '../adapters/iso20022';
import { ChainedRecord, computeNextHash, sha256Sync, verifyChainIntegrity } from '../crypto/hashChain';
import { analyzeTransaction, propagateValue } from '../provenance/engine';
import { generateInitialBankingEnvironment } from '../simulator/forgeData';
import {
  Account,
  AuditEvent,
  CanonicalTransaction,
  Customer,
  EnrichedTransaction,
  GraphEdge,
  GraphNode,
  Institution,
  InstitutionId,
  InvestigationCase,
  ProvenanceModelType,
  SecurityRole,
  UserSecurityContext,
} from '../../types';

export class TraceMeshLedger {
  private institutions: Institution[] = [];
  private customers: Map<string, Customer> = new Map();
  private accounts: Map<string, Account> = new Map();
  private transactions: EnrichedTransaction[] = [];
  private cases: Map<string, InvestigationCase> = new Map();
  private auditLogs: AuditEvent[] = [];
  private provenanceModel: ProvenanceModelType = 'PROPORTIONAL';
  private latestBlockHash: string = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';
  private latestAuditHash: string = 'GENESIS_AUDIT_000000000000000000000000000000000000000000000000000000000';

  constructor(seed: number = 42) {
    this.reset(seed);
  }

  public reset(seed: number = 42): void {
    const env = generateInitialBankingEnvironment(seed);
    this.institutions = env.institutions;
    this.customers = new Map(env.customers.map((c) => [c.id, c]));
    this.accounts = new Map(env.accounts.map((a) => [a.id, a]));
    this.cases = new Map([[env.primaryCase.id, env.primaryCase]]);
    this.transactions = [];
    this.auditLogs = [];
    this.provenanceModel = 'PROPORTIONAL';
    this.latestBlockHash = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';
    this.latestAuditHash = 'GENESIS_AUDIT_000000000000000000000000000000000000000000000000000000000';

    this.recordAudit({
      actor: 'SYSTEM_BOOT',
      role: 'ADMIN',
      action: 'USER_LOGIN',
      resourceId: 'LEDGER_INITIALIZE',
      status: 'SUCCESS',
      reason: `Ledger initialized with seed=${seed}`,
      clientIp: '127.0.0.1',
    });
  }

  public setProvenanceModel(model: ProvenanceModelType): void {
    this.provenanceModel = model;
    this.recordAudit({
      actor: 'INVESTIGATOR',
      role: 'INVESTIGATOR',
      action: 'TRACE_EXECUTED',
      resourceId: 'PROVENANCE_MODEL_CHANGE',
      status: 'SUCCESS',
      reason: `Changed active provenance attribution model to ${model}`,
      clientIp: '10.0.4.12',
    });
  }

  public getProvenanceModel(): ProvenanceModelType {
    return this.provenanceModel;
  }

  public getInstitutions(): Institution[] {
    return [...this.institutions];
  }

  public getAccounts(): Account[] {
    return Array.from(this.accounts.values());
  }

  public getAccount(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  public getTransactions(): EnrichedTransaction[] {
    return [...this.transactions];
  }

  public getCases(): InvestigationCase[] {
    return Array.from(this.cases.values());
  }

  public getCase(id: string): InvestigationCase | undefined {
    return this.cases.get(id);
  }

  public getAuditLogs(): AuditEvent[] {
    return [...this.auditLogs];
  }

  /**
   * Process a Canonical Transaction through the complete 3-layer pipeline
   */
  public processCanonicalTransaction(
    tx: CanonicalTransaction,
    isFraudOrigin: boolean = false,
    caseId?: string,
    rawPayloadOverride?: string
  ): EnrichedTransaction {
    const debtor = this.accounts.get(tx.debtorAccountId);
    const creditor = this.accounts.get(tx.creditorAccountId);

    if (!debtor) {
      throw new Error(`Debtor account ${tx.debtorAccountId} does not exist in ledger.`);
    }
    if (!creditor) {
      throw new Error(`Creditor account ${tx.creditorAccountId} does not exist in ledger.`);
    }

    // 1. Provenance Value Propagation
    const propagation = propagateValue(debtor, creditor, tx.amount, this.provenanceModel, isFraudOrigin);

    // Update Accounts state
    this.accounts.set(debtor.id, propagation.updatedSourceAccount);
    this.accounts.set(creditor.id, propagation.updatedDestinationAccount);

    // 2. Analytical Layer Generation
    const analytical = analyzeTransaction(
      tx,
      debtor,
      isFraudOrigin,
      isFraudOrigin ? `ORG-${tx.transactionId}` : undefined,
      caseId,
      this.provenanceModel
    );

    // 3. Raw Message Generation / Archiving
    const rawPayload = rawPayloadOverride || generatePacs008Xml(tx);
    const rawMessage = {
      messageId: tx.messageId,
      messageType: 'pacs.008.001.10' as const,
      receivedAt: tx.timestamp,
      sourceInstitution: tx.debtorInstitutionId,
      rawPayload,
      payloadFormat: 'XML' as const,
      tamperHash: sha256Sync(rawPayload),
    };

    // 4. Block Cryptographic Hashing (H_n = SHA256(Tx + H_{n-1}))
    const txContentString = JSON.stringify({
      canonical: tx,
      analytical,
      rawHash: rawMessage.tamperHash,
    });
    const blockHash = computeNextHash(txContentString, this.latestBlockHash);
    const previousBlockHash = this.latestBlockHash;
    this.latestBlockHash = blockHash;

    const enrichedTx: EnrichedTransaction = {
      canonical: tx,
      raw: rawMessage,
      analytical,
      ledgerIndex: this.transactions.length,
      blockHash,
      previousBlockHash,
    };

    this.transactions.push(enrichedTx);

    // If part of a case, link it
    if (caseId && this.cases.has(caseId)) {
      const c = this.cases.get(caseId)!;
      if (!c.involvedTransactionIds.includes(tx.transactionId)) {
        c.involvedTransactionIds.push(tx.transactionId);
      }
      if (!c.involvedAccountIds.includes(tx.debtorAccountId)) {
        c.involvedAccountIds.push(tx.debtorAccountId);
      }
      if (!c.involvedAccountIds.includes(tx.creditorAccountId)) {
        c.involvedAccountIds.push(tx.creditorAccountId);
      }
      c.updatedAt = new Date().toISOString();
    }

    this.recordAudit({
      actor: 'SETTLEMENT_ENGINE',
      role: 'ADMIN',
      action: 'TRACE_EXECUTED',
      resourceId: tx.transactionId,
      status: 'SUCCESS',
      reason: `Settled tx ${tx.transactionId} of ₹${tx.amount} (Tainted: ₹${analytical.taintedValue.toFixed(2)}, Taint: ${analytical.taintPercentage}%)`,
      clientIp: '10.0.1.5',
    });

    return enrichedTx;
  }

  /**
   * Process raw ISO 20022 pacs.008 XML message
   */
  public processIso20022Xml(xmlString: string, isFraudOrigin: boolean = false, caseId?: string): EnrichedTransaction {
    const { canonical } = parsePacs008Xml(xmlString);
    return this.processCanonicalTransaction(canonical, isFraudOrigin, caseId, xmlString);
  }

  /**
   * Run the Citi × NPCI Drunix Hackathon standard commingling demo scenario:
   * Step 1: Victim loses ₹2,00,000 -> Mule A (already has ₹5,00,000 clean).
   * Step 2: Mule A sends ₹1,50,000 to Mule B.
   * Step 3: Mule A sends ₹1,00,000 to Mule C.
   * Step 4: Mule B sends ₹90,000 to Mule D.
   * Step 5: Mule C sends ₹60,000 to Merchant / Terminal.
   */
  public runPrimaryHackathonScenario(): EnrichedTransaction[] {
    const results: EnrichedTransaction[] = [];
    const caseId = 'CASE-2026-00041';

    // Step 1: Fraud Origin (Theft from SBI Victim to HDFC Mule A)
    const tx1: CanonicalTransaction = {
      transactionId: 'TXN-ORIGIN-001',
      messageId: 'MSG-ORIGIN-001',
      endToEndId: 'E2E-SBI-HDFC-99120',
      instructionId: 'INST-20260924-001',
      timestamp: '2026-09-24T12:00:00Z',
      amount: 200000,
      currency: 'INR',
      debtorAccountId: 'ACC-SBI-VICTIM-01',
      debtorCustomerId: 'CUST-VICTIM-01',
      debtorInstitutionId: 'SBININBB',
      creditorAccountId: 'ACC-HDFC-MULE-A',
      creditorCustomerId: 'CUST-MULE-A',
      creditorInstitutionId: 'HDFCINBB',
      channel: 'IMPS',
      purpose: 'FRAUDULENT_TRANSFER',
      remittanceInformation: 'URGENT KYC REFUND REVERSAL',
      status: 'SETTLED',
      rawMessageRef: '',
    };
    results.push(this.processCanonicalTransaction(tx1, true, caseId));

    // Step 2: Mule A -> Mule B (₹1,50,000)
    const tx2: CanonicalTransaction = {
      transactionId: 'TXN-HOP1-002',
      messageId: 'MSG-HOP1-002',
      endToEndId: 'E2E-HDFC-ICIC-11029',
      instructionId: 'INST-20260924-002',
      timestamp: '2026-09-24T12:15:00Z',
      amount: 150000,
      currency: 'INR',
      debtorAccountId: 'ACC-HDFC-MULE-A',
      debtorCustomerId: 'CUST-MULE-A',
      debtorInstitutionId: 'HDFCINBB',
      creditorAccountId: 'ACC-ICICI-MULE-B',
      creditorCustomerId: 'CUST-MULE-B',
      creditorInstitutionId: 'ICICINBB',
      channel: 'UPI',
      purpose: 'COMMERCIAL_CONSULTANCY',
      remittanceInformation: 'Consultancy invoice settlement',
      status: 'SETTLED',
      rawMessageRef: '',
    };
    results.push(this.processCanonicalTransaction(tx2, false, caseId));

    // Step 3: Mule A -> Mule C (₹1,00,000)
    const tx3: CanonicalTransaction = {
      transactionId: 'TXN-HOP1-003',
      messageId: 'MSG-HOP1-003',
      endToEndId: 'E2E-HDFC-AXIS-44821',
      instructionId: 'INST-20260924-003',
      timestamp: '2026-09-24T12:22:00Z',
      amount: 100000,
      currency: 'INR',
      debtorAccountId: 'ACC-HDFC-MULE-A',
      debtorCustomerId: 'CUST-MULE-A',
      debtorInstitutionId: 'HDFCINBB',
      creditorAccountId: 'ACC-AXIS-MULE-C',
      creditorCustomerId: 'CUST-MULE-C',
      creditorInstitutionId: 'UTIBINBB',
      channel: 'NEFT',
      purpose: 'VENDOR_PAYMENT',
      remittanceInformation: 'Material advance bill #992',
      status: 'SETTLED',
      rawMessageRef: '',
    };
    results.push(this.processCanonicalTransaction(tx3, false, caseId));

    // Step 4: Mule B -> Mule D (₹90,000)
    const tx4: CanonicalTransaction = {
      transactionId: 'TXN-HOP2-004',
      messageId: 'MSG-HOP2-004',
      endToEndId: 'E2E-ICIC-SBI-55910',
      instructionId: 'INST-20260924-004',
      timestamp: '2026-09-24T12:45:00Z',
      amount: 90000,
      currency: 'INR',
      debtorAccountId: 'ACC-ICICI-MULE-B',
      debtorCustomerId: 'CUST-MULE-B',
      debtorInstitutionId: 'ICICINBB',
      creditorAccountId: 'ACC-SBI-MULE-D',
      creditorCustomerId: 'CUST-MULE-D',
      creditorInstitutionId: 'SBININBB',
      channel: 'UPI',
      purpose: 'RENT_DEPOSIT',
      remittanceInformation: 'Security deposit transfer',
      status: 'SETTLED',
      rawMessageRef: '',
    };
    results.push(this.processCanonicalTransaction(tx4, false, caseId));

    // Step 5: Mule C -> Terminal Merchant / Crypto Desk (₹60,000)
    const tx5: CanonicalTransaction = {
      transactionId: 'TXN-HOP2-005',
      messageId: 'MSG-HOP2-005',
      endToEndId: 'E2E-AXIS-TERM-77192',
      instructionId: 'INST-20260924-005',
      timestamp: '2026-09-24T13:00:00Z',
      amount: 60000,
      currency: 'INR',
      debtorAccountId: 'ACC-AXIS-MULE-C',
      debtorCustomerId: 'CUST-MULE-C',
      debtorInstitutionId: 'UTIBINBB',
      creditorAccountId: 'ACC-MERCHANT-TERM',
      creditorCustomerId: 'CUST-MERCHANT-01',
      creditorInstitutionId: 'UTIBINBB',
      channel: 'RTGS',
      purpose: 'BULLION_PURCHASE',
      remittanceInformation: 'Order #GLD-8812 Bullion settlement',
      status: 'SETTLED',
      rawMessageRef: '',
    };
    results.push(this.processCanonicalTransaction(tx5, false, caseId));

    return results;
  }

  /**
   * Generates Graph Representation for visual tracing
   */
  public getCaseGraph(caseId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const c = this.cases.get(caseId);
    const relevantAccIds = new Set<string>();

    if (c) {
      c.involvedAccountIds.forEach((id) => relevantAccIds.add(id));
    } else {
      // Default to all accounts with taint or history
      this.accounts.forEach((acc) => {
        if (acc.taintedValue > 0 || acc.id.includes('MULE') || acc.id.includes('VICTIM')) {
          relevantAccIds.add(acc.id);
        }
      });
    }

    const nodes: GraphNode[] = [];
    relevantAccIds.forEach((accId) => {
      const acc = this.accounts.get(accId);
      if (!acc) return;

      let type: GraphNode['type'] = 'LEGITIMATE';
      if (acc.id.includes('VICTIM')) type = 'VICTIM';
      else if (acc.id.includes('MULE-A')) type = 'MULE';
      else if (acc.id.includes('MULE-B') || acc.id.includes('MULE-C')) type = 'LAYER_2';
      else if (acc.id.includes('MULE-D')) type = 'LAYER_3';
      else if (acc.id.includes('MERCHANT')) type = 'MERCHANT';

      nodes.push({
        id: acc.id,
        label: acc.accountNumberMasked,
        type,
        institutionId: acc.institutionId,
        totalBalance: acc.totalBalance,
        cleanValue: acc.cleanValue,
        taintedValue: acc.taintedValue,
        taintPercentage: acc.taintPercentage,
        status: acc.status,
      });
    });

    const edges: GraphEdge[] = this.transactions
      .filter((t) => relevantAccIds.has(t.canonical.debtorAccountId) && relevantAccIds.has(t.canonical.creditorAccountId))
      .map((t) => ({
        id: `EDGE-${t.canonical.transactionId}`,
        source: t.canonical.debtorAccountId,
        target: t.canonical.creditorAccountId,
        amount: t.canonical.amount,
        taintedValue: t.analytical.taintedValue,
        cleanValue: t.analytical.cleanValue,
        taintPercentage: t.analytical.taintPercentage,
        timestamp: t.canonical.timestamp,
        channel: t.canonical.channel,
        transactionId: t.canonical.transactionId,
        isFraudOrigin: t.analytical.isFraudOrigin,
      }));

    return { nodes, edges };
  }

  /**
   * Cryptographic Ledger Verification
   * Re-hashes all records from Genesis to current and detects any tampering.
   */
  public verifyLedgerIntegrity(): {
    valid: boolean;
    recordsChecked: number;
    tamperedIndex?: number;
    reason?: string;
  } {
    const chainedRecords: ChainedRecord[] = this.transactions.map((tx, idx) => ({
      index: idx,
      data: JSON.stringify({
        canonical: tx.canonical,
        analytical: tx.analytical,
        rawHash: tx.raw.tamperHash,
      }),
      previousHash: tx.previousBlockHash,
      hash: tx.blockHash,
    }));

    const result = verifyChainIntegrity(chainedRecords);
    return {
      valid: result.valid,
      recordsChecked: this.transactions.length,
      tamperedIndex: result.tamperedIndex,
      reason: result.reason,
    };
  }

  /**
   * Tamper Simulation for Red-Team Sandbox demonstration
   * Secretly alters an old transaction amount without recomputing cryptographic hashes.
   */
  public simulateMaliciousTamper(txIndex: number, newAmount: number): boolean {
    if (txIndex >= 0 && txIndex < this.transactions.length) {
      this.transactions[txIndex].canonical.amount = newAmount;
      this.recordAudit({
        actor: 'MALICIOUS_DBA_INTRUDER',
        role: 'ADMIN',
        action: 'TAMPER_LEDGER',
        resourceId: this.transactions[txIndex].canonical.transactionId,
        status: 'FLAGGED',
        reason: `Direct DB update injected on Tx #${txIndex} -> amount altered to ₹${newAmount}`,
        clientIp: '192.168.1.99',
      });
      return true;
    }
    return false;
  }

  public recordAudit(event: Omit<AuditEvent, 'id' | 'timestamp' | 'previousEventHash' | 'eventHash'>): AuditEvent {
    const timestamp = new Date().toISOString();
    const id = `AUDIT-${this.auditLogs.length + 1}`;
    const previousHash = this.latestAuditHash;
    const content = `${id}|${timestamp}|${event.actor}|${event.role}|${event.action}|${event.resourceId}|${event.status}`;
    const eventHash = computeNextHash(content, previousHash);
    this.latestAuditHash = eventHash;

    const fullEvent: AuditEvent = {
      ...event,
      id,
      timestamp,
      previousEventHash: previousHash,
      eventHash,
    };

    this.auditLogs.unshift(fullEvent);
    return fullEvent;
  }
}

// Global Singleton for the Applet runtime
export const ledgerInstance = new TraceMeshLedger(42);
// Pre-populate with the initial hackathon standard scenario
ledgerInstance.runPrimaryHackathonScenario();
