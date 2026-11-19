import { DialectEntry } from '../types';

/**
 * Egyptian (Cairene) entries, voiced by Mario.
 *
 * Wording was drafted from Whisper transcripts of the recordings themselves,
 * so the text matches what is actually said — it has NOT yet been checked by a
 * native speaker. Phrases Mario localised (Pyramids for Rainbow Street, Egyptian
 * pounds for JD) or whose take was unclear are left out and fall back to MSA.
 *
 * Audio: /audio/eg/mario/<phraseNum>.mp3, built by scripts/build-audio.mjs from
 * the take listed in scripts/audio-sources.json.
 */
const EG: Record<number, [arabic: string, transliteration: string]> = {
  1: ['مرحبا', 'marhaba'],
  2: ['إزيك؟ عامل إيه؟', "izzayyak? 'aamil eih?"],
  4: ['اسمي ___', 'ismi ___'],
  6: ['أنا من مصر', 'ana min masr'],
  7: ['أنا بتكلم عربي شوية شوية', "ana batkallim 'arabi shwayya shwayya"],
  8: ['أنا بتكلم بالفصحى', 'ana batkallim bil-fusha'],
  9: ['أنا بدرس اللغة العربية', "ana badris il-lugha il-'arabiyya"],
  10: ['إنت بتدرس إيه؟', 'inta btidris eih?'],
  11: ['إنت بتشتغل فين؟', 'inta btishtaghal fein?'],
  12: ['إنت بتحب ده؟', 'inta bitHibb da?'],
  13: ['لا، أنا مش بحب ___', 'la, ana mish baHibb ___'],
  14: ['عجبني جدًا', "'agabni giddan"],
  16: ['نعم', "na'am"],
  17: ['لا', 'la'],
  22: ['إنت ساكن فين؟', 'inta saakin fein?'],
  23: ['أنا ساكن قريب من هنا', "ana saakin 'urayyib min hina"],
  24: ['أنا بدرس اللغة العربية في جامعة القاهرة', "ana badris il-lugha il-'arabiyya fi gam'it il-qahira"],
  25: ['شكرًا', 'shukran'],
  28: ['من فضلك', 'min fadlak'],
  29: ['أنا آسف', 'ana aasif'],
  30: ['إنت بتقول إيه؟', "inta bit'uul eih?"],
  85: ['تاكسي', 'taksi'],
  86: ['ممكن تاخدني للمكان ده؟', 'mumkin taakhudni lil-makaan da?'],
  88: ['المتحف', 'il-mathaf'],
  89: ['للقلعة', "lil-'al'a"],
  90: ['المسجد', 'il-masgid'],
  91: ['المكان ده', 'il-makaan da'],
  93: ['أنا عندي المكان على الخريطة', "ana 'andi il-makaan 'ala il-khariita"],
  95: ['من فضلك', 'min fadlak'],
  96: ['شكرًا قوي', "shukran 'awi"],
  97: ['ممكن توقف هنا من فضلك', "mumkin tiwa'af hina min fadlak"],
  98: ['خش يمين', 'khushsh yimiin'],
  99: ['خش شمال', 'khushsh shimaal'],
  100: ['على طول', "'ala tuul"],
  101: ['ممكن تديني الباقي من فضلك', "mumkin tiddiini il-baa'i min fadlak"],
  102: ['ممكن تشغل العداد من فضلك', "mumkin tishaghghal il-'addaad min fadlak"],
  103: ['ممكن ترجع ورا؟', "mumkin tirga' wara?"],
  104: ['تقدر تاخد كام واحد معاك؟', "ti'dar taakhud kaam waahid ma'aak?"],
  105: ['ممكن تستناني شوية', 'mumkin tistannaani shwayya'],
  106: ['هو ده المكان', 'huwwa da il-makaan'],
  107: ['شكرًا على التوصيلة', "shukran 'ala it-tawsiila"],
  108: ['تاخد كام وتوصلني هناك؟', 'taakhud kaam wi-tiwassalni hinaak?'],
  109: ['ده كتير أوي', "da kitiir 'awi"],
  110: ['لا، مش هقدر أروح هناك', "la, mish ha'dar aruuh hinaak"],
  113: ['ده هياخد وقت كتير جدًا', "da hayaakhud wa't kitiir giddan"],
  114: ['قريب جدًا', "'urayyib giddan"],
  115: ['بعيد جدًا', "ba'iid giddan"],
  116: ['أقدر / مش قادر أقف هنا', "a'dar / mish 'aadir a'af hina"],
  118: ['إمتى الأوتوبيس اللي بعده؟', "imta il-otobiis illi ba'du?"],
  119: ['المحطة اللي جاية؟', 'il-mahatta illi gayya?'],
  120: ['أنهي أوتوبيس يقدر ياخدني للمحطة دي؟', "anhi otobiis yi'dar yakhudni lil-mahatta di?"],
  121: ['بكام التذكرة للمكان ده؟', 'bikaam it-tazkara lil-makaan da?'],
  123: ['فين الحمام؟', 'fein il-hammaam?'],
  125: ['إنت مين؟', 'inta miin?'],
  126: ['عندك كام سنة؟', "'andak kaam sana?"],
  127: ['أنا عايز مروحة', "ana 'aayiz marwaha"],
  128: ['ممكن فوطة؟', 'mumkin fuuta?'],
  129: ['بطّل تكلمني', 'battal tikallimni'],
  134: [
    'واحد، اتنين، تلاتة، أربعة، خمسة، ستة، سبعة، تمانية، تسعة، عشرة',
    "waahid, itneen, talaata, arba'a, khamsa, sitta, sab'a, tamanya, tis'a, 'ashara",
  ],
  135: [
    'عشرة، عشرين، تلاتين، أربعين، خمسين، ستين، سبعين، تمانين، تسعين، مية',
    "'ashara, 'ishriin, talatiin, arba'iin, khamsiin, sittiin, sab'iin, tamaniin, tis'iin, miyya",
  ],
  138: ['أنا هتصل بالبوليس', 'ana hattisil bil-buliis'],
  139: ['في واحد سرق (محفظتي/باسبوري/مفاتيحي/تليفوني)', "fii waahid sara' (mahfazti/basboori/mafatiihi/tilifooni)"],
  141: ['من فضلك اتصل بالإسعاف', "min fadlak ittisil bil-is'aaf"],
  143: ['ممكن حد يساعدني؟', "mumkin hadd yisa'idni?"],
  144: ['ممكن تاخدني للمستشفى من فضلك', 'mumkin taakhudni lil-mustashfa min fadlak'],
  145: ['المستشفى فين؟', 'il-mustashfa fein?'],
  146: ['أنا عايز مستشفى', "ana 'aayiz mustashfa"],
  147: ['أنا محتاج المساعدة من فضلك', "ana mihtaag il-musa'da min fadlak"],
  148: ['أنا مش عارف أنا فين، ممكن تساعدني؟', "ana mish 'aarif ana fein, mumkin tisa'idni?"],
  149: ['من فضلك سيبني لوحدي', 'min fadlak sibni li-wahdi'],
  150: ['أنا عايز دكتور', "ana 'aayiz doktoor"],
  151: ['أنا عندي حساسية', "ana 'andi hasasiyya"],
  152: ['أنا عايز ميّة، عندك ميّة؟', "ana 'aayiz mayya, 'andak mayya?"],
};

export function egyptianEntry(phraseNum: number): DialectEntry | undefined {
  const row = EG[phraseNum];
  if (!row) return undefined;
  const [arabicScript, transliteration] = row;
  return {
    dialectId: 'egyptian',
    name: 'Egyptian',
    arabicScript,
    transliteration,
    samples: [
      {
        speaker: 'Mario',
        folder: 'mario',
        prefix: 'MC',
        phraseNum,
        trackNum: 0,
        audioUrl: `/audio/eg/mario/${String(phraseNum).padStart(3, '0')}.mp3`,
      },
    ],
  };
}

export const EGYPTIAN_PHRASE_NUMS = Object.keys(EG).map(Number);
