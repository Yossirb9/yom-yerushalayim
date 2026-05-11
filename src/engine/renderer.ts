import { TILE_SIZE, VIEW_TILES_W, VIEW_TILES_H } from '../constants/palette';
import { getTileSprite } from './tiles';
import { getCharacterSprite, CHARACTER_PALETTES } from './sprites';
import type { Camera } from './camera';
import type { MapDef, Direction } from '../types';

export interface NpcSnapshot {
  id: string;
  paletteKey: string;
  px: number;
  py: number;
  facing: Direction;
  walkFrame: number;
}

export function clearCanvas(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function renderMap(
  ctx: CanvasRenderingContext2D,
  map: MapDef,
  cam: Camera,
) {
  const startTx = Math.max(0, Math.floor(cam.x / TILE_SIZE));
  const endTx = Math.min(map.width - 1, Math.ceil((cam.x + VIEW_TILES_W * TILE_SIZE) / TILE_SIZE));
  const startTy = Math.max(0, Math.floor(cam.y / TILE_SIZE));
  const endTy = Math.min(map.height - 1, Math.ceil((cam.y + VIEW_TILES_H * TILE_SIZE) / TILE_SIZE));

  // ground
  for (let ty = startTy; ty <= endTy; ty++) {
    for (let tx = startTx; tx <= endTx; tx++) {
      const t = map.ground[ty]?.[tx];
      if (!t) continue;
      const sprite = getTileSprite(t);
      ctx.drawImage(sprite, tx * TILE_SIZE - cam.x, ty * TILE_SIZE - cam.y, TILE_SIZE, TILE_SIZE);
    }
  }
  // objects
  for (let ty = startTy; ty <= endTy; ty++) {
    for (let tx = startTx; tx <= endTx; tx++) {
      const t = map.objects[ty]?.[tx];
      if (!t) continue;
      const sprite = getTileSprite(t);
      ctx.drawImage(sprite, tx * TILE_SIZE - cam.x, ty * TILE_SIZE - cam.y, TILE_SIZE, TILE_SIZE);
    }
  }
}

export function renderCharacter(
  ctx: CanvasRenderingContext2D,
  paletteKey: string,
  px: number,
  py: number,
  dir: Direction,
  walkFrame: number,
  cam: Camera,
) {
  const palette = CHARACTER_PALETTES[paletteKey];
  if (!palette) return;
  const sprite = getCharacterSprite(paletteKey, palette, dir, walkFrame);

  // shadow ellipse
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(
    px - cam.x + TILE_SIZE / 2,
    py - cam.y + TILE_SIZE - 4,
    TILE_SIZE / 2.5,
    TILE_SIZE / 8,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  const prev = ctx.imageSmoothingEnabled;
  const prevQ = ctx.imageSmoothingQuality;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sprite, px - cam.x, py - cam.y, TILE_SIZE, TILE_SIZE);
  ctx.imageSmoothingEnabled = prev;
  ctx.imageSmoothingQuality = prevQ;
}

/** Apply ambient light filter based on game time. */
export function applyAmbient(
  ctx: CanvasRenderingContext2D,
  ambient: 'town' | 'desertNight' | 'desertDay' | undefined,
  gameMinutes: number,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  if (ambient === 'desertNight') {
    ctx.fillStyle = 'rgba(20, 30, 90, 0.45)';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (ambient === 'desertDay') {
    ctx.fillStyle = 'rgba(255, 220, 150, 0.15)';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  // town - time of day
  const totalMin = gameMinutes; // since 06:00
  if (totalMin < 60 * 4) return; // morning, no filter
  if (totalMin < 60 * 9) {
    // afternoon (12:00-15:00 game) - mild warm
    ctx.fillStyle = 'rgba(255, 220, 150, 0.08)';
    ctx.fillRect(0, 0, w, h);
  } else if (totalMin < 60 * 13) {
    // evening - orange
    ctx.fillStyle = 'rgba(255, 140, 60, 0.20)';
    ctx.fillRect(0, 0, w, h);
  } else {
    // night
    ctx.fillStyle = 'rgba(20, 30, 90, 0.45)';
    ctx.fillRect(0, 0, w, h);
  }
}
