import { AtrocityCase, CheckInRecord, LanguageCode, ScheduledInteraction, SupportNeedType } from '../types/ivr';
import { INITIAL_CASES, INITIAL_CHECKINS } from '../data/mockCases';

const CASES_STORAGE_KEY = 'mosje_cases_v1';
const CHECKINS_STORAGE_KEY = 'mosje_checkins_v1';

class StorageService {
  private cases: AtrocityCase[] = [];
  private checkIns: CheckInRecord[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    try {
      const storedCases = localStorage.getItem(CASES_STORAGE_KEY);
      if (storedCases) {
        this.cases = JSON.parse(storedCases);
      } else {
        this.cases = [...INITIAL_CASES];
        this.saveCases();
      }

      const storedCheckIns = localStorage.getItem(CHECKINS_STORAGE_KEY);
      if (storedCheckIns) {
        this.checkIns = JSON.parse(storedCheckIns);
      } else {
        this.checkIns = [...INITIAL_CHECKINS];
        this.saveCheckIns();
      }
    } catch {
      this.cases = [...INITIAL_CASES];
      this.checkIns = [...INITIAL_CHECKINS];
    }
  }

  private saveCases(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(this.cases));
    }
    this.notify();
  }

  private saveCheckIns(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(this.checkIns));
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getCases(): AtrocityCase[] {
    return [...this.cases];
  }

  public getCaseById(id: string): AtrocityCase | undefined {
    return this.cases.find((c) => c.id === id);
  }

  public getCheckIns(): CheckInRecord[] {
    return [...this.checkIns];
  }

  public getCheckInsForCase(caseId: string): CheckInRecord[] {
    return this.checkIns
      .filter((c) => c.caseId === caseId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addCheckInRecord(record: CheckInRecord): void {
    this.checkIns.unshift(record);
    this.saveCheckIns();

    // Update case state dynamically
    const c = this.cases.find((item) => item.id === record.caseId);
    if (c) {
      c.lastContactDate = new Date().toISOString().split('T')[0];
      c.totalCheckInsCompleted += 1;

      // Handle consent opt out
      if (record.outcome === 'opted_out') {
        c.consentStatus = 'paused';
      }

      // Handle needs reported
      if (record.needs && record.needs.length > 0) {
        record.needs.forEach((need) => {
          if (need !== 'none_required' && !c.unresolvedNeeds.includes(need)) {
            c.unresolvedNeeds.push(need);
          }
        });
      }

      // Update urgency driven by citizen's explicit self-report (ethical agency, not black-box prediction)
      if (record.status === 'critical_crisis' || record.needs.includes('police_witness_security')) {
        c.currentUrgency = 'critical';
      } else if (record.status === 'moderate_distress' || record.needs.includes('trauma_counselling') || record.needs.includes('legal_aid_escort')) {
        c.currentUrgency = 'high';
      } else if (record.status === 'coping_well' && c.unresolvedNeeds.length === 0) {
        c.currentUrgency = 'low';
      }

      // Calculate next scheduled check in date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (c.checkInFrequencyDays || 7));
      c.nextScheduledContact = nextDate.toISOString().split('T')[0];

      this.saveCases();
    }
  }

  public updateCaseConsent(
    caseId: string,
    consentStatus: 'active' | 'paused' | 'opted_out',
    preferredLang?: LanguageCode,
    preferredTimeSlot?: 'morning' | 'afternoon' | 'evening'
  ): void {
    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      c.consentStatus = consentStatus;
      if (preferredLang) c.preferredLanguage = preferredLang;
      if (preferredTimeSlot) c.preferredTimeSlot = preferredTimeSlot;
      this.saveCases();
    }
  }

  public scheduleFutureInteraction(interaction: ScheduledInteraction): void {
    const c = this.cases.find((item) => item.id === interaction.caseId);
    if (c) {
      if (!c.scheduledInteractions) {
        c.scheduledInteractions = [];
      }
      c.scheduledInteractions.unshift(interaction);
      // Update next scheduled contact date if interaction is earlier
      if (!c.nextScheduledContact || interaction.scheduledDate <= c.nextScheduledContact) {
        c.nextScheduledContact = interaction.scheduledDate;
      }
      this.saveCases();
    }
  }

  public completeInteraction(caseId: string, interactionId: string, notes?: string): void {
    const c = this.cases.find((item) => item.id === caseId);
    if (c && c.scheduledInteractions) {
      const inter = c.scheduledInteractions.find((i) => i.id === interactionId);
      if (inter) {
        inter.status = 'completed';
        if (notes) inter.notes = notes;
        this.saveCases();
      }
    }
  }

  public updateCaseRecord(caseId: string, updates: Partial<AtrocityCase>): void {
    const index = this.cases.findIndex((item) => item.id === caseId);
    if (index !== -1) {
      this.cases[index] = { ...this.cases[index], ...updates };
      this.saveCases();
    }
  }

  public addCaseworkerNote(caseId: string, note: string): void {
    if (!caseId || !note) return;
    const sanitizedNote = String(note).trim().slice(0, 1000);
    if (!sanitizedNote) return;

    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      const existing = c.caseworkerNotes ? `${c.caseworkerNotes}\n\n` : '';
      const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      c.caseworkerNotes = `${existing}[${dateStr}] ${sanitizedNote}`;
      this.saveCases();
    }
  }

  public acknowledgeCheckIn(checkInId: string, notes?: string): void {
    const record = this.checkIns.find((r) => r.id === checkInId);
    if (record) {
      record.caseworkerAcknowledged = true;
      if (notes) {
        record.caseworkerNotes = String(notes).trim().slice(0, 500);
      }
      this.saveCheckIns();
    }
  }

  /**
   * DPDP Act 2023 Section 12: Right to Erasure / Right to be Forgotten.
   * Permanently purges past check-in voice telemetry and companion model inferences
   * for the given beneficiary, while preserving required statutory FIR court data.
   */
  public purgeCaseCheckIns(caseId: string): boolean {
    if (!caseId) return false;
    this.checkIns = this.checkIns.filter((chk) => chk.caseId !== caseId);
    this.saveCheckIns();

    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      c.therapyModelResult = undefined;
      c.totalCheckInsCompleted = 0;
      this.saveCases();
    }
    return true;
  }

  /**
   * DPDP Act 2023 Section 11: Right to Data Portability.
   * Exports an encrypted/clean JSON package of all stored personal records for the citizen.
   */
  public exportSurvivorData(caseId: string): string {
    const targetCase = this.cases.find((c) => c.id === caseId);
    const relatedCheckIns = this.checkIns.filter((chk) => chk.caseId === caseId);

    const exportBundle = {
      exportStandard: 'DPDP_ACT_2023_PORTABILITY_V1',
      generatedAt: new Date().toISOString(),
      statutoryJurisdiction: 'Ministry of Social Justice and Empowerment, Government of India',
      legalFramework: 'Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989',
      citizenProfile: targetCase
        ? {
            id: targetCase.id,
            victimPseudonym: targetCase.victimPseudonym,
            district: targetCase.district,
            state: targetCase.state,
            firNumber: targetCase.firNumber,
            registrationDate: targetCase.registrationDate,
            incidentType: targetCase.incidentType,
            reliefCompensationStage: targetCase.reliefCompensationStage,
            consentStatus: targetCase.consentStatus,
            preferredLanguage: targetCase.preferredLanguage,
            preferredTimeSlot: targetCase.preferredTimeSlot,
            unresolvedNeeds: targetCase.unresolvedNeeds,
          }
        : null,
      telephonyLogs: relatedCheckIns.map((chk) => ({
        timestamp: chk.timestamp,
        status: chk.status,
        durationSeconds: chk.callDurationSeconds,
        needsReported: chk.needs,
        acknowledgedByOfficer: chk.caseworkerAcknowledged,
      })),
      therapyModelDistressInference: targetCase?.therapyModelResult
        ? {
            distressScore: targetCase.therapyModelResult.distressScore,
            riskTier: targetCase.therapyModelResult.riskTier,
            modelSource: targetCase.therapyModelResult.modelSource,
            analyzedAt: targetCase.therapyModelResult.analyzedAt,
          }
        : null,
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  public reportNeed(caseId: string, need: SupportNeedType): void {
    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      if (!c.unresolvedNeeds.includes(need)) {
        c.unresolvedNeeds.push(need);
      }
      if (need === 'police_witness_security') {
        c.currentUrgency = 'critical';
      } else if (c.currentUrgency === 'low') {
        c.currentUrgency = 'high';
      }
      this.saveCases();
    }
  }

  public resolveNeed(caseId: string, need: SupportNeedType): void {
    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      c.unresolvedNeeds = c.unresolvedNeeds.filter((n) => n !== need);
      if (c.unresolvedNeeds.length === 0 && c.currentUrgency !== 'critical') {
        c.currentUrgency = 'low';
      }
      this.saveCases();
    }
  }

  public resetDefaults(): void {
    this.cases = [...INITIAL_CASES];
    this.checkIns = [...INITIAL_CHECKINS];
    this.saveCases();
    this.saveCheckIns();
  }
}

export const storageService = new StorageService();
