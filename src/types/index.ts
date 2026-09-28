/**
 * TraceMesh Core Domain Types
 * Financial crime value provenance & investigation data models
 */

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type InstitutionId = 'SBININBB' | 'HDFCINBB' | 'ICICINBB' | 'UTIBINBB';

export interface Institution {
  id: InstitutionId;
  name: string;
  code: string;
  ifscPrefix: string;
  country: string;
  color: string;
}

export interface Customer {
  id: string; // Tokenized customer ID (e.g., CUST-TK-8912)
  institutionId: InstitutionId;
  maskedName: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS' | 'MERCHANT';
  riskScore: number;
  kycTier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  createdAt: string;
}

export interface Account {
  id: string; // Tokenized account ID (e.g., ACC-TK-4401)
  accountNumberMasked: string;
  customerId: string;
  institutionId: InstitutionId;
  accountType: 'SAVINGS' | 'CURRENT' | 'MERCHANT_NODAL' | 'WALLET';
  totalBalance: number;
  cleanValue: number;
  taintedValue: number;
  taintPercentage: number; // taintedValue / totalBalance * 100
  status: 'ACTIVE' | 'FLAGGED' | 'PARTIAL_LIEN' | 'FROZEN';
  activeLienAmount: number;
  branch: string;
  lastUpdated: string;
}

export type Channel = 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'AEPS' | 'CARD' | 'ATM';

export type TransactionStatus = 'SETTLED' | 'PENDING' | 'REJECTED' | 'REVERSED';

export type ISO20022MessageType = 'pacs.008.001.10' | 'pacs.002.001.12' | 'pain.001.001.11' | 'pain.013.001.09';

/** Layer 1: Raw Financial Message */
export interface RawFinancialMessage {
  messageId: string;
  messageType: ISO20022MessageType | 'LEGACY_JSON' | 'CSV_BATCH';
  receivedAt: string;
  sourceInstitution: InstitutionId;
  rawPayload: string; // XML or JSON string
  payloadFormat: 'XML' | 'JSON' | 'CSV';
  tamperHash: string; // SHA-256 of raw message
}

/** Layer 2: Canonical Transaction Model */
export interface CanonicalTransaction {
  transactionId: string;
  messageId: string;
  endToEndId: string;
  instructionId: string;
  timestamp: string;
  amount: number;
  currency: Currency;
  debtorAccountId: string;
  debtorCustomerId: string;
  debtorInstitutionId: InstitutionId;
  creditorAccountId: string;
  creditorCustomerId: string;
  creditorInstitutionId: InstitutionId;
  channel: Channel;
  purpose: string;
  remittanceInformation: string; // Untrusted user input!
  status: TransactionStatus;
  rawMessageRef: string;
}

/** Layer 3: TraceMesh Analytical Metadata */
export interface TraceMeshAnalysis {
  transactionId: string;
  taintedValue: number;
  cleanValue: number;
  taintPercentage: number; // taintedValue / amount * 100
  isFraudOrigin: boolean;
  fraudOriginId?: string;
  caseId?: string;
  traceConfidence: 'CONFIRMED' | 'HIGH' | 'PROBABLE' | 'UNCERTAIN';
  confidenceScore: number; // 0.00 to 1.00
  provenanceModel: ProvenanceModelType;
  upstreamHops: number;
  riskReasons: string[];
  downstreamExposure: number;
}

/** Complete 3-Layer Transaction Record */
export interface EnrichedTransaction {
  canonical: CanonicalTransaction;
  raw: RawFinancialMessage;
  analytical: TraceMeshAnalysis;
  ledgerIndex: number;
  blockHash: string;
  previousBlockHash: string;
}

export type ProvenanceModelType =
  | 'PROPORTIONAL' // Pro-rata commingling (standard mathematical conservation)
  | 'FIFO' // First-In First-Out (Clayton's Case model)
  | 'LIFO' // Last-In First-Out
  | 'LOWEST_INTERMEDIATE'; // Minimum Traceable Balance (LIBR - equity tracing)

export interface FraudOrigin {
  originId: string;
  caseId: string;
  initialTransactionId: string;
  victimAccountId: string;
  victimInstitutionId: InstitutionId;
  disputedAmount: number;
  currency: Currency;
  reportedAt: string;
  narrative: string;
}

export interface CaseEvidence {
  evidenceId: string;
  type: 'TRANSACTION_RECEIPT' | 'PROVENANCE_TRACE' | 'HASH_CHAIN_PROOF' | 'BENCHMARK_VERIFICATION';
  description: string;
  data: Record<string, unknown>;
  timestamp: string;
  signedBy: string;
}

export interface InvestigationCase {
  id: string; // e.g. CASE-2026-00041
  title: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'LIEN_ISSUED' | 'RECOVERED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  leadInvestigator: string;
  fraudOrigin: FraudOrigin;
  disputedValue: number;
  currentAttributedValue: number;
  recoveredValue: number;
  involvedInstitutions: InstitutionId[];
  involvedAccountIds: string[];
  involvedTransactionIds: string[];
  traceDepth: number;
  evidence: CaseEvidence[];
  notes: string[];
}

export type SecurityRole =
  | 'BANK_ANALYST'
  | 'BANK_MANAGER'
  | 'INVESTIGATOR'
  | 'REGULATOR'
  | 'ADMIN';

export interface UserSecurityContext {
  userId: string;
  username: string;
  role: SecurityRole;
  institutionId?: InstitutionId; // Null for central investigators/regulators
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  activeCaseId?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: SecurityRole;
  institutionId?: InstitutionId;
  action:
    | 'USER_LOGIN'
    | 'USER_VIEWED_CASE'
    | 'USER_VIEWED_TRANSACTION'
    | 'TRACE_EXECUTED'
    | 'CASE_CREATED'
    | 'CASE_UPDATED'
    | 'RECOMMEND_LIEN'
    | 'APPROVE_LIEN'
    | 'INJECT_ATTACK'
    | 'TAMPER_LEDGER'
    | 'EXPORT_REPORT'
    | 'RUN_BENCHMARK';
  resourceId: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  reason?: string;
  clientIp: string;
  previousEventHash: string;
  eventHash: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'VICTIM' | 'MULE' | 'LAYER_2' | 'LAYER_3' | 'MERCHANT' | 'LEGITIMATE';
  institutionId: InstitutionId;
  totalBalance: number;
  cleanValue: number;
  taintedValue: number;
  taintPercentage: number;
  status: Account['status'];
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  taintedValue: number;
  cleanValue: number;
  taintPercentage: number;
  timestamp: string;
  channel: Channel;
  transactionId: string;
  isFraudOrigin?: boolean;
}
