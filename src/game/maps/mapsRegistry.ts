import type { MapDef } from '../../types';
import { SCHOOL_MAP } from './schoolMap';
import { JERUSALEM_MAP } from './jerusalemMap';
import { CEREMONY_MAP } from './ceremonyMap';
import { SCHOOL_INTERIOR, LIBRARY_INTERIOR, TOWER_INTERIOR } from './interiorMaps';

export const MAPS: Record<string, MapDef> = {
  school: SCHOOL_MAP,
  jerusalem: JERUSALEM_MAP,
  ceremony: CEREMONY_MAP,
  schoolInterior: SCHOOL_INTERIOR,
  libraryInterior: LIBRARY_INTERIOR,
  towerInterior: TOWER_INTERIOR,
};

export function getMap(id: string): MapDef {
  const m = MAPS[id];
  if (!m) throw new Error(`Map not found: ${id}`);
  return m;
}
