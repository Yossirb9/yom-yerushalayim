import type { Quest } from '../../types';

export const QUESTS: Quest[] = [
  {
    id: 'q_pack',
    title: 'התארגנות לטיול',
    description: 'לפני שיוצאים לירושלים: ספר מהספרייה, אישור הורים מהמנהלת, להירשם אצל המורה.',
    startFlag: 'game_started',
    objectives: [
      { id: 'meet_teacher', description: 'לדבר עם המורה דבורה', flag: 'teacher_briefed' },
      { id: 'get_book', description: 'לקבל ספר על ירושלים', flag: 'has_jerusalem_book' },
      { id: 'get_slip', description: 'לקבל אישור הורים מהמנהלת', flag: 'has_permission_slip' },
    ],
  },
  {
    id: 'q_jerusalem',
    title: 'סיור בירושלים',
    description: '5 תחנות בירושלים. דבר/י עם הדמות בכל אחת ולמד/י משהו חדש.',
    startFlag: 'class_ready_to_go',
    objectives: [
      { id: 'tower', description: 'מצודת דוד', flag: 'stop_tower_done' },
      { id: 'kotel', description: 'הכותל המערבי', flag: 'stop_kotel_done' },
      { id: 'market', description: 'שוק מחנה יהודה', flag: 'stop_market_done' },
      { id: 'tayelet', description: 'טיילת חאס', flag: 'stop_tayelet_done' },
      { id: 'center', description: 'מרכז העיר', flag: 'stop_center_done' },
    ],
  },
  {
    id: 'q_ceremony',
    title: 'טקס בית הספר',
    description: 'נחזור לבית הספר ונציג בטקס מה למדנו.',
    startFlag: 'all_stops_visited',
    objectives: [{ id: 'present', description: 'להציג את מה שלמדת', flag: 'ceremony_finished' }],
  },
];

export function questById(id: string): Quest | undefined {
  return QUESTS.find((q) => q.id === id);
}
