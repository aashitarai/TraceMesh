/**
 * ISO 20022 & Core Banking Message Adapters
 * Translates pacs.008, Legacy Core Banking JSON, and CSV batch formats into
 * the standardized CanonicalTransaction model while archiving raw messages.
 */

import { CanonicalTransaction, Channel, Currency, InstitutionId, RawFinancialMessage } from '../../types';
import { sha256Sync } from '../crypto/hashChain';

/** Generates realistic ISO 20022 pacs.008 XML payload */
export function generatePacs008Xml(tx: CanonicalTransaction): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${tx.messageId}</MsgId>
      <CreDtTm>${tx.timestamp}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys>
          <Prtry>NPCI-${tx.channel}</Prtry>
        </ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>${tx.instructionId}</InstrId>
        <EndToEndId>${tx.endToEndId}</EndToEndId>
        <TxId>${tx.transactionId}</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${tx.currency}">${tx.amount.toFixed(2)}</IntrBkSttlmAmt>
      <Dbtr>
        <Nm>CUSTOMER-${tx.debtorCustomerId}</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <Othr>
            <Id>${tx.debtorAccountId}</Id>
          </Othr>
        </Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>${tx.debtorInstitutionId}</BICFI>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${tx.creditorInstitutionId}</BICFI>
        </FinInstnId>
      </CdtrAgt>
      <Cdtr>
        <Nm>CUSTOMER-${tx.creditorCustomerId}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <Othr>
            <Id>${tx.creditorAccountId}</Id>
          </Othr>
        </Id>
      </CdtrAcct>
      <RmtInf>
        <Ustrd>${escapeXml(tx.remittanceInformation)}</Ustrd>
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/** Parses pacs.008 XML into CanonicalTransaction */
export function parsePacs008Xml(xmlString: string): { canonical: CanonicalTransaction; raw: RawFinancialMessage } {
  const getTag = (tag: string, source: string): string => {
    const match = source.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 's'));
    return match ? match[1].trim() : '';
  };

  const getAttrTag = (tag: string, attr: string, source: string): { val: string; attrVal: string } => {
    const match = source.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>(.*?)</${tag}>`, 's'));
    return {
      attrVal: match ? match[1] : 'INR',
      val: match ? match[2].trim() : '0',
    };
  };

  const msgId = getTag('MsgId', xmlString) || `MSG-${Date.now()}`;
  const timestamp = getTag('CreDtTm', xmlString) || new Date().toISOString();
  const txId = getTag('TxId', xmlString) || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const instrId = getTag('InstrId', xmlString) || `INST-${Date.now()}`;
  const endToEndId = getTag('EndToEndId', xmlString) || `E2E-${Date.now()}`;
  
  const amtMatch = getAttrTag('IntrBkSttlmAmt', 'Ccy', xmlString);
  const amount = parseFloat(amtMatch.val) || 0;
  const currency = (amtMatch.attrVal as Currency) || 'INR';

  const debtorAgt = (getTag('BICFI', xmlString.split('<DbtrAgt>')[1] || '') as InstitutionId) || 'SBININBB';
  const creditorAgt = (getTag('BICFI', xmlString.split('<CdtrAgt>')[1] || '') as InstitutionId) || 'HDFCINBB';
  
  const debtorAcct = getTag('Id', xmlString.split('<DbtrAcct>')[1] || '') || 'ACC-UNKNOWN';
  const creditorAcct = getTag('Id', xmlString.split('<CdtrAcct>')[1] || '') || 'ACC-UNKNOWN';

  const clrSys = getTag('Prtry', xmlString);
  const channel: Channel = clrSys.includes('IMPS')
    ? 'IMPS'
    : clrSys.includes('NEFT')
    ? 'NEFT'
    : clrSys.includes('RTGS')
    ? 'RTGS'
    : 'UPI';

  const remittanceInfo = getTag('Ustrd', xmlString) || 'Transfer via ISO 20022';

  const rawMessage: RawFinancialMessage = {
    messageId: msgId,
    messageType: 'pacs.008.001.10',
    receivedAt: timestamp,
    sourceInstitution: debtorAgt,
    rawPayload: xmlString,
    payloadFormat: 'XML',
    tamperHash: sha256Sync(xmlString),
  };

  const canonical: CanonicalTransaction = {
    transactionId: txId,
    messageId: msgId,
    endToEndId,
    instructionId: instrId,
    timestamp,
    amount,
    currency,
    debtorAccountId: debtorAcct,
    debtorCustomerId: `CUST-${debtorAcct.replace('ACC-', '')}`,
    debtorInstitutionId: debtorAgt,
    creditorAccountId: creditorAcct,
    creditorCustomerId: `CUST-${creditorAcct.replace('ACC-', '')}`,
    creditorInstitutionId: creditorAgt,
    channel,
    purpose: 'INTER_BANK_TRANSFER',
    remittanceInformation: remittanceInfo,
    status: 'SETTLED',
    rawMessageRef: rawMessage.tamperHash,
  };

  return { canonical, raw: rawMessage };
}

/** Legacy JSON adapter for standard REST core banking interfaces */
export function parseLegacyJson(jsonObj: Record<string, unknown>): { canonical: CanonicalTransaction; raw: RawFinancialMessage } {
  const jsonStr = JSON.stringify(jsonObj);
  const msgId = (jsonObj.msg_id as string) || `LEGACY-MSG-${Date.now()}`;
  const timestamp = (jsonObj.timestamp as string) || new Date().toISOString();
  const txId = (jsonObj.ref_no as string) || `TXN-LEGACY-${Math.floor(100000 + Math.random() * 900000)}`;
  const debtorInst = (jsonObj.from_bank_bic as InstitutionId) || 'ICICINBB';
  const creditorInst = (jsonObj.to_bank_bic as InstitutionId) || 'UTIBINBB';

  const raw: RawFinancialMessage = {
    messageId: msgId,
    messageType: 'LEGACY_JSON',
    receivedAt: timestamp,
    sourceInstitution: debtorInst,
    rawPayload: jsonStr,
    payloadFormat: 'JSON',
    tamperHash: sha256Sync(jsonStr),
  };

  const canonical: CanonicalTransaction = {
    transactionId: txId,
    messageId: msgId,
    endToEndId: (jsonObj.e2e_id as string) || `E2E-${txId}`,
    instructionId: (jsonObj.instr_id as string) || `INST-${txId}`,
    timestamp,
    amount: Number(jsonObj.amount) || 0,
    currency: (jsonObj.currency as Currency) || 'INR',
    debtorAccountId: (jsonObj.source_account as string) || 'ACC-LEGACY-01',
    debtorCustomerId: (jsonObj.source_customer as string) || 'CUST-LEGACY-01',
    debtorInstitutionId: debtorInst,
    creditorAccountId: (jsonObj.target_account as string) || 'ACC-LEGACY-02',
    creditorCustomerId: (jsonObj.target_customer as string) || 'CUST-LEGACY-02',
    creditorInstitutionId: creditorInst,
    channel: (jsonObj.payment_channel as Channel) || 'IMPS',
    purpose: (jsonObj.purpose_code as string) || 'SETTLEMENT',
    remittanceInformation: (jsonObj.narrative as string) || 'Legacy banking transfer',
    status: 'SETTLED',
    rawMessageRef: raw.tamperHash,
  };

  return { canonical, raw };
}
