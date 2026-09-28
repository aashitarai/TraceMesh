/**
 * TraceMesh Master Application Entry
 * Disputed Value Provenance & Financial Crime Investigation Infrastructure Layer
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroStorySection } from './components/HeroStorySection';
import { InvestigatorView } from './components/InvestigatorView';
import { BankOpsView } from './components/BankOpsView';
import { RegulatorView } from './components/RegulatorView';
import { RawInspectorView } from './components/RawInspectorView';
import { RedTeamSandbox } from './components/RedTeamSandbox';
import { BenchmarkView } from './components/BenchmarkView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { AiInvestigatorModal } from './components/AiInvestigatorModal';
import { GuidedTourPlayer } from './components/GuidedTourPlayer';
import { DataUploadModal } from './components/DataUploadModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { ledgerInstance } from './core/ledger/ledger';
import { AUTH_PERSONAS, AuthPersona } from './core/auth/personas';
import { IngestionResult } from './core/simulator/customDataIngest';
import {
  Account,
  EnrichedTransaction,
  InstitutionId,
  InvestigationCase,
  ProvenanceModelType,
  SecurityRole,
  UserSecurityContext,
} from './types';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState<AuthPersona>(AUTH_PERSONAS[5]); // Default: Inspector Vikram Sen (Investigator)
  const [currentRole, setCurrentRole] = useState<SecurityRole>(currentPersona.role);
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionId>(currentPersona.institutionId || 'HDFCINBB');
  const [provenanceModel, setProvenanceModel] = useState<ProvenanceModelType>('PROPORTIONAL');
  const [activeTab, setActiveTab] = useState<string>('investigator');

  // Modals & Tour States
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isDataUploadOpen, setIsDataUploadOpen] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [showHeroStory, setShowHeroStory] = useState<boolean>(true);

  // Core Ledger Reactive State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [caseData, setCaseData] = useState<InvestigationCase | null>(null);
  const [graph, setGraph] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Sync state from ledgerInstance
  const refreshFromLedger = () => {
    const accs = ledgerInstance.getAccounts();
    const txs = ledgerInstance.getTransactions();
    const c = ledgerInstance.getCase('CASE-2026-00041') || ledgerInstance.getCases()[0];
    const g = ledgerInstance.getCaseGraph('CASE-2026-00041');

    setAccounts([...accs]);
    setTransactions([...txs]);
    if (c) setCaseData({ ...c });
    setGraph({ ...g });
  };

  useEffect(() => {
    refreshFromLedger();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Switch Authenticated Persona
  const handleSelectPersona = (persona: AuthPersona) => {
    setCurrentPersona(persona);
    setCurrentRole(persona.role);
    if (persona.institutionId) {
      setSelectedInstitution(persona.institutionId);
    }
    showToast(`Logged in as ${persona.name} (${persona.designation})`);
  };

  // Re-run standard primary scenario
  const handleRunDemoScenario = () => {
    ledgerInstance.reset(42);
    ledgerInstance.setProvenanceModel(provenanceModel);
    ledgerInstance.runPrimaryHackathonScenario();
    refreshFromLedger();
    setActiveTab('investigator');
    showToast('Demo Flow Initialized: ₹2,00,000 theft commingled with ₹5,00,000 clean funds at Mule A.');
  };

  // Reset the ledger
  const handleResetLedger = () => {
    ledgerInstance.reset(42);
    refreshFromLedger();
    showToast('Ledger state reset to baseline.');
  };

  // Change Provenance Model & Re-propagate
  const handleModelChange = (model: ProvenanceModelType) => {
    setProvenanceModel(model);
    ledgerInstance.setProvenanceModel(model);
    ledgerInstance.reset(42);
    ledgerInstance.setProvenanceModel(model);
    ledgerInstance.runPrimaryHackathonScenario();
    refreshFromLedger();
    showToast(`Active attribution model updated to ${model}. Graph re-evaluated.`);
  };

  // Execute or Recommend Partial Lien
  const handleLienAction = (accountId: string, amount: number) => {
    const acc = ledgerInstance.getAccount(accountId);
    if (!acc) return;

    acc.status = 'PARTIAL_LIEN';
    acc.activeLienAmount = amount;

    ledgerInstance.recordAudit({
      actor: currentPersona.name,
      role: currentPersona.role,
      institutionId: acc.institutionId,
      action: 'APPROVE_LIEN',
      resourceId: accountId,
      status: 'SUCCESS',
      reason: `Statutory surgical partial lien of ₹${amount.toFixed(2)} placed under CFCFRMS case protocol. Clean funds protected: ₹${acc.cleanValue.toFixed(2)}`,
      clientIp: '10.0.8.21',
    });

    refreshFromLedger();
    showToast(`Surgical Partial Lien of ₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} executed on ${acc.accountNumberMasked}.`);
  };

  // Custom data ingestion handler
  const handleIngestionComplete = (result: IngestionResult) => {
    refreshFromLedger();
    setActiveTab('investigator');
    showToast(`Custom Data Ingested: ${result.successful} transactions settled. Total Disputed: ₹${result.injectedDisputedAmount.toLocaleString('en-IN')}`);
  };

  const securityContext: UserSecurityContext = {
    userId: currentPersona.id,
    username: currentPersona.email,
    role: currentPersona.role,
    institutionId: currentPersona.institutionId,
    clearanceLevel: currentPersona.clearanceLevel,
    activeCaseId: 'CASE-2026-00041',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-slideUp">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedInstitution={selectedInstitution}
        setSelectedInstitution={setSelectedInstitution}
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
        provenanceModel={provenanceModel}
        setProvenanceModel={handleModelChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemoScenario={handleRunDemoScenario}
        onResetLedger={handleResetLedger}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        onOpenDataUpload={() => setIsDataUploadOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
      />

      {/* Hero Story Banner (Toggable / Sticky) */}
      {showHeroStory && (
        <div className="relative">
          <HeroStorySection
            onStartTour={() => setIsTourOpen(true)}
            onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
            onOpenDataUpload={() => setIsDataUploadOpen(true)}
            onJumpToTab={(tab) => {
              setActiveTab(tab);
              setShowHeroStory(false);
            }}
          />
          <button
            onClick={() => setShowHeroStory(false)}
            className="absolute top-3 right-4 px-2 py-0.5 rounded text-[10px] bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-mono"
          >
            Hide Overview
          </button>
        </div>
      )}

      {!showHeroStory && (
        <div className="bg-slate-900/40 border-b border-slate-800/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-amber-400">TraceMesh Active Console</span>
          <button
            onClick={() => setShowHeroStory(true)}
            className="text-amber-400 hover:underline font-mono text-[11px]"
          >
            Show Problem Overview & Pitch Banner
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'investigator' && caseData && (
          <InvestigatorView
            caseData={caseData}
            graph={graph}
            provenanceModel={provenanceModel}
            onRecommendLien={handleLienAction}
          />
        )}

        {activeTab === 'bank_ops' && (
          <BankOpsView
            currentInstitutionId={selectedInstitution}
            currentRole={currentRole}
            currentPersona={currentPersona}
            onSwitchPersona={handleSelectPersona}
            accounts={accounts}
            transactions={transactions}
            onApproveLien={handleLienAction}
          />
        )}

        {activeTab === 'regulator' && (
          <RegulatorView accounts={accounts} transactions={transactions} />
        )}

        {activeTab === 'raw_inspector' && (
          <RawInspectorView transactions={transactions} />
        )}

        {activeTab === 'red_team' && <RedTeamSandbox />}

        {activeTab === 'benchmarks' && <BenchmarkView />}

        {activeTab === 'architecture' && <ArchitectureDocsView />}
      </main>

      {/* AI Investigation Assistant Modal */}
      <AiInvestigatorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        securityContext={securityContext}
        onExecuteRecommendedLien={handleLienAction}
      />

      {/* Guided Tour Controller with Voice Narration */}
      <GuidedTourPlayer
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Live Synthetic / Custom Data Upload Modal */}
      <DataUploadModal
        isOpen={isDataUploadOpen}
        onClose={() => setIsDataUploadOpen(false)}
        onIngestionSuccess={handleIngestionComplete}
      />

      {/* Executive Investor & Bank Pitch Deck */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
        onStartInteractiveDemo={() => setIsTourOpen(true)}
      />
    </div>
  );
}
