/**
 * TraceMesh Interactive Story Hero & Architectural Problem Showcase
 * Rich animated scroll-friendly explainer demonstrating the exact problem
 * of commingling and how TraceMesh resolves it compared to legacy banking tools.
 */

import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Scale,
  Zap,
  Building,
  UploadCloud,
  Play,
} from 'lucide-react';

interface HeroStorySectionProps {
  onStartTour: () => void;
  onOpenPitchDeck: () => void;
  onOpenDataUpload: () => void;
  onJumpToTab: (tabId: string) => void;
}

export const HeroStorySection: React.FC<HeroStorySectionProps> = ({
  onStartTour,
  onOpenPitchDeck,
  onOpenDataUpload,
  onJumpToTab,
}) => {
  return (
    <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Hero Pitch */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Next-Gen Financial Crime Provenance Layer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              We follow the money — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                even after it gets mixed.
              </span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              When stolen funds enter an account and blend with legitimate salaries and vendor payments, traditional AML systems either freeze 100% of innocent funds or lose the trace entirely. TraceMesh provides <strong>mathematically defensible, value-conserving provenance</strong> to place surgical statutory liens on the exact stolen amounts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartTour}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Audio-Narrated Interactive Tour
              </button>

              <button
                onClick={onOpenPitchDeck}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                View Executive Pitch Deck
              </button>

              <button
                onClick={onOpenDataUpload}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-sky-400" />
                Upload & Ingest Custom Data
              </button>
            </div>
          </div>

          {/* Interactive Visual Counter Comparison Card */}
          <div className="w-full lg:w-[420px] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 uppercase text-[10px] font-bold">The Commingling Breakdown</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/30">
                Active Theft Case
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Victim Origin Theft:</span>
                <span className="text-rose-400 font-black text-sm">₹2,00,000.00</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Mule A Pre-existing Clean:</span>
                <span className="text-emerald-400 font-bold text-sm">₹5,00,000.00</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/40">
                <span className="text-amber-200">Mule A Commingled Balance:</span>
                <span className="text-amber-300 font-black text-sm">₹7,00,000.00 (28.57% Taint)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-sans text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>Value Conservation (Δ):</span>
                <strong className="text-emerald-400 font-mono">₹0.00 (100% Conserved)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Downstream Hops Reconstructed:</span>
                <strong className="text-sky-300 font-mono">5 Accounts Across 4 Banks</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div
            onClick={() => onJumpToTab('investigator')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Value Conservation Engine</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Unlike arbitrary AI scores, TraceMesh enforces strict double-entry partitioned accounting (B = Clean + Tainted) with zero leaked funds.
            </p>
          </div>

          <div
            onClick={() => onJumpToTab('bank_ops')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/50 cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Surgical Partial Liens</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Banks freeze only the calculated stolen proportion, preventing wrongful 100% freezes, bounced vendor cheques, and customer lawsuits.
            </p>
          </div>

          <div
            onClick={() => onJumpToTab('raw_inspector')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">ISO 20022 Enterprise Ready</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Ingests raw pacs.008 XML payment messages with SHA-256 tamper-evident hash chaining for full evidentiary admissibility in court.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
