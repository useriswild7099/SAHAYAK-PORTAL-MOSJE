import React, { useState, useEffect } from 'react';
import { Navbar, PortalRole, AdminViewType, VictimViewType } from './components/Navbar';
import { CaseworkerQueue } from './components/CaseworkerQueue';
import { IVRPhoneSimulator } from './components/IVRPhoneSimulator';
import { BeneficiaryPortal } from './components/BeneficiaryPortal';
import { CompanionIntegrationView } from './components/CompanionIntegrationView';
import { EthicalCharterModal } from './components/EthicalCharterModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { storageService } from './services/storageService';
import { ivrEngine } from './services/ivrEngine';
import { therapyModelService } from './services/therapyModelService';
import { AtrocityCase, CheckInRecord } from './types/ivr';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { LiquidGlassProvider } from './context/LiquidGlassContext';
import { LiquidGlassSettingsModal } from './components/liquid-glass/LiquidGlassSettingsModal';

function AppContent() {
  const { t } = useLanguage();
  const { openAccessibilityModal } = useAccessibility();

  // Role & View Management
  const [portalRole, setPortalRole] = useState<PortalRole>('admin');
  const [adminView, setAdminView] = useState<AdminViewType>('queue');
  const [victimView, setVictimView] = useState<VictimViewType>('rights');

  // Case Data State
  const [cases, setCases] = useState<AtrocityCase[]>(storageService.getCases());
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(storageService.getCheckIns());
  const [activeVictimCaseId, setActiveVictimCaseId] = useState<string>(cases[0]?.id || '');
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<AtrocityCase | null>(null);
  const [selectedCaseForPhoneId, setSelectedCaseForPhoneId] = useState<string>(cases[0]?.id || '');
  const [completionNotification, setCompletionNotification] = useState<string | null>(null);

  // Synchronize state with storageService
  useEffect(() => {
    const updateLocalData = () => {
      setCases(storageService.getCases());
      setCheckIns(storageService.getCheckIns());
    };

    const unsubscribe = storageService.subscribe(updateLocalData);

    // Register IVR engine completion callback to persist check-ins
    ivrEngine.setOnCallCompleted(async (record) => {
      storageService.addCheckInRecord(record);
      await therapyModelService.scoreCase(record.caseId);
      const targetCase = storageService.getCaseById(record.caseId);
      const pseudonym = targetCase ? targetCase.victimPseudonym : 'Beneficiary';
      setCompletionNotification(`Check-in recorded for ${pseudonym}. Case status & therapy model score updated.`);
      setTimeout(() => setCompletionNotification(null), 5000);
    });

    return () => unsubscribe();
  }, []);

  // Real-time ZenGuard Companion Score Sync Poller (for backend/polling sync)
  useEffect(() => {
    let lastTimestamp = '';
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/companion/latest-sync');
        if (res.ok) {
          const json = await res.json();
          if (json.latest && json.latest.timestamp && json.latest.timestamp !== lastTimestamp) {
            lastTimestamp = json.latest.timestamp;
            const { caseId, distressScore, riskTier, sourceProject } = json.latest;
            const targetCaseId = caseId || 'CASE-2026-ALW-019';
            therapyModelService.ingestExternalScore(
              targetCaseId,
              distressScore,
              riskTier,
              { sourceProject: sourceProject || 'ZenGuard AI Companion' }
            );
            setCases(storageService.getCases());
            setCompletionNotification(
              `ZenGuard AI Sync: Live Distress Score (${distressScore}/100 - ${riskTier}) ingested for ${targetCaseId}`
            );
            setTimeout(() => setCompletionNotification(null), 4500);
          }
        }
      } catch (e) {
        // Quiet offline
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // URL Parameter Sync (for direct frontend-to-frontend handoff from ZenGuard)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scoreParam = params.get('score');
    if (scoreParam) {
      const distressScore = parseInt(scoreParam, 10);
      if (!isNaN(distressScore)) {
        // Find an active case or fallback
        const targetCaseId = cases[0]?.id || 'CASE-2026-ALW-019';
        const riskTier = distressScore > 80 ? 'CRITICAL' : distressScore > 50 ? 'HIGH' : 'ELEVATED';
        
        therapyModelService.ingestExternalScore(
          targetCaseId,
          distressScore,
          riskTier,
          { sourceProject: 'ZenGuard URL Handoff' }
        );
        setCases(storageService.getCases());
        setCompletionNotification(
          `ZenGuard AI Handoff: Distress Score (${distressScore}/100 - ${riskTier}) ingested for ${targetCaseId}`
        );
        setTimeout(() => setCompletionNotification(null), 6000);
      }
    }
  }, []);

  const handleOpenPhoneWithCase = (c?: AtrocityCase) => {
    if (c) {
      setSelectedCaseForPhoneId(c.id);
      setActiveVictimCaseId(c.id);
    }
    if (portalRole === 'admin') {
      setAdminView('telephony');
    }
  };

  const handleOpenCaseDetail = (c: AtrocityCase) => {
    setSelectedCaseForDetail(c);
  };

  const refreshCaseScores = () => {
    setCases(storageService.getCases());
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Universal Masthead & Navigation with Role Switcher */}
      <Navbar
        portalRole={portalRole}
        onSelectPortalRole={setPortalRole}
        adminView={adminView}
        onSelectAdminView={setAdminView}
        victimView={victimView}
        onSelectVictimView={setVictimView}
        cases={cases}
        onOpenPhoneWithCase={handleOpenPhoneWithCase}
      />

      {/* Completion Notification Banner */}
      {completionNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-medium border border-slate-700 flex items-center gap-3 transition-all duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="leading-snug">{completionNotification}</span>
        </div>
      )}

      {/* Main Content: Render Admin Workspace or Victim Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 focus:outline-none">
        {portalRole === 'admin' ? (
          /* ============================================================ */
          /* 1. DISTRICT WELFARE OFFICER DESK (ADMIN WORKSPACE)            */
          /* ============================================================ */
          <>
            {adminView === 'queue' && (
              <CaseworkerQueue
                cases={cases}
                checkIns={checkIns}
                onOpenPhoneWithCase={handleOpenPhoneWithCase}
                onOpenCaseDetail={handleOpenCaseDetail}
              />
            )}

            {adminView === 'telephony' && (
              <IVRPhoneSimulator
                cases={cases}
                selectedCaseId={selectedCaseForPhoneId}
                onCaseChange={(id) => {
                  setSelectedCaseForPhoneId(id);
                  setActiveVictimCaseId(id);
                }}
              />
            )}

            {adminView === 'companion_hub' && (
              <CompanionIntegrationView
                cases={cases}
                onScoresUpdated={refreshCaseScores}
              />
            )}

            {adminView === 'ethics' && <EthicalCharterModal />}
          </>
        ) : (
          /* ============================================================ */
          /* 2. BENEFICIARY / SURVIVOR PORTAL (CITIZEN WORKSPACE)         */
          /* ============================================================ */
          <BeneficiaryPortal
            cases={cases}
            checkIns={checkIns}
            activeCaseId={activeVictimCaseId}
            onCaseChange={(id) => {
              setActiveVictimCaseId(id);
              setSelectedCaseForPhoneId(id);
            }}
            onOpenPhoneWithCase={handleOpenPhoneWithCase}
            activeTab={victimView}
            onTabChange={setVictimView}
          />
        )}
      </main>

      {/* Case Details & Dossier Modal */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          atrocityCase={selectedCaseForDetail}
          checkIns={storageService.getCheckInsForCase(selectedCaseForDetail.id)}
          onClose={() => setSelectedCaseForDetail(null)}
          onInitiateCall={(caseId) => {
            const found = cases.find((c) => c.id === caseId);
            if (found) {
              handleOpenPhoneWithCase(found);
            }
          }}
        />
      )}

      {/* GIGW 3.0 Universal Accessibility Center Modal */}
      <AccessibilityModal />

      {/* Apple Liquid Glass Parameters Studio Modal (dashersw/liquid-glass-js) */}
      <LiquidGlassSettingsModal />

      {/* Institutional Government Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-600" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="font-semibold text-slate-800">
                {t('portalName')} · SC/ST (Prevention of Atrocities) Act 1989 &amp; Rules 1995/2016
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t('ministry')}, {t('govIndia')}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600">
              <button
                onClick={openAccessibilityModal}
                className="hover:text-blue-700 cursor-pointer font-medium underline-offset-2 hover:underline"
              >
                Accessibility Statement (GIGW 3.0)
              </button>
              <span>·</span>
              <span className="hover:text-blue-700 cursor-pointer">Citizen Data Protection (DPDP Act 2023)</span>
              <span>·</span>
              <span className="hover:text-blue-700 cursor-pointer">{t('helpline')}: 14566 / 1800-11-2026</span>
            </div>
          </div>
          {/* Statutory Scheme Backlinks (SIH 26094) */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-700">
            <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-1">
              <span>📜 Section 15A PoA Witness Protection Scheme</span>
            </a>
            <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-1">
              <span>⚖️ Rule 12(4) Rehabilitation Norms</span>
            </a>
            <a href="https://telemanas.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1">
              <span>📞 Tele-MANAS (24x7 Helpline: 14416)</span>
            </a>
            <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline flex items-center gap-1">
              <span>🏛️ NALSA Free Legal Services (15100)</span>
            </a>
            <a href="https://mha.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:underline flex items-center gap-1">
              <span>🛡️ Central Victim Compensation Fund (CVCF)</span>
            </a>
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <span>Official System for District Caseworker Continuity &amp; Section 15A Witness Protection Triage</span>
            <span>Version 3.0 (Role-Separated Government Edition)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <LiquidGlassProvider>
          <AppContent />
        </LiquidGlassProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
