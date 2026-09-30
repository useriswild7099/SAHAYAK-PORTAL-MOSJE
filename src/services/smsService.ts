import {
  CheckInRecord,
  LanguageCode,
  SelfReportedStatus,
  SMSMessage,
  SupportNeedType,
} from '../types/ivr';
import { storageService } from './storageService';
import { therapyModelService } from './therapyModelService';

const SMS_STORAGE_KEY = 'mosje_sms_messages_v1';

export const MULTILINGUAL_SMS_TEMPLATES: Record<
  LanguageCode,
  {
    outboundCheckIn: string;
    acknowledgementCoping: string;
    acknowledgementUrgent: string;
    acknowledgementPaused: string;
  }
> = {
  hi: {
    outboundCheckIn:
      'MoSJE Sahayak: जिला पीड़ित कल्याण प्रकोष्ठ फॉलो-अप। इस सप्ताह आप कैसा महसूस कर रहे हैं? उत्तर दें: 1 (सामान्य/ठीक), 2 (तनाव/कठिनाई), 3 (आपातकालीन संकट)। सहायता के लिए लिखें: NEED1 (विधिक/कोर्ट एस्कॉर्ट), NEED2 (काउंसलिंग), NEED3 (पुलिस सुरक्षा), NEED4 (मुआवजा राशि)। रोकने हेतु STOP भेजें।',
    acknowledgementCoping:
      'MoSJE Sahayak: आपकी प्रतिक्रिया दर्ज कर ली गई है। नियमित संपर्क बना रहेगा। हेल्पलाइन: 1800-11-2026।',
    acknowledgementUrgent:
      'MoSJE Sahayak: आपका सहायता अनुरोध जिला कल्याण अधिकारी को प्राथमिकता पर भेज दिया गया है। तत्काल पुलिस हेतु 112 डायल करें।',
    acknowledgementPaused:
      'MoSJE Sahayak: आपकी इच्छा अनुसार चेक-इन रोक दिए गए हैं। पुनः शुरू करने हेतु START लिखकर भेजें।',
  },
  en: {
    outboundCheckIn:
      'MoSJE Sahayak: District Victim Welfare Cell follow-up. How are you feeling this week? Reply: 1 (Coping well), 2 (Distress/Difficulties), 3 (Urgent crisis). For assistance reply: NEED1 (Legal/Escort), NEED2 (Counselling), NEED3 (Police protection), NEED4 (Compensation). Reply STOP to pause.',
    acknowledgementCoping:
      'MoSJE Sahayak: Your status has been registered. Regular follow-up will continue. Helpline: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: Priority alert sent to your District Welfare Officer regarding your request. For immediate police emergency dial 112.',
    acknowledgementPaused:
      'MoSJE Sahayak: Automated check-in SMS paused as requested. Reply START anytime to resume.',
  },
  bn: {
    outboundCheckIn:
      'MoSJE Sahayak: জেলা ভিকটিম ওয়েলফেয়ার সেল ফলো-আপ। আপনি কেমন আছেন? উত্তর দিন: ১ (স্বাভাবিক), ২ (উদ্বেগ/কষ্ট), ৩ (জরুরি সংকট)। সাহায্যের জন্য লিখুন: NEED1 (আইনি সাহায্য), NEED2 (কাউন্সেলিং), NEED3 (পুলিশ সুরক্ষা), NEED4 (ক্ষতিপূরণ)। থামাতে STOP লিখুন।',
    acknowledgementCoping:
      'MoSJE Sahayak: আপনার উত্তর রেকর্ড করা হয়েছে। হেল্পলাইন: 1800-11-2026।',
    acknowledgementUrgent:
      'MoSJE Sahayak: আপনার অনুরোধটি জেলা কল্যাণ কর্মকর্তার কাছে জরুরি ভিত্তিতে পাঠানো হয়েছে। জরুরি প্রয়োজনে 112 ডায়াল করুন।',
    acknowledgementPaused:
      'MoSJE Sahayak: আপনার অনুরোধে এসএমএস পরিষেবা বন্ধ করা হয়েছে।',
  },
  ta: {
    outboundCheckIn:
      'MoSJE Sahayak: மாவட்ட பாதிக்கப்பட்டோர் நலப்பிரிவு தொடர்பு. எப்படி உணர்கிறீர்கள்? பதில் அனுப்பவும்: 1 (நலம்), 2 (சிரமம்), 3 (அவசர உதவி). தேவைக்கு: NEED1 (சட்ட உதவி), NEED2 (மனநலம்), NEED3 (காவல் பாதுகாப்பு), NEED4 (நிவாரண நிதி). நிறுத்த STOP அனுப்பவும்.',
    acknowledgementCoping:
      'MoSJE Sahayak: உங்கள் பதிவு ஏற்கப்பட்டது. உதவி எண்: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: உங்கள் அவசர உதவி கோரிக்கை மாவட்ட அதிகாரியிடம் சேர்க்கப்பட்டது. அவசர காவல் உதவிக்கு 112 ஐ அழைக்கவும்.',
    acknowledgementPaused:
      'MoSJE Sahayak: உங்கள் விருப்பப்படி குறுஞ்செய்தி தொடர்பு இடைநிறுத்தப்பட்டுள்ளது.',
  },
  te: {
    outboundCheckIn:
      'MoSJE Sahayak: జిల్లా బాధితుల సంక్షేమ విభాగం ఫాలో-అప్. ఎలా ఉన్నారు? సమాధానం ఇవ్వండి: 1 (బాగున్నాను), 2 (ఒత్తిడి/ఇబ్బంది), 3 (అత్యవసరం). సహాయం కోసం: NEED1 (న్యాయ సహాయం), NEED2 (కౌన్సెలింగ్), NEED3 (పోలీసు రక్షణ), NEED4 (పరిహారం). ఆపడానికి STOP పంపండి.',
    acknowledgementCoping:
      'MoSJE Sahayak: మీ వివరాలు నమోదయ్యాయి. హెల్ప్‌లైన్: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: మీ అత్యవసర అభ్యర్థన జిల్లా అధికారికి పంపబడింది. తక్షణ పోలీసు సహాయం కోసం 112 కు కాల్ చేయండి.',
    acknowledgementPaused:
      'MoSJE Sahayak: మీ కోరిక మేరకు ఎస్ఎంఎస్ ఫాలో-అప్ నిలిపివేయబడింది.',
  },
  mr: {
    outboundCheckIn:
      'MoSJE Sahayak: जिल्हा पीडित कल्याण कक्ष पाठपुरावा. आपण कसे आहात? उत्तर द्या: 1 (ठीक आहे), 2 (ताण/अडचण), 3 (तातडीचे संकट). मदतीसाठी: NEED1 (कायदेशीर मदत), NEED2 (समुपदेशन), NEED3 (पोलीस संरक्षण), NEED4 (नुकसानभरपाई). थांबवण्यासाठी STOP पाठवा.',
    acknowledgementCoping:
      'MoSJE Sahayak: आपला प्रतिसाद नोंदवला गेला आहे. हेल्पलाइन: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: आपली तातडीची विनंती जिल्हा कल्याण अधिकाऱ्यांकडे पाठवण्यात आली आहे.',
    acknowledgementPaused:
      'MoSJE Sahayak: आपल्या विनंतीनुसार एसएमएस सेवा तात्पुरती थांबवली आहे.',
  },
  kn: {
    outboundCheckIn:
      'MoSJE Sahayak: ಜಿಲ್ಲಾ ಸಂತ್ರಸ್ತರ ಕಲ್ಯಾಣ ಕೋಶ. ನೀವು ಹೇಗಿದ್ದೀರಿ? ಉತ್ತರಿಸಿ: 1 (ಆರಾಮವಾಗಿದ್ದೇನೆ), 2 (ಒತ್ತಡ/ತೊಂದರೆ), 3 (ತುರ್ತು ಬಿಕ್ಕಟ್ಟು). ನೆರವಿಗಾಗಿ: NEED1 (ಕಾನೂನು ನೆರವು), NEED2 (ಸಮಾಲೋಚನೆ), NEED3 (ಪೊಲೀಸ್ ಭದ್ರತೆ), NEED4 (ಪರಿಹಾರ). ನಿಲ್ಲಿಸಲು STOP ಕಳುಹಿಸಿ.',
    acknowledgementCoping:
      'MoSJE Sahayak: ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಾಗಿದೆ. ಸಹಾಯವಾಣಿ: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: ನಿಮ್ಮ ತುರ್ತು ನೆರವಿನ ಕೋರಿಕೆಯನ್ನು ಜಿಲ್ಲಾ ಅಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
    acknowledgementPaused:
      'MoSJE Sahayak: ನಿಮ್ಮ ಆದ್ಯತೆಯಂತೆ ಸಂದೇಶಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ.',
  },
  gu: {
    outboundCheckIn:
      'MoSJE Sahayak: જિલ્લા પીડિત કલ્યાણ સેલ ફોલો-અપ. તમે કેવું અનુભવો છો? જવાબ આપો: 1 (સારું છે), 2 (તણાવ/મુશ્કેલી), 3 (કટોકટી). મદદ માટે: NEED1 (કાનૂની સહાય), NEED2 (કાઉન્સેલિંગ), NEED3 (પોલીસ રક્ષણ), NEED4 (વળતર). બંધ કરવા STOP મોકલો.',
    acknowledgementCoping:
      'MoSJE Sahayak: તમારો જવાબ નોંધાઈ ગયો છે. હેલ્પલાઇન: 1800-11-2026.',
    acknowledgementUrgent:
      'MoSJE Sahayak: તમારી સહાય વિનંતી જિલ્લા અધિકારીને તાત્કાલિક મોકલી દેવામાં આવી છે.',
    acknowledgementPaused:
      'MoSJE Sahayak: આપની પસંદગી મુજબ એસએમએસ સેવા રોકી દેવામાં આવી છે.',
  },
  or: {
    outboundCheckIn:
      'MoSJE Sahayak: ଜିଲ୍ଲା ପୀଡ଼ିତ କଲ୍ୟାଣ ପ୍ରକୋଷ୍ଠ। କିପରି ଅନୁଭବ କରୁଛନ୍ତି? ଉତ୍ତର ଦିଅନ୍ତୁ: 1 (ଠିକ୍ ଅଛି), 2 (ଚାପ/ଅସୁବିଧା), 3 (ଜରୁରୀ ସଙ୍କଟ)। ସହାୟତା ପାଇଁ: NEED1 (ଆଇନଗତ ସହାୟତା), NEED2 (ପରାମର୍ଶ), NEED3 (ପୋଲିସ ସୁରକ୍ଷା), NEED4 (କ୍ଷତିପୂରଣ)। ବନ୍ଦ ପାଇଁ STOP ପଠାନ୍ତୁ।',
    acknowledgementCoping:
      'MoSJE Sahayak: ଆପଣଙ୍କ ପ୍ରତିକ୍ରିୟା ପଞ୍ଜୀକୃତ ହୋଇଛି। ହେଲ୍ପଲାଇନ: 1800-11-2026।',
    acknowledgementUrgent:
      'MoSJE Sahayak: ଆପଣଙ୍କ ଜରୁରୀ ସହାୟତା ଅନୁରୋଧ ଜିଲ୍ଲା କଲ୍ୟାଣ ଅଧିକାରୀଙ୍କୁ ପଠାଯାଇଛି।',
    acknowledgementPaused:
      'MoSJE Sahayak: ଆପଣଙ୍କ ନିଷ୍ପତ୍ତି ଅନୁସାରେ ଏସଏମଏସ ସେବା ବନ୍ଦ କରାଯାଇଛି।',
  },
};

