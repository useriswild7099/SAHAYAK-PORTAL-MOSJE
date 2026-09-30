import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Globe,
  Radio,
  FileAudio,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { ivrEngine } from '../services/ivrEngine';
import { IVRSessionState, LanguageCode, SUPPORTED_LANGUAGES, AtrocityCase, SMSMessage } from '../types/ivr';
import { IVR_SCRIPTS } from '../services/ivrScriptData';
import { smsService } from '../services/smsService';
import { useLanguage } from '../context/LanguageContext';
import { LiquidGlassContainer } from './liquid-glass/LiquidGlassContainer';

interface IVRPhoneSimulatorProps {
  cases: AtrocityCase[];
  selectedCaseId?: string;
  onCaseChange?: (caseId: string) => void;
}

export const IVRPhoneSimulator: React.FC<IVRPhoneSimulatorProps> = ({
  cases,
  selectedCaseId,
  onCaseChange,
}) => {
  const { language: globalLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();
  const [session, setSession] = useState<IVRSessionState>(ivrEngine.getState());
  const [customVoiceNote, setCustomVoiceNote] = useState('');
  const [activeCaseId, setActiveCaseId] = useState<string>(selectedCaseId || (cases[0]?.id ?? ''));
  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(globalLanguage);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [phoneMode, setPhoneMode] = useState<'VOICE_IVR' | 'SMS_TEXT' | 'USSD_CALLBACK'>('VOICE_IVR');

  // SMS simulation state
  const [smsInput, setSmsInput] = useState('');
  const [smsThread, setSmsThread] = useState<SMSMessage[]>([]);
  const [ussdDialInput, setUssdDialInput] = useState('*142#');
  const [ussdAlert, setUssdAlert] = useState<string | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const smsScrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to IVR state updates
  useEffect(() => {
    const unsubscribe = ivrEngine.subscribe((newState) => {
      setSession(newState);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to SMS service updates
  useEffect(() => {
    const updateThread = () => {
      if (activeCaseId) {
        setSmsThread(smsService.getMessagesForCase(activeCaseId));
      }
    };
    updateThread();
    const unsubscribe = smsService.subscribe(updateThread);
    return () => unsubscribe();
  }, [activeCaseId]);

  // Update selected case if prop changes
  useEffect(() => {
    if (selectedCaseId) {
      setActiveCaseId(selectedCaseId);
    }
  }, [selectedCaseId]);

  // Sync with globalLanguage from Navbar
  useEffect(() => {
    setSelectedLanguage(globalLanguage);
    ivrEngine.setLanguage(globalLanguage);
  }, [globalLanguage]);

  // Sync selected language with case when case changes
  useEffect(() => {
    if (currentCase?.preferredLanguage && session.step === 'IDLE') {
      const lang = currentCase.preferredLanguage as LanguageCode;
      setSelectedLanguage(lang);
      setGlobalLanguage(lang);
      ivrEngine.setLanguage(lang);
    }
  }, [activeCaseId]);

  // Scroll log to bottom on updates
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [session.callLog]);

  // Scroll SMS thread to bottom on updates
  useEffect(() => {
    if (smsScrollRef.current) {
      smsScrollRef.current.scrollTop = smsScrollRef.current.scrollHeight;
    }
  }, [smsThread, phoneMode]);

  const handleStartCall = () => {
    if (currentCase) {
      setPhoneMode('VOICE_IVR');
      ivrEngine.initiateCall(currentCase.id, selectedLanguage);
    }
  };

  const handleEndCall = () => {
    ivrEngine.endCall(true);
  };

  const handleKeyPress = (key: string) => {
    if (phoneMode === 'VOICE_IVR') {
      if (session.step === 'IDLE' && key === '1') {
        handleStartCall();
      } else {
        ivrEngine.pressKey(key);
      }
    } else if (phoneMode === 'USSD_CALLBACK') {
      setUssdDialInput((prev) => prev + key);
    } else if (phoneMode === 'SMS_TEXT') {
      setSmsInput((prev) => prev + key);
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setGlobalLanguage(lang);
    ivrEngine.setLanguage(lang);
  };

  const handleToggleSpeaker = () => {
    ivrEngine.toggleSpeaker();
  };

  const handleToggleMute = () => {
    ivrEngine.toggleMute();
  };

  const handleSubmitVoiceNote = () => {
    if (customVoiceNote.trim()) {
      ivrEngine.recordVoiceNote(customVoiceNote.trim());
      setCustomVoiceNote('');
    }
  };

  const handleSendSMS = (textToSend?: string) => {
    const message = textToSend || smsInput;
    if (!message.trim() || !currentCase) return;

    smsService.receiveInboundSMS(currentCase.id, message, selectedLanguage);
    if (!textToSend) setSmsInput('');
  };

  const handleSendOutboundScheduledSMS = () => {
    if (!currentCase) return;
    smsService.sendScheduledOutboundSMS(currentCase.id, selectedLanguage);
  };

  const handleTriggerUssdCallback = () => {
    setUssdAlert('Request registered. National Atrocity Relief Gateway (14566) initiating callback.');
    setTimeout(() => {
      setUssdAlert(null);
      handleStartCall();
    }, 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScript = IVR_SCRIPTS[session.step];
  const isCallActive = session.step !== 'IDLE' && session.step !== 'ENDED';

  // Browser speech recognition for voice notes
  const startMicListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === session.language);
      recognition.lang = langConfig ? langConfig.speechLocale : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecordingMic(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCustomVoiceNote(transcript);
        setIsRecordingMic(false);
      };
      recognition.onerror = () => setIsRecordingMic(false);
      recognition.onend = () => setIsRecordingMic(false);

      recognition.start();
    } catch {
      setIsRecordingMic(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Government Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" aria-label="Breadcrumb">
        <span className="text-slate-700">MoSJE Central</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">Telephony Gateway</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold">2G/4G Multilingual IVR &amp; SMS Dispatch Console</span>
      </nav>

      {/* Top Telephony Context Header */}
      <LiquidGlassContainer borderRadius={12} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase tracking-wider text-slate-800">Telephony Hardware Terminal</span>
              <span aria-hidden="true">·</span>
              <span>2G/4G Feature Phone Gateway</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Field Telephony &amp; DTMF Diagnostic Simulator
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              Provides survivors on basic ₹800 feature phones with guaranteed statutory outreach over automated
              multilingual voice IVR and two-way SMS. Requires no smartphones, internet connectivity, or apps.
            </p>
          </div>

          {/* Beneficiary Selector */}
          <div className="flex items-center gap-2 bg-slate-50/90 p-2 rounded border border-slate-300 self-start md:self-auto shrink-0">
            <span className="text-xs text-slate-600 font-medium">Target Case:</span>
            <select
              value={activeCaseId}
              onChange={(e) => {
                setActiveCaseId(e.target.value);
                if (onCaseChange) onCaseChange(e.target.value);
              }}
              disabled={isCallActive}
              className="bg-white text-slate-900 text-xs rounded border border-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-slate-500 font-semibold"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.victimPseudonym} ({c.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </LiquidGlassContainer>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Industrial Field Handset Terminal */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-700 relative">
            {/* Top Ear Speaker Slit */}
            <div className="w-12 h-1 bg-slate-950 rounded-full mx-auto mb-3" />

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 mb-3 bg-slate-950 p-1 rounded-md text-[11px]">
              <button
                onClick={() => setPhoneMode('VOICE_IVR')}
                className={`py-1 rounded font-semibold transition-colors ${
                  phoneMode === 'VOICE_IVR'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Voice IVR
              </button>
              <button
                onClick={() => setPhoneMode('SMS_TEXT')}
                className={`py-1 rounded font-semibold transition-colors ${
                  phoneMode === 'SMS_TEXT'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SMS ({smsThread.length})
              </button>
              <button
                onClick={() => setPhoneMode('USSD_CALLBACK')}
                className={`py-1 rounded font-semibold transition-colors ${
                  phoneMode === 'USSD_CALLBACK'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USSD
              </button>
            </div>

            {/* High-Readability Digital LCD Display */}
            <div className="bg-slate-950 text-slate-100 font-mono rounded-lg p-3 border border-slate-800 min-h-[200px] max-h-[200px] flex flex-col justify-between overflow-hidden">
              {/* Telephony Status Strip */}
              <div className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-800 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">●</span>
                  <span>MoSJE-TEL</span>
                  <span className="text-[9px] bg-slate-800 px-1 rounded">2G/4G</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-sans font-semibold">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === (session.language || selectedLanguage))?.code.toUpperCase()}
                  </span>
                  <span className="tabular-nums">
                    {phoneMode === 'VOICE_IVR' ? formatDuration(session.elapsedSeconds) : '10:45'}
                  </span>
                  <span>92%</span>
                </div>
              </div>

              {/* Mode 1: VOICE IVR DISPLAY */}
              {phoneMode === 'VOICE_IVR' && (
                <div className="py-2 text-center my-auto overflow-y-auto">
                  {session.step === 'IDLE' ? (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-200 font-sans">MoSJE Sahayak</div>
                      <div className="text-[11px] text-slate-400">Section 15A Voice Check-In</div>
                      <div className="text-[10px] text-amber-300 font-sans mt-1">
                        Language:{' '}
                        {SUPPORTED_LANGUAGES.find((l) => l.code === (session.language || selectedLanguage))?.nativeLabel}
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1">Press CALL to connect</div>
                    </div>
                  ) : session.step === 'DIALING' ? (
                    <div className="space-y-1">
                      <div className="text-[10px] text-amber-300 uppercase font-sans">Connecting Gateway...</div>
                      <div className="text-xs font-bold text-white font-mono">1800-11-2026</div>
                      <div className="text-[10px] text-slate-400">District Welfare Cell</div>
                    </div>
                  ) : session.step === 'RINGING' ? (
                    <div className="space-y-1">
                      <div className="text-[10px] text-emerald-400 uppercase font-sans">Ringing Beneficiary...</div>
                      <div className="text-xs font-bold text-white font-sans">
                        {currentCase?.victimPseudonym}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{currentCase?.contactNumber}</div>
                    </div>
                  ) : session.step === 'ENDED' ? (
                    <div className="space-y-1">
                      <div className="text-xs text-red-400 font-bold font-sans">Call Disconnected</div>
                      <div className="text-[10px] text-slate-400">
                        Duration: {formatDuration(session.elapsedSeconds)}
                      </div>
                      <div className="text-[10px] text-emerald-400 pt-1">Logged to Caseworker Dossier</div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-amber-300 font-semibold font-sans uppercase tracking-wider">
                        {session.step.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[11px] text-slate-100 font-sans line-clamp-3 leading-snug px-1 text-center">
                        {session.currentPromptText}
                      </div>
                      {session.keypadInputBuffer && (
                        <div className="text-[11px] font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded inline-block border border-slate-700">
                          Input: [{session.keypadInputBuffer.slice(-1)}]
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: SMS TEXT DISPLAY */}
              {phoneMode === 'SMS_TEXT' && (
                <div
                  ref={smsScrollRef}
                  className="py-1 my-auto overflow-y-auto space-y-1.5 text-[10px] max-h-[140px] pr-1"
                >
                  <div className="text-[9px] text-slate-400 text-center pb-1 border-b border-slate-800">
                    SMS Gateway: MoSJE-14566
                  </div>
                  {smsThread.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      No SMS history. Test inbound or outbound messages.
                    </div>
                  ) : (
                    smsThread.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-1.5 rounded font-sans text-[11px] ${
                          msg.direction === 'INBOUND'
                            ? 'bg-slate-800 text-white text-right ml-4'
                            : 'bg-slate-900 text-slate-200 text-left mr-4 border border-slate-800'
                        }`}
                      >
                        <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                          <span>{msg.direction === 'INBOUND' ? 'Beneficiary' : 'MoSJE'}</span>
                          <span className="tabular-nums">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-0.5 leading-snug">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Mode 3: USSD DISPLAY */}
              {phoneMode === 'USSD_CALLBACK' && (
                <div className="py-2 text-center my-auto space-y-2">
                  <div className="text-xs font-bold text-white font-sans">Toll-Free USSD Service</div>
                  <div className="text-[10px] text-slate-400">Dial *142# for priority officer callback</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-sm font-bold text-amber-300">
                    {ussdDialInput}
                  </div>
                  {ussdAlert && (
                    <div className="text-[10px] text-emerald-400 leading-tight">
                      {ussdAlert}
                    </div>
                  )}
                </div>
              )}

              {/* Display Bottom Row */}
              <div className="text-[9px] pt-1 border-t border-slate-800 flex justify-between text-slate-400">
                <span>{phoneMode === 'VOICE_IVR' ? (session.isMuted ? 'Muted' : 'Mic Active') : 'Channel Ready'}</span>
                <span>{phoneMode === 'VOICE_IVR' ? (session.isSpeakerOn ? 'Speaker On' : 'Earpiece') : 'SMS Ready'}</span>
              </div>
            </div>

            {/* Handset Model Label */}
            <div className="text-center my-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              BHARAT TEL-2G
            </div>

            {/* Action Buttons: Call & End */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={phoneMode === 'USSD_CALLBACK' ? handleTriggerUssdCallback : handleStartCall}
                disabled={phoneMode === 'VOICE_IVR' && isCallActive}
                className={`py-2 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  phoneMode === 'VOICE_IVR' && isCallActive
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{phoneMode === 'USSD_CALLBACK' ? 'Dial USSD' : 'Call'}</span>
              </button>

              <button
                onClick={handleEndCall}
                disabled={session.step === 'IDLE' && phoneMode === 'VOICE_IVR'}
                className={`py-2 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  session.step === 'IDLE' && phoneMode === 'VOICE_IVR'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-red-700 hover:bg-red-600 text-white'
                }`}
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End</span>
              </button>
            </div>

            {/* Audio Toggle Controls (when in Voice mode) */}
            {phoneMode === 'VOICE_IVR' && (
              <div className="flex items-center justify-between mb-3 px-1 text-slate-400 text-xs">
                <button
                  onClick={handleToggleSpeaker}
                  className={`p-1.5 rounded text-[11px] flex items-center gap-1 border transition-colors ${
                    session.isSpeakerOn
                      ? 'bg-slate-800 text-amber-300 border-slate-600'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {session.isSpeakerOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>Audio {session.isSpeakerOn ? 'On' : 'Off'}</span>
                </button>

                <button
                  onClick={handleToggleMute}
                  className={`p-1.5 rounded text-[11px] flex items-center gap-1 border transition-colors ${
                    session.isMuted
                      ? 'bg-red-900/60 text-red-200 border-red-700'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {session.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{session.isMuted ? 'Muted' : 'Mic'}</span>
                </button>

                <button
                  onClick={() => ivrEngine.playCurrentStepPrompt()}
                  disabled={!isCallActive}
                  className="p-1.5 rounded text-[11px] flex items-center gap-1 border bg-slate-900 text-slate-400 border-slate-700 hover:text-white disabled:opacity-40"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>
              </div>
            )}

            {/* SMS Input Row (when in SMS mode) */}
            {phoneMode === 'SMS_TEXT' && (
              <div className="mb-3 flex gap-1.5">
                <input
                  type="text"
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  placeholder="Type: 1, 2, or NEED3..."
                  className="flex-1 bg-slate-950 text-xs text-white px-2 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-slate-500 font-mono"
                />
                <button
                  onClick={() => handleSendSMS()}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold"
                >
                  Send
                </button>
              </div>
            )}

            {/* 12-Key Tactile Keypad */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {[
                { key: '1', sub: '.,' },
                { key: '2', sub: 'ABC' },
                { key: '3', sub: 'DEF' },
                { key: '4', sub: 'GHI' },
                { key: '5', sub: 'JKL' },
                { key: '6', sub: 'MNO' },
                { key: '7', sub: 'PQRS' },
                { key: '8', sub: 'TUV' },
                { key: '9', sub: 'WXYZ' },
                { key: '*', sub: 'MIC' },
                { key: '0', sub: '+' },
                { key: '#', sub: 'SEND' },
              ].map(({ key, sub }) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded py-2 flex flex-col items-center justify-center transition-colors border border-slate-700/60"
                >
                  <span className="text-sm font-bold font-mono leading-none">{key}</span>
                  <span className="text-[8px] text-slate-400 leading-none mt-0.5 uppercase font-mono">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Multilingual Inspector, SMS Testing & Live Audit Trail */}
        <div className="lg:col-span-7 space-y-6">
          {/* Telephony Control & Script Inspector */}
          <LiquidGlassContainer borderRadius={12} className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  Diagnostic Inspector
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-slate-600 font-mono">Mode: {phoneMode}</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={session.language || selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                  className="bg-white text-xs text-slate-800 border border-slate-300 rounded px-2 py-1 focus:outline-none font-semibold"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeLabel} ({lang.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Language Segmented Selector */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
                <span>Select Outreach Language (Official 9 Indian Languages):</span>
                <span className="font-mono text-slate-800 font-bold">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === (session.language || selectedLanguage))?.nativeLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isActive = (session.language || selectedLanguage) === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                        isActive
                          ? 'bg-[#0B2545] text-white border-[#0B2545] font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className={`text-[10px] ml-1 font-mono ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                        {lang.code.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inbound / Outbound SMS Testing Panel (when in SMS mode) */}
            {phoneMode === 'SMS_TEXT' ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
                    <span>Quick SMS Test Payloads:</span>
                  </h3>
                  <button
                    onClick={handleSendOutboundScheduledSMS}
                    className="text-xs text-blue-700 hover:text-blue-900 underline font-medium"
                  >
                    Simulate Scheduled MoSJE Outbound SMS
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSendSMS('1')}
                    className="p-3 rounded border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-900">Reply &apos;1&apos; — Coping Well</div>
                    <div className="text-[11px] text-slate-500">Status stable, no immediate danger</div>
                  </button>

                  <button
                    onClick={() => handleSendSMS('2')}
                    className="p-3 rounded border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-900">Reply &apos;2&apos; — Distress</div>
                    <div className="text-[11px] text-slate-500">Self-reported distress or anxiety</div>
                  </button>

                  <button
                    onClick={() => handleSendSMS('3 NEED3 Intimidation reported by accused')}
                    className="p-3 rounded border border-red-200 hover:border-red-300 bg-red-50/40 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-red-900">Reply &apos;3 NEED3&apos; — Police Escort</div>
                    <div className="text-[11px] text-red-700">Urgent witness protection needed</div>
                  </button>

                  <button
                    onClick={() => handleSendSMS('NEED4 Relief compensation delayed')}
                    className="p-3 rounded border border-amber-200 hover:border-amber-300 bg-amber-50/40 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-amber-900">Reply &apos;NEED4&apos; — Section 15A Relief</div>
                    <div className="text-[11px] text-amber-800">Delays in compensation disbursement</div>
                  </button>
                </div>
              </div>
            ) : (
              /* VOICE IVR Spoken Prompt Inspector */
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <FileAudio className="w-3.5 h-3.5 text-[#0B2545]" />
                    <span>
                      Synthesized Telephony Audio Script ·{' '}
                      {SUPPORTED_LANGUAGES.find((l) => l.code === (session.language || selectedLanguage))?.nativeLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCallActive && (
                      <button
                        onClick={() => ivrEngine.replayPrompt()}
                        disabled={session.currentPromptAudioPlaying}
                        className="text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    )}
                    {session.currentPromptAudioPlaying && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        Voice Active
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded border border-slate-200 font-sans">
                  {session.currentPromptText ||
                    (session.step === 'IDLE'
                      ? `Ready. Press "Call" on the terminal to start automated check-in in ${SUPPORTED_LANGUAGES.find((l) => l.code === (session.language || selectedLanguage))?.nativeLabel}.`
                      : 'Connecting gateway...')}
                </p>
              </div>
            )}

            {/* Valid Keypad Responses for Current Step */}
            {phoneMode === 'VOICE_IVR' && currentScript?.options && currentScript.options.length > 0 && isCallActive && (
              <div className="mt-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                  <span>Interactive Node Key Options:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentScript.options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleKeyPress(opt.key)}
                      className="p-2.5 text-left rounded bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-colors flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded bg-[#0B2545] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {opt.key}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {opt.label[session.language] || opt.label['en']}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {opt.actionDescription}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Spoken Voice Note Input */}
            {phoneMode === 'VOICE_IVR' && session.step === 'VOICE_MESSAGE' && (
              <div className="mt-4 p-3 bg-amber-50/50 rounded border border-amber-300 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-700" />
                    <span>Spoken Voice Note Recording</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Speak or enter text</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customVoiceNote}
                    onChange={(e) => setCustomVoiceNote(e.target.value)}
                    placeholder="e.g. Need police escort for Tuesday hearing..."
                    className="flex-1 bg-white text-xs text-slate-900 px-3 py-1.5 rounded border border-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={startMicListening}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium border flex items-center gap-1 ${
                      isRecordingMic
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isRecordingMic ? 'Listening' : 'Mic'}</span>
                  </button>
                  <button
                    onClick={handleSubmitVoiceNote}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-[#0B2545] text-white hover:bg-[#12335C]"
                  >
                    Send (#)
                  </button>
                </div>
              </div>
            )}
          </LiquidGlassContainer>

          {/* Real-time Telephony Audit Trail & Call Transcript */}
          <LiquidGlassContainer borderRadius={12} className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Telephony Audit Trail &amp; Call Transcript
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {session.callLog.length} events
              </span>
            </div>

            <div
              ref={logContainerRef}
              className="mt-3 bg-slate-50/80 rounded p-3 h-48 overflow-y-auto space-y-1.5 font-mono text-xs border border-slate-200"
            >
              {session.callLog.length === 0 ? (
                <div className="text-slate-400 text-center py-12 text-xs">
                  No active call session. Press Call on the handset to initiate.
                </div>
              ) : (
                session.callLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-1.5 rounded bg-white border border-slate-200"
                  >
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                      {log.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1 rounded uppercase shrink-0 ${
                        log.sender === 'USER'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {log.sender}
                    </span>
                    <span className="text-xs text-slate-800 font-sans flex-1 break-words">
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </LiquidGlassContainer>
        </div>
      </div>
    </div>
  );
};
