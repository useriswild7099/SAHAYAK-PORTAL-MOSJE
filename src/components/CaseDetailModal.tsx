import React, { useState } from 'react';
import {
  X,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Cpu,
  Printer,
} from 'lucide-react';
import { AtrocityCase, CheckInRecord, SupportNeedType } from '../types/ivr';
import { storageService } from '../services/storageService';
import { getDistressUrgencyConfig } from './CaseworkerQueue';

interface CaseDetailModalProps {
  atrocityCase: AtrocityCase;
  checkIns: CheckInRecord[];
  onClose: () => void;
  onInitiateCall: (caseId: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  atrocityCase,
  checkIns,
  onClose,
  onInitiateCall,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'actions' | 'scheduled' | 'model_analysis'>('timeline');
  const [caseworkerNoteInput, setCaseworkerNoteInput] = useState('');
  const [selectedCheckInForNote, setSelectedCheckInForNote] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleResolveNeed = (need: SupportNeedType) => {
    storageService.resolveNeed(atrocityCase.id, need);
  };

  const handleCompleteInteraction = (interactionId: string) => {
    storageService.completeInteraction(atrocityCase.id, interactionId, 'Completed by caseworker during follow-up');
  };

  const handleAddNote = (checkInId: string) => {
    if (caseworkerNoteInput.trim()) {
      storageService.acknowledgeCheckIn(checkInId, caseworkerNoteInput.trim());
      setCaseworkerNoteInput('');
      setSelectedCheckInForNote(null);
    }
  };

  const getNeedLabel = (need: SupportNeedType) => {
    switch (need) {
      case 'police_witness_security':
        return 'Police Protection & Witness Security';
      case 'legal_aid_escort':
        return 'Legal Aid & Court Escort';
      case 'trauma_counselling':
        return 'Trauma Counselling & Therapy';
      case 'compensation_disbursement':
        return 'Section 15A Relief Compensation';
      case 'medical_assistance':
        return 'Medical Treatment & Emergency Aid';
      default:
        return need;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'coping_well':
        return <span className="text-emerald-800 font-semibold text-xs">Coping Adequately</span>;
      case 'moderate_distress':
        return <span className="text-amber-800 font-semibold text-xs">Moderate Distress</span>;
      case 'critical_crisis':
        return <span className="text-red-700 font-bold text-xs">Critical Crisis</span>;
      default:
        return <span className="text-slate-400 text-xs">Unspecified</span>;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Dossier Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                {atrocityCase.id}
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {atrocityCase.victimPseudonym}
              </h2>
              <span className="text-xs text-slate-500">
                ({atrocityCase.district}, {atrocityCase.state})
              </span>
              {atrocityCase.therapyModelResult && (
                (() => {
                  const cfg = getDistressUrgencyConfig(atrocityCase.therapyModelResult.distressScore);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border ${cfg.badgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                      <span>Distress: {atrocityCase.therapyModelResult.distressScore}/100</span>
                      <span className="text-slate-400">·</span>
                      <span className="uppercase text-[10px]">{cfg.label}</span>
                    </span>
                  );
                })()
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              FIR: {atrocityCase.firNumber} · {atrocityCase.policeStation} · Registered on {atrocityCase.registrationDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Official Section 15A Court Dossier"
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print Dossier</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onInitiateCall(atrocityCase.id);
              }}
              className="px-3 py-1.5 rounded bg-[#0B2545] hover:bg-[#12335C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Initiate Call</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Dossier"
              className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Check-In History ({checkIns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Status &amp; Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'actions'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Unresolved Needs ({atrocityCase.unresolvedNeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scheduled'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled Outreach ({atrocityCase.scheduledInteractions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('model_analysis')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'model_analysis'
                ? 'border-[#0B2545] text-[#0B2545] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Clinical Distress Model</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white text-xs">
          {/* TAB 1: Check-in History */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-200">
                <span>Interaction Timeline (chronological history)</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">{checkIns.length} Records</span>
              </div>

              {checkIns.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded border border-slate-200">
                  No check-ins recorded yet for this beneficiary.
                </div>
              ) : (
                <div className="space-y-3">
                  {checkIns.map((chk) => (
                    <div
                      key={chk.id}
                      className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-700 tabular-nums">
                            {new Date(chk.timestamp).toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-[#0B2545] uppercase font-mono">
                            {chk.channel || 'IVR_VOICE'} ({chk.language.toUpperCase()})
                          </span>
                        </div>
                        <div>{getStatusBadge(chk.status)}</div>
                      </div>

                      {/* Needs captured */}
                      {chk.needs && chk.needs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-500">Needs Flagged:</span>
                          {chk.needs.map((need: SupportNeedType, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[11px]"
                            >
                              {getNeedLabel(need)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Voice Note / SMS Transcript */}
                      {(chk.voiceNoteTranscript || chk.voiceNoteUrl) && (
                        <div className="bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                          <span className="text-slate-500 block mb-0.5 text-[11px]">
                            Recorded Audio Note / SMS Message:
                          </span>
                          <p className="font-sans italic">
                            &quot;{chk.voiceNoteTranscript || chk.voiceNoteUrl}&quot;
                          </p>
                        </div>
                      )}

                      {/* Caseworker follow-up note */}
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-slate-600">
                          {chk.caseworkerNotes ? (
                            <div>
                              <span className="font-medium text-slate-700">Officer Note: </span>
                              <span>{chk.caseworkerNotes}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No notes appended.</span>
                          )}
                        </div>

                        {selectedCheckInForNote === chk.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={caseworkerNoteInput}
                              onChange={(e) => setCaseworkerNoteInput(e.target.value)}
                              placeholder="Add follow-up note..."
                              className="bg-white text-xs text-slate-900 border border-slate-300 rounded px-2.5 py-1 focus:outline-none w-56"
                            />
                            <button
                              onClick={() => handleAddNote(chk.id)}
                              className="px-2.5 py-1 rounded bg-[#0B2545] text-white text-xs font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setSelectedCheckInForNote(null)}
                              className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCheckInForNote(chk.id);
                              setCaseworkerNoteInput(chk.caseworkerNotes || '');
                            }}
                            className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                          >
                            Edit Note
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Case Profile & Legal Status */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  Registration &amp; Statutory Offence
                </h3>
                <div className="space-y-1.5 leading-relaxed">
                  <div>
                    <span className="text-slate-500">Incident Classification:</span>{' '}
                    <strong className="text-slate-800">{atrocityCase.incidentType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">PoA Act Sections:</span>{' '}
                    <span className="font-mono text-slate-800">
                      {atrocityCase.applicableActSections.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">FIR &amp; Police Station:</span>{' '}
                    <strong className="text-slate-800">{atrocityCase.firNumber} ({atrocityCase.policeStation})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Jurisdiction:</span>{' '}
                    <strong className="text-slate-800">{atrocityCase.district}, {atrocityCase.state}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  Special Court &amp; Relief Status
                </h3>
                <div className="space-y-1.5 leading-relaxed">
                  <div>
                    <span className="text-slate-500">Court Trial Stage:</span>{' '}
                    <strong className="text-slate-900 capitalize">
                      {atrocityCase.courtStage.replace(/_/g, ' ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Sec 15A Relief Compensation:</span>{' '}
                    <strong className="text-slate-900 capitalize">
                      {atrocityCase.reliefCompensationStage.replace(/_/g, ' ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Caseworker:</span>{' '}
                    <strong className="text-slate-800">
                      {atrocityCase.assignedCaseworker.name} ({atrocityCase.assignedCaseworker.designation})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Welfare Cell Contact:</span>{' '}
                    <span className="font-mono text-slate-800 tabular-nums">{atrocityCase.assignedCaseworker.contactNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 md:col-span-2">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  Caseworker Case History &amp; Field Observations
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {atrocityCase.caseworkerNotes || 'No notes added to case dossier.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Unresolved Needs */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900">
                Pending Section 15A Support Needs
              </h3>

              {atrocityCase.unresolvedNeeds.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <span>All reported needs have been addressed by the district cell.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {atrocityCase.unresolvedNeeds.map((need, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900">{getNeedLabel(need)}</h4>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Reported directly by survivor during automated multilingual check-in.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResolveNeed(need)}
                        className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-colors self-start sm:self-auto"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Scheduled Outreach */}
          {activeTab === 'scheduled' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900">
                Scheduled Follow-up Outreach
              </h3>

              {(!atrocityCase.scheduledInteractions || atrocityCase.scheduledInteractions.length === 0) ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded border border-slate-200">
                  No upcoming outreach scheduled for this case.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {atrocityCase.scheduledInteractions.map((inter) => (
                    <div
                      key={inter.id}
                      className="bg-slate-50 border border-slate-200 rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800 font-semibold tabular-nums">
                            {inter.scheduledDate} ({inter.timeSlot})
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-[#0B2545]">{inter.channel}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600 capitalize">{inter.status}</span>
                        </div>
                        <p className="text-slate-800 font-medium mt-1">{inter.purpose}</p>
                        <p className="text-slate-500 text-[11px]">Assigned: {inter.assignedOfficer}</p>
                      </div>

                      {inter.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteInteraction(inter.id)}
                          className="px-3 py-1 rounded bg-[#0B2545] hover:bg-[#12335C] text-white font-medium text-xs"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Clinical Distress Model Analysis */}
          {activeTab === 'model_analysis' && (
            <div className="space-y-4">
              {atrocityCase.therapyModelResult ? (
                <div className="space-y-4">
                  {(() => {
                    const cfg = getDistressUrgencyConfig(atrocityCase.therapyModelResult.distressScore);
                    return (
                      <div className="p-4 rounded border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>Clinical Speech &amp; Distress Analysis</span>
                            <span className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {atrocityCase.therapyModelResult.modelSource}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs mt-0.5">
                            Scored from survivor transcripts, SMS chats, and caseworker timeline records.
                          </p>
                        </div>

                        <div className="text-right self-start sm:self-auto">
                          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                            {atrocityCase.therapyModelResult.distressScore} <span className="text-xs text-slate-500">/ 100</span>
                          </div>
                          <div className={`text-xs font-semibold uppercase ${cfg.textClass}`}>
                            {cfg.label} Urgency ({cfg.rangeLabel})
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900">
                        Extracted Distress &amp; Threat Indicators
                      </h4>
                      <div className="space-y-1 pt-1">
                        {atrocityCase.therapyModelResult.detectedIndicators.map((ind, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-white border border-slate-200 text-slate-800 text-xs"
                          >
                            • {ind}
                          </div>
                        ))}
                      </div>

                      {atrocityCase.therapyModelResult.extractedPhrases.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-slate-500 text-[11px] block mb-1">Key Audio Phrases:</span>
                          <div className="flex flex-wrap gap-1">
                            {atrocityCase.therapyModelResult.extractedPhrases.map((phrase, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono text-[11px] border border-slate-200"
                              >
                                &quot;{phrase}&quot;
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900">
                        Recommended Statutory Interventions
                      </h4>
                      <div className="space-y-1.5 pt-1">
                        {atrocityCase.therapyModelResult.recommendedInterventions.map((rec, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-white border border-slate-200 text-slate-800 text-xs flex items-start gap-2"
                          >
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded border border-slate-200">
                  No clinical assessment record available for this case.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
