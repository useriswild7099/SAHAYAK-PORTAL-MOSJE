import {
  CheckInRecord,
  IVRSessionState,
  IVRStep,
  LanguageCode,
  SelfReportedStatus,
  SUPPORTED_LANGUAGES,
  SupportNeedType,
} from '../types/ivr';
import { dtmfAudioService } from './dtmfAudioService';
import { IVR_SCRIPTS } from './ivrScriptData';

type Listener = (state: IVRSessionState) => void;

class IVREngineService {
  private state: IVRSessionState = this.getInitialState('hi');
  private listeners: Set<Listener> = new Set();
  private timerInterval: number | null = null;
  private currentCaseId: string | null = null;
  private onCallCompletedCallback: ((record: CheckInRecord) => void) | null = null;
  private isSyntheticVoiceAvailable: boolean = typeof window !== 'undefined' && 'speechSynthesis' in window;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private safetyTimer: number | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initVoices();
  }

  private initVoices(): void {
    if (!this.isSyntheticVoiceAvailable) return;
    try {
      const update = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.cachedVoices = voices;
          this.updateDetectedVoiceStats();
        }
      };
      update();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = update;
      }
    } catch {
      // Ignore
    }
  }

  private updateDetectedVoiceStats(): void {
    const indicCodes = ['hi', 'bn', 'ta', 'te', 'mr', 'kn', 'gu', 'or'];
    const count = this.cachedVoices.filter((v) =>
      indicCodes.some((code) => v.lang.toLowerCase().startsWith(code) || v.name.toLowerCase().includes(code))
    ).length;
    this.state.detectedIndicVoicesCount = count;
  }

  private getInitialState(lang: LanguageCode = 'hi'): IVRSessionState {
    return {
      step: 'IDLE',
      language: lang,
      elapsedSeconds: 0,
      isMuted: false,
      isSpeakerOn: true,
      keypadInputBuffer: '',
      currentPromptText: '',
      currentPromptAudioPlaying: false,
      activeVoiceName: undefined,
      speechEngineMode: undefined,
      detectedIndicVoicesCount: 0,
      answers: {
        selectedNeeds: [],
      },
      callLog: [],
    };
  }

  public getState(): IVRSessionState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public setOnCallCompleted(callback: (record: CheckInRecord) => void): void {
    this.onCallCompletedCallback = callback;
  }

  public setLanguage(lang: LanguageCode): void {
    this.state.language = lang;
    this.notify();
    if (this.state.step !== 'IDLE' && this.state.step !== 'ENDED') {
      this.playCurrentStepPrompt();
    }
  }

  public toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    if (this.state.isMuted) {
      this.stopSpeech();
    } else {
      this.playCurrentStepPrompt();
    }
    this.notify();
  }

  public toggleSpeaker(): void {
    this.state.isSpeakerOn = !this.state.isSpeakerOn;
    this.notify();
  }

  /**
   * Start an IVR call to a beneficiary case in the chosen language
   */
  public initiateCall(caseId: string, preferredLanguage: LanguageCode = 'hi'): void {
    this.endCall(false); // Clean any previous call
    this.currentCaseId = caseId;
    this.state = this.getInitialState(preferredLanguage);
    this.state.step = 'DIALING';
    this.notify();

    // Start timer for duration
    this.timerInterval = window.setInterval(() => {
      if (this.state.step !== 'IDLE' && this.state.step !== 'ENDED') {
        this.state.elapsedSeconds += 1;
        this.notify();
      }
    }, 1000);

    // After 1 second of dialing, switch to ringing
    setTimeout(() => {
      if (this.state.step === 'DIALING') {
        this.state.step = 'RINGING';
        if (this.state.isSpeakerOn) {
          dtmfAudioService.startRingingTone();
        }
        this.notify();

        // Simulate pickup after 2.5 seconds
        setTimeout(() => {
          if (this.state.step === 'RINGING') {
            dtmfAudioService.stopRingingTone();
            this.transitionToStep('WELCOME');
          }
        }, 2500);
      }
    }, 1000);
  }

  /**
   * Transition to a specific IVR step and execute speech/prompt
   */
  public transitionToStep(step: IVRStep): void {
    dtmfAudioService.stopRingingTone();
    this.state.step = step;
    this.state.keypadInputBuffer = '';

    const script = IVR_SCRIPTS[step];
    if (script) {
      const text = script.promptText[this.state.language] || script.promptText['hi'] || script.promptText['en'];
      const romanized = script.romanizedPromptText?.[this.state.language];
      this.state.currentPromptText = text;
      this.state.callLog.push({
        sender: 'SYSTEM',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
      this.notify();

      this.speakText(
        text,
        () => {
          // Step specific auto-advancements
          if (this.state.step === 'WELCOME') {
            setTimeout(() => {
              if (this.state.step === 'WELCOME') {
                this.transitionToStep('CONSENT_CHECK');
              }
            }, 400);
          } else if (this.state.step === 'CONFIRMATION') {
            setTimeout(() => {
              if (this.state.step === 'CONFIRMATION') {
                this.finishCall('completed');
              }
            }, 1200);
          }
        },
        romanized
      );
    } else {
      this.notify();
    }
  }

  /**
   * Handle user keypad (DTMF) button press
   */
  public pressKey(key: string): void {
    if (this.state.step === 'IDLE' || this.state.step === 'ENDED') {
      dtmfAudioService.playKeyTone(key);
      return;
    }

    // Play real DTMF dual-frequency tone
    dtmfAudioService.playKeyTone(key);

    this.state.keypadInputBuffer += key;
    this.state.callLog.push({
      sender: 'USER',
      text: `Keypad: [ ${key} ]`,
      key,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
    this.notify();

    // Interrupt current prompt when key is pressed (Telephony Barge-In capability)
    this.stopSpeech();

    // If pressed during WELCOME, instantly skip to CONSENT_CHECK
    if (this.state.step === 'WELCOME') {
      this.transitionToStep('CONSENT_CHECK');
      return;
    }

    // Handle key according to current step
    switch (this.state.step) {
      case 'CONSENT_CHECK':
        if (key === '1') {
          this.state.answers.consentConfirmed = true;
          this.transitionToStep('STATUS_ASSESSMENT');
        } else if (key === '2') {
          this.state.answers.rescheduleRequested = true;
          const rescheduleScript = IVR_SCRIPTS.RESCHEDULED;
          const rescheduleText =
            rescheduleScript?.promptText[this.state.language] ||
            'आपकी अनुरोध पर यह चेक-इन कल के लिए पुनर्निर्धारित कर दिया गया है। धन्यवाद।';
          const rescheduleRomanized = rescheduleScript?.romanizedPromptText?.[this.state.language];
          this.state.currentPromptText = rescheduleText;
          this.state.callLog.push({
            sender: 'SYSTEM',
            text: rescheduleText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          });
          this.notify();
          this.speakText(
            rescheduleText,
            () => {
              this.finishCall('rescheduled');
            },
            rescheduleRomanized
          );
        } else if (key === '9') {
          this.state.answers.consentConfirmed = false;
          const optOutScript = IVR_SCRIPTS.OPTED_OUT;
          const optOutText =
            optOutScript?.promptText[this.state.language] ||
            'आपकी इच्छा का सम्मान करते हुए स्वचालित कॉल रोक दिए गए हैं।';
          const optOutRomanized = optOutScript?.romanizedPromptText?.[this.state.language];
          this.state.currentPromptText = optOutText;
          this.state.callLog.push({
            sender: 'SYSTEM',
            text: optOutText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          });
          this.notify();
          this.speakText(
            optOutText,
            () => {
              this.finishCall('opted_out');
            },
            optOutRomanized
          );
        }
        break;

      case 'STATUS_ASSESSMENT':
        if (key === '1') {
          this.state.answers.selfReportedStatus = 'coping_well';
          this.transitionToStep('NEEDS_SELECTION');
        } else if (key === '2') {
          this.state.answers.selfReportedStatus = 'moderate_distress';
          this.transitionToStep('NEEDS_SELECTION');
        } else if (key === '3') {
          this.state.answers.selfReportedStatus = 'critical_crisis';
          this.transitionToStep('NEEDS_SELECTION');
        }
        break;

      case 'NEEDS_SELECTION': {
        const needsMap: Record<string, SupportNeedType> = {
          '1': 'legal_aid_escort',
          '2': 'trauma_counselling',
          '3': 'police_witness_security',
          '4': 'compensation_disbursement',
          '5': 'none_required',
        };
        const selected = needsMap[key];
        if (selected) {
          if (!this.state.answers.selectedNeeds) {
            this.state.answers.selectedNeeds = [];
          }
          if (!this.state.answers.selectedNeeds.includes(selected)) {
            this.state.answers.selectedNeeds.push(selected);
          }
          // Move to voice message / details step
          this.transitionToStep('VOICE_MESSAGE');
          // Sound beep for voice recording
          setTimeout(() => {
            dtmfAudioService.playPromptBeep();
          }, 600);
        }
        break;
      }

      case 'VOICE_MESSAGE':
        // Pressing # or any key completes voice message
        this.transitionToStep('CONFIRMATION');
        break;

      case 'CONFIRMATION':
        // Pressing any key finishes call
        this.finishCall('completed');
        break;

      default:
        break;
    }
  }

  /**
   * Submit a typed or speech-recognized voice note
   */
  public submitVoiceNote(text: string): void {
    this.state.answers.voiceNote = text;
    this.state.callLog.push({
      sender: 'USER',
      text: `Spoken note: "${text}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
    this.notify();
    this.transitionToStep('CONFIRMATION');
  }

  public recordVoiceNote(text: string): void {
    this.submitVoiceNote(text);
  }

  /**
   * Complete the call and produce CheckInRecord
   */
  public finishCall(outcome: 'completed' | 'rescheduled' | 'opted_out'): void {
    dtmfAudioService.stopRingingTone();
    dtmfAudioService.playCallEndTone();
    this.stopSpeech();

    const record: CheckInRecord = {
      id: 'chk_' + Math.random().toString(36).substring(2, 9),
      caseId: this.currentCaseId || 'CASE_DEFAULT',
      timestamp: new Date().toISOString(),
      language: this.state.language,
      callDurationSeconds: this.state.elapsedSeconds,
      consentGiven: outcome !== 'opted_out' && this.state.answers.consentConfirmed !== false,
      status: this.state.answers.selfReportedStatus || null,
      needs: this.state.answers.selectedNeeds || [],
      voiceNoteTranscript: this.state.answers.voiceNote,
      channel: 'IVR_VOICE',
      outcome,
      caseworkerAcknowledged: false,
    };

    if (this.onCallCompletedCallback) {
      this.onCallCompletedCallback(record);
    }

    this.state.step = 'ENDED';
    this.state.currentPromptAudioPlaying = false;
    this.notify();

    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Force disconnect call
   */
  public endCall(triggerSound: boolean = true): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.stopSpeech();
    dtmfAudioService.stopRingingTone();
    if (triggerSound) {
      dtmfAudioService.playCallEndTone();
    }
    this.state.step = 'ENDED';
    this.state.currentPromptAudioPlaying = false;
    this.notify();
  }

  /**
   * Replay current step prompt in current language
   */
  public playCurrentStepPrompt(): void {
    const script = IVR_SCRIPTS[this.state.step];
    if (script) {
      const text = script.promptText[this.state.language] || script.promptText['hi'] || script.promptText['en'];
      const romanized = script.romanizedPromptText?.[this.state.language];
      this.state.currentPromptText = text;
      this.notify();
      this.speakText(
        text,
        () => {
          if (this.state.step === 'WELCOME') {
            setTimeout(() => {
              if (this.state.step === 'WELCOME') {
                this.transitionToStep('CONSENT_CHECK');
              }
            }, 400);
          } else if (this.state.step === 'CONFIRMATION') {
            setTimeout(() => {
              if (this.state.step === 'CONFIRMATION') {
                this.finishCall('completed');
              }
            }, 1200);
          }
        },
        romanized
      );
    }
  }

  public replayPrompt(): void {
    this.playCurrentStepPrompt();
  }

  private stopSpeech(): void {
    if (this.safetyTimer !== null) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
    if (this.isSyntheticVoiceAvailable) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.activeUtterance = null;
    this.state.currentPromptAudioPlaying = false;
  }

  /**
   * Resolve best synthesizer voice and text for native vs phonetic delivery
   */
  private resolveVoiceAndText(
    lang: LanguageCode,
    nativeText: string,
    romanizedText?: string
  ): {
    voice: SpeechSynthesisVoice | null;
    textToSpeak: string;
    langCode: string;
    mode: 'NATIVE_VOICE' | 'INDIAN_PHONETIC' | 'PHONETIC_FALLBACK';
    voiceName: string;
  } {
    if (this.cachedVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      this.updateDetectedVoiceStats();
    }

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    const targetLocale = langInfo ? langInfo.speechLocale : 'hi-IN';

    // 1. Look for native voice matching language code or name
    const exactVoice = this.cachedVoices.find((v) => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      const targetPrefix = lang.toLowerCase();
      return (
        vLang.startsWith(targetPrefix) ||
        vLang.includes(targetLocale.toLowerCase()) ||
        (langInfo && (vName.includes(langInfo.label.toLowerCase()) || vName.includes(langInfo.nativeLabel.toLowerCase())))
      );
    });

    if (exactVoice) {
      return {
        voice: exactVoice,
        textToSpeak: nativeText,
        langCode: exactVoice.lang || targetLocale,
        mode: 'NATIVE_VOICE',
        voiceName: `${exactVoice.name} (${exactVoice.lang})`,
      };
    }

    // 2. If user language is English, use any English voice
    if (lang === 'en') {
      const enVoice =
        this.cachedVoices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
        this.cachedVoices[0] ||
        null;
      return {
        voice: enVoice,
        textToSpeak: nativeText,
        langCode: enVoice?.lang || 'en-IN',
        mode: 'NATIVE_VOICE',
        voiceName: enVoice ? `${enVoice.name} (${enVoice.lang})` : 'System Default',
      };
    }

    // 3. For Indic languages without a native voice pack on user's machine:
    // Check for Indian English voice (e.g. en-IN, Google English India, Heera, Veena, Rishi)
    // and deliver phonetic transliteration so spoken Hindi/Indic is clearly articulated!
    const indianVoice = this.cachedVoices.find((v) => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      return (
        vLang.includes('-in') ||
        vName.includes('india') ||
        vName.includes('heera') ||
        vName.includes('veena') ||
        vName.includes('ravi') ||
        vName.includes('rishi') ||
        vName.includes('neerja') ||
        vName.includes('prabhat')
      );
    });

    if (indianVoice) {
      return {
        voice: indianVoice,
        textToSpeak: romanizedText || nativeText,
        langCode: indianVoice.lang || 'en-IN',
        mode: 'INDIAN_PHONETIC',
        voiceName: `${indianVoice.name} (Indian Accent)`,
      };
    }

    // 4. Default fallback voice with phonetic transliteration
    const fallbackVoice =
      this.cachedVoices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
      this.cachedVoices[0] ||
      null;

    return {
      voice: fallbackVoice,
      textToSpeak: romanizedText || nativeText,
      langCode: fallbackVoice?.lang || 'en-US',
      mode: 'PHONETIC_FALLBACK',
      voiceName: fallbackVoice ? `${fallbackVoice.name} (Phonetic Transliteration)` : 'Phonetic Synthesizer',
    };
  }

  /**
   * Synthesize multilingual speech safely across all operating systems & browsers
   */
  private speakText(text: string, onEnd?: () => void, romanizedText?: string): void {
    this.stopSpeech();

    let callbackInvoked = false;
    const safeEnd = () => {
      if (!callbackInvoked) {
        callbackInvoked = true;
        if (this.safetyTimer !== null) {
          clearTimeout(this.safetyTimer);
          this.safetyTimer = null;
        }
        this.activeUtterance = null;
        this.state.currentPromptAudioPlaying = false;
        this.notify();
        if (onEnd) onEnd();
      }
    };

    // If muted or speaker is off or speech synthesis not supported, simulate duration
    if (this.state.isMuted || !this.state.isSpeakerOn || !this.isSyntheticVoiceAvailable) {
      const simulatedDuration = Math.max(1000, Math.min(3500, text.length * 30));
      this.safetyTimer = window.setTimeout(safeEnd, simulatedDuration);
      return;
    }

    try {
      const resolution = this.resolveVoiceAndText(this.state.language, text, romanizedText);
      this.state.activeVoiceName = resolution.voiceName;
      this.state.speechEngineMode = resolution.mode;

      const utterance = new SpeechSynthesisUtterance(resolution.textToSpeak);
      this.activeUtterance = utterance; // Prevent garbage collection bug in Chrome
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = resolution.langCode;
      if (resolution.voice) {
        utterance.voice = resolution.voice;
      }

      utterance.onstart = () => {
        this.state.currentPromptAudioPlaying = true;
        this.notify();
      };

      utterance.onend = () => {
        safeEnd();
      };

      utterance.onerror = (e) => {
        console.warn('IVR Speech Synthesis event:', e);
        safeEnd();
      };

      // Generous watchdog timeout to prevent speech hanging if browser stalls
      const wordsCount = resolution.textToSpeak.split(' ').length;
      const maxExpectedDuration = Math.max(wordsCount * 550, 4500);
      this.safetyTimer = window.setTimeout(safeEnd, maxExpectedDuration);

      // Play soft prompt tone on feature phone speaker
      dtmfAudioService.playPromptBeep();

      // Resume speech synthesis if paused (common Chromium behavior)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      safeEnd();
    }
  }
}

export const ivrEngine = new IVREngineService();
