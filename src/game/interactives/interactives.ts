import type { Direction, DialogState } from '../../types';

export interface Interactive {
  id: string;
  mapId: string;
  x: number;
  y: number;
  facing?: Direction;
  spritePalette?: string;
  dialogStates: string[];
}

/**
 * Adult NPCs and signs.  These are non-wandering characters scattered around
 * the maps that the player approaches and presses A to learn from.
 */
export const INTERACTIVES: Interactive[] = [
  // ===== School =====
  {
    id: 'teacher',
    mapId: 'school',
    x: 8,
    y: 5,
    facing: 'down',
    spritePalette: 'teacher',
    dialogStates: ['teacher_brief'],
  },
  {
    id: 'librarian',
    mapId: 'school',
    x: 4,
    y: 12,
    facing: 'down',
    spritePalette: 'librarian',
    dialogStates: ['librarian_book_given', 'librarian_book'],
  },
  {
    id: 'principal',
    mapId: 'school',
    x: 10,
    y: 5,
    facing: 'down',
    spritePalette: 'principal',
    dialogStates: ['principal_school_ceremony_done', 'principal_school'],
  },
  // School-yard signpost = entrance to bus
  { id: 'bus_sign', mapId: 'school', x: 6, y: 13, dialogStates: ['bus_sign'] },

  // ===== Jerusalem (5 stops) =====
  // Stop 1: Tower of David - Archaeologist
  {
    id: 'archaeologist',
    mapId: 'jerusalem',
    x: 5,
    y: 5,
    facing: 'down',
    spritePalette: 'archaeologist',
    dialogStates: ['stop_tower'],
  },
  // Stop 2: Western Wall - Rabbi (off the central approach path so he
  // doesn't block the player from walking up to the wall).
  {
    id: 'rabbi',
    mapId: 'jerusalem',
    x: 19,
    y: 7,
    facing: 'right',
    spritePalette: 'rabbi',
    dialogStates: ['stop_kotel'],
  },
  // Stop 3: Mahane Yehuda - Vendor
  {
    id: 'vendor',
    mapId: 'jerusalem',
    x: 5,
    y: 17,
    facing: 'right',
    spritePalette: 'vendor',
    dialogStates: ['stop_market'],
  },
  // Stop 4: Tayelet - Soldier (between bench and railings, on sand)
  {
    id: 'soldier',
    mapId: 'jerusalem',
    x: 23,
    y: 16,
    facing: 'down',
    spritePalette: 'soldier',
    dialogStates: ['stop_tayelet'],
  },
  // Stop 5: City Center / Gan Hashoshanim - Tour guide
  {
    id: 'guide',
    mapId: 'jerusalem',
    x: 14,
    y: 11,
    facing: 'down',
    spritePalette: 'guide',
    dialogStates: ['stop_center'],
  },

  // ===== Ceremony =====
  {
    id: 'principal_stage',
    mapId: 'ceremony',
    x: 9,
    y: 4,
    facing: 'down',
    spritePalette: 'principal',
    dialogStates: ['ceremony_done', 'ceremony_principal'],
  },

  // ===== Interior NPCs =====
  // School classroom: a fellow student who shares classroom trivia
  {
    id: 'classmate_school',
    mapId: 'schoolInterior',
    x: 3,
    y: 5,
    facing: 'right',
    spritePalette: 'shira',
    dialogStates: ['classmate_school'],
  },
  // Library: an old man reading, shares historical trivia
  {
    id: 'reader_library',
    mapId: 'libraryInterior',
    x: 7,
    y: 5,
    facing: 'left',
    spritePalette: 'rabbi',
    dialogStates: ['reader_library'],
  },
  // Tower museum: a museum guide
  {
    id: 'curator_tower',
    mapId: 'towerInterior',
    x: 5,
    y: 5,
    facing: 'down',
    spritePalette: 'guide',
    dialogStates: ['curator_tower'],
  },

  // ===== Jerusalem light rail =====
  // The tram is decoration on the road; a tram driver stands beside it.
  {
    id: 'tram_driver',
    mapId: 'jerusalem',
    x: 6,
    y: 19,
    facing: 'up',
    spritePalette: 'guide',
    dialogStates: ['tram_driver'],
  },

  // ===== Kotel note interactives =====
  // Invisible interactives covering BOTH the wall tiles (row 4) AND the
  // tile directly in front (row 5).  This way pressing A facing up works
  // from anywhere adjacent to the wall — both from row 5 (looking at row 4
  // wall) and from row 6 (looking at row 5 in front of the wall).
  { id: 'kotel_note', mapId: 'jerusalem', x: 20, y: 4, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 21, y: 4, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 22, y: 4, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 23, y: 4, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 20, y: 5, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 21, y: 5, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 22, y: 5, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
  { id: 'kotel_note', mapId: 'jerusalem', x: 23, y: 5, dialogStates: ['kotel_note_done', 'kotel_note_choose', 'kotel_note_prompt'] },
];

export function interactiveAt(mapId: string, x: number, y: number): Interactive | null {
  return INTERACTIVES.find((i) => i.mapId === mapId && i.x === x && i.y === y) ?? null;
}

export function interactivesOn(mapId: string): Interactive[] {
  return INTERACTIVES.filter((i) => i.mapId === mapId);
}

// Educational dialogues — short, clear, age-appropriate (4-6 grade Hebrew).
export const INTERACTIVE_DIALOGS: DialogState[] = [
  // ===== School =====
  {
    id: 'teacher_brief',
    npcId: 'teacher',
    excludeFlags: ['teacher_briefed'],
    onEnterSetFlags: ['teacher_briefed'],
    lines: [
      { speaker: 'המורה דבורה', text: 'בוקר טוב! היום אנחנו נוסעים לירושלים — יום ירושלים שמח!' },
      { speaker: 'המורה דבורה', text: 'לפני שיוצאים: 1) קחו ספר על ירושלים מהספרייה.' },
      { speaker: 'המורה דבורה', text: '2) המנהל ייתן לכם אישור הורים. ו-3) חבר/ה מהכיתה אובד/ת — תעזרו לחפש.' },
      { speaker: 'המורה דבורה', text: 'נפגשים על יד האוטובוס. צריך לעלות עד 09:00.' },
    ],
  },
  {
    id: 'teacher_brief',
    npcId: 'teacher',
    requireFlags: ['teacher_briefed'],
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: 'המורה דבורה', text: 'תזכורת: ספרייה, מנהל, חבר/ה. ואז לאוטובוס.' },
    ],
  },
  {
    id: 'librarian_book',
    npcId: 'librarian',
    excludeFlags: ['has_jerusalem_book'],
    onEnterSetFlags: ['has_jerusalem_book'],
    onEnterGiveItems: [
      { id: 'book', name: 'ספר על ירושלים', description: 'אוסף סיפורים על העיר. עיין בו ביציאה.', icon: '📖' },
    ],
    lines: [
      { speaker: 'הספרנית', text: 'שלום! רוצה ספר על ירושלים? יש לי שלושה: היסטוריה, מאכלים, ושירים.' },
      { speaker: 'הספרנית', text: 'קח/י את "ירושלים — סיפורים מ-3000 שנה". מתאים לכל הגילאים.' },
      { speaker: 'הספרנית', text: 'ידעתם? ירושלים מוזכרת בתנ"ך כ-669 פעמים — העיר העברית המוזכרת הכי הרבה.' },
    ],
  },
  {
    id: 'librarian_book_given',
    npcId: 'librarian',
    requireFlags: ['has_jerusalem_book'],
    lines: [
      { speaker: 'הספרנית', text: 'תיהנו בסיור! תחזירו לי כשתחזרו.' },
    ],
  },
  {
    id: 'principal_school',
    npcId: 'principal',
    excludeFlags: ['has_permission_slip'],
    onEnterSetFlags: ['has_permission_slip'],
    onEnterGiveItems: [
      { id: 'permission', name: 'אישור הורים', description: 'חתום ומאומת. לא לאבד.', icon: '📝' },
    ],
    lines: [
      { speaker: 'המנהלת', text: 'הנה אישור ההורים החתום. שמור/שמרי עליו.' },
      { speaker: 'המנהלת', text: 'יום ירושלים מציין את איחוד ירושלים במלחמת ששת הימים, ב-כ״ח באייר תשכ״ז (1967).' },
      { speaker: 'המנהלת', text: 'בשנת 1968 הוא נקבע ליום חג רשמי בכנסת. נסיעה טובה!' },
    ],
  },
  {
    id: 'principal_school_ceremony_done',
    npcId: 'principal',
    requireFlags: ['has_permission_slip'],
    lines: [{ speaker: 'המנהלת', text: 'נסיעה בטוחה. נתראה אחר הצהריים בטקס.' }],
  },
  {
    id: 'bus_sign',
    npcId: 'bus_sign',
    requireFlags: ['class_ready_to_go'],
    lines: [{ speaker: '*', text: 'האוטובוס לירושלים מחכה. עלו!' }],
  },
  {
    id: 'bus_sign',
    npcId: 'bus_sign',
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: '*', text: 'האוטובוס מחכה — אבל לא לפני שכל המשימות הושלמו.' },
      { speaker: '*', text: 'בדוק/בדקי בתפריט (Esc) מה עוד נשאר.' },
    ],
  },

  // ===== Jerusalem stops =====
  {
    id: 'stop_tower',
    npcId: 'archaeologist',
    excludeFlags: ['stop_tower_done'],
    onEnterSetFlags: ['stop_tower_done'],
    onEnterGiveItems: [
      { id: 'fact_tower', name: 'עובדה: מצודת דוד', description: 'המצודה נבנתה לפני יותר מ-2000 שנה.', icon: '🏰' },
    ],
    lines: [
      { speaker: 'הארכיאולוג', text: 'ברוכים הבאים למצודת דוד! המקום הכי גבוה בעיר העתיקה.' },
      { speaker: 'הארכיאולוג', text: 'המצודה לא באמת קשורה לדוד המלך. הביזנטים שיבשו את שמה לפני כ-1500 שנה.' },
      { speaker: 'הארכיאולוג', text: 'יש כאן שכבות מ-2200 שנה: חשמונאית, הרודיאנית, רומית, ביזנטית, צלבנית, ממלוכית, עות׳מאנית.' },
      { speaker: 'הארכיאולוג', text: 'הבסיס בנוי על ידי החשמונאים, הורדוס הוסיף שלושה מגדלים — אחד מהם עומד עד היום.' },
    ],
  },
  {
    id: 'stop_kotel',
    npcId: 'rabbi',
    excludeFlags: ['stop_kotel_done'],
    onEnterSetFlags: ['stop_kotel_done'],
    onEnterGiveItems: [
      { id: 'fact_kotel', name: 'עובדה: הכותל', description: 'חלק מקיר התמך של הר הבית, נבנה ע"י הורדוס לפני 2000 שנה.', icon: '🕊️' },
    ],
    lines: [
      { speaker: 'הרב', text: 'שלום! הגעתם לכותל המערבי — חלק מהקיר התומך של הר הבית.' },
      { speaker: 'הרב', text: 'הקיר נבנה על ידי הורדוס המלך, לפני יותר מ-2000 שנה. זה לא בית המקדש עצמו — זה חלק מהקיר התומך שמסביב להר הבית.' },
      { speaker: 'הרב', text: 'אנשים כותבים פתקים עם תפילות ומכניסים בין האבנים.' },
      { speaker: 'הרב', text: 'מ-1948 עד 1967 לא היה אפשר לבוא לכאן. במלחמת ששת הימים העיר אוחדה.' },
    ],
  },
  {
    id: 'stop_market',
    npcId: 'vendor',
    excludeFlags: ['stop_market_done'],
    onEnterSetFlags: ['stop_market_done'],
    onEnterGiveItems: [
      { id: 'pita', name: 'פיתה טרייה', description: 'נקנתה במחנה יהודה. ריח של תנור.', icon: '🥙' },
    ],
    lines: [
      { speaker: 'המוכר', text: 'אהלן! ברוכים הבאים לשוק מחנה יהודה — השוק הכי שמח בירושלים.' },
      { speaker: 'המוכר', text: 'השוק נמצא בין שתי שכונות שהוקמו ב-1887: מחנה יהודה ובית יעקב.' },
      { speaker: 'המוכר', text: 'יש פה כ-250 דוכנים: פיתות, חלוואה, חמוצים, גבינות, ירקות, תבלינים.' },
      { speaker: 'המוכר', text: 'בלילה הסמטאות הופכות לאזור בילוי. אבל זה לא לגיל שלכם.' },
    ],
  },
  {
    id: 'stop_tayelet',
    npcId: 'soldier',
    excludeFlags: ['stop_tayelet_done'],
    onEnterSetFlags: ['stop_tayelet_done'],
    onEnterGiveItems: [
      { id: 'fact_tayelet', name: 'עובדה: הטיילת', description: 'מהטיילת רואים את כל ירושלים.', icon: '🌄' },
    ],
    lines: [
      { speaker: 'החיילת', text: 'שלום! זאת טיילת חאס. רואים מכאן את העיר העתיקה.' },
      { speaker: 'החיילת', text: 'משם — הר הזיתים, הכי עתיק שיש. שם — הר הבית. שם — הר ציון.' },
      { speaker: 'החיילת', text: 'אומרים שירושלים בנויה על שבע גבעות. הכי גבוהות הן הר הצופים והר הזיתים — בערך 826 מטר.' },
      { speaker: 'החיילת', text: 'בעיר חיים כמיליון תושבים — יהודים, מוסלמים, נוצרים, ארמנים.' },
    ],
  },
  {
    id: 'stop_center',
    npcId: 'guide',
    excludeFlags: ['stop_center_done'],
    onEnterSetFlags: ['stop_center_done'],
    onEnterGiveItems: [
      { id: 'flag_jerusalem', name: 'דגל ירושלים', description: 'אריה כסוף על רקע כחול.', icon: '🏳️' },
    ],
    lines: [
      { speaker: 'המדריך', text: 'הגעתם למרכז העיר! זה הלב של ירושלים החדשה.' },
      { speaker: 'המדריך', text: 'יום ירושלים נחגג ב-כ״ח באייר — היום שצה"ל איחד את העיר ב-1967.' },
      { speaker: 'המדריך', text: 'סמל ירושלים: אריה יהודה ועליו זר זית, על רקע חומות העיר העתיקה.' },
      { speaker: 'המדריך', text: 'אחרי הביקור כאן, חזרו לאוטובוס. נחזור לבית הספר לטקס.' },
    ],
  },

  // ===== Ceremony =====
  {
    id: 'ceremony_principal',
    npcId: 'principal_stage',
    excludeFlags: ['ceremony_done'],
    requireFlags: ['all_stops_visited'],
    lines: [
      { speaker: 'המנהלת', text: 'ילדים יקרים, אנחנו מתכנסים בטקס יום ירושלים.' },
      { speaker: 'המנהלת', text: 'מי רוצה להציג מה למד היום בעיר?' },
    ],
    choices: [
      { text: 'אני רוצה להציג!', setFlags: ['ceremony_done'], next: 'ceremony_after' },
      { text: 'אני מעדיף/ה להקשיב לחברים.', setFlags: ['ceremony_done', 'listened_only'], next: 'ceremony_after' },
    ],
  },
  {
    id: 'ceremony_after',
    npcId: 'principal_stage',
    onEnterSetFlags: ['ceremony_finished'],
    lines: [
      { speaker: 'המנהלת', text: 'יישר כוח לכל הכיתה!' },
      { speaker: 'המנהלת', text: 'נסיים בשירת "ירושלים של זהב" יחד.' },
      { speaker: '*', text: '🎵 אוויר הרים צלול כיין... 🎵' },
    ],
  },
  {
    id: 'ceremony_done',
    npcId: 'principal_stage',
    requireFlags: ['ceremony_done'],
    lines: [{ speaker: 'המנהלת', text: 'יום ירושלים שמח!' }],
  },

  // ===== Interior NPCs =====
  {
    id: 'classmate_school',
    npcId: 'classmate_school',
    lines: [
      { speaker: 'תלמידה', text: 'היי! זאת הכיתה שלנו. רואה את הדגלים? אנחנו מתכוננים ליום ירושלים.' },
      { speaker: 'תלמידה', text: 'מעל הלוח יש מפת ישראל. ירושלים מסומנת באמצע — היא בירת המדינה משנת 1949.' },
      { speaker: 'תלמידה', text: 'יודע/ת מה היה כאן בעבר? עד 1948 בספרי הלימוד של סבא שלי היה כתוב "ירושלים — מנדט בריטי".' },
    ],
  },
  {
    id: 'reader_library',
    npcId: 'reader_library',
    lines: [
      { speaker: 'הקורא', text: 'שלום ילד/ה! בא לך לדעת עובדה מעניינת? ירושלים היא אחת מהערים העתיקות בעולם — יש בה התיישבות יהודית כבר יותר מ-3000 שנה.' },
      { speaker: 'הקורא', text: 'בספרייה הזאת יש "אנציקלופדיה תלמודית" עם כ-47 כרכים — אוסף שמסכם את כל החוכמה היהודית.' },
      { speaker: 'הקורא', text: 'בית המקדש הראשון נבנה ע"י שלמה המלך לפני בערך 3000 שנה. בית המקדש השני נחנך בשנת 516 לפנה"ס בערך ע"י זרובבל.' },
    ],
  },
  {
    id: 'curator_tower',
    npcId: 'curator_tower',
    lines: [
      { speaker: 'אוצרת המוזיאון', text: 'ברוכים הבאים למוזיאון מצודת דוד! פה מציגים 3000 שנה של ירושלים.' },
      { speaker: 'אוצרת המוזיאון', text: 'במרכז יש דגם של ירושלים העתיקה. תזהו את הכותל המערבי ואת הר הבית?' },
      { speaker: 'אוצרת המוזיאון', text: 'בתצוגה: מטבעות מתקופת הורדוס, חרסים חשמונאיים, וכלי חרס מתקופת בית ראשון.' },
      { speaker: 'אוצרת המוזיאון', text: 'גם שחזור של מפת מידבא — פסיפס ביזנטי מהמאה ה-6 שמראה את ירושלים. המקור נמצא בכנסייה ביַרְדֵּן.' },
    ],
  },

  // ===== Light Rail (הרכבת הקלה) =====
  {
    id: 'tram_driver',
    npcId: 'tram_driver',
    lines: [
      { speaker: 'נהג הרכבת', text: 'שלום! זאת הרכבת הקלה של ירושלים. פתחנו אותה ב-19 באוגוסט 2011.' },
      { speaker: 'נהג הרכבת', text: 'הקו האדום הוא הראשון — מהר הרצל בדרום-מערב ועד פסגת זאב בצפון. 14 קילומטרים, 23 תחנות.' },
      { speaker: 'נהג הרכבת', text: 'הקו עובר ברחוב יפו — הרחוב הראשי של ירושלים. פעם זה היה כביש לכל כלי הרכב, ועכשיו רק להולכי רגל ולרכבת.' },
      { speaker: 'נהג הרכבת', text: 'בכל יום נוסעים בה כ-150,000 אנשים. בקרוב יבואו עוד קווים: הירוק, הכחול והסגול.' },
      { speaker: 'נהג הרכבת', text: 'הרכבת חוצה את גשר המיתרים — גשר מתוח מודרני בכניסה לעיר, תכנן אותו האדריכל סנטיאגו קלטרבה.' },
    ],
  },

  // ===== Kotel note interaction =====
  {
    id: 'kotel_note_prompt',
    npcId: 'kotel_note',
    excludeFlags: ['kotel_note_placed', 'stop_kotel_done'],
    lines: [{ speaker: '*', text: 'תחזרו אחרי שתשמעו את הסיפור מהרב.' }],
  },
  {
    id: 'kotel_note_choose',
    npcId: 'kotel_note',
    requireFlags: ['stop_kotel_done'],
    excludeFlags: ['kotel_note_placed'],
    lines: [
      { speaker: '*', text: 'יש המון פתקים בין האבנים. אנשים כותבים תפילות, ברכות, או משאלות.' },
      { speaker: '*', text: 'מה את/ה רוצה לכתוב בפתק שלך?' },
    ],
    choices: [
      {
        text: 'שלום בעולם 🕊️',
        setFlags: ['kotel_note_placed', 'wish_peace'],
        giveItems: [{ id: 'note_kotel', name: 'פתק בכותל', description: 'משאלה לשלום בעולם.', icon: '📝' }],
        next: 'kotel_note_done',
      },
      {
        text: 'בריאות למשפחה ❤️',
        setFlags: ['kotel_note_placed', 'wish_family'],
        giveItems: [{ id: 'note_kotel', name: 'פתק בכותל', description: 'משאלה לבריאות המשפחה.', icon: '📝' }],
        next: 'kotel_note_done',
      },
      {
        text: 'הצלחה בלימודים 📚',
        setFlags: ['kotel_note_placed', 'wish_school'],
        giveItems: [{ id: 'note_kotel', name: 'פתק בכותל', description: 'משאלה להצלחה בלימודים.', icon: '📝' }],
        next: 'kotel_note_done',
      },
      {
        text: 'אושר לחברים שלי 🤝',
        setFlags: ['kotel_note_placed', 'wish_friends'],
        giveItems: [{ id: 'note_kotel', name: 'פתק בכותל', description: 'משאלה לאושר חברים.', icon: '📝' }],
        next: 'kotel_note_done',
      },
    ],
  },
  {
    id: 'kotel_note_done',
    npcId: 'kotel_note',
    requireFlags: ['kotel_note_placed'],
    lines: [
      { speaker: '*', text: 'את/ה דוחפ/ת את הפתק בין שתי האבנים העתיקות.' },
      { speaker: '*', text: 'בכל שנה יש 2 פעמים שמנקים את הפתקים ושמים אותם במקום מכובד — קוראים לזה "גניזה".' },
    ],
  },
];
