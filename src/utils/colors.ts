import type { Faction, PowerupType, ObjectiveType } from '../types';
import {
  ALLIANCE_BLUE, HORDE_RED, NEUTRAL_GRAY,
  SPEED_CYAN, BERSERK_ORANGE, RESTORE_GREEN,
  ALLIANCE_BASE, HORDE_BASE, NEUTRAL_BASE,
  ALLIANCE_TOWER, HORDE_TOWER, NEUTRAL_TOWER,
  ORB_PURPLE, ZONE_GREEN, NODE_GOLD,
} from './constants';

export function gyColor(f: Faction): string {
  return f === 'alliance' ? ALLIANCE_BLUE : f === 'horde' ? HORDE_RED : NEUTRAL_GRAY;
}

export function bufColor(t: PowerupType): string {
  return t === 'speed' ? SPEED_CYAN : t === 'berserk' ? BERSERK_ORANGE : RESTORE_GREEN;
}

export function objColor(t: ObjectiveType, f: Faction): string {
  if (t === 'flag') return f === 'alliance' ? ALLIANCE_BLUE : f === 'horde' ? HORDE_RED : NODE_GOLD;
  if (t === 'base') return f === 'alliance' ? ALLIANCE_BASE : f === 'horde' ? HORDE_BASE : NEUTRAL_BASE;
  if (t === 'tower') return f === 'alliance' ? ALLIANCE_TOWER : f === 'horde' ? HORDE_TOWER : NEUTRAL_TOWER;
  if (t === 'orb') return ORB_PURPLE;
  if (t === 'zone') return ZONE_GREEN;
  return NODE_GOLD;
}
