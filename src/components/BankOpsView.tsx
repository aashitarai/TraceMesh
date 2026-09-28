/**
 * TraceMesh Bank Operations Desk & Maker-Checker Dual Key Approval Center
 * Allows bank managers and fraud analysts from HDFC, ICICI, SBI, Axis to log in,
 * review incoming statutory lien notifications from investigators, inspect account clean/taint ratios,
 * and approve or reject surgical partial liens.
 */

import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Lock,
  CheckCircle,
  Clock,
  Building,
  UserCheck,
  FileText,
  Key,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Account, EnrichedTransaction, InstitutionId, SecurityRole } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';
import { AUTH_PERSONAS, AuthPersona } from '../core/auth/personas';

interface BankOpsViewProps {
  currentInstitutionId: InstitutionId;
  currentRole: SecurityRole;
  currentPersona: AuthPersona;
  onSwitchPersona: (persona: AuthPersona) => void;
  accounts: Account[];
  transactions: EnrichedTransaction[];
  onApproveLien: (accountId: string, amount: number) => void;
}

export const BankOpsView: React.FC<BankOpsViewProps> = ({
  currentInstitutionId,
  currentRole,
  currentPersona,
  onSwitchPersona,
  accounts,
  transactions,
  onApproveLien,
}) => {
  const currentInst = INSTITUTIONS.find((i) => i.id === currentInstitutionId) || INSTITUTIONS[1];

  // Tenant Isolation: strictly filter accounts belonging to the active logged-in bank
  const myAccounts = accounts.filter((a) => a.institutionId === currentInstitutionId);

  // Transactions where this bank was debtor or creditor
  const myTransactions = transactions.filter(
    (t) =>
      t.canonical.debtorInstitutionId === currentInstitutionId ||
      t.canonical.creditorInstitutionId === currentInstitutionId
  );

  const totalLocalTaint = myAccounts.reduce((sum, a) => sum + a.taintedValue, 0);
  const totalLocalClean = myAccounts.reduce((sum, a) => sum + a.cleanValue, 0);
  const totalLocalBalance = myAccounts.reduce((sum, a) => sum + a.totalBalance, 0);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(myAccounts[0]?.id || '');
  const [makerCheckerKey, setMakerCheckerKey] = useState<string>('HSM-TOKEN-9941');
  const [makerCheckerSigned, setMakerCheckerSigned] = useState<boolean>(false);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);

  const selectedAccount = myAccounts.find((a) => a.id === selectedAccountId) || myAccounts[0];

  // Bank personas for this specific bank
  const bankPersonas = AUTH_PERSONAS.filter((p) => p.institutionId === currentInstitutionId);

  const handleExecuteApproval = () => {
    if (!selectedAccount) return;
    onApproveLien(selectedAccount.id, selectedAccount.taintedValue);
    setApprovalStatus(`Approved: Surgical partial lien of ₹${selectedAccount.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} successfully bound to core banking ledger.`);
    setTimeout(() => setApprovalStatus(null), 4000);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6">
      {/* Banner & Authenticated Persona Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: `${currentInst.color}25`, borderColor: currentInst.color }}
            className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-black text-xl text-white shadow-lg"
          >
            {currentInst.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentInst.name}</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                Tenant Scoped: {currentInst.id}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Fraud Risk Operations & Statutory Lien Enforcement Console
            </p>
          </div>
        </div>

        {/* Current Active Persona & Signer Details */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Logged-in Official:</div>
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: currentPersona.badgeColor }}
                className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              >
                {currentPersona.avatarInitials}
              </span>
              <div>
                <div className="font-bold text-slate-100 text-xs">{currentPersona.name}</div>
                <div className="text-[10px] text-amber-400 font-mono">{currentPersona.designation}</div>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for Bank Demo */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Switch Signer:</span>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {bankPersonas.map((bp) => (
                <button
                  key={bp.id}
                  onClick={() => onSwitchPersona(bp)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    currentPersona.id === bp.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {bp.role === 'BANK_MANAGER' ? 'Manager (Signatory)' : 'Analyst'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Exposure Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Total Supervised Deposits</div>
          <div className="text-base font-bold text-slate-200 mt-1">₹{totalLocalBalance.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Across {myAccounts.length} managed customer accounts</div>
        </div>

        <div className="bg-slate-900 px-4 py-3 rounded-xl border border-rose-500/30">
          <div className="text-[10px] text-rose-400 uppercase">Active Disputed Taint Exposure</div>
          <div className="text-base font-black text-rose-400 mt-1">
            ₹{totalLocalTaint.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Subject to statutory inquiry</div>
        </div>

        <div className="bg-slate-900 px-4 py-3 rounded-xl border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase">Protected Innocent Capital</div>
          <div className="text-base font-bold text-emerald-400 mt-1">
            ₹{totalLocalClean.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Preserved from indiscriminate 100% account freeze</div>
        </div>
      </div>

      {/* Main Work Area: Accounts Table & Dual-Key Approval Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bank Accounts Under Surveillance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" />
                {currentInst.code} Supervised Accounts ({myAccounts.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Real-time Partitioned Balances
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase">
                    <th className="pb-2">Account</th>
                    <th className="pb-2">Total Balance</th>
                    <th className="pb-2">Clean Value</th>
                    <th className="pb-2">Tainted Value</th>
                    <th className="pb-2">Taint %</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {myAccounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <tr
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-800/60' : ''
                        }`}
                      >
                        <td className="py-2.5 font-bold text-slate-200">
                          {acc.accountNumberMasked}
                          <div className="text-[10px] text-slate-500 font-sans">{acc.branch}</div>
                        </td>
                        <td className="py-2.5 text-slate-200">₹{acc.totalBalance.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-emerald-400 font-semibold">
                          ₹{acc.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-2.5 text-rose-400 font-bold">
                          ₹{acc.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              acc.taintPercentage > 0
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {acc.taintPercentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              acc.status === 'PARTIAL_LIEN'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : acc.status === 'FLAGGED'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {acc.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccountId(acc.id);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clearing Wire Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Inbound / Outbound Clearing Wire Logs ({myTransactions.length})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {myTransactions.map((tx) => (
                <div
                  key={tx.canonical.transactionId}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        tx.canonical.creditorInstitutionId === currentInstitutionId
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {tx.canonical.creditorInstitutionId === currentInstitutionId ? 'INBOUND' : 'OUTBOUND'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">
                        ₹{tx.canonical.amount.toLocaleString('en-IN')} via {tx.canonical.channel}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tx.canonical.debtorAccountId} → {tx.canonical.creditorAccountId} | {tx.canonical.timestamp.substring(11, 19)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-rose-400 font-bold">
                      Taint: ₹{tx.analytical.taintedValue.toFixed(2)} ({tx.analytical.taintPercentage}%)
                    </div>
                    <div className="text-[10px] text-slate-500">{tx.canonical.transactionId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Maker-Checker Dual-Key Approval Console */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Maker-Checker Sign-off</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                RBAC Enforced
              </span>
            </div>

            {selectedAccount ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Account Details Box */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase">Target Account For Review</div>
                  <div className="text-base font-black text-slate-100">{selectedAccount.accountNumberMasked}</div>
                  <div className="text-xs text-slate-400 font-sans">Branch: {selectedAccount.branch}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Balance:</span>
                    <span className="text-slate-200 font-bold">₹{selectedAccount.totalBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Disputed Taint Exposure:</span>
                    <span>₹{selectedAccount.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Protected Clean Balance:</span>
                    <span>₹{selectedAccount.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {selectedAccount.taintedValue > 0 ? (
                  <div className="p-4 bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/40 rounded-xl space-y-3 font-sans">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-amber-200 text-xs">Statutory Lien Workflow</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Traditional whole-account freezes expose banks to customer litigation. TraceMesh restricts the debit lien exclusively to <strong className="text-amber-300 font-mono">₹{selectedAccount.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>, leaving the client's clean funds liquid.
                    </p>

                    {/* Signatory Check */}
                    {currentPersona.role === 'BANK_MANAGER' ? (
                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={makerCheckerSigned}
                            onChange={(e) => setMakerCheckerSigned(e.target.checked)}
                            className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <span className="text-[11px] text-slate-300">
                            <strong>Dual-Key Sign-off:</strong> I, {currentPersona.name}, certify statutory case review under CFCFRMS protocol and authorize debit lien.
                          </span>
                        </label>

                        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px]">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-slate-400">HSM Sign Token:</span>
                          <span className="text-slate-200 font-bold">{makerCheckerKey}</span>
                        </div>

                        <button
                          disabled={!makerCheckerSigned}
                          onClick={handleExecuteApproval}
                          className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            makerCheckerSigned
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          Execute Statutory Partial Lien
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          Manager Approval Required (RBAC-MAKER-03)
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          As a Bank Analyst, you can submit recommended liens. Final execution requires signing by a Bank Manager. Use the "Switch Signer" button above to simulate manager approval.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center gap-2 font-sans">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Account is 100% clean. No disputed exposure detected.</span>
                  </div>
                )}

                {approvalStatus && (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-sans animate-fadeIn">
                    {approvalStatus}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
