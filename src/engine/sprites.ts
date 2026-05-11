import { PALETTE, TILE_PX, TILE_SIZE } from '../constants/palette';
import type { CharacterPalette, Direction } from '../types';

// Each character is a 16x16 pixel grid.  We render a head (top half) + body (bottom half).
// 4 directions × 4 frames per direction. Frame 0 = idle, 1 & 3 = walk-step, 2 = idle.

type Px = string | null; // null = transparent

function blank(): Px[][] {
  return Array.from({ length: TILE_PX }, () => Array<Px>(TILE_PX).fill(null));
}

// fill rect helper into pixel grid
function rect(g: Px[][], x: number, y: number, w: number, h: number, c: Px) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) if (g[yy] && xx >= 0 && xx < TILE_PX) g[yy][xx] = c;
}

function px(g: Px[][], x: number, y: number, c: Px) {
  if (g[y] && x >= 0 && x < TILE_PX) g[y][x] = c;
}

/**
 * Build character pixel grid for a given direction + frame.
 * Returns 16x16 grid.  Walk frames just shift legs by 1px.
 */
function buildCharacter(p: CharacterPalette, dir: Direction, frame: number): Px[][] {
  const g = blank();
  const outline = '#101010';
  // legs offsets per frame
  // frames: 0 idle, 1 right step, 2 idle, 3 left step
  const stepRight = frame === 1 ? 1 : 0;
  const stepLeft = frame === 3 ? 1 : 0;

  // ---- HEAD (rows 1-7) ----
  // Hair top
  rect(g, 4, 1, 8, 1, p.hair);
  rect(g, 3, 2, 10, 2, p.hair);
  // Face
  rect(g, 4, 4, 8, 3, p.skin);
  // Outline of head
  for (let x = 3; x <= 12; x++) {
    px(g, x, 1, outline);
  }
  for (let y = 1; y <= 6; y++) {
    px(g, 2, y, outline);
    px(g, 13, y, outline);
  }
  for (let x = 3; x <= 12; x++) px(g, x, 7, outline);

  // direction-specific face details
  if (dir === 'down') {
    // eyes
    px(g, 5, 5, outline);
    px(g, 10, 5, outline);
    // mouth
    px(g, 7, 6, outline);
    px(g, 8, 6, outline);
    // hair fringe
    rect(g, 4, 3, 8, 1, p.hair);
    rect(g, 5, 4, 2, 1, p.hair);
    rect(g, 9, 4, 2, 1, p.hair);
  } else if (dir === 'up') {
    // back of head
    rect(g, 4, 4, 8, 3, p.hair);
    rect(g, 3, 3, 10, 1, p.hair);
  } else if (dir === 'left') {
    // ear right side, hair on right
    rect(g, 8, 3, 4, 1, p.hair);
    rect(g, 9, 4, 3, 3, p.hair);
    // single eye on left
    px(g, 5, 5, outline);
    // mouth
    px(g, 6, 6, outline);
  } else if (dir === 'right') {
    rect(g, 4, 3, 4, 1, p.hair);
    rect(g, 4, 4, 3, 3, p.hair);
    px(g, 10, 5, outline);
    px(g, 9, 6, outline);
  }

  // ---- BODY (rows 8-13) ----
  // shirt
  rect(g, 4, 8, 8, 4, p.shirt);
  // shirt outline
  px(g, 3, 8, outline);
  px(g, 12, 8, outline);
  for (let y = 8; y <= 11; y++) {
    px(g, 3, y, outline);
    px(g, 12, y, outline);
  }
  // accent collar / belt
  if (p.accent) {
    rect(g, 5, 8, 6, 1, p.accent);
    rect(g, 4, 11, 8, 1, p.accent);
  }
  // arms (sides at row 9-10)
  // arm swing in walk frames for direction-of-motion feel
  const armSwing = frame === 1 ? -1 : frame === 3 ? 1 : 0;
  if (dir === 'left' || dir === 'right') {
    // single arm visible front; show shirt only
  } else {
    // both arms visible
    rect(g, 2, 9 + armSwing, 1, 2, p.shirt);
    rect(g, 13, 9 - armSwing, 1, 2, p.shirt);
  }

  // ---- LEGS (rows 12-14) ----
  // left leg (player's left = drawn on screen-right since facing camera; doesn't matter for this art)
  rect(g, 5, 12, 2, 2 + stepLeft, p.pants);
  rect(g, 9, 12, 2, 2 + stepRight, p.pants);
  // shoes
  rect(g, 5, 14 + stepLeft, 2, 1, outline);
  rect(g, 9, 14 + stepRight, 2, 1, outline);

  // shadow row 15
  rect(g, 4, 15, 8, 1, '#00000033');

  return g;
}

