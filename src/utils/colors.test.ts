import { gyColor, bufColor, objColor } from './colors';

describe('gyColor', () => {
  it('returns blue for alliance', () => {
    expect(gyColor('alliance')).toBe('#4488cc');
  });

  it('returns red for horde', () => {
    expect(gyColor('horde')).toBe('#cc3344');
  });

  it('returns gray for neutral', () => {
    expect(gyColor('neutral')).toBe('#7a8898');
  });
});

describe('bufColor', () => {
  it('returns cyan for speed', () => {
    expect(bufColor('speed')).toBe('#00e5ff');
  });

  it('returns orange for berserk', () => {
    expect(bufColor('berserk')).toBe('#ff6600');
  });

  it('returns green for restore', () => {
    expect(bufColor('restore')).toBe('#44dd88');
  });
});

describe('objColor', () => {
  it('returns faction colors for flags', () => {
    expect(objColor('flag', 'alliance')).toBe('#4488cc');
    expect(objColor('flag', 'horde')).toBe('#cc3344');
    expect(objColor('flag', 'neutral')).toBe('#ffd700');
  });

  it('returns faction colors for bases', () => {
    expect(objColor('base', 'alliance')).toBe('#3377bb');
    expect(objColor('base', 'horde')).toBe('#aa2233');
  });

  it('returns faction colors for towers', () => {
    expect(objColor('tower', 'alliance')).toBe('#5599cc');
    expect(objColor('tower', 'horde')).toBe('#dd4455');
    expect(objColor('tower', 'neutral')).toBe('#ffaa33');
  });

  it('returns purple for orbs', () => {
    expect(objColor('orb', 'neutral')).toBe('#cc88ff');
  });

  it('returns green for zones', () => {
    expect(objColor('zone', 'neutral')).toBe('#44cc88');
  });

  it('returns gold for nodes', () => {
    expect(objColor('node', 'neutral')).toBe('#ffd700');
  });
});
