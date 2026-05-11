import { PALETTE, TILE_PX, TILE_SIZE } from '../constants/palette';
import type { TileId } from '../types';

type Px = string | null;

function blank(): Px[][] {
  return Array.from({ length: TILE_PX }, () => Array<Px>(TILE_PX).fill(null));
}

function rect(g: Px[][], x: number, y: number, w: number, h: number, c: Px) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) if (g[yy] && xx >= 0 && xx < TILE_PX) g[yy][xx] = c;
}

function gridToCanvas(grid: Px[][]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE_PX;
  c.height = TILE_PX;
  const ctx = c.getContext('2d')!;
  for (let y = 0; y < TILE_PX; y++)
    for (let x = 0; x < TILE_PX; x++) {
      const p = grid[y][x];
      if (!p) continue;
      ctx.fillStyle = p;
      ctx.fillRect(x, y, 1, 1);
    }
  return c;
}

const tileBuilders: Partial<Record<TileId, () => Px[][]>> = {
  grass: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // texture dots
    rect(g, 2, 3, 1, 1, PALETTE.dark);
    rect(g, 7, 5, 1, 1, PALETTE.darkest);
    rect(g, 11, 2, 1, 1, PALETTE.dark);
    rect(g, 4, 9, 1, 1, PALETTE.darkest);
    rect(g, 13, 11, 1, 1, PALETTE.dark);
    rect(g, 9, 13, 1, 1, PALETTE.dark);
    return g;
  },
  path: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 3, 4, 1, 1, PALETTE.sandShadow);
    rect(g, 9, 7, 1, 1, PALETTE.sandShadow);
    rect(g, 12, 11, 1, 1, PALETTE.sandShadow);
    rect(g, 5, 12, 1, 1, PALETTE.sandShadow);
    return g;
  },
  tree: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // canopy
    rect(g, 3, 0, 10, 9, PALETTE.dark);
    rect(g, 2, 2, 12, 5, PALETTE.dark);
    rect(g, 4, 1, 8, 1, PALETTE.darkest);
    rect(g, 3, 7, 10, 1, PALETTE.darkest);
    // highlights
    rect(g, 5, 3, 2, 1, PALETTE.mid);
    rect(g, 9, 4, 2, 1, PALETTE.mid);
    // trunk
    rect(g, 7, 9, 2, 5, PALETTE.hairBrown);
    rect(g, 7, 13, 2, 1, '#3a1f10');
    return g;
  },
  flower: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    rect(g, 6, 6, 4, 4, PALETTE.pink);
    rect(g, 7, 7, 2, 2, PALETTE.cream);
    rect(g, 7, 10, 2, 4, PALETTE.dark);
    return g;
  },
  water: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.water);
    rect(g, 2, 2, 4, 1, PALETTE.cream);
    rect(g, 8, 5, 5, 1, PALETTE.cream);
    rect(g, 4, 9, 6, 1, PALETTE.cream);
    rect(g, 10, 12, 4, 1, PALETTE.cream);
    return g;
  },
  sand: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 4, 5, 1, 1, PALETTE.sandShadow);
    rect(g, 11, 9, 1, 1, PALETTE.sandShadow);
    rect(g, 8, 12, 1, 1, PALETTE.sandShadow);
    return g;
  },
  rock: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 3, 5, 10, 8, PALETTE.rock);
    rect(g, 4, 4, 8, 1, PALETTE.rock);
    rect(g, 4, 13, 8, 1, PALETTE.rockShadow);
    rect(g, 5, 7, 2, 2, PALETTE.cream);
    return g;
  },
  rockBig: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 1, 3, 14, 12, PALETTE.rock);
    rect(g, 2, 2, 12, 1, PALETTE.rock);
    rect(g, 3, 14, 10, 1, PALETTE.rockShadow);
    rect(g, 4, 6, 3, 3, PALETTE.cream);
    rect(g, 9, 10, 4, 2, PALETTE.rockShadow);
    return g;
  },
  houseRoofL: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // roof (slope down to right? this is left half so high on left)
    rect(g, 0, 12, TILE_PX, 4, PALETTE.red);
    for (let i = 0; i < 12; i++) rect(g, 0 + i, 11 - i, TILE_PX - i, 1, PALETTE.red);
    // shading
    for (let i = 0; i < 12; i++) rect(g, 0 + i, 11 - i, 1, 1, PALETTE.redDark);
    return g;
  },
  houseRoofR: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    rect(g, 0, 12, TILE_PX, 4, PALETTE.red);
    for (let i = 0; i < 12; i++) rect(g, 0, 11 - i, TILE_PX - i, 1, PALETTE.red);
    for (let i = 0; i < 12; i++) rect(g, TILE_PX - 1 - i, 11 - i, 1, 1, PALETTE.redDark);
    return g;
  },
  houseBodyL: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.cream);
    // window
    rect(g, 4, 4, 6, 6, PALETTE.blue);
    rect(g, 4, 4, 6, 1, PALETTE.frame);
    rect(g, 4, 9, 6, 1, PALETTE.frame);
    rect(g, 4, 4, 1, 6, PALETTE.frame);
    rect(g, 9, 4, 1, 6, PALETTE.frame);
    // crossbar
    rect(g, 6, 4, 1, 6, PALETTE.frame);
    rect(g, 4, 7, 6, 1, PALETTE.frame);
    return g;
  },
  houseBodyR: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.cream);
    rect(g, 6, 4, 6, 6, PALETTE.blue);
    rect(g, 6, 4, 6, 1, PALETTE.frame);
    rect(g, 6, 9, 6, 1, PALETTE.frame);
    rect(g, 6, 4, 1, 6, PALETTE.frame);
    rect(g, 11, 4, 1, 6, PALETTE.frame);
    rect(g, 8, 4, 1, 6, PALETTE.frame);
    rect(g, 6, 7, 6, 1, PALETTE.frame);
    return g;
  },
  houseDoor: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.cream);
    rect(g, 4, 2, 8, 14, PALETTE.hairBrown);
    rect(g, 4, 2, 8, 1, PALETTE.frame);
    rect(g, 4, 2, 1, 14, PALETTE.frame);
    rect(g, 11, 2, 1, 14, PALETTE.frame);
    // knob
    rect(g, 9, 9, 1, 1, PALETTE.yellow);
    return g;
  },
  fence: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // crossbeams (horizontal fence)
    rect(g, 0, 6, TILE_PX, 1, PALETTE.hairBrown);
    rect(g, 0, 11, TILE_PX, 1, PALETTE.hairBrown);
    // posts
    rect(g, 1, 3, 2, 12, PALETTE.hairBrown);
    rect(g, 7, 3, 2, 12, PALETTE.hairBrown);
    rect(g, 13, 3, 2, 12, PALETTE.hairBrown);
    return g;
  },
  goat: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // body
    rect(g, 4, 7, 8, 4, PALETTE.hairBrown);
    rect(g, 5, 6, 6, 1, PALETTE.hairBrown);
    rect(g, 4, 11, 8, 1, '#3a1f10');
    // head
    rect(g, 10, 5, 3, 3, PALETTE.hairBrown);
    // horns
    rect(g, 10, 4, 1, 1, PALETTE.cream);
    rect(g, 12, 4, 1, 1, PALETTE.cream);
    // eye
    rect(g, 11, 6, 1, 1, PALETTE.frame);
    // legs
    rect(g, 5, 12, 1, 3, PALETTE.frame);
    rect(g, 7, 12, 1, 3, PALETTE.frame);
    rect(g, 9, 12, 1, 3, PALETTE.frame);
    rect(g, 11, 12, 1, 3, PALETTE.frame);
    return g;
  },
  goatTracks: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 4, 5, 1, 2, PALETTE.sandShadow);
    rect(g, 6, 5, 1, 2, PALETTE.sandShadow);
    rect(g, 9, 9, 1, 2, PALETTE.sandShadow);
    rect(g, 11, 9, 1, 2, PALETTE.sandShadow);
    return g;
  },
  chicken: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // body
    rect(g, 5, 7, 7, 6, PALETTE.cream);
    // outline
    rect(g, 4, 8, 1, 5, PALETTE.frame);
    rect(g, 12, 8, 1, 5, PALETTE.frame);
    rect(g, 5, 6, 7, 1, PALETTE.frame);
    rect(g, 5, 13, 7, 1, PALETTE.frame);
    // head
    rect(g, 8, 4, 4, 3, PALETTE.cream);
    rect(g, 8, 3, 4, 1, PALETTE.frame);
    rect(g, 7, 4, 1, 3, PALETTE.frame);
    rect(g, 12, 4, 1, 3, PALETTE.frame);
    // comb
    rect(g, 9, 2, 2, 1, PALETTE.red);
    // beak
    rect(g, 12, 5, 1, 1, PALETTE.yellow);
    // eye
    rect(g, 10, 5, 1, 1, PALETTE.frame);
    // legs
    rect(g, 6, 14, 1, 1, PALETTE.yellow);
    rect(g, 10, 14, 1, 1, PALETTE.yellow);
    return g;
  },
  fenceV: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // vertical posts
    rect(g, 6, 0, 1, TILE_PX, PALETTE.hairBrown);
    rect(g, 11, 0, 1, TILE_PX, PALETTE.hairBrown);
    // horizontal cross-beams
    rect(g, 3, 1, 12, 2, PALETTE.hairBrown);
    rect(g, 3, 7, 12, 2, PALETTE.hairBrown);
    rect(g, 3, 13, 12, 2, PALETTE.hairBrown);
    return g;
  },
  sign: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.cream);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    rect(g, 5, 5, 6, 1, PALETTE.frame);
    rect(g, 5, 7, 6, 1, PALETTE.frame);
    return g;
  },
  signSchool: () => {
    // Apple-red placard with a chalkboard "א" on it (school).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.red);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // mini chalkboard
    rect(g, 5, 4, 6, 4, PALETTE.darkest);
    rect(g, 6, 5, 1, 2, PALETTE.cream);
    rect(g, 8, 5, 1, 2, PALETTE.cream);
    rect(g, 7, 6, 2, 1, PALETTE.cream);
    return g;
  },
  signLibrary: () => {
    // Brown placard with a book icon (library).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.cream);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // open book
    rect(g, 5, 4, 6, 4, PALETTE.cream);
    rect(g, 5, 4, 6, 1, PALETTE.frame);
    rect(g, 5, 7, 6, 1, PALETTE.frame);
    rect(g, 5, 4, 1, 4, PALETTE.frame);
    rect(g, 10, 4, 1, 4, PALETTE.frame);
    rect(g, 7, 4, 2, 4, PALETTE.frame);
    rect(g, 6, 5, 1, 1, PALETTE.blue);
    rect(g, 9, 5, 1, 1, PALETTE.blue);
    return g;
  },
  signBus: () => {
    // Yellow placard with a bus icon (bus stop).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.yellow);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // bus body
    rect(g, 4, 5, 8, 3, PALETTE.frame);
    rect(g, 5, 5, 1, 1, PALETTE.cream);
    rect(g, 7, 5, 1, 1, PALETTE.cream);
    rect(g, 9, 5, 1, 1, PALETTE.cream);
    rect(g, 5, 7, 1, 1, PALETTE.darkest);
    rect(g, 10, 7, 1, 1, PALETTE.darkest);
    return g;
  },
  signTower: () => {
    // Stone placard with crenellation (Tower of David).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.rock);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // crenellation
    rect(g, 5, 4, 1, 1, PALETTE.frame);
    rect(g, 7, 4, 1, 1, PALETTE.frame);
    rect(g, 9, 4, 1, 1, PALETTE.frame);
    rect(g, 5, 5, 6, 1, PALETTE.frame);
    rect(g, 6, 6, 1, 2, PALETTE.darkest);
    rect(g, 9, 6, 1, 2, PALETTE.darkest);
    return g;
  },
  signKotel: () => {
    // Sandstone placard with kotel block lines + a small Star of David (Western Wall).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.cream);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // stone block lines
    rect(g, 4, 5, 8, 1, PALETTE.frame);
    rect(g, 4, 7, 8, 1, PALETTE.frame);
    rect(g, 6, 4, 1, 1, PALETTE.frame);
    rect(g, 9, 6, 1, 1, PALETTE.frame);
    // star (blue dot)
    rect(g, 8, 6, 1, 1, PALETTE.blue);
    return g;
  },
  signMarket: () => {
    // Striped placard (red/yellow/green) for Mahane Yehuda market.
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.cream);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    rect(g, 4, 4, 8, 1, PALETTE.red);
    rect(g, 4, 5, 8, 1, PALETTE.yellow);
    rect(g, 4, 6, 8, 1, PALETTE.dark);
    rect(g, 4, 7, 8, 1, PALETTE.red);
    return g;
  },
  signTayelet: () => {
    // Sky-blue placard with a panorama horizon line (promenade).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.blue);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // sun
    rect(g, 9, 4, 2, 2, PALETTE.yellow);
    // horizon (city skyline)
    rect(g, 4, 6, 8, 1, PALETTE.cream);
    rect(g, 5, 5, 1, 1, PALETTE.cream);
    rect(g, 7, 5, 1, 1, PALETTE.cream);
    // ground
    rect(g, 4, 7, 8, 1, PALETTE.dark);
    return g;
  },
  signCenter: () => {
    // White placard with a flag of Israel (city center plaza).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.cream);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // blue stripes
    rect(g, 4, 4, 8, 1, PALETTE.blue);
    rect(g, 4, 7, 8, 1, PALETTE.blue);
    // star
    rect(g, 7, 5, 2, 2, PALETTE.blue);
    rect(g, 7, 6, 2, 1, PALETTE.cream);
    return g;
  },
  signCeremony: () => {
    // Gold placard with star (Yom Yerushalayim ceremony).
    const g = blank();
    rect(g, 7, 8, 2, 6, PALETTE.hairBrown);
    rect(g, 3, 3, 10, 6, PALETTE.yellow);
    rect(g, 3, 3, 10, 1, PALETTE.frame);
    rect(g, 3, 8, 10, 1, PALETTE.frame);
    rect(g, 3, 3, 1, 6, PALETTE.frame);
    rect(g, 12, 3, 1, 6, PALETTE.frame);
    // big star of david
    rect(g, 7, 4, 2, 1, PALETTE.blue);
    rect(g, 5, 5, 6, 1, PALETTE.blue);
    rect(g, 6, 6, 4, 1, PALETTE.blue);
    rect(g, 5, 7, 6, 1, PALETTE.blue);
    return g;
  },
  carpet: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.red);
    rect(g, 1, 1, 14, 14, PALETTE.redDark);
    rect(g, 3, 3, 10, 10, PALETTE.red);
    rect(g, 7, 7, 2, 2, PALETTE.yellow);
    return g;
  },
  wallStone: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.rock);
    rect(g, 0, 0, TILE_PX, 1, PALETTE.rockShadow);
    rect(g, 0, 7, TILE_PX, 1, PALETTE.rockShadow);
    rect(g, 0, 15, TILE_PX, 1, PALETTE.rockShadow);
    rect(g, 5, 1, 1, 6, PALETTE.rockShadow);
    rect(g, 11, 8, 1, 7, PALETTE.rockShadow);
    return g;
  },
  floorWood: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.hairBrown);
    rect(g, 0, 0, TILE_PX, 1, PALETTE.frame);
    rect(g, 0, 7, TILE_PX, 1, PALETTE.frame);
    rect(g, 0, 15, TILE_PX, 1, PALETTE.frame);
    return g;
  },
  campfire: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // stone ring
    rect(g, 2, 11, 12, 4, PALETTE.rock);
    rect(g, 2, 14, 12, 1, PALETTE.rockShadow);
    // logs
    rect(g, 4, 9, 8, 2, PALETTE.hairBrown);
    rect(g, 5, 7, 6, 2, PALETTE.hairBrown);
    // flame
    rect(g, 6, 3, 4, 4, PALETTE.yellow);
    rect(g, 7, 1, 2, 2, PALETTE.cream);
    rect(g, 5, 4, 1, 2, PALETTE.red);
    rect(g, 10, 4, 1, 2, PALETTE.red);
    return g;
  },
  tent: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // tent body (triangle)
    for (let i = 0; i < 12; i++) {
      const w = TILE_PX - i * 1;
      const off = (TILE_PX - w) / 2;
      rect(g, off, 3 + i, w, 1, i % 2 === 0 ? PALETTE.red : PALETTE.redDark);
    }
    // pole
    rect(g, 7, 1, 1, 4, PALETTE.frame);
    // door
    rect(g, 6, 8, 4, 7, PALETTE.frame);
    return g;
  },
  cactus: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 6, 3, 4, 12, PALETTE.dark);
    rect(g, 3, 6, 4, 5, PALETTE.dark);
    rect(g, 9, 5, 4, 5, PALETTE.dark);
    // outlines
    rect(g, 6, 3, 1, 12, PALETTE.darkest);
    rect(g, 9, 3, 1, 12, PALETTE.darkest);
    rect(g, 3, 6, 1, 5, PALETTE.darkest);
    rect(g, 9, 5, 1, 5, PALETTE.darkest);
    // spines
    rect(g, 7, 6, 1, 1, PALETTE.cream);
    rect(g, 7, 10, 1, 1, PALETTE.cream);
    return g;
  },
  sandDune: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    rect(g, 0, 7, TILE_PX, 1, PALETTE.sandShadow);
    rect(g, 4, 4, 8, 1, PALETTE.sandShadow);
    rect(g, 8, 11, 6, 1, PALETTE.sandShadow);
    return g;
  },
  cliff: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.rockShadow);
    rect(g, 0, 0, TILE_PX, 4, PALETTE.rock);
    rect(g, 0, 4, TILE_PX, 1, PALETTE.frame);
    rect(g, 3, 6, 1, 4, PALETTE.frame);
    rect(g, 8, 9, 1, 5, PALETTE.frame);
    rect(g, 12, 7, 1, 6, PALETTE.frame);
    return g;
  },
  lemonTree: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.mid);
    // canopy darker green
    rect(g, 3, 0, 10, 9, PALETTE.dark);
    rect(g, 2, 2, 12, 5, PALETTE.dark);
    rect(g, 4, 1, 8, 1, PALETTE.darkest);
    rect(g, 3, 7, 10, 1, PALETTE.darkest);
    // yellow lemons (3 of them)
    rect(g, 5, 3, 2, 2, PALETTE.yellow);
    rect(g, 9, 2, 2, 2, PALETTE.yellow);
    rect(g, 10, 5, 2, 2, PALETTE.yellow);
    rect(g, 4, 5, 2, 2, PALETTE.yellow);
    // lemon shadows
    rect(g, 6, 4, 1, 1, '#c08818');
    rect(g, 10, 3, 1, 1, '#c08818');
    rect(g, 11, 6, 1, 1, '#c08818');
    rect(g, 5, 6, 1, 1, '#c08818');
    // trunk
    rect(g, 7, 9, 2, 5, PALETTE.hairBrown);
    rect(g, 7, 13, 2, 1, '#3a1f10');
    return g;
  },
  iceChest: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.cream);
    // body of fridge/cooler - white-blue
    rect(g, 2, 3, 12, 11, '#d8e8f8');
    // outline
    rect(g, 2, 3, 12, 1, PALETTE.frame);
    rect(g, 2, 13, 12, 1, PALETTE.frame);
    rect(g, 2, 3, 1, 11, PALETTE.frame);
    rect(g, 13, 3, 1, 11, PALETTE.frame);
    // lid line
    rect(g, 3, 6, 10, 1, PALETTE.frame);
    // ice cubes pattern on top
    rect(g, 5, 4, 2, 2, PALETTE.water);
    rect(g, 9, 4, 2, 2, PALETTE.water);
    // handle
    rect(g, 6, 9, 4, 1, PALETTE.frame);
    rect(g, 6, 9, 1, 2, PALETTE.frame);
    rect(g, 9, 9, 1, 2, PALETTE.frame);
    // shadow base
    rect(g, 1, 14, 14, 1, PALETTE.shadow);
    return g;
  },
  thymeBush: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // bush body
    rect(g, 3, 6, 10, 8, PALETTE.dark);
    rect(g, 4, 4, 8, 2, PALETTE.dark);
    rect(g, 5, 3, 6, 1, PALETTE.dark);
    // small purple flowers (thyme blossoms)
    rect(g, 5, 7, 1, 1, PALETTE.pink);
    rect(g, 8, 5, 1, 1, PALETTE.pink);
    rect(g, 11, 8, 1, 1, PALETTE.pink);
    rect(g, 7, 10, 1, 1, PALETTE.pink);
    rect(g, 4, 11, 1, 1, PALETTE.pink);
    rect(g, 10, 11, 1, 1, PALETTE.pink);
    // highlights
    rect(g, 6, 5, 1, 1, PALETTE.mid);
    rect(g, 9, 7, 1, 1, PALETTE.mid);
    return g;
  },
  photoSpot: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // tripod base
    rect(g, 6, 12, 1, 3, PALETTE.frame);
    rect(g, 9, 12, 1, 3, PALETTE.frame);
    rect(g, 4, 14, 8, 1, PALETTE.frame);
    // post
    rect(g, 7, 6, 2, 7, PALETTE.frame);
    // camera body
    rect(g, 4, 3, 8, 5, PALETTE.frame);
    rect(g, 5, 4, 6, 3, PALETTE.rockShadow);
    // lens
    rect(g, 6, 5, 4, 2, PALETTE.yellow);
    rect(g, 7, 5, 2, 1, PALETTE.cream);
    // viewfinder
    rect(g, 11, 2, 2, 2, PALETTE.frame);
    return g;
  },
  sleepingBag: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // bag body
    rect(g, 2, 7, 12, 7, PALETTE.red);
    rect(g, 2, 7, 12, 1, PALETTE.redDark);
    rect(g, 2, 13, 12, 1, PALETTE.redDark);
    // pillow head
    rect(g, 3, 4, 6, 4, PALETTE.cream);
    rect(g, 3, 4, 6, 1, PALETTE.frame);
    // zipper
    rect(g, 8, 8, 1, 5, PALETTE.yellow);
    return g;
  },
  car: () => {
    const g = blank();
    rect(g, 0, 0, TILE_PX, TILE_PX, PALETTE.sand);
    // body
    rect(g, 1, 6, 14, 6, PALETTE.blue);
    rect(g, 1, 6, 14, 1, PALETTE.blueDark);
    rect(g, 1, 11, 14, 1, PALETTE.blueDark);
    // windshield
    rect(g, 4, 4, 8, 2, PALETTE.cream);
    rect(g, 4, 4, 8, 1, PALETTE.frame);
    // wheels
    rect(g, 2, 12, 3, 2, PALETTE.frame);
    rect(g, 11, 12, 3, 2, PALETTE.frame);
    // headlights
    rect(g, 1, 7, 1, 2, PALETTE.yellow);
    rect(g, 14, 7, 1, 2, PALETTE.yellow);
    return g;
  },
};

