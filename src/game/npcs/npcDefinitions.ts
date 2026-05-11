import type { NpcDef, PlayerTrackId } from '../../types';
import { CHARACTER_PALETTES } from '../../engine/sprites';

export const TRACK_INFO: Record<PlayerTrackId, { name: string; oneLine: string; goal: string }> = {
  daniel: {
    name: 'דניאל',
    oneLine: 'אוהב ספורט, מטפס על כל גובה.',
    goal: 'להגיע למצודת דוד ולספור 5 שכבות היסטוריות בקירות.',
  },
  shira: {
    name: 'שירה',
    oneLine: 'אוהבת לשיר ולכתוב מילים.',
    goal: 'ללמוד 3 שירים על ירושלים ולשיר אותם בטקס.',
  },
  uri: {
    name: 'אורי',
    oneLine: 'חובב היסטוריה. תמיד עם פנקס ועט.',
    goal: 'לאסוף 5 עובדות היסטוריות שלא ידעת.',
  },
  yael: {
    name: 'יעל',
    oneLine: 'אוהבת אוכל. מסקרנת ובעלת חוש טעם.',
    goal: 'לטעום 4 מאכלים מירושלים ולכתוב עליהם בעיתון בית הספר.',
  },
};

export const TRACK_ORDER: PlayerTrackId[] = ['daniel', 'shira', 'uri', 'yael'];

export const NPCS: NpcDef[] = [
  // === Player tracks (rendered as NPCs when not selected) ===
  {
    id: 'daniel',
    name: 'דניאל',
    description: 'הספורטאי',
    flavor: 'תמיד רץ ראשון.  טיפוס על מצודה זה החלום שלו.',
    trackId: 'daniel',
    palette: CHARACTER_PALETTES.daniel as any,
    positions: [
      { mapId: 'school', x: 5, y: 9, facing: 'right' },
      { mapId: 'jerusalem', x: 6, y: 6, facing: 'down' },
      { mapId: 'ceremony', x: 6, y: 8, facing: 'up' },
    ],
    dialogStates: ['daniel_ceremony', 'daniel_jerusalem', 'daniel_school'],
  },
  {
    id: 'shira',
    name: 'שירה',
    description: 'הזמרת',
    flavor: 'יודעת את כל המילים של "ירושלים של זהב" בעל פה.',
    trackId: 'shira',
    palette: CHARACTER_PALETTES.shira as any,
    positions: [
      { mapId: 'school', x: 9, y: 9, facing: 'left' },
      { mapId: 'jerusalem', x: 21, y: 6, facing: 'down' },
      { mapId: 'ceremony', x: 8, y: 8, facing: 'up' },
    ],
    dialogStates: ['shira_ceremony', 'shira_jerusalem', 'shira_school'],
  },
  {
    id: 'uri',
    name: 'אורי',
    description: 'ההיסטוריון',
    flavor: 'יש לו אוסף של מטבעות עתיקים מסבא שלו.',
    trackId: 'uri',
    palette: CHARACTER_PALETTES.uri as any,
    positions: [
      { mapId: 'school', x: 4, y: 13, facing: 'right' },
      { mapId: 'jerusalem', x: 13, y: 9, facing: 'right' },
      { mapId: 'ceremony', x: 10, y: 8, facing: 'up' },
    ],
    dialogStates: ['uri_ceremony', 'uri_jerusalem', 'uri_school'],
  },
  {
    id: 'yael',
    name: 'יעל',
    description: 'מבקרת המסעדות',
    flavor: 'טועמת מכל דבר. אומרת תמיד "צריך עוד מלח".',
    trackId: 'yael',
    palette: CHARACTER_PALETTES.yael as any,
    positions: [
      { mapId: 'school', x: 12, y: 13, facing: 'left' },
      { mapId: 'jerusalem', x: 5, y: 17, facing: 'down' },
      { mapId: 'ceremony', x: 12, y: 8, facing: 'up' },
    ],
    dialogStates: ['yael_ceremony', 'yael_jerusalem', 'yael_school'],
  },
];

export function npcById(id: string): NpcDef | undefined {
  return NPCS.find((n) => n.id === id);
}

export function visibleNpcsOn(
  mapId: string,
  playerTrack: PlayerTrackId,
  _flags: Record<string, boolean> = {},
): NpcDef[] {
  return NPCS.filter((n) => {
    if (n.trackId === playerTrack) return false;
    if (!n.positions.some((p) => p.mapId === mapId)) return false;
    return true;
  });
}

export function npcPositionOn(npc: NpcDef, mapId: string) {
  return npc.positions.find((p) => p.mapId === mapId) ?? null;
}
