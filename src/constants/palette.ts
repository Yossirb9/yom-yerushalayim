// Game Boy Color inspired palette + extra accent colors used by sprites/tiles.
export const PALETTE = {
  darkest: '#0f380f',
  dark: '#306230',
  mid: '#8bac0f',
  light: '#9bbc0f',
  cream: '#f7f5e6',
  frame: '#202020',
  // accents
  red: '#d04020',
  redDark: '#801818',
  blue: '#3070a0',
  blueDark: '#103060',
  yellow: '#f0c040',
  pink: '#f0a0c0',
  white: '#ffffff',
  black: '#000000',
  // skin tones
  skin: '#f8d098',
  skinShadow: '#c08858',
  // hair
  hairBlack: '#202020',
  hairBrown: '#603818',
  hairBlonde: '#e8c060',
  hairRed: '#a83820',
  hairGray: '#808080',
  // ground
  sand: '#e8d098',
  sandShadow: '#b89058',
  rock: '#707080',
  rockShadow: '#383848',
  water: '#3070a0',
  waterDark: '#103060',
  shadow: 'rgba(0, 0, 0, 0.35)',
} as const;

export type ColorKey = keyof typeof PALETTE;

export const TILE_PX = 16; // logical (pre-scale) tile size
export const TILE_SCALE = 3; // canvas drawn size = TILE_PX * TILE_SCALE = 48px on screen
export const TILE_SIZE = TILE_PX * TILE_SCALE; // 48

export const VIEW_TILES_W = 12; // visible columns (~576px)
export const VIEW_TILES_H = 8; // visible rows (~384px)
