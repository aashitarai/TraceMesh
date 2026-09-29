/**
 * TraceMesh Accounts Ledger View
 * High-density institutional account directory with balance states,
 * clean vs disputed composition bars, lien execution, and account profile inspection.
 */

import React, { useState } from 'react';
import { CreditCard, Search, Filter, ShieldCheck, Lock, Eye, Building, CheckCircle2 } from 'lucide-react';
import { Account, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface AccountsViewProps {
  accounts: Account[];
  onSelectAccount: (accountId: string) => void;
  onIssuePartialLien: (accountId: string, amount: number) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onSelectAccount,
  onIssuePartialLien,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInst, setSelectedInst] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredAccounts = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.id.toLowerCase().includes(q) ||
      a.accountNumberMasked.toLowerCase().includes(q) ||
      a.branch.toLowerCase().includes(q) ||
      a.customerId.toLowerCase().includes(q);

    const matchesInst = selectedInst === 'ALL' || a.institutionId === selectedInst;
    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus;

    return matchesSearch && matchesInst && matchesStatus;
  });

  const totalBalance = filteredAccounts.reduce((sum, a) => sum + a.totalBalance, 0);
  const totalClean = filteredAccounts.reduce((sum, a) => sum + a.cleanValue, 0);
  const totalTaint = filteredAccounts.reduce((sum, a) => sum + a.taintedValue, 0);

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <CreditCard className="w-4 h-4 text-sky-400" />
              Inter-Bank Account Ledger
            </h2>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[10px] border border-sky-500/30">
              {accounts.length} ACCOUNTS MONITORED
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time balance breakdown between legitimate clean funds and attributed disputed theft exposure across participant banks.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Total Monitored</div>
            <div className="font-bold text-slate-100">₹{totalBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Clean Funds Protected</div>
            <div className="font-bold text-emerald-400">₹{totalClean.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Disputed Value Held</div>
            <div className="font-bold text-amber-400">₹{totalTaint.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by account ID, masked number, or branch..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Institution Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 font-mono uppercase">Bank:</span>
            <select
              value={selectedInst}
              onChange={(e) => setSelectedInst(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Banks</option>
              {INSTITUTIONS.map((inst) => (
                <option key={inst.id} value={inst.id} className="bg-slate-900">
                  {inst.code} ({inst.name})
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 font-mono uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="ACTIVE" className="bg-slate-900">ACTIVE</option>
              <option value="FLAGGED" className="bg-slate-900">FLAGGED</option>
              <option value="PARTIAL_LIEN" className="bg-slate-900">PARTIAL_LIEN</option>
              <option value="FROZEN" className="bg-slate-900">FROZEN</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Showing <strong className="text-slate-200">{filteredAccounts.length}</strong> of {accounts.length} Accounts
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Bank</th>
                <th className="py-3 px-4">Masked Number</th>
                <th className="py-3 px-4 text-right">Total Balance</th>
                <th className="py-3 px-4 text-right">Clean Value</th>
                <th className="py-3 px-4 text-right">Disputed Value</th>
                <th className="py-3 px-4 text-center">Value Composition</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No accounts match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const inst = INSTITUTIONS.find((i) => i.id === acc.institutionId);
                  const cleanPct = acc.totalBalance > 0 ? (acc.cleanValue / acc.totalBalance) * 100 : 100;
                  const taintPct = acc.totalBalance > 0 ? (acc.taintedValue / acc.totalBalance) * 100 : 0;

                  return (
                    <tr
                      key={acc.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectAccount(acc.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                          {acc.id}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">{acc.branch}</div>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span
                            style={{ backgroundColor: `${inst?.color}25`, borderColor: inst?.color }}
                            className="w-5 h-5 rounded border flex items-center justify-center font-mono font-bold text-[9px] text-white"
                          >
                            {inst?.code}
                          </span>
                          <span className="text-slate-300 text-[11px]">{inst?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{acc.accountNumberMasked}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-100">
                        ₹{acc.totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-400">
                        ₹{acc.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {acc.taintedValue > 0 ? (
                          <span className="text-amber-400 font-bold">
                            ₹{acc.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">₹0.00</span>
                        )}
                      </td>
                      <td className="py-3 px-4 w-40">
                        <div className="space-y-1">
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${cleanPct}%` }} className="bg-emerald-500 h-full"></div>
                            <div style={{ width: `${taintPct}%` }} className="bg-amber-500 h-full"></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span className="text-emerald-400">{cleanPct.toFixed(0)}% C</span>
                            <span className="text-amber-400">{taintPct.toFixed(0)}% D</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.status === 'FROZEN'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : acc.status === 'PARTIAL_LIEN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : acc.status === 'FLAGGED'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAccount(acc.id);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3 h-3 text-sky-400" />
                          Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
