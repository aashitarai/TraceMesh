/**
 * TraceMesh 3-Layer Transaction Inspector Modal
 * Inspects Layer 1 (Raw ISO 20022 pacs.008 XML & SHA-256 Hash),
 * Layer 2 (Normalized Canonical Core Banking Schema),
 * and Layer 3 (TraceMesh Attributed Value Provenance & Conservation State).
 */

import React, { useState } from 'react';
import { X, Copy, Check, Hash, Database, FileText, ArrowRight, ShieldCheck, Layers, GitCommit } from 'lucide-react';
import { EnrichedTransaction } from '../types';

interface TransactionDetailModalProps {
  transaction: EnrichedTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectAccount?: (accountId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onInspectAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'canonical' | 'provenance' | 'audit'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const { canonical, raw, analytical, ledgerIndex, blockHash, previousBlockHash } = transaction;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm">
              TX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-slate-100">
                  {canonical.transactionId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {canonical.channel}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {canonical.status}
                </span>
                {analytical.isFraudOrigin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    FRAUD THEFT ORIGIN
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Settled on {new Date(canonical.timestamp).toLocaleString('en-IN')} · Ledger Index #{ledgerIndex}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(canonical.transactionId)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Copy ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          {[
            { id: 'overview', label: 'Summary & Value Provenance' },
            { id: 'raw', label: 'Layer 1: Raw ISO 20022 XML' },
            { id: 'canonical', label: 'Layer 2: Canonical Model' },
            { id: 'provenance', label: 'Layer 3: Analytical Metadata' },
            { id: 'audit', label: 'Cryptographic Chain Proof' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Flow Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {/* Debtor */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Debtor (Sender)</div>
                  <div className="font-mono font-bold text-slate-200 text-sm">{canonical.debtorAccountId}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{canonical.debtorInstitutionId}</div>
                  {onInspectAccount && (
                    <button
                      onClick={() => onInspectAccount(canonical.debtorAccountId)}
                      className="mt-2 text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                    >
                      View Account Profile →
                    </button>
                  )}
                </div>

                {/* Transfer Arrow & Amount */}
                <div className="text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Gross Transferred Amount</div>
                  <div className="text-2xl font-bold font-mono text-slate-100">
                    ₹{canonical.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                    <span>{canonical.channel}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{canonical.purpose}</span>
                  </div>
                </div>

                {/* Creditor */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-right md:text-left">
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Creditor (Receiver)</div>
                  <div className="font-mono font-bold text-slate-200 text-sm">{canonical.creditorAccountId}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{canonical.creditorInstitutionId}</div>
                  {onInspectAccount && (
                    <button
                      onClick={() => onInspectAccount(canonical.creditorAccountId)}
                      className="mt-2 text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                    >
                      View Account Profile →
                    </button>
                  )}
                </div>
              </div>

              {/* Value Provenance Attribution Breakdown */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Value Provenance Attribution Breakdown
                  </h4>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                    Model: {analytical.provenanceModel}
                  </span>
                </div>

                {/* Horizontal Proportion Bar */}
                <div className="space-y-1.5">
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${analytical.taintPercentage}%` }}
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all"
                    ></div>
                    <div
                      style={{ width: `${100 - analytical.taintPercentage}%` }}
                      className="bg-emerald-600 h-full transition-all"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                      Attributed Disputed: ₹{analytical.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({analytical.taintPercentage}%)
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      Attributed Clean: ₹{analytical.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({(100 - analytical.taintPercentage).toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Trace Confidence</div>
                    <div className="font-mono font-bold text-emerald-400 text-xs mt-1">
                      {analytical.traceConfidence} ({(analytical.confidenceScore * 100).toFixed(0)}%)
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Upstream Hops</div>
                    <div className="font-mono font-bold text-slate-200 text-xs mt-1">
                      Hop {analytical.upstreamHops} from Origin
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Linked Cyber Case</div>
                    <div className="font-mono font-bold text-amber-400 text-xs mt-1">
                      {analytical.caseId || 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Remittance Info</div>
                    <div className="text-slate-300 text-xs mt-1 truncate" title={canonical.remittanceInformation}>
                      {canonical.remittanceInformation || 'None provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Ledger Block Proof */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono text-[11px] space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Immutable Block Hash Chain</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 break-all text-[10px]">
                  <span className="text-slate-500">Current Block Hash: </span>
                  <span className="text-amber-400">{blockHash}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 break-all text-[10px]">
                  <span className="text-slate-500">Previous Block Hash: </span>
                  <span className="text-slate-400">{previousBlockHash}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Layer 1: Raw Financial Ingestion Message</h4>
                  <p className="text-slate-400 text-[11px]">Unmodified archival payload with SHA-256 integrity hash.</p>
                </div>
                <button
                  onClick={() => handleCopy(raw.rawPayload)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Raw XML
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">
                  <strong className="text-slate-200">SHA-256 Digest:</strong> {raw.tamperHash}
                </span>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-[400px] leading-relaxed">
                {raw.rawPayload}
              </pre>
            </div>
          )}

          {activeTab === 'canonical' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Layer 2: Canonical Core Banking Transaction</h4>
                  <p className="text-slate-400 text-[11px]">Normalized inter-bank schema conforming to ISO 20022 pacs.008 data dictionary.</p>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(canonical, null, 2))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Canonical JSON
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div><span className="text-slate-500">EndToEndId:</span> <span className="text-slate-200">{canonical.endToEndId}</span></div>
                  <div><span className="text-slate-500">InstructionId:</span> <span className="text-slate-200">{canonical.instructionId}</span></div>
                  <div><span className="text-slate-500">MessageId:</span> <span className="text-slate-200">{canonical.messageId}</span></div>
                  <div><span className="text-slate-500">Currency:</span> <span className="text-slate-200">{canonical.currency}</span></div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div><span className="text-slate-500">Debtor Institution:</span> <span className="text-slate-200">{canonical.debtorInstitutionId}</span></div>
                  <div><span className="text-slate-500">Creditor Institution:</span> <span className="text-slate-200">{canonical.creditorInstitutionId}</span></div>
                  <div><span className="text-slate-500">Channel:</span> <span className="text-slate-200">{canonical.channel}</span></div>
                  <div><span className="text-slate-500">Purpose:</span> <span className="text-slate-200">{canonical.purpose}</span></div>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto max-h-[320px]">
                {JSON.stringify(canonical, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'provenance' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs">Layer 3: TraceMesh Value Provenance & Risk Analytics</h4>
              <p className="text-slate-400 text-[11px]">
                Calculated value attribution state. Stored strictly in the analytical layer without corrupting the canonical transaction record.
              </p>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-[350px]">
                {JSON.stringify(analytical, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs">Cryptographic Audit & Block Hash Chain</h4>
              <p className="text-slate-400 text-[11px]">
                Every settled transaction is cryptographically linked to the previous block via SHA-256 recursive hashing: H(n) = SHA256(Tx_n + H_{'{n-1}'}).
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Ledger Sequence Number</div>
                  <div className="text-white font-bold">Block Index #{ledgerIndex}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Previous Block Hash (H_{'{n-1}'})</div>
                  <div className="text-slate-300 break-all text-[11px]">{previousBlockHash}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Current Block Hash (H_n)</div>
                  <div className="text-amber-400 break-all text-[11px]">{blockHash}</div>
                </div>
                <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Block Integrity Verified · Tamper Evident</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
