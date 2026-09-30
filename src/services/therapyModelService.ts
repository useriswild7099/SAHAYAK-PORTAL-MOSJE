import { AtrocityCase, CheckInRecord, TherapyModelConfig, TherapyModelResult } from '../types/ivr';
import { storageService } from './storageService';
import { smsService } from './smsService';

const MODEL_CONFIG_KEY = 'mosje_therapy_model_config_v1';

export const DEFAULT_MODEL_CONFIG: TherapyModelConfig = {
  endpointUrl: 'https://api.example.com/v1/distress-classifier',
  apiKey: '',
  modelName: 'Clinical-Trauma-NLP-v2',
  mode: 'BUILTIN_ADAPTER',
  autoAnalyzeIncoming: true,
  scoreThresholdCritical: 75,
  scoreThresholdElevated: 50,
};

// Clinical & Situational Distress Lexicon for MoSJE population
interface DistressPattern {
  indicator: string;
  category: 'threat_intimidation' | 'trauma_somatic' | 'hopelessness' | 'legal_frustration' | 'protective_factors';
  weight: number;
  keywords: string[];
  recommendedAction: string;
}

const DISTRESS_LEXICON: DistressPattern[] = [
  {
    indicator: 'Direct Witness Intimidation / Fear of Retaliation',
    category: 'threat_intimidation',
    weight: 35,
    keywords: [
      'threat', 'threats', 'threatened', 'kill', 'attack', 'men outside', 'surveillance', 'watching',
      'afraid to leave', 'fear for life', 'police protection', 'accused', 'ch चक्कर', 'डर', 'धमकी',
      'जान का खतरा', 'हमला', 'सुरक्षा', 'গোপন নজরদারি', 'হুমকি', 'பயமுறுத்தல்', 'రక్షణ'
    ],
    recommendedAction: 'Immediate activation of Section 15A Witness Protection Escort and police van patrolling.',
  },
  {
    indicator: 'Acute Somatic Anxiety & Sleep Disruption',
    category: 'trauma_somatic',
    weight: 25,
    keywords: [
      'unable to sleep', 'nightmares', 'shaking', 'panic', 'chest pain', 'crying', 'cannot eat',
      'terrible anxiety', 'trauma', 'headache', 'नींद नहीं', 'घबराहट', 'रो रो कर', 'सिरदर्द',
      'ঘুম আসছে না', 'தூக்கமின்மை', 'నిద్ర లేదు'
    ],
    recommendedAction: 'Urgent tele-counselling session with District Clinical Psychologist.',
  },
  {
    indicator: 'Legal Fatigue & Perceived System Abandonment',
    category: 'legal_frustration',
    weight: 20,
    keywords: [
      'no one is helping', 'delay', 'postponed', 'dates after dates', 'court delay', 'lawyer fee',
      'money running out', 'compensation not received', 'starving', 'तारीख पर तारीख', 'कोई मदद नहीं',
      'मुआवजा नहीं मिला', 'আইনি সাহায্য', 'நிவாரண நிதி'
    ],
    recommendedAction: 'Expedite Section 15A sub-treasury relief sanction and schedule Legal Aid Advocate meeting.',
  },
  {
    indicator: 'Despair & Severe Helplessness',
    category: 'hopelessness',
    weight: 30,
    keywords: [
      'give up', 'hopeless', 'no reason to live', 'cannot take it anymore', 'end it all', 'worthless',
      'मजबूर', 'जीने की इच्छा नहीं', 'थक चुके हैं', 'সব শেষ', 'வாழ்வே வேண்டாம்'
    ],
    recommendedAction: 'Immediate Welfare Officer crisis visit; suicide prevention helpline intervention (Kiran 1800-599-0019).',
  },
];

class TherapyModelService {
  private config: TherapyModelConfig = DEFAULT_MODEL_CONFIG;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(MODEL_CONFIG_KEY);
      if (stored) {
        this.config = { ...DEFAULT_MODEL_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      this.config = DEFAULT_MODEL_CONFIG;
    }
  }

