/**
 * TraceMesh Investigation Cases Ledger View
 * Case management table displaying active cyber fraud cases,
 * disputed theft origins, downstream exposure, involved banks, and forensic status.
 */

import React, { useState } from 'react';
import { Folder, Search, Eye, ShieldAlert, ArrowRight, Building, Plus, Clock, UserCheck } from 'lucide-react';
import { InvestigationCase, InstitutionId } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface CasesViewProps {
  cases: InvestigationCase[];
  onSelectCase: (caseId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  onSelectCase,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q) ||
      c.fraudOrigin.initialTransactionId.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Folder className="w-4 h-4 text-amber-400" />
              Active Cyber Crime Investigation Cases
            </h2>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
              {cases.length} REGISTERED INCIDENTS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Cross-institution financial crime investigations registered under CFCFRMS / I4C protocols.
          </p>
        </div>

        <button
          onClick={() => {
            onSelectCase('CASE-2026-00041');
            onNavigateTab('investigate');
          }}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Open Primary Case DAG (CASE-00041)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, title, investigator..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 font-mono uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="OPEN" className="bg-slate-900">OPEN</option>
              <option value="UNDER_REVIEW" className="bg-slate-900">UNDER_REVIEW</option>
              <option value="LIEN_ISSUED" className="bg-slate-900">LIEN_ISSUED</option>
              <option value="RECOVERED" className="bg-slate-900">RECOVERED</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Showing <strong className="text-slate-200">{filteredCases.length}</strong> of {cases.length} Cases
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Initial Disputed Theft</th>
                <th className="py-3 px-4 text-right">Current Exposure</th>
                <th className="py-3 px-4 text-center">Hops</th>
                <th className="py-3 px-4">Involved Banks</th>
                <th className="py-3 px-4">Lead Investigator</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectCase(c.id);
                    onNavigateTab('investigate');
                  }}
                >
                  <td className="py-3.5 px-4 font-bold text-amber-300 group-hover:underline">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-slate-200">{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Origin Tx: {c.fraudOrigin.initialTransactionId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : c.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                    ₹{c.disputedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                    ₹{c.currentAttributedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {c.traceDepth} hops
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-1.5">
                      {c.involvedInstitutions.map((instId) => {
                        const inst = INSTITUTIONS.find((i) => i.id === instId);
                        return (
                          <span
                            key={instId}
                            style={{ backgroundColor: `${inst?.color}20`, borderColor: inst?.color }}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-200 border"
                          >
                            {inst?.code || instId.slice(0, 4)}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans text-[11px]">
                    {c.leadInvestigator}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.id);
                        onNavigateTab('investigate');
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/40 transition-colors flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-3 h-3" />
                      View DAG
                    </button>
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
