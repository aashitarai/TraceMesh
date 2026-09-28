/**
 * TraceMesh Regulator & Central Financial Intelligence View
 * Macro-prudential fraud analytics for RBI, NPCI, I4C, and Law Enforcement Leadership.
 * Strictly adheres to data minimization: aggregated metrics, cross-bank velocity, zero PII.
 */

import React from 'react';
import {
  Activity,
  Layers,
  TrendingDown,
  Building,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Account, EnrichedTransaction, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface RegulatorViewProps {
  accounts: Account[];
  transactions: EnrichedTransaction[];
}

export const RegulatorView: React.FC<RegulatorViewProps> = ({ accounts, transactions }) => {
  // Aggregate macro metrics across all institutions
  const totalEcosystemBalance = accounts.reduce((sum, a) => sum + a.totalBalance, 0);
  const totalDisputedTaintInSystem = accounts.reduce((sum, a) => sum + a.taintedValue, 0);
  const totalCleanPreserved = accounts.reduce((sum, a) => sum + a.cleanValue, 0);

  // Institution distribution
  const instStats = INSTITUTIONS.map((inst) => {
    const instAccounts = accounts.filter((a) => a.institutionId === inst.id);
    const balance = instAccounts.reduce((sum, a) => sum + a.totalBalance, 0);
    const taint = instAccounts.reduce((sum, a) => sum + a.taintedValue, 0);
    const clean = instAccounts.reduce((sum, a) => sum + a.cleanValue, 0);
    const taintedAccounts = instAccounts.filter((a) => a.taintedValue > 0).length;

    return {
      inst,
      balance,
      taint,
      clean,
      taintedAccounts,
      totalAccounts: instAccounts.length,
    };
  });

  // Inter-bank flow matrix
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
      {/* Regulator Macro Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 font-black text-xl font-mono shadow-lg">
            RBI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Central Ecosystem Financial Intelligence</h2>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/40">
                DPDP Act Compliant (Zero PII)
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Coordinated Surveillance across NPCI, I4C (CFCFRMS), and Scheduled Commercial Banks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Ecosystem Disputed Taint</div>
            <div className="text-base font-black text-rose-400">
              ₹{totalDisputedTaintInSystem.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-emerald-500/30">
            <div className="text-[10px] text-emerald-400 uppercase">Clean Funds Protected</div>
            <div className="text-base font-black text-emerald-400">
              ₹{totalCleanPreserved.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-purple-500/30">
            <div className="text-[10px] text-purple-300 uppercase">Avg Time to Lien</div>
            <div className="text-base font-black text-purple-300">4.2 min</div>
          </div>
        </div>
      </div>

      {/* Grid: Inter-Bank Flow Matrix & Institution Exposure Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inter-Bank Flow Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Cross-Institution Disputed Value Transit Matrix
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Settlement Trails</span>
          </div>

          <div className="space-y-3 font-mono">
            {interBankFlows.map((flow, idx) => {
              const src = INSTITUTIONS.find((i) => i.id === flow.from);
              const dst = INSTITUTIONS.find((i) => i.id === flow.to);
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-xs">
                      {src?.code}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-xs">
                      {dst?.code}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-slate-200 font-bold">Total: ₹{flow.amount.toLocaleString('en-IN')}</div>
                    <div className="text-rose-400 text-[11px] font-semibold">
                      Tainted Value: ₹{flow.taint.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institution-Level Disputed Allocation Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" />
              Institution Statutory Lien Exposure
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Attribution</span>
          </div>

          <div className="space-y-3">
            {instStats.map((item) => (
              <div
                key={item.inst.id}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: item.inst.color }}
                      className="font-bold text-xs"
                    >
                      {item.inst.code} — {item.inst.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      item.taint > 0
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {item.taintedAccounts} Tainted Accounts
                  </span>
                </div>

                {/* Balance bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    style={{
                      width: `${item.balance > 0 ? (item.clean / item.balance) * 100 : 100}%`,
                    }}
                    className="bg-emerald-500 h-full"
                  />
                  <div
                    style={{
                      width: `${item.balance > 0 ? (item.taint / item.balance) * 100 : 0}%`,
                    }}
                    className="bg-rose-500 h-full"
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Total: ₹{item.balance.toLocaleString('en-IN')}</span>
                  <span className="text-rose-400 font-bold">
                    Taint: ₹{item.taint.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