const tileCache = new Map<TileId, HTMLCanvasElement>();

// PNG tileset support: maps each TileId to (sheet, col, row) within the
// 8x8 sheets at /sprites/{town,desert}_tileset.png.  When a tileset PNG
// has loaded, getTileSprite returns the cached PNG cell; otherwise it falls
// back to the procedural tile.
type SheetKey = 'town' | 'desert' | 'signs' | 'interior';

// Per-sheet expected grid dimensions.  Most sheets are 8x8 but the signs sheet
// is a smaller 3x3 — pass these to detectGrid so it doesn't over-trim.
const SHEET_DIMS: Record<SheetKey, { cols: number; rows: number }> = {
  town: { cols: 8, rows: 8 },
  desert: { cols: 8, rows: 8 },
  signs: { cols: 3, rows: 3 },
  interior: { cols: 8, rows: 8 },
};
const TILESET_MAP: Partial<Record<TileId, { sheet: SheetKey; col: number; row: number; flipH?: boolean }>> = {
  // Jerusalem-themed town tileset (8x8 grid)
  // Row 0: limestone variations + fountain
  grass: { sheet: 'town', col: 0, row: 0 }, // limestone (Jerusalem has stone schoolyards)
  path: { sheet: 'town', col: 0, row: 0 }, // limestone path
  sand: { sheet: 'town', col: 1, row: 0 }, // limestone with pebbles
  floorWood: { sheet: 'town', col: 2, row: 0 }, // cobblestones
  water: { sheet: 'town', col: 6, row: 0 }, // fountain water
  // Row 1: trees - olive is signature
  tree: { sheet: 'town', col: 0, row: 1 }, // olive tree
  flower: { sheet: 'town', col: 5, row: 1 }, // lavender (purple flowers)
  lemonTree: { sheet: 'town', col: 7, row: 1 }, // pomegranate (market produce)
  // Row 2: walls and openings - Jerusalem stone
  wallStone: { sheet: 'town', col: 0, row: 2 }, // sandstone wall light
  houseRoofL: { sheet: 'town', col: 1, row: 2 }, // sandstone wall dark (top)
  houseRoofR: { sheet: 'town', col: 1, row: 2, flipH: true },
  houseBodyL: { sheet: 'town', col: 0, row: 2 }, // sandstone wall light (middle)
  houseBodyR: { sheet: 'town', col: 0, row: 2, flipH: true },
  houseDoor: { sheet: 'town', col: 5, row: 2 }, // wooden door
  fence: { sheet: 'town', col: 6, row: 2 }, // iron gate
  fenceV: { sheet: 'town', col: 6, row: 2, flipH: true },
  // Row 3: market stalls + colors
  carpet: { sheet: 'town', col: 3, row: 2 }, // blue-tile (Armenian quarter / decorative)
  // Row 5: Tower of David / signs
  sign: { sheet: 'town', col: 7, row: 5 }, // historical sign with Hebrew text

  // ===== Location-specific signs (signs_tileset.png, 3x3) =====
  signSchool:   { sheet: 'signs', col: 0, row: 0 },
  signLibrary:  { sheet: 'signs', col: 1, row: 0 },
  signBus:      { sheet: 'signs', col: 2, row: 0 },
  signTower:    { sheet: 'signs', col: 0, row: 1 },
  signKotel:    { sheet: 'signs', col: 1, row: 1 },
  signMarket:   { sheet: 'signs', col: 2, row: 1 },
  signTayelet:  { sheet: 'signs', col: 0, row: 2 },
  signCenter:   { sheet: 'signs', col: 1, row: 2 },
  signCeremony: { sheet: 'signs', col: 2, row: 2 },

  // ===== Interior tileset (interior_tileset.png, 8x8) =====
  // Row 0: floors
  parquetFloor:    { sheet: 'interior', col: 0, row: 0 },
  woodFloor:       { sheet: 'interior', col: 1, row: 0 },
  checkeredFloor:  { sheet: 'interior', col: 2, row: 0 },
  redCarpetFloor:  { sheet: 'interior', col: 3, row: 0 },
  mosaicFloor:     { sheet: 'interior', col: 5, row: 0 },
  marbleFloor:     { sheet: 'interior', col: 6, row: 0 },
  // Row 1: walls + windows
  plainWall:       { sheet: 'interior', col: 0, row: 1 },
  paintingWall:    { sheet: 'interior', col: 1, row: 1 },
  shuttersWall:    { sheet: 'interior', col: 2, row: 1 },
  windowViewWall:  { sheet: 'interior', col: 3, row: 1 },
  brickWall:       { sheet: 'interior', col: 4, row: 1 },
  // Row 2: classroom
  chalkboard:      { sheet: 'interior', col: 0, row: 2 },
  whiteboard:      { sheet: 'interior', col: 1, row: 2 },
  studentDesk:     { sheet: 'interior', col: 2, row: 2 },
  teacherDesk:     { sheet: 'interior', col: 3, row: 2 },
  wallLectern:     { sheet: 'interior', col: 4, row: 2 },
  israelMap:       { sheet: 'interior', col: 5, row: 2 },
  pencilCup:       { sheet: 'interior', col: 6, row: 2 },
  backpack:        { sheet: 'interior', col: 7, row: 2 },
  // Row 3: library
  bookshelfTall:   { sheet: 'interior', col: 0, row: 3 },
  bookshelfWithSign: { sheet: 'interior', col: 2, row: 3 },
  librarianDesk:   { sheet: 'interior', col: 3, row: 3 },
  readingLamp:     { sheet: 'interior', col: 4, row: 3 },
  globe:           { sheet: 'interior', col: 5, row: 3 },
  encyclopedia:    { sheet: 'interior', col: 6, row: 3 },
  ladder:          { sheet: 'interior', col: 7, row: 3 },
  // Row 4: museum
  artifactCase:    { sheet: 'interior', col: 0, row: 4 },
  vaseCase:        { sheet: 'interior', col: 1, row: 4 },
  archScroll:      { sheet: 'interior', col: 2, row: 4 },
  menorahDisplay:  { sheet: 'interior', col: 3, row: 4 },
  museumLectern:   { sheet: 'interior', col: 4, row: 4 },
  coinsDisplay:    { sheet: 'interior', col: 5, row: 4 },
  archeoTools:     { sheet: 'interior', col: 6, row: 4 },
  modelCity:       { sheet: 'interior', col: 7, row: 4 },
  // Row 5: furniture
  woodChair:       { sheet: 'interior', col: 0, row: 5 },
  woodTable:       { sheet: 'interior', col: 1, row: 5 },
  roundTable:      { sheet: 'interior', col: 2, row: 5 },
  redSofa:         { sheet: 'interior', col: 4, row: 5 },
  blueSofa:        { sheet: 'interior', col: 5, row: 5 },
  nightstand:      { sheet: 'interior', col: 7, row: 5 },
  // Row 6: misc
  israelFlagPole:  { sheet: 'interior', col: 0, row: 6 },
  jerusalemFlagPole: { sheet: 'interior', col: 1, row: 6 },
  topiary:         { sheet: 'interior', col: 3, row: 6 },
  shemaSign:       { sheet: 'interior', col: 4, row: 6 },
  chandelier:      { sheet: 'interior', col: 5, row: 6 },
  domeLamp:        { sheet: 'interior', col: 6, row: 6 },
  exitSign:        { sheet: 'interior', col: 7, row: 6 },
  // Row 7: doors + stairs
  glassDoor:       { sheet: 'interior', col: 1, row: 7 },
  doubleDoor:      { sheet: 'interior', col: 2, row: 7 },
  stairsUp:        { sheet: 'interior', col: 3, row: 7 },
  stairsDown:      { sheet: 'interior', col: 4, row: 7 },
  darkDoor:        { sheet: 'interior', col: 5, row: 7 },
  interiorArchway: { sheet: 'interior', col: 6, row: 7 },
  museumEntrance:  { sheet: 'interior', col: 7, row: 7 },
  // Row 7: vehicles
  car: { sheet: 'town', col: 4, row: 7 }, // schoolbus (perfect for school trip!)

  // ===== Additional Jerusalem-themed tiles =====
  // Row 0
  fountain: { sheet: 'town', col: 5, row: 0 },
  fountainWater: { sheet: 'town', col: 6, row: 0 },
  // Row 1: trees
  oliveTree: { sheet: 'town', col: 0, row: 1 },
  figTree: { sheet: 'town', col: 1, row: 1 },
  cypressTree: { sheet: 'town', col: 2, row: 1 },
  palmTree: { sheet: 'town', col: 3, row: 1 },
  pomegranateTree: { sheet: 'town', col: 7, row: 1 },
  // Row 2: walls / openings
  archway: { sheet: 'town', col: 2, row: 2 },
  blueTile: { sheet: 'town', col: 3, row: 2 },
  plantPot: { sheet: 'town', col: 7, row: 2 },
  // Row 3: market
  stallRed: { sheet: 'town', col: 0, row: 3 },
  stallYellow: { sheet: 'town', col: 1, row: 3 },
  stallGreen: { sheet: 'town', col: 2, row: 3 },
  spices: { sheet: 'town', col: 3, row: 3 },
  bread: { sheet: 'town', col: 4, row: 3 },
  pitaOven: { sheet: 'town', col: 5, row: 3 },
  hummus: { sheet: 'town', col: 6, row: 3 },
  cafeTable: { sheet: 'town', col: 7, row: 3 },
  // Row 4: religious / Western Wall
  kotelStones: { sheet: 'town', col: 0, row: 4 },
  kotelNotes: { sheet: 'town', col: 1, row: 4 },
  prayerBook: { sheet: 'town', col: 2, row: 4 },
  oilLamp: { sheet: 'town', col: 3, row: 4 },
  mezuzah: { sheet: 'town', col: 5, row: 4 },
  starOfDavid: { sheet: 'town', col: 6, row: 4 },
  aleph: { sheet: 'town', col: 7, row: 4 },
  // Row 5: Tower of David / flags
  towerCrenellation: { sheet: 'town', col: 0, row: 5 },
  towerWindow: { sheet: 'town', col: 1, row: 5 },
  towerBase: { sheet: 'town', col: 2, row: 5 },
  watchtower: { sheet: 'town', col: 3, row: 5 },
  israelFlag: { sheet: 'town', col: 4, row: 5 },
  jerusalemFlag: { sheet: 'town', col: 5, row: 5 },
  cannon: { sheet: 'town', col: 6, row: 5 },
  // Row 6: tayelet / road
  tayeletBench: { sheet: 'town', col: 0, row: 6 },
  tayeletRail: { sheet: 'town', col: 1, row: 6 },
  binoculars: { sheet: 'town', col: 2, row: 6 },
  panorama: { sheet: 'town', col: 3, row: 6 },
  road: { sheet: 'town', col: 4, row: 6 },
  crossing: { sheet: 'town', col: 5, row: 6 },
  lampPost: { sheet: 'town', col: 7, row: 6 },
  // Row 7: vehicles
  tourBus: { sheet: 'town', col: 0, row: 7 },
  taxi: { sheet: 'town', col: 1, row: 7 },
  tram: { sheet: 'town', col: 2, row: 7 },
  ambulance: { sheet: 'town', col: 3, row: 7 },
  schoolbus: { sheet: 'town', col: 4, row: 7 },
  // Desert tileset (kept for engine parity but not used in Yom Yerushalayim)
  sandDune: { sheet: 'desert', col: 4, row: 0 },
  rock: { sheet: 'desert', col: 0, row: 1 },
  rockBig: { sheet: 'desert', col: 1, row: 1 },
  cactus: { sheet: 'desert', col: 0, row: 2 },
  tent: { sheet: 'desert', col: 4, row: 3 },
  campfire: { sheet: 'desert', col: 5, row: 3 },
  sleepingBag: { sheet: 'desert', col: 6, row: 3 },
  photoSpot: { sheet: 'desert', col: 0, row: 4 },
  cliff: { sheet: 'desert', col: 0, row: 7 },
  goat: { sheet: 'desert', col: 0, row: 6 },
  goatTracks: { sheet: 'desert', col: 1, row: 6 },
};

