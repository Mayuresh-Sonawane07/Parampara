// =======================================================================
// PARAMPARA AR LITE: Multi-Language & Region-Based Spoken Narration Service
// Supports English, Hindi, and Region-Specific Indigenous Languages:
// - Warli Painting (Maharashtra)  -> Marathi (मराठी)
// - Thathera Craft (Punjab)        -> Punjabi (ਪੰਜਾਬੀ)
// - Toda Embroidery (Tamil Nadu)   -> Tamil (தமிழ்)
// - Chhau Dance (East / Bengal)    -> Bengali (বাংলা)
// =======================================================================

export interface NarrationLanguage {
  code: 'en' | 'hi' | 'mr' | 'pa' | 'ta' | 'bn';
  label: string;
  sublabel: string;
  voiceLang: string;
  listenActionText: string;
  stopActionText: string;
}

export const LANGUAGE_REGISTRY: Record<string, NarrationLanguage> = {
  en: {
    code: 'en',
    label: 'English',
    sublabel: 'English',
    voiceLang: 'en-IN',
    listenActionText: 'Listen',
    stopActionText: 'Stop'
  },
  hi: {
    code: 'hi',
    label: 'हिंदी',
    sublabel: 'Hindi',
    voiceLang: 'hi-IN',
    listenActionText: 'सुनें',
    stopActionText: 'रोकें'
  },
  mr: {
    code: 'mr',
    label: 'मराठी',
    sublabel: 'Marathi (Maharashtra)',
    voiceLang: 'mr-IN',
    listenActionText: 'ऐका',
    stopActionText: 'थांबवा'
  },
  pa: {
    code: 'pa',
    label: 'ਪੰਜਾਬੀ',
    sublabel: 'Punjabi (Punjab)',
    voiceLang: 'pa-IN',
    listenActionText: 'ਸੁਣੋ',
    stopActionText: 'ਰੋਕੋ'
  },
  ta: {
    code: 'ta',
    label: 'தமிழ்',
    sublabel: 'Tamil (Nilgiris)',
    voiceLang: 'ta-IN',
    listenActionText: 'கேளுங்கள்',
    stopActionText: 'நிறுத்து'
  },
  bn: {
    code: 'bn',
    label: 'বাংলা',
    sublabel: 'Bengali (East India)',
    voiceLang: 'bn-IN',
    listenActionText: 'শুনুন',
    stopActionText: 'থামুন'
  }
};

/**
 * Returns available languages for a given tradition:
 * Always includes English and Hindi, plus the regional language of that state/community.
 */
export function getTraditionLanguages(slug: string): NarrationLanguage[] {
  const s = (slug || '').toLowerCase();
  if (s.includes('warli')) {
    return [LANGUAGE_REGISTRY.en, LANGUAGE_REGISTRY.hi, LANGUAGE_REGISTRY.mr];
  }
  if (s.includes('thathera')) {
    return [LANGUAGE_REGISTRY.en, LANGUAGE_REGISTRY.hi, LANGUAGE_REGISTRY.pa];
  }
  if (s.includes('toda')) {
    return [LANGUAGE_REGISTRY.en, LANGUAGE_REGISTRY.hi, LANGUAGE_REGISTRY.ta];
  }
  if (s.includes('chhau')) {
    return [LANGUAGE_REGISTRY.en, LANGUAGE_REGISTRY.hi, LANGUAGE_REGISTRY.bn];
  }
  return [LANGUAGE_REGISTRY.en, LANGUAGE_REGISTRY.hi];
}

// Curated verified translations for cultural motifs and traditions
interface TranslationEntry {
  title: Record<string, string>;
  text: Record<string, string>;
}

