/**
 * TraceMesh Global Command Palette & Search Modal (Ctrl + K)
 * Institutional search across Transactions, Accounts, Cases, and Financial Institutions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShieldAlert, CreditCard, Folder, Building, FileText, CornerDownLeft } from 'lucide-react';
import { Account, EnrichedTransaction, InvestigationCase, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  transactions: EnrichedTransaction[];
  cases: InvestigationCase[];
  onSelectAccount: (accountId: string) => void;
  onSelectTransaction: (txId: string) => void;
  onSelectCase: (caseId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  accounts,
  transactions,
  cases,
  onSelectAccount,
  onSelectTransaction,
  onSelectCase,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchedAccounts = accounts.filter(
    (a) =>
      a.id.toLowerCase().includes(cleanQuery) ||
      a.accountNumberMasked.toLowerCase().includes(cleanQuery) ||
      a.institutionId.toLowerCase().includes(cleanQuery) ||
      a.branch.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  const matchedTransactions = transactions.filter(
    (t) =>
      t.canonical.transactionId.toLowerCase().includes(cleanQuery) ||
      t.canonical.debtorAccountId.toLowerCase().includes(cleanQuery) ||
      t.canonical.creditorAccountId.toLowerCase().includes(cleanQuery) ||
      t.canonical.purpose.toLowerCase().includes(cleanQuery) ||
      t.canonical.channel.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  const matchedCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(cleanQuery) ||
      c.title.toLowerCase().includes(cleanQuery) ||
      c.leadInvestigator.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchedInstitutions = INSTITUTIONS.filter(
    (i) =>
      i.name.toLowerCase().includes(cleanQuery) ||
      i.code.toLowerCase().includes(cleanQuery) ||
      i.id.toLowerCase().includes(cleanQuery)
  );

  const hasResults =
    matchedAccounts.length > 0 ||
    matchedTransactions.length > 0 ||
    matchedCases.length > 0 ||
    matchedInstitutions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts, transactions, case IDs, or banks..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded shadow">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {!query && (
            <div className="py-6 text-center text-slate-500">
              <p className="font-medium text-slate-400">Quick Navigation & Investigation Query</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Type an account ID (e.g. <span className="font-mono text-slate-300">ACC-HDFC-MULE-A</span>), transaction hash, or bank name.
              </p>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium text-slate-400">No matching records found</p>
              <p className="text-[11px] mt-1 text-slate-600">
                Try searching for "CASE-2026-00041", "HDFC", "TXN-ORIGIN-001", or "Mule"
              </p>
            </div>
          )}

          {/* Cases Results */}
          {matchedCases.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                Active Cases ({matchedCases.length})
              </div>
              <div className="space-y-1.5">
                {matchedCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c.id);
                      onNavigateTab('investigate');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-amber-500/10 border border-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-[10px] border border-amber-500/30">
                        {c.priority.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                          {c.id}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">
                        ₹{c.disputedValue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">{c.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Accounts Results */}
          {matchedAccounts.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                Accounts ({matchedAccounts.length})
              </div>
              <div className="space-y-1.5">
                {matchedAccounts.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelectAccount(a.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-sky-500/10 border border-slate-800/80 hover:border-sky-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {a.institutionId.slice(0, 4)}
                      </span>
                      <div>
                        <div className="font-mono font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                          {a.id}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {a.accountNumberMasked} · {a.branch}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-200">
                        ₹{a.totalBalance.toLocaleString('en-IN')}
                      </div>
                      {a.taintedValue > 0 ? (
                        <div className="text-[10px] font-mono text-amber-400">
                          Disputed: ₹{a.taintedValue.toLocaleString('en-IN')} ({a.taintPercentage.toFixed(1)}%)
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-400">100% Clean</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Results */}
          {matchedTransactions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Transactions ({matchedTransactions.length})
              </div>
              <div className="space-y-1.5">
                {matchedTransactions.map((tx) => (
                  <button
                    key={tx.canonical.transactionId}
                    onClick={() => {
                      onSelectTransaction(tx.canonical.transactionId);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-emerald-500/10 border border-slate-800/80 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                          {tx.canonical.transactionId}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {tx.canonical.channel}
                        </span>
                        {tx.analytical.isFraudOrigin && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            THEFT ORIGIN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {tx.canonical.debtorAccountId} → {tx.canonical.creditorAccountId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-200">
                        ₹{tx.canonical.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-mono text-amber-400">
                        Taint: ₹{tx.analytical.taintedValue.toLocaleString('en-IN')} ({tx.analytical.taintPercentage}%)
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Institutions Results */}
          {matchedInstitutions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                Banking Institutions ({matchedInstitutions.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {matchedInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => {
                      onNavigateTab('institutions');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-purple-500/10 border border-slate-800/80 hover:border-purple-500/40 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div
                      style={{ backgroundColor: `${inst.color}25`, borderColor: inst.color }}
                      className="w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-[10px] text-white"
                    >
                      {inst.code}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 truncate group-hover:text-purple-300">
                        {inst.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{inst.id}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search TraceMesh Core Financial Graph</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-slate-400" /> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px] font-mono">ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
