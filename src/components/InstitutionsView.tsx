/**
 * TraceMesh Financial Institutions Network View
 * Infrastructure status of connected participant banks (SBI, HDFC, ICICI, Axis).
 * Displays mTLS node status, core banking adapters (ISO 20022 pacs.008),
 * transaction volumes, disputed taint exposure hosted, and inter-bank flow matrix.
 */

import React from 'react';
import { Building, ShieldCheck, Activity, ArrowRight, Database, CheckCircle2, Lock, Cpu } from 'lucide-react';
import { Account, EnrichedTransaction, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface InstitutionsViewProps {
  accounts: Account[];
  transactions: EnrichedTransaction[];
  onSelectInstitution?: (instId: InstitutionId) => void;
  onNavigateTab: (tab: string) => void;
}

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({
  accounts,
  transactions,
  onSelectInstitution,
  onNavigateTab,
}) => {
  // Aggregate stats per institution
  const institutionSummaries = INSTITUTIONS.map((inst) => {
    const instAccounts = accounts.filter((a) => a.institutionId === inst.id);
    const totalBal = instAccounts.reduce((sum, a) => sum + a.totalBalance, 0);
    const cleanBal = instAccounts.reduce((sum, a) => sum + a.cleanValue, 0);
    const taintedBal = instAccounts.reduce((sum, a) => sum + a.taintedValue, 0);

    const instTxCount = transactions.filter(
      (t) =>
        t.canonical.debtorInstitutionId === inst.id ||
        t.canonical.creditorInstitutionId === inst.id
    ).length;

    const taintedAccounts = instAccounts.filter((a) => a.taintedValue > 0).length;

    return {
      inst,
      totalBal,
      cleanBal,
      taintedBal,
      instAccountsCount: instAccounts.length,
      taintedAccountsCount: taintedAccounts,
      txCount: instTxCount,
      adapter: 'ISO 20022 pacs.008 / XML Gateway',
      status: 'ONLINE · mTLS VERIFIED',
      latency: `${(Math.random() * 1.5 + 0.8).toFixed(1)}ms`,
    };
  });

  // Calculate inter-bank flow matrix
  const interBankFlows: { from: InstitutionId; to: InstitutionId; amount: number; taint: number }[] = [];
  transactions.forEach((tx) => {
    const from = tx.canonical.debtorInstitutionId;
    const to = tx.canonical.creditorInstitutionId;
    if (from !== to) {
      const existing = interBankFlows.find((f) => f.from === from && f.to === to);
      if (existing) {
        existing.amount += tx.canonical.amount;
        existing.taint += tx.analytical.taintedValue;
      } else {
        interBankFlows.push({
          from,
          to,
          amount: tx.canonical.amount,
          taint: tx.analytical.taintedValue,
        });
      }
    }
  });

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Building className="w-4 h-4 text-purple-400" />
              Connected Banking Infrastructure Nodes
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
              4/4 NODES HEALTHY
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time telemetry, core banking ISO 20022 adapters, and zero-trust tenant boundaries across participant banks.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('bank_ops')}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          Open Bank Operations Desk
        </button>
      </div>

      {/* 4 Institution Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {institutionSummaries.map((summary) => {
          const { inst, totalBal, cleanBal, taintedBal, instAccountsCount, taintedAccountsCount, txCount, status, latency } = summary;
          return (
            <div
              key={inst.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
            >
              {/* Institution Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: `${inst.color}25`, borderColor: inst.color }}
                    className="w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-base text-white shadow-md"
                  >
                    {inst.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{inst.name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">{inst.id}</div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between text-[11px] p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE (mTLS)
                </span>
                <span className="text-slate-500 font-mono">Latency: {latency}</span>
              </div>

              {/* Balances & Exposure */}
              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Hosted Bal:</span>
                  <span className="text-slate-100 font-bold">₹{totalBal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clean Funds:</span>
                  <span className="text-emerald-400">₹{cleanBal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disputed Exposure:</span>
                  <span className="text-amber-400 font-bold">₹{taintedBal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Divider & Metadata */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Monitored Accounts:</span>
                  <span className="text-slate-200">{instAccountsCount} ({taintedAccountsCount} flagged)</span>
                </div>
                <div className="flex justify-between">
                  <span>Transactions Processed:</span>
                  <span className="text-slate-200">{txCount} settled</span>
                </div>
                <div className="flex justify-between">
                  <span>Core Adapter:</span>
                  <span className="text-sky-300">pacs.008 XML</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inter-Bank Flow Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Inter-Bank Value Velocity & Disputed Cross-Institution Flows
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {interBankFlows.length} Active Cross-Bank Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {interBankFlows.map((flow, idx) => {
            const fromInst = INSTITUTIONS.find((i) => i.id === flow.from);
            const toInst = INSTITUTIONS.find((i) => i.id === flow.to);
            return (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: `${fromInst?.color}25`, borderColor: fromInst?.color }}
                    className="px-1.5 py-0.5 rounded text-[10px] border text-white font-bold"
                  >
                    {fromInst?.code}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span
                    style={{ backgroundColor: `${toInst?.color}25`, borderColor: toInst?.color }}
                    className="px-1.5 py-0.5 rounded text-[10px] border text-white font-bold"
                  >
                    {toInst?.code}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-100 text-xs">
                    ₹{flow.amount.toLocaleString('en-IN')}
                  </div>
                  {flow.taint > 0 && (
                    <div className="text-[10px] text-amber-400">
                      Disputed: ₹{flow.taint.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
