import type { MapDef } from '../../types';
import { makeEmpty } from './mapBuilder';

/**
 * Map 2 — סיור בירושלים
 * Now using authentic Jerusalem tiles: Western Wall stones with notes,
 * Tower of David crenellations, market stalls, fountain, flags, panorama.
 *
 * Layout (W=28, H=22):
 *   [Tower of David]               [Western Wall]
 *           \                            /
 *            \                          /
 *           [City Center w/ fountain & flags]
 *            /                          \
 *   [Mahane Yehuda Market]    [Tayelet HaAs]
 *
 * Bus drop-off at the bottom-center.
 */
export const JERUSALEM_MAP: MapDef = (() => {
  const W = 28;
  const H = 22;
  const m = makeEmpty(W, H, 'path'); // limestone everywhere
  m.id = 'jerusalem';
  m.name = 'ירושלים';
  m.ambient = 'town';

  // Outer Old-City walls (sandstone)
  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'wallStone';
    m.collision[0][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'wallStone';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'wallStone';
    m.collision[y][W - 1] = true;
  }
  for (let x = 0; x < W; x++) {
    if (x === 13 || x === 14) continue;
    m.objects[H - 1][x] = 'wallStone';
    m.collision[H - 1][x] = true;
  }

  // Some cobblestone alleys for variety
  for (let x = 5; x <= 22; x++) m.ground[8][x] = 'floorWood';
  for (let x = 5; x <= 22; x++) m.ground[14][x] = 'floorWood';

  // ===== Stop 1: מצודת דוד (Tower of David) — top-left =====
  // 3-tile-wide tower with crenellation on top, watchtower roof, base stones
  m.objects[2][3] = 'towerCrenellation';
  m.collision[2][3] = true;
  m.objects[2][4] = 'watchtower';
  m.collision[2][4] = true;
  m.objects[2][5] = 'towerCrenellation';
  m.collision[2][5] = true;
  m.objects[3][3] = 'towerWindow';
  m.collision[3][3] = true;
  m.objects[3][4] = 'towerBase';
  m.collision[3][4] = true;
  m.objects[3][5] = 'towerWindow';
  m.collision[3][5] = true;
  m.objects[4][3] = 'towerBase';
  m.collision[4][3] = true;
  // Entrance to the Tower of David - walkable, warps to interior
  m.objects[4][4] = 'houseDoor';
  m.collision[4][4] = false;
  m.objects[4][5] = 'towerBase';
  m.collision[4][5] = true;
  // Cannon next to it (decorative reminder of the citadel's history)
  m.objects[5][2] = 'cannon';
  m.collision[5][2] = true;
  // Sign
  m.objects[5][6] = 'signTower';
  m.collision[5][6] = true;
  // Olive tree
  m.objects[3][7] = 'oliveTree';
  m.collision[3][7] = true;

  // ===== Stop 2: הכותל המערבי (Western Wall) — top-right =====
  // 4-wide wall of Herodian stones with notes embedded
  for (let dx = 0; dx < 4; dx++) {
    m.objects[2][20 + dx] = 'kotelStones';
    m.collision[2][20 + dx] = true;
    m.objects[3][20 + dx] = 'kotelNotes';
    m.collision[3][20 + dx] = true;
    m.objects[4][20 + dx] = 'kotelStones';
    m.collision[4][20 + dx] = true;
  }
  // Prayer book stand on the side (moved one row down so row 5 stays clear
  // for the player to approach the wall from any column).
  m.objects[6][19] = 'prayerBook';
  m.collision[6][19] = true;
  // Sign
  m.objects[6][24] = 'signKotel';
  m.collision[6][24] = true;
  // Star of David carved on adjacent wall
  m.objects[3][24] = 'starOfDavid';
  m.collision[3][24] = true;
  // Cypress tree
  m.objects[5][25] = 'cypressTree';
  m.collision[5][25] = true;

  // ===== City Center (middle) - Fountain plaza =====
  // Replace the central area with a small plaza featuring a fountain and flags
  m.ground[10][13] = 'floorWood';
  m.ground[10][14] = 'floorWood';
  m.ground[11][13] = 'floorWood';
  m.ground[11][14] = 'floorWood';
  // Fountain in the middle
  m.objects[10][13] = 'fountain';
  m.collision[10][13] = true;
  m.objects[10][14] = 'fountainWater';
  m.collision[10][14] = true;
  // Flags on either side
  m.objects[9][12] = 'israelFlag';
  m.collision[9][12] = true;
  m.objects[9][15] = 'jerusalemFlag';
  m.collision[9][15] = true;
  // Sign explaining Yom Yerushalayim
  m.objects[12][13] = 'signCenter';
  m.collision[12][13] = true;
  // Lamp posts
  m.objects[12][11] = 'lampPost';
  m.collision[12][11] = true;
  m.objects[12][16] = 'lampPost';
  m.collision[12][16] = true;

  // ===== Stop 3: שוק מחנה יהודה (Mahane Yehuda) — bottom-left =====
  // Three colorful market stalls + spices + bread + pita oven
  m.objects[16][3] = 'stallRed';
  m.collision[16][3] = true;
  m.objects[16][4] = 'stallYellow';
  m.collision[16][4] = true;
  m.objects[16][5] = 'stallGreen';
  m.collision[16][5] = true;
  m.objects[18][3] = 'spices';
  m.collision[18][3] = true;
  m.objects[18][4] = 'bread';
  m.collision[18][4] = true;
  m.objects[18][5] = 'pitaOven';
  m.collision[18][5] = true;
  // Pomegranate tree (market produce)
  m.objects[16][2] = 'pomegranateTree';
  m.collision[16][2] = true;
  m.objects[18][2] = 'figTree';
  m.collision[18][2] = true;
  // Sign
  m.objects[15][3] = 'signMarket';
  m.collision[15][3] = true;
  // Cafe table at the edge of the market
  m.objects[19][7] = 'cafeTable';
  m.collision[19][7] = true;

  // ===== Stop 4: טיילת הס (Promenade Tayelet) — bottom-right =====
  // Sand area + benches + railing + binoculars + panorama plaque
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      m.ground[15 + dy][20 + dx] = 'sand';
    }
  }
  // Railing along the south edge of the tayelet
  m.objects[18][20] = 'tayeletRail';
  m.collision[18][20] = true;
  m.objects[18][21] = 'tayeletRail';
  m.collision[18][21] = true;
  m.objects[18][23] = 'tayeletRail';
  m.collision[18][23] = true;
  m.objects[18][24] = 'tayeletRail';
  m.collision[18][24] = true;
  // Bench
  m.objects[17][21] = 'tayeletBench';
  m.collision[17][21] = true;
  m.objects[17][24] = 'tayeletBench';
  m.collision[17][24] = true;
  // Binoculars on the railing
  m.objects[17][22] = 'binoculars';
  m.collision[17][22] = true;
  // Panorama plaque
  m.objects[16][22] = 'panorama';
  m.collision[16][22] = true;
  // Sign
  m.objects[15][20] = 'signTayelet';
  m.collision[15][20] = true;
  // Olive tree at the entrance
  m.objects[15][24] = 'oliveTree';
  m.collision[15][24] = true;

  // South entrance: bus drop-off.  Vehicles are parked OFFSET from the
  // player's walking path (cols 13-14) so they decorate without blocking
  // the exit back to the school.
  m.objects[20][10] = 'schoolbus';
  m.collision[20][10] = true;
  m.objects[20][11] = 'taxi';
  m.collision[20][11] = true;
  // Tram further west on the road
  m.ground[20][6] = 'road';
  m.ground[20][7] = 'road';
  m.ground[20][8] = 'road';
  m.objects[20][7] = 'tram';
  m.collision[20][7] = true;
  // Crossings on either side of the central path
  m.ground[20][12] = 'crossing';
  m.ground[20][15] = 'crossing';

  m.warps = {
    // Returning to school: target school's bottom area (school is H=16, so
    // land player at y=14, just above the south exit).
    [`13,${H - 1}`]: { mapId: 'school', x: 7, y: 14, facing: 'up' },
    [`14,${H - 1}`]: { mapId: 'school', x: 8, y: 14, facing: 'up' },
    // Tower of David is enterable: walk onto the base center tile
    '4,4': { mapId: 'towerInterior', x: 5, y: 7, facing: 'up' },
  };

  return m;
})();
