import type { DialogState } from '../../types';
import { INTERACTIVE_DIALOGS } from '../interactives/interactives';

/**
 * Per-track NPC dialogues — what each fellow student says when the player
 * approaches them during the trip.  Other tracks reference different aspects
 * of the day relevant to that character's interests.
 */
export const DIALOGUES: DialogState[] = [
  // ===== DANIEL (sports kid) =====
  {
    id: 'daniel_school',
    npcId: 'daniel',
    forMapIds: ['school'],
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: 'דניאל', text: 'בוקר טוב! אני כבר מחומם — איזה כיף, מצודת דוד מחכה לי.' },
      { speaker: 'דניאל', text: 'יש סדרת מדרגות עתיקה במצודה. לא הולך לוותר על אף אחת.' },
    ],
  },
  {
    id: 'daniel_jerusalem',
    npcId: 'daniel',
    forMapIds: ['jerusalem'],
    lines: [
      { speaker: 'דניאל', text: 'אני בדרך למצודת דוד! אספר לכם כמה שכבות אבנים יש שם.' },
    ],
  },
  {
    id: 'daniel_ceremony',
    npcId: 'daniel',
    forMapIds: ['ceremony'],
    lines: [
      { speaker: 'דניאל', text: 'הצלחתי לעלות עד למרום של מצודת דוד. נוף מטורף!' },
    ],
  },

  // ===== SHIRA (singer) =====
  {
    id: 'shira_school',
    npcId: 'shira',
    forMapIds: ['school'],
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: 'שירה', text: 'אני מתחממת. רוצה לשיר ב"ירושלים של זהב" בטקס.' },
      { speaker: 'שירה', text: '🎵 ירושלים של זהב / ושל נחושת ושל אור / הלא לכל שירייך / אני כינור 🎵' },
    ],
  },
  {
    id: 'shira_jerusalem',
    npcId: 'shira',
    forMapIds: ['jerusalem'],
    lines: [
      { speaker: 'שירה', text: 'אני אוספת מילים יפות שאני שומעת בעיר. יש כאן אקוסטיקה מטורפת.' },
    ],
  },
  {
    id: 'shira_ceremony',
    npcId: 'shira',
    forMapIds: ['ceremony'],
    lines: [
      { speaker: 'שירה', text: 'אני מוכנה לשיר 3 שירים: "ירושלים של זהב", "אם אשכחך ירושלים", "מעל פסגת הר הצופים".' },
    ],
  },

  // ===== URI (history) =====
  {
    id: 'uri_school',
    npcId: 'uri',
    forMapIds: ['school'],
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: 'אורי', text: 'יודע/ת? ירושלים מוזכרת בתנ"ך כ-669 פעמים.' },
      { speaker: 'אורי', text: 'אני מתכנן לרשום בפנקס שלי 5 עובדות שאני אלמד היום.' },
    ],
  },
  {
    id: 'uri_jerusalem',
    npcId: 'uri',
    forMapIds: ['jerusalem'],
    lines: [
      { speaker: 'אורי', text: 'יש לי 3 עובדות חדשות בפנקס. עוד 2 וזה רישום מנצח.' },
    ],
  },
  {
    id: 'uri_ceremony',
    npcId: 'uri',
    forMapIds: ['ceremony'],
    lines: [
      { speaker: 'אורי', text: 'מילאתי את כל הפנקס. שמע/י את העובדה הכי מגניבה:' },
      { speaker: 'אורי', text: 'לפי המחקרים, ירושלים נכבשה ושוחררה כ-44 פעמים בהיסטוריה. הוחרבה פעמיים. נצורה 23 פעמים.' },
    ],
  },

  // ===== YAEL (food critic) =====
  {
    id: 'yael_school',
    npcId: 'yael',
    forMapIds: ['school'],
    excludeFlags: ['class_ready_to_go'],
    lines: [
      { speaker: 'יעל', text: 'איזה ריח של פיתה אני מריחה כבר עכשיו. קלאסי מחנה יהודה!' },
      { speaker: 'יעל', text: 'אכתוב בעיתון בית הספר על 4 מאכלים. רשמת/ה לי?' },
    ],
  },
  {
    id: 'yael_jerusalem',
    npcId: 'yael',
    forMapIds: ['jerusalem'],
    lines: [
      { speaker: 'יעל', text: 'טעמתי כבר חלוואה, חמוצים, פיתה. עוד אחד וזה ניצחון.' },
    ],
  },
  {
    id: 'yael_ceremony',
    npcId: 'yael',
    forMapIds: ['ceremony'],
    lines: [
      { speaker: 'יעל', text: '4 מאכלים, 4 כוכבים. הכתבה מוכנה לדפוס.' },
    ],
  },
];

export const ALL_DIALOGS: DialogState[] = [...DIALOGUES, ...INTERACTIVE_DIALOGS];

export function findDialog(id: string): DialogState | undefined {
  return ALL_DIALOGS.find((d) => d.id === id);
}

export function pickFirstAvailable(
  ids: string[],
  flags: Record<string, boolean>,
): DialogState | undefined {
  for (const id of ids) {
    const matches = ALL_DIALOGS.filter((d) => d.id === id);
    for (const d of matches) {
      if (d.requireFlags && d.requireFlags.some((f) => !flags[f])) continue;
      if (d.excludeFlags && d.excludeFlags.some((f) => flags[f])) continue;
      return d;
    }
  }
  for (const id of ids) {
    const d = findDialog(id);
    if (d) return d;
  }
  return undefined;
}
