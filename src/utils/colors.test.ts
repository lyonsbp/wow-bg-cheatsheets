import { gyColor, bufColor, objColor } from './colors';
import {
  ALLIANCE_BLUE, HORDE_RED, NEUTRAL_GRAY,
  SPEED_CYAN, BERSERK_ORANGE, RESTORE_GREEN,
  ALLIANCE_BASE, HORDE_BASE,
  ALLIANCE_TOWER, HORDE_TOWER, NEUTRAL_TOWER,
  ORB_PURPLE, ZONE_GREEN, NODE_GOLD,
} from './constants';

describe('gyColor', () => {
  it('returns blue for alliance', () => {
    expect(gyColor('alliance')).toBe(ALLIANCE_BLUE);
  });

  it('returns red for horde', () => {
    expect(gyColor('horde')).toBe(HORDE_RED);
  });

  it('returns gray for neutral', () => {
    expect(gyColor('neutral')).toBe(NEUTRAL_GRAY);
  });
});

describe('bufColor', () => {
  it('returns cyan for speed', () => {
    expect(bufColor('speed')).toBe(SPEED_CYAN);
  });

  it('returns orange for berserk', () => {
    expect(bufColor('berserk')).toBe(BERSERK_ORANGE);
  });

  it('returns green for restore', () => {
    expect(bufColor('restore')).toBe(RESTORE_GREEN);
  });
});

describe('objColor', () => {
  it('returns faction colors for flags', () => {
    expect(objColor('flag', 'alliance')).toBe(ALLIANCE_BLUE);
    expect(objColor('flag', 'horde')).toBe(HORDE_RED);
    expect(objColor('flag', 'neutral')).toBe(NODE_GOLD);
  });

  it('returns faction colors for bases', () => {
    expect(objColor('base', 'alliance')).toBe(ALLIANCE_BASE);
    expect(objColor('base', 'horde')).toBe(HORDE_BASE);
  });

  it('returns faction colors for towers', () => {
    expect(objColor('tower', 'alliance')).toBe(ALLIANCE_TOWER);
    expect(objColor('tower', 'horde')).toBe(HORDE_TOWER);
    expect(objColor('tower', 'neutral')).toBe(NEUTRAL_TOWER);
  });

  it('returns purple for orbs', () => {
    expect(objColor('orb', 'neutral')).toBe(ORB_PURPLE);
  });

  it('returns green for zones', () => {
    expect(objColor('zone', 'neutral')).toBe(ZONE_GREEN);
  });

  it('returns gold for nodes', () => {
    expect(objColor('node', 'neutral')).toBe(NODE_GOLD);
  });
});