/** Convert px grid to ImageData on offscreen canvas, scale up to TILE_SIZE on use. */
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

const charCache = new Map<string, HTMLCanvasElement>();
const sheetState = new Map<string, 'loading' | 'loaded' | 'error'>();

// Direction → row index in the sprite sheet.  All AI-generated sheets in this
// project follow the same convention: row 0 = down (front), row 1 = up (back),
// row 2 = left profile, row 3 = right profile.
const DEFAULT_DIR_ROW: Record<Direction, number> = { down: 0, up: 1, left: 2, right: 3 };
const sheetDirRow = new Map<string, Record<Direction, number>>();

/**
 * Lazily load a PNG sprite sheet for a palette key (e.g. 'yossi') from /sprites/<key>.png.
 * Once loaded, slices the sheet into 16 sub-canvases (4 dirs × 4 frames) and caches them
 * under the same keys used by `getCharacterSprite`.
 */
/**
 * Decide whether a pixel is "background" (white-ish or transparent).
 * The user's sprite sheets ship with an opaque near-white background rather
 * than alpha — we treat anything close to white as background to find the
 * actual character bounds.
 */
function isBackgroundPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 30) return true;
  // near-white check (ignore alpha; the sheet is opaque)
  return r > 220 && g > 220 && b > 220;
}

/**
 * Find the bounding box of non-background pixels in image data.
 * Used to crop out the actual character from a cell that has padding/whitespace.
 */
function findContentBounds(
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
      if (!isBackgroundPixel(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3])) {
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
 * Convert pixel data to RGBA where any near-white pixel becomes transparent.
 * Mutates the ImageData in place and returns it.
 */
function makeWhiteTransparent(data: ImageData): ImageData {
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    if (isBackgroundPixel(px[i], px[i + 1], px[i + 2], px[i + 3])) {
      px[i + 3] = 0;
    }
  }
  return data;
}

/**
 * Find the actual cell column and row positions in a sprite sheet.
 * The AI sheets put a thick outer border + thin separators between cells, so
 * cells are NOT at simple width/N spacing.
 */
function detectSpriteGrid(
  tctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): { cols: { start: number; end: number }[]; rows: { start: number; end: number }[] } {
  const fullData = tctx.getImageData(0, 0, width, height).data;
  const colNonWhite = new Array(width).fill(0);
  const rowNonWhite = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isBackgroundPixel(fullData[i], fullData[i + 1], fullData[i + 2], fullData[i + 3])) {
        colNonWhite[x]++;
        rowNonWhite[y]++;
      }
    }
  }
  const colThreshold = Math.max(2, Math.round(height * 0.02));
  const rowThreshold = Math.max(2, Math.round(width * 0.02));
  const findRanges = (counts: number[], threshold: number) => {
    const ranges: { start: number; end: number }[] = [];
    let inRange = false;
    let start = 0;
    for (let i = 0; i < counts.length; i++) {
      const isContent = counts[i] > threshold;
      if (isContent && !inRange) { start = i; inRange = true; }
      else if (!isContent && inRange) { ranges.push({ start, end: i - 1 }); inRange = false; }
    }
    if (inRange) ranges.push({ start, end: counts.length - 1 });
    return ranges.filter((r) => r.end - r.start >= 30);
  };
  let cols = findRanges(colNonWhite, colThreshold);
  let rows = findRanges(rowNonWhite, rowThreshold);
  if (cols.length > 4) {
    cols.sort((a, b) => b.end - b.start - (a.end - a.start));
    cols = cols.slice(0, 4).sort((a, b) => a.start - b.start);
  }
  if (rows.length > 4) {
    rows.sort((a, b) => b.end - b.start - (a.end - a.start));
    rows = rows.slice(0, 4).sort((a, b) => a.start - b.start);
  }
  if (cols.length < 4 && rows.length === 4) cols = rows.slice();
  else if (rows.length < 4 && cols.length === 4) rows = cols.slice();
  // Fallback: simple 4-way split.
  if (cols.length < 4 || rows.length < 4) {
    cols = [];
    rows = [];
    for (let i = 0; i < 4; i++) {
      cols.push({ start: Math.round(i * width / 4) + 2, end: Math.round((i + 1) * width / 4) - 3 });
      rows.push({ start: Math.round(i * height / 4) + 2, end: Math.round((i + 1) * height / 4) - 3 });
    }
  }
  return { cols, rows };
}