const tilesheetState = new Map<SheetKey, 'loading' | 'loaded' | 'error'>();

function isTileBackgroundPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 30) return true;
  return r > 220 && g > 220 && b > 220;
}

function findTileContentBounds(
  data: ImageData,
): { x: number; y: number; w: number; h: number } | null {
  const { width, height, data: pixels } = data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isTileBackgroundPixel(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3])) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Detect the actual cell column/row boundaries by analyzing white separators.
 * The AI tilesets have a thick outer border + inter-cell separators, so the
 * cells are NOT positioned at simple width/8 intervals.
 *
 * Returns 8 columns and 8 rows of {start, end} pixel ranges for the cell
 * content (excluding the white separators).
 */
function detectGrid(
  tctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  nCols: number = 8,
  nRows: number = 8,
): { cols: { start: number; end: number }[]; rows: { start: number; end: number }[] } {
  // For each X column, count NON-white pixels (across the full image height).
  // A column with very few non-white pixels is a separator.
  const fullData = tctx.getImageData(0, 0, width, height).data;
  const colNonWhite = new Array(width).fill(0);
  const rowNonWhite = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isTileBackgroundPixel(fullData[i], fullData[i + 1], fullData[i + 2], fullData[i + 3])) {
        colNonWhite[x]++;
        rowNonWhite[y]++;
      }
    }
  }
  // Threshold for "white column": fewer than 2% of height is non-white.
  const colThreshold = Math.max(2, Math.round(height * 0.02));
  const rowThreshold = Math.max(2, Math.round(width * 0.02));

  const findRanges = (counts: number[], threshold: number) => {
    const ranges: { start: number; end: number }[] = [];
    let inRange = false;
    let start = 0;
    for (let i = 0; i < counts.length; i++) {
      const isContent = counts[i] > threshold;
      if (isContent && !inRange) {
        start = i;
        inRange = true;
      } else if (!isContent && inRange) {
        ranges.push({ start, end: i - 1 });
        inRange = false;
      }
    }
    if (inRange) ranges.push({ start, end: counts.length - 1 });
    return ranges;
  };

  let cols = findRanges(colNonWhite, colThreshold).filter((r) => r.end - r.start >= 10);
  let rows = findRanges(rowNonWhite, rowThreshold).filter((r) => r.end - r.start >= 10);

  // Trim noise: keep only the nCols/nRows widest if we found too many.
  if (cols.length > nCols) {
    cols.sort((a, b) => b.end - b.start - (a.end - a.start));
    cols = cols.slice(0, nCols).sort((a, b) => a.start - b.start);
  }
  if (rows.length > nRows) {
    rows.sort((a, b) => b.end - b.start - (a.end - a.start));
    rows = rows.slice(0, nRows).sort((a, b) => a.start - b.start);
  }

  // If one axis didn't yield enough ranges (some cells have content blending
  // across separators), borrow positions from the other axis when the sheet
  // is square (cols==rows).
  if (cols.length < nCols && rows.length === nRows && nCols === nRows) {
    cols = rows.slice();
  } else if (rows.length < nRows && cols.length === nCols && nCols === nRows) {
    rows = cols.slice();
  }

  // Final fallback: evenly-spaced cells.
  if (cols.length < nCols || rows.length < nRows) {
    const outerBorder = Math.round(width * 0.04);
    const separator = Math.round(width * 0.02);
    const cellW = (width - outerBorder * 2 - separator * (nCols - 1)) / nCols;
    cols = [];
    for (let i = 0; i < nCols; i++) {
      const start = Math.round(outerBorder + i * (cellW + separator));
      cols.push({ start, end: Math.round(start + cellW - 1) });
    }
    const cellH = (height - outerBorder * 2 - separator * (nRows - 1)) / nRows;
    rows = [];
    for (let i = 0; i < nRows; i++) {
      const start = Math.round(outerBorder + i * (cellH + separator));
      rows.push({ start, end: Math.round(start + cellH - 1) });
    }
  }

  return { cols, rows };
}

