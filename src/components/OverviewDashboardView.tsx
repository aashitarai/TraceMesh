/**
 * TraceMesh Modern Institutional Overview (Main Page UI)
 * 
 * Re-imagined with a high-end modern fintech color system:
 * - Obsidian Midnight Navy background (#070b14 / #0c1326)
 * - Luminous Electric Cyan & Cobalt (#06b6d4 / #3b82f6)
 * - Mint Emerald for Clean Protected Funds (#10b981 / #34d399)
 * - Coral Rose for Stolen/Disputed Funds (#f43f5e / #fb7185)
 * - Rich vector graphics illustrating the commingling vault, money stream split, and surgical freeze.
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Play,
  Eye,
  FileText,
  CreditCard,
  Building,
  Terminal,
  Cpu,
  RotateCcw,
  Check,
  AlertTriangle,
  Zap,
  TrendingDown,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { Account, EnrichedTransaction, InvestigationCase, ProvenanceModelType } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';
import { ledgerInstance } from '../core/ledger/ledger';

interface OverviewDashboardViewProps {
  accounts: Account[];
  transactions: EnrichedTransaction[];
  primaryCase: InvestigationCase | null;
  provenanceModel: ProvenanceModelType;
  onNavigateTab: (tabId: string) => void;
  onSelectTransaction: (txId: string) => void;
  onSelectAccount: (accountId: string) => void;
  onStartTour: () => void;
  onModelChange?: (model: ProvenanceModelType) => void;
  onRunDemoScenario?: () => void;
  onIssuePartialLien?: (accountId: string, amount: number) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  accounts,
  transactions,
  primaryCase,
  provenanceModel,
  onNavigateTab,
  onSelectTransaction,
  onSelectAccount,
  onStartTour,
}) => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const totalDisputed = primaryCase?.disputedValue || 200000;
  const cleanProtected = accounts.reduce((sum, a) => sum + a.cleanValue, 0);

  const steps = [
    {
      number: 1,
      title: 'The Crime',
      subtitle: '₹2,00,000 stolen from victim',
      details: 'Fraudulent IMPS transfer moves ₹2,00,000 from the victim at SBI into Mule Account A at HDFC Bank.',
      cleanDisplay: '₹0 Clean',
      stolenDisplay: '₹2,00,000 Stolen',
      cleanPct: 0,
      stolenPct: 100,
      badge: 'Step 1: Stolen Inflow',
      color: 'rose',
    },
    {
      number: 2,
      title: 'The Mix',
      subtitle: 'Mixed with ₹5,00,000 normal savings',
      details: 'Mule Account A already holds ₹5,00,000 clean money. Total balance becomes ₹7,00,000. TraceMesh isolates the exact split: 71.4% Clean, 28.6% Stolen.',
      cleanDisplay: '₹5,00,000 Clean',
      stolenDisplay: '₹2,00,000 Stolen',
      cleanPct: 71.4,
      stolenPct: 28.6,
      badge: 'Step 2: Commingling Vault',
      color: 'cyan',
    },
    {
      number: 3,
      title: 'The Transfer',
      subtitle: '₹1,50,000 sent to ICICI Bank',
      details: 'Mule A transfers ₹1,50,000 to Mule B. TraceMesh calculates that exactly ₹42,857 is stolen money and ₹1,07,143 is clean savings.',
      cleanDisplay: '₹1,07,143 Clean',
      stolenDisplay: '₹42,857 Stolen',
      cleanPct: 71.4,
      stolenPct: 28.6,
      badge: 'Step 3: Pro-Rata Split',
      color: 'indigo',
    },
    {
      number: 4,
      title: 'The Layering',
      subtitle: 'Cascade across SBI & Merchant POS',
      details: 'Funds split further across multiple accounts and merchant exits. TraceMesh conserves every single rupee with zero paise lost.',
      cleanDisplay: '₹10.9L Clean Preserved',
      stolenDisplay: '₹2.0L Disputed Tracked',
      cleanPct: 84,
      stolenPct: 16,
      badge: 'Step 4: Multi-Bank Trail',
      color: 'purple',
    },
    {
      number: 5,
      title: 'Smart Freeze',
      subtitle: 'Freeze crime, protect innocent money',
      details: 'Instead of freezing all ₹7,00,000 (which traps innocent money), the bank places a smart lien strictly on the ₹2,00,000 stolen funds.',
      cleanDisplay: '₹5,00,000 Unlocked & Safe',
      stolenDisplay: '₹2,00,000 Surgical Lien',
      cleanPct: 100,
      stolenPct: 0,
      badge: 'Step 5: Surgical Protection',
      color: 'emerald',
    },
  ];

  const currentStep = steps[activeStep - 1];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 text-xs font-sans text-slate-200">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER WITH MODERN GRAPHICS & VIBRANT FINTECH GRADIENTS           */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#09101f] to-[#060a14] border border-cyan-500/20 p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Pitch */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium text-xs shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Financial Crime Value Attribution Layer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              We follow stolen money — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                even after it gets mixed with normal savings.
              </span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              When stolen money enters an account with legitimate funds, traditional bank tools either freeze 100% of the account (trapping innocent savings) or lose the trail entirely. TraceMesh separates clean money from stolen money so banks can <strong>freeze the crime, not the customer</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onStartTour}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Take the 2-Min Tour</span>
              </button>

              <button
                onClick={() => onNavigateTab('investigate')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>View Money Flow Graph</span>
              </button>
            </div>
          </div>

          {/* Right Vector Graphic: The Mixing & Separation Cylinder */}
          <div className="lg:col-span-5 bg-[#080e1d]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Interactive Money Vault</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live State
              </span>
            </div>

            {/* Commingling Visual Illustration */}
            <div className="space-y-4">
              {/* Inflow indicator */}
              <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <div className="text-[9px] text-emerald-500 uppercase">Existing Clean Savings</div>
                  <div className="font-bold text-xs mt-0.5">₹5,00,000</div>
                </div>
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
                  <div className="text-[9px] text-rose-500 uppercase">Stolen Crime Inflow</div>
                  <div className="font-bold text-xs mt-0.5">+₹2,00,000</div>
                </div>
              </div>

              {/* The Commingled Account Visual Chamber */}
              <div className="p-4 rounded-xl bg-[#050913] border border-slate-700/80 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    Mule Account A (HDFC)
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">₹7,00,000 Total</span>
                </div>

                {/* Stacked Liquid Progress Bar */}
                <div className="h-6 w-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex relative">
                  <div
                    style={{ width: '71.4%' }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono"
                  >
                    71.4% CLEAN
                  </div>
                  <div
                    style={{ width: '28.6%' }}
                    className="bg-gradient-to-r from-rose-500 to-red-600 h-full flex items-center justify-center text-[10px] font-bold text-white font-mono"
                  >
                    28.6% STOLEN
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span className="text-emerald-400">● ₹5,00,000 Innocent Money</span>
                  <span className="text-rose-400">● ₹2,00,000 Disputed Money</span>
                </div>
              </div>

              {/* Smart Freeze Benefit Callout */}
              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-[11px] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>TraceMesh Result:</strong> Bank locks <em>only</em> the ₹2,00,000 stolen portion. Customer's ₹5,00,000 clean savings stay untouched.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 5-STEP SCENARIO: VISUAL INFOGRAPHIC STORY                          */}
      {/* ========================================================================= */}
      <div className="bg-[#0a101f] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              How Money Moves & Separates (5-Step Visual Scenario)
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Click through the stages below to see how TraceMesh follows the stolen value.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((s) => (s > 1 ? s - 1 : 5))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              ← Prev
            </button>
            <span className="text-slate-400 font-mono text-xs px-2">
              {activeStep} of 5
            </span>
            <button
              onClick={() => setActiveStep((s) => (s < 5 ? s + 1 : 1))}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Next →
            </button>
          </div>
        </div>

        {/* 5 Step Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {steps.map((s) => {
            const isSelected = activeStep === s.number;
            return (
              <button
                key={s.number}
                onClick={() => setActiveStep(s.number)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-[#060b16] border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 font-mono uppercase">
                  Step 0{s.number}
                </div>
                <div className="font-bold text-xs text-slate-200 truncate mt-1">
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Presentation Box */}
        <div className="p-6 bg-[#060b17] rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                {currentStep.badge}
              </span>
              <span className="text-slate-500 font-mono text-xs">•</span>
              <span className="text-slate-300 font-semibold text-xs">{currentStep.subtitle}</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {currentStep.title}
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed max-w-2xl font-sans">
              {currentStep.details}
            </p>

            {/* Visual Balance Bar */}
            <div className="space-y-1.5 pt-2 max-w-xl">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">{currentStep.cleanDisplay}</span>
                <span className="text-rose-400 font-semibold">{currentStep.stolenDisplay}</span>
              </div>
              <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${currentStep.cleanPct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                />
                <div
                  style={{ width: `${currentStep.stolenPct}%` }}
                  className="bg-rose-500 h-full transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-4 rounded-xl bg-[#0c1427] border border-slate-800 space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Live Investigation Shortcut
            </div>
            <button
              onClick={() => onNavigateTab('investigate')}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-xs text-left flex items-center justify-between group transition-all"
            >
              <span>View Money Flow Graph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectTransaction('TXN-ORIGIN-001')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs text-left flex items-center justify-between group transition-all"
            >
              <span>View Bank Payment Message</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GRAPHICAL "BEFORE & AFTER": WHY BANKS PICK TRACEMESH                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Old Way */}
        <div className="p-6 bg-[#0a101f] border border-rose-500/20 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <span className="font-bold text-rose-300 text-sm">Traditional Fraud Tools</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Crude & Harmful
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">1. Vague Suspicion Scores:</strong> Simply alerts <em>"Account is 85% suspicious"</em> without telling the bank which rupees are clean vs stolen.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">2. Freezes 100% of the Account:</strong> Freezes all ₹7,00,000 — locking up ₹5,00,000 of innocent customer salary, triggering customer disputes.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">3. Trail Lost After Transfer:</strong> Once money hops to another bank, traditional systems lose the trail completely.
            </div>
          </div>
        </div>

        {/* TraceMesh Way */}
        <div className="p-6 bg-[#0a101f] border border-cyan-500/40 rounded-3xl space-y-4 shadow-xl shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="font-bold text-cyan-300 text-sm">TraceMesh Provenance</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Surgical Precision
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">1. Separates Stolen from Clean:</strong> Knows exactly: ₹5,00,000 clean savings + ₹2,00,000 stolen funds (28.6% taint).
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">2. Smart Surgical Partial Lien:</strong> Freezes <em>only</em> the ₹2,00,000 stolen funds. The customer's ₹5,00,000 clean money stays fully accessible.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white">3. Follows the Money Across Banks:</strong> Follows exact rupee splits across SBI, HDFC, ICICI, and Axis Bank with 100% accuracy.
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CLEAN CORE FEATURE CARDS WITH VIBRANT FINTECH ACCENTS                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Core Investigation & Bank Tools
          </h2>
          <p className="text-slate-400 text-xs">Click any tool to launch the interactive workspace.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: DAG */}
          <div
            onClick={() => onNavigateTab('investigate')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
              Money Flow Graph (DAG)
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Interactive visual map showing how stolen money cascades from the victim through mule accounts across banks.
            </p>
          </div>

          {/* Card 2: Smart Freeze */}
          <div
            onClick={() => onNavigateTab('bank_ops')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
              Smart Account Freeze Desk
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bank manager console to review and approve surgical liens on stolen funds while keeping clean money safe.
            </p>
          </div>

          {/* Card 3: Transactions */}
          <div
            onClick={() => onNavigateTab('transactions')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
              Bank Transactions Ledger
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              View standard bank payment records (ISO 20022 pacs.008) with attributed clean vs stolen values.
            </p>
          </div>

          {/* Card 4: Accounts */}
          <div
            onClick={() => onNavigateTab('accounts')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
              Account Directory & Balances
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Browse all monitored bank accounts with live visual bars showing clean savings vs disputed exposure.
            </p>
          </div>

          {/* Card 5: Security */}
          <div
            onClick={() => onNavigateTab('security')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
              Tamper-Proof Audit & Security
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cryptographically verify that transaction evidence has not been altered, with live tamper simulation.
            </p>
          </div>

          {/* Card 6: Test Lab */}
          <div
            onClick={() => onNavigateTab('red_team')}
            className="p-5 rounded-2xl bg-[#0a101f] border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
              Security Test Lab
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Run automated tests proving TraceMesh blocks unauthorized bank access, prompt injections, and tampering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