class SMSService {
  private messages: SMSMessage[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SMS_STORAGE_KEY);
      if (stored) {
        this.messages = JSON.parse(stored);
      } else {
        this.seedInitialMessages();
      }
    } catch {
      this.seedInitialMessages();
    }
  }

  private seedInitialMessages(): void {
    this.messages = [
      {
        id: 'sms-init-001',
        caseId: 'CASE-2026-ALW-019',
        direction: 'OUTBOUND',
        text: MULTILINGUAL_SMS_TEMPLATES.hi.outboundCheckIn,
        timestamp: '2026-08-31T09:30:00.000Z',
        status: 'delivered',
      },
      {
        id: 'sms-init-002',
        caseId: 'CASE-2026-ALW-019',
        direction: 'INBOUND',
        text: '3 NEED3 रात को कुछ लोग घर के चक्कर लगा रहे हैं, गवाही से पहले डर लग रहा है।',
        timestamp: '2026-08-31T09:35:12.000Z',
        status: 'received',
      },
      {
        id: 'sms-init-003',
        caseId: 'CASE-2026-ALW-019',
        direction: 'OUTBOUND',
        text: MULTILINGUAL_SMS_TEMPLATES.hi.acknowledgementUrgent,
        timestamp: '2026-08-31T09:35:18.000Z',
        status: 'delivered',
      },
    ];
    this.save();
  }

  private save(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(this.messages));
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

  public getMessagesForCase(caseId: string): SMSMessage[] {
    return this.messages
      .filter((m) => m.caseId === caseId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Send an automated outbound check-in SMS to a beneficiary's feature phone
   */
  public sendOutboundCheckInSMS(caseId: string, lang: LanguageCode = 'hi'): SMSMessage {
    const template = MULTILINGUAL_SMS_TEMPLATES[lang] || MULTILINGUAL_SMS_TEMPLATES.en;
    const outboundMsg: SMSMessage = {
      id: 'sms-out-' + Math.random().toString(36).substring(2, 9),
      caseId,
      direction: 'OUTBOUND',
      text: template.outboundCheckIn,
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };

    this.messages.push(outboundMsg);
    this.save();
    return outboundMsg;
  }

  public sendScheduledOutboundSMS(caseId: string, lang: LanguageCode = 'hi'): SMSMessage {
    return this.sendOutboundCheckInSMS(caseId, lang);
  }

  /**
   * Process an inbound SMS sent by the victim from their feature phone
   */
  public receiveInboundSMS(caseId: string, rawText: string, lang: LanguageCode = 'hi'): {
    inboundMsg: SMSMessage;
    replyMsg: SMSMessage;
    checkInRecord: CheckInRecord;
  } {
    const text = rawText.trim();
    const upperText = text.toUpperCase();

    const inboundMsg: SMSMessage = {
      id: 'sms-in-' + Math.random().toString(36).substring(2, 9),
      caseId,
      direction: 'INBOUND',
      text,
      timestamp: new Date().toISOString(),
      status: 'received',
    };
    this.messages.push(inboundMsg);

    // Parse status and needs from SMS text
    let status: SelfReportedStatus = 'coping_well';
    const needs: SupportNeedType[] = [];

    // Parse status
    if (upperText.includes('3') || upperText.includes('CRISIS') || upperText.includes('HELP') || upperText.includes('URGENT') || upperText.includes('संकट') || upperText.includes('खतरा')) {
      status = 'critical_crisis';
    } else if (upperText.includes('2') || upperText.includes('STRESS') || upperText.includes('तनाव') || upperText.includes('डर') || upperText.includes('कठिनाई')) {
      status = 'moderate_distress';
    } else if (upperText.includes('1') || upperText.includes('FINE') || upperText.includes('सामान्य') || upperText.includes('ठीक')) {
      status = 'coping_well';
    }

    // Parse specific needs keywords
    if (upperText.includes('NEED1') || upperText.includes('LEGAL') || upperText.includes('COURT') || upperText.includes('वकील') || upperText.includes('एस्कॉर्ट')) {
      needs.push('legal_aid_escort');
    }
    if (upperText.includes('NEED2') || upperText.includes('COUNSEL') || upperText.includes('THERAPY') || upperText.includes('काउंसलिंग') || upperText.includes('मनोवैज्ञानिक')) {
      needs.push('trauma_counselling');
    }
    if (upperText.includes('NEED3') || upperText.includes('POLICE') || upperText.includes('SECURITY') || upperText.includes('सुरक्षा') || upperText.includes('धमकी') || upperText.includes('गवाह')) {
      needs.push('police_witness_security');
    }
    if (upperText.includes('NEED4') || upperText.includes('COMPENSATION') || upperText.includes('MONEY') || upperText.includes('राहत') || upperText.includes('मुआवजा') || upperText.includes('15A') || upperText.includes('किस्त')) {
      needs.push('compensation_disbursement');
    }

    // Check opt out keyword
    const isStop = upperText.startsWith('STOP') || upperText.includes('ROKO') || upperText.includes('बंद');
    const template = MULTILINGUAL_SMS_TEMPLATES[lang] || MULTILINGUAL_SMS_TEMPLATES.en;

    let replyText = template.acknowledgementCoping;
    if (isStop) {
      replyText = template.acknowledgementPaused;
      storageService.updateCaseConsent(caseId, 'paused');
    } else if (status === 'critical_crisis' || needs.includes('police_witness_security')) {
      replyText = template.acknowledgementUrgent;
    }

    // Create automated outbound acknowledgement SMS
    const replyMsg: SMSMessage = {
      id: 'sms-out-' + Math.random().toString(36).substring(2, 9),
      caseId,
      direction: 'OUTBOUND',
      text: replyText,
      timestamp: new Date(Date.now() + 1500).toISOString(),
      status: 'delivered',
    };
    this.messages.push(replyMsg);
    this.save();

    // Register check in record to storageService
    const checkInRecord: CheckInRecord = {
      id: 'chk-sms-' + Math.random().toString(36).substring(2, 9),
      caseId,
      timestamp: new Date().toISOString(),
      language: lang,
      callDurationSeconds: 0,
      consentGiven: !isStop,
      status: isStop ? null : status,
      needs: needs.length > 0 ? needs : (status === 'coping_well' ? ['none_required'] : []),
      voiceNoteTranscript: text,
      channel: 'FEATURE_PHONE_SMS',
      outcome: isStop ? 'opted_out' : 'completed',
      caseworkerAcknowledged: false,
    };

    storageService.addCheckInRecord(checkInRecord);

    // Run therapy model inference on updated SMS conversation corpus in background
    setTimeout(async () => {
      try {
        await therapyModelService.scoreCase(caseId);
      } catch (err) {
        console.warn('Therapy model scoring on inbound SMS failed:', err);
      }
    }, 100);

    return { inboundMsg, replyMsg, checkInRecord };
  }
}

export const smsService = new SMSService();
