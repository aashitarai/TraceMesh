/**
 * TraceMesh Clean Institutional Shell
 * Professional, modern, and uncluttered interface for hackathon juries and bank executives.
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Eye,
  CreditCard,
  FileText,
  Shield,
  Terminal,
  Cpu,
  BookOpen,
  Search,
  Play,
  Sparkles,
  Activity,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { InstitutionId, ProvenanceModelType, SecurityRole } from '../types';
import { AUTH_PERSONAS, AuthPersona } from '../core/auth/personas';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPersona: AuthPersona;
  onSelectPersona: (persona: AuthPersona) => void;
  provenanceModel: ProvenanceModelType;
  setProvenanceModel: (model: ProvenanceModelType) => void;
  selectedInstitution: InstitutionId;
  onRunDemoScenario: () => void;
  onResetLedger: () => void;
  onOpenAiAssistant: () => void;
  onStartTour: () => void;
  onOpenDataUpload: () => void;
  onOpenPitchDeck: () => void;
  onOpenSearch: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  setActiveTab,
  currentPersona,
  onSelectPersona,
  provenanceModel,
  setProvenanceModel,
  selectedInstitution,
  onRunDemoScenario,
  onResetLedger,
  onOpenAiAssistant,
  onStartTour,
  onOpenDataUpload,
  onOpenPitchDeck,
  onOpenSearch,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const inst = INSTITUTIONS.find((i) => i.id === selectedInstitution) || INSTITUTIONS[0];

  const primaryNav = [
    { id: 'overview', label: 'Overview & Story', icon: LayoutDashboard },
    { id: 'investigate', label: 'Money Flow Graph', icon: Eye, badge: 'Active Scam' },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'accounts', label: 'Accounts & Balances', icon: CreditCard },
  ];

  const toolsNav = [
    { id: 'bank_ops', label: 'Smart Freeze Desk', icon: Shield },
    { id: 'security', label: 'Security & Audit', icon: ShieldCheck },
    { id: 'red_team', label: 'Security Test Lab', icon: Terminal },
    { id: 'benchmarks', label: 'Speed Benchmarks', icon: Cpu },
    { id: 'architecture', label: 'Full Architecture', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Professional Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur">
        <div className="px-5 py-2.5 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-sm font-mono">
              TM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white font-mono">
                  TRACE<span className="text-amber-400">MESH</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30">
                  Citi × NPCI Drunix 2026
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                We follow the money — even after it gets mixed.
              </div>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-sm hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                <span className="text-slate-400 text-xs">Search accounts, transactions...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500 text-[11px] mr-1.5 hidden sm:inline">Role:</span>
              <select
                value={currentPersona.id}
                onChange={(e) => {
                  const found = AUTH_PERSONAS.find((p) => p.id === e.target.value);
                  if (found) onSelectPersona(found);
                }}
                className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                {AUTH_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    {p.name} ({p.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Guided Tour Button */}
            <button
              onClick={onStartTour}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Tour</span>
            </button>

            {/* Pitch Deck Button */}
            <button
              onClick={onOpenPitchDeck}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Slides</span>
            </button>

            {/* Demo Reset */}
            <button
              onClick={onRunDemoScenario}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors flex items-center gap-1"
              title="Reset to 5-Hop Demo Scam"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Demo Scam</span>
            </button>

            <button
              onClick={onResetLedger}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 transition-colors"
              title="Reset Ledger State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Shell with Sidebar + View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Persistent Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-16' : 'w-52'
          } border-r border-slate-800/80 bg-slate-900/60 backdrop-blur transition-all duration-200 flex flex-col justify-between shrink-0 select-none z-30`}
        >
          {/* Navigation Items */}
          <div className="p-2 space-y-4 overflow-y-auto">
            {/* Primary Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Investigation
                </div>
              )}
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Operations & Security Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Bank Tools & Security
                </div>
              )}
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <span className="truncate text-left">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer & Collapse Toggle */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="text-slate-200 font-semibold truncate text-[11px]">{currentPersona.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentPersona.designation}</div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mx-auto"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>
        </aside>

        {/* View Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};
