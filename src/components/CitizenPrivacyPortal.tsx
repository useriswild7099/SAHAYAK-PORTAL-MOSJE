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
} from 'lucide-react';
import { AtrocityCase, CheckInRecord, LanguageCode, SUPPORTED_LANGUAGES } from '../types/ivr';
import { storageService } from '../services/storageService';

interface CitizenPrivacyPortalProps {
  cases: AtrocityCase[];
  checkIns: CheckInRecord[];
  onOpenPhoneWithCase: (c: AtrocityCase) => void;
}

export const CitizenPrivacyPortal: React.FC<CitizenPrivacyPortalProps> = ({
  cases,
  checkIns,
  onOpenPhoneWithCase,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const caseCheckIns = checkIns.filter((chk) => chk.caseId === activeCase?.id);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
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
    showToast(`Preferred outreach language updated to ${SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label}.`);
  };

  const handleTimeSlotChange = (slot: 'morning' | 'afternoon' | 'evening') => {
    if (!activeCase) return;
    storageService.updateCaseConsent(activeCase.id, activeCase.consentStatus, activeCase.preferredLanguage, slot);
    showToast(`Preferred contact hours updated to ${slot}.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Feedback */}
      {successToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded shadow-lg flex items-center gap-2 border border-slate-700"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Explaining Beneficiary Agency & DPDP Act */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Digital Personal Data Protection (DPDP) Act 2023</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Beneficiary Consent &amp; Contact Preferences Portal
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Under the MoSJE Sahayak Statutory Charter, psychological surveillance is strictly prohibited.
              Beneficiaries possess the unconditional statutory right to pause check-ins, choose their preferred language,
              set safe call hours, and audit every ledger entry maintained by district welfare officers.
            </p>
          </div>

          {/* Account Selector */}
          <div className="bg-slate-50 p-2 rounded border border-slate-300 flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-600 font-medium">Beneficiary Account:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-white text-xs text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none font-semibold"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.victimPseudonym} ({c.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeCase && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Preferences & Controls (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Box 1: Consent & Call Status */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0B2545]" />
                    <span>Consent &amp; Outreach Participation</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pause or resume automated follow-ups at any time without affecting legal aid or relief funds.
                  </p>
                </div>

                <button
                  onClick={handleToggleConsent}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                    activeCase.consentStatus === 'active'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {activeCase.consentStatus === 'active' ? 'Active (Receiving Calls)' : 'Paused (Opted Out)'}
                </button>
              </div>

              {/* Language Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preferred Language for Automated Calls &amp; SMS</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-2.5 rounded text-xs border text-left transition-colors ${
                        activeCase.preferredLanguage === lang.code
                          ? 'bg-slate-100 border-[#0B2545] text-[#0B2545] font-bold ring-1 ring-[#0B2545]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold">{lang.nativeLabel}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lang.code.toUpperCase()} · {lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Safe &amp; Private Call Hours</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { slot: 'morning' as const, label: 'Morning', hours: '09:00 – 12:00' },
                    { slot: 'afternoon' as const, label: 'Afternoon', hours: '14:00 – 17:00' },
                    { slot: 'evening' as const, label: 'Evening', hours: '18:00 – 20:30' },
                  ].map((s) => (
                    <button
                      key={s.slot}
                      onClick={() => handleTimeSlotChange(s.slot)}
                      className={`p-2.5 rounded text-xs border text-center transition-colors ${
                        activeCase.preferredTimeSlot === s.slot
                          ? 'bg-slate-100 border-[#0B2545] text-[#0B2545] font-bold ring-1 ring-[#0B2545]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono tabular-nums">{s.hours}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Transparent Case Audit Ledger */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#0B2545]" />
                  <span>Transparent Case Ledger (Officer Log Audit)</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Under DPDP statutory compliance, you have the unconditional right to view what records are maintained under your case ID.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {caseCheckIns.length === 0 ? (
                  <div className="p-4 rounded bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                    No check-in entries logged yet.
                  </div>
                ) : (
                  caseCheckIns.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3 rounded bg-slate-50 border border-slate-200 text-xs space-y-1"
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
                        <div className="text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px]">
                          <span className="text-slate-500 not-italic">Voice Note: </span>
                          &quot;{chk.voiceNoteTranscript || chk.voiceNoteUrl}&quot;
                        </div>
                      )}
                      {chk.caseworkerNotes && (
                        <div className="text-slate-800 bg-white p-2 rounded border border-slate-200 text-[11px]">
                          <span className="text-slate-500">Officer Note: </span>
                          {chk.caseworkerNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Statutory Rights & Quick Test Call */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>Section 15A Statutory Entitlements</span>
              </h3>
              <ul className="space-y-2.5 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>Mandatory police escort to and from the Special Court on hearing dates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>Certified free copies of all police charge-sheets and court orders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>Interim relief disbursement directly into registered bank accounts under Rules 11/12.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>Immediate witness protection if facing intimidation from accused persons.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#0B2545]" />
                <span>Test Audio Call Simulator</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Verify how the automated check-in sounds in your preferred language (
                {SUPPORTED_LANGUAGES.find((l) => l.code === activeCase.preferredLanguage)?.label}) on the feature phone terminal.
              </p>
              <button
                onClick={() => onOpenPhoneWithCase(activeCase)}
                className="w-full py-2 px-3 rounded bg-[#0B2545] hover:bg-[#12335C] text-white font-semibold text-xs transition-colors"
              >
                Launch Telephony Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
