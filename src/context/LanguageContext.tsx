import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageOption, SelfReportedStatus, SupportNeedType, SUPPORTED_LANGUAGES } from '../types/ivr';
import { I18N_DICTIONARY, Translations } from '../services/i18n';
import { ivrEngine } from '../services/ivrEngine';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof Translations) => string;
  tStatus: (status: SelfReportedStatus | null | undefined) => string;
  tNeed: (need: SupportNeedType) => string;
  tTier: (tier: string) => string;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const STORAGE_KEY = 'mosje_app_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
    return 'hi'; // Default to Hindi, official national language for MoSJE
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
    }
    // Synchronize IVR engine immediately so simulator matches dashboard
    ivrEngine.setLanguage(newLang);
  };

  // Sync with ivrEngine on mount
  useEffect(() => {
    ivrEngine.setLanguage(language);
  }, [language]);

  const currentDict = I18N_DICTIONARY[language] || I18N_DICTIONARY.hi || I18N_DICTIONARY.en;

  const t = (key: keyof Translations): string => {
    return currentDict[key] || I18N_DICTIONARY.en[key] || String(key);
  };

  const tStatus = (status: SelfReportedStatus | null | undefined): string => {
    if (!status) return t('statusPending');
    switch (status) {
      case 'coping_well':
        return t('statusCoping');
      case 'moderate_distress':
        return t('statusModerate');
      case 'critical_crisis':
        return t('statusCritical');
      default:
        return String(status);
    }
  };

  const tNeed = (need: SupportNeedType): string => {
    switch (need) {
      case 'legal_aid_escort':
        return t('needLegal');
      case 'trauma_counselling':
        return t('needCounseling');
      case 'police_witness_security':
        return t('needPolice');
      case 'compensation_disbursement':
        return t('needCompensation');
      case 'medical_assistance':
        return t('needMedical');
      case 'none_required':
        return t('needNone');
      default:
        return String(need);
    }
  };

  const tTier = (tier: string): string => {
    const upper = tier.toUpperCase();
    switch (upper) {
      case 'CRITICAL':
        return t('tierCritical');
      case 'HIGH':
        return t('tierHigh');
      case 'MODERATE':
        return t('tierModerate');
      case 'LOW':
        return t('tierLow');
      default:
        return tier;
    }
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tStatus,
        tNeed,
        tTier,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
