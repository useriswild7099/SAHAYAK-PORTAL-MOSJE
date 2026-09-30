import { LanguageCode, SelfReportedStatus, SupportNeedType } from '../types/ivr';

export interface Translations {
  // Official Government Headers
  govIndia: string;
  govIndiaSub: string;
  ministry: string;
  portalName: string;
  portalTagline: string;
  portalSub: string;
  gatewayOnline: string;
  helpline: string;
  helplineNumber: string;

  // Navigation Tabs
  navCaseworker: string;
  navCitizen: string;
  navSimulator: string;
  navEthics: string;
  simulateCallBtn: string;
  selectLanguage: string;
  lapsedBadge: string;

  // Dashboard Summary & Stats
  queueTitle: string;
  queueSubtitle: string;
  statTotalCases: string;
  statTotalCasesSub: string;
  statUrgentCases: string;
  statUrgentCasesSub: string;
  statLapsed: string;
  statLapsedSub: string;
  statEntitlements: string;
  statEntitlementsSub: string;
  statDistressAvg: string;
  statDistressAvgSub: string;

  // Dashboard Controls & Filters
  batchRunnerBtn: string;
  modelSettingsBtn: string;
  searchPlaceholder: string;
  filterUrgencyAll: string;
  filterEntitlementsAll: string;
  filterChannelAll: string;
  showingCases: string;

  // Table Column Headers
  colCaseFir: string;
  colBeneficiary: string;
  colStatus: string;
  colEntitlements: string;
  colDistressScore: string;
  colNextAction: string;
  colActions: string;

  // Action Buttons
  btnCall: string;
  btnDossier: string;
  btnSchedule: string;
  btnEdit: string;
  btnAcknowledge: string;
  btnAcknowledged: string;
  urgentAlert: string;

  // Status & Urgency Labels
  statusCoping: string;
  statusModerate: string;
  statusCritical: string;
  statusPending: string;
  statusOptedOut: string;
  statusRescheduled: string;

  tierCritical: string;
  tierHigh: string;
  tierModerate: string;
  tierLow: string;

  // Section 15A Entitlements
  needLegal: string;
  needCounseling: string;
  needPolice: string;
  needCompensation: string;
  needMedical: string;
  needNone: string;

  // Common Labels
  district: string;
  preferredLanguage: string;
  lastContact: string;
  scheduledOn: string;
  daysAgo: string;
  daysOverdue: string;
  today: string;
  noCasesFound: string;
  confidentialFIR: string;
}

