/**
 * TraceMesh Master Institutional Application Entry
 * Disputed Value Provenance & Financial Crime Investigation Infrastructure Layer
 */

import React, { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { OverviewDashboardView } from './components/OverviewDashboardView';
import { InvestigatorView } from './components/InvestigatorView';
import { TransactionsView } from './components/TransactionsView';
import { AccountsView } from './components/AccountsView';
import { CasesView } from './components/CasesView';
import { InstitutionsView } from './components/InstitutionsView';
import { BankOpsView } from './components/BankOpsView';
import { RegulatorView } from './components/RegulatorView';
import { RawInspectorView } from './components/RawInspectorView';
import { SecurityCenterView } from './components/SecurityCenterView';
import { RedTeamSandbox } from './components/RedTeamSandbox';
import { BenchmarkView } from './components/BenchmarkView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { AiInvestigatorModal } from './components/AiInvestigatorModal';
import { GuidedTourPlayer } from './components/GuidedTourPlayer';
import { DataUploadModal } from './components/DataUploadModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { ledgerInstance } from './core/ledger/ledger';
import { AUTH_PERSONAS, AuthPersona } from './core/auth/personas';
import { IngestionResult } from './core/simulator/customDataIngest';
import {
  Account,
  AuditEvent,
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
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals & Interactive Overlays
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isDataUploadOpen, setIsDataUploadOpen] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Inspector Modals State
  const [inspectedTxId, setInspectedTxId] = useState<string | null>(null);
  const [inspectedAccountId, setInspectedAccountId] = useState<string | null>(null);

  // Reactive Ledger State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [primaryCase, setPrimaryCase] = useState<InvestigationCase | null>(null);
  const [graph, setGraph] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Sync state from ledgerInstance
  const refreshFromLedger = () => {
    const accs = ledgerInstance.getAccounts();
    const txs = ledgerInstance.getTransactions();
    const cList = ledgerInstance.getCases();
    const c = ledgerInstance.getCase('CASE-2026-00041') || cList[0];
    const g = ledgerInstance.getCaseGraph('CASE-2026-00041');
    const audits = ledgerInstance.getAuditLogs();

    setAccounts([...accs]);
    setTransactions([...txs]);
    setCases([...cList]);
    if (c) setPrimaryCase({ ...c });
    setGraph({ ...g });
    setAuditLogs([...audits]);
  };

  useEffect(() => {
    refreshFromLedger();
  }, []);

  // Global Ctrl+K hotkey for search command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Run standard primary 5-hop commingling scenario
  const handleRunDemoScenario = () => {
    ledgerInstance.reset(42);
    ledgerInstance.setProvenanceModel(provenanceModel);
    ledgerInstance.runPrimaryHackathonScenario();
    refreshFromLedger();
    setActiveTab('overview');
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

  // Execute or Recommend Surgical Partial Lien
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
    setActiveTab('investigate');
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

  const inspectedTransaction = transactions.find((t) => t.canonical.transactionId === inspectedTxId) || null;
  const inspectedAccount = accounts.find((a) => a.id === inspectedAccountId) || null;

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentPersona={currentPersona}
      onSelectPersona={handleSelectPersona}
      provenanceModel={provenanceModel}
      setProvenanceModel={handleModelChange}
      selectedInstitution={selectedInstitution}
      onRunDemoScenario={handleRunDemoScenario}
      onResetLedger={handleResetLedger}
      onOpenAiAssistant={() => setIsAiModalOpen(true)}
      onStartTour={() => setIsTourOpen(true)}
      onOpenDataUpload={() => setIsDataUploadOpen(true)}
      onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
      onOpenSearch={() => setIsSearchOpen(true)}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-slideUp">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main View Router */}
      {activeTab === 'overview' && (
        <OverviewDashboardView
          accounts={accounts}
          transactions={transactions}
          primaryCase={primaryCase}
          provenanceModel={provenanceModel}
          onNavigateTab={setActiveTab}
          onSelectTransaction={(id) => setInspectedTxId(id)}
          onSelectAccount={(id) => setInspectedAccountId(id)}
          onStartTour={() => setIsTourOpen(true)}
        />
      )}

      {activeTab === 'investigate' && primaryCase && (
        <InvestigatorView
          caseData={primaryCase}
          graph={graph}
          provenanceModel={provenanceModel}
          onRecommendLien={handleLienAction}
          onInspectTransaction={(id) => setInspectedTxId(id)}
          onInspectAccountProfile={(id) => setInspectedAccountId(id)}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsView
          transactions={transactions}
          onSelectTransaction={(id) => setInspectedTxId(id)}
          onSelectAccount={(id) => setInspectedAccountId(id)}
        />
      )}

      {activeTab === 'accounts' && (
        <AccountsView
          accounts={accounts}
          onSelectAccount={(id) => setInspectedAccountId(id)}
          onIssuePartialLien={handleLienAction}
        />
      )}

      {activeTab === 'cases' && (
        <CasesView
          cases={cases}
          onSelectCase={(id) => {
            const found = cases.find((c) => c.id === id);
            if (found) setPrimaryCase(found);
          }}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'institutions' && (
        <InstitutionsView
          accounts={accounts}
          transactions={transactions}
          onSelectInstitution={(instId) => setSelectedInstitution(instId)}
          onNavigateTab={setActiveTab}
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

      {activeTab === 'benchmarks' && <BenchmarkView />}

      {activeTab === 'security' && (
        <SecurityCenterView
          auditLogs={auditLogs}
          onNavigateTab={setActiveTab}
          onRefreshLedger={refreshFromLedger}
        />
      )}

      {activeTab === 'red_team' && <RedTeamSandbox />}

      {activeTab === 'architecture' && <ArchitectureDocsView />}

      {/* 3-Layer Transaction Inspector Modal */}
      <TransactionDetailModal
        transaction={inspectedTransaction}
        isOpen={!!inspectedTxId}
        onClose={() => setInspectedTxId(null)}
        onInspectAccount={(accId) => setInspectedAccountId(accId)}
      />

      {/* Account Profile Modal */}
      <AccountProfileModal
        account={inspectedAccount}
        isOpen={!!inspectedAccountId}
        onClose={() => setInspectedAccountId(null)}
        transactions={transactions}
        onSelectTransaction={(txId) => setInspectedTxId(txId)}
        onIssuePartialLien={handleLienAction}
      />

      {/* Global Search Command Palette (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        accounts={accounts}
        transactions={transactions}
        cases={cases}
        onSelectAccount={(accId) => setInspectedAccountId(accId)}
        onSelectTransaction={(txId) => setInspectedTxId(txId)}
        onSelectCase={(cId) => {
          const found = cases.find((c) => c.id === cId);
          if (found) setPrimaryCase(found);
        }}
        onNavigateTab={setActiveTab}
      />

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
    </AppShell>
  );
}