function startTilesheetLoad(sheet: SheetKey) {
  if (tilesheetState.has(sheet)) return;
  tilesheetState.set(sheet, 'loading');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const tmp = document.createElement('canvas');
    tmp.width = img.width;
    tmp.height = img.height;
    const tctx = tmp.getContext('2d', { willReadFrequently: true })!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(img, 0, 0);
    // Detect the real cell positions (separators + outer borders make the
    // cells NOT at simple width/N spacing).  Use per-sheet dimensions.
    const dims = SHEET_DIMS[sheet];
    const { cols, rows } = detectGrid(tctx, img.width, img.height, dims.cols, dims.rows);

    // INSET=1 keeps cell-edge content (e.g. the leftmost pixel column of a
    // roof slope) without bleeding the cell outline into the bake.
    const INSET = 1;
    // Tiles are baked at TILE_SIZE with high-quality smoothing so the in-game
    // render is just a 1:1 blit (preserves detail; no nearest-neighbor crush).
    for (const id of Object.keys(TILESET_MAP) as TileId[]) {
      const m = TILESET_MAP[id];
      if (!m || m.sheet !== sheet) continue;
      const colRange = cols[m.col];
      const rowRange = rows[m.row];
      if (!colRange || !rowRange) continue;
      const sx = colRange.start + INSET;
      const sy = rowRange.start + INSET;
      const sw = colRange.end - colRange.start + 1 - INSET * 2;
      const sh = rowRange.end - rowRange.start + 1 - INSET * 2;

      // First, extract the raw cell into a temp canvas (used for transparency stripping).
      const raw = document.createElement('canvas');
      raw.width = sw;
      raw.height = sh;
      const rctx = raw.getContext('2d', { willReadFrequently: true })!;
      rctx.imageSmoothingEnabled = false;
      rctx.drawImage(tmp, sx, sy, sw, sh, 0, 0, sw, sh);

      // Object tiles get transparent backgrounds.
      if (!isGroundTile(id)) {
        try {
          const data = rctx.getImageData(0, 0, sw, sh);
          const px = data.data;
          for (let i = 0; i < px.length; i += 4) {
            if (isTileBackgroundPixel(px[i], px[i + 1], px[i + 2], px[i + 3])) {
              px[i + 3] = 0;
            }
          }
          rctx.putImageData(data, 0, 0);
        } catch {
          // CORS-tainted: leave opaque
        }
      }

      // Bake to TILE_SIZE x TILE_SIZE with HQ smoothing, optionally mirrored
      // horizontally for tiles flagged with flipH (right house halves).
      const out = document.createElement('canvas');
      out.width = TILE_SIZE;
      out.height = TILE_SIZE;
      const octx = out.getContext('2d')!;
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      if (m.flipH) {
        octx.save();
        octx.translate(TILE_SIZE, 0);
        octx.scale(-1, 1);
        octx.drawImage(raw, 0, 0, sw, sh, 0, 0, TILE_SIZE, TILE_SIZE);
        octx.restore();
      } else {
        octx.drawImage(raw, 0, 0, sw, sh, 0, 0, TILE_SIZE, TILE_SIZE);
      }

      tileCache.set(id, out);
    }
    tilesheetState.set(sheet, 'loaded');
  };
  img.onerror = () => tilesheetState.set(sheet, 'error');
  img.src = `/sprites/${sheet}_tileset.png`;
}

