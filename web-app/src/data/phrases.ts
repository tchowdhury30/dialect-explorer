import { Phrase, Category, VoiceSample } from '../types';

const BASE = 'https://wfxjcjvjfeppsbxvdlkn.supabase.co/storage/v1/object/public/audio/jordanian';

// File numbers per speaker (from actual Supabase upload inventory + transcription)
// These are the FILE numbers used in URLs, not always the phrase list index
const HABIB_FILES  = new Set([1,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,118,119,120,121,122,123,124,125,126,127,128,129,132,133,134]);
const GHAINA_FILES = new Set([39,40,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,85,86,87,88,90,91,92,93,94,95,96,97,98,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153]);
const HALAD_FILES  = new Set([39,40,42,43,44,45,46,47,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63]);
const SALIM_FILES  = new Set([64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,88,89,90,91,92,93,94,96,97,98,99,100,101,102,104,105,106,108,109,111,112,113,115,116,117,118,119,120,121,122,124,125,126,127,128,129,131,132,134,135,139,140,141,142,143,144,146,148,149,150,151,152,153]);

// samples(fileNum) generates audio URLs using the actual file number in Supabase
// This may differ from the phrase list index due to recording session offsets
function samples(fileNum: number): VoiceSample[] {
  const n = String(fileNum).padStart(2, '0');
  const enc = (s: string) => s.replace(/ /g, '%20');
  const result: VoiceSample[] = [];

  if (HABIB_FILES.has(fileNum))
    result.push({ speaker: 'Habib', folder: 'habib-ghaina', prefix: 'HGC', phraseNum: fileNum, trackNum: 3, audioUrl: `${BASE}/habib-ghaina/${n}/${enc(`HGC_${n}_Track 3.mp3`)}` });

  if (GHAINA_FILES.has(fileNum))
    result.push({ speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'GHC', phraseNum: fileNum, trackNum: 3, audioUrl: `${BASE}/habib-ghaina/${n}/${enc(`GHC_${n}_Track 3.mp3`)}` });

  if (HALAD_FILES.has(fileNum))
    result.push({ speaker: 'Halad', folder: 'halad-salim', prefix: 'HSC', phraseNum: fileNum, trackNum: 3, audioUrl: `${BASE}/halad-salim/${n}/${enc(`HSC_${n}_Track 3.mp3`)}` });

  if (SALIM_FILES.has(fileNum))
    result.push({ speaker: 'Salim', folder: 'halad-salim', prefix: 'SHC', phraseNum: fileNum, trackNum: 3, audioUrl: `${BASE}/halad-salim/${n}/${enc(`SHC_${n}_Track 3.mp3`)}` });

  return result;
}

// fileNum is the actual file number in Supabase (may differ from phraseNum due to recording offsets)
function j(phraseNum: number, english: string, fusha: string, fushaLatin: string, arabic: string, latin: string, category: string, fileNum?: number): Phrase {
  return {
    id: `p${phraseNum}`,
    phraseNum,
    english,
    fushaArabic: fusha,
    fushaTransliteration: fushaLatin,
    dialects: [{ name: 'Jordanian', arabicScript: arabic, transliteration: latin, samples: samples(fileNum ?? phraseNum) }],
    category,
    timesQueried: 0,
    isBookmarked: false,
  };
}

export const categories: Category[] = [
  { id: 'conversation', name: 'Conversation', icon: '💬', description: 'Greetings and introductions', phraseCount: 38 },
  { id: 'restaurants',  name: 'Restaurants',  icon: '🍽️', description: 'Ordering food and dining',    phraseCount: 24 },
  { id: 'tourism',      name: 'Tourism',      icon: '🗺️', description: 'Sightseeing and shopping',    phraseCount: 21 },
  { id: 'taxis',        name: 'Taxis',        icon: '🚕', description: 'Getting around by taxi',      phraseCount: 33 },
  { id: 'travel',       name: 'Travel',       icon: '🚌', description: 'Buses, trains, and transport', phraseCount: 15 },
  { id: 'numbers',      name: 'Numbers',      icon: '🔢', description: 'Counting and days',            phraseCount: 4  },
  { id: 'emergencies',  name: 'Emergencies',  icon: '🚨', description: 'Emergency situations',        phraseCount: 15 },
];

