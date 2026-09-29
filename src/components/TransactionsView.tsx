/**
 * TraceMesh Transactions Ledger View
 * High-density institutional transaction ledger with multi-column filtering,
 * 3-layer modal inspection, value provenance attribution, and export capability.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { EnrichedTransaction, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface TransactionsViewProps {
  transactions: EnrichedTransaction[];
  onSelectTransaction: (txId: string) => void;
  onSelectAccount: (accountId: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onSelectTransaction,
  onSelectAccount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedInst, setSelectedInst] = useState<string>('ALL');
  const [onlyFlagged, setOnlyFlagged] = useState<boolean>(false);

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.canonical.transactionId.toLowerCase().includes(q) ||
      t.canonical.debtorAccountId.toLowerCase().includes(q) ||
      t.canonical.creditorAccountId.toLowerCase().includes(q) ||
      t.canonical.purpose.toLowerCase().includes(q) ||
      t.canonical.remittanceInformation.toLowerCase().includes(q);

    const matchesChannel = selectedChannel === 'ALL' || t.canonical.channel === selectedChannel;
    const matchesInst =
      selectedInst === 'ALL' ||
      t.canonical.debtorInstitutionId === selectedInst ||
      t.canonical.creditorInstitutionId === selectedInst;
    const matchesFlagged = !onlyFlagged || t.analytical.taintedValue > 0 || t.analytical.isFraudOrigin;

    return matchesSearch && matchesChannel && matchesInst && matchesFlagged;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.canonical.amount, 0);
  const totalTaint = filteredTransactions.reduce((sum, t) => sum + t.analytical.taintedValue, 0);

  const handleExportCsv = () => {
    const headers = [
      'TransactionID',
      'Timestamp',
      'Channel',
      'DebtorAccount',
      'DebtorBank',
      'CreditorAccount',
      'CreditorBank',
      'GrossAmount',
      'AttributedDisputedValue',
      'TaintPercentage',
      'IsFraudOrigin',
      'Status',
    ];
    const rows = filteredTransactions.map((t) => [
      t.canonical.transactionId,
      t.canonical.timestamp,
      t.canonical.channel,
      t.canonical.debtorAccountId,
      t.canonical.debtorInstitutionId,
      t.canonical.creditorAccountId,
      t.canonical.creditorInstitutionId,
      t.canonical.amount,
      t.analytical.taintedValue,
      t.analytical.taintPercentage,
      t.analytical.isFraudOrigin,
      t.canonical.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tracemesh_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-emerald-400" />
              Canonical Transaction Ledger
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
              {transactions.length} SETTLED RECORDS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Inter-bank transactions processed across participating institutions with real-time value attribution and cryptographic block verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by TX ID, account, purpose..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Channel Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 font-mono uppercase">Channel:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Channels</option>
              <option value="UPI" className="bg-slate-900">UPI</option>
              <option value="IMPS" className="bg-slate-900">IMPS</option>
              <option value="NEFT" className="bg-slate-900">NEFT</option>
              <option value="RTGS" className="bg-slate-900">RTGS</option>
            </select>
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

          {/* Only Flagged Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px] select-none">
            <input
              type="checkbox"
              checked={onlyFlagged}
              onChange={(e) => setOnlyFlagged(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Show Disputed / Origin Only</span>
          </label>
        </div>

        {/* Aggregate summary for filtered set */}
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-4">
          <div>
            Filtered Value: <strong className="text-slate-200">₹{totalAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            Disputed: <strong className="text-amber-400">₹{totalTaint.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Debtor (From)</th>
                <th className="py-3 px-4">Creditor (To)</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">Disputed Value</th>
                <th className="py-3 px-4 text-center">Exposure %</th>
                <th className="py-3 px-4 text-center">Classification</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.canonical.transactionId}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectTransaction(tx.canonical.transactionId)}
                  >
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(tx.canonical.timestamp).toLocaleTimeString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                      {tx.canonical.transactionId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.canonical.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAccount(tx.canonical.debtorAccountId);
                        }}
                        className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {tx.canonical.debtorAccountId}
                      </button>
                      <div className="text-[10px] text-slate-500 font-sans">
                        {tx.canonical.debtorInstitutionId}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAccount(tx.canonical.creditorAccountId);
                        }}
                        className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {tx.canonical.creditorAccountId}
                      </button>
                      <div className="text-[10px] text-slate-500 font-sans">
                        {tx.canonical.creditorInstitutionId}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100">
                      ₹{tx.canonical.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.analytical.taintedValue > 0 ? (
                        <span className="font-bold text-amber-400">
                          ₹{tx.analytical.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px]">₹0.00 (Clean)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.analytical.taintPercentage > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {tx.analytical.taintPercentage}%
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">0%</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.analytical.isFraudOrigin ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          THEFT ORIGIN
                        </span>
                      ) : tx.analytical.taintedValue > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                          COMMINGLED
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          LEGITIMATE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx.canonical.transactionId);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        title="Open 3-Layer Inspector"
                      >
                        <Eye className="w-3 h-3 text-amber-400" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
