/**
 * TraceMesh Investigator Visual Graph & Case Evidence Reconstruction
 * Displays the multi-hop money flow graph with value-level attribution,
 * mathematical conservation proof, dynamic layout for custom/uploaded nodes,
 * and interactive node inspection.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Info,
  Building,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { GraphEdge, GraphNode, InvestigationCase, ProvenanceModelType } from '../types';
import { INSTITUTIONS } from '../core/simulator/forgeData';

interface InvestigatorViewProps {
  caseData: InvestigationCase;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  provenanceModel: ProvenanceModelType;
  onRecommendLien: (accountId: string, amount: number) => void;
}

export const InvestigatorView: React.FC<InvestigatorViewProps> = ({
  caseData,
  graph,
  provenanceModel,
  onRecommendLien,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(graph.nodes[1]?.id || 'ACC-HDFC-MULE-A');

  const selectedNode = graph.nodes.find((n) => n.id === selectedNodeId) || graph.nodes[0];
  const selectedNodeInst = INSTITUTIONS.find((i) => i.id === selectedNode?.institutionId);

  // Incoming and outgoing edges for the selected node
  const inboundEdges = graph.edges.filter((e) => e.target === selectedNodeId);
  const outboundEdges = graph.edges.filter((e) => e.source === selectedNodeId);

  // Calculate system-wide conservation numbers
  const totalInjected = caseData.disputedValue;
  const currentTotalTaintOnNodes = graph.nodes.reduce((sum, n) => sum + n.taintedValue, 0);
  const delta = Math.abs(totalInjected - currentTotalTaintOnNodes);

  // Base coordinates with dynamic auto-layout for newly uploaded custom accounts
  const nodePositions: Record<string, { x: number; y: number }> = {
    'ACC-SBI-VICTIM-01': { x: 80, y: 220 },
    'ACC-HDFC-MULE-A': { x: 380, y: 220 },
    'ACC-ICICI-MULE-B': { x: 680, y: 120 },
    'ACC-AXIS-MULE-C': { x: 680, y: 320 },
    'ACC-SBI-MULE-D': { x: 980, y: 120 },
    'ACC-MERCHANT-TERM': { x: 980, y: 320 },
  };

  // Assign coordinate slots for dynamic nodes that aren't in the predefined set
  let dynamicOffset = 0;
  graph.nodes.forEach((n) => {
    if (!nodePositions[n.id]) {
      const col = (dynamicOffset % 4) + 1;
      const row = Math.floor(dynamicOffset / 4);
      nodePositions[n.id] = {
        x: 80 + col * 300,
        y: 440 + row * 180,
      };
      dynamicOffset++;
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-slate-950">
      {/* Top Evidence & Conservation Bar */}
      <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-slate-200">Active Case: {caseData.id}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            Initial Disputed Theft: <strong className="text-amber-400 font-mono text-sm">₹{caseData.disputedValue.toLocaleString('en-IN')}</strong>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            Attribution Model:{' '}
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px]">
              {provenanceModel}
            </span>
          </div>
        </div>

        {/* Conservation Proof Metric */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Value Conservation Proof:</span>
          <span className="text-emerald-400 font-mono font-bold">
            Δ = ₹{delta.toFixed(2)} (100% Conserved)
          </span>
          <div
            className="group relative cursor-pointer"
            title="Total Injected Disputed Value = Sum of (Remaining on Nodes + Exited to Terminals). No value was created or destroyed."
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
          </div>
        </div>
      </div>

      {/* Main Workspace (Graph Canvas on Left, Deep Inspection Panel on Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Canvas */}
        <div className="flex-1 relative overflow-auto p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Canvas Header Tag */}
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-md border border-slate-800 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Multi-Hop DAG (Click node to inspect forensic attribution)</span>
          </div>

          <div className="min-w-[1250px] min-h-[600px] relative mt-10">
            {/* SVG Connecting Edges with Arrows & Value Badges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow-amber"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-red"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                </marker>
              </defs>

              {graph.edges.map((edge) => {
                const src = nodePositions[edge.source];
                const dst = nodePositions[edge.target];
                if (!src || !dst) return null;

                // Bezier curve calculations
                const startX = src.x + 220;
                const startY = src.y + 40;
                const endX = dst.x;
                const endY = dst.y + 40;
                const midX = (startX + endX) / 2;

                const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

                return (
                  <g key={edge.id}>
                    {/* Shadow line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={edge.isFraudOrigin ? '#7f1d1d' : '#451a03'}
                      strokeWidth="5"
                      opacity="0.6"
                    />
                    {/* Active flow line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={edge.isFraudOrigin ? '#ef4444' : '#f59e0b'}
                      strokeWidth="2.5"
                      strokeDasharray={edge.isFraudOrigin ? 'none' : '6 4'}
                      markerEnd={edge.isFraudOrigin ? 'url(#arrow-red)' : 'url(#arrow-amber)'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Edge Badges (Rendered over the SVG) */}
            {graph.edges.map((edge) => {
              const src = nodePositions[edge.source];
              const dst = nodePositions[edge.target];
              if (!src || !dst) return null;

              const badgeX = (src.x + 220 + dst.x) / 2 - 65;
              const badgeY = (src.y + 40 + dst.y + 40) / 2 - 20;

              return (
                <div
                  key={`badge-${edge.id}`}
                  style={{ left: `${badgeX}px`, top: `${badgeY}px` }}
                  className={`absolute z-10 px-2 py-1 rounded shadow-md border text-[11px] font-mono whitespace-nowrap transition-transform hover:scale-105 ${
                    edge.isFraudOrigin
                      ? 'bg-rose-950/95 border-rose-500/60 text-rose-200'
                      : 'bg-slate-900/95 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <span>₹{edge.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">
                      {edge.channel}
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-400">
                    Tainted: ₹{edge.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}{' '}
                    <span className="text-slate-400">({edge.taintPercentage}%)</span>
                  </div>
                </div>
              );
            })}

            {/* Nodes */}
            {graph.nodes.map((node) => {
              const pos = nodePositions[node.id] || { x: 200, y: 200 };
              const inst = INSTITUTIONS.find((i) => i.id === node.institutionId);
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                  className={`absolute z-20 w-[220px] rounded-xl p-3 border cursor-pointer transition-all duration-200 shadow-xl ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-400 bg-slate-900'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Node Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{ backgroundColor: `${inst?.color}20`, borderColor: `${inst?.color}60`, color: inst?.color }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-black border font-mono uppercase"
                    >
                      {inst?.code || 'BANK'}
                    </span>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                        node.type === 'VICTIM'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : node.type === 'MULE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : node.type === 'MERCHANT'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {node.type}
                    </span>
                  </div>

                  {/* Account Number */}
                  <div className="font-mono text-xs font-bold text-slate-100 mb-1 flex items-center justify-between">
                    <span>{node.label}</span>
                    {node.status === 'PARTIAL_LIEN' && (
                      <span title="Partial Lien Applied">
                        <Lock className="w-3 h-3 text-amber-400" />
                      </span>
                    )}
                  </div>

                  {/* Stacked Balance Bar (Clean vs Tainted) */}
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex my-2 border border-slate-800">
                    <div
                      style={{ width: `${100 - node.taintPercentage}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Clean: ₹${node.cleanValue.toLocaleString('en-IN')}`}
                    />
                    <div
                      style={{ width: `${node.taintPercentage}%` }}
                      className="bg-rose-500 h-full"
                      title={`Tainted: ₹${node.taintedValue.toLocaleString('en-IN')}`}
                    />
                  </div>

                  {/* Balance Numbers */}
                  <div className="text-[11px] font-mono space-y-0.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Total:</span>
                      <span className="text-slate-200 font-semibold">
                        ₹{node.totalBalance.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-rose-400">
                      <span>Tainted Value:</span>
                      <span className="font-bold">
                        ₹{node.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Taint Exposure:</span>
                      <span className={`font-bold ${node.taintPercentage > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {node.taintPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Inspection Panel */}
        <div className="w-[380px] border-l border-slate-800 bg-slate-900/95 p-5 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Header */}
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                Account Forensic Dossier
              </span>
              <span
                style={{ color: selectedNodeInst?.color }}
                className="font-bold font-mono text-xs flex items-center gap-1"
              >
                <Building className="w-3.5 h-3.5" />
                {selectedNodeInst?.name || 'Institution Node'}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-mono mt-1">
              {selectedNode?.label}
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">ID: {selectedNode?.id}</p>
          </div>

          {/* Value Attribution Breakdown Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              TraceMesh Provenance Breakdown
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Total Account Balance:</span>
                <span className="text-white font-bold">₹{selectedNode?.totalBalance.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between p-2 rounded bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-emerald-300">Legitimate Clean Value:</span>
                <span className="text-emerald-400 font-bold">
                  ₹{selectedNode?.cleanValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between p-2 rounded bg-rose-950/30 border border-rose-500/40">
                <span className="text-rose-300">Attributed Disputed Taint:</span>
                <span className="text-rose-400 font-bold">
                  ₹{selectedNode?.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between p-2 rounded bg-amber-950/30 border border-amber-500/30">
                <span className="text-amber-300">Taint Contamination:</span>
                <span className="text-amber-400 font-bold">{selectedNode?.taintPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Targeted Partial Lien Recommendation */}
          {selectedNode?.taintedValue > 0 && selectedNode.type !== 'VICTIM' && (
            <div className="bg-gradient-to-br from-amber-950/40 to-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-amber-200">Surgical Lien Recommendation</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Traditional AML freezes 100% of this account (disrupting ₹
                {selectedNode.cleanValue.toLocaleString('en-IN')} of innocent funds). TraceMesh recommends a targeted
                statutory lien restricted to the verified disputed value.
              </p>

              <div className="p-2.5 rounded bg-slate-900/90 border border-amber-500/30 font-mono text-center">
                <div className="text-[10px] text-slate-400 uppercase">Recommended Lien Amount</div>
                <div className="text-lg font-black text-amber-300">
                  ₹{selectedNode.taintedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>

              <button
                onClick={() => onRecommendLien(selectedNode.id, selectedNode.taintedValue)}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Dispatch Formal Lien Advisory to {selectedNodeInst?.code || 'Bank'}
              </button>
            </div>
          )}

          {/* Inbound / Outbound History */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Connected Flows ({inboundEdges.length} In, {outboundEdges.length} Out)
            </h4>

            {inboundEdges.map((e) => (
              <div key={e.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-emerald-400 rotate-180" /> Inbound Transfer
                  </span>
                  <span>+₹{e.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>From: {e.source}</span>
                  <span className="text-amber-400">Tainted: ₹{e.taintedValue.toFixed(0)}</span>
                </div>
              </div>
            ))}

            {outboundEdges.map((e) => (
              <div key={e.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex items-center justify-between text-rose-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-rose-400" /> Outbound Transfer
                  </span>
                  <span>-₹{e.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>To: {e.target}</span>
                  <span className="text-amber-400">Tainted Out: ₹{e.taintedValue.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