export const CULTURAL_TRANSLATIONS: Record<string, TranslationEntry> = {
  // --- WARLI PAINTING (Maharashtra -> Marathi & Hindi) ---
  'flute': {
    title: {
      en: 'The Flute Player (Bansuri Musician)',
      hi: 'बासुरी वादक (पावा वादक)',
      mr: 'बासरी वादक (पावा वादक)'
    },
    text: {
      en: 'The Flute Player. Traditional Warli tribal musician playing the bamboo wind flute, adorned with an auspicious peacock-feather crest. Music in Warli culture is an invocation of seasonal vitality and communal harmony.',
      hi: 'बासुरी वादक। पारंपरिक वारली आदिवासी संगीतकार, जो मोर-पंख से सुसज्जित बांस की पावा बांसुरी बजा रहा है। वारली संस्कृति में संगीत मौसमी उमंग, प्रेम और सामुदायिक सौहार्द का पवित्र प्रतीक है।',
      mr: 'बासरी वादक किंवा पावा वादक. पारंपारिक वारली आदिवासी वादक, जो डोक्यावर मोरपिसाचा तुरा खोचून बांबूची पावा बासरी वाजवत आहे. वारली संस्कृतीत संगीत हे निसर्गाचा उत्सव आणि सामुदायिक सौहार्दाचे प्रतीक मानले जाते.'
    }
  },
  'maiden': {
    title: {
      en: 'The Dancing Maiden (Celebration Partner)',
      hi: 'नृत्य करती युवती (सहचरी)',
      mr: 'नृत्य करणारी तरुणी (सहचरी)'
    },
    text: {
      en: 'The Dancing Maiden. Female celebration partner depicted with two inverted triangles joined at the tip, wearing a traditional draped veil. The two triangles symbolize the cosmic equilibrium of Purusha and Prakriti.',
      hi: 'नृत्य करती युवती। पारंपरिक वारली नृत्यांगना, जिसे दो त्रिकोणों के मिलन से दर्शाया गया है। यह पुरुष और प्रकृति के ब्रह्मांडीय संतुलन, सृजन और जीवन के सतत प्रवाह का प्रतीक है।',
      mr: 'नृत्य करणारी तरुणी. पारंपारिक वारली नर्तकी, जिच्या शरीराची रचना दोन उलट-सुलट त्रिकोणांनी केली आहे. हे दोन त्रिकोण पुरुष आणि प्रकृती यांच्यातील वैश्विक संतुलनाचे आणि सृजनाचे प्रतीक आहेत.'
    }
  },
  'tree': {
    title: {
      en: 'The Sacred Tree of Life (Devrai Canopy)',
      hi: 'पवित्र जीवन वृक्ष (देवराई)',
      mr: 'पवित्र जीवन वृक्ष आणि देवराई'
    },
    text: {
      en: 'The Sacred Tree of Life. Sprawling arboreal canopy of the sacred Mahua or Banyan tree sheltering forest birds and peacocks. Warli communities protect sacred forest groves called Devrai and revere nature as kin.',
      hi: 'पवित्र जीवन वृक्ष। महुआ या बरगद के विशाल वृक्ष की शाखाएं, जिन पर पक्षी और मोर आश्रय लेते हैं। वारली समुदाय देवराई के पवित्र वनों की रक्षा करता है और प्रकृति को सजीव देवता मानकर पूजता है।',
      mr: 'पवित्र जीवन वृक्ष आणि देवराई. महुआ आणि वटवृक्षाचा विस्तीर्ण विस्तार, ज्यावर पक्षी आणि मोर विसावले आहेत. वारली आदिवासी समाज देवराईच्या पवित्र वनांचे जतन करतो आणि झाडांना सजीव देवता मानतो.'
    }
  },
  'sun': {
    title: {
      en: 'The Radiant Sun God (Hirva / Surya Dev)',
      hi: 'तेजस्वी सूर्य देव (हिरवा)',
      mr: 'तेजस्वी सूर्य देव (हिरवा)'
    },
    text: {
      en: 'The Radiant Sun God. Concentric solar disk with dynamic triangular light rays illuminating the cosmic tree. The sun represents diurnal time, photosynthesis for monsoon crops, and the divine witness to rituals.',
      hi: 'तेजस्वी सूर्य देव। किरणें बिखेरता सूर्य चक्र, जो फसलों को जीवन ऊर्जा और समय का चक्र प्रदान करता है। आदिवासी परंपरा में सूर्य समस्त सामाजिक रीतियों और शुभ कार्यों का साक्षात साक्षी है।',
      mr: 'तेजस्वी सूर्य देव किंवा हिरवा. वैश्विक ऊर्जा देणारे तेजोमय सूर्य चक्र, जे पावसाळी पिकांना चैतन्य देते. वारली परंपरेत सूर्य हा सर्व शुभ कार्यांचा आणि निसर्गचक्राचा साक्षात साक्षीदार आहे.'
    }
  },
  'fauna': {
    title: {
      en: 'Sacred Forest Fauna (Peacocks & Cattle)',
      hi: 'पवित्र वन पशु-पक्षी (मोर और गाय)',
      mr: 'पवित्र वन प्राणी (मोर आणि गोधन)'
    },
    text: {
      en: 'Sacred Forest Fauna. Stylized peacocks and cattle depicted beneath the dancers. Peacocks are revered as heralds of monsoon rains, while cattle reflect agrarian companionship and shared labor.',
      hi: 'पवित्र वन पशु-पक्षी। नीचे विश्राम करती गायें और मोर, जो पर्यावरण के साथ सह-अस्तित्व दर्शाते हैं। मोर वर्षा के आगमन के दूत हैं और गोवंश ग्रामीण आजीविका का अभिन्न अंग है।',
      mr: 'पवित्र वन प्राणी आणि मोर. वृक्षाखाली विसावलेले मोर आणि गोधन. मोर हा पावसाच्या आगमनाचा संदेश देतो, तर गाय आणि बैल हे आदिवासी शेती आणि सहजीवनाचे आधारस्तंभ आहेत.'
    }
  },
  'border': {
    title: {
      en: 'Sacred Chevron Border (Patti / Toran)',
      hi: 'पवित्र त्रिकोणीय पट्टी (तोरण)',
      mr: 'पवित्र त्रिकोणी पट्टी (तोरण)'
    },
    text: {
      en: 'Sacred Chevron Border. Continuous repeating triangular chevron borders framing the sacred canvas. Known as Patti, this border consecrates the painting and protects the inner narrative from negative influences.',
      hi: 'पवित्र त्रिकोणीय पट्टी। संपूर्ण चित्र को घेरने वाली सुरक्षात्मक त्रिकोणीय सीमा। यह पवित्र चित्र की मर्यादा बनाए रखती है और सकारात्मक ऊर्जा को सुरक्षित रखती है।',
      mr: 'पवित्र त्रिकोणी पट्टी किंवा तोरण. चित्राच्या चारही बाजूंना असणारी पारंपारिक त्रिकोणी चौकट. ही पट्टी चित्रातील मांगल्याचे रक्षण करते आणि अनिष्ट शक्तींना आत येण्यापासून रोखते.'
    }
  },
  'tarpa': {
    title: {
      en: 'The Tarpa Spiral Dance',
      hi: 'तारपा वर्तुळाकार नृत्य',
      mr: 'तारपा वर्तुळाकार नृत्य'
    },
    text: {
      en: 'The Tarpa Spiral Dance. Men and women entwine arms, dancing in an ever-widening spiral around the central player of the Tarpa wind instrument, symbolizing cyclic rhythms of nature without beginning or end.',
      hi: 'तारपा नृत्य। पुरुष और महिलाएं हाथ पकड़कर तारपा वाद्य के चारों ओर गोल घेरे में नाचते हैं, जो प्रकृति के अखंड चक्र का प्रतीक है।',
      mr: 'तारपा वर्तुळाकार नृत्य. स्त्री आणि पुरुष एकमेकांचे हात धरून तारपा वाद्याच्या तालावर फेर धरतात. हे वर्तुळ निसर्गाच्या अखंड जीवनचक्राचे प्रतीक आहे.'
    }
  },
  'palaghata': {
    title: {
      en: 'Mother Goddess Palaghata & Sacred Chauk',
      hi: 'देवी पालाघाटा और पवित्र चौकट',
      mr: 'देवी पालाघाटा आणि लग्न चौक'
    },
    text: {
      en: 'Mother Goddess Palaghata. Inside the sacred square wedding chauk sits Palaghata, the goddess of corn and fertility, invoked by Suhasini women during wedding consecration.',
      hi: 'देवी पालाघाटा। अन्न और उर्वरता की देवी, जिन्हें विवाह के पवित्र चौकट में सुहासिनी स्त्रियों द्वारा चित्रित किया जाता है।',
      mr: 'देवी पालाघाटा आणि लग्न चौक. धान्य आणि समृद्धीची आराध्य देवता. विवाहात सुवासिनी स्त्रिया पालाघाटा चौकाची विधीपूर्वक निर्मिती करतात.'
    }
  },

  // --- THATHERA METAL CRAFT (Punjab -> Punjabi & Hindi) ---
  'thathera_general': {
    title: {
      en: 'Thathera Metal Craft of Jandiala Guru',
      hi: 'जंडियाला गुरु का ठठेरा धातु शिल्प',
      pa: 'ਜੰਡਿਆਲਾ ਗੁਰੂ ਦਾ ਠਠੇਰਾ ਧਾਤੂ ਸ਼ਿਲਪ'
    },
    text: {
      en: 'Thathera Metal Craft of Jandiala Guru, Punjab. Inscribed by UNESCO in 2014, this master craft transforms copper and brass sheets into structurally strengthened, hand-dimpled utensils using traditional hammers, charcoal kilns, and tamarind polish.',
      hi: 'पंजाब के जंडियाला गुरु का ठठेरा धातु शिल्प। यूनेस्को द्वारा संरक्षित यह पारंपरिक कला तांबे और पीतल की चादरों को हाथ से हथौड़े, कोयले की भट्टी और इमली के पानी से तराश कर मजबूत बर्तन बनाती है।',
      pa: 'ਪੰਜਾਬ ਦੇ ਜੰਡਿਆਲਾ ਗੁਰੂ ਦਾ ਰਵਾਇਤੀ ਠਠੇਰਾ ਧਾਤੂ ਸ਼ਿਲਪ। ਯੂਨੈਸਕੋ ਵੱਲੋਂ ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਇਹ ਕਲਾ ਤਾਂਬੇ ਅਤੇ ਪਿੱਤਲ ਨੂੰ ਹੱਥੀਂ ਕੁੱਟ ਕੇ ਅਤੇ ਇਮਲੀ ਨਾਲ ਪਾਲਿਸ਼ ਕਰਕੇ ਮਜ਼ਬੂਤ ਭਾਂਡੇ ਤਿਆਰ ਕਰਦੀ ਹੈ।'
    }
  },

  // --- TODA EMBROIDERY (Tamil Nadu -> Tamil & Hindi) ---
  'toda_general': {
    title: {
      en: 'Toda Embroidery (Pukhoor) of the Nilgiris',
      hi: 'नीलगिरि की तोडा कढ़ाई (पुखूर)',
      ta: 'நீலகிரியின் தோடர் பூத்தையல் (பூக்கூர்)'
    },
    text: {
      en: 'Toda Embroidery, known as Pukhoor, is a GI-protected counted-thread craft handcrafted exclusively by Toda women in the Nilgiri Hills of Tamil Nadu, using red and black woollen yarn on unbleached coarse cotton.',
      hi: 'नीलगिरि हिल्स, तमिलनाडु की तोडा जनजाति का पुखूर कशीदाकारी शिल्प। तोडा महिलाएं बिना किसी खाके के धागों की सटीक गिनती करके लाल और काले ऊन से वस्त्रों पर पवित्र ज्यामितीय पैटर्न बनाती हैं।',
      ta: 'தமிழ்நாட்டின் நீலகிரி மலையில் வாழும் தோடர் பழங்குடிப் பெண்களால் உருவாக்கப்படும் பாரம்பர்ய பூக்கூர் தையற்கலை. வெள்ளை பருத்தி துணியில் சிவப்பு மற்றும் கருப்பு கம்பளி நூலால் எண்ணி தைக்கப்படும் கலை இது.'
    }
  },

  // --- CHHAU DANCE (East India -> Bengali & Hindi) ---
  'chhau_general': {
    title: {
      en: 'Chhau Dance Traditions of Eastern India',
      hi: 'पूर्वी भारत की छाऊ नृत्य परंपरा',
      bn: 'পূর্ব ভারতের ঐতিহ্যবাহী ছৌ নৃত্য'
    },
    text: {
      en: 'Chhau Dance of Eastern India, inscribed by UNESCO. A powerful martial and folkloric dance celebrated across Seraikella in Jharkhand, Purulia in West Bengal, and Mayurbhanj in Odisha with high-energy drumming and theatrical masks.',
      hi: 'पूर्वी भारत का छाऊ नृत्य। यूनेस्को विश्व धरोहर सूची में शामिल यह युद्ध-कला नृत्य सरायकेला, पुरुलिया और मयूरभंज में मुखौटों, ढोल और नगाड़ों की गूंज के साथ प्रस्तुत किया जाता है।',
      bn: 'পূর্ব ভারতের ইউনেস্কো স্বীকৃত ঐতিহ্যবাহী ছৌ নৃত্য। ঝাড়খণ্ডের সরাইকেল্লা, পশ্চিমবঙ্গের পুরুলিয়া এবং ওড়িশার ময়ূরভঞ্জে প্রচলিত মুখোশ এবং বীররসাত্মক মার্শাল নৃত্যশৈলী।'
    }
  }
};

