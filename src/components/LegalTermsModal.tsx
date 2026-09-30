import React, { useState } from 'react';
import { Shield, FileText, CheckCircle, Scale, X, Lock, Download, Printer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LegalTermsModalProps {
  isOpen: boolean;
  initialTab?: 'tos' | 'privacy';
  onClose: () => void;
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  initialTab = 'tos',
  onClose,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-slate-50 border border-slate-300 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-[#091729] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base font-bold font-serif text-slate-100">
                Statutory Governance, Terms of Service & Citizen Privacy Charter
              </h2>
              <p className="text-xs text-slate-400">
                Pursuant to SC/ST (Prevention of Atrocities) Act 1989 Section 15A &amp; Digital Personal Data Protection (DPDP) Act 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
            aria-label="Close legal terms modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-200/80 px-6 pt-3 border-b border-slate-300 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tos')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xs border-t border-x transition-colors flex items-center gap-2 ${
              activeTab === 'tos'
                ? 'bg-slate-50 text-blue-950 border-slate-300 border-b-transparent -mb-[1px] font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service & Caseworker Code</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xs border-t border-x transition-colors flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-slate-50 text-blue-950 border-slate-300 border-b-transparent -mb-[1px] font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Statutory Privacy Policy (DPDP 2023)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-xs leading-relaxed space-y-4 font-sans bg-slate-50">
          {activeTab === 'tos' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xs text-amber-950">
                <span className="font-bold">Official Government Disclaimer:</span> This platform is operated under the auspices of the Ministry of Social Justice and Empowerment (MoSJE), Government of India. Use of this portal is restricted to authorized District Welfare Officers, nodal caseworkers, and verified assistance beneficiaries.
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">1. Scope and Statutory Authority</h3>
                <p className="text-slate-700">
                  The Sahayak platform executes affirmative obligations mandated under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989 and Amendment Rules 2016, specifically Section 15A regarding witness protection, socio-economic rehabilitation, and procedural continuity.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">2. Caseworker Duties and Accountability</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Zero Diagnostic Imposition:</strong> Caseworkers must not substitute automated IVR distress triage for direct in-person judicial or emergency protective intervention.</li>
                  <li><strong>Lapse Enforcement:</strong> Every case flagged with &gt;14 days lapsed contact requires mandatory caseworker re-engagement within 48 operational hours.</li>
                  <li><strong>Confidentiality Oath:</strong> Accessing beneficiary true identifiers without administrative audit logging is strictly prohibited and subject to departmental inquiry under Central Civil Services (Conduct) Rules.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">3. Citizen Voluntary Rights and Revocation</h3>
                <p className="text-slate-700">
                  Beneficiaries retain the absolute statutory right to revoke IVR check-in consent at any juncture by pressing DTMF 9 during an active call, sending an SMS containing &apos;STOP&apos; or &apos;ROK&apos; to 14566, or submitting a written withdrawal through their local district social welfare office.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">4. Emergency Crisis Protocol</h3>
                <p className="text-slate-700">
                  In instances of imminent physical harm, Section 15A protection protocols mandate instant notification to the Superintendent of Police (SP) and District Magistrate (DM). IVR automated logs constitute admissible statutory documentation for protective escalation.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-xs text-blue-950">
                <span className="font-bold">DPDP Act 2023 Compliance:</span> Personal identifiable data processed by the Sahayak IVR Gateway conforms with the Digital Personal Data Protection Act, 2023, upholding strict purpose limitation, data minimization, and pseudonymization standards.
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">1. Data Minimization &amp; Sovereign Pseudonymization</h3>
                <p className="text-slate-700">
                  Beneficiary names and contact coordinates are encrypted at rest with AES-256 standard encryption. Caseworker interfaces present verified pseudonyms (e.g., &quot;Survivor-BR-014&quot;) to prevent unauthorized community disclosure or Section 15A witness compromise.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">2. Telephony and Audio Processing Policy</h3>
                <p className="text-slate-700">
                  Voice prompts utilize open standards telephony synthesis across constitutional Indian languages (Hindi, Marathi, Telugu, Tamil, Bengali, Kannada, English). No citizen audio recordings are shared with third-party advertising networks or commercial LLM training pipelines.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">3. Audit Trails &amp; Citizen Erasure Protocol</h3>
                <p className="text-slate-700">
                  In compliance with Section 12 of the DPDP Act 2023, beneficiaries may inspect check-in ledger entries or demand historical purge upon acquittal or formal closure of Section 15A proceedings through the Citizen Privacy Portal.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 font-serif">4. Grievance Redressal Officer</h3>
                <p className="text-slate-700">
                  For data protection inquiries or grievance escalation under DPDP Act 2023:
                  <br />
                  <span className="font-mono text-[11px] text-slate-900">
                    Nodal Grievance Officer, Digital Governance Wing, MoSJE, Shastri Bhawan, New Delhi 110001 · Email: dpo-mosje@nic.in · Toll-Free: 14566
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-300 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500 font-mono">
            Document Reference: MoSJE-CIVIL-2026/SEC-15A
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xs border border-slate-300 bg-white hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Gazette</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