function isGroundTile(id: TileId): boolean {
  return (
    id === 'grass' || id === 'sand' || id === 'path' || id === 'water' ||
    id === 'floorWood' || id === 'carpet' ||
    id === 'parquetFloor' || id === 'woodFloor' || id === 'checkeredFloor' ||
    id === 'redCarpetFloor' || id === 'mosaicFloor' || id === 'marbleFloor'
  );
}

/** Pre-load all tilesets so the game starts with tiles ready. */
export function preloadTilesheets() {
  startTilesheetLoad('town');
  startTilesheetLoad('desert');
  startTilesheetLoad('signs');
  startTilesheetLoad('interior');
}

/** Whether all tilesets have finished loading (or errored). */
export function areTilesheetsReady(): boolean {
  for (const k of ['town', 'desert', 'signs', 'interior'] as SheetKey[]) {
    const s = tilesheetState.get(k);
    if (s !== 'loaded' && s !== 'error') return false;
  }
  return true;
}

export function getTileSprite(id: TileId): HTMLCanvasElement {
  // Trigger tileset load if mapped.
  const m = TILESET_MAP[id];
  if (m) startTilesheetLoad(m.sheet);

  const cached = tileCache.get(id);
  if (cached) return cached;
  // Fallback to procedural while loading or for unmapped tiles.  Some new
  // Jerusalem-themed tile ids have no procedural builder - we render a
  // transparent placeholder until the PNG tile loads.
  const builder = tileBuilders[id];
  let canvas: HTMLCanvasElement;
  if (builder) {
    canvas = gridToCanvas(builder());
  } else {
    // No procedural fallback - return blank.  The PNG tile will replace it
    // in the cache once the sheet finishes loading.
    canvas = document.createElement('canvas');
    canvas.width = TILE_PX;
    canvas.height = TILE_PX;
  }
  if (!m || tilesheetState.get(m.sheet) === 'error') {
    tileCache.set(id, canvas);
  }
  return canvas;
}

