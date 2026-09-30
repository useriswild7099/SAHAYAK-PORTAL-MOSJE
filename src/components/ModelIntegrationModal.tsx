import React, { useState } from 'react';
import {
  X,
  Cpu,
  Server,
  Play,
  CheckCircle2,
  Sliders,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { therapyModelService } from '../services/therapyModelService';
import { TherapyModelConfig, TherapyModelResult } from '../types/ivr';

interface ModelIntegrationModalProps {
  onClose: () => void;
  onScoresUpdated: () => void;
}

const SAMPLE_TEXT_BENCHMARKS = [
  {
    title: 'High Threat / Intimidation',
    text: 'रात को आरोपी के रिश्तेदार घर के चक्कर लगा रहे थे और गवाही न देने की धमकी दी। जान का खतरा लग रहा है, बहुत डर लग रहा है।',
  },
  {
    title: 'Severe Trauma / Insomnia',
    text: 'Unable to sleep for the last four days. Constantly shaking and experiencing panic attacks whenever there is a knock at the door.',
  },
  {
    title: 'Relief Compensation & Legal Delay',
    text: 'Court hearing was adjourned again for the third time. The lawyer is demanding fees and the Section 15A compensation is still stuck at the treasury.',
  },
  {
    title: 'Stable / Coping Adequately',
    text: 'Things have been quiet this week. The village social worker accompanied us to file the verification form. Feeling safe right now.',
  },
];

export const ModelIntegrationModal: React.FC<ModelIntegrationModalProps> = ({
  onClose,
  onScoresUpdated,
}) => {
  const [config, setConfig] = useState<TherapyModelConfig>(therapyModelService.getConfig());
  const [activeTab, setActiveTab] = useState<'config' | 'playground' | 'api_schema'>('config');

  // Test playground state
  const [testInputText, setTestInputText] = useState(SAMPLE_TEXT_BENCHMARKS[0].text);
  const [isInferring, setIsInferring] = useState(false);
  const [testResult, setTestResult] = useState<TherapyModelResult | null>(null);

  // Batch scoring state
  const [isBatchScoring, setIsBatchScoring] = useState(false);
  const [batchScoreSuccess, setBatchScoreSuccess] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    therapyModelService.saveConfig(config);
    setBatchScoreSuccess(true);
    setTimeout(() => setBatchScoreSuccess(false), 3000);
  };

  const handleRunPlaygroundInference = async () => {
    if (!testInputText.trim()) return;
    setIsInferring(true);
    try {
      const res = await therapyModelService.analyzeText(testInputText.trim());
      setTestResult(res);
    } finally {
      setIsInferring(false);
    }
  };

  const handleRunBatchScoring = async () => {
    setIsBatchScoring(true);
    try {
      await therapyModelService.scoreAllCases();
      onScoresUpdated();
      setBatchScoreSuccess(true);
      setTimeout(() => setBatchScoreSuccess(false), 4000);
    } finally {
      setIsBatchScoring(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-800 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Clinical Distress NLP Model Hub</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 border border-slate-300">
                  {config.mode === 'CUSTOM_ENDPOINT' ? 'External API' : 'Built-in Adapter'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                ICD-11 / PHQ-9 Clinical Speech Distress Scoring Configuration &amp; REST Adapter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'config'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Model Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'playground'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Inference Benchmark</span>
          </button>

          <button
            onClick={() => setActiveTab('api_schema')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'api_schema'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>REST API Endpoint Schema</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {batchScoreSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Model configuration and batch scores updated successfully.</span>
            </div>
          )}

          {/* TAB 1: CONFIGURATION */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-slate-800 font-bold mb-2">Model Execution Engine</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setConfig({ ...config, mode: 'BUILTIN_ADAPTER' })}
                    className={`p-3.5 rounded border cursor-pointer transition-colors ${
                      config.mode === 'BUILTIN_ADAPTER'
                        ? 'bg-slate-100 border-[#0B2545] text-[#0B2545] ring-1 ring-[#0B2545]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-slate-700" />
                      <span>Built-in Clinical Distress Adapter</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Calibrated for PoA Act survivor scenarios: detects witness intimidation, insomnia, legal fatigue, and crisis ideation.
                    </p>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, mode: 'CUSTOM_ENDPOINT' })}
                    className={`p-3.5 rounded border cursor-pointer transition-colors ${
                      config.mode === 'CUSTOM_ENDPOINT'
                        ? 'bg-slate-100 border-[#0B2545] text-[#0B2545] ring-1 ring-[#0B2545]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-slate-700" />
                      <span>External REST Inference Endpoint</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Connect your custom trained model URL (FastAPI, PyTorch, HuggingFace, or microservice endpoint).
                    </p>
                  </div>
                </div>
              </div>

              {/* Endpoint Fields */}
              {config.mode === 'CUSTOM_ENDPOINT' && (
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <div className="font-bold text-slate-900">
                    External Model HTTP Parameters
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Inference Endpoint URL</label>
                    <input
                      type="url"
                      required
                      value={config.endpointUrl}
                      onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
                      placeholder="https://your-model-server.com/api/predict-distress"
                      className="w-full bg-white text-slate-900 rounded border border-slate-300 px-3 py-1.5 font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">API Key / Bearer Token (Optional)</label>
                      <input
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="Bearer token or API Secret..."
                        className="w-full bg-white text-slate-900 rounded border border-slate-300 px-3 py-1.5 font-mono text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Model Name / Checkpoint</label>
                      <input
                        type="text"
                        value={config.modelName}
                        onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                        placeholder="e.g. RoBERTa-Distress-EnHi-v1"
                        className="w-full bg-white text-slate-900 rounded border border-slate-300 px-3 py-1.5 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Triage Thresholds */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">
                  Distress Urgency Thresholds (0 – 100 Scale)
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Critical Urgency Threshold:</span>
                      <span className="font-mono text-red-700 font-bold">{config.scoreThresholdCritical}/100</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={95}
                      value={config.scoreThresholdCritical}
                      onChange={(e) => setConfig({ ...config, scoreThresholdCritical: Number(e.target.value) })}
                      className="w-full accent-red-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Scores above this trigger immediate caseworker outreach.</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Elevated Distress Threshold:</span>
                      <span className="font-mono text-amber-700 font-bold">{config.scoreThresholdElevated}/100</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={70}
                      value={config.scoreThresholdElevated}
                      onChange={(e) => setConfig({ ...config, scoreThresholdElevated: Number(e.target.value) })}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Scores above this flag need for trauma support review.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRunBatchScoring}
                  disabled={isBatchScoring}
                  className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center gap-1.5 transition-colors border border-slate-300 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBatchScoring ? 'animate-spin' : ''}`} />
                  <span>{isBatchScoring ? 'Batch Scoring...' : 'Re-Score All Beneficiaries'}</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0B2545] hover:bg-[#12335C] text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-bold text-slate-900">Select Test Corpus or Input Custom Speech Transcript:</span>
                <span className="text-[11px] text-slate-500">Evaluates active adapter</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_TEXT_BENCHMARKS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestInputText(sample.text)}
                    className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-900 text-xs">{sample.title}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{sample.text}</div>
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={testInputText}
                  onChange={(e) => setTestInputText(e.target.value)}
                  placeholder="Paste or type survivor check-in transcript..."
                  className="w-full bg-white text-slate-900 rounded border border-slate-300 p-2.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunPlaygroundInference}
                  disabled={isInferring}
                  className="px-4 py-1.5 rounded bg-[#0B2545] hover:bg-[#12335C] text-white font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isInferring ? 'Inferring...' : 'Execute Model Inference'}</span>
                </button>
              </div>

              {testResult && (
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3 mt-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900">Inference Evaluation Result</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Source: {testResult.modelSource} · Confidence: {(testResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-white border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Computed Distress Score:</div>
                      <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                        {testResult.distressScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-white border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Priority Classification:</div>
                      <div className="mt-1 font-bold text-slate-900 uppercase">
                        {testResult.riskTier} URGENCY
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Detected Psychological &amp; Situational Indicators:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {testResult.detectedIndicators.map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 text-[11px]"
                        >
                          • {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Recommended Statutory Interventions:
                    </span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {testResult.recommendedInterventions.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REST API SPEC */}
          {activeTab === 'api_schema' && (
            <div className="space-y-3 font-mono text-xs">
              <p className="text-slate-700 font-sans leading-relaxed">
                To connect an external model, deploy an HTTP service (e.g. FastAPI / Flask / PyTorch) matching this JSON schema:
              </p>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-slate-800 font-bold font-sans">1. Outbound Payload Sent by MoSJE Sahayak:</span>
                <pre className="text-slate-800 overflow-x-auto p-2.5 bg-white border border-slate-200 rounded text-[11px]">
{`POST /api/predict-distress HTTP/1.1
Content-Type: application/json
Authorization: Bearer <YOUR_API_KEY>

{
  "text": "रात को आरोपी के रिश्तेदार चक्कर लगा रहे हैं, बहुत डर लग रहा है।",
  "context": {
    "caseId": "CASE-2026-ALW-019",
    "selfReportedStatus": "critical_crisis",
    "needs": ["police_witness_security"]
  },
  "model_name": "Clinical-Trauma-NLP-v2"
}`}
                </pre>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-slate-800 font-bold font-sans">2. Expected Response Schema:</span>
                <pre className="text-slate-800 overflow-x-auto p-2.5 bg-white border border-slate-200 rounded text-[11px]">
{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "distressScore": 88,
  "riskTier": "CRITICAL",
  "confidence": 0.94,
  "detectedIndicators": [
    "Direct Witness Intimidation / Fear of Retaliation",
    "Acute Hypervigilance"
  ],
  "extractedPhrases": ["आरोपी के रिश्तेदार", "डर लग रहा है"],
  "recommendedInterventions": [
    "Immediate activation of Section 15A Witness Protection Escort",
    "Police van patrolling at victim residence"
  ]
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
