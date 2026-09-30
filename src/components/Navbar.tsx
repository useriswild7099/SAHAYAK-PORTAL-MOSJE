import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Users,
  FileText,
  PhoneForwarded,
  Globe,
  SlidersHorizontal,
  Server,
  BookOpen,
  UserCheck,
  Shield,
  Building,
  Lock,
  Eye,
  Phone,
  FileCheck,
} from 'lucide-react';
import { AtrocityCase, LanguageCode } from '../types/ivr';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLiquidGlass } from '../context/LiquidGlassContext';

export type PortalRole = 'admin' | 'victim';
export type AdminViewType = 'queue' | 'telephony' | 'companion_hub' | 'ethics';
export type VictimViewType = 'rights' | 'preferences' | 'ledger' | 'phone' | 'companion';

interface NavbarProps {
  portalRole: PortalRole;
  onSelectPortalRole: (role: PortalRole) => void;
  adminView: AdminViewType;
  onSelectAdminView: (view: AdminViewType) => void;
  victimView: VictimViewType;
  onSelectVictimView: (view: VictimViewType) => void;
  cases: AtrocityCase[];
  onOpenPhoneWithCase: (c?: AtrocityCase) => void;
}

/**
 * Official Ashoka Emblem Vector Graphic (State Emblem of India)
 */
