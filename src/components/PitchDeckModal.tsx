/**
 * TraceMesh Master Investor & Regulatory Executive Pitch Deck
 * Concise, high-impact presentation explaining the commingling problem,
 * why traditional AML fails, our mathematical solution, bank integration, and commercial model.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  TrendingDown,
  Layers,
  CheckCircle,
  Building,
  Target,
  DollarSign,
  Scale,
  Zap,
  ArrowRight,
  Download,
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInteractiveDemo: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
  onStartInteractiveDemo,
}) => {
  const [slide, setSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'TraceMesh: Following Money Even After It Gets Mixed',
      subtitle: 'The Value-Conserving Financial Crime Provenance Layer for Modern Banking',
      badge: 'Executive Summary',
      content: (
        <div className="space-y-4 text-slate-300">
          <p className="text-sm leading-relaxed">
            In modern financial fraud and cyber crime, stolen funds do not move in neat, isolated channels.
            They are rapidly split and deposited into bank accounts that already contain legitimate money—commingled
            with salaries, vendor payments, and savings across multiple bank hops within seconds.
          </p>
          <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-1">
              <div className="text-rose-400 font-bold uppercase text-[10px]">The Industry Blindspot</div>
              <div className="text-white font-bold text-sm">Traditional AML Fails on Commingled Money</div>
              <p className="text-slate-400 text-xs font-sans mt-1">
                Legacy systems produce binary suspicion flags ("Account is 90% risky"). When banks freeze an account, they freeze 100% of it, causing catastrophic innocent cheque bounces and lawsuits.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
              <div className="text-emerald-400 font-bold uppercase text-[10px]">The TraceMesh Solution</div>
              <div className="text-white font-bold text-sm">Value-Level Provenance (B = Clean + Tainted)</div>
              <p className="text-slate-400 text-xs font-sans mt-1">
                We track the actual rupees downstream using mathematically proven pro-rata attribution with 100% value conservation. Banks execute surgical partial liens on exact stolen values without freezing clean money.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'The ₹2,00,000 Commingling Dilemma',
      subtitle: 'How Traditional Systems Create Massive Collateral Damage',
      badge: 'The Core Problem',
      content: (
        <div className="space-y-4 text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-amber-400 font-bold text-sm">Case Scenario: Mule Account A at HDFC Bank</div>
            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="p-2 rounded bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] text-slate-400">Pre-existing Clean Funds</div>
                <div className="text-emerald-400 font-bold text-sm">₹5,00,000</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-rose-500/30">
                <div className="text-[10px] text-slate-400">Disputed Victim Wire</div>
                <div className="text-rose-400 font-bold text-sm">₹2,00,000</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-amber-500/30">
                <div className="text-[10px] text-slate-400">Post-Theft Balance</div>
                <div className="text-amber-300 font-bold text-sm">₹7,00,000 (Taint 28.57%)</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-sans">
              Mule A transfers ₹1.5L to Mule B, ₹1L to Mule C, who then transfer to Mule D and a merchant terminal.
              Under traditional policing, all 5 accounts are 100% frozen, locking up over ₹18 Lakhs of innocent payroll and merchant capital.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Our Differentiator: Conservation-Aware Value Engine',
      subtitle: 'Double-Entry Partitioned Balances & Global Rupee Reconciliation',
      badge: 'Defensible Mathematics',
      content: (
        <div className="space-y-4 text-slate-300">
          <p className="text-sm">
            TraceMesh is not another AI black-box or generic graph dashboard. We built an enterprise accounting
            provenance engine that guarantees:
          </p>
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Scale className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-white font-bold">100% Value Conservation</div>
              <div className="text-slate-400 text-[11px] mt-1 font-sans">
                Sum of injected disputed value strictly equals remaining value plus terminal outflows (Δ = ₹0.00).
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Zap className="w-5 h-5 text-sky-400 mb-2" />
              <div className="text-white font-bold">Surgical Partial Liens</div>
              <div className="text-slate-400 text-[11px] mt-1 font-sans">
                Banks place targeted debit freezes solely on the calculated tainted value, leaving clean capital untouched.
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Shield className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-white font-bold">Evidentiary Admissibility</div>
              <div className="text-slate-400 text-[11px] mt-1 font-sans">
                Immutable SHA-256 hash chains provide mathematical proofs admissible in court under IT Act § 65B.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Architecture & Ecosystem Fit',
      subtitle: 'Plugs directly into Core Banking Systems & NPCI / I4C Workflows',
      badge: 'Enterprise Integration',
      content: (
        <div className="space-y-3 text-slate-300">
          <p className="text-xs">
            TraceMesh is designed to sit alongside existing bank architectures without requiring costly core system replacements:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Native ISO 20022 Ingestion</span>
            </div>
            <p className="text-slate-400 text-xs font-sans pl-6">
              Ingests raw pacs.008 XML payment messages, normalizes to canonical schemas, and stores SHA-256 tamper-evident receipts.
            </p>

            <div className="flex items-center gap-2 text-sky-400 font-bold pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>Maker-Checker Bank Ops Integration</span>
            </div>
            <p className="text-slate-400 text-xs font-sans pl-6">
              Dual-key authorization workflow ensures statutory liens cannot be executed without human compliance sign-off.
            </p>

            <div className="flex items-center gap-2 text-purple-400 font-bold pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <p className="text-slate-400 text-xs font-sans pl-6">
              Regulator and inter-bank feeds expose zero customer PII—only anonymized tokenized flows and aggregate exposure metrics.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono">
              TM
            </span>
            <div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold uppercase">
                {currentSlide.badge}
              </span>
              <h3 className="font-extrabold text-white text-base mt-0.5">{currentSlide.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Close Deck
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs text-amber-400 font-medium">{currentSlide.subtitle}</div>
          {currentSlide.content}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? 'w-6 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {slide > 0 && (
              <button
                onClick={() => setSlide(slide - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Previous
              </button>
            )}

            {slide < slides.length - 1 ? (
              <button
                onClick={() => setSlide(slide + 1)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Next Slide
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onStartInteractiveDemo();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Live Interactive Tour
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
