/**
 * TraceMesh Red-Team Adversarial Sandbox
 * Interactive security test harness demonstrating zero-trust tenant boundaries,
 * prompt-injection sanitization, and cryptographic hash chain tamper detection.
 */

import React, { useState } from 'react';
import {
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCcw,
  AlertOctagon,
  Lock,
  Hash,
  EyeOff,
} from 'lucide-react';
import { RedTeamAttackVector, securityService } from '../core/security/securityService';
import { AuditEvent } from '../types';

export const RedTeamSandbox: React.FC = () => {
  const attacks = securityService.getRedTeamAttackVectors();
  const [selectedAttackId, setSelectedAttackId] = useState<string>(attacks[0].id);
  const [executionResult, setExecutionResult] = useState<{
    attack: RedTeamAttackVector;
    success: boolean;
    actualResult: string;
    details: string;
    auditEvent: AuditEvent;
  } | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);

  const selectedAttack = attacks.find((a) => a.id === selectedAttackId) || attacks[0];

  const handleLaunchAttack = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = securityService.executeAttack(selectedAttack.id);
      setExecutionResult(res);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 font-black text-xl font-mono shadow-lg">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Zero-Trust Adversarial Red-Team Sandbox</h2>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/40">
                Automated Exploit Harness
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Simulates real-world attack vectors against TraceMesh ABAC boundaries, cryptographic hash chains, and LLM input sanitizers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchAttack}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {isRunning ? 'Executing Payload...' : 'Launch Selected Exploit'}
          </button>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Attack Vector Catalog */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 mb-2">
            Adversarial Attack Vectors ({attacks.length})
          </h3>

          <div className="space-y-2">
            {attacks.map((atk) => {
              const isSelected = selectedAttackId === atk.id;
              return (
                <div
                  key={atk.id}
                  onClick={() => {
                    setSelectedAttackId(atk.id);
                    setExecutionResult(null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[11px] text-rose-400">{atk.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {atk.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs">{atk.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{atk.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Exploit Inspection & Live Execution Console */}
        <div className="lg:col-span-2 space-y-5">
          {/* Attack Definition Dossier */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                  {selectedAttack.category} Vector Spec
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedAttack.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs">
                Expected: {selectedAttack.expectedResult}
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">{selectedAttack.description}</p>

            <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Simulated Attacker Persona</div>
                <div className="text-slate-200 font-bold">{selectedAttack.attackerContext.username}</div>
                <div className="text-slate-400">
                  Role: {selectedAttack.attackerContext.role} ({selectedAttack.attackerContext.institutionId || 'N/A'})
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Defensive Control Responsible</div>
                <div className="text-emerald-400 font-bold">{selectedAttack.controlResponsible}</div>
                <div className="text-slate-400">Zero-Trust Gatekeeper</div>
              </div>
            </div>

            {/* Injected Payload Preview */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Injected Attack Payload</div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300 overflow-x-auto">
                <pre>{JSON.stringify(selectedAttack.payload, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Live Execution Output Result */}
          {executionResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {executionResult.success ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-rose-400" />
                  )}
                  <h3 className="font-bold text-white text-sm">
                    Defensive Evaluation: {executionResult.success ? 'EXPLOIT NEUTRALIZED' : 'EXPLOIT SUCCEEDED (VULNERABLE)'}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    executionResult.success
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {executionResult.actualResult}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 font-sans">
                <div className="text-slate-300 font-medium">Forensic System Response:</div>
                <p className="text-slate-400 leading-relaxed font-mono text-[11px]">{executionResult.details}</p>
              </div>

              {/* Cryptographic Audit Trail of the Attack */}
              <div className="space-y-2">
                <div className="text-[10px] text-slate-500 uppercase font-mono flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  Immutable Audit Ledger Chaining
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <div>
                    Event ID: <strong className="text-slate-200">{executionResult.auditEvent.id}</strong> | Actor:{' '}
                    <strong className="text-slate-200">{executionResult.auditEvent.actor}</strong>
                  </div>
                  <div className="break-all">Prev Hash: {executionResult.auditEvent.previousEventHash}</div>
                  <div className="break-all text-amber-300">Event SHA-256: {executionResult.auditEvent.eventHash}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
