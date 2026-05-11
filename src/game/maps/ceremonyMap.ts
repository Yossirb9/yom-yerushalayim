import type { MapDef } from '../../types';
import { makeEmpty } from './mapBuilder';

/**
 * Map 3 — טקס יום ירושלים בבית הספר
 * The auditorium / school stage in the morning after the trip.  Player walks
 * to the stage and presents what they learned.
 */
export const CEREMONY_MAP: MapDef = (() => {
  const W = 18;
  const H = 14;
  const m = makeEmpty(W, H, 'floorWood');
  m.id = 'ceremony';
  m.name = 'טקס יום ירושלים';
  m.ambient = 'town';

  // Stone walls (auditorium)
  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'wallStone';
    m.collision[0][x] = true;
    m.objects[H - 1][x] = 'wallStone';
    m.collision[H - 1][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'wallStone';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'wallStone';
    m.collision[y][W - 1] = true;
  }

  // Stage at the top: red carpet
  for (let x = 4; x < W - 4; x++) {
    m.ground[2][x] = 'carpet';
    m.ground[3][x] = 'carpet';
  }

  // Sign on stage (the lectern)
  m.objects[3][8] = 'signCeremony';
  m.collision[3][8] = true;
  m.objects[3][9] = 'signCeremony';
  m.collision[3][9] = true;

  // Flowers decorating the stage
  m.objects[2][3] = 'flower';
  m.objects[2][14] = 'flower';

  return m;
})();
