import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Scale,
  Building,
  Target,
} from 'lucide-react';

export const EthicalCharterModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reality_check' | 'field_problems' | 'sahayak_solution' | 'litmus_test'>('reality_check');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Government Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" aria-label="Breadcrumb">
        <span className="text-slate-700">MoSJE Central</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">Governance &amp; Oversight</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold">Section 15A Public Architecture &amp; Anti-Surveillance Charter</span>
      </nav>

      {/* Statutory Header */}
      <div className="bg-white border border-slate-300 rounded p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-[#0B2545] text-amber-300 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="font-semibold text-slate-900">MoSJE Governance Framework</span>
                <span aria-hidden="true">·</span>
                <span>Section 15A Public Architecture Charter</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Statutory Architecture, Survivor Agency &amp; Anti-Surveillance Standards
              </h1>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-300 px-3 py-2 rounded max-w-sm">
            <span className="text-slate-900 block font-semibold">Statutory Guiding Principle:</span>
            Survivor welfare must deliver statutory Section 15A entitlements—not punitive psychological surveillance.
          </div>
        </div>

        {/* Tab Navigation (Clean Government Underline / Segmented Tabs) */}
        <div className="flex flex-wrap gap-1 text-xs">
          <button
            onClick={() => setActiveTab('reality_check')}
            className={`px-3 py-1.5 rounded transition-colors font-medium border ${
              activeTab === 'reality_check'
                ? 'bg-[#0B2545] text-white border-[#0B2545] font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            1. Problem Statement Critique
          </button>
          <button
            onClick={() => setActiveTab('field_problems')}
            className={`px-3 py-1.5 rounded transition-colors font-medium border ${
              activeTab === 'field_problems'
                ? 'bg-[#0B2545] text-white border-[#0B2545] font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            2. Ground Field Realities
          </button>
          <button
            onClick={() => setActiveTab('sahayak_solution')}
            className={`px-3 py-1.5 rounded transition-colors font-medium border ${
              activeTab === 'sahayak_solution'
                ? 'bg-[#0B2545] text-white border-[#0B2545] font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            3. Sahayak Operational Fix
          </button>
          <button
            onClick={() => setActiveTab('litmus_test')}
            className={`px-3 py-1.5 rounded transition-colors font-medium border ${
              activeTab === 'litmus_test'
                ? 'bg-[#0B2545] text-white border-[#0B2545] font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            4. Five Public Impact Litmus Tests
          </button>
        </div>
      </div>

      {/* Tab 1: Critique */}
      {activeTab === 'reality_check' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs text-slate-800 leading-relaxed">
            <h2 className="font-bold text-sm text-slate-900 mb-1">
              The Artificial Trap: &quot;Predicting Distress with Black-Box AI&quot;
            </h2>
            <p>
              The original hackathon problem statement (SIH26094) proposed: <em>&quot;AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities&quot;</em>.
              If implemented naively, it produces an invasive, patronizing system that <strong>no atrocity survivor would trust, and no caseworker could legally act upon</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Flawed Approach */}
            <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm border-b border-slate-200 pb-2">
                <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>What Fails in the Field (The Naive Trap)</span>
              </div>

              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold shrink-0">✕</span>
                  <span>
                    <strong>Zero Ground Truth Data:</strong> There is no validated clinical dataset correlating a rural survivor&apos;s vocal tone with PTSD. Fabricating single-number distress scores without asking what they need is unscientific.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold shrink-0">✕</span>
                  <span>
                    <strong>State Surveillance Fear:</strong> In SC/ST atrocities, perpetrators frequently hold local influence. If vulnerable victims fear the state is &quot;monitoring their psychology,&quot; they clam up and stop communicating.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold shrink-0">✕</span>
                  <span>
                    <strong>Treating a Material Crisis as a Purely Psychiatric One:</strong> Survivor trauma stems from <em>unpaid Section 15A relief money</em>, <em>intimidation before trial</em>, and <em>administrative silence</em>. A chatbot cannot feed a family or stop armed intimidation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold shrink-0">✕</span>
                  <span>
                    <strong>The Smartphone Delusion:</strong> The most vulnerable victims in rural belts do not possess 5G smartphones with high-speed internet to install complex apps.
                  </span>
                </li>
              </ul>
            </div>

            {/* Sahayak Reality */}
            <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-slate-200 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>What Survivors Actually Need (Sahayak Architecture)</span>
              </div>

              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>
                    <strong>Direct, Respectful Needs Questioning:</strong> Don&apos;t guess or predict. Ask directly: <em>&quot;Do you feel safe right now? Do you need a police escort for court? Has your compensation arrived?&quot;</em>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>
                    <strong>₹800 Feature Phone Telephony (IVR / 2G SMS):</strong> Functions over standard voice calls and DTMF keypad presses without internet, apps, or digital literacy barriers across 9 official Indian languages.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>
                    <strong>Inverting Surveillance to the State:</strong> The system doesn&apos;t judge the victim; it flags <em>Lapsed Contact (&gt;14 days)</em> and <em>Pending Statutory Compensation</em> to hold District Welfare Officers accountable.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>
                    <strong>Human-in-the-Loop Clinical Triage:</strong> The therapy model acts strictly as an explainable assistant highlighting risk phrases (e.g. <em>&quot;threat to life&quot;</em>, <em>&quot;cannot sleep&quot;</em>) to help caseworkers prioritize immediate human intervention.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Field Realities */}
      {activeTab === 'field_problems' && (
        <div className="bg-white border border-slate-300 rounded p-4 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#0B2545]" />
            <span>Field Reality: Why Atrocity Survivors Fall Through the Cracks in India</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded bg-slate-50 border border-slate-300 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>1. Witness Intimidation &amp; Isolation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Trials under the PoA Act routinely take 2 to 5 years. During this period, victims are threatened by perpetrators to turn hostile. When caseworkers do not check in regularly, victims feel abandoned and give up.
              </p>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-300 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <span>2. Unpaid Section 15A Relief</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                The PoA Rules mandate immediate relief (25% on FIR, 50% on charge-sheet, 25% on conviction). In practice, funds get stalled in sub-treasury verification. Without relief money, families cannot even afford travel to the Special Court.
              </p>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-300 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>3. Language &amp; Dialect Barriers</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Survivors in tribal or rural belts speak regional tongues (Odia, Santhali, Gondi, Tamil, Bhojpuri). Official notices in formal state English or Hindi are inaccessible without spoken, conversational assistance in their mother tongue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sahayak Solution */}
      {activeTab === 'sahayak_solution' && (
        <div className="bg-white border border-slate-300 rounded p-4 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-700" />
            <span>How MoSJE Sahayak Operates in Real District Environments</span>
          </h2>

          <div className="space-y-3 text-slate-700 leading-relaxed">
            <div className="flex items-start gap-3 p-3.5 rounded bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Automated Outbound Cadence on 2G Networks</h3>
                <p className="text-slate-600 mt-0.5">
                  Instead of expecting a victim to navigate a website, the platform places an automated call at their safe, pre-selected hour in their mother tongue across 9 official Indian languages.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Direct Statutory Entitlement Tracking</h3>
                <p className="text-slate-600 mt-0.5">
                  Every check-in explicitly logs Section 15A statutory needs: Police Protection, Legal Aid Escort, Travel Allowances, and Medical Aid. These generate high-priority triage items on the District Welfare Officer&apos;s queue.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Explainable Clinical Triage Assistant</h3>
                <p className="text-slate-600 mt-0.5">
                  The clinical distress score flags priority cases based on transcribed survivor words and explicit triggers (e.g. <em>&quot;threatened at home&quot;</em>). It never overrides the survivor&apos;s directly reported needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 5 Public Impact Litmus Tests */}
      {activeTab === 'litmus_test' && (
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0B2545]" />
            <span>The Five Public Impact Litmus Tests</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-3 border border-slate-300">Evaluation Criterion</th>
                  <th className="p-3 border border-slate-300">Naive AI Surveillance Model</th>
                  <th className="p-3 border border-slate-300">MoSJE Sahayak Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border border-slate-300">
                    1. Will a rural tribal survivor actually use it?
                  </td>
                  <td className="p-3 text-red-900 bg-red-50/50 border border-slate-300">
                    No. Requires smartphone, high-speed data, and digital literacy.
                  </td>
                  <td className="p-3 text-emerald-950 bg-emerald-50/50 border border-slate-300 font-medium">
                    Yes. Operates over regular incoming voice calls on any ₹800 feature phone in 9 local languages.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border border-slate-300">
                    2. Does it mitigate witness intimidation?
                  </td>
                  <td className="p-3 text-red-900 bg-red-50/50 border border-slate-300">
                    No. Displays an ungrounded clinical score without alerting police.
                  </td>
                  <td className="p-3 text-emerald-950 bg-emerald-50/50 border border-slate-300 font-medium">
                    Yes. Directly captures threats and triggers an immediate Section 15A protection flag for the caseworker.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border border-slate-300">
                    3. Does it hold the state accountable?
                  </td>
                  <td className="p-3 text-red-900 bg-red-50/50 border border-slate-300">
                    No. Monitors the victim&apos;s mental state rather than official follow-up.
                  </td>
                  <td className="p-3 text-emerald-950 bg-emerald-50/50 border border-slate-300 font-medium">
                    Yes. Flags caseworkers when contact has lapsed (&gt;14 days) or statutory compensation is delayed.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border border-slate-300">
                    4. Can the model be audited for algorithmic bias?
                  </td>
                  <td className="p-3 text-red-900 bg-red-50/50 border border-slate-300">
                    No. Proprietary opaque predictions.
                  </td>
                  <td className="p-3 text-emerald-950 bg-emerald-50/50 border border-slate-300 font-medium">
                    Yes. Complete explainability displaying detected indicators and trigger tokens with confidence metrics.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border border-slate-300">
                    5. Does the citizen retain agency &amp; privacy?
                  </td>
                  <td className="p-3 text-red-900 bg-red-50/50 border border-slate-300">
                    No. Mandatory background monitoring without consent controls.
                  </td>
                  <td className="p-3 text-emerald-950 bg-emerald-50/50 border border-slate-300 font-medium">
                    Yes. Dedicated statutory privacy portal, safe-timing preference, and one-click consent pause.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