const AshokaEmblemVector: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="8" y="40" width="32" height="3" rx="0.75" fill="#FDE68A" />
    <rect x="12" y="37" width="24" height="2" rx="0.5" fill="#F59E0B" />
    <circle cx="24" cy="38" r="2.2" stroke="#0B2545" strokeWidth="0.8" fill="#FDE68A" />
    <path d="M14 36 C17 33, 21 32, 24 32 C27 32, 31 33, 34 36 Z" fill="#B45309" />
    <path
      d="M21 16 C20 10, 21 8, 24 8 C27 8, 28 10, 27 16 C29 19, 29 23, 27 26 C27 29, 26 32, 24 32 C22 32, 21 29, 21 26 C19 23, 19 19, 21 16 Z"
      fill="#FEF3C7"
    />
    <path
      d="M15 19 C14 13, 16 10, 18 11 C20 12, 20 15, 19 20 C18 24, 17 28, 15 31 C14 27, 14 23, 15 19 Z"
      fill="#FCD34D"
    />
    <path
      d="M33 19 C34 13, 32 10, 30 11 C28 12, 28 15, 29 20 C30 24, 31 28, 33 31 C34 27, 34 23, 33 19 Z"
      fill="#FCD34D"
    />
    <circle cx="24" cy="11" r="2.2" fill="#FFFFFF" />
    <circle cx="18" cy="13" r="1.8" fill="#FEF3C7" />
    <circle cx="30" cy="13" r="1.8" fill="#FEF3C7" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  portalRole,
  onSelectPortalRole,
  adminView,
  onSelectAdminView,
  victimView,
  onSelectVictimView,
  cases,
  onOpenPhoneWithCase,
}) => {
  const { language, setLanguage, t, supportedLanguages, currentLanguageOption } = useLanguage();
  const {
    decreaseFontSize,
    resetFontSize,
    increaseFontSize,
    highContrast,
    toggleHighContrast,
    openAccessibilityModal,
  } = useAccessibility();
  const { config: glassConfig } = useLiquidGlass();

  // Compute lapsed contacts (> 14 days)
  const today = new Date().toISOString().split('T')[0];
  const lapsedCount = cases.filter((c) => {
    if (!c.lastContactDate) return true;
    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(c.lastContactDate).getTime()) / (1000 * 3600 * 24)
    );
    return diffDays > 14 && c.consentStatus !== 'opted_out';
  }).length;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        glassConfig.enabled
          ? 'bg-white/85 backdrop-blur-xl border-b border-white/40 shadow-sm'
          : 'bg-white border-b border-slate-200'
      }`}
      role="banner"
    >
      {/* Screen Reader Skip to Main Content Link (GIGW 3.0 Standard) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-400 focus:text-slate-950 focus:px-4 focus:py-2 focus:rounded focus:font-bold focus:shadow-xl focus:outline-2 focus:outline-blue-900"
      >
        Skip to main content / मुख्य सामग्री पर जाएं
      </a>

      {/* Indian National Tricolour Ribbon (National Identity) */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Official Government of India Authority Masthead */}
      <div className="bg-[#0B2545] text-white px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          {/* Institutional Seal & Hierarchy */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center border border-amber-400/30 shrink-0">
              <AshokaEmblemVector className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 tracking-wider text-[11px] uppercase">
                  {language === 'en' ? 'Government of India' : 'भारत सरकार'}
                </span>
                <span className="text-white/30" aria-hidden="true">|</span>
                <span className="font-medium text-slate-200 text-[11px]">
                  {language === 'en' ? 'Ministry of Social Justice and Empowerment' : t('govIndia')}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                {t('ministry')}
              </div>
            </div>
          </div>

          {/* Institutional Telemetry & GIGW 3.0 Accessibility Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-3 text-[11px] text-slate-300 w-full sm:w-auto self-end md:self-auto ml-auto">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t('gatewayOnline')}</span>
            </div>

            <span className="hidden lg:inline text-white/30" aria-hidden="true">|</span>
            <div className="hidden lg:flex items-center gap-1 text-slate-300">
              <span>{t('helpline')}:</span>
              <span className="font-mono font-semibold text-amber-300 tabular-nums">{t('helplineNumber')}</span>
            </div>

            <span className="text-white/30 hidden sm:inline" aria-hidden="true">|</span>

            {/* GIGW Accessibility Strip */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded border border-white/15 ml-auto justify-self-end">
              <span className="text-[10px] text-slate-300 uppercase font-medium tracking-wider mr-1 hidden sm:inline">
                Font:
              </span>
              <button
                onClick={decreaseFontSize}
                title="Decrease Font Size (A-)"
                aria-label="Decrease Font Size"
                className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                A-
              </button>
              <button
                onClick={resetFontSize}
                title="Reset Standard Font Size (A)"
                aria-label="Default Font Size"
                className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                title="Increase Font Size (A+)"
                aria-label="Increase Font Size"
                className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                A+
              </button>

              <span className="text-white/20 mx-1" aria-hidden="true">|</span>

              <button
                onClick={toggleHighContrast}
                title="Toggle High Contrast Mode"
                aria-label="Toggle High Contrast Mode"
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  highContrast
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {highContrast ? 'High Contrast On' : 'Contrast'}
              </button>

              <span className="text-white/20 mx-1" aria-hidden="true">|</span>

              <button
                onClick={openAccessibilityModal}
                title="Open Accessibility & Usability Center"
                aria-label="Open Accessibility Statement and Controls"
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-700 hover:bg-blue-600 text-white transition-colors flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3 text-blue-200" />
                <span>Accessibility</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation & Workspace Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#0B2545] text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                {t('portalName')}
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
                SC/ST PoA Central Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {portalRole === 'admin'
                ? 'District Welfare Officer Administration & Witness Protection Console'
                : 'Beneficiary Rights, Safe Preferences & Personal Case Space'}
            </p>
          </div>
        </div>

        {/* Central Dedicated Portal / Role Switcher (Liquid Glass Responsive Container) */}
        <div
          className={`flex items-center p-0.5 rounded transition-all duration-200 ${
            glassConfig.enabled
              ? 'bg-white/60 backdrop-blur-md border border-white/60 shadow-inner'
              : 'bg-slate-100 rounded border border-slate-300'
          }`}
        >
          <button
            onClick={() => onSelectPortalRole('admin')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              portalRole === 'admin'
                ? glassConfig.enabled
                  ? 'bg-[#0B2545] text-white shadow-md shadow-[#0B2545]/20 border border-white/20'
                  : 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>District Officer Desk</span>
          </button>

          <button
            onClick={() => onSelectPortalRole('victim')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              portalRole === 'victim'
                ? glassConfig.enabled
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 border border-white/20'
                  : 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Beneficiary Portal</span>
          </button>
        </div>

        {/* Language Selection & Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
              title={`${t('selectLanguage')} (${currentLanguageOption.label})`}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900">
                  {lang.nativeLabel} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (portalRole === 'victim') {
                onOpenPhoneWithCase();
              } else {
                onSelectAdminView('telephony');
                onOpenPhoneWithCase();
              }
            }}
            className="px-3 py-1 text-xs font-semibold rounded bg-[#0B2545] hover:bg-[#12335C] text-white transition-colors flex items-center gap-1.5 border border-[#0B2545]"
          >
            <PhoneForwarded className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Telephony Simulator</span>
            <span className="sm:hidden">IVR</span>
          </button>
        </div>
      </div>

      {/* Secondary Sub-Bar for Admin Views (only shown when in Admin Mode) */}
      {portalRole === 'admin' ? (
        <div className="bg-slate-100 border-t border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-1">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Admin Navigation">
              <button
                onClick={() => onSelectAdminView('queue')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  adminView === 'queue'
                    ? 'bg-white text-slate-900 border border-slate-300 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-slate-700" />
                <span>Triage Register</span>
                {lapsedCount > 0 && (
                  <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold tabular-nums">
                    {lapsedCount} Lapsed
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectAdminView('telephony')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  adminView === 'telephony'
                    ? 'bg-white text-slate-900 border border-slate-300 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
                <span>Telephony Gateway</span>
              </button>

              <button
                onClick={() => onSelectAdminView('companion_hub')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  adminView === 'companion_hub'
                    ? 'bg-white text-slate-900 border border-slate-300 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-emerald-700" />
                <span>PC Chatbot &amp; Journal Bridge</span>
              </button>

              <button
                onClick={() => onSelectAdminView('ethics')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  adminView === 'ethics'
                    ? 'bg-white text-slate-900 border border-slate-300 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
                <span>Governance Charter</span>
              </button>
            </nav>

            <span className="text-[11px] text-slate-500 hidden md:inline font-mono">
              Authorized: District Welfare Officer
            </span>
          </div>
        </div>
      ) : (
        /* Secondary Sub-Bar for Victim Views (when in Beneficiary / Survivor Mode) */
        <div className="bg-emerald-50 border-t border-b border-emerald-200 px-4 sm:px-6 lg:px-8 py-1">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Beneficiary Navigation">
              <button
                onClick={() => onSelectVictimView('rights')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  victimView === 'rights'
                    ? 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. Statutory Rights &amp; Relief</span>
              </button>

              <button
                onClick={() => onSelectVictimView('preferences')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  victimView === 'preferences'
                    ? 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Consent &amp; Safe Hours</span>
              </button>

              <button
                onClick={() => onSelectVictimView('ledger')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  victimView === 'ledger'
                    ? 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>3. Case Ledger (DPDP Act)</span>
              </button>

              <button
                onClick={() => onSelectVictimView('phone')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  victimView === 'phone'
                    ? 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>4. Feature-Phone Terminal</span>
              </button>

              <button
                onClick={() => onSelectVictimView('companion')}
                className={`px-3 py-1 rounded-sm text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  victimView === 'companion'
                    ? 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>5. Local PC Companion</span>
              </button>
            </nav>

            <span className="text-[11px] text-emerald-800 hidden md:inline font-mono">
              Statutory Agency: Citizen Self-Service
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
