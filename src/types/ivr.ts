export type LanguageCode = 'hi' | 'en' | 'bn' | 'ta' | 'te' | 'mr' | 'kn' | 'gu' | 'or';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'en', label: 'English', nativeLabel: 'English', speechLocale: 'en-IN' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', speechLocale: 'kn-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', speechLocale: 'gu-IN' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', speechLocale: 'or-IN' },
];

export type IVRStep =
  | 'IDLE'
  | 'DIALING'
  | 'RINGING'
  | 'WELCOME'
  | 'CONSENT_CHECK'
  | 'STATUS_ASSESSMENT'
  | 'NEEDS_SELECTION'
  | 'VOICE_MESSAGE'
  | 'CONFIRMATION'
  | 'ENDED';

export type SelfReportedStatus = 'coping_well' | 'moderate_distress' | 'critical_crisis';

export type SupportNeedType =
  | 'legal_aid_escort'
  | 'trauma_counselling'
  | 'police_witness_security'
  | 'compensation_disbursement'
  | 'medical_assistance'
  | 'none_required';

export interface CheckInRecord {
  id: string;
  caseId: string;
  timestamp: string; // ISO format
  language: LanguageCode;
  callDurationSeconds: number;
  consentGiven: boolean;
  status: SelfReportedStatus | null;
  needs: SupportNeedType[];
  voiceNoteUrl?: string;
  voiceNoteTranscript?: string;
  channel: 'IVR_VOICE' | 'FEATURE_PHONE_SMS' | 'CASEWORKER_MANUAL';
  outcome: 'completed' | 'rescheduled' | 'opted_out' | 'no_answer' | 'abandoned';
  caseworkerAcknowledged: boolean;
  caseworkerNotes?: string;
  therapyModelResult?: TherapyModelResult;
}

export interface SMSMessage {
  id: string;
  caseId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'received';
  automatedReply?: string;
}

export interface ScheduledInteraction {
  id: string;
  caseId: string;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon' | 'evening';
  channel: 'IVR_VOICE' | 'FEATURE_PHONE_SMS' | 'CASEWORKER_VISIT' | 'SPECIAL_COURT_ESCORT';
  purpose: string;
  assignedOfficer: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TherapyModelResult {
  distressScore: number; // 0 - 100
  riskTier: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW';
  confidence: number; // 0.0 - 1.0
  detectedIndicators: string[];
  extractedPhrases: string[];
  recommendedInterventions: string[];
  analyzedAt: string;
  modelSource: 'CUSTOM_ENDPOINT' | 'BUILTIN_ADAPTER' | 'LOCAL_PC_CHATBOT_JOURNAL' | string;
}

export interface TherapyModelConfig {
  endpointUrl: string;
  apiKey: string;
  modelName: string;
  mode: 'BUILTIN_ADAPTER' | 'CUSTOM_ENDPOINT';
  autoAnalyzeIncoming: boolean;
  scoreThresholdCritical: number;
  scoreThresholdElevated: number;
}

export interface AtrocityCase {
  id: string;
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  registrationDate: string;
  incidentType: string;
  applicableActSections: string[];
  victimPseudonym: string; // Protecting victim privacy while maintaining identity
  contactNumber: string;
  preferredLanguage: LanguageCode;
  preferredChannel: 'IVR_VOICE' | 'FEATURE_PHONE_SMS' | 'EITHER';
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  checkInFrequencyDays: number; // e.g. 7 days or 14 days
  consentStatus: 'active' | 'paused' | 'opted_out';
  lastContactDate: string | null;
  nextScheduledContact: string;
  currentUrgency: 'low' | 'medium' | 'high' | 'critical';
  unresolvedNeeds: SupportNeedType[];
  assignedCaseworker: {
    name: string;
    designation: string;
    contactNumber: string;
  };
  totalCheckInsCompleted: number;
  courtStage: 'FIR_FILED' | 'INVESTIGATION_ONGOING' | 'CHARGESHEET_SUBMITTED' | 'TRIAL_HEARING' | 'SPECIAL_COURT_APPEAL';
  reliefCompensationStage: 'FIRST_INSTALLMENT_PAID' | 'CHARGE_SHEET_RELEASE_PENDING' | 'SPECIAL_COURT_TRIAL_RELEASE' | 'NOT_STARTED';
  caseworkerNotes?: string;
  scheduledInteractions?: ScheduledInteraction[];
  therapyModelResult?: TherapyModelResult;
}

export interface IVRPromptStep {
  step: IVRStep;
  title: string;
  promptText: Record<LanguageCode, string>;
  romanizedPromptText?: Partial<Record<LanguageCode, string>>;
  options?: Array<{
    key: string;
    label: Record<LanguageCode, string>;
    actionDescription: string;
  }>;
}

export interface IVRSessionState {
  step: IVRStep;
  language: LanguageCode;
  elapsedSeconds: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  keypadInputBuffer: string;
  currentPromptText: string;
  currentPromptAudioPlaying: boolean;
  activeVoiceName?: string;
  speechEngineMode?: 'NATIVE_VOICE' | 'INDIAN_PHONETIC' | 'PHONETIC_FALLBACK';
  detectedIndicVoicesCount?: number;
  answers: {
    consentConfirmed?: boolean;
    selfReportedStatus?: SelfReportedStatus;
    selectedNeeds?: SupportNeedType[];
    voiceNote?: string;
    rescheduleRequested?: boolean;
  };
  callLog: Array<{
    sender: 'SYSTEM' | 'USER';
    text: string;
    key?: string;
    timestamp: string;
  }>;
}
