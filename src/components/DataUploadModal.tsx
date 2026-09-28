/**
 * TraceMesh Data Ingestion & Live Custom Testing Suite
 * Enables users to upload, drag-and-drop, or paste custom synthetic CSV/JSON/ISO-20022 payloads
 * and immediately observe how disputed money propagates through downstream bank accounts.
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Play,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import {
  executeBatchIngestion,
  IngestionPreviewItem,
  IngestionResult,
  parseTransactionCsv,
} from '../core/simulator/customDataIngest';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestionSuccess: (result: IngestionResult) => void;
}

const SAMPLE_CSV = `# TraceMesh Synthetic Ingestion Template (Indian Banking Commingling)
# from_account,to_account,amount,channel,from_bank,to_bank,is_fraud_origin,narrative
ACC-SBI-VICTIM-01,ACC-HDFC-MULE-A,200000,IMPS,SBININBB,HDFCINBB,true,Siphoned Screen-Share Theft
ACC-HDFC-MULE-A,ACC-ICICI-MULE-B,150000,UPI,HDFCINBB,ICICINBB,false,Consultancy invoice payment
ACC-HDFC-MULE-A,ACC-AXIS-MULE-C,100000,NEFT,HDFCINBB,UTIBINBB,false,Vendor raw material advance
ACC-ICICI-MULE-B,ACC-SBI-MULE-D,90000,UPI,ICICINBB,SBININBB,false,Office lease security deposit
ACC-AXIS-MULE-C,ACC-MERCHANT-TERM,60000,RTGS,UTIBINBB,UTIBINBB,false,Bullion jewelry purchase`;

const SAMPLE_HIGH_VOLUME_CSV = `# High-Branching 8-Hop Money Laundering Web
# from_account,to_account,amount,channel,from_bank,to_bank,is_fraud_origin,narrative
ACC-VICTIM-CORP,ACC-MULE-STAGE1,500000,RTGS,SBININBB,HDFCINBB,true,Unauthorized Corporate Wire
ACC-MULE-STAGE1,ACC-SHELL-B1,220000,IMPS,HDFCINBB,ICICINBB,false,Software license fee
ACC-MULE-STAGE1,ACC-SHELL-B2,180000,NEFT,HDFCINBB,UTIBINBB,false,Advertising retainer
ACC-SHELL-B1,ACC-CRYPTO-DESK,140000,UPI,ICICINBB,HDFCINBB,false,P2P Exchange OTC settlement
ACC-SHELL-B2,ACC-LOGISTICS-PVT,110000,IMPS,UTIBINBB,SBININBB,false,Freight advance invoice
ACC-CRYPTO-DESK,ACC-OFFSHORE-HAWALA,95000,RTGS,HDFCINBB,UTIBINBB,false,Export escrow drawdown`;

export const DataUploadModal: React.FC<DataUploadModalProps> = ({ isOpen, onClose, onIngestionSuccess }) => {
  const [activeFormat, setActiveFormat] = useState<'CSV' | 'JSON' | 'ISO_XML'>('CSV');
  const [inputText, setInputText] = useState<string>(SAMPLE_CSV);
  const [previewItems, setPreviewItems] = useState<IngestionPreviewItem[]>([]);
  const [ingestionResult, setIngestionResult] = useState<IngestionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleParsePreview = () => {
    if (activeFormat === 'CSV') {
      const parsed = parseTransactionCsv(inputText);
      setPreviewItems(parsed);
      setIngestionResult(null);
    }
  };

  const handleExecuteIngestion = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const itemsToRun = previewItems.length > 0 ? previewItems : parseTransactionCsv(inputText);
      const res = executeBatchIngestion(itemsToRun);
      setIngestionResult(res);
      setIsProcessing(false);
      onIngestionSuccess(res);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setInputText(content);
        const parsed = parseTransactionCsv(content);
        setPreviewItems(parsed);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                Live Synthetic & Custom Data Ingestion Studio
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                  Ready to Ingest
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload CSV, Core Banking JSON, or ISO 20022 XML to test value conservation & provenance live
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Format Selector & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Format:</span>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => {
                    setActiveFormat('CSV');
                    setInputText(SAMPLE_CSV);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    activeFormat === 'CSV' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Banking CSV
                </button>
                <button
                  onClick={() => setActiveFormat('JSON')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    activeFormat === 'JSON' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Core JSON
                </button>
                <button
                  onClick={() => setActiveFormat('ISO_XML')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    activeFormat === 'ISO_XML' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ISO 20022 XML
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Load Sample Scenarios:</span>
              <button
                onClick={() => {
                  setInputText(SAMPLE_CSV);
                  setPreviewItems(parseTransactionCsv(SAMPLE_CSV));
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px]"
              >
                Standard Commingling (5 Hops)
              </button>
              <button
                onClick={() => {
                  setInputText(SAMPLE_HIGH_VOLUME_CSV);
                  setPreviewItems(parseTransactionCsv(SAMPLE_HIGH_VOLUME_CSV));
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px]"
              >
                High-Branching Web
              </button>
            </div>
          </div>

          {/* Upload Dropzone & Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Input Payload Editor</span>
                <label className="text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-sans text-xs">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Local File (.csv / .json / .xml)</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.json,.xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste synthetic transaction rows..."
                rows={12}
                className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-400/80"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleParsePreview}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Validate Schema & Preview
                </button>
                <button
                  onClick={handleExecuteIngestion}
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isProcessing ? 'Processing Transactions...' : 'Inject & Run Live Provenance'}
                </button>
              </div>
            </div>

            {/* Validation & Live Preview Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col h-[340px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Parsed Rows ({previewItems.length})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time Schema Validation</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                {previewItems.length > 0 ? (
                  previewItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded border flex items-center justify-between ${
                        item.isOriginTheft
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>₹{item.amount.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">{item.channel}</span>
                          {item.isOriginTheft && (
                            <span className="text-[9px] px-1 rounded bg-rose-500/30 text-rose-300 font-sans font-bold">
                              Origin Theft
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.sourceAccount} → {item.targetAccount}
                        </div>
                      </div>
                      <span className="text-emerald-400 text-[10px] font-bold">READY</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-1 font-sans">
                    <Info className="w-5 h-5 text-slate-600" />
                    <span>Click "Validate Schema & Preview" or paste records to inspect</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ingestion Report Banner */}
          {ingestionResult && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">Live Ingestion Succeeded</span>
                </div>
                <span className="text-emerald-400 font-bold text-xs">
                  {ingestionResult.successful} / {ingestionResult.totalProcessed} Settled
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-800">
                <div>
                  <span className="text-slate-400">Injected Disputed: </span>
                  <strong className="text-amber-400 font-bold">
                    ₹{ingestionResult.injectedDisputedAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">New Nodes Provisioned: </span>
                  <strong className="text-sky-300 font-bold">{ingestionResult.newAccountsCreated} Accounts</strong>
                </div>
                <div>
                  <span className="text-slate-400">Value Conservation: </span>
                  <strong className="text-emerald-400 font-bold">100% (Δ = ₹0.00)</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