  public saveConfig(newConfig: Partial<TherapyModelConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      localStorage.setItem(MODEL_CONFIG_KEY, JSON.stringify(this.config));
    }
    this.notify();
  }

  public getConfig(): TherapyModelConfig {
    return { ...this.config };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  /**
   * Main inference method: Analyzes text and returns structured distress evaluation
   */
  public async analyzeText(
    text: string,
    context?: { caseId?: string; selfReportedStatus?: string; needs?: string[] }
  ): Promise<TherapyModelResult> {
    // If user configured a custom REST endpoint, try calling it
    if (this.config.mode === 'CUSTOM_ENDPOINT' && this.config.endpointUrl) {
      try {
        const response = await fetch(this.config.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
          },
          body: JSON.stringify({
            text,
            context,
            model_name: this.config.modelName,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          // Map standard or custom payload into TherapyModelResult
          const score = typeof json.distressScore === 'number' ? json.distressScore : (json.score || 50);
          return {
            distressScore: Math.min(100, Math.max(0, Math.round(score))),
            riskTier:
              score >= this.config.scoreThresholdCritical
                ? 'CRITICAL'
                : score >= this.config.scoreThresholdElevated
                ? 'ELEVATED'
                : score >= 25
                ? 'MODERATE'
                : 'LOW',
            confidence: json.confidence || 0.92,
            detectedIndicators: json.detectedIndicators || ['External Model Classification'],
            extractedPhrases: json.extractedPhrases || [text.slice(0, 80)],
            recommendedInterventions: json.recommendedInterventions || ['Caseworker Review Advised'],
            analyzedAt: new Date().toISOString(),
            modelSource: 'CUSTOM_ENDPOINT',
          };
        }
      } catch (err) {
        console.warn('Custom model endpoint failed or unreachable, using built-in adapter fallback:', err);
      }
    }

    // Built-in Trauma & Distress Scoring Adapter
    return this.runBuiltInDistressInference(text, context);
  }

  /**
   * Built-in Clinical & Situational Distress Scoring Engine
   */
  public runBuiltInDistressInference(
    text: string,
    context?: { caseId?: string; selfReportedStatus?: string; needs?: string[] }
  ): TherapyModelResult {
    const lower = (text || '').toLowerCase();
    let baseScore = 15; // Baseline low score
    const detectedIndicators: string[] = [];
    const extractedPhrases: string[] = [];
    const recommendedInterventions: string[] = [];

    // Contextual boost from citizen's direct self-report (ensures model aligns with citizen agency)
    if (context?.selfReportedStatus === 'critical_crisis') {
      baseScore += 35;
      detectedIndicators.push('Beneficiary Explicit Self-Report: Critical Crisis');
    } else if (context?.selfReportedStatus === 'moderate_distress') {
      baseScore += 20;
      detectedIndicators.push('Beneficiary Explicit Self-Report: Moderate Distress');
    }

    if (context?.needs?.includes('police_witness_security')) {
      baseScore += 25;
      detectedIndicators.push('Statutory Request: Witness Security Escort Needed');
      recommendedInterventions.push('Initiate Police Escort under Sec 15A PoA Act');
    }
    if (context?.needs?.includes('trauma_counselling')) {
      baseScore += 15;
      recommendedInterventions.push('Assign District Hospital Clinical Psychologist for tele-counselling');
    }
    if (context?.needs?.includes('compensation_disbursement')) {
      baseScore += 10;
      recommendedInterventions.push('Verify Sub-Treasury sanction status of interim relief');
    }

    // Pattern matching across text
    DISTRESS_LEXICON.forEach((pat) => {
      let matched = false;
      for (const kw of pat.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          matched = true;
          extractedPhrases.push(kw);
          break;
        }
      }

      if (matched) {
        baseScore += pat.weight;
        detectedIndicators.push(pat.indicator);
        if (!recommendedInterventions.includes(pat.recommendedAction)) {
          recommendedInterventions.push(pat.recommendedAction);
        }
      }
    });

    // Ensure within 0 to 100
    const finalScore = Math.min(100, Math.max(5, baseScore));

    let riskTier: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW' = 'LOW';
    if (finalScore >= this.config.scoreThresholdCritical) {
      riskTier = 'CRITICAL';
    } else if (finalScore >= this.config.scoreThresholdElevated) {
      riskTier = 'ELEVATED';
    } else if (finalScore >= 25) {
      riskTier = 'MODERATE';
    }

    if (recommendedInterventions.length === 0) {
      recommendedInterventions.push('Continue scheduled bi-weekly follow-up calls');
    }

    return {
      distressScore: finalScore,
      riskTier,
      confidence: 0.88 + Math.min(0.08, extractedPhrases.length * 0.02),
      detectedIndicators: Array.from(new Set(detectedIndicators)),
      extractedPhrases: Array.from(new Set(extractedPhrases)),
      recommendedInterventions,
      analyzedAt: new Date().toISOString(),
      modelSource: this.config.mode,
    };
  }

  /**
   * Ingests a distress score and emotional indicators directly from the external
   * local PC chatbot or journaling companion project.
   * Hardened with defensive boundary validation & clamping (Security & Hardening skill).
   */
  public ingestExternalScore(
    caseId: string,
    distressScore: number,
    riskTier?: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW',
    metadata?: {
      sourceProject?: string;
      journalSnippet?: string;
      detectedIndicators?: string[];
      extractedPhrases?: string[];
      recommendedInterventions?: string[];
    }
  ): TherapyModelResult | null {
    if (!caseId || typeof caseId !== 'string') return null;
    const c = storageService.getCaseById(caseId.trim());
    if (!c) return null;

    // Defensive clamping & NaN safety
    const rawScore = typeof distressScore === 'number' ? distressScore : parseFloat(String(distressScore));
    const safeScore = isNaN(rawScore) ? 50 : Math.max(0, Math.min(100, Math.round(rawScore)));

    const validTiers = ['CRITICAL', 'ELEVATED', 'MODERATE', 'LOW'] as const;
    const computedTier =
      riskTier && validTiers.includes(riskTier)
        ? riskTier
        : safeScore >= 75
        ? 'CRITICAL'
        : safeScore >= 50
        ? 'ELEVATED'
        : safeScore >= 25
        ? 'MODERATE'
        : 'LOW';

    // Sanitize metadata fields to prevent oversized payloads or memory exhaustion
    const safeSourceProject = metadata?.sourceProject?.trim().slice(0, 80) || 'LOCAL_PC_CHATBOT_JOURNAL';
    const safeSnippet = metadata?.journalSnippet?.trim().slice(0, 500) || '';
    const safeIndicators = (metadata?.detectedIndicators || [
      'Local PC Chatbot & Journaling Sentiment Ingestion',
      safeSnippet ? 'Diary Somatic Reflection' : 'Conversational Chatbot Distress Metric',
    ]).map((s) => String(s).trim().slice(0, 100));

    const safePhrases = (metadata?.extractedPhrases || (safeSnippet ? [safeSnippet.slice(0, 120)] : [])).map((s) =>
      String(s).trim().slice(0, 120)
    );

    const safeInterventions = (
      metadata?.recommendedInterventions || [
        computedTier === 'CRITICAL'
          ? 'Immediate Welfare Officer follow-up & Section 15A Witness Protection Verification'
          : 'Continue scheduled bi-weekly check-in cadence',
      ]
    ).map((s) => String(s).trim().slice(0, 160));

    const result: TherapyModelResult = {
      distressScore: safeScore,
      riskTier: computedTier,
      confidence: 0.95,
      detectedIndicators: safeIndicators,
      extractedPhrases: safePhrases,
      recommendedInterventions: safeInterventions,
      analyzedAt: new Date().toISOString(),
      modelSource: safeSourceProject,
    };

    storageService.updateCaseRecord(c.id, { therapyModelResult: result });
    this.notify();
    return result;
  }

  /**
   * Scores an individual case using its check-in voice note transcripts and SMS thread
   */
  public async scoreCase(caseId: string): Promise<TherapyModelResult | null> {
    const c = storageService.getCaseById(caseId);
    if (!c) return null;

    const checkIns = storageService.getCheckInsForCase(caseId);
    const smsMessages = smsService.getMessagesForCase(caseId);

    // Aggregate text corpus for this beneficiary
    const corpusParts: string[] = [];
    if (c.caseworkerNotes) corpusParts.push(c.caseworkerNotes);
    
    checkIns.forEach((chk) => {
      if (chk.voiceNoteTranscript) corpusParts.push(chk.voiceNoteTranscript);
    });

    smsMessages.forEach((sms) => {
      if (sms.direction === 'INBOUND') corpusParts.push(sms.text);
    });

    const fullCorpus = corpusParts.join(' | ') || (c.unresolvedNeeds.length > 0 ? c.unresolvedNeeds.join(' ') : 'Doing fine');
    const latestCheckIn = checkIns[0];

    const result = await this.analyzeText(fullCorpus, {
      caseId,
      selfReportedStatus: latestCheckIn?.status || (c.currentUrgency === 'critical' ? 'critical_crisis' : undefined),
      needs: c.unresolvedNeeds,
    });

    // Update case record with model evaluation
    storageService.updateCaseRecord(caseId, { therapyModelResult: result });
    return result;
  }

  /**
   * Batch scores all cases in the database
   */
  public async scoreAllCases(): Promise<void> {
    const cases = storageService.getCases();
    for (const c of cases) {
      await this.scoreCase(c.id);
    }
  }
}

export const therapyModelService = new TherapyModelService();