/**
 * Returns translated narration text based on motif key, tradition slug, and chosen language.
 */
export function getNarrationContent({
  motifKey,
  traditionSlug,
  languageCode,
  fallbackTitle,
  fallbackText
}: {
  motifKey?: string;
  traditionSlug?: string;
  languageCode: string;
  fallbackTitle: string;
  fallbackText: string;
}): { title: string; text: string } {
  // Resolve key from motif title or key string
  const normalized = (motifKey || fallbackTitle || '').toLowerCase();
  let entryKey = '';

  if (normalized.includes('flute') || normalized.includes('bansuri') || normalized.includes('pawa')) entryKey = 'flute';
  else if (normalized.includes('maiden') || normalized.includes('partner')) entryKey = 'maiden';
  else if (normalized.includes('tree') || normalized.includes('devrai')) entryKey = 'tree';
  else if (normalized.includes('sun') || normalized.includes('surya') || normalized.includes('hirva')) entryKey = 'sun';
  else if (normalized.includes('fauna') || normalized.includes('peacock') || normalized.includes('cattle') || normalized.includes('mor')) entryKey = 'fauna';
  else if (normalized.includes('border') || normalized.includes('patti') || normalized.includes('toran')) entryKey = 'border';
  else if (normalized.includes('tarpa')) entryKey = 'tarpa';
  else if (normalized.includes('palaghata') || normalized.includes('chauk')) entryKey = 'palaghata';
  else if (traditionSlug?.includes('thathera')) entryKey = 'thathera_general';
  else if (traditionSlug?.includes('toda')) entryKey = 'toda_general';
  else if (traditionSlug?.includes('chhau')) entryKey = 'chhau_general';

  const entry = CULTURAL_TRANSLATIONS[entryKey];
  if (entry) {
    const title = entry.title[languageCode] || entry.title.en || fallbackTitle;
    const text = entry.text[languageCode] || entry.text.en || fallbackText;
    return { title, text };
  }

  return { title: fallbackTitle, text: fallbackText };
}

