export type Direction = 'up' | 'down' | 'left' | 'right';

export type ScreenName = 'title' | 'characterSelect' | 'game' | 'menu' | 'ending';

export type TileId =
  | 'grass'
  | 'path'
  | 'tree'
  | 'flower'
  | 'water'
  | 'sand'
  | 'rock'
  | 'rockBig'
  | 'houseRoofL'
  | 'houseRoofR'
  | 'houseBodyL'
  | 'houseBodyR'
  | 'houseDoor'
  | 'fence'
  | 'fenceV'
  | 'sign'
  | 'signSchool'
  | 'signLibrary'
  | 'signBus'
  | 'signTower'
  | 'signKotel'
  | 'signMarket'
  | 'signTayelet'
  | 'signCenter'
  | 'signCeremony'
  | 'carpet'
  | 'wallStone'
  | 'floorWood'
  | 'campfire'
  | 'tent'
  | 'cactus'
  | 'sandDune'
  | 'cliff'
  | 'lemonTree'
  | 'iceChest'
  | 'thymeBush'
  | 'photoSpot'
  | 'sleepingBag'
  | 'car'
  | 'chicken'
  | 'goat'
  | 'goatTracks'
  // Jerusalem-themed
  | 'kotelStones'
  | 'kotelNotes'
  | 'towerCrenellation'
  | 'towerWindow'
  | 'towerBase'
  | 'watchtower'
  | 'israelFlag'
  | 'jerusalemFlag'
  | 'cannon'
  | 'stallRed'
  | 'stallYellow'
  | 'stallGreen'
  | 'spices'
  | 'bread'
  | 'pitaOven'
  | 'hummus'
  | 'cafeTable'
  | 'tayeletBench'
  | 'tayeletRail'
  | 'binoculars'
  | 'panorama'
  | 'oliveTree'
  | 'figTree'
  | 'cypressTree'
  | 'palmTree'
  | 'pomegranateTree'
  | 'fountain'
  | 'fountainWater'
  | 'archway'
  | 'blueTile'
  | 'plantPot'
  | 'prayerBook'
  | 'oilLamp'
  | 'mezuzah'
  | 'starOfDavid'
  | 'aleph'
  | 'lampPost'
  | 'road'
  | 'crossing'
  | 'schoolbus'
  | 'taxi'
  | 'tram'
  | 'ambulance'
  | 'tourBus'
  // Interior tileset
  | 'parquetFloor'
  | 'woodFloor'
  | 'checkeredFloor'
  | 'redCarpetFloor'
  | 'mosaicFloor'
  | 'marbleFloor'
  | 'plainWall'
  | 'paintingWall'
  | 'shuttersWall'
  | 'windowViewWall'
  | 'brickWall'
  | 'chalkboard'
  | 'whiteboard'
  | 'studentDesk'
  | 'teacherDesk'
  | 'wallLectern'
  | 'israelMap'
  | 'pencilCup'
  | 'backpack'
  | 'bookshelfTall'
  | 'bookshelfWithSign'
  | 'librarianDesk'
  | 'readingLamp'
  | 'globe'
  | 'encyclopedia'
  | 'ladder'
  | 'artifactCase'
  | 'vaseCase'
  | 'archScroll'
  | 'menorahDisplay'
  | 'museumLectern'
  | 'coinsDisplay'
  | 'archeoTools'
  | 'modelCity'
  | 'woodChair'
  | 'woodTable'
  | 'roundTable'
  | 'redSofa'
  | 'blueSofa'
  | 'nightstand'
  | 'jerusalemFlagPole'
  | 'israelFlagPole'
  | 'topiary'
  | 'shemaSign'
  | 'chandelier'
  | 'domeLamp'
  | 'exitSign'
  | 'glassDoor'
  | 'doubleDoor'
  | 'stairsUp'
  | 'stairsDown'
  | 'darkDoor'
  | 'interiorArchway'
  | 'museumEntrance';

export interface CharacterPalette {
  hair: string;
  skin: string;
  shirt: string;
  pants: string;
  accent?: string;
}

// 4 student characters for the Yom Yerushalayim game
export type PlayerTrackId = 'daniel' | 'shira' | 'uri' | 'yael';

export interface NpcDef {
  id: string;
  name: string;
  description: string;
  flavor: string;
  trackId: PlayerTrackId;
  palette: CharacterPalette;
  positions: { mapId: string; x: number; y: number; facing: Direction }[];
  wander?: { tickMs: number; range: number };
  dialogStates: string[];
}

export interface MapDef {
  id: string;
  name: string;
  width: number;
  height: number;
  ground: TileId[][];
  objects: (TileId | null)[][];
  collision: boolean[][];
  warps?: Record<string, { mapId: string; x: number; y: number; facing: Direction; flag?: string }>;
  ambient?: 'town' | 'desertNight' | 'desertDay';
}

export type QuestStatus = 'inactive' | 'active' | 'completed';

export interface QuestObjective {
  id: string;
  description: string;
  flag: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  startFlag: string;
  forTracks?: PlayerTrackId[];
  objectives: QuestObjective[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface DialogChoice {
  text: string;
  setFlags?: string[];
  giveItems?: { id: string; name: string; description: string; icon: string; count?: number }[];
  next?: string;
  requireFlag?: string;
  excludeFlag?: string;
}

export interface DialogLine {
  text: string;
  speaker?: string;
}

export interface DialogState {
  id: string;
  npcId: string;
  requireFlags?: string[];
  excludeFlags?: string[];
  forTracks?: PlayerTrackId[];
  forMapIds?: string[];
  onEnterSetFlags?: string[];
  onEnterGiveItems?: { id: string; name: string; description: string; icon: string; count?: number }[];
  lines: DialogLine[];
  choices?: DialogChoice[];
}