export const phrases: Phrase[] = [
  // CONVERSATION 1-38
  j(1,  'Hello!',                      'مرحبا',              'marhaba',                  'مرحبا',               'marhaba',               'conversation'),
  { id: 'p2', phraseNum: 2, english: 'How are you?', fushaArabic: 'كيف حالك؟', fushaTransliteration: 'kayfa halak?', category: 'conversation', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'كيفك؟', transliteration: 'keefak?', samples: [{ speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'HGC', phraseNum: 2, trackNum: 3, audioUrl: `${BASE}/habib-ghaina/02/HGC_02_Track%203.mp3` }] }] },
  { id: 'p4', phraseNum: 4, english: 'My name is ___', fushaArabic: 'اسمي ___', fushaTransliteration: 'ismi ___', category: 'conversation', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'اسمي ___', transliteration: 'ismi ___', samples: [{ speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'HGC', phraseNum: 4, trackNum: 3, audioUrl: `${BASE}/habib-ghaina/04/HGC_04_Track%203.mp3` }] }] },
  j(6,  'I am from ___',              'أنا من ___',          'ana min ___',              'أنا من ___',          'ana min ___',           'conversation'),
  j(7,  'I speak a little Arabic',     'أتكلم عربي قليلاً', 'atakallam arabi qalilan',  'بحكي عربي شوي',      'bahki arabi shway',     'conversation'),
  j(8,  'I speak Fusha',              'أتكلم الفصحى',       'atakallam al-fusha',       'بحكي فصحى',           'bahki fusha',           'conversation'),
  j(9,  'I am learning Arabic',        'أنا أتعلم العربية', 'ana atallam al-arabiyya',  'أنا بتعلم عربي',     'ana bataallam arabi',   'conversation'),
  j(10, 'What do you study?',          'ماذا تدرس؟',         'madha tadrus?',            'شو بتدرس؟',           'shu btudrus?',          'conversation'),
  j(11, 'Where do you work?',          'أين تعمل؟',          'ayna tamal?',              'وين بتشتغل؟',         'ween btishtighil?',     'conversation'),
  j(12, 'Do you like ___?',           'هل تحب ___؟',         'hal tuhibb ___?',          'بتحب ___؟',           'bthibb ___?',           'conversation'),
  j(13, "I don't like ___",           'لا أحب ___',          'la uhibb ___',             'ما بحب ___',          'ma bhibb ___',          'conversation'),
  j(14, 'I like ___',                 'أحب ___',             'uhibb ___',                'بحب ___',             'bhibb ___',             'conversation'),
  j(15, 'I love ___',                 'أعشق ___',            'aashaq ___',               'بعشق ___',            'baashaq ___',           'conversation'),
  j(16, 'Yes',                         'نعم',                'naam',                     'آه',                  'ah',                    'conversation'),
  j(17, 'No',                          'لا',                 'la',                       'لا',                  'la',                    'conversation'),
  j(18, 'Good',                        'جيد',                'jayyid',                   'منيح',                'mneeh',                 'conversation'),
  j(19, 'Bad',                         'سيئ',                "sayyi'",                   'مش منيح',             'mish mneeh',            'conversation'),
  j(20, 'This is my friend',           'هذا صديقي',          'hadha sadeeqi',            'هاد صاحبي',           'haad sahibi',           'conversation'),
  j(21, 'His/her name is ___',        'اسمه/اسمها ___',      'ismuhu/ismuha ___',        'اسمه/اسمها ___',      'ismu/isma ___',         'conversation'),
  j(22, 'Where are you staying?',      'أين تقيم؟',          'ayna tuqim?',              'وين نازل؟',           'ween naazil?',          'conversation'),
  j(23, 'I am staying near ___',      'أقيم قرب ___',        'uqim qurb ___',            'نازل قرب ___',        'naazil qurb ___',       'conversation'),
  j(24, 'I study Arabic in ___',      'أدرس العربية في ___', 'adrus al-arabiyya fi ___', 'بدرس عربي في ___',   'badrus arabi fi ___',   'conversation'),
  j(25, 'Thank you',                   'شكراً',              'shukran',                  'شكراً',               'shukran',               'conversation'),
  j(26, "You're welcome",              'عفواً',              'afwan',                    'عفواً',               'afwan',                 'conversation'),
  j(27, 'Excuse me',                   'عذراً',              'udhran',                   'لو سمحت',             'law samaht',            'conversation'),
  j(28, 'Please',                      'من فضلك',            'min fadlak',               'لو سمحت',             'law samaht',            'conversation'),
  j(29, "I'm sorry",                   'آسف',                'aasif',                    'آسف',                 'aasif',                 'conversation'),
  j(30, 'How do you say ___?',        'كيف تقول ___؟',       'kayfa taqul ___?',         'كيف بتقول ___؟',      'keef btqul ___?',       'conversation'),
  { id: 'p31', phraseNum: 31, english: 'Can you speak slowly?', fushaArabic: 'هل يمكنك التحدث ببطء؟', fushaTransliteration: 'hal yumkinuka al-tahadduth bibut?', category: 'conversation', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'فيك تحكي شوي أبطأ؟', transliteration: 'feek thki shway abta?', samples: [
    { speaker: 'Habib', folder: 'habib-ghaina', prefix: 'HGC', phraseNum: 31, trackNum: 4, audioUrl: `${BASE}/habib-ghaina/31/HGC_31_Track%204.mp3` },
  ] }] },
  j(32, 'What does this mean?',        'ماذا يعني هذا؟',     'madha yaani hadha?',       'شو يعني هاد؟',        'shu yaani haad?',       'conversation'),
  j(33, 'Congratulations',             'مبروك',              'mabrook',                  'مبروك',               'mabrook',               'conversation'),
  j(34, 'See you later',               'إلى اللقاء',         "ila al-liqa'",             'يلا مع السلامة',      "yalla ma' al-salaama", 'conversation'),
  j(35, 'I know',                      'أعرف',               'aarif',                    'بعرف',                'baarif',                'conversation'),
  j(36, 'I do not know',               'لا أعرف',            'la aarif',                 'ما بعرف',             'ma baarif',             'conversation'),
  j(37, 'I understand',                'أفهم',               'afham',                    'فاهم',                'faahim',                'conversation'),
  j(38, "I don't understand",          'لا أفهم',            'la afham',                 'ما فهمت',             'ma fehmet',             'conversation'),

  // RESTAURANTS 39-63
  j(39, 'Restaurant',                  'مطعم',               "mat'am",                   'مطعم',                "mat'am",                'restaurants'),
  j(40, 'Cafe',                        'مقهى',               'maqha',                    'كافيه',               'kafeh',                 'restaurants'),
  j(42, 'What can I get for you?',     'بماذا أخدمك؟',       'bi madha akhdumak?',       'شو بدك؟',             'shu biddak?',           'restaurants'),
  j(43, 'What would you like?',        'ماذا تريد؟',         'madha turid?',             'شو بتحب تاخد؟',      'shu bthibb taakhod?',   'restaurants'),
  j(44, 'Can I please have…?',        'هل يمكنني الحصول على…؟', 'hal yumkinuni al-husul ala…?', 'فيني آخد…؟', 'feeni aakhud…?',        'restaurants'),
  j(45, 'What is this?',               'ما هذا؟',            'ma hadha?',                'شو هاد؟',             'shu haad?',             'restaurants'),
  j(46, 'I cannot have ___ (dairy, nuts, gluten)', 'لا أستطيع تناول ___', "la astatee' tanawul ___", 'ما بقدر آكل ___', "ma ba'dar aakol ___", 'restaurants'),
  j(47, 'I am allergic to ___',        'عندي حساسية من ___', 'andi hasasiyya min ___',   'عندي حساسية من ___',  'andi hasasiyye min ___', 'restaurants'),
  j(48, 'I am allergic to this',       'عندي حساسية من هذا', 'andi hasasiyya min hadha', 'عندي حساسية من هاد', 'andi hasasiyye min haad', 'restaurants'),
  j(49, 'This is delicious, thank you','هذا لذيذ، شكراً',   'hadha ladheedh, shukran',  'هاد طيب، شكراً',     'haad tayyib, shukran',  'restaurants'),
  j(50, 'Can I have a menu, please?',  'ممكن القائمة؟',      "mumkin al-qa'ima?",        'فيني آخد المنيو؟',    'feeni aakhud el-menu?', 'restaurants'),
  j(51, 'What do you recommend?',      'ماذا تنصح؟',         'madha tansah?',            'شو بتنصحني؟',         'shu btensahni?',        'restaurants'),
  j(52, 'Is this dish spicy?',         'هل هذا الطبق حار؟',  'hal hadha al-tabaq harr?', 'هاد الأكل حار؟',     'haad el-akel harr?',    'restaurants'),
  j(53, 'I have a food allergy',       'عندي حساسية من الطعام', "andi hasasiyya min al-ta'am", 'عندي حساسية من الأكل', 'andi hasasiyye min el-akel', 'restaurants'),
  j(54, 'Can I have the bill, please?','ممكن الحساب؟',       'mumkin al-hisab?',         'فيني آخد الحساب؟',    'feeni aakhud el-hisab?', 'restaurants'),
  j(55, 'Could I have some water?',    'ممكن ماء؟',          "mumkin ma'?",              'فيني آخد مي؟',        'feeni aakhud mayy?',    'restaurants'),
  j(56, 'Do you take credit cards?',   'هل تقبلون بطاقات؟',  'hal taqbalun bitaqat?',    'بتاخدوا فيزا؟',       'btaakhdu visa?',        'restaurants'),
  j(57, 'I would like to make a reservation', 'أود حجز طاولة', 'awaddu hajz tawila',    'بدي احجز طاولة',      'biddi ahjeez tawle',    'restaurants'),
  j(58, 'Still water',                 'ماء عادي',           "ma' aadi",                 'مي عادي',             'mayy aadi',             'restaurants'),
  j(59, 'Sparkling water',             'ماء فوار',           "ma' fawwar",               'مي غازي',             'mayy ghazi',            'restaurants'),
  j(60, 'Can I have water, please?',   'ممكن ماء؟',          "mumkin ma', law samaht?",  'فيني آخد مي؟',        'feeni aakhud mayy?',    'restaurants'),
  j(61, 'Does this have alcohol?',     'هل فيه كحول؟',       'hal fih kuhul?',           'في كحول بهاد؟',       'fi kuhul b-haad?',      'restaurants'),
  j(62, 'Tea',                         'شاي',                'shay',                     'شاي',                 'shay',                  'restaurants'),
  j(63, 'Juice',                       'عصير',               'aseer',                    'عصير',                'aseer',                 'restaurants'),

  // TOURISM 64-84
  j(64, 'Where is the entrance?',      'أين المدخل؟',        'ayna al-madkhal?',         'وين المدخل؟',         'ween el-madkhal?',      'tourism'),
  j(65, 'What time does it close?',    'متى يغلق؟',          'mata yughlaq?',            'إيمتى بسكر؟',         'eimta bsakker?',        'tourism'),
  j(66, 'Where are the restrooms?',    'أين الحمام؟',        'ayna al-hammam?',          'وين الحمام؟',         'ween el-hammam?',       'tourism'),
  j(67, 'Do you have a map?',          'هل لديك خريطة؟',     'hal ladayka kharita?',     'معك خريطة؟',          'maak khareeta?',        'tourism'),
  j(68, 'Where is the bus stop?',      'أين موقف الباص؟',    'ayna mawqif al-bas?',      'وين محطة الباص؟',     'ween mahattet el-bas?', 'tourism'),
  j(69, 'Where are the taxis?',        'أين سيارات الأجرة؟', "ayna sayyarat al-ujra?",   'وين التاكسي؟',        'ween el-taxi?',         'tourism'),
  j(70, 'Can you point?',              'هل يمكنك الإشارة؟',  'hal yumkinuka al-ishara?', 'فيك تشير؟',           'feek tsheer?',          'tourism'),
  j(71, 'Do you know where ___ is?',  'هل تعرف أين ___؟',   "hal ta'rif ayna ___?",     'بتعرف وين ___؟',      "bta'ref ween ___?",     'tourism'),
  j(72, 'How do I get to…?',          'كيف أصل إلى…؟',      'kayfa asilu ila…?',        'كيف بروح على…؟',      'keef brooh ala…?',      'tourism'),
  j(73, 'What time does the bus/train leave?', 'متى يغادر الباص؟', 'mata yughadir al-bas?', 'إيمتى بطلع الباص؟', "eimta btla' el-bas?",  'tourism'),
  j(74, 'Where can I exchange money?', 'أين يمكنني تصريف المال؟', 'ayna yumkinuni tasrif al-mal?', 'وين بقدر صرف مصاري؟', "ween ba'dar seref masari?", 'tourism'),
  j(75, 'Can you take a picture of us?', 'ممكن تصورنا؟',    'mumkin tesawwarna?',        'فيك تصورنا؟',         'feek tsawwarna?',       'tourism'),
  j(76, 'How much does this cost?',    'كم سعر هذا؟',        "kam si'r hadha?",           'قديش هاد؟',           'addeish haad?',         'tourism'),
  j(77, 'Can you give me a discount?', 'هل يمكنك أن تعطيني خصماً؟', 'hal yumkinuka an tatiyani khasm?', 'فيك تعطيني تخفيض؟', "feek ta'teeni takhfeef?", 'tourism'),
  j(78, 'Do you have another color or size?', 'هل لديك لون أو مقاس آخر؟', 'hal ladayka lawn aw miqas akhar?', 'في لون أو مقاس ثاني؟', 'fi lawn aw mqas thani?', 'tourism'),
  j(79, 'Where can I find ___?',      'أين يمكنني إيجاد ___؟', 'ayna yumkinuni ijad ___?', 'وين بلاقي ___؟',   "ween bla'i ___?",       'tourism'),
  j(80, "I'll take it",               'سآخذه',              "sa'akhudhu",               'بآخده',               'baakhdu',               'tourism'),
  j(81, 'I am just looking, thank you','أنا فقط أتفرج، شكراً','ana faqat atfarraj, shukran','بس عم بتفرج، شكراً', 'bas aam btfarraj, shukran', 'tourism'),
  j(82, 'No, that is too expensive',   'لا، هذا غالي جداً', 'la, hadha ghali jiddan',   'لا، هاد غالي كثير',   'la, haad ghali kteer',  'tourism'),
  j(83, 'More',                        'أكثر',               'akthar',                   'أكثر',                'aktar',                 'tourism'),
  j(84, 'Less',                        'أقل',                'aqall',                    'أقل',                 'aqall',                 'tourism'),

  // TAXIS 85-117
  j(85,  'Taxi',                              'تاكسي',             'taxi',                           'تاكسي',               'taxi',                      'taxis'),
  j(86,  'Can you take me to ___?',          'هل يمكنك أخذي إلى ___؟', 'hal yumkinuka akhdi ila ___?', 'فيك توديني على ___؟', 'feek twaddeeni ala ___?',   'taxis'),
  j(87,  'Rainbow Street',                   'شارع قوس قزح',     "shari' qaws quzah",              'شارع قوس قزح',        "shari' qaws quzah",         'taxis'),
  j(88,  'The museum',                       'المتحف',            'al-mathaf',                      'المتحف',              'el-mathaf',                 'taxis'),
  j(89,  'The citadel',                      'القلعة',            "al-qal'a",                       'وسط البلد',           'wasat el-beled',            'taxis'),
  j(90,  'The mosque',                       'المسجد',            'al-masjid',                      'الجامع',              "el-jami'",                  'taxis'),
  j(91,  'To this place',                    'إلى هذا المكان',   'ila hadha al-makan',             'على هاد المكان',      'ala haad el-makan',         'taxis'),
  j(92,  'The airport',                      'المطار',            'al-matar',                       'المطار',              'el-matar',                  'taxis'),
  j(93,  'I have the location on this map',  'لدي الموقع على الخريطة', "ladayya al-mawqi' ala al-kharita", 'معي الموقع على الخريطة', "maaya el-maw'e' ala el-kharita", 'taxis'),
  j(94,  'Directions',                       'اتجاهات',           'ittijahat',                      'اتجاهات',             'ittijahat',                 'taxis'),
  j(95,  'Please',                           'من فضلك',           'min fadlak',                     'لو سمحت',             'law samaht',                'taxis'),
  j(96,  'Thank you very much',              'شكراً جزيلاً',      'shukran jazilan',                'شكراً كثير',          'shukran kteer',             'taxis'),
  j(97,  'Stop here, please',               'قف هنا، من فضلك',   'qif huna, min fadlak',           'وقف هون، لو سمحت',    "wa'ef hon, law samaht",     'taxis'),
  j(98,  'Turn right',                       'انعطف يميناً',      "in'atif yaminan",                'خد يمين',             'khud yameen',               'taxis'),
  j(99,  'Turn left',                        'انعطف يساراً',      "in'atif yasaran",                'خد شمال',             'khud shemal',               'taxis'),
  j(100, 'Keep going / go straight',         'استمر / اذهب مباشرة','istamirr / idhhab mubasharatan','روح دغري',            'rooh dughri',               'taxis'),
  j(101, 'Could you give me my change?',     'هل يمكنك إعطائي الباقي؟', "hal yumkinuka i'ta'i al-baqi?", 'فيك تعطيني الباقي؟', "feek ta'teeni el-ba'i?", 'taxis'),
  j(102, 'Can you turn your meter on?',      'هل يمكنك تشغيل العداد؟', "hal yumkinuka tashghil al-'addad?", 'فيك تشغل العداد؟', 'feek tshaghel el-addad?', 'taxis'),
  j(103, 'Can you go back?',                 'هل يمكنك العودة؟',  "hal yumkinuka al-'awda?",       "فيك ترجع؟",           "feek terja'?",              'taxis'),
  j(104, 'How many people can you take?',    'كم شخصاً يمكنك أن تأخذ؟', "kam shakhsan yumkinuka an ta'khudh?", 'قديش شخص بتقدر تاخد؟', 'km shakhs takhoud?', 'taxis'),
  j(105, 'Can you wait a minute?',           'هل يمكنك الانتظار دقيقة؟', 'hal yumkinuka al-intizar daqiqa?', 'فيك تستنى دقيقة؟', 'feek testanna daqiqa?', 'taxis'),
  j(106, 'This is the location',             'هذا هو المكان',     'hadha huwa al-makan',            'هاد هو المكان',       'haad huwa el-makan',        'taxis'),
  j(107, 'Thank you for the ride',           'شكراً على التوصيلة','shukran ala al-tawsila',         'شكراً على السواقة',   "shukran ala el-sawa'a",     'taxis'),
  j(108, 'How much to take me to ___?',     'كم بتاخد لتوصلني؟', 'kam bitakhodh le-tawsalni?',     'قديش تاخد لتوصلني؟', 'km takhoud ___?','taxis'),
  j(109, 'No, that is too much',             'لا، هذا كثير',      'la, hadha kathir',               'لا، هاد كثير',        'la, haad kteer',            'taxis'),
  j(110, "No, I can't go there",             'لا، لا أستطيع الذهاب هناك', "la, la astatee' al-dhihab hunaka", 'لا، ما بقدر روح هناك', "la, ma ba'dar rooh hunak", 'taxis'),
  j(111, 'No, it costs more',                'لا، يكلف أكثر',     'la, yukallif akthar',            'لا، بتكلف أكثر',      'la, btekallef aktar',       'taxis'),
  j(112, 'I can take ___ people',           'بقدر آخذ ___ شخص',  "ba'dar aakhudh ___ shakhs",      'بقدر آخد ___ شخص',   "ba'dar aakhod ___ shakhs",  'taxis'),
  j(113, 'It will take a long / short time', 'سيأخذ وقتاً طويلاً / قصيراً', "sa-ya'khudh waqtan tawilan / qasiran", 'رح ياخد وقت طويل / قصير', 'rah yaakhod waqt taweel / qaseer', 'taxis'),
  j(114, 'It is close',                      'إنه قريب',          'innahu qarib',                   'هو قريب',             'huwa areeb',                'taxis'),
  j(115, 'It is far away',                   'إنه بعيد',          "innahu ba'id",                   'هو بعيد',             "huwa ba'eed",               'taxis'),
  j(116, 'I can / cannot stop here',         'بقدر / ما بقدر أوقف هون', "ba'dar / ma ba'dar awqef hon", 'بقدر / ما بقدر أوقف هون', "ba'dar / ma ba'dar awqef hon", 'taxis'),
  j(117, 'It costs ___ JDs',                'يكلف ___ دينار',    'yukallif ___ dinar',             'بتكلف ___ دينار',     'btekallef ___ dinar',       'taxis'),

  // TRAVEL 118-137
  j(118, 'When is the next bus?',            'متى الباص الجاي؟',  'mata al-bas al-jay?',            'إيمتى الباص الجاي؟', 'eimta el-bas el-jay?',      'travel'),
  j(119, 'What is the next stop?',           'ما هي المحطة الجاية؟','ma hiya al-mahatta al-jayya?', 'شو المحطة الجاية؟',   'shu el-mahatta el-jayye?',  'travel'),
  j(120, 'Which bus/train can take me to ___?','أي باص يوديني لـ ___؟','ayy bas yuwaddini la ___?',  'أي باص بياخدني على ___؟','ayy bas byakhodni ala ___?', 'travel'),
  j(121, 'How much is the ticket to ___?',   'قديش التذكرة لـ ___؟','addeish al-tazkira la ___?',   'قديش التذكرة لـ ___؟','addeish el-tazkira la ___?', 'travel'),
  j(122, 'Can you help me find ____?',       'فيك تساعدني لاقي ____؟',"feek tsa'edni la'i ____?",   'فيك تساعدني لاقي ____؟',"feek tsa'edni la'i ____?", 'travel'),
  j(123, 'Where is the bathroom?',           'وين الحمام؟',        'ween el-hammam?',               'وين الحمام؟',         'ween el-hammam?',           'travel'),
  j(124, 'Excuse me',                        'لو سمحت',            'law samaht',                    'لو سمحت',             'law samaht',                'travel'),
  j(125, 'Who are you?',                     'من أنت؟',            'man anta?',                     'مين إنت؟',            'meen inta?',                'travel'),
  j(126, 'How old are you?',                 'كم عمرك؟',           'kam umrak?',                    'قديش عمرك؟',          'addeish umrak?',            'travel'),
  j(127, 'I need a fan',                     'أحتاج مروحة',        'ahtaj marwaha',                 'بدي مروحة',           'biddi marwaha',             'travel'),
  j(128, 'I need a towel',                   'أحتاج منشفة',        'ahtaj manshafa',                'بدي منشفة',           'biddi manshafe',            'travel'),
  j(129, 'Stop talking to me',               'كف عن الكلام معي',  "kuff 'an al-kalam maai",        'بطّل تحكيلي',         'battel thkili',             'travel'),
  j(131, 'Do not talk to me',               'لا تتكلم معي',       'la tatakallam maai',            'ما تحكيلي',           'ma thkili',                 'travel', 132),
  j(132, 'Does this have alcohol?',          'في كحول بهاد؟',      'fi kuhul b-haad?',              'في كحول بهاد؟',       'fi kuhul b-haad?',          'travel', 133),
  j(133, 'How much alcohol is in this?',     'قديش في كحول بهاد؟', 'addeish fi kuhul b-haad?',      'قديش في كحول بهاد؟', 'addeish fi kuhul b-haad?',  'travel', 134),
  // Counting/days use special file prefixes with # — hardcoded URLs
  { id: 'p134', phraseNum: 134, english: 'Count numbers 1–10', fushaArabic: 'واحد، اثنين، ثلاثة...', fushaTransliteration: 'wahid, ithnayn, thalatha...', category: 'numbers', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'واحد، اثنين، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة', transliteration: "wahad, ithnayn, thalate, arba'a, khamse, sitte, sab'a, thamanya, tis'a, 'ashara", samples: [
    { speaker: 'Habib',  folder: 'habib-ghaina', prefix: 'HonlyC', phraseNum: 135, trackNum: 0, audioUrl: `${BASE}/merged/HonlyC_135_merged.mp3` },
    { speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'GonlyC', phraseNum: 135, trackNum: 0, audioUrl: `${BASE}/merged/GonlyC_135_merged.mp3` },
    { speaker: 'Halad',  folder: 'halad-salim',  prefix: 'HonlyC', phraseNum: 135, trackNum: 0, audioUrl: `${BASE}/merged/HalonlyC_135_merged.mp3` },
  ] }] },
  { id: 'p135', phraseNum: 135, english: 'Count by 10s', fushaArabic: 'عشرة، عشرين...', fushaTransliteration: "'ashara, 'ishreen...", category: 'numbers', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'عشرة، عشرين، ثلاثين، أربعين، خمسين، ستين، سبعين، ثمانين، تسعين، مية', transliteration: "'ashara, 'ishreen, thalatheen, arba'een, khamseen, sitteen, sab'een, thamaneen, tis'een, miyye", samples: [
    { speaker: 'Habib',  folder: 'habib-ghaina', prefix: 'HonlyC', phraseNum: 136, trackNum: 0, audioUrl: `${BASE}/merged/HonlyC_136_merged.mp3` },
    { speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'GonlyC', phraseNum: 136, trackNum: 0, audioUrl: `${BASE}/merged/GonlyC_136_merged.mp3` },
    { speaker: 'Halad',  folder: 'halad-salim',  prefix: 'HonlyC', phraseNum: 136, trackNum: 0, audioUrl: `${BASE}/merged/HalonlyC_136_merged.mp3` },
    { speaker: 'Salim',  folder: 'halad-salim',  prefix: 'SonlyC', phraseNum: 136, trackNum: 0, audioUrl: `${BASE}/merged/SalonlyC_136_merged.mp3` },
  ] }] },
  { id: 'p136', phraseNum: 136, english: 'Count by 100s', fushaArabic: 'مية، مئتين...', fushaTransliteration: "miyya, mi'tayn...", category: 'numbers', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'مية، مئتين، ثلاثمية، أربعمية، خمسمية، ستمية، سبعمية، ثمانمية، تسعمية، ألف', transliteration: "miyye, mi'tayn, taltmiyye, arba'miyye, khams miyye, sett miyye, sab'miyye, thamn miyye, tis'miyye, alf", samples: [
    { speaker: 'Habib',  folder: 'habib-ghaina', prefix: 'HonlyC', phraseNum: 137, trackNum: 0, audioUrl: `${BASE}/merged/HonlyC_137_merged.mp3` },
    { speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'GonlyC', phraseNum: 137, trackNum: 0, audioUrl: `${BASE}/merged/GonlyC_137_merged.mp3` },
    { speaker: 'Halad',  folder: 'halad-salim',  prefix: 'HonlyC', phraseNum: 137, trackNum: 0, audioUrl: `${BASE}/merged/HalonlyC_137_merged.mp3` },
    { speaker: 'Salim',  folder: 'halad-salim',  prefix: 'SonlyC', phraseNum: 137, trackNum: 0, audioUrl: `${BASE}/merged/SalonlyC_137_merged.mp3` },
  ] }] },
  { id: 'p137', phraseNum: 137, english: 'Days of the week', fushaArabic: 'أيام الأسبوع', fushaTransliteration: "ayyam al-usbuu'", category: 'numbers', timesQueried: 0, isBookmarked: false, dialects: [{ name: 'Jordanian', arabicScript: 'الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت', transliteration: "el-ahad, el-ithnayn, el-thalata, el-arba'a, el-khamees, el-jum'a, el-sabt", samples: [
    { speaker: 'Habib',  folder: 'habib-ghaina', prefix: 'HDaysC',     phraseNum: 138, trackNum: 0, audioUrl: `${BASE}/merged/HDaysC_138_merged.mp3` },
    { speaker: 'Ghaina', folder: 'habib-ghaina', prefix: 'GDaysC',     phraseNum: 138, trackNum: 0, audioUrl: `${BASE}/merged/GDaysC_138_merged.mp3` },
    { speaker: 'Halad',  folder: 'halad-salim',  prefix: 'HonlydaysC', phraseNum: 138, trackNum: 0, audioUrl: `${BASE}/merged/HalonlydaysC_138_merged.mp3` },
    { speaker: 'Salim',  folder: 'halad-salim',  prefix: 'SonlydaysC', phraseNum: 138, trackNum: 0, audioUrl: `${BASE}/merged/SalonlydaysC_138_merged.mp3` },
  ] }] },

  // EMERGENCIES — file numbers are +1 from phrase list (recording offset)
  j(138, 'I will call the police',           'سأتصل بالشرطة',     "sa'attasil bil-shurta",          'رح اتصل بالشرطة',     'rah attasil bil-shorta',    'emergencies', 139),
  j(139, 'Someone stole my (wallet/passport/keys/phone)', 'في حدا سرق (محفظتي/جوازي/مفاتيحي/تلفوني)', 'fi hada saraq...', 'في حدا سرق (محفظتي/جوازي/مفاتيحي/تلفوني)', 'fi hada saraq (mahfazti/jawazi/mafatehi/telfoni)', 'emergencies', 140),
  j(140, 'I lost my (wallet/passport/keys/phone)', 'ضيّعت (محفظتي/جوازي/مفاتيحي/تلفوني)', "dayya't...", 'ضيّعت (محفظتي/جوازي/مفاتيحي/تلفوني)', "dayya't (mahfazti/jawazi/mafatehi/telfoni)", 'emergencies', 141),
  j(141, 'Please call an ambulance',         'لو سمحت اتصل بالإسعاف', 'law samaht attasil bil-is\'af', 'لو سمحت اتصل بالإسعاف', "law samaht attasil bil-is'af", 'emergencies', 142),
  j(142, 'Where is the police station?',     'وين مركز الشرطة؟',  'ween markaz el-shorta?',         'وين مركز الشرطة؟',    'ween markaz el-shorta?',    'emergencies', 143),
  j(143, 'Someone, please help me!',         'في حدا يساعدني!',   "fi hada ysa'edni!",              'في حدا يساعدني!',     "fi hada ysa'edni!",         'emergencies', 144),
  j(144, 'Take me to the hospital, please',  'وديني على المستشفى','waddeeni ala el-mustashfa',      'وديني على المستشفى', 'waddeeni ala el-mustashfa', 'emergencies', 145),
  j(145, 'Where is the hospital?',           'وين المستشفى؟',     'ween el-mustashfa?',             'وين المستشفى؟',       'ween el-mustashfa?',        'emergencies', 146),
  j(146, 'I need a hospital',                'بدي مستشفى',        'biddi mustashfa',                'بدي مستشفى',          'biddi mustashfa',           'emergencies', 147),
  j(147, 'I need help please',               'بدي مساعدة',        'biddi musa\'ada',                'بدي مساعدة',          "biddi musa'ade",            'emergencies', 148),
  j(148, "I don't know where I am",          'ما بعرف وين أنا',   'ma baarif ween ana',             'ما بعرف وين أنا',     'ma baarif ween ana',        'emergencies', 149),
  j(149, 'Leave me alone',                   'اتركني',             'utrokni',                        'خليني بحالي',         'khalleeni b-hali',          'emergencies', 150),
  j(150, 'I need a doctor',                  'بدي دكتور',          'biddi doktor',                   'بدي دكتور',           'biddi doktor',              'emergencies', 151),
  j(151, 'I am having an allergic reaction', 'عندي رد فعل تحسسي', "andi radd fi'l tahassusi",       'عندي حساسية هلأ',     "andi hasasiyye halla'",     'emergencies', 152),
  j(152, 'I need water, do you have water?', 'بدي مي، معك مي؟',   'biddi mayy, maak mayy?',         'بدي مي، معك مي؟',     'biddi mayy, maak mayy?',   'emergencies', 153),
];