/** Return whether a tile is collidable by default. */
export function isCollidableTile(t: TileId | null): boolean {
  if (!t) return false;
  return (
    t === 'tree' ||
    t === 'water' ||
    t === 'rock' ||
    t === 'rockBig' ||
    t === 'houseRoofL' ||
    t === 'houseRoofR' ||
    t === 'houseBodyL' ||
    t === 'houseBodyR' ||
    t === 'fence' ||
    t === 'fenceV' ||
    t === 'chicken' ||
    t === 'sign' ||
    t === 'signSchool' ||
    t === 'signLibrary' ||
    t === 'signBus' ||
    t === 'signTower' ||
    t === 'signKotel' ||
    t === 'signMarket' ||
    t === 'signTayelet' ||
    t === 'signCenter' ||
    t === 'signCeremony' ||
    t === 'wallStone' ||
    t === 'campfire' ||
    t === 'tent' ||
    t === 'cactus' ||
    t === 'cliff' ||
    t === 'kotelStones' ||
    t === 'towerCrenellation' ||
    t === 'towerWindow' ||
    t === 'towerBase' ||
    t === 'watchtower' ||
    t === 'israelFlag' ||
    t === 'jerusalemFlag' ||
    t === 'cannon' ||
    t === 'stallRed' ||
    t === 'stallYellow' ||
    t === 'stallGreen' ||
    t === 'spices' ||
    t === 'pitaOven' ||
    t === 'cafeTable' ||
    t === 'oliveTree' ||
    t === 'figTree' ||
    t === 'cypressTree' ||
    t === 'palmTree' ||
    t === 'pomegranateTree' ||
    t === 'fountain' ||
    t === 'archway' ||
    t === 'plantPot' ||
    t === 'tayeletBench' ||
    t === 'binoculars' ||
    t === 'panorama' ||
    t === 'lampPost' ||
    t === 'tourBus' ||
    t === 'taxi' ||
    t === 'tram' ||
    t === 'ambulance' ||
    t === 'schoolbus' ||
    t === 'lemonTree' ||
    t === 'iceChest' ||
    t === 'thymeBush' ||
    t === 'photoSpot' ||
    t === 'sleepingBag' ||
    t === 'car'
  );
}
