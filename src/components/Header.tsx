/**
 * TraceMesh Master Navigation & Role Context Header
 */

import React from 'react';
import {
  Shield,
  Eye,
  Database,
  Terminal,
  Cpu,
  FileText,
  Activity,
  Play,
  UploadCloud,
  Sparkles,
  User,
} from 'lucide-react';
import { InstitutionId, ProvenanceModelType, SecurityRole } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';
import { AUTH_PERSONAS, AuthPersona } from '../core/auth/personas';

interface HeaderProps {
  currentRole: SecurityRole;
  setCurrentRole: (role: SecurityRole) => void;
  selectedInstitution: InstitutionId;
  setSelectedInstitution: (inst: InstitutionId) => void;
  currentPersona: AuthPersona;
  onSelectPersona: (persona: AuthPersona) => void;
  provenanceModel: ProvenanceModelType;
  setProvenanceModel: (model: ProvenanceModelType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDemoScenario: () => void;
  onResetLedger: () => void;
  onOpenAiAssistant: () => void;
  onStartTour: () => void;
  onOpenDataUpload: () => void;
  onOpenPitchDeck: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  selectedInstitution,
  setSelectedInstitution,
  currentPersona,
  onSelectPersona,
  provenanceModel,
  setProvenanceModel,
  activeTab,
  setActiveTab,
  onRunDemoScenario,
  onResetLedger,
  onOpenAiAssistant,
  onStartTour,
  onOpenDataUpload,
  onOpenPitchDeck,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur">
      {/* Top Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
            Inter-Bank Production Network
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Active Cyber Case: <strong className="text-white font-mono">CASE-2026-00041</strong>
          </span>
          <span className="text-amber-400/90 font-mono">Disputed Value: ₹2,00,000.00</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartTour}
            className="px-2.5 py-1 rounded bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
            title="Start automated guided tour with voice commentary"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Audio-Narrated Tour
          </button>

          <button
            onClick={onOpenDataUpload}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs border border-sky-500/30 transition-colors flex items-center gap-1.5"
            title="Upload CSV or JSON synthetic data"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Test Data
          </button>

          <button
            onClick={onOpenPitchDeck}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pitch Deck
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-sky-400/40"
          >
            <Cpu className="w-3.5 h-3.5" />
            AI Tool Gateway
          </button>

          <button
            onClick={onRunDemoScenario}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
            title="Reset to the 5-Hop Commingling Demo"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            Standard Flow
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg font-mono">
            TM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-mono">
                TRACE<span className="text-amber-400">MESH</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                PROD-READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              We follow the money — even after it gets mixed.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('investigator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'investigator'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Investigator Graph
          </button>

          <button
            onClick={() => setActiveTab('bank_ops')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'bank_ops'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Bank Ops Desk
          </button>

          <button
            onClick={() => setActiveTab('regulator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'regulator'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Regulator View
          </button>

          <button
            onClick={() => setActiveTab('raw_inspector')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'raw_inspector'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            ISO 20022 Inspector
          </button>

          <button
            onClick={() => setActiveTab('red_team')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'red_team'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Red-Team Sandbox
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'benchmarks'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Benchmarks
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-slate-700 text-white border border-slate-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Architecture Spec
          </button>
        </nav>

        {/* Persona & Provenance Controls */}
        <div className="flex items-center gap-2">
          {/* Provenance Model Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono mr-1.5">Model:</span>
            <select
              value={provenanceModel}
              onChange={(e) => setProvenanceModel(e.target.value as ProvenanceModelType)}
              className="bg-transparent text-amber-300 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="PROPORTIONAL" className="bg-slate-900 text-slate-200">
                Pro-Rata Commingling
              </option>
              <option value="FIFO" className="bg-slate-900 text-slate-200">
                FIFO (Clayton's Rule)
              </option>
              <option value="LIFO" className="bg-slate-900 text-slate-200">
                LIFO (Recent First)
              </option>
              <option value="LOWEST_INTERMEDIATE" className="bg-slate-900 text-slate-200">
                LIBR (Lowest Intermediate)
              </option>
            </select>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono mr-1.5">User:</span>
            <select
              value={currentPersona.id}
              onChange={(e) => {
                const found = AUTH_PERSONAS.find((p) => p.id === e.target.value);
                if (found) onSelectPersona(found);
              }}
              className="bg-transparent text-sky-300 font-semibold text-xs focus:outline-none cursor-pointer max-w-[190px] truncate"
            >
              {AUTH_PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name} ({p.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
