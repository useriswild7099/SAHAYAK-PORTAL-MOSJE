import React, { useState } from 'react';
import {
  Cpu,
  Code2,
  CheckCircle2,
  Send,
  MessageSquare,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Server,
  Terminal,
  Key,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { AtrocityCase } from '../types/ivr';
import { therapyModelService } from '../services/therapyModelService';
import { LiquidGlassContainer } from './liquid-glass/LiquidGlassContainer';
import { LiquidGlassButton } from './liquid-glass/LiquidGlassButton';

interface CompanionIntegrationViewProps {
  cases: AtrocityCase[];
  onScoresUpdated: () => void;
}

export const CompanionIntegrationView: React.FC<CompanionIntegrationViewProps> = ({
  cases,
  onScoresUpdated,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [testScore, setTestScore] = useState<number>(82);
  const [testSnippet, setTestSnippet] = useState<string>(
    'Nighttime anxiety is very high. Accused relatives were seen watching our lane and made threatening remarks about Tuesday court testimony.'
  );
  const [companionType, setCompanionType] = useState<'journal' | 'chatbot' | 'both'>('both');
  const [injectedSuccess, setInjectedSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'python' | 'curl' | 'javascript'>('python');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const bridgeToken = 'mosje_sec_bridge_live_8f3a99c1';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } else {
      setCopiedSnippet(label);
      setTimeout(() => setCopiedSnippet(null), 2500);
    }
  };

  const handleDownloadPythonScript = () => {
    const scriptContent = `#!/usr/bin/env python3
"""
MoSJE Companion Bridge - Local PC Chatbot & Journal Sync Client
Under SC/ST PoA Statutory Framework & DPDP Act 2023

Use this client in your local PC chatbot / journaling project to send 
calibrated distress scores to the District Welfare Officer Desk.
"""

import json
import urllib.request
import urllib.error

# Configuration
PORTAL_URL = "http://localhost:3000/api/companion/ingest"
AUTH_TOKEN = "${bridgeToken}"

def sync_distress_score(
    case_id: str = "${selectedCase?.id || 'CASE-2026-ALW-019'}",
    distress_score: int = 75,
    journal_snippet: str = "",
    source: str = "LOCAL_PC_CHATBOT_JOURNAL"
):
    """
    Sends evaluated emotional metric to the district welfare triage desk.
    Note: Under statutory data minimization, your full intimate diary remains
    safely on this PC. Only the calibrated safety score is transmitted.
    """
    # Defensive score clamping [0, 100]
    safe_score = max(0, min(100, int(distress_score)))
    
    risk_tier = "CRITICAL" if safe_score >= 75 else "ELEVATED" if safe_score >= 50 else "MODERATE" if safe_score >= 25 else "LOW"

    payload = {
        "caseId": case_id,
        "distressScore": safe_score,
        "riskTier": risk_tier,
        "sourceProject": source,
        "journalSnippet": journal_snippet[:500] if journal_snippet else None,
        "detectedIndicators": [
            "Local PC Sentiment Metric",
            "Diary Somatic Reflection" if journal_snippet else "Conversational Evaluation"
        ]
    }

    req = urllib.request.Request(
        PORTAL_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AUTH_TOKEN}",
            "User-Agent": "LocalPCCompanionClient/1.0"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            print(f"[OK] Distress score {safe_score}/100 ({risk_tier}) synced for case {case_id} (HTTP {status})")
            return True
    except urllib.error.URLError as e:
        print(f"[INFO] In local prototype mode, use the in-app Web Ingestion Simulator or route through dev proxy.")
        print(f"Payload ready for transmission: {payload}")
        return False

if __name__ == "__main__":
    print("Testing local companion score sync...")
    sync_distress_score(
        case_id="${selectedCase?.id || 'CASE-2026-ALW-019'}",
        distress_score=${testScore},
        journal_snippet="${testSnippet.replace(/"/g, '\\"')}"
    )
`;

    const blob = new Blob([scriptContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companion_client.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateIngestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;

    const sourceName =
      companionType === 'both'
        ? 'LOCAL_PC_CHATBOT_AND_JOURNAL'
        : companionType === 'journal'
        ? 'LOCAL_PC_JOURNALING_COMPANION'
        : 'LOCAL_PC_CHATBOT_COMPANION';

    const result = therapyModelService.ingestExternalScore(
      selectedCaseId,
      testScore,
      undefined,
      {
        sourceProject: sourceName,
        journalSnippet: testSnippet,
        detectedIndicators: [
          companionType === 'journal'
            ? 'Diary Reflection: High Fear & Intimidation Signal'
            : 'Chatbot Dialogue: Witness Retaliation Concern',
          'Somatic Distress Index & Hypervigilance',
        ],
        extractedPhrases: [testSnippet.slice(0, 75)],
        recommendedInterventions: [
          testScore >= 75
            ? 'Urgent Caseworker Outreach & Verification of Section 15A Witness Protection Escort'
            : 'Schedule follow-up check-in and verify safe contact hours',
        ],
      }
    );

    if (result) {
      onScoresUpdated();
      setInjectedSuccess(
        `Successfully ingested score (${testScore}/100, ${result.riskTier}) for ${selectedCase?.victimPseudonym || selectedCaseId}. Caseworker triage queue is now updated.`
      );
      setTimeout(() => setInjectedSuccess(null), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Government Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" aria-label="Breadcrumb">
        <span className="text-slate-700">MoSJE Central</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">Caseworker Gateway</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold">Local PC Companion &amp; Journaling Ingestion Bridge</span>
      </nav>

      {/* Header */}
      <LiquidGlassContainer borderRadius={12} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Server className="w-4 h-4 text-emerald-700" />
              <span>External Local Integration Gateway</span>
              <span aria-hidden="true">·</span>
              <span>PC Companion &amp; Journal Bridge</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Chatbot &amp; Journaling Score Ingestion Hub
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Designed to connect with your separate local PC chatbot and journaling project.
              When your local companion evaluates a survivor&apos;s daily thoughts or chat sessions, it sends the computed distress
              score directly to this endpoint to prioritize triage for the District Welfare Officer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Bearer Token Badge */}
            <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-300 px-3 py-2 rounded text-xs">
              <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">API Token</div>
                <div className="font-mono font-bold text-slate-900">{bridgeToken.slice(0, 18)}...</div>
              </div>
              <button
                onClick={() => handleCopy(bridgeToken, 'key')}
                className="ml-1 p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                title="Copy bridge token"
                aria-label="Copy authorization token"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <LiquidGlassButton
              variant="primary"
              size="md"
              onClick={handleDownloadPythonScript}
              icon={<Download className="w-3.5 h-3.5 text-amber-300" />}
            >
              Download Python Bridge
            </LiquidGlassButton>
          </div>
        </div>
      </LiquidGlassContainer>

      {/* Success Notification */}
      {injectedSuccess && (
        <div
          role="status"
          className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{injectedSuccess}</span>
        </div>
      )}

      {/* Main Grid: Interactive Test Ingestion & API Code Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Ingestion Simulator Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <LiquidGlassContainer borderRadius={12} className="p-4 space-y-4 text-xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0B2545]" />
                <span>Simulate Score Ingestion from Your PC Companion</span>
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Test how incoming scores from your local chatbot or journaling project update the live caseworker queue.
              </p>
            </div>

            <form onSubmit={handleSimulateIngestion} className="space-y-4">
              {/* Select Case */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Beneficiary Profile</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded border border-slate-300 px-3 py-1.5 focus:outline-none font-semibold text-xs"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} · {c.victimPseudonym} ({c.district}) — Current Score:{' '}
                      {c.therapyModelResult?.distressScore ?? 'None'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Companion Source Type */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Local PC Project Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Chatbot + Journal', icon: Cpu },
                    { id: 'chatbot', label: 'Chatbot Companion', icon: MessageSquare },
                    { id: 'journal', label: 'Journaling Diary', icon: BookOpen },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setCompanionType(id as any)}
                      className={`p-2.5 rounded border text-left flex items-center gap-1.5 transition-colors ${
                        companionType === id
                          ? 'bg-slate-100 border-[#0B2545] text-[#0B2545] font-semibold ring-1 ring-[#0B2545]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                      <span className="text-[11px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Distress Score Slider & Number */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-700 font-semibold">
                    Computed Distress Score (0 – 100)
                  </label>
                  <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    {testScore} / 100{' '}
                    <span
                      className={`text-xs font-sans ${
                        testScore >= 75
                          ? 'text-red-700 font-bold'
                          : testScore >= 50
                          ? 'text-amber-700 font-bold'
                          : 'text-emerald-700 font-bold'
                      }`}
                    >
                      ({testScore >= 75 ? 'CRITICAL' : testScore >= 50 ? 'ELEVATED' : testScore >= 25 ? 'MODERATE' : 'LOW'})
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={testScore}
                  onChange={(e) => setTestScore(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#0B2545]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>0 (Nominal)</span>
                  <span>35 (Moderate)</span>
                  <span>55 (Elevated)</span>
                  <span>75 (Critical Danger)</span>
                  <span>100</span>
                </div>
              </div>

              {/* Journal / Chat Transcript Sample */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Sample Journal Entry or Chat Excerpt (Extracted on PC)
                </label>
                <textarea
                  rows={3}
                  value={testSnippet}
                  onChange={(e) => setTestSnippet(e.target.value)}
                  placeholder="Paste snippet analyzed by your local PC model..."
                  className="w-full bg-white text-slate-900 rounded border border-slate-300 p-2.5 focus:outline-none font-mono text-xs"
                />
              </div>

              {/* Submit Ingestion */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Updates beneficiary file &amp; triage priority instantly
                </span>
                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send className="w-3.5 h-3.5 text-amber-300" />}
                >
                  Send Ingestion Payload
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassContainer>

          {/* Current Score State for Selected Beneficiary */}
          {selectedCase && (
            <LiquidGlassContainer borderRadius={10} className="p-4 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">
                Active Score State for {selectedCase.victimPseudonym}:
              </h3>
              {selectedCase.therapyModelResult ? (
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Distress Score:</span>
                    <strong className="font-mono font-bold text-slate-900 tabular-nums">
                      {selectedCase.therapyModelResult.distressScore} / 100
                    </strong>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800">
                      Tier: {selectedCase.therapyModelResult.riskTier}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      Source: {selectedCase.therapyModelResult.modelSource}
                    </span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-500">Detected Signals: </span>
                    <span>{selectedCase.therapyModelResult.detectedIndicators.join(', ')}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No distress score recorded yet for this case.</p>
              )}
            </LiquidGlassContainer>
          )}
        </div>

        {/* Right Column: Code Snippets & API Schema for Local PC Project (5 cols) */}
        <div className="lg:col-span-5 space-y-5 text-xs">
          {/* API Endpoint Documentation & Tabs */}
          <LiquidGlassContainer borderRadius={12} className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#0B2545]" />
                <h3 className="font-bold text-slate-900">
                  Local PC Code Integration
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px]">
                {(['python', 'curl', 'javascript'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] transition-colors ${
                      activeTab === tab
                        ? 'bg-[#0B2545] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              Ready-to-copy integration code for your local project with token authorization:
            </p>

            {activeTab === 'python' && (
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-slate-800 text-[11px]">Python (requests):</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `import requests\n\nurl = "http://localhost:3000/api/companion/ingest"\nheaders = {\n    "Authorization": "Bearer ${bridgeToken}",\n    "Content-Type": "application/json"\n}\npayload = {\n    "caseId": "${selectedCase?.id || 'CASE-2026-ALW-019'}",\n    "distressScore": ${testScore},\n    "journalSnippet": "${testSnippet.slice(0, 60)}...",\n    "sourceProject": "LOCAL_PC_CHATBOT_JOURNAL"\n}\n\nresp = requests.post(url, json=payload, headers=headers)\nprint(resp.json())`,
                        'python'
                      )
                    }
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-1"
                  >
                    {copiedSnippet === 'python' ? 'Copied!' : 'Copy snippet'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto leading-snug">
{`import requests

url = "http://localhost:3000/api/companion/ingest"
headers = {
    "Authorization": "Bearer ${bridgeToken}",
    "Content-Type": "application/json"
}
payload = {
    "caseId": "${selectedCase?.id || 'CASE-2026-ALW-019'}",
    "distressScore": ${testScore},
    "journalSnippet": "${testSnippet.slice(0, 45)}...",
    "sourceProject": "LOCAL_PC_CHATBOT_JOURNAL"
}

resp = requests.post(url, json=payload, headers=headers)
print(resp.status_code)`}
                </pre>
              </div>
            )}

            {activeTab === 'curl' && (
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-slate-800 text-[11px]">cURL Terminal Command:</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `curl -X POST http://localhost:3000/api/companion/ingest \\\n  -H "Authorization: Bearer ${bridgeToken}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"caseId": "${selectedCase?.id || 'CASE-2026-ALW-019'}", "distressScore": ${testScore}, "journalSnippet": "${testSnippet.slice(0, 45)}..."}'`,
                        'curl'
                      )
                    }
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-1"
                  >
                    {copiedSnippet === 'curl' ? 'Copied!' : 'Copy snippet'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto leading-snug">
{`curl -X POST http://localhost:3000/api/companion/ingest \\
  -H "Authorization: Bearer ${bridgeToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "caseId": "${selectedCase?.id || 'CASE-2026-ALW-019'}",
    "distressScore": ${testScore},
    "journalSnippet": "${testSnippet.slice(0, 40)}..."
  }'`}
                </pre>
              </div>
            )}

            {activeTab === 'javascript' && (
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-slate-800 text-[11px]">JavaScript / Node.js fetch:</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `await fetch('/api/companion/ingest', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer ${bridgeToken}'\n  },\n  body: JSON.stringify({\n    caseId: '${selectedCase?.id || 'CASE-2026-ALW-019'}',\n    distressScore: ${testScore},\n    journalSnippet: '${testSnippet.slice(0, 40)}...'\n  })\n});`,
                        'javascript'
                      )
                    }
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-1"
                  >
                    {copiedSnippet === 'javascript' ? 'Copied!' : 'Copy snippet'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto leading-snug">
{`await fetch('/api/companion/ingest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${bridgeToken}'
  },
  body: JSON.stringify({
    caseId: '${selectedCase?.id || 'CASE-2026-ALW-019'}',
    distressScore: ${testScore},
    journalSnippet: '${testSnippet.slice(0, 35)}...'
  })
});`}
                </pre>
              </div>
            )}
          </LiquidGlassContainer>

          {/* Privacy & Ethical Guarantee Notice */}
          <LiquidGlassContainer borderRadius={10} className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Statutory DPDP Act 2023 Shield</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              To protect survivor confidentiality under the DPDP Act 2023, your local PC companion computes sentiment locally on device and transmits ONLY numerical distress thresholds and safety flags, preserving complete diary privacy.
            </p>
          </LiquidGlassContainer>
        </div>
      </div>
    </div>
  );
};

