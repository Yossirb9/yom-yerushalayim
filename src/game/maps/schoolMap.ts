import type { MapDef } from '../../types';
import { makeEmpty, placeHouse } from './mapBuilder';

/**
 * Map 1 — בית הספר בבוקר
 * Schoolyard (grass) with a single school building, library hut, and a south
 * exit leading to the bus → Jerusalem.  NPCs include the homeroom teacher,
 * the librarian, the principal and a friend.
 */
export const SCHOOL_MAP: MapDef = (() => {
  const W = 18;
  const H = 16;
  const m = makeEmpty(W, H, 'grass');
  m.id = 'school';
  m.name = 'בית הספר';
  m.ambient = 'town';

  // Trees border
  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'tree';
    m.collision[0][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'tree';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'tree';
    m.collision[y][W - 1] = true;
  }
  for (let x = 0; x < W; x++) {
    if (x === 7 || x === 8) continue; // south exit
    m.objects[H - 1][x] = 'tree';
    m.collision[H - 1][x] = true;
  }

  // Center vertical path (sand)
  for (let y = 1; y < H - 1; y++) {
    m.ground[y][7] = 'path';
    m.ground[y][8] = 'path';
  }
  // East-west path at row 8
  for (let x = 2; x < W - 2; x++) {
    m.ground[8][x] = 'path';
  }

  // School building (top, 2x3) at (5, 2)
  placeHouse(m.objects, m.collision, 5, 2);
  m.objects[5][6] = 'signSchool';
  m.collision[5][6] = true;

  // Library hut (left middle) at (2, 10)
  placeHouse(m.objects, m.collision, 2, 10);
  m.objects[12][4] = 'signLibrary';
  m.collision[12][4] = true;

  // Decorative flowers
  m.objects[6][3] = 'flower';
  m.objects[6][14] = 'flower';
  m.objects[12][14] = 'flower';
  m.objects[13][6] = 'flower';

  // Bus area near south exit
  m.objects[14][9] = 'car';
  m.collision[14][9] = true;
  m.objects[13][6] = 'signBus';
  m.collision[13][6] = true;

  // Warps:
  // - South exit → Jerusalem bus (only after class_ready_to_go)
  // - School building door → school interior
  // - Library hut door → library interior
  m.warps = {
    [`7,${H - 1}`]: { mapId: 'jerusalem', x: 14, y: 14, facing: 'up', flag: 'class_ready_to_go' },
    [`8,${H - 1}`]: { mapId: 'jerusalem', x: 14, y: 14, facing: 'up', flag: 'class_ready_to_go' },
    // School building door is at (5, 4); player walks onto it from below
    '5,4': { mapId: 'schoolInterior', x: 6, y: 7, facing: 'up' },
    // Library door is at (2, 12)
    '2,12': { mapId: 'libraryInterior', x: 5, y: 7, facing: 'up' },
  };

  return m;
})();
