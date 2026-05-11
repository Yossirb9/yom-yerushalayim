import type { NpcDef, PlayerTrackId, DialogState } from '../../types';
import { DIALOGUES, findDialog } from './dialogues';

/** Infer which map a dialog applies to from its id suffix when forMapIds is missing. */
function inferMapId(d: DialogState): string | null {
  if (d.forMapIds && d.forMapIds.length === 1) return d.forMapIds[0];
  const id = d.id;
  if (id.includes('_town')) return 'town';
  if (id.includes('_camp')) return 'camp';
  if (id.includes('_makhtesh')) return 'makhtesh';
  return null;
}

/**
 * Pick the most specific matching dialog state for an NPC interaction.
 * Considers: required/excluded flags, player track, and current map.
 * More-specific states (more constraints) are tried first.
 */
export function resolveDialogState(
  npc: NpcDef,
  flags: Record<string, boolean>,
  trackId: PlayerTrackId,
  mapId: string,
): string | null {
  const npcStates = DIALOGUES.filter((d) => d.npcId === npc.id);
  const sorted = npcStates.slice().sort((a, b) => {
    const ar =
      (a.requireFlags?.length ?? 0) +
      (a.excludeFlags?.length ?? 0) +
      (a.forTracks ? 2 : 0) +
      (a.forMapIds || inferMapId(a) ? 2 : 0);
    const br =
      (b.requireFlags?.length ?? 0) +
      (b.excludeFlags?.length ?? 0) +
      (b.forTracks ? 2 : 0) +
      (b.forMapIds || inferMapId(b) ? 2 : 0);
    return br - ar;
  });
  for (const d of sorted) {
    if (d.requireFlags && d.requireFlags.some((f) => !flags[f])) continue;
    if (d.excludeFlags && d.excludeFlags.some((f) => flags[f])) continue;
    if (d.forTracks && !d.forTracks.includes(trackId)) continue;
    const dialogMap = d.forMapIds ?? (inferMapId(d) ? [inferMapId(d)!] : null);
    if (dialogMap && !dialogMap.includes(mapId)) continue;
    return d.id;
  }
  return null;
}

export { findDialog };
