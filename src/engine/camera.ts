import { TILE_SIZE, VIEW_TILES_W, VIEW_TILES_H } from '../constants/palette';

export interface Camera {
  x: number; // pixel position of camera top-left
  y: number;
}

/** Compute camera so player is centered, clamped to map bounds. */
export function followCamera(
  playerPx: number,
  playerPy: number,
  mapW: number,
  mapH: number,
): Camera {
  const viewWPx = VIEW_TILES_W * TILE_SIZE;
  const viewHPx = VIEW_TILES_H * TILE_SIZE;
  const mapWPx = mapW * TILE_SIZE;
  const mapHPx = mapH * TILE_SIZE;
  let x = playerPx - viewWPx / 2 + TILE_SIZE / 2;
  let y = playerPy - viewHPx / 2 + TILE_SIZE / 2;
  if (mapWPx <= viewWPx) x = (mapWPx - viewWPx) / 2;
  else x = Math.max(0, Math.min(x, mapWPx - viewWPx));
  if (mapHPx <= viewHPx) y = (mapHPx - viewHPx) / 2;
  else y = Math.max(0, Math.min(y, mapHPx - viewHPx));
  return { x, y };
}
