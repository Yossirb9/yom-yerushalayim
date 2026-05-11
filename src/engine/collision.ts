import type { MapDef } from '../types';
import { isCollidableTile } from './tiles';

export function isBlocked(map: MapDef, tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) return true;
  if (map.collision[ty]?.[tx]) return true;
  if (isCollidableTile(map.objects[ty]?.[tx] ?? null)) return true;
  return false;
}