export const I18N_DICTIONARY: Record<LanguageCode, Translations> = {
  en: {
    govIndia: 'GOVERNMENT OF INDIA',
    govIndiaSub: 'Ministry of Social Justice and Empowerment',
    ministry: 'Ministry of Social Justice and Empowerment',
    portalName: 'MoSJE Sahayak',
    portalTagline: 'PoA Follow-Up Portal',
    portalSub: 'Scheduled Multilingual Check-ins & Section 15A Witness Protection Continuity',
    gatewayOnline: 'National IVR Gateway Online',
    helpline: 'Toll-Free Helpline',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'District Casework Queue',
    navCitizen: 'Citizen Rights & Preferences',
    navSimulator: 'Feature Phone Simulator',
    navEthics: 'Problem Critique & Reality Check',
    simulateCallBtn: 'Simulate Live IVR Call',
    selectLanguage: 'Language',
    lapsedBadge: 'Lapsed',

    queueTitle: 'District Caseworker Action Queue',
    queueSubtitle: 'Monitoring Scheduled Multilingual Check-Ins, Section 15A Entitlements, & Witness Distress',
    statTotalCases: 'Active Monitored Cases',
    statTotalCasesSub: 'Assigned in District',
    statUrgentCases: 'Critical / High Threat',
    statUrgentCasesSub: 'Immediate Casework Required',
    statLapsed: 'Overdue Check-Ins',
    statLapsedSub: '>14 Days Without Contact',
    statEntitlements: 'Statutory Sec 15A Relief',
    statEntitlementsSub: 'Pending Entitlement Tracking',
    statDistressAvg: 'Therapy Model Distress',
    statDistressAvgSub: 'NLP Clinical Assessment',

    batchRunnerBtn: 'Run Scheduled Batch IVR Calls',
    modelSettingsBtn: 'Therapy Model Calibration',
    searchPlaceholder: 'Search by FIR Number, Pseudonym, District, or Police Station...',
    filterUrgencyAll: 'All Threat Levels',
    filterEntitlementsAll: 'All Entitlements',
    filterChannelAll: 'All Channels',
    showingCases: 'Showing Cases',

    colCaseFir: 'Case / FIR Details',
    colBeneficiary: 'District & Beneficiary',
    colStatus: 'Status & Threat Level',
    colEntitlements: 'Statutory Entitlements (Sec 15A)',
    colDistressScore: 'Therapy Distress Score',
    colNextAction: 'Scheduled Follow-Up',
    colActions: 'Caseworker Action',

    btnCall: 'Call',
    btnDossier: 'Dossier',
    btnSchedule: 'Schedule',
    btnEdit: 'Edit',
    btnAcknowledge: 'Ack',
    btnAcknowledged: 'Acknowledged',
    urgentAlert: 'Requires Immediate Action',

    statusCoping: 'Coping Well',
    statusModerate: 'Moderate Distress',
    statusCritical: 'Critical Crisis',
    statusPending: 'Pending Initial Call',
    statusOptedOut: 'Opted Out of Automated Calls',
    statusRescheduled: 'Rescheduled by Citizen',

    tierCritical: 'Critical',
    tierHigh: 'High',
    tierModerate: 'Moderate',
    tierLow: 'Low',

    needLegal: 'Legal Aid & Court Escort',
    needCounseling: 'Trauma Counselling',
    needPolice: 'Police Witness Security',
    needCompensation: 'Relief Compensation',
    needMedical: 'Medical Care',
    needNone: 'No Additional Needs Reported',

    district: 'District',
    preferredLanguage: 'Preferred Dialect',
    lastContact: 'Last Contact',
    scheduledOn: 'Scheduled',
    daysAgo: 'days ago',
    daysOverdue: 'days overdue',
    today: 'Today',
    noCasesFound: 'No cases found matching your search or filters.',
    confidentialFIR: 'Confidential PoA FIR Record',
  },

  hi: {
    govIndia: 'भारत सरकार',
    govIndiaSub: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
    ministry: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
    portalName: 'सामाजिक न्याय सहायक',
    portalTagline: 'अत्याचार निवारण अनुवर्ती पोर्टल',
    portalSub: 'अनुसूचित जाति/जनजाति अत्याचार निवारण अधिनियम धारा 15A अनुवर्ती प्रणाली',
    gatewayOnline: 'राष्ट्रीय आईवीआर गेटवे ऑनलाइन',
    helpline: 'टोल-फ्री हेल्पलाइन',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'जिला केसवर्क कतार',
    navCitizen: 'नागरिक अधिकार व सहमति',
    navSimulator: 'फीचर फोन सिम्युलेटर',
    navEthics: 'समस्या विश्लेषण एवं समीक्षा',
    simulateCallBtn: 'लाइव आईवीआर कॉल करें',
    selectLanguage: 'भाषा',
    lapsedBadge: 'विलंबित',

    queueTitle: 'जिला केसवर्कर कार्य सूची (Caseworker Action Queue)',
    queueSubtitle: 'अनुसूचित चेक-इन, धारा 15A वैधानिक अधिकार और गवाह सुरक्षा निगरानी',
    statTotalCases: 'सक्रिय निगरानी मामले',
    statTotalCasesSub: 'जिले में पंजीकृत',
    statUrgentCases: 'गंभीर / उच्च जोखिम',
    statUrgentCasesSub: 'तत्काल हस्तक्षेप आवश्यक',
    statLapsed: 'विलंबित चेक-इन',
    statLapsedSub: '>14 दिनों से संपर्क नहीं',
    statEntitlements: 'धारा 15A वैधानिक राहत',
    statEntitlementsSub: 'लंबित राहत वितरण ट्रैकिंग',
    statDistressAvg: 'थैरेपी मॉडल औसत व्यथा',
    statDistressAvgSub: 'एनएलपी क्लिनिकल मूल्यांकन',

    batchRunnerBtn: 'अनुसूचित बैच आईवीआर कॉल चलाएं',
    modelSettingsBtn: 'थैरेपी मॉडल अंशांकन',
    searchPlaceholder: 'एफआईआर संख्या, छद्म नाम, जिला या थाना द्वारा खोजें...',
    filterUrgencyAll: 'सभी जोखिम स्तर',
    filterEntitlementsAll: 'सभी वैधानिक अधिकार',
    filterChannelAll: 'सभी संचार माध्यम',
    showingCases: 'प्रदर्शित मामले',

    colCaseFir: 'मामला / एफआईआर विवरण',
    colBeneficiary: 'जिला एवं पीड़ित',
    colStatus: 'स्थिति एवं जोखिम स्तर',
    colEntitlements: 'धारा 15A वैधानिक अधिकार',
    colDistressScore: 'थैरेपी मॉडल व्यथा स्कोर',
    colNextAction: 'निर्धारित फॉलो-अप',
    colActions: 'केसवर्कर कार्रवाई',

    btnCall: 'कॉल करें',
    btnDossier: 'दस्तावेज़',
    btnSchedule: 'शेड्यूल',
    btnEdit: 'संशोधन',
    btnAcknowledge: 'स्वीकार',
    btnAcknowledged: 'स्वीकृत',
    urgentAlert: 'तत्काल कार्रवाई आवश्यक',

    statusCoping: 'संतोषजनक (सामान्य)',
    statusModerate: 'मध्यम व्यथा (तनाव)',
    statusCritical: 'गंभीर संकट (खतरा)',
    statusPending: 'प्रारंभिक कॉल प्रतीक्षारत',
    statusOptedOut: 'कॉल से बाहर (सहमति वापस)',
    statusRescheduled: 'पुनर्निर्धारित (कल कॉल)',

    tierCritical: 'अति-गंभीर',
    tierHigh: 'उच्च',
    tierModerate: 'मध्यम',
    tierLow: 'सामान्य',

    needLegal: 'विधिक सहायता व न्यायालय एस्कॉर्ट',
    needCounseling: 'मनोवैज्ञानिक ट्रॉमा काउंसलिंग',
    needPolice: 'पुलिस गवाह सुरक्षा',
    needCompensation: 'मुआवजा राशि वितरण',
    needMedical: 'चिकित्सा सहायता',
    needNone: 'कोई अतिरिक्त आवश्यकता नहीं',

    district: 'जिला',
    preferredLanguage: 'पसंदीदा भाषा',
    lastContact: 'अंतिम संपर्क',
    scheduledOn: 'निर्धारित तिथि',
    daysAgo: 'दिन पहले',
    daysOverdue: 'दिन विलंबित',
    today: 'आज',
    noCasesFound: 'खोज या फ़िल्टर से कोई मामला नहीं मिला।',
    confidentialFIR: 'गोपनीय अनुसूचित जाति/जनजाति एफआईआर रिकॉर्ड',
  },

  bn: {
    govIndia: 'ভারত সরকার',
    govIndiaSub: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক',
    ministry: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক',
    portalName: 'MoSJE সহায়ক',
    portalTagline: 'PoA ফলো-আপ পোর্টাল',
    portalSub: 'তফসিলি জাতি/উপজাতি আইন ধারা ১৫এ সাক্ষী সুরক্ষা ও নিয়মিত চেক-ইন',
    gatewayOnline: 'জাতীয় আইভিআর গেটওয়ে সক্রিয়',
    helpline: 'টোল-ফ্রি হেল্পলাইন',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'জেলা কেসওয়ার্কার কিউ',
    navCitizen: 'নাগরিক অধিকার ও সম্মতি',
    navSimulator: 'ফিচার ফোন সিমুলেটর',
    navEthics: 'বাস্তবতা যাচাই ও পর্যালোচনা',
    simulateCallBtn: 'লাইভ আইভিআর কল',
    selectLanguage: 'ভাষা',
    lapsedBadge: 'বকেয়া',

    queueTitle: 'জেলা কেসওয়ার্কার অ্যাকশন কিউ',
    queueSubtitle: 'ধারাবাহিক চেক-ইন, ধারা ১৫এ সংবিধিবদ্ধ ত্রাণ ও সাক্ষী মানসিক স্বাস্থ্য পর্যবেক্ষণ',
    statTotalCases: 'সক্রিয় নজরদারি মামলা',
    statTotalCasesSub: 'জেলায় নথিভুক্ত',
    statUrgentCases: 'জরুরি / উচ্চ ঝুঁকি',
    statUrgentCasesSub: 'অবিলম্বে পদক্ষেপ প্রয়োজন',
    statLapsed: 'বকেয়া চেক-ইন',
    statLapsedSub: '>১৪ দিন কোনো যোগাযোগ নেই',
    statEntitlements: 'ধারা ১৫এ সংবিধিবদ্ধ ত্রাণ',
    statEntitlementsSub: 'ত্রাণ বিতরণ পর্যবেক্ষণ',
    statDistressAvg: 'থেরাপি মডেল গড় সংকট',
    statDistressAvgSub: 'এনএলপি ক্লিনিকাল মূল্যায়ন',

    batchRunnerBtn: 'নির্ধারিত ব্যাচ আইভিআর কল চালান',
    modelSettingsBtn: 'থেরাপি মডেল সমন্বয়',
    searchPlaceholder: 'এফআইআর নম্বর, ছদ্মনাম, জেলা বা থানা দিয়ে খুঁজুন...',
    filterUrgencyAll: 'সকল ঝুঁকির মাত্রা',
    filterEntitlementsAll: 'সকল আইনি অধিকার',
    filterChannelAll: 'সকল মাধ্যম',
    showingCases: 'প্রদর্শিত মামলা',

    colCaseFir: 'মামলা / এফআইআর বিবরণ',
    colBeneficiary: 'জেলা ও সুবিধাভোগী',
    colStatus: 'পরিস্থিতি ও ঝুঁকির মাত্রা',
    colEntitlements: 'আইনগত অধিকার (ধারা ১৫এ)',
    colDistressScore: 'থেরাপি মডেল সংকট স্কোর',
    colNextAction: 'পরবর্তী ফলো-আপ',
    colActions: 'কেসওয়ার্কার পদক্ষেপ',

    btnCall: 'কল করুন',
    btnDossier: 'ডোসিয়ার',
    btnSchedule: 'সময়সূচী',
    btnEdit: 'সম্পাদনা',
    btnAcknowledge: 'স্বীকার',
    btnAcknowledged: 'স্বীকৃত',
    urgentAlert: 'জরুরি পদক্ষেপ প্রয়োজন',

    statusCoping: 'স্থিতিশীল (ভালো আছেন)',
    statusModerate: 'মাঝারি মানসিক চাপ',
    statusCritical: 'গুরুতর সংকট (বিপদ)',
    statusPending: 'প্রাথমিক কলের অপেক্ষায়',
    statusOptedOut: 'স্বয়ংক্রিয় কল বাতিল',
    statusRescheduled: 'পুনঃনির্ধারিত',

    tierCritical: 'সংকটপূর্ণ',
    tierHigh: 'উচ্চ',
    tierModerate: 'মাঝারি',
    tierLow: 'স্বাভাবিক',

    needLegal: 'আইনি সহায়তা ও আদালত এসকর্ট',
    needCounseling: 'ট্রমা কাউন্সেলিং',
    needPolice: 'পুলিশ সাক্ষী নিরাপত্তা',
    needCompensation: 'ক্ষতিপূরণ ত্রাণ বিতরণ',
    needMedical: 'চিকিৎসা সহায়তা',
    needNone: 'অতিরিক্ত প্রয়োজন নেই',

    district: 'জেলা',
    preferredLanguage: 'পছন্দের ভাষা',
    lastContact: 'সর্বশেষ যোগাযোগ',
    scheduledOn: 'নির্ধারিত তারিখ',
    daysAgo: 'দিন আগে',
    daysOverdue: 'দিন বকেয়া',
    today: 'আজ',
    noCasesFound: 'কোনো মামলা খুঁজে পাওয়া যায়নি।',
    confidentialFIR: 'গোপনীয় তফসিলি জাতি/উপজাতি এফআইআর রেকর্ড',
  },

  ta: {
    govIndia: 'இந்திய அரசு',
    govIndiaSub: 'சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்',
    ministry: 'சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்',
    portalName: 'சமூக நீதி சகாயக்',
    portalTagline: 'வன்கொடுமை தடுப்பு பின்தொடர்தல் தளம்',
    portalSub: 'பிரிவு 15A சாட்சி பாதுகாப்பு மற்றும் திட்டமிடப்பட்ட கண்காணிப்பு',
    gatewayOnline: 'தேசிய IVR சேவை இயங்குகிறது',
    helpline: 'இலவச உதவி எண்',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'மாவட்ட வழக்கு வரிசை',
    navCitizen: 'குடிமக்கள் உரிமைகள் & சம்மதம்',
    navSimulator: 'தொலைபேசி சிமுலேட்டர்',
    navEthics: 'நடைமுறை ஆய்வு & நீதிநெறி',
    simulateCallBtn: 'நேரலை IVR அழைப்பு',
    selectLanguage: 'மொழி',
    lapsedBadge: 'தாமதம்',

    queueTitle: 'மாவட்ட களப்பணியாளர் பணி வரிசை',
    queueSubtitle: 'திட்டமிடப்பட்ட அழைப்புகள், பிரிவு 15A சட்ட உரிமைகள் & சாட்சி மன உளைச்சல் கண்காணிப்பு',
    statTotalCases: 'செயலில் உள்ள வழக்குகள்',
    statTotalCasesSub: 'மாவட்டத்தில் பதிவுசெய்தவை',
    statUrgentCases: 'அவசர / அதிக ஆபத்து',
    statUrgentCasesSub: 'உடனடி நடவடிக்கை தேவை',
    statLapsed: 'தாமதமான தொடர்புகள்',
    statLapsedSub: '>14 நாட்கள் தொடர்பு இல்லை',
    statEntitlements: 'சட்டபூர்வ பிரிவு 15A நிவாரணம்',
    statEntitlementsSub: 'நிவாரண நிதி வழங்கல் கண்காணிப்பு',
    statDistressAvg: 'சிகிச்சை மாதிரி சராசரி மன உளைச்சல்',
    statDistressAvgSub: 'NLP மருத்துவ மதிப்பீடு',

    batchRunnerBtn: 'திட்டமிட்ட தொகுதி IVR அழைப்புகள்',
    modelSettingsBtn: 'சிகிச்சை மாதிரி அமைப்புகள்',
    searchPlaceholder: 'எஃப்.ஐ.ஆர் எண், மாற்றுப்பெயர், மாவட்டம் அல்லது காவல் நிலையம் மூலம் தேடுக...',
    filterUrgencyAll: 'அனைத்து ஆபத்து நிலைகள்',
    filterEntitlementsAll: 'அனைத்து சட்ட உரிமைகள்',
    filterChannelAll: 'அனைத்து வழிகள்',
    showingCases: 'வழக்குகள் எண்ணிக்கை',

    colCaseFir: 'வழக்கு / எஃப்.ஐ.ஆர் விவரம்',
    colBeneficiary: 'மாவட்டம் மற்றும் பயனாளி',
    colStatus: 'நிலை மற்றும் அச்சுறுத்தல் அளவு',
    colEntitlements: 'சட்டபூர்வ உரிமைகள் (பிரிவு 15A)',
    colDistressScore: 'மன உளைச்சல் மதிப்பீடு',
    colNextAction: 'அடுத்த தொடர்பு',
    colActions: 'நடவடிக்கை',

    btnCall: 'அழை',
    btnDossier: 'ஆவணம்',
    btnSchedule: 'நேரம் குறி',
    btnEdit: 'திருத்து',
    btnAcknowledge: 'ஏற்பு',
    btnAcknowledged: 'ஏற்கப்பட்டது',
    urgentAlert: 'உடனடி நடவடிக்கை தேவை',

    statusCoping: 'நலமாக உள்ளார் (இயல்பு)',
    statusModerate: 'மிதமான மன அழுத்தம்',
    statusCritical: 'கடுமையான ஆபத்து (அவசரம்)',
    statusPending: 'முதல் அழைப்பிற்கு காத்திருக்கிறது',
    statusOptedOut: 'அழைப்புகள் நிறுத்தப்பட்டது',
    statusRescheduled: 'மறுதேதியிடப்பட்டது',

    tierCritical: 'அவசரம்',
    tierHigh: 'அதிகம்',
    tierModerate: 'மிதமானது',
    tierLow: 'குறைவு',

    needLegal: 'சட்ட உதவி & நீதிமன்ற பாதுகாப்பு',
    needCounseling: 'மன அழுத்த ஆலோசனைகள்',
    needPolice: 'காவல்துறை சாட்சி பாதுகாப்பு',
    needCompensation: 'நிவாரண நிதி வழங்கல்',
    needMedical: 'மருத்துவ உதவி',
    needNone: 'கூடுதல் தேவைகள் இல்லை',

    district: 'மாவட்டம்',
    preferredLanguage: 'விருப்ப மொழி',
    lastContact: 'கடைசி தொடர்பு',
    scheduledOn: 'திட்டமிட்ட தேதி',
    daysAgo: 'நாட்களுக்கு முன்',
    daysOverdue: 'நாட்கள் தாமதம்',
    today: 'இன்று',
    noCasesFound: 'பொருத்தமான வழக்குகள் எதுவும் காணப்படவில்லை.',
    confidentialFIR: 'இரகசிய வன்கொடுமை வழக்கு பதிவு',
  },

  te: {
    govIndia: 'భారత ప్రభుత్వం',
    govIndiaSub: 'సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ',
    ministry: 'సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ',
    portalName: 'MoSJE సహాయక్',
    portalTagline: 'అత్యాచార నిరోధక ఫాలో-అప్ పోర్టల్',
    portalSub: 'సెక్షన్ 15A సాక్షి రక్షణ మరియు క్రమబద్ధమైన ఫాలో-అప్ పర్యవేక్షణ',
    gatewayOnline: 'జాతీయ ఐవిఆర్ గేట్‌వే ఆన్‌లైన్',
    helpline: 'టోల్-ఫ్రీ హెల్ప్‌లైన్',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'కేస్‌వర్కర్ జాబితా',
    navCitizen: 'పౌర హక్కులు & సమ్మతి',
    navSimulator: 'ఫోన్ సిమ్యులేటర్',
    navEthics: 'వాస్తవిక పరిశీలన',
    simulateCallBtn: 'ఐవిఆర్ కాల్ చేయండి',
    selectLanguage: 'భాష',
    lapsedBadge: 'గడువు దాటినవి',

    queueTitle: 'జిల్లా కేస్‌వర్కర్ కార్యాచరణ జాబితా',
    queueSubtitle: 'షెడ్యూల్ చేసిన చెక్-ఇన్‌లు, సెక్షన్ 15A ఉపశమనం మరియు సాక్షి రక్షణ పర్యవేక్షణ',
    statTotalCases: 'క్రియాశీల కేసులు',
    statTotalCasesSub: 'జిల్లాలో నమోదైనవి',
    statUrgentCases: 'తీవ్రమైన / అధిక ముప్పు',
    statUrgentCasesSub: 'తక్షణ చర్య అవసరం',
    statLapsed: 'గడువు దాటిన సంప్రదింపులు',
    statLapsedSub: '>14 రోజులుగా సంప్రదింపు లేదు',
    statEntitlements: 'చట్టబద్ధమైన సెక్షన్ 15A ఉపశమనం',
    statEntitlementsSub: 'పరిహార పంపిణీ పర్యవేక్షణ',
    statDistressAvg: 'థెరపీ మోడల్ సగటు వేదన',
    statDistressAvgSub: 'NLP క్లినికల్ అంచనా',

    batchRunnerBtn: 'షెడ్యూల్డ్ బ్యాచ్ ఐవిఆర్ కాల్స్ రన్ చేయండి',
    modelSettingsBtn: 'థెరపీ మోడల్ సెట్టింగ్‌లు',
    searchPlaceholder: 'ఎఫ్ఐఆర్ నంబర్, మారుపేరు, జిల్లా లేదా పోలీస్ స్టేషన్ ద్వారా శోధించండి...',
    filterUrgencyAll: 'అన్ని ముప్పు స్థాయిలు',
    filterEntitlementsAll: 'అన్ని చట్టబద్ధమైన హక్కులు',
    filterChannelAll: 'అన్ని మాధ్యమాలు',
    showingCases: 'చూపుతున్న కేసులు',

    colCaseFir: 'కేసు / ఎఫ్ఐఆర్ వివరాలు',
    colBeneficiary: 'జిల్లా & బాధితుడు',
    colStatus: 'స్థితి & ముప్పు స్థాయి',
    colEntitlements: 'చట్టబద్ధమైన హక్కులు (15A)',
    colDistressScore: 'థెరపీ వేదన స్కోరు',
    colNextAction: 'తదుపరి సంప్రదింపు',
    colActions: 'చర్యలు',

    btnCall: 'కాల్ చేయి',
    btnDossier: 'వివరాలు',
    btnSchedule: 'షెడ్యూల్',
    btnEdit: 'సవరించు',
    btnAcknowledge: 'స్వీకరించు',
    btnAcknowledged: 'స్వీకరించబడింది',
    urgentAlert: 'తక్షణ చర్య అవసరం',

    statusCoping: 'స్థిరంగా ఉన్నారు (బాగున్నారు)',
    statusModerate: 'మధ్యస్థ మానసిక వేదన',
    statusCritical: 'తీవ్రమైన సంక్షోభం (ప్రమాదం)',
    statusPending: 'మొదటి కాల్ కోసం ఎదురుచూస్తున్నారు',
    statusOptedOut: 'కాల్స్ నిలిపివేయబడ్డాయి',
    statusRescheduled: 'మళ్లీ షెడ్యూల్ చేయబడింది',

    tierCritical: 'తీవ్రం',
    tierHigh: 'అధికం',
    tierModerate: 'మధ్యస్థం',
    tierLow: 'తక్కువ',

    needLegal: 'న్యాయ సహాయం & కోర్టు ఎస్కార్ట్',
    needCounseling: 'ట్రామా కౌన్సెలింగ్',
    needPolice: 'పోలీస్ సాక్షి రక్షణ',
    needCompensation: 'పరిహార పంపిణీ',
    needMedical: 'వైద్య సహాయం',
    needNone: 'అదనపు అవసరాలు లేవు',

    district: 'జిల్లా',
    preferredLanguage: 'ప్రాధాన్య భాష',
    lastContact: 'చివరి సంప్రదింపు',
    scheduledOn: 'షెడ్యూల్ చేసిన తేదీ',
    daysAgo: 'రోజుల క్రితం',
    daysOverdue: 'రోజులు ఆలస్యం',
    today: 'ఈ రోజు',
    noCasesFound: 'కేసులు ఏవీ కనుగొనబడలేదు.',
    confidentialFIR: 'రహస్య ఎస్సీ/ఎస్టీ ఎఫ్ఐఆర్ రికార్డు',
  },

  mr: {
    govIndia: 'भारत सरकार',
    govIndiaSub: 'सामाजिक न्याय आणि अधिकारिता मंत्रालय',
    ministry: 'सामाजिक न्याय आणि अधिकारिता मंत्रालय',
    portalName: 'MoSJE साहाय्यक',
    portalTagline: 'अत्याचार प्रतिबंधक पाठपुरावा पोर्टल',
    portalSub: 'कलम १५ए साक्षीदार संरक्षण आणि नियमित पाठपुरावा प्रणाली',
    gatewayOnline: 'राष्ट्रीय आयव्हीआर गेटवे सुरू आहे',
    helpline: 'टोल-फ्री हेल्पलाइन',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'केसवर्क रांग',
    navCitizen: 'नागरिक हक्क व संमती',
    navSimulator: 'फोन सिम्युलेटर',
    navEthics: 'वास्तव तपासणी व नीतिशास्त्र',
    simulateCallBtn: 'थेट आयव्हीआर कॉल करा',
    selectLanguage: 'भाषा',
    lapsedBadge: 'थकबाकी',

    queueTitle: 'जिल्हा केसवर्कर कृती रांग',
    queueSubtitle: 'अनुसूचित चेक-इन, कलम १५ए कायदेशीर साहाय्य आणि साक्षीदार संरक्षण निरीक्षण',
    statTotalCases: 'सक्रिय प्रकरणे',
    statTotalCasesSub: 'जिल्ह्यात नोंदणीकृत',
    statUrgentCases: 'गंभीर / उच्च धोका',
    statUrgentCasesSub: 'तातडीने हस्तक्षेप आवश्यक',
    statLapsed: 'थकबाकी चेक-इन्स',
    statLapsedSub: '>१४ दिवस संपर्क नाही',
    statEntitlements: 'कायदेशीर कलम १५ए साहाय्य',
    statEntitlementsSub: 'नुकसानभरपाई वितरण मागोवा',
    statDistressAvg: 'थेरपी मॉडेल सरासरी व्यथा',
    statDistressAvgSub: 'NLP क्लिनिकल मूल्यांकन',

    batchRunnerBtn: 'नियोजित बॅच आयव्हीआर कॉल्स सुरू करा',
    modelSettingsBtn: 'थेरपी मॉडेल सेटिंग्ज',
    searchPlaceholder: 'एफआयआर क्रमांक, टोपणनाव, जिल्हा किंवा पोलीस ठाण्यानुसार शोधा...',
    filterUrgencyAll: 'सर्व धोक्याची पातळी',
    filterEntitlementsAll: 'सर्व कायदेशीर हक्क',
    filterChannelAll: 'सर्व माध्यमे',
    showingCases: 'दर्शवलेली प्रकरणे',

    colCaseFir: 'प्रकरण / एफआयआर तपशील',
    colBeneficiary: 'जिल्हा आणि पीडित',
    colStatus: 'स्थिती आणि धोक्याची पातळी',
    colEntitlements: 'कायदेशीर हक्क (कलम १५ए)',
    colDistressScore: 'थेरपी मॉडेल व्यथा स्कोअर',
    colNextAction: 'पुढील पाठपुरावा',
    colActions: 'केसवर्कर कारवाई',

    btnCall: 'कॉल करा',
    btnDossier: 'तपशील',
    btnSchedule: 'शेड्यूल',
    btnEdit: 'संपादित करा',
    btnAcknowledge: 'स्वीकारा',
    btnAcknowledged: 'स्वीकृत',
    urgentAlert: 'तातडीने कारवाई आवश्यक',

    statusCoping: 'स्थिर (चांगले आहेत)',
    statusModerate: 'मध्यम मानसिक ताण',
    statusCritical: 'गंभीर संकट (धोका)',
    statusPending: 'पहिल्या कॉलची प्रतीक्षा',
    statusOptedOut: 'कॉल थांबवले',
    statusRescheduled: 'पुनर्नियोजित',

    tierCritical: 'गंभीर',
    tierHigh: 'उच्च',
    tierModerate: 'मध्यम',
    tierLow: 'कमी',

    needLegal: 'कायदेशीर मदत आणि कोर्ट एस्कॉर्ट',
    needCounseling: 'मानसिक धक्का समुपदेशन',
    needPolice: 'पोलीस साक्षीदार संरक्षण',
    needCompensation: 'भरपाई निधी वितरण',
    needMedical: 'वैद्यकीय मदत',
    needNone: 'अतिरिक्त गरज नाही',

    district: 'जिल्हा',
    preferredLanguage: 'पसंतीची भाषा',
    lastContact: 'शेवटचा संपर्क',
    scheduledOn: 'नियोजित तारीख',
    daysAgo: 'दिवसांपूर्वी',
    daysOverdue: 'दिवस उशीर',
    today: 'आज',
    noCasesFound: 'कोणतेही प्रकरण आढळले नाही.',
    confidentialFIR: 'गोपनीय अनुसूचित जाती/जमाती एफआयआर नोंद',
  },

  kn: {
    govIndia: 'ಭಾರತ ಸರ್ಕಾರ',
    govIndiaSub: 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ',
    ministry: 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ',
    portalName: 'MoSJE ಸಹಾಯಕ',
    portalTagline: 'ದೌರ್ಜನ್ಯ ತಡೆ ಫಾಲೋ-ಅಪ್ ಪೋರ್ಟಲ್',
    portalSub: 'ವಿಭಾಗ 15A ಸಾಕ್ಷಿ ರಕ್ಷಣೆ ಮತ್ತು ನಿಗದಿತ ಫಾಲೋ-ಅಪ್ ಮೇಲ್ವಿಚಾರಣೆ',
    gatewayOnline: 'ರಾಷ್ಟ್ರೀಯ ಐವಿಆರ್ ಗೇಟ್‌ವೇ ಸಕ್ರಿಯವಾಗಿದೆ',
    helpline: 'ಉಚಿತ ಸಹಾಯವಾಣಿ',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'ಕೇಸ್‌ವರ್ಕರ್ ಸರದಿ',
    navCitizen: 'ನಾಗರಿಕ ಹಕ್ಕುಗಳು & ಸಮ್ಮತಿ',
    navSimulator: 'ಫೋನ್ ಸಿಮ್ಯುಲೇಟರ್',
    navEthics: 'ವಾಸ್ತವ ವಿಶ್ಲೇಷಣೆ',
    simulateCallBtn: 'ಲೈವ್ ಐವಿಆರ್ ಕರೆ',
    selectLanguage: 'ಭಾಷೆ',
    lapsedBadge: 'ವಿಳಂಬಿತ',

    queueTitle: 'ಜಿಲ್ಲಾ ಕೇಸ್‌ವರ್ಕರ್ ಕಾರ್ಯ ಸರದಿ',
    queueSubtitle: 'ನಿಗದಿತ ಚೆಕ್-ಇನ್‌ಗಳು, ವಿಭಾಗ 15A ಶಾಸನಬದ್ಧ ಪರಿಹಾರ ಮತ್ತು ಸಾಕ್ಷಿ ಸಂಕಟ ಮೇಲ್ವಿಚಾರಣೆ',
    statTotalCases: 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು',
    statTotalCasesSub: 'ಜಿಲ್ಲೆಯಲ್ಲಿ ದಾಖಲಾದವು',
    statUrgentCases: 'ತುರ್ತು / ತೀವ್ರ ಅಪಾಯ',
    statUrgentCasesSub: 'ತಕ್ಷಣದ ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
    statLapsed: 'ವಿಳಂಬಿತ ಸಂಪರ್ಕಗಳು',
    statLapsedSub: '>14 ದಿನಗಳಿಂದ ಸಂಪರ್ಕವಿಲ್ಲ',
    statEntitlements: 'ಶಾಸನಬದ್ಧ ಪರಿಹಾರ ಹಕ್ಕುಗಳು',
    statEntitlementsSub: 'ಪರಿಹಾರ ವಿತರಣೆ ಮೇಲ್ವಿಚಾರಣೆ',
    statDistressAvg: 'ಚಿಕಿತ್ಸಾ ಮಾದರಿ ಸರಾಸರಿ ಸಂಕಟ',
    statDistressAvgSub: 'NLP ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ',

    batchRunnerBtn: 'ನಿಗದಿತ ಬ್ಯಾಚ್ ಐವಿಆರ್ ಕರೆಗಳನ್ನು ಚಲಾಯಿಸಿ',
    modelSettingsBtn: 'ಚಿಕಿತ್ಸಾ ಮಾದರಿ ಸೆಟ್ಟಿಂಗ್ಸ್',
    searchPlaceholder: 'ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ, ಕಾವ್ಯನಾಮ, ಜಿಲ್ಲೆ ಅಥವಾ ಪೊಲೀಸ್ ಠಾಣೆಯಿಂದ ಹುಡುಕಿ...',
    filterUrgencyAll: 'ಎಲ್ಲಾ ಅಪಾಯದ ಮಟ್ಟಗಳು',
    filterEntitlementsAll: 'ಎಲ್ಲಾ ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳು',
    filterChannelAll: 'ಎಲ್ಲಾ ಮಾಧ್ಯಮಗಳು',
    showingCases: 'ತೋರಿಸಲಾಗುತ್ತಿರುವ ಪ್ರಕರಣಗಳು',

    colCaseFir: 'ಪ್ರಕರಣ / ಎಫ್‌ಐಆರ್ ವಿವರಗಳು',
    colBeneficiary: 'ಜಿಲ್ಲೆ ಮತ್ತು ಸಂತ್ರಸ್ತರು',
    colStatus: 'ಸ್ಥಿತಿ ಮತ್ತು ಅಪಾಯದ ಮಟ್ಟ',
    colEntitlements: 'ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳು (15A)',
    colDistressScore: 'ಸಂಕಟ ಸ್ಕೋರ್',
    colNextAction: 'ಮುಂದಿನ ಫಾಲೋ-ಅಪ್',
    colActions: 'ಕ್ರಮಗಳು',

    btnCall: 'ಕರೆ ಮಾಡಿ',
    btnDossier: 'ದಾಖಲೆ',
    btnSchedule: 'ನಿಗದಿಪಡಿಸಿ',
    btnEdit: 'ತಿದ್ದಿ',
    btnAcknowledge: 'ಅಂಗೀಕರಿಸಿ',
    btnAcknowledged: 'ಅಂಗೀಕರಿಸಲಾಗಿದೆ',
    urgentAlert: 'ತಕ್ಷಣದ ಕ್ರಮ ಅಗತ್ಯವಿದೆ',

    statusCoping: 'ಸ್ಥಿರವಾಗಿದ್ದಾರೆ (ಚೆನ್ನಾಗಿದ್ದಾರೆ)',
    statusModerate: 'ಮಧ್ಯಮ ಮಾನಸಿಕ ಒತ್ತಡ',
    statusCritical: 'ತೀವ್ರ ಬಿಕ್ಕಟ್ಟು (ಅಪಾಯ)',
    statusPending: 'ಮೊದಲ ಕರೆಗೆ ಕಾಯುತ್ತಿದೆ',
    statusOptedOut: 'ಕರೆಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ',
    statusRescheduled: 'ಮರು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ',

    tierCritical: 'ತುರ್ತು',
    tierHigh: 'ಹೆಚ್ಚು',
    tierModerate: 'ಮಧ್ಯಮ',
    tierLow: 'ಕಡಿಮೆ',

    needLegal: 'ಕಾನೂನು ನೆರವು & ಕೋರ್ಟ್ ಎಸ್ಕಾರ್ಟ್',
    needCounseling: 'ಮಾನಸಿಕ ಆಘಾತ ಸಮಾಲೋಚನೆ',
    needPolice: 'ಪೊಲೀಸ್ ಸಾಕ್ಷಿ ರಕ್ಷಣೆ',
    needCompensation: 'ಪರಿಹಾರ ವಿತರಣೆ',
    needMedical: 'ವೈದ್ಯಕೀಯ ನೆರವು',
    needNone: 'ಹೆಚ್ಚುವರಿ ಅಗತ್ಯಗಳಿಲ್ಲ',

    district: 'ಜಿಲ್ಲೆ',
    preferredLanguage: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    lastContact: 'ಕೊನೆಯ ಸಂಪರ್ಕ',
    scheduledOn: 'ನಿಗದಿತ ದಿನಾಂಕ',
    daysAgo: 'ದಿನಗಳ ಹಿಂದೆ',
    daysOverdue: 'ದಿನಗಳ ವಿಳಂಬ',
    today: 'ಇಂದು',
    noCasesFound: 'ಯಾವುದೇ ಪ್ರಕರಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    confidentialFIR: 'ಗೌಪ್ಯ ಎಸ್‌ಸಿ/ಎಸ್‌ಟಿ ಎಫ್‌ಐಆರ್ ದಾಖಲೆ',
  },

  gu: {
    govIndia: 'ભારત સરકાર',
    govIndiaSub: 'સામાજિક ન્યાય અને સશક્તિકરણ મંત્રાલય',
    ministry: 'સામાજિક ન્યાય અને સશક્તિકરણ મંત્રાલય',
    portalName: 'MoSJE સહાયક',
    portalTagline: 'અત્યાચાર નિવારણ ફોલો-અપ પોર્ટલ',
    portalSub: 'કલમ 15A સાક્ષી સુરક્ષા અને નિર્ધારિત ફોલો-અપ મોનિટરિંગ',
    gatewayOnline: 'રાષ્ટ્રીય IVR ગેટવે સક્રિય છે',
    helpline: 'ટોલ-ફ્રી હેલ્પલાઇન',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'કેસવર્કર કતાર',
    navCitizen: 'નાગરિક અધિકારો અને સંમતિ',
    navSimulator: 'ફોન સિમ્યુલેટર',
    navEthics: 'વાસ્તવિકતા ચકાસણી',
    simulateCallBtn: 'લાઇવ આઈવીઆર કૉલ',
    selectLanguage: 'ભાષા',
    lapsedBadge: 'વિલંબિત',

    queueTitle: 'જિલ્લા કેસવર્કર કાર્ય સૂચિ',
    queueSubtitle: 'નિર્ધારિત ચેક-ઇન, કલમ 15A કાનૂની રાહત અને સાક્ષી સુરક્ષા નિરીક્ષણ',
    statTotalCases: 'સક્રિય કેસો',
    statTotalCasesSub: 'જિલ્લામાં નોંધાયેલ',
    statUrgentCases: 'ગંભીર / ઉચ્ચ જોખમ',
    statUrgentCasesSub: 'તાત્કાલિક પગલાં જરૂરી',
    statLapsed: 'વિલંબિત ચેક-ઇન',
    statLapsedSub: '>14 દિવસથી સંપર્ક નથી',
    statEntitlements: 'કાનૂની કલમ 15A રાહત',
    statEntitlementsSub: 'વળતર વિતરણ ટ્રેકિંગ',
    statDistressAvg: 'થેરાપી મોડેલ સરેરાશ વ્યથા',
    statDistressAvgSub: 'NLP ક્લિનિકલ મૂલ્યાંકન',

    batchRunnerBtn: 'શેડ્યૂલ કરેલ બેચ IVR કૉલ્સ ચલાવો',
    modelSettingsBtn: 'થેરાપી મોડેલ સેટિંગ્સ',
    searchPlaceholder: 'એફઆઈઆર નંબર, ઉપનામ, જિલ્લો અથવા પોલીસ સ્ટેશન દ્વારા શોધો...',
    filterUrgencyAll: 'તમામ જોખમ સ્તર',
    filterEntitlementsAll: 'તમામ કાનૂની અધિકારો',
    filterChannelAll: 'તમામ માધ્યમો',
    showingCases: 'દર્શાવેલ કેસો',

    colCaseFir: 'કેસ / એફઆઈઆર વિગતો',
    colBeneficiary: 'જિલ્લો અને પીડિત',
    colStatus: 'સ્થિતિ અને જોખમ સ્તર',
    colEntitlements: 'કાનૂની અધિકારો (કલમ 15A)',
    colDistressScore: 'થેરાપી વ્યથા સ્કોર',
    colNextAction: 'આગામી ફોલો-અપ',
    colActions: 'કાર્યવાહી',

    btnCall: 'કૉલ કરો',
    btnDossier: 'વિગતો',
    btnSchedule: 'સમય નક્કી કરો',
    btnEdit: 'ફેરફાર',
    btnAcknowledge: 'સ્વીકારો',
    btnAcknowledged: 'સ્વીકારેલ',
    urgentAlert: 'તાત્કાલિક પગલાં જરૂરી',

    statusCoping: 'સ્થિર છે (સારા છે)',
    statusModerate: 'મધ્યમ માનસિક તણાવ',
    statusCritical: 'ગંભીર સંકટ (જોખમ)',
    statusPending: 'પ્રથમ કૉલની રાહ જોઈ રહ્યા છે',
    statusOptedOut: 'કૉલ બંધ કરેલ છે',
    statusRescheduled: 'ફરીથી નિર્ધારિત',

    tierCritical: 'ગંભીર',
    tierHigh: 'ઉચ્ચ',
    tierModerate: 'મધ્યમ',
    tierLow: 'ઓછું',

    needLegal: 'કાનૂની સહાય અને કોર્ટ એસ્કોર્ટ',
    needCounseling: 'આઘાત પરામર્શ (કાઉન્સેલિંગ)',
    needPolice: 'પોલીસ સાક્ષી સુરક્ષા',
    needCompensation: 'રાહત વળતર વિતરણ',
    needMedical: 'તબીબી સહાય',
    needNone: 'કોઈ વધારાની જરૂરિયાત નથી',

    district: 'જિલ્લો',
    preferredLanguage: 'પસંદગીની ભાષા',
    lastContact: 'છેલ્લો સંપર્ક',
    scheduledOn: 'નિર્ધારિત તારીખ',
    daysAgo: 'દિવસ પહેલા',
    daysOverdue: 'દિવસ વિલંબ',
    today: 'આજે',
    noCasesFound: 'કોઈ કેસ મળ્યા નથી.',
    confidentialFIR: 'ગુપ્ત એસસી/એસટી એફઆઈઆર રેકોર્ડ',
  },

  or: {
    govIndia: 'ଭାରତ ସରକାର',
    govIndiaSub: 'ସାମାଜିକ ନ୍ୟାୟ ଏବଂ ସଶକ୍ତୀକରଣ ମନ୍ତ୍ରଣାଳୟ',
    ministry: 'ସାମାଜିକ ନ୍ୟାୟ ଏବଂ ସଶକ୍ତୀକରଣ ମନ୍ତ୍ରଣାଳୟ',
    portalName: 'MoSJE ସହାୟକ',
    portalTagline: 'ଅତ୍ୟାଚାର ନିବାରଣ ଫଲୋ-ଅପ୍ ପୋର୍ଟାଲ୍',
    portalSub: 'ଧାରା ୧୫A ସାକ୍ଷୀ ସୁରକ୍ଷା ଏବଂ ନିର୍ଦ୍ଧାରିତ ଫଲୋ-ଅପ୍ ନିରୀକ୍ଷଣ',
    gatewayOnline: 'ଜାତୀୟ IVR ଗେଟୱେ ସକ୍ରିୟ ଅଛି',
    helpline: 'ଟୋଲ୍-ଫ୍ରି ହେଲ୍ପଲାଇନ୍',
    helplineNumber: '1800-11-2026 / 14566',

    navCaseworker: 'କେସୱାର୍କର କାର୍ଯ୍ୟ',
    navCitizen: 'ନାଗରିକ ଅଧିକାର ଓ ସମ୍ମତି',
    navSimulator: 'ଫୋନ୍ ସିମୁଲେଟର',
    navEthics: 'ବାସ୍ତବତା ପରୀକ୍ଷଣ',
    simulateCallBtn: 'ଆଇଭିଆର୍ କଲ୍ କରନ୍ତୁ',
    selectLanguage: 'ଭାଷା',
    lapsedBadge: 'ବକେୟା',

    queueTitle: 'ଜିଲ୍ଲା କେସୱାର୍କର କାର୍ଯ୍ୟ ତାଲିକା',
    queueSubtitle: 'ନିର୍ଦ୍ଧାରିତ ଚେକ୍-ଇନ୍, ଧାରା ୧୫A ଆଇନଗତ ରିଲିଫ୍ ଏବଂ ସାକ୍ଷୀ ସୁରକ୍ଷା ତଦାରଖ',
    statTotalCases: 'ସକ୍ରିୟ ମାମଲା',
    statTotalCasesSub: 'ଜିଲ୍ଲାରେ ପଞ୍ଜୀକୃତ',
    statUrgentCases: 'ଜରୁରୀ / ଉଚ୍ଚ ବିପଦ',
    statUrgentCasesSub: 'ତୁରନ୍ତ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଆବଶ୍ୟକ',
    statLapsed: 'ବକେୟା ଯୋଗାଯୋଗ',
    statLapsedSub: '>୧୪ ଦିନ ଧରି ଯୋଗାଯୋଗ ନାହିଁ',
    statEntitlements: 'ଆଇନଗତ ଧାରା ୧୫A ରିଲିଫ୍',
    statEntitlementsSub: 'କ୍ଷତିପୂରଣ ବଣ୍ଟନ ଅନୁସରଣ',
    statDistressAvg: 'ଥେରାପି ମଡେଲ୍ ହାରାହାରି ଯନ୍ତ୍ରଣା',
    statDistressAvgSub: 'NLP କ୍ଲିନିକାଲ୍ ମୂଲ୍ୟାଙ୍କନ',

    batchRunnerBtn: 'ବ୍ୟାଚ୍ IVR କଲ୍ ଚଲାନ୍ତୁ',
    modelSettingsBtn: 'ଥେରାପି ମଡେଲ୍ ସେଟିଙ୍ଗ୍',
    searchPlaceholder: 'ଏଫ୍‌ଆଇଆର୍ ନମ୍ବର, ଛଦ୍ମନାମ, ଜିଲ୍ଲା କିମ୍ବା ଥାନା ଅନୁସାରେ ଖୋଜନ୍ତୁ...',
    filterUrgencyAll: 'ସମସ୍ତ ବିପଦ ସ୍ତର',
    filterEntitlementsAll: 'ସମସ୍ତ ଆଇନଗତ ଅଧିକାର',
    filterChannelAll: 'ସମସ୍ତ ମାଧ୍ୟମ',
    showingCases: 'ପ୍ରଦର୍ଶିତ ମାମଲା',

    colCaseFir: 'ମାମଲା / ଏଫ୍‌ଆଇଆର୍ ବିବରଣୀ',
    colBeneficiary: 'ଜିଲ୍ଲା ଏବଂ ପୀଡ଼ିତ',
    colStatus: 'ସ୍ଥିତି ଏବଂ ବିପଦ ସ୍ତର',
    colEntitlements: 'ଆଇନଗତ ଅଧିକାର (ଧାରା ୧୫A)',
    colDistressScore: 'ଯନ୍ତ୍ରଣା ସ୍କୋର',
    colNextAction: 'ପରବର୍ତ୍ତୀ ଯୋଗାଯୋଗ',
    colActions: 'ପଦକ୍ଷେପ',

    btnCall: 'କଲ୍ କରନ୍ତୁ',
    btnDossier: 'ତଥ୍ୟ',
    btnSchedule: 'ନିର୍ଦ୍ଧାରଣ',
    btnEdit: 'ସଂଶୋଧନ',
    btnAcknowledge: 'ଗ୍ରହଣ',
    btnAcknowledged: 'ଗୃହୀତ',
    urgentAlert: 'ତୁରନ୍ତ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଆବଶ୍ୟକ',

    statusCoping: 'ସ୍ଥିର ଅଛନ୍ତି (ଭଲ ଅଛନ୍ତି)',
    statusModerate: 'ମଧ୍ୟମ ମାନସିକ ଚାପ',
    statusCritical: 'ଗମ୍ଭୀର ସଙ୍କଟ (ବିପଦ)',
    statusPending: 'ପ୍ରଥମ କଲ୍ ଅପେକ୍ଷାରେ',
    statusOptedOut: 'କଲ୍ ବନ୍ଦ କରାଯାଇଛି',
    statusRescheduled: 'ପୁନଃ ନିର୍ଦ୍ଧାରିତ',

    tierCritical: 'ଗୁରୁତର',
    tierHigh: 'ଉଚ୍ଚ',
    tierModerate: 'ମଧ୍ୟମ',
    tierLow: 'କମ୍',

    needLegal: 'ଆଇନଗତ ସହାୟତା ଓ କୋର୍ଟ ଏସ୍କର୍ଟ',
    needCounseling: 'ମାନସିକ ଆଘାତ ପରାମର୍ଶ',
    needPolice: 'ପୋଲିସ୍ ସାକ୍ଷୀ ସୁରକ୍ଷା',
    needCompensation: 'କ୍ଷତିପୂରଣ ବଣ୍ଟନ',
    needMedical: 'ଚିକିତ୍ସା ସହାୟତା',
    needNone: 'କୌଣସି ଅତିରିକ୍ତ ଆବଶ୍ୟକତା ନାହିଁ',

    district: 'ଜିଲ୍ଲା',
    preferredLanguage: 'ପସନ୍ଦର ଭାଷା',
    lastContact: 'ଶେଷ ଯୋଗାଯୋଗ',
    scheduledOn: 'ନିର୍ଦ୍ଧାରିତ ତାରିଖ',
    daysAgo: 'ଦିନ ପୂର୍ବରୁ',
    daysOverdue: 'ଦିନ ବିଳମ୍ବ',
    today: 'ଆଜି',
    noCasesFound: 'କୌଣସି ମାମଲା ମିଳିଲା ନାହିଁ।',
    confidentialFIR: 'ଗୋପନୀୟ ଏସ୍‌ସି/ଏସ୍‌ଟି ଏଫ୍‌ଆଇଆର୍ ରେକର୍ଡ',
  },
};