function startSheetLoad(paletteKey: string) {
  if (sheetState.has(paletteKey)) return;
  sheetState.set(paletteKey, 'loading');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Draw the full sheet to a temp canvas so we can read pixel data.
    const temp = document.createElement('canvas');
    temp.width = img.width;
    temp.height = img.height;
    const tctx = temp.getContext('2d', { willReadFrequently: true })!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(img, 0, 0);

    // Detect the actual cell positions (the AI sheet has outer border +
    // separators, so cells are NOT at simple width/4 spacing).
    const { cols, rows } = detectSpriteGrid(tctx, img.width, img.height);

    interface Cell {
      dir: Direction;
      frame: number;
      sx: number;
      sy: number;
      sw: number;
      sh: number;
      cx: number;
      cy: number;
      cw: number;
      ch: number;
    }
    const cells: Cell[] = [];
    let maxW = 0;
    let maxH = 0;
    // A small extra inset to clip any thin cell-frame outlines.
    const INSET = 3;

    const dirRow: Record<Direction, number> = { ...DEFAULT_DIR_ROW };
    sheetDirRow.set(paletteKey, dirRow);

    for (let row = 0; row < 4; row++) {
      const dir = (Object.keys(dirRow) as Direction[]).find((d) => dirRow[d] === row);
      if (!dir) continue;
      const rowRange = rows[row];
      if (!rowRange) continue;
      for (let frame = 0; frame < 4; frame++) {
        const colRange = cols[frame];
        if (!colRange) continue;
        const sx = colRange.start + INSET;
        const sy = rowRange.start + INSET;
        const sw = colRange.end - colRange.start + 1 - INSET * 2;
        const sh = rowRange.end - rowRange.start + 1 - INSET * 2;
        let bbox: { x: number; y: number; w: number; h: number } | null = null;
        try {
          const data = tctx.getImageData(sx, sy, sw, sh);
          bbox = findContentBounds(data);
        } catch {
          // CORS-tainted canvas: skip bbox detection
        }
        const cx = bbox ? bbox.x : 0;
        const cy = bbox ? bbox.y : 0;
        const cw = bbox ? bbox.w : sw;
        const ch = bbox ? bbox.h : sh;
        cells.push({ dir, frame, sx, sy, sw, sh, cx, cy, cw, ch });
        if (cw > maxW) maxW = cw;
        if (ch > maxH) maxH = ch;
      }
    }

    // Pass 2: bake each cell to TILE_SIZE x TILE_SIZE with HQ smoothing so the
    // in-game render is a 1:1 blit (preserves detail, not nearest-neighbor crush).
    // We compute a uniform character height across all 16 cells, scale each
    // cell's bbox-cropped content to that height, center horizontally, and
    // bottom-align in the destination canvas.
    const targetCharH = maxH;
    let maxScaledW = 0;
    for (const c of cells) {
      const scale = targetCharH / c.ch;
      const w = c.cw * scale;
      if (w > maxScaledW) maxScaledW = w;
    }
    const outDim = Math.max(maxScaledW, targetCharH);
    const padding = Math.max(2, Math.round(outDim * 0.04));
    const sourceTargetSize = outDim + padding * 2;

    for (const c of cells) {
      // Extract cropped content into its own canvas and strip near-white background.
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = c.cw;
      cropCanvas.height = c.ch;
      const cctx = cropCanvas.getContext('2d', { willReadFrequently: true })!;
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(temp, c.sx + c.cx, c.sy + c.cy, c.cw, c.ch, 0, 0, c.cw, c.ch);
      try {
        const id = cctx.getImageData(0, 0, c.cw, c.ch);
        makeWhiteTransparent(id);
        cctx.putImageData(id, 0, 0);
      } catch {
        // CORS-tainted: skip transparency stripping
      }

      // Build a uniform-size source canvas with the character normalized to
      // a consistent height, centered horizontally, bottom-aligned.
      const scale = targetCharH / c.ch;
      const drawW = Math.round(c.cw * scale);
      const drawH = Math.round(c.ch * scale);
      const dx = Math.round((sourceTargetSize - drawW) / 2);
      const dy = sourceTargetSize - drawH - padding;

      const sourceUniform = document.createElement('canvas');
      sourceUniform.width = sourceTargetSize;
      sourceUniform.height = sourceTargetSize;
      const suctx = sourceUniform.getContext('2d')!;
      suctx.imageSmoothingEnabled = true;
      suctx.imageSmoothingQuality = 'high';
      suctx.drawImage(cropCanvas, 0, 0, c.cw, c.ch, dx, dy, drawW, drawH);

      // Final bake to a larger fixed resolution (96 = 2x TILE_SIZE).  This
      // looks crisp in the small in-game render AND in the larger character
      // select portrait, both via HQ smoothing.
      const SPRITE_BAKE = TILE_SIZE * 2;
      const out = document.createElement('canvas');
      out.width = SPRITE_BAKE;
      out.height = SPRITE_BAKE;
      const octx = out.getContext('2d')!;
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      octx.drawImage(sourceUniform, 0, 0, sourceTargetSize, sourceTargetSize, 0, 0, SPRITE_BAKE, SPRITE_BAKE);
      charCache.set(`${paletteKey}|${c.dir}|${c.frame}`, out);
    }
    sheetState.set(paletteKey, 'loaded');
  };
  img.onerror = () => {
    sheetState.set(paletteKey, 'error');
  };
  img.src = `/sprites/${paletteKey}.png`;
}

