/**
 * TraceMesh Master System Architecture, Novelty Analysis & Engineering Specification
 * Production Architecture & System Specification Dossier (Sections A through M)
 */

import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Database,
  Cpu,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Code2,
  GitBranch,
  BookOpen,
} from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('novelty');

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-slate-950 text-xs">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/80 p-4 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Architecture Dossier
        </div>

        {[
          { id: 'novelty', label: '1. Novelty & Prior Art Truth' },
          { id: 'math', label: '2. Provenance Mathematics' },
          { id: 'arch', label: '3. System Architecture (A)' },
          { id: 'datamodel', label: '4. Data Model & Schema (B)' },
          { id: 'apis', label: '5. API Specification (C)' },
          { id: 'eventflow', label: '6. Event Pipeline (E)' },
          { id: 'security', label: '7. Zero-Trust Security (F & G)' },
          { id: 'india', label: '8. Indian Ecosystem Alignment' },
          { id: 'legal', label: '9. Legal & Jurisprudential Limits' },
          { id: 'production', label: '10. Production Migration (L & M)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all text-xs flex items-center justify-between ${
              activeSection === item.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Documentation Viewer */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 font-sans max-w-5xl leading-relaxed">
        {/* Section 1: Novelty & Brutal Honesty */}
        {activeSection === 'novelty' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-amber-400 font-mono text-[10px] uppercase font-bold">
                Intellectual Honesty & Differentiation
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                1. Novelty Analysis & Prior Art Assessment
              </h2>
            </div>

            <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2 text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                What TraceMesh Did NOT Invent (Prior Art Acknowledged)
              </div>
              <p>
                To maintain senior engineering rigor, we state unequivocally what already exists in production and open-source:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                <li>
                  <strong className="text-slate-200">ISO 20022 message ingestion & adapters:</strong> Already fully solved by{' '}
                  <strong className="text-slate-200">Tazama TMS</strong> (Linux Foundation open-source payment monitoring stack).
                </li>
                <li>
                  <strong className="text-slate-200">Graph-based mule account detection:</strong> Already explored extensively in academic literature and GNN models (e.g. Ashutosh Anand Mehta’s GNN mule detector, Mule Hunter engine).
                </li>
                <li>
                  <strong className="text-slate-200">Financial data sharing & consent schemas:</strong> Standardized in India by{' '}
                  <strong className="text-slate-200">Sahamati Account Aggregator ecosystem & ReBIT</strong>.
                </li>
                <li>
                  <strong className="text-slate-200">RBAC, OIDC, Keycloak & Audit logs:</strong> Standard enterprise patterns.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                What TraceMesh Genuinely Contributes (The True Novelty)
              </div>
              <p className="text-slate-300">
                Traditional AML and transaction monitoring systems only answer:{' '}
                <em className="text-rose-400">"Is this downstream account suspicious?"</em> (producing a binary 0/1 flag or arbitrary risk score). When an investigator freezes that account, they freeze 100% of the balance, causing catastrophic collateral damage to innocent merchants, payrolls, and clean funds.
              </p>
              <p className="text-slate-300 font-semibold">
                TraceMesh solves the fundamentally harder problem:
              </p>
              <blockquote className="border-l-2 border-emerald-400 pl-4 py-1 text-emerald-300 font-mono text-sm bg-slate-900/80 rounded-r-lg">
                "After disputed stolen funds enter an account and mix with legitimate clean deposits across multiple hops, exactly how much of the downstream value remains attributable to the original theft under strict value-conserving mathematics?"
              </blockquote>
              <p className="text-slate-400">
                TraceMesh provides mathematical, double-entry value attribution (B = Clean + Tainted) with guaranteed global value conservation (Σ Taint_In = Σ Taint_Remaining + Σ Taint_Outgoing), enabling surgical statutory partial liens instead of indiscriminate commercial disruption.
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Provenance Mathematics */}
        {activeSection === 'math' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-sky-400 font-mono text-[10px] uppercase font-bold">Mathematical Rigor</span>
              <h2 className="text-xl font-black text-white mt-1">
                2. Fundamental Accounting & Provenance Engine Derivations
              </h2>
            </div>

            <div className="space-y-4 text-slate-300">
              <p>
                Every account state in TraceMesh is modeled as a partitioned balance:
              </p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-sm space-y-1">
                <div className="text-amber-300">Balance: B = Clean_Value (C) + Tainted_Value (T)</div>
                <div className="text-slate-400 text-xs">Taint_Ratio: r = T / B (where B &gt; 0, else 0)</div>
                <div className="text-slate-400 text-xs">Taint_Percentage: P = r × 100%</div>
              </div>

              <h3 className="font-bold text-white text-sm mt-4">Model A: Proportional / Pro-Rata Commingling Theorem</h3>
              <p className="text-slate-400">
                When an account transfers amount $X$ downstream to creditor:
              </p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                <div>Outgoing Tainted: <span className="text-rose-400 font-bold">T_out = X × (T / B)</span></div>
                <div>Outgoing Clean: <span className="text-emerald-400 font-bold">C_out = X - T_out</span></div>
                <div className="pt-2 border-t border-slate-800 text-slate-400">
                  New Debtor State: T_new = T - T_out, C_new = C - C_out
                </div>
                <div className="text-slate-400">
                  New Creditor State: T_cred_new = T_cred + T_out, C_cred_new = C_cred + C_out
                </div>
              </div>

              <div className="p-4 bg-sky-950/20 border border-sky-500/30 rounded-xl space-y-2">
                <h4 className="font-bold text-sky-300 text-xs">Value Conservation Theorem</h4>
                <p className="text-slate-400 text-xs">
                  Let A be the set of all accounts in the ecosystem, and E be the set of terminal exit transfers. For any injected theft origin amount V_fraud:
                </p>
                <div className="font-mono text-sky-200 text-sm text-center py-2 bg-slate-900 rounded-lg">
                  V_fraud = Σ (Tainted_Account) + Σ (Tainted_Terminal_Exit)   (Δ ≡ 0.00)
                </div>
                <p className="text-slate-400 text-xs">
                  Value cannot be created ex nihilo or silently destroyed. Every rupee of victim value is accounted for in double-entry ledger state.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: System Architecture */}
        {activeSection === 'arch' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">
                Enterprise Blueprint
              </span>
              <h2 className="text-xl font-black text-white mt-1">3. System Architecture Specification (Section A)</h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-normal overflow-x-auto">
              <pre>{`
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 PARTICIPATING FINANCIAL INSTITUTIONS                   │
  │    SBI (Public Sector)   HDFC (Private)   ICICI (Private)   Axis       │
  └───────────────────┬───────────────────────────────┬────────────────────┘
                      │ ISO 20022 (pacs.008)          │ Legacy JSON / CSV
                      ▼                               ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                        INGESTION ADAPTER LAYER                         │
  │   - pacs.008 XML Parser               - Legacy REST Adapter            │
  │   - SHA-256 Raw Archival              - Batch Settlement Parser        │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │ Normalized Canonical Model
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 CANONICAL TRANSACTION NORMALIZATION LAYER              │
  │   - EndToEndId / InstructionId Validation                              │
  │   - Zero-Trust Input Sanitizer (Remittance Prompt Injection Quarantine) │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
  │ DOUBLE-ENTRY     │      │ TRACEMESH VALUE  │      │ CRYPTOGRAPHIC    │
  │ LEDGER STATE     │      │ PROVENANCE       │      │ BLOCK HASH CHAIN │
  │ - Clean / Tainted│◄────►│ - Pro-Rata       │◄────►│ H_n = SHA256     │
  │ - Double balance │      │ - Conservation   │      │   (Tx + H_n-1)   │
  └──────────────────┘      └─────────┬────────┘      └──────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 CASE RECONSTRUCTION & GRAPH ENGINE                     │
  │   - Multi-Hop Dynamic DAG Projection                                  │
  │   - Upstream Origin Tracing & Downstream Exposure Attribution          │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
      ┌───────────────────────────────┼───────────────────────────────┐
      ▼                               ▼                               ▼
┌──────────────┐             ┌──────────────────┐            ┌──────────────────┐
│ BANK OPS UI  │             │ INVESTIGATOR UI  │            │ REGULATOR UI     │
│ (Tenant-     │             │ (Statutory Cross-│            │ (Macro Ecosystem,│
│  Isolated)   │             │  Bank Evidence)  │            │  Zero PII)       │
└──────────────┘             └──────────────────┘            └──────────────────┘
              `}</pre>
            </div>
          </div>
        )}

        {/* Section 4: Data Model */}
        {activeSection === 'datamodel' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-purple-400 font-mono text-[10px] uppercase font-bold">Relational Schema</span>
              <h2 className="text-xl font-black text-white mt-1">4. Data Model & Entity Schema (Section B)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold">accounts (Immutable Balance Ledger)</div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <div>id: UUID (PK)</div>
                  <div>customer_id: UUID (FK)</div>
                  <div>institution_id: VARCHAR(11) (BIC)</div>
                  <div>total_balance: NUMERIC(18, 4)</div>
                  <div>clean_value: NUMERIC(18, 4)</div>
                  <div>tainted_value: NUMERIC(18, 4)</div>
                  <div>taint_percentage: NUMERIC(5, 2)</div>
                  <div>status: ENUM('ACTIVE', 'FLAGGED', 'PARTIAL_LIEN', 'FROZEN')</div>
                  <div>active_lien_amount: NUMERIC(18, 4)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-sky-400 font-bold">transactions_canonical (Layer 2)</div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <div>transaction_id: VARCHAR(64) (PK)</div>
                  <div>message_id: VARCHAR(64)</div>
                  <div>timestamp: TIMESTAMPTZ</div>
                  <div>amount: NUMERIC(18, 4)</div>
                  <div>currency: VARCHAR(3)</div>
                  <div>debtor_account_id: UUID (FK)</div>
                  <div>creditor_account_id: UUID (FK)</div>
                  <div>channel: ENUM('UPI', 'IMPS', 'NEFT', 'RTGS')</div>
                  <div>remittance_text: TEXT (Untrusted)</div>
                  <div>block_hash: CHAR(64)</div>
                  <div>prev_block_hash: CHAR(64)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold">transaction_provenance (Layer 3)</div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <div>transaction_id: VARCHAR(64) (FK)</div>
                  <div>tainted_value: NUMERIC(18, 4)</div>
                  <div>clean_value: NUMERIC(18, 4)</div>
                  <div>taint_percentage: NUMERIC(5, 2)</div>
                  <div>is_fraud_origin: BOOLEAN</div>
                  <div>case_id: VARCHAR(32) (FK)</div>
                  <div>trace_confidence: ENUM('CONFIRMED', 'HIGH', 'PROBABLE')</div>
                  <div>provenance_model: VARCHAR(20)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-rose-400 font-bold">audit_events (Tamper-Evident SIEM)</div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <div>id: BIGINT (PK)</div>
                  <div>timestamp: TIMESTAMPTZ</div>
                  <div>actor_id: VARCHAR(64)</div>
                  <div>role: VARCHAR(32)</div>
                  <div>institution_id: VARCHAR(11)</div>
                  <div>action: VARCHAR(64)</div>
                  <div>resource_id: VARCHAR(128)</div>
                  <div>event_hash: CHAR(64)</div>
                  <div>prev_event_hash: CHAR(64)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: API Specification */}
        {activeSection === 'apis' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-amber-400 font-mono text-[10px] uppercase font-bold">REST & ISO Endpoints</span>
              <h2 className="text-xl font-black text-white mt-1">5. API Specification (Section C)</h2>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
                  <span className="text-white font-bold">/v1/messages/iso20022</span>
                </div>
                <p className="text-slate-400 font-sans text-xs">
                  Ingests raw ISO 20022 pacs.008 XML message from participating bank clearing gateways.
                </p>
                <div className="text-[11px] text-slate-500">
                  Headers: Authorization: Bearer &lt;JWT&gt;, X-Institution-ID: HDFCINBB, X-Signature: &lt;mTLS/HMAC&gt;
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                  <span className="text-white font-bold">/v1/cases/&#123;case_id&#125;/graph</span>
                </div>
                <p className="text-slate-400 font-sans text-xs">
                  Returns authorized multi-hop DAG with node balances, edge amounts, and exact tainted value attributions.
                </p>
                <div className="text-[11px] text-slate-500">
                  Authorization Policy: Requires role in ['INVESTIGATOR', 'REGULATOR'].
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">POST</span>
                  <span className="text-white font-bold">/v1/cases/&#123;case_id&#125;/liens</span>
                </div>
                <p className="text-slate-400 font-sans text-xs">
                  Executes maker-checker dual verification workflow to issue statutory partial lien on target account.
                </p>
                <div className="text-[11px] text-slate-500">
                  Payload: &#123; target_account: string, amount: number, justification: string, maker_sign: string, checker_sign: string &#125;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Event Flow */}
        {activeSection === 'eventflow' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-orange-400 font-mono text-[10px] uppercase font-bold">Lifecycle</span>
              <h2 className="text-xl font-black text-white mt-1">6. End-to-End Event Flow (Section E)</h2>
            </div>

            <ol className="list-decimal list-inside space-y-3 text-slate-300">
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Bank Payment Initiation:</strong> Customer initiates transfer via UPI / IMPS. Debtor Core Banking System publishes pacs.008 payment message.
              </li>
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Adapter Ingestion:</strong> TraceMesh Bank Adapter captures XML payload, records SHA-256 hash in raw immutable vault, and normalizes into Canonical Transaction.
              </li>
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Value Attribution Engine:</strong> Evaluates debtor's existing clean and tainted balance under selected provenance model (e.g. Pro-Rata). Computes exact outgoing tainted split.
              </li>
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Ledger State Update & Chaining:</strong> Updates double-entry balances for debtor and creditor. Generates block hash pointer ($H_n$).
              </li>
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Case Graph Projection:</strong> Updates live investigation case DAG. If creditor is a new hop, issues automated alert to participating bank's operations desk.
              </li>
              <li className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white">Surgical Lien Placement:</strong> Bank Manager executes maker-checker verification to place targeted partial lien, preserving innocent customer deposits.
              </li>
            </ol>
          </div>
        )}

        {/* Section 7: Security Architecture */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-rose-400 font-mono text-[10px] uppercase font-bold">Zero-Trust</span>
              <h2 className="text-xl font-black text-white mt-1">7. Zero-Trust Security & Threat Model (Sections F & G)</h2>
            </div>

            <div className="space-y-4 text-slate-300">
              <h3 className="font-bold text-white text-sm">Authentication vs Authorization</h3>
              <p className="text-slate-400">
                Authentication identifies the actor via Keycloak OIDC JWT tokens. Authorization enforces strict Attribute-Based Access Control (ABAC) and Role-Based Access Control (RBAC). A Bank Analyst at HDFC possesses the BANK_ANALYST role, but their institution claim restricts them exclusively to accounts with <code>institution_id == 'HDFCINBB'</code>.
              </p>

              <h3 className="font-bold text-white text-sm mt-4">AI Safety & Tool Gateway Boundaries</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                <li><strong className="text-slate-200">Zero Direct Database Access:</strong> The AI Agent communicates exclusively through a sanitized Tool Gateway with allowlisted read functions.</li>
                <li><strong className="text-slate-200">Untrusted Input Quarantine:</strong> Remittance narratives and payment descriptions are treated as untrusted strings and isolated within strict delimiter blocks, stripping jailbreaks.</li>
                <li><strong className="text-slate-200">No Final Executive Authority:</strong> The AI cannot execute liens or freezing. It produces analytical advice; statutory action requires human maker-checker sign-off.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 8: Indian Ecosystem Alignment */}
        {activeSection === 'india' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-sky-400 font-mono text-[10px] uppercase font-bold">Regulatory Context</span>
              <h2 className="text-xl font-black text-white mt-1">8. Indian Ecosystem Alignment (Section 35)</h2>
            </div>

            <div className="space-y-4 text-slate-300">
              <p>
                TraceMesh does NOT claim to replace statutory Indian institutions (RBI, NPCI, I4C, CFCFRMS). Rather, it serves as a specialized analytical value-provenance layer:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold">I4C & CFCFRMS (1930 Portal)</div>
                  <p className="font-sans text-slate-400 text-xs">
                    Today, the Citizen Financial Cyber Fraud Reporting System alerts banks via ticket broadcast. TraceMesh integrates by calculating the exact down-stream value exposure at each bank, eliminating arbitrary whole-account freezes.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold">DPDP Act 2023 & Consent Architecture</div>
                  <p className="font-sans text-slate-400 text-xs">
                    TraceMesh complies with India’s Digital Personal Data Protection Act via pseudonymized customer tokens and zero-PII regulator views.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Legal Limitations */}
        {activeSection === 'legal' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-rose-400 font-mono text-[10px] uppercase font-bold">Jurisprudence</span>
              <h2 className="text-xl font-black text-white mt-1">9. Legal & Jurisprudential Limitations</h2>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-slate-300">
              <h3 className="font-bold text-white text-sm">Analytical Attribution vs Legal Determination of Ownership</h3>
              <p className="text-slate-400">
                TraceMesh computes <strong className="text-amber-300">analytical attribution</strong>, not self-executing judicial orders. In common law and Indian equity law (Indian Trusts Act, 1882 §§ 63-64):
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                <li>
                  <strong className="text-slate-200">Clayton’s Case (1816) (FIFO):</strong> Held that first money in is first money out. Criticized in modern commercial fraud cases and displaced by pro-rata or fiduciary dissipation rules.
                </li>
                <li>
                  <strong className="text-slate-200">In re Hallett’s Estate (1880) & In re Oatway (1903):</strong> Presumption of honesty: if a fraudster mixes illicit funds with clean funds and withdraws money for personal expenditure, equity presumes the fraudster dissipated their own clean money first.
                </li>
                <li>
                  <strong className="text-slate-200">Barlow Clowes (1992):</strong> Pari passu / pro-rata distribution applied when commingled funds belong to innocent victims.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 10: Production Migration */}
        {activeSection === 'production' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">Roadmap</span>
              <h2 className="text-xl font-black text-white mt-1">10. Production Deployment & Migration Plan</h2>
            </div>

            <div className="space-y-4 text-slate-300 font-mono text-xs">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold">Deployment Model A: Bank-Internal Sidecar Service</div>
                <p className="font-sans text-slate-400 text-xs">
                  Packaged as a high-throughput Go/C++ or Rust/Python sidecar deployed inside a bank’s private VPC, consuming ISO 20022 messages via Kafka/NATS with zero external cloud data egress.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-sky-400 font-bold">Deployment Model B: Central NPCI / I4C Inter-Bank Intelligence Gateway</div>
                <p className="font-sans text-slate-400 text-xs">
                  Federated mTLS nodes hosted at participating banks exchanging cryptographic trace tokens without exchanging raw customer identity data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
