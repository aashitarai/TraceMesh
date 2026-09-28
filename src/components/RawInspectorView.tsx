/**
 * TraceMesh 3-Layer Transaction Inspector
 * Demonstrates the separation between:
 * Layer 1: Raw Financial Message (ISO 20022 pacs.008 XML / Legacy JSON) + SHA-256 Hash
 * Layer 2: Canonical Transaction Model
 * Layer 3: TraceMesh Value Provenance & Analytical Metadata
 */

import React, { useState } from 'react';
import { Database, FileCode, CheckCircle, Hash, Copy, Check } from 'lucide-react';
import { EnrichedTransaction } from '../types';

interface RawInspectorViewProps {
  transactions: EnrichedTransaction[];
}

export const RawInspectorView: React.FC<RawInspectorViewProps> = ({ transactions }) => {
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.canonical.transactionId || '');
  const [copiedLayer, setCopiedLayer] = useState<number | null>(null);

  const selectedTx = transactions.find((t) => t.canonical.transactionId === selectedTxId) || transactions[0];

  const handleCopy = (text: string, layerNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLayer(layerNum);
    setTimeout(() => setCopiedLayer(null), 1500);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6">
      {/* Header & Transaction Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            3-Layer Financial Transaction Inspector
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Strict separation of raw message archival, normalized core banking schema, and TraceMesh analytical state.
          </p>
        </div>

        {/* Transaction Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-mono">Select Transaction:</span>
          <select
            value={selectedTxId}
            onChange={(e) => setSelectedTxId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none"
          >
            {transactions.map((t) => (
              <option key={t.canonical.transactionId} value={t.canonical.transactionId}>
                {t.canonical.transactionId} — ₹{t.canonical.amount.toLocaleString('en-IN')} (
                {t.analytical.isFraudOrigin ? 'Origin Theft' : `Hop ${t.analytical.upstreamHops}`})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Column Display of Layers */}
      {selectedTx ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer 1: Raw Financial Message */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                  L1
                </span>
                <div>
                  <h3 className="font-bold text-white text-xs">Raw Ingestion Message</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{selectedTx.raw.messageType}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(selectedTx.raw.rawPayload, 1)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Raw XML"
              >
                {copiedLayer === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* SHA-256 Hash of Raw Message */}
            <div className="mb-3 p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all flex items-start gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>SHA-256: {selectedTx.raw.tamperHash}</span>
            </div>

            {/* Raw XML/JSON View */}
            <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-auto font-mono text-[11px] text-emerald-300 leading-relaxed">
              <pre>{selectedTx.raw.rawPayload}</pre>
            </div>
          </div>

          {/* Layer 2: Canonical Transaction Model */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
                  L2
                </span>
                <div>
                  <h3 className="font-bold text-white text-xs">Canonical Model</h3>
                  <div className="text-[10px] text-slate-400 font-mono">Standardized Inter-Bank Schema</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(selectedTx.canonical, null, 2), 2)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Canonical JSON"
              >
                {copiedLayer === 2 ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Block Hash Pointer */}
            <div className="mb-3 p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all flex items-start gap-1.5">
              <Hash className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>Block #{selectedTx.ledgerIndex} Hash: {selectedTx.blockHash.substring(0, 32)}...</span>
            </div>

            {/* Normalized Fields */}
            <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-auto font-mono text-[11px] text-sky-300 leading-relaxed">
              <pre>{JSON.stringify(selectedTx.canonical, null, 2)}</pre>
            </div>
          </div>

          {/* Layer 3: TraceMesh Analytical Metadata */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                  L3
                </span>
                <div>
                  <h3 className="font-bold text-white text-xs">TraceMesh Forensic Layer</h3>
                  <div className="text-[10px] text-slate-400 font-mono">Disputed Value Provenance</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(selectedTx.analytical, null, 2), 3)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Analytical JSON"
              >
                {copiedLayer === 3 ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Analytical Metadata Summary */}
            <div className="mb-3 p-3 bg-gradient-to-br from-amber-950/40 to-slate-950 rounded-lg border border-amber-500/30 font-mono space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Tainted Value:</span>
                <span className="text-rose-400 font-bold">
                  ₹{selectedTx.analytical.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Clean Value:</span>
                <span className="text-emerald-400 font-bold">
                  ₹{selectedTx.analytical.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Taint Contamination:</span>
                <span className="text-amber-300 font-bold">{selectedTx.analytical.taintPercentage}%</span>
              </div>
            </div>

            {/* Analytical JSON */}
            <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-auto font-mono text-[11px] text-amber-300 leading-relaxed">
              <pre>{JSON.stringify(selectedTx.analytical, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
