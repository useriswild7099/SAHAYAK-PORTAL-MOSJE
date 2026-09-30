import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Clock,
  Phone,
  Lock,
  Eye,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Shield,
  HelpCircle,
  Radio,
  FileText,
  User,
  Cpu,
  Send,
  Server,
  Download,
  Trash2,
  Printer,
} from 'lucide-react';
import { AtrocityCase, CheckInRecord, LanguageCode, SUPPORTED_LANGUAGES } from '../types/ivr';
import { storageService } from '../services/storageService';
import { therapyModelService } from '../services/therapyModelService';

import { LiquidGlassContainer } from './liquid-glass/LiquidGlassContainer';
import { LiquidGlassButton } from './liquid-glass/LiquidGlassButton';

interface BeneficiaryPortalProps {
  cases: AtrocityCase[];
  checkIns: CheckInRecord[];
  activeCaseId: string;
  onCaseChange: (caseId: string) => void;
  onOpenPhoneWithCase: (c: AtrocityCase) => void;
  activeTab?: 'rights' | 'preferences' | 'ledger' | 'phone' | 'companion';
  onTabChange?: (tab: 'rights' | 'preferences' | 'ledger' | 'phone' | 'companion') => void;
}

export const BeneficiaryPortal: React.FC<BeneficiaryPortalProps> = ({
  cases,
  checkIns,
  activeCaseId,
  onCaseChange,
  onOpenPhoneWithCase,
  activeTab: activeTabProp,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'rights' | 'preferences' | 'ledger' | 'phone' | 'companion'>('rights');
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = (tab: 'rights' | 'preferences' | 'ledger' | 'phone' | 'companion') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const caseCheckIns = checkIns.filter((chk) => chk.caseId === activeCase?.id);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleExportData = () => {
    if (!activeCase) return;
    const jsonStr = storageService.exportSurvivorData(activeCase.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosje_survivor_record_${activeCase.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Statutory data bundle exported under DPDP Act 2023 portability provisions.');
  };

  const handlePurgeHistory = () => {
    if (!activeCase) return;
    storageService.purgeCaseCheckIns(activeCase.id);
    setShowPurgeModal(false);
    showToast('All past voice check-in telemetry and sentiment scores purged. Legal FIR record preserved.');
  };

  const handleSendSimulatedReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    therapyModelService.ingestExternalScore(
      activeCase.id,
      reflectionScore,
      undefined,
      {
        sourceProject: 'LOCAL_PC_JOURNALING_COMPANION',
        journalSnippet: reflectionText || 'Beneficiary completed private personal diary entry on local PC.',
        detectedIndicators: ['Private Journal Reflection (Local PC)', 'Self-Reported Emotional State'],
        recommendedInterventions: [
          reflectionScore >= 75
            ? 'Urgent caseworker review: High distress detected from local reflection'
            : 'Continue routine scheduled contact',
        ],
      }
    );
    showToast(
      `Distress score (${reflectionScore}/100) synced to caseworker. Your intimate diary remains safely private on your PC.`
    );
    setReflectionText('');
  };

  const handleToggleConsent = () => {
    if (!activeCase) return;
    const newStatus = activeCase.consentStatus === 'active' ? 'paused' : 'active';
    storageService.updateCaseConsent(activeCase.id, newStatus);
    showToast(
      newStatus === 'active'
        ? 'Automated check-ins reactivated.'
        : 'Automated check-ins paused. No automated calls will be made.'
    );
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    if (!activeCase) return;
    storageService.updateCaseConsent(activeCase.id, activeCase.consentStatus, lang, activeCase.preferredTimeSlot);
    showToast(`Preferred language updated to ${SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label}.`);
  };

  const handleTimeSlotChange = (slot: 'morning' | 'afternoon' | 'evening') => {
    if (!activeCase) return;
    storageService.updateCaseConsent(activeCase.id, activeCase.consentStatus, activeCase.preferredLanguage, slot);
    showToast(`Safe contact hours set to ${slot}.`);
  };

  const handleRequestPoliceEscort = () => {
    if (!activeCase) return;
    storageService.reportNeed(activeCase.id, 'police_witness_security');
    showToast('Urgent police protection & court escort request logged for District Welfare Officer.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Government Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" aria-label="Breadcrumb">
        <span className="text-slate-700">MoSJE Citizen Portal</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">Beneficiary Services</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold">Section 15A Witness Protection &amp; Relief Space</span>
      </nav>

      {/* Toast Notification */}
      {successToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded border border-slate-700 shadow-md flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Beneficiary Header Bar with Liquid Glass */}
      <LiquidGlassContainer borderRadius={12} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Beneficiary Self-Service Portal</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-normal">Section 15A Witness Protection &amp; Statutory Relief</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Survivor Rights, Safe Preferences &amp; Case Space
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Under the MoSJE Statutory Charter, psychological surveillance is strictly prohibited. You possess unconditional
              agency over your contact hours, language, and relief tracking.
            </p>
          </div>

          {/* Account Selector */}
          <div className="flex items-center gap-2 bg-slate-50/80 p-2 rounded border border-slate-300 shrink-0">
            <span className="text-xs text-slate-700 font-medium">Beneficiary:</span>
            <select
              value={activeCaseId}
              onChange={(e) => onCaseChange(e.target.value)}
              className="bg-white/90 text-xs text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none font-bold"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.victimPseudonym} ({c.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </LiquidGlassContainer>

      {activeCase && (
        <div className="space-y-5">
          {/* Sub-Navigation Tabs (Official Government Clean Underline Tabs) */}
          <div className="flex border-b-2 border-slate-300 bg-white px-2 rounded-t overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('rights')}
              className={`py-2.5 px-3.5 border-b-2 -mb-[2px] flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'rights'
                  ? 'border-[#0B2545] text-[#0B2545] font-bold bg-slate-50/80'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>1. Statutory Rights &amp; Relief</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2.5 px-3.5 border-b-2 -mb-[2px] flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'preferences'
                  ? 'border-[#0B2545] text-[#0B2545] font-bold bg-slate-50/80'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              <span>2. Consent &amp; Safe Hours</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`py-2.5 px-3.5 border-b-2 -mb-[2px] flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'ledger'
                  ? 'border-[#0B2545] text-[#0B2545] font-bold bg-slate-50/80'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-700" />
              <span>3. Case Ledger (DPDP Act)</span>
            </button>

            <button
              onClick={() => setActiveTab('phone')}
              className={`py-2.5 px-3.5 border-b-2 -mb-[2px] flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'phone'
                  ? 'border-[#0B2545] text-[#0B2545] font-bold bg-slate-50/80'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-slate-700" />
              <span>4. Feature-Phone Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('companion')}
              className={`py-2.5 px-3.5 border-b-2 -mb-[2px] flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'companion'
                  ? 'border-[#0B2545] text-[#0B2545] font-bold bg-slate-50/80'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>5. Local PC Companion</span>
            </button>
          </div>

          {/* TAB 1: Rights & Relief Tracker */}
          {activeTab === 'rights' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Relief Fund Stages & Profile */}
              <div className="lg:col-span-8 space-y-5">
                {/* Relief Compensation Progress */}
                <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <h2 className="text-sm font-bold text-slate-900">
                      Section 15A Relief Compensation Disbursement Tracker
                    </h2>
                    <span className="font-mono text-slate-700 font-semibold text-[11px]">
                      Under SC/ST PoA Rules 11/12
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    Statutory relief funds are released directly to your verified bank account across three milestones:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded border border-slate-300 bg-slate-50/80 space-y-1">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">Milestone 1 (25%)</div>
                      <div className="font-bold text-slate-900 text-xs">FIR Registration</div>
                      <div className="text-[11px] font-bold text-emerald-800">
                        {activeCase.reliefCompensationStage !== 'NOT_STARTED' ? '✓ Disbursed' : 'Sanction Pending'}
                      </div>
                    </div>

                    <div className="p-3 rounded border border-slate-300 bg-slate-50/80 space-y-1">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">Milestone 2 (50%)</div>
                      <div className="font-bold text-slate-900 text-xs">Chargesheet Submitted</div>
                      <div className="text-[11px] font-bold text-amber-800">
                        {activeCase.reliefCompensationStage === 'SPECIAL_COURT_TRIAL_RELEASE'
                          ? '✓ Disbursed'
                          : activeCase.reliefCompensationStage === 'CHARGE_SHEET_RELEASE_PENDING'
                          ? 'Processing at Treasury'
                          : 'Awaiting Court Filing'}
                      </div>
                    </div>

                    <div className="p-3 rounded border border-slate-300 bg-slate-50/80 space-y-1">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">Milestone 3 (25%)</div>
                      <div className="font-bold text-slate-900 text-xs">Trial Conclusion</div>
                      <div className="text-[11px] font-bold text-slate-700">
                        {activeCase.reliefCompensationStage === 'SPECIAL_COURT_TRIAL_RELEASE'
                          ? 'Sanctioned'
                          : 'Pending Trial Verdict'}
                      </div>
                    </div>
                  </div>
                </LiquidGlassContainer>

                {/* Case File Reference */}
                <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3 text-xs">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-2">
                    Case Summary &amp; Special Court File
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 leading-relaxed">
                    <div>
                      <span className="text-slate-500 font-medium">Beneficiary Case ID:</span>{' '}
                      <strong className="font-mono text-slate-900 tabular-nums">{activeCase.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Police Station &amp; FIR:</span>{' '}
                      <strong className="text-slate-900">{activeCase.firNumber} ({activeCase.policeStation})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Current Trial Stage:</span>{' '}
                      <strong className="text-slate-900 capitalize">{activeCase.courtStage.replace(/_/g, ' ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Jurisdiction:</span>{' '}
                      <strong className="text-slate-900">{activeCase.district}, {activeCase.state}</strong>
                    </div>
                  </div>
                </LiquidGlassContainer>
              </div>

              {/* Right Column: Assigned Welfare Officer & Emergency Escort */}
              <div className="lg:col-span-4 space-y-5 text-xs">
                {/* Officer Card */}
                <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
                    <User className="w-4 h-4 text-[#0B2545]" />
                    <span>Your Assigned Welfare Officer</span>
                  </h3>
                  <div className="space-y-1 text-slate-700">
                    <div className="font-bold text-slate-900">{activeCase.assignedCaseworker.name}</div>
                    <div className="text-[11px] text-slate-600">{activeCase.assignedCaseworker.designation}</div>
                    <div className="font-mono text-slate-800 tabular-nums font-semibold pt-0.5">
                      {activeCase.assignedCaseworker.contactNumber}
                    </div>
                  </div>
                  <div className="pt-1">
                    <LiquidGlassButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenPhoneWithCase(activeCase)}
                      className="w-full"
                    >
                      Connect via Telephony Gateway
                    </LiquidGlassButton>
                  </div>
                </LiquidGlassContainer>

                {/* Immediate Witness Protection Request */}
                <div className="bg-red-50/90 border border-red-300 rounded-xl p-4 space-y-3 text-red-950 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-900 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>Witness Protection Alert</span>
                  </div>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    If you are experiencing threats, surveillance, or harassment by accused individuals, trigger an immediate
                    protection alert to your caseworker.
                  </p>
                  <LiquidGlassButton
                    variant="danger"
                    size="md"
                    onClick={handleRequestPoliceEscort}
                    className="w-full shadow-xs"
                  >
                    Request Police Escort &amp; Protection
                  </LiquidGlassButton>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Consent & Safe Call Hours */}
          {activeTab === 'preferences' && (
            <LiquidGlassContainer borderRadius={12} className="p-4 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0B2545]" />
                    <span>Consent &amp; Outreach Participation</span>
                  </h2>
                  <p className="text-slate-600 mt-0.5">
                    Pause or resume automated follow-ups at any time without affecting legal aid or relief funds.
                  </p>
                </div>

                <LiquidGlassButton
                  variant={activeCase.consentStatus === 'active' ? 'emerald' : 'secondary'}
                  size="sm"
                  onClick={handleToggleConsent}
                >
                  {activeCase.consentStatus === 'active' ? 'Active (Receiving Calls)' : 'Paused (Opted Out)'}
                </LiquidGlassButton>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preferred Language for Automated Calls &amp; SMS</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-2.5 rounded text-xs border text-left transition-all ${
                        activeCase.preferredLanguage === lang.code
                          ? 'bg-slate-100/90 border-[#0B2545] text-[#0B2545] font-bold ring-2 ring-[#0B2545]/20 shadow-xs'
                          : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{lang.nativeLabel}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lang.code.toUpperCase()} · {lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Hours */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Safe &amp; Private Contact Hours</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { slot: 'morning' as const, label: 'Morning', hours: '09:00 – 12:00' },
                    { slot: 'afternoon' as const, label: 'Afternoon', hours: '14:00 – 17:00' },
                    { slot: 'evening' as const, label: 'Evening', hours: '18:00 – 20:30' },
                  ].map((s) => (
                    <button
                      key={s.slot}
                      onClick={() => handleTimeSlotChange(s.slot)}
                      className={`p-2.5 rounded text-xs border text-center transition-all ${
                        activeCase.preferredTimeSlot === s.slot
                          ? 'bg-slate-100/90 border-[#0B2545] text-[#0B2545] font-bold ring-2 ring-[#0B2545]/20 shadow-xs'
                          : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{s.label}</div>
                      <div className="text-[10px] text-slate-600 font-mono tabular-nums">{s.hours}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* DPDP Act 2023 Statutory Privacy & Data Agency */}
              <div className="pt-3 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-slate-900 text-xs">
                    DPDP Act 2023 Statutory Rights &amp; Personal Data Management
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Under the Digital Personal Data Protection Act 2023, you hold absolute rights to export your records or permanently purge personal voice telemetry and companion distress scores.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <LiquidGlassButton
                    variant="secondary"
                    size="sm"
                    onClick={handleExportData}
                    icon={<Download className="w-3.5 h-3.5 text-blue-700" />}
                  >
                    Export Statutory Data Package (JSON)
                  </LiquidGlassButton>

                  <LiquidGlassButton
                    variant="danger"
                    size="sm"
                    onClick={() => setShowPurgeModal(true)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Exercise Right to Erasure (Purge Telemetry)
                  </LiquidGlassButton>
                </div>
              </div>
            </LiquidGlassContainer>
          )}

          {/* TAB 3: Transparent Ledger */}
          {activeTab === 'ledger' && (
            <LiquidGlassContainer borderRadius={12} className="p-4 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#0B2545]" />
                    <span>Transparent Case Ledger (What the Welfare Department Sees)</span>
                  </h2>
                  <p className="text-slate-600 mt-0.5">
                    Under DPDP statutory compliance, you have the right to audit and view what records are maintained under your case ID.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <LiquidGlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.print()}
                    icon={<Printer className="w-3.5 h-3.5 text-slate-700" />}
                  >
                    Print Case Ledger
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="secondary"
                    size="sm"
                    onClick={handleExportData}
                    icon={<Download className="w-3.5 h-3.5 text-blue-700" />}
                  >
                    Download Ledger Bundle
                  </LiquidGlassButton>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {caseCheckIns.length === 0 ? (
                  <div className="p-6 rounded bg-slate-50/70 border border-slate-200 text-slate-400 text-center">
                    No check-in entries logged yet.
                  </div>
                ) : (
                  caseCheckIns.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3 rounded bg-slate-50/80 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-600 font-mono text-[11px]">
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {chk.timestamp.slice(0, 16).replace('T', ' ')}
                        </span>
                        <span className="text-slate-700 uppercase">{chk.channel || 'IVR_VOICE'}</span>
                      </div>
                      <div className="text-slate-800">
                        <span className="text-slate-500">Self-Reported Status: </span>
                        <span className="font-semibold capitalize">{(chk.status || 'not_recorded').replace(/_/g, ' ')}</span>
                      </div>
                      {(chk.voiceNoteTranscript || chk.voiceNoteUrl) && (
                        <div className="text-slate-700 bg-white/90 p-2 rounded border border-slate-200 text-[11px]">
                          <span className="text-slate-500 not-italic">Voice Note: </span>
                          &quot;{chk.voiceNoteTranscript || chk.voiceNoteUrl}&quot;
                        </div>
                      )}
                      {chk.caseworkerNotes && (
                        <div className="text-slate-800 bg-white/90 p-2 rounded border border-slate-200 text-[11px]">
                          <span className="text-slate-500">Officer Note: </span>
                          {chk.caseworkerNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </LiquidGlassContainer>
          )}



          {/* TAB 5: Companion (Chatbot & Journaling Connector) */}
          {activeTab === 'companion' && (
            <div className="space-y-5 text-xs">
              <LiquidGlassContainer borderRadius={12} className="p-4 space-y-4">
                <div className="border-b border-slate-200/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#0B2545]" />
                      <span>Private Journaling &amp; Chatbot Companion (Local PC Bridge)</span>
                    </h2>
                    <p className="text-slate-600 mt-0.5">
                      Your confidential personal reflection space hosted on your own computer.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50/80 border border-emerald-300 text-emerald-900 text-[11px] font-semibold shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Local Companion Bridge: Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Latest Synced Score Card */}
                  <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-300 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Current Synced Distress State
                    </div>
                    {activeCase.therapyModelResult ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                            {activeCase.therapyModelResult.distressScore}
                          </span>
                          <span className="text-xs text-slate-500">/ 100</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                              activeCase.therapyModelResult.riskTier === 'CRITICAL'
                                ? 'bg-red-50 text-red-900 border-red-300'
                                : activeCase.therapyModelResult.riskTier === 'ELEVATED'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {activeCase.therapyModelResult.riskTier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Source: <strong className="font-mono">{activeCase.therapyModelResult.modelSource}</strong> ·{' '}
                          Updated {activeCase.therapyModelResult.analyzedAt.slice(0, 16).replace('T', ' ')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs">No score synced yet from your local PC companion.</p>
                    )}
                  </div>

                  {/* DPDP Act Privacy Notice */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-300 space-y-1 text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Statutory DPDP Act 2023 Shield</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Your raw private thoughts, diary entries, and chatbot chat sessions stay entirely on your local PC.
                      Only the safety score is shared with your District Officer so assistance can reach you in emergencies.
                    </p>
                  </div>
                </div>

                {/* Interactive Simulated Reflection Tester */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="bg-white/80 border border-slate-300 rounded-lg p-3.5 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#0B2545]" />
                        <span>Simulate a Reflection from Your Local PC Companion</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Test writing a journal note on your PC and sending the computed score to your case record.
                      </p>
                    </div>

                    <form onSubmit={handleSendSimulatedReflection} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Private Diary / Chatbot Snippet (stays on your PC):
                        </label>
                        <input
                          type="text"
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder="e.g., Felt nervous about tomorrow's hearing, but meeting lawyer helped..."
                          className="w-full bg-white/90 text-slate-900 rounded border border-slate-300 px-3 py-1.5 focus:outline-none text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-semibold text-slate-700">
                            Distress Level Computed by Your Local Model:
                          </label>
                          <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">
                            {reflectionScore} / 100 ({reflectionScore >= 75 ? 'CRITICAL' : reflectionScore >= 50 ? 'ELEVATED' : 'MODERATE / LOW'})
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={95}
                          value={reflectionScore}
                          onChange={(e) => setReflectionScore(Number(e.target.value))}
                          className="w-full cursor-pointer accent-[#0B2545]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <LiquidGlassButton
                          type="submit"
                          variant="primary"
                          size="md"
                          icon={<Send className="w-3.5 h-3.5 text-amber-300" />}
                        >
                          Sync Score from PC to Welfare Officer
                        </LiquidGlassButton>
                      </div>
                    </form>
                  </div>
                </div>
              </LiquidGlassContainer>
            </div>
          )}
        </div>
      )}

      {/* DPDP Act Right to Erasure Confirmation Modal */}
      {showPurgeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purge-modal-title"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-red-700">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-red-700" />
              </div>
              <div>
                <h3 id="purge-modal-title" className="text-sm font-bold text-slate-900">
                  Exercise Right to Erasure (DPDP Act)
                </h3>
                <p className="text-[11px] text-slate-500">Statutory Voice Telemetry &amp; Score Purge</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-700 space-y-2 leading-relaxed">
              <p>
                Under Section 12 of the Digital Personal Data Protection Act 2023, you can permanently erase your telephony recordings, transcript logs, and companion sentiment scores.
              </p>
              <div className="font-semibold text-emerald-800 text-[11px]">
                ✓ Your official Police FIR, court hearing dates, and statutory compensation disbursement claims are legally preserved and will NOT be affected.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="px-3.5 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurgeHistory}
                className="px-3.5 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm &amp; Purge Telemetry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
