import { TILE_SIZE } from '../constants/palette';
import type { Direction, MapDef, NpcDef } from '../types';
import { useGameStore } from '../store/gameStore';
import { input } from './input';
import { isBlocked } from './collision';
import { audio } from './audio';

// Movement: each step takes ~180ms to traverse a tile.
const STEP_MS = 180;

export interface Mover {
  // tile coords
  tx: number;
  ty: number;
  // pixel coords (current rendered position)
  px: number;
  py: number;
  // step source/target
  fromPx: number;
  fromPy: number;
  toPx: number;
  toPy: number;
  startedAt: number;
  moving: boolean;
  facing: Direction;
  walkFrame: number;
}

export function newMover(tx: number, ty: number, facing: Direction): Mover {
  return {
    tx,
    ty,
    px: tx * TILE_SIZE,
    py: ty * TILE_SIZE,
    fromPx: tx * TILE_SIZE,
    fromPy: ty * TILE_SIZE,
    toPx: tx * TILE_SIZE,
    toPy: ty * TILE_SIZE,
    startedAt: 0,
    moving: false,
    facing,
    walkFrame: 0,
  };
}

const dirDelta: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** Advance the mover one frame.  Returns true if just finished a step (entered a new tile). */
export function advanceMover(m: Mover, now: number, map: MapDef): boolean {
  if (!m.moving) return false;
  const t = Math.min(1, (now - m.startedAt) / STEP_MS);
  m.px = m.fromPx + (m.toPx - m.fromPx) * t;
  m.py = m.fromPy + (m.toPy - m.fromPy) * t;
  m.walkFrame = Math.floor(t * 4) % 4;
  if (t >= 1) {
    m.moving = false;
    m.walkFrame = 0;
    return true;
  }
  return false;
}

export function tryStartMove(m: Mover, dir: Direction, map: MapDef, now: number): boolean {
  if (m.moving) return false;
  m.facing = dir;
  const [dx, dy] = dirDelta[dir];
  const ntx = m.tx + dx;
  const nty = m.ty + dy;
  if (isBlocked(map, ntx, nty)) return false;
  // Also block on NPCs at target
  const store = useGameStore.getState();
  // NPC blocking handled by caller via predicate
  m.tx = ntx;
  m.ty = nty;
  m.fromPx = m.px;
  m.fromPy = m.py;
  m.toPx = ntx * TILE_SIZE;
  m.toPy = nty * TILE_SIZE;
  m.startedAt = now;
  m.moving = true;
  if (store.audioEnabled) audio.step();
  return true;
}

export function facingTile(m: Mover): { tx: number; ty: number } {
  const [dx, dy] = dirDelta[m.facing];
  return { tx: m.tx + dx, ty: m.ty + dy };
}

/** Find an NPC at exact tile coords on a given map. */
export function npcAtTile(npcs: NpcDef[], mapId: string, tx: number, ty: number): NpcDef | null {
  for (const n of npcs) {
    const pos = n.positions.find((p) => p.mapId === mapId);
    if (!pos) continue;
    if (pos.x === tx && pos.y === ty) return n;
  }
  return null;
}