/** Pre-load every character sheet so the game starts with sprites ready. */
export function preloadCharacterSheets() {
  for (const k of Object.keys(CHARACTER_PALETTES)) startSheetLoad(k);
}

/** Whether every character sheet has finished loading (or errored). */
export function areCharacterSheetsReady(): boolean {
  for (const k of Object.keys(CHARACTER_PALETTES)) {
    const s = sheetState.get(k);
    if (s !== 'loaded' && s !== 'error') return false;
  }
  return true;
}

export function getCharacterSprite(
  paletteKey: string,
  palette: CharacterPalette,
  dir: Direction,
  frame: number,
): HTMLCanvasElement {
  // Trigger sheet load if not started; we'll switch to PNG once loaded.
  startSheetLoad(paletteKey);

  const key = `${paletteKey}|${dir}|${frame}`;
  const cached = charCache.get(key);
  if (cached) return cached;

  // Fallback: procedural sprite while PNG loads (or if it failed to load).
  const grid = buildCharacter(palette, dir, frame);
  const canvas = gridToCanvas(grid);
  // Only cache the procedural version if the sheet failed to load - otherwise
  // we want the PNG cells to take over once they arrive.
  if (sheetState.get(paletteKey) === 'error') {
    charCache.set(key, canvas);
  }
  return canvas;
}

// Preset palettes for each character
// Yom Yerushalayim student characters + NPCs
export const CHARACTER_PALETTES: Record<string, CharacterPalette> = {
  // 4 elementary school students (selectable)
  daniel: { hair: PALETTE.hairBrown, skin: PALETTE.skin, shirt: PALETTE.blue, pants: PALETTE.frame, accent: PALETTE.white },
  shira: { hair: PALETTE.hairBrown, skin: PALETTE.skin, shirt: PALETTE.pink, pants: PALETTE.blueDark, accent: PALETTE.white },
  uri: { hair: PALETTE.hairBlack, skin: PALETTE.skin, shirt: PALETTE.dark, pants: PALETTE.frame, accent: PALETTE.yellow },
  yael: { hair: PALETTE.hairBlonde, skin: PALETTE.skin, shirt: PALETTE.yellow, pants: PALETTE.frame, accent: PALETTE.red },
  // NPCs
  teacher: { hair: PALETTE.hairGray, skin: PALETTE.skin, shirt: PALETTE.red, pants: PALETTE.frame },
  librarian: { hair: PALETTE.hairBrown, skin: PALETTE.skin, shirt: PALETTE.cream, pants: PALETTE.blueDark },
  guide: { hair: PALETTE.hairBrown, skin: PALETTE.skin, shirt: PALETTE.cream, pants: PALETTE.dark, accent: PALETTE.yellow },
  vendor: { hair: PALETTE.hairGray, skin: PALETTE.skin, shirt: PALETTE.yellow, pants: PALETTE.frame, accent: PALETTE.red },
  rabbi: { hair: PALETTE.hairGray, skin: PALETTE.skin, shirt: PALETTE.frame, pants: PALETTE.frame, accent: PALETTE.cream },
  archaeologist: { hair: PALETTE.hairBrown, skin: PALETTE.skin, shirt: PALETTE.cream, pants: PALETTE.dark, accent: PALETTE.frame },
  soldier: { hair: PALETTE.hairBlack, skin: PALETTE.skin, shirt: PALETTE.dark, pants: PALETTE.dark, accent: PALETTE.yellow },
  principal: { hair: PALETTE.hairGray, skin: PALETTE.skin, shirt: PALETTE.blueDark, pants: PALETTE.frame, accent: PALETTE.cream },
};
