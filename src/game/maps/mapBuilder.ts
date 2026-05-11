import type { MapDef, TileId } from '../../types';

/** Build a uniform 2D array filled with a value. */
export function fill<T>(w: number, h: number, v: T): T[][] {
  return Array.from({ length: h }, () => Array<T>(w).fill(v));
}

export function setRect<T>(grid: T[][], x: number, y: number, w: number, h: number, v: T) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) if (grid[yy] && xx < grid[yy].length) grid[yy][xx] = v;
}

export function setBorder<T>(grid: T[][], v: T) {
  const h = grid.length;
  const w = grid[0].length;
  for (let x = 0; x < w; x++) {
    grid[0][x] = v;
    grid[h - 1][x] = v;
  }
  for (let y = 0; y < h; y++) {
    grid[y][0] = v;
    grid[y][w - 1] = v;
  }
}

/** Place a 2x3 house: roof row + body row + body row with door in the middle.
 *  The door tile is left non-collidable so the player can walk into the
 *  building (a warp on that tile takes them to the interior map). */
export function placeHouse(
  objects: (TileId | null)[][],
  collision: boolean[][],
  x: number,
  y: number,
) {
  // roof row
  objects[y][x] = 'houseRoofL';
  objects[y][x + 1] = 'houseRoofR';
  // body row 1
  objects[y + 1][x] = 'houseBodyL';
  objects[y + 1][x + 1] = 'houseBodyR';
  // body row 2 - door in left half
  objects[y + 2][x] = 'houseDoor';
  objects[y + 2][x + 1] = 'houseBodyR';
  // collision for everything EXCEPT the door tile (so the door is enterable)
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 2; dx++) {
      if (dy === 2 && dx === 0) continue; // door
      collision[y + dy][x + dx] = true;
    }
  }
}

export function makeEmpty(width: number, height: number, base: TileId): MapDef {
  return {
    id: '',
    name: '',
    width,
    height,
    ground: fill(width, height, base),
    objects: fill<TileId | null>(width, height, null),
    collision: fill(width, height, false),
  };
}
