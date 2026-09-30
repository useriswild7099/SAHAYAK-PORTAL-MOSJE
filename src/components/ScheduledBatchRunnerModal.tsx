import React, { useState } from 'react';
import { X, Play, CheckCircle2, Phone, MessageSquare, RefreshCw } from 'lucide-react';
import { schedulerService, BatchRunResult } from '../services/schedulerService';

interface ScheduledBatchRunnerModalProps {
  onClose: () => void;
  onRunCompleted: () => void;
}

export const ScheduledBatchRunnerModal: React.FC<ScheduledBatchRunnerModalProps> = ({
  onClose,
  onRunCompleted,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<BatchRunResult | null>(null);

  const dueCases = schedulerService.getDueCases();

  const handleExecuteBatch = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = schedulerService.runScheduledBatch();
      setRunResult(res);
      setIsRunning(false);
      onRunCompleted();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden text-slate-800 text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Automated Scheduled Outreach Dispatcher</h2>
              <p className="text-[11px] text-slate-500">Dispatch scheduled follow-up batch across eligible cases</p>
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

        <div className="p-5 space-y-4">
          <p className="text-slate-600 leading-relaxed">
            The MoSJE automated outreach engine contacts registered survivors according to their individual check-in schedules
            (e.g., weekly or bi-weekly). It dispatches multilingual IVR voice calls or SMS texts directly to their 2G/4G feature phones.
          </p>

          {!runResult ? (
            <div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">
                  Beneficiaries Scheduled For Today / Overdue:
                </span>
                <span className="font-mono text-slate-900 font-bold tabular-nums">
                  {dueCases.length} Cases Due
                </span>
              </div>

              <div className="mt-3 max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {dueCases.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded border border-slate-200">
                    No scheduled check-ins are due at this moment.
                  </div>
                ) : (
                  dueCases.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {c.victimPseudonym} ({c.district})
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {c.firNumber} · Due: {c.nextScheduledContact}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-300 text-[10px] uppercase font-mono">
                          {c.preferredLanguage}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-300 text-[10px] flex items-center gap-1">
                          {c.preferredChannel === 'FEATURE_PHONE_SMS' ? (
                            <MessageSquare className="w-3 h-3 text-slate-600" />
                          ) : (
                            <Phone className="w-3 h-3 text-slate-600" />
                          )}
                          <span>{c.preferredChannel || 'IVR_VOICE'}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200 mt-4">
                <button
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded text-slate-600 hover:text-slate-900 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleExecuteBatch}
                  disabled={isRunning || dueCases.length === 0}
                  className="px-4 py-1.5 rounded bg-[#0B2545] hover:bg-[#12335C] disabled:opacity-50 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isRunning ? 'Dispatching...' : 'Dispatch Batch'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-4">
              <div className="p-3.5 rounded bg-slate-50 border border-slate-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Batch Outreach Completed</div>
                  <div className="text-slate-600 mt-0.5">
                    {runResult.smsDispatched} SMS texts delivered · {runResult.ivrQueued} IVR voice calls queued · {runResult.skippedPaused} paused cases respected.
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {runResult.details.map((d, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <span className="text-slate-900 font-semibold">{d.victimPseudonym}</span>
                    <span className="text-slate-500 font-mono">[{d.channel} / {d.language.toUpperCase()}]</span>
                    <span
                      className={`font-semibold ${
                        d.status === 'dispatched_sms'
                          ? 'text-emerald-800'
                          : d.status === 'ready_ivr'
                          ? 'text-blue-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {d.status === 'dispatched_sms' ? 'SMS Delivered' : d.status === 'ready_ivr' ? 'IVR Queued' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded bg-[#0B2545] hover:bg-[#12335C] text-white font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
