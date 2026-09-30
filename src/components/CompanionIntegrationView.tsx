import React from 'react';
import {
  Server,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Users,
  Clock,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { AtrocityCase } from '../types/ivr';
import { LiquidGlassContainer } from './liquid-glass/LiquidGlassContainer';

interface CompanionIntegrationViewProps {
  cases: AtrocityCase[];
  onScoresUpdated: () => void;
}

export const CompanionIntegrationView: React.FC<CompanionIntegrationViewProps> = ({ cases }) => {
  // Derive real stats from actual case data
  const casesWithScore = cases.filter((c) => c.therapyModelResult?.distressScore != null);
  const criticalCases = casesWithScore.filter(
    (c) => (c.therapyModelResult?.distressScore ?? 0) >= 75
  );
  const elevatedCases = casesWithScore.filter(
    (c) =>
      (c.therapyModelResult?.distressScore ?? 0) >= 50 &&
      (c.therapyModelResult?.distressScore ?? 0) < 75
  );
  const stableCases = casesWithScore.filter(
    (c) => (c.therapyModelResult?.distressScore ?? 0) < 50
  );

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-700 bg-red-50 border-red-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'ELEVATED';
    if (score >= 25) return 'MODERATE';
    return 'STABLE';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" aria-label="Breadcrumb">
        <span className="text-slate-700">MoSJE Central</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">Caseworker Gateway</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold">ZenGuard AI Companion Bridge</span>
      </nav>

      {/* Header Card */}
      <LiquidGlassContainer borderRadius={12} className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Server className="w-4 h-4 text-emerald-700" />
              <span>ZenGuard AI Integration</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Companion Score Ingestion Hub
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              This view shows live distress scores received from beneficiaries using the ZenGuard AI
              companion app. When a beneficiary journals or chats, the computed score is automatically
              pushed here to help you prioritise care and triage.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Live Sync Active</span>
          </div>
        </div>
      </LiquidGlassContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Cases',
            value: cases.length,
            icon: Users,
            color: 'text-slate-700 bg-slate-50 border-slate-200',
          },
          {
            label: 'Scores Received',
            value: casesWithScore.length,
            icon: Activity,
            color: 'text-blue-700 bg-blue-50 border-blue-200',
          },
          {
            label: 'Critical',
            value: criticalCases.length,
            icon: AlertTriangle,
            color: 'text-red-700 bg-red-50 border-red-200',
          },
          {
            label: 'Stable',
            value: stableCases.length,
            icon: CheckCircle2,
            color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`flex flex-col gap-2 p-4 rounded-lg border ${color}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}</span>
              <Icon className="w-4 h-4 opacity-60" />
            </div>
            <span className="text-2xl font-bold tabular-nums">{value}</span>
          </div>
        ))}
      </div>

      {/* Case Score List */}
      <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0B2545]" />
            Live Beneficiary Distress Scores
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            {casesWithScore.length} of {cases.length} cases have received scores
          </span>
        </div>

        {cases.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No cases loaded.</p>
        ) : (
          <div className="space-y-2">
            {cases.map((c) => {
              const score = c.therapyModelResult?.distressScore;
              const hasScore = score != null;
              return (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white border border-slate-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#0B2545]/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#0B2545]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{c.victimPseudonym}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {c.id} · {c.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {hasScore ? (
                      <>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Distress Score</div>
                          <div className="text-sm font-bold text-slate-900 tabular-nums">{score} / 100</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-bold border ${getRiskColor(score!)}`}
                        >
                          {getRiskLabel(score!)}
                        </span>
                        {c.therapyModelResult?.lastUpdated && (
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 hidden md:flex">
                            <Clock className="w-3 h-3" />
                            {new Date(c.therapyModelResult.lastUpdated).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="px-2.5 py-1 rounded text-[11px] font-medium border bg-slate-50 border-slate-200 text-slate-500">
                        No Score Yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </LiquidGlassContainer>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0B2545]" />
            How Scores Are Received
          </h3>
          <ol className="space-y-2 text-xs text-slate-700">
            {[
              'Beneficiary opens the ZenGuard AI companion app on their PC or phone.',
              'They write in their journal or chat with the AI companion.',
              'ZenGuard computes a distress score locally — private thoughts never leave their device.',
              'Only the numerical score is sent securely to this dashboard.',
              'The caseworker queue is updated automatically so you can act quickly.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </LiquidGlassContainer>

        <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            DPDP Act 2023 — Privacy Shield
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under the Digital Personal Data Protection Act 2023, beneficiaries&apos; raw diary entries
            and chat sessions remain entirely on their personal device. Only a calibrated numerical
            distress score is transmitted to this dashboard.
          </p>
          <div className="mt-2 space-y-1.5 text-xs">
            {[
              { label: 'Personal diary content', status: 'Stays on device', ok: true },
              { label: 'Chat transcripts', status: 'Stays on device', ok: true },
              { label: 'Distress score (0–100)', status: 'Sent to officer', ok: false },
              { label: 'Risk tier (Critical / Elevated)', status: 'Sent to officer', ok: false },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-slate-700">{label}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    ok
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>DPDP Act 2023 · Sec 15A SC/ST PoA Framework</span>
          </div>
        </LiquidGlassContainer>
      </div>
    </div>
  );
};
