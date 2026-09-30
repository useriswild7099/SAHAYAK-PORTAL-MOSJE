import { AtrocityCase, ScheduledInteraction } from '../types/ivr';
import { storageService } from './storageService';
import { smsService } from './smsService';
import { ivrEngine } from './ivrEngine';

export interface BatchRunResult {
  timestamp: string;
  totalDueCases: number;
  smsDispatched: number;
  ivrQueued: number;
  skippedPaused: number;
  details: Array<{
    caseId: string;
    victimPseudonym: string;
    channel: string;
    status: 'dispatched_sms' | 'ready_ivr' | 'skipped_consent_paused';
    language: string;
  }>;
}

class SchedulerService {
  public getDueCases(todayStr: string = new Date().toISOString().split('T')[0]): AtrocityCase[] {
    const allCases = storageService.getCases();
    return allCases.filter((c) => {
      if (c.consentStatus === 'opted_out') return false;
      return !c.nextScheduledContact || c.nextScheduledContact <= todayStr;
    });
  }

  public runScheduledBatch(todayStr: string = new Date().toISOString().split('T')[0]): BatchRunResult {
    const dueCases = this.getDueCases(todayStr);
    const result: BatchRunResult = {
      timestamp: new Date().toISOString(),
      totalDueCases: dueCases.length,
      smsDispatched: 0,
      ivrQueued: 0,
      skippedPaused: 0,
      details: [],
    };

    dueCases.forEach((c) => {
      if (c.consentStatus === 'paused') {
        result.skippedPaused++;
        result.details.push({
          caseId: c.id,
          victimPseudonym: c.victimPseudonym,
          channel: c.preferredChannel || 'IVR_VOICE',
          status: 'skipped_consent_paused',
          language: c.preferredLanguage,
        });
        return;
      }

      if (c.preferredChannel === 'FEATURE_PHONE_SMS') {
        // Dispatch multilingual scheduled check-in SMS
        smsService.sendOutboundCheckInSMS(c.id, c.preferredLanguage);
        result.smsDispatched++;
        result.details.push({
          caseId: c.id,
          victimPseudonym: c.victimPseudonym,
          channel: 'FEATURE_PHONE_SMS',
          status: 'dispatched_sms',
          language: c.preferredLanguage,
        });
      } else {
        // IVR or Either: marks ready for automated IVR voice dialer
        result.ivrQueued++;
        result.details.push({
          caseId: c.id,
          victimPseudonym: c.victimPseudonym,
          channel: 'IVR_VOICE',
          status: 'ready_ivr',
          language: c.preferredLanguage,
        });
      }
    });

    return result;
  }
}

export const schedulerService = new SchedulerService();