// Module-level audio element reference
let activeAudio: HTMLAudioElement | null = null;

export interface SpeakCulturalNarrationOptions {
  text: string;
  voiceLang?: string;
  langCode?: 'en' | 'hi' | 'mr' | 'pa' | 'ta' | 'bn' | string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
}

/**
 * Plays authentic spoken narration for Indian cultural heritage.
 * Primary engine: High-fidelity audio stream from backend TTS proxy (/api/narration/audio)
 * which provides authentic regional native pronunciation for Marathi, Punjabi, Tamil, Bengali, Hindi & English.
 * Fallback: Browser window.speechSynthesis (if backend audio stream fails or is offline).
 */
export function speakCulturalNarration({
  text,
  voiceLang = 'en-IN',
  langCode,
  onStart,
  onEnd,
  onError
}: SpeakCulturalNarrationOptions) {
  stopCulturalNarration();

  const trimmedText = (text || '').trim();
  if (!trimmedText) {
    onError?.(new Error('No text to narrate'));
    return;
  }

  // Determine target language code
  let targetLang = (langCode || '').toLowerCase();
  if (!targetLang && voiceLang) {
    targetLang = voiceLang.split('-')[0].toLowerCase();
  }
  const validLangs = ['en', 'hi', 'mr', 'pa', 'ta', 'bn'];
  if (!validLangs.includes(targetLang)) {
    targetLang = 'en';
  }

  const rawEnv = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
  const apiPrefix = rawEnv.endsWith('/api') ? rawEnv.slice(0, -4) : rawEnv;
  const audioUrl = `${apiPrefix}/api/narration/audio?text=${encodeURIComponent(trimmedText)}&lang=${targetLang}`;
  const audio = new Audio(audioUrl);
  activeAudio = audio;

  let hasStarted = false;

  audio.onplay = () => {
    if (activeAudio === audio && !hasStarted) {
      hasStarted = true;
      onStart?.();
    }
  };

  audio.onended = () => {
    if (activeAudio === audio) {
      activeAudio = null;
      onEnd?.();
    }
  };

  audio.onerror = (e) => {
    console.warn(`Audio stream failed for lang '${targetLang}'. Falling back to SpeechSynthesis:`, e);
    if (activeAudio === audio) {
      activeAudio = null;
      fallbackSpeechSynthesis({
        text: trimmedText,
        voiceLang,
        onStart: () => {
          if (!hasStarted) {
            hasStarted = true;
            onStart?.();
          }
        },
        onEnd,
        onError
      });
    }
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Audio.play() error or policy restriction. Attempting SpeechSynthesis fallback:', err);
      if (activeAudio === audio) {
        activeAudio = null;
        fallbackSpeechSynthesis({
          text: trimmedText,
          voiceLang,
          onStart: () => {
            if (!hasStarted) {
              hasStarted = true;
              onStart?.();
            }
          },
          onEnd,
          onError
        });
      }
    });
  }
}

function fallbackSpeechSynthesis({
  text,
  voiceLang = 'en-IN',
  onStart,
  onEnd,
  onError
}: {
  text: string;
  voiceLang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not available.');
    onError?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 0.93;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = voiceLang.split('-')[0].toLowerCase();
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase() === voiceLang.toLowerCase() || v.lang.toLowerCase().startsWith(langPrefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      console.warn('Fallback SpeechSynthesis error:', e);
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis execution failed:', err);
    onError?.(err);
  }
}

export function stopCulturalNarration() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.removeAttribute('src');
      activeAudio.load();
    } catch (e) {
      console.warn('Error clearing audio:', e);
    }
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

