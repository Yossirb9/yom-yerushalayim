import type { MapDef } from '../../types';
import { makeEmpty } from './mapBuilder';

/**
 * Interior maps — players can enter buildings and explore them.
 * Each interior is a small room with brick walls, a wooden floor, appropriate
 * furniture from the interior tileset, and a south-side door that warps back
 * outside.
 */

/** בית הספר - כיתת לימוד */
export const SCHOOL_INTERIOR: MapDef = (() => {
  const W = 12;
  const H = 9;
  const m = makeEmpty(W, H, 'parquetFloor');
  m.id = 'schoolInterior';
  m.name = 'כיתת לימוד';
  m.ambient = 'town';

  // Brick walls all around
  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'brickWall';
    m.collision[0][x] = true;
    m.objects[H - 1][x] = 'brickWall';
    m.collision[H - 1][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'brickWall';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'brickWall';
    m.collision[y][W - 1] = true;
  }

  // South exit door
  m.objects[H - 1][6] = 'houseDoor';
  m.collision[H - 1][6] = false;

  // Front wall: chalkboard, Israeli flag, map
  m.objects[1][2] = 'israelFlagPole';
  m.collision[1][2] = true;
  m.objects[1][4] = 'chalkboard';
  m.collision[1][4] = true;
  m.objects[1][5] = 'chalkboard';
  m.collision[1][5] = true;
  m.objects[1][6] = 'chalkboard';
  m.collision[1][6] = true;
  m.objects[1][8] = 'israelMap';
  m.collision[1][8] = true;
  m.objects[1][10] = 'jerusalemFlagPole';
  m.collision[1][10] = true;

  // Teacher's desk at front center
  m.objects[3][6] = 'teacherDesk';
  m.collision[3][6] = true;
  m.objects[3][5] = 'pencilCup';
  m.collision[3][5] = true;

  // Two rows of student desks
  m.objects[5][2] = 'studentDesk';
  m.collision[5][2] = true;
  m.objects[5][4] = 'studentDesk';
  m.collision[5][4] = true;
  m.objects[5][7] = 'studentDesk';
  m.collision[5][7] = true;
  m.objects[5][9] = 'studentDesk';
  m.collision[5][9] = true;

  m.objects[7][2] = 'backpack';
  m.collision[7][2] = true;
  m.objects[7][9] = 'backpack';
  m.collision[7][9] = true;

  m.warps = {
    [`6,${H - 1}`]: { mapId: 'school', x: 5, y: 5, facing: 'down' },
  };

  return m;
})();

/** הספרייה */
export const LIBRARY_INTERIOR: MapDef = (() => {
  const W = 11;
  const H = 9;
  const m = makeEmpty(W, H, 'woodFloor');
  m.id = 'libraryInterior';
  m.name = 'הספרייה';
  m.ambient = 'town';

  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'brickWall';
    m.collision[0][x] = true;
    m.objects[H - 1][x] = 'brickWall';
    m.collision[H - 1][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'brickWall';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'brickWall';
    m.collision[y][W - 1] = true;
  }

  m.objects[H - 1][5] = 'houseDoor';
  m.collision[H - 1][5] = false;

  // Bookshelves along the north wall
  for (let x = 1; x <= 9; x++) {
    m.objects[1][x] = x === 5 ? 'bookshelfWithSign' : 'bookshelfTall';
    m.collision[1][x] = true;
  }
  // Bookshelves along west wall
  for (let y = 2; y <= 4; y++) {
    m.objects[y][1] = 'bookshelfTall';
    m.collision[y][1] = true;
  }

  // Librarian's desk + reading lamp
  m.objects[3][4] = 'librarianDesk';
  m.collision[3][4] = true;
  m.objects[3][3] = 'readingLamp';
  m.collision[3][3] = true;

  // Reading tables in the middle
  m.objects[5][3] = 'roundTable';
  m.collision[5][3] = true;
  m.objects[5][7] = 'roundTable';
  m.collision[5][7] = true;
  m.objects[6][5] = 'globe';
  m.collision[6][5] = true;

  // Chairs around tables
  m.objects[5][4] = 'woodChair';
  m.collision[5][4] = true;
  m.objects[5][6] = 'woodChair';
  m.collision[5][6] = true;

  // Encyclopedia + ladder on the east wall
  m.objects[3][9] = 'encyclopedia';
  m.collision[3][9] = true;
  m.objects[5][9] = 'ladder';
  m.collision[5][9] = true;

  m.warps = {
    [`5,${H - 1}`]: { mapId: 'school', x: 2, y: 13, facing: 'down' },
  };

  return m;
})();

/** מצודת דוד - חלל פנים (מוזיאון ארכיאולוגי) */
export const TOWER_INTERIOR: MapDef = (() => {
  const W = 11;
  const H = 9;
  const m = makeEmpty(W, H, 'marbleFloor');
  m.id = 'towerInterior';
  m.name = 'מצודת דוד - מוזיאון';
  m.ambient = 'town';

  for (let x = 0; x < W; x++) {
    m.objects[0][x] = 'brickWall';
    m.collision[0][x] = true;
    m.objects[H - 1][x] = 'brickWall';
    m.collision[H - 1][x] = true;
  }
  for (let y = 1; y < H - 1; y++) {
    m.objects[y][0] = 'brickWall';
    m.collision[y][0] = true;
    m.objects[y][W - 1] = 'brickWall';
    m.collision[y][W - 1] = true;
  }

  m.objects[H - 1][5] = 'houseDoor';
  m.collision[H - 1][5] = false;

  // Archaeology displays — vitrines along the north wall
  m.objects[2][2] = 'artifactCase';
  m.collision[2][2] = true;
  m.objects[2][4] = 'vaseCase';
  m.collision[2][4] = true;
  m.objects[2][6] = 'coinsDisplay';
  m.collision[2][6] = true;
  m.objects[2][8] = 'archScroll';
  m.collision[2][8] = true;

  // Centerpiece: model city + museum lectern
  m.objects[4][5] = 'modelCity';
  m.collision[4][5] = true;
  m.objects[4][2] = 'museumLectern';
  m.collision[4][2] = true;

  // South side: menorah display + archaeology tools
  m.objects[6][3] = 'menorahDisplay';
  m.collision[6][3] = true;
  m.objects[6][7] = 'archeoTools';
  m.collision[6][7] = true;

  m.warps = {
    [`5,${H - 1}`]: { mapId: 'jerusalem', x: 4, y: 5, facing: 'down' },
  };

  return m;
})();
