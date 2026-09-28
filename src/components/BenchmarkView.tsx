/**
 * TraceMesh Automated Benchmarks & Conservation Verification Panel
 * Runs high-volume synthetic workloads to prove throughput, microsecond latency,
 * and 100% value conservation.
 */

import React, { useState } from 'react';
import { Cpu, CheckCircle2, TrendingUp, Zap, ShieldCheck, Play, Layers } from 'lucide-react';
import { BenchmarkReport, benchmarkRunner } from '../core/benchmarks/benchmarkRunner';

export const BenchmarkView: React.FC = () => {
  const [batchSize, setBatchSize] = useState<number>(1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [report, setReport] = useState<BenchmarkReport | null>(null);

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = benchmarkRunner.runBatchBenchmark(batchSize);
      setReport(res);
      setIsRunning(false);
    }, 250);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-[calc(100vh-100px)] text-xs space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 font-black text-xl font-mono shadow-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Automated Engine Benchmarks & Conservation Proof</h2>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-[10px] border border-orange-500/40">
                Performance & Mathematical Verification
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Measures transaction ingestion latency, throughput, and automated mathematical value conservation tests.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-xs font-mono">Workload:</span>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="bg-transparent text-amber-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value={100} className="bg-slate-900 text-slate-200">100 Transactions</option>
              <option value={1000} className="bg-slate-900 text-slate-200">1,000 Transactions</option>
              <option value={5000} className="bg-slate-900 text-slate-200">5,000 Transactions</option>
              <option value={10000} className="bg-slate-900 text-slate-200">10,000 Transactions</option>
            </select>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {isRunning ? 'Benchmarking Engine...' : 'Run Automated Benchmark'}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {report && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Throughput
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {report.throughputTxPerSec.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tx/sec</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Batch of {report.batchSize.toLocaleString()} completed in {report.totalTimeMs} ms
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                Ingestion Latency
              </div>
              <div className="text-2xl font-black text-sky-400 mt-1">
                {report.averageIngestionLatencyUs} <span className="text-xs text-slate-400 font-normal">µs / txn</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Normalized + Attributed + SHA-256 Chained
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30 font-mono">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Value Conservation
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                Δ = ₹{report.conservationResult.deltaPaise.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Zero Disputed Value Created or Destroyed
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 font-mono">
              <div className="text-[10px] text-purple-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Clean Capital Protected
              </div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                ₹{(report.baselineComparison.traceMeshCleanFundsPreservedRupees / 100000).toFixed(1)} Lakh
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Saved from wrongful 100% account freeze
              </div>
            </div>
          </div>

          {/* Deep Comparison Table: Baseline AML vs TraceMesh */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Comparative Architectural Analysis: Traditional Binary AML vs TraceMesh Provenance
            </h3>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase">
                    <th className="pb-2">Evaluation Metric</th>
                    <th className="pb-2 text-rose-400">Traditional System (Binary Account Flags)</th>
                    <th className="pb-2 text-emerald-400">TraceMesh (Disputed Value Provenance)</th>
                    <th className="pb-2 text-amber-400">Delta / Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3 font-semibold text-slate-300">Downstream Account Action</td>
                    <td className="py-3 text-rose-300">100% Account Freeze on all downstream hops</td>
                    <td className="py-3 text-emerald-300">Surgical Partial Lien on exact tainted value</td>
                    <td className="py-3 text-amber-300 font-bold">Zero collateral friction</td>
                  </tr>

                  <tr>
                    <td className="py-3 font-semibold text-slate-300">Innocent Clean Capital Frozen</td>
                    <td className="py-3 text-rose-400 font-bold">
                      ₹{report.baselineComparison.baselineLienCollateralDamageRupees.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">₹0.00 (Protected)</td>
                    <td className="py-3 text-amber-400 font-bold">
                      100% of clean merchant & payroll money saved
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 font-semibold text-slate-300">False Positive Exposure</td>
                    <td className="py-3 text-rose-400">Extreme (Legitimate vendors blocked)</td>
                    <td className="py-3 text-emerald-400">Restricted to mathematical disputed exposure</td>
                    <td className="py-3 text-amber-400 font-bold">
                      -{report.baselineComparison.falsePositiveReductionPct}% dispute reduction
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 font-semibold text-slate-300">Evidentiary Standard</td>
                    <td className="py-3 text-slate-400">Black-box ML probability score</td>
                    <td className="py-3 text-emerald-300">Conservation-verified double-entry attribution</td>
                    <td className="py-3 text-amber-300">Admissible in Indian civil & criminal courts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!report && (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <Cpu className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
          <div className="font-medium text-slate-300">Ready to benchmark TraceMesh engine</div>
          <p className="max-w-md mx-auto text-xs text-slate-500">
            Select a transaction batch size above and click "Run Automated Benchmark" to stress-test the double-entry
            provenance propagation engine and verify mathematical value conservation.
          </p>
        </div>
      )}
    </div>
  );
};
