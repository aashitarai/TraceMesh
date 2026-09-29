/**
 * TraceMesh Account Profile & Surgical Lien Enforcement Modal
 * Displays complete account state, horizontal Value Composition Bar (Clean vs Disputed funds),
 * counterparty lineage, recent transaction history, and action to place a surgical partial lien.
 */

import React, { useState } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle2, AlertTriangle, ArrowRight, Building, Activity, Copy, Check } from 'lucide-react';
import { Account, EnrichedTransaction, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface AccountProfileModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: EnrichedTransaction[];
  onSelectTransaction: (txId: string) => void;
  onIssuePartialLien: (accountId: string, amount: number) => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  account,
  isOpen,
  onClose,
  transactions,
  onSelectTransaction,
  onIssuePartialLien,
}) => {
  const [copied, setCopied] = useState(false);
  const [lienIssued, setLienIssued] = useState(false);

  if (!isOpen || !account) return null;

  const inst = INSTITUTIONS.find((i) => i.id === account.institutionId) || INSTITUTIONS[0];

  // Transactions involving this account
  const accountTxs = transactions.filter(
    (t) =>
      t.canonical.debtorAccountId === account.id ||
      t.canonical.creditorAccountId === account.id
  );

  const cleanPercentage = account.totalBalance > 0 ? (account.cleanValue / account.totalBalance) * 100 : 100;
  const taintPercentage = account.totalBalance > 0 ? (account.taintedValue / account.totalBalance) * 100 : 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLienClick = () => {
    onIssuePartialLien(account.id, account.taintedValue);
    setLienIssued(true);
    setTimeout(() => setLienIssued(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[90vh] overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: `${inst.color}25`, borderColor: inst.color }}
              className="w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-sm text-white"
            >
              {inst.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-slate-100">{account.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {account.accountNumberMasked}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    account.status === 'FROZEN'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : account.status === 'PARTIAL_LIEN'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : account.status === 'FLAGGED'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {account.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {inst.name} · {account.branch} · Customer Token: {account.customerId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(account.id)}
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Top Balance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-500 uppercase">Total Ledger Balance</div>
              <div className="text-xl font-bold text-slate-100 mt-1">
                ₹{account.totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{account.accountType} ACCOUNT</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-500 uppercase">Clean Legitimate Value</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                ₹{account.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-emerald-500 mt-0.5">{cleanPercentage.toFixed(1)}% Protected</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-500 uppercase">Disputed Theft Exposure</div>
              <div className="text-xl font-bold text-amber-400 mt-1">
                ₹{account.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-amber-500 mt-0.5">{taintPercentage.toFixed(1)}% Attributed</div>
            </div>
          </div>

          {/* Value Composition Section */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Value Composition & Commingling State
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Preserved Clean: ₹{account.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Horizontal Bar */}
            <div className="space-y-1.5">
              <div className="h-5 w-full bg-slate-800 rounded-lg overflow-hidden flex">
                <div
                  style={{ width: `${cleanPercentage}%` }}
                  className="bg-emerald-600 h-full flex items-center justify-center text-[10px] font-mono font-bold text-emerald-100 transition-all"
                  title={`Clean Value: ₹${account.cleanValue.toLocaleString('en-IN')}`}
                >
                  {cleanPercentage > 15 ? `${cleanPercentage.toFixed(1)}% Clean` : ''}
                </div>
                <div
                  style={{ width: `${taintPercentage}%` }}
                  className="bg-gradient-to-r from-amber-500 to-rose-600 h-full flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all"
                  title={`Disputed Tainted Value: ₹${account.taintedValue.toLocaleString('en-IN')}`}
                >
                  {taintPercentage > 15 ? `${taintPercentage.toFixed(1)}% Disputed` : ''}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400">
                  ● Legitimate Deposited Funds ({cleanPercentage.toFixed(2)}%)
                </span>
                <span className="text-amber-400">
                  ● Attributed Stolen Funds ({taintPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Under TraceMesh's mathematical conservation law, when money moves out of this account, funds are drawn pro-rata.
              Surgical partial lien ensures legitimate customer funds (₹{account.cleanValue.toLocaleString('en-IN')}) remain liquid while disputed funds are held.
            </p>
          </div>

          {/* Action: Place Surgical Partial Lien */}
          {account.taintedValue > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-amber-200">Enforce Statutory Surgical Partial Lien</div>
                  <div className="text-[11px] text-amber-300/80">
                    Freeze exactly <strong className="font-mono">₹{account.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong> of disputed funds. Does NOT freeze clean funds.
                  </div>
                </div>
              </div>
              <button
                onClick={handleLienClick}
                disabled={lienIssued || account.status === 'PARTIAL_LIEN'}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all whitespace-nowrap"
              >
                {lienIssued || account.status === 'PARTIAL_LIEN' ? 'Lien Active' : 'Place Partial Lien'}
              </button>
            </div>
          )}

          {/* Recent Transaction History */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Account Transaction History ({accountTxs.length})
            </h4>

            {accountTxs.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No transactions recorded for this account yet.
              </div>
            ) : (
              <div className="space-y-2">
                {accountTxs.map((tx) => {
                  const isDebtor = tx.canonical.debtorAccountId === account.id;
                  return (
                    <div
                      key={tx.canonical.transactionId}
                      onClick={() => onSelectTransaction(tx.canonical.transactionId)}
                      className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isDebtor ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {isDebtor ? 'OUT' : 'IN'}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                            {tx.canonical.transactionId}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(tx.canonical.timestamp).toLocaleTimeString('en-IN')} · {tx.canonical.channel} · {tx.canonical.purpose}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-mono font-bold ${
                            isDebtor ? 'text-slate-200' : 'text-emerald-400'
                          }`}
                        >
                          {isDebtor ? '-' : '+'}₹{tx.canonical.amount.toLocaleString('en-IN')}
                        </div>
                        {tx.analytical.taintedValue > 0 && (
                          <div className="text-[10px] font-mono text-amber-400">
                            Disputed: ₹{tx.analytical.taintedValue.toLocaleString('en-IN')} ({tx.analytical.taintPercentage}%)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
