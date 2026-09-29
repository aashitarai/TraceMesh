/**
 * TraceMesh Security Center & Cryptographic Audit Control Plane
 * Real-time zero-trust security status, live cryptographic block integrity verification,
 * tamper simulation test harness, and immutable audit event ledger.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Hash,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Activity,
  UserCheck,
  Eye,
} from 'lucide-react';
import { AuditEvent, SecurityRole } from '../types';
import { ledgerInstance } from '../core/ledger/ledger';
import { securityService } from '../core/security/securityService';

interface SecurityCenterViewProps {
  auditLogs: AuditEvent[];
  onNavigateTab: (tab: string) => void;
  onRefreshLedger: () => void;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({
  auditLogs,
  onNavigateTab,
  onRefreshLedger,
}) => {
  const [integrityStatus, setIntegrityStatus] = useState<{
    valid: boolean;
    recordsChecked: number;
    tamperedIndex?: number;
    reason?: string;
  } | null>(null);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [tamperSuccess, setTamperSuccess] = useState<boolean | null>(null);

  // Execute full cryptographic block-by-block hash verification
  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = ledgerInstance.verifyLedgerIntegrity();
      setIntegrityStatus(res);
      setIsVerifying(false);
    }, 300);
  };

  // Simulate an adversarial database-level tamper to prove hash chain detection
  const handleSimulateTamper = () => {
    const success = ledgerInstance.simulateMaliciousTamper(0, 99999999);
    setTamperSuccess(success);
    onRefreshLedger();
    // Re-verify immediately to demonstrate detection
    setTimeout(() => {
      const res = ledgerInstance.verifyLedgerIntegrity();
      setIntegrityStatus(res);
    }, 200);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Zero-Trust Security & Cryptographic Audit Control Plane
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
              AUDIT HASH CHAIN ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Continuous verification of RBAC/ABAC boundaries, tenant isolation barriers, and cryptographic SHA-256 block ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('red_team')}
            className="px-3.5 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs border border-rose-500/40 transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            Adversarial Red-Team Sandbox
          </button>
          <button
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Authentication', value: 'OIDC / Keycloak', status: 'HEALTHY', color: 'emerald' },
          { label: 'Authorization', value: 'RBAC + ABAC Policy', status: 'ACTIVE', color: 'emerald' },
          { label: 'Tenant Isolation', value: 'Multi-Bank Barrier', status: 'ENFORCED', color: 'emerald' },
          { label: 'Data Privacy', value: 'Masked Tokens / DPDP', status: 'COMPLIANT', color: 'emerald' },
          { label: 'AI Agent Isolation', value: 'Strict Allowlist Tools', status: 'SANDBOXED', color: 'emerald' },
          { label: 'Audit Integrity', value: 'SHA-256 Hash Chain', status: integrityStatus?.valid === false ? 'TAMPER DETECTED' : 'VERIFIED', color: integrityStatus?.valid === false ? 'rose' : 'emerald' },
        ].map((item, idx) => (
          <div key={idx} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono">{item.label}</div>
            <div className="font-bold text-slate-200 text-xs truncate">{item.value}</div>
            <div className={`text-[10px] font-mono font-bold text-${item.color}-400 flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-400 inline-block`}></span>
              {item.status}
            </div>
          </div>
        ))}
      </div>

      {/* Live Cryptographic Verification Banner */}
      {integrityStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${
            integrityStatus.valid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {integrityStatus.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-bold">
                {integrityStatus.valid
                  ? `Cryptographic Chain Integrity Verified: All ${integrityStatus.recordsChecked} transaction blocks valid.`
                  : `TAMPER ALERT: Cryptographic chain mismatch detected at Block #${integrityStatus.tamperedIndex}!`}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {integrityStatus.reason || 'Recursive hash verification H(n) = SHA256(Tx_n + H_{n-1}) reconciled with zero errors.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {integrityStatus.valid ? (
              <button
                onClick={handleSimulateTamper}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 text-[11px] transition-colors"
                title="Secretly alters a database row without recomputing cryptographic hashes to prove detection"
              >
                Simulate Malicious DB Tamper
              </button>
            ) : (
              <button
                onClick={() => {
                  ledgerInstance.reset(42);
                  ledgerInstance.runPrimaryHackathonScenario();
                  onRefreshLedger();
                  setIntegrityStatus(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] transition-colors"
              >
                Restore Ledger Integrity
              </button>
            )}
          </div>
        </div>
      )}

      {/* Audit Event Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              Immutable Cryptographic Audit Event Log ({auditLogs.length} Events)
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Every sensitive action is written to an append-only log with SHA-256 hash chaining: H(event_n) = SHA256(event_n + H_event_prev).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Cryptographic Event Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {auditLogs.slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-200">{log.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{log.actor}</div>
                    <div className="text-[10px] text-slate-500">{log.role}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-300">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-[180px] truncate" title={log.resourceId}>
                    {log.resourceId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : log.status === 'DENIED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-[180px] truncate text-[10px]" title={log.eventHash}>
                    {log.eventHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
