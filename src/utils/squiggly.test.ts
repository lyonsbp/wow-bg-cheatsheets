import { seededRng, squigglyPath } from './squiggly';

describe('seededRng', () => {
  it('returns deterministic values for the same seed', () => {
    const rng1 = seededRng(42);
    const rng2 = seededRng(42);
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];
    expect(values1).toEqual(values2);
  });

  it('returns values between 0 and 1', () => {
    const rng = seededRng(123);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('returns different values for different seeds', () => {
    const rng1 = seededRng(1);
    const rng2 = seededRng(2);
    expect(rng1()).not.toBe(rng2());
  });
});

describe('squigglyPath', () => {
  it('starts with M at the first waypoint', () => {
    const path = squigglyPath([[10, 20], [50, 60]], 42);
    expect(path).toMatch(/^M 10 20/);
  });

  it('produces deterministic output for the same seed', () => {
    const pts: [number, number][] = [[0, 0], [50, 50], [100, 100]];
    const path1 = squigglyPath(pts, 99);
    const path2 = squigglyPath(pts, 99);
    expect(path1).toBe(path2);
  });

  it('produces different output for different seeds', () => {
    const pts: [number, number][] = [[0, 0], [50, 50]];
    const path1 = squigglyPath(pts, 1);
    const path2 = squigglyPath(pts, 2);
    expect(path1).not.toBe(path2);
  });

  it('contains L commands for intermediate points', () => {
    const path = squigglyPath([[0, 0], [100, 100]], 42);
    expect(path).toContain(' L ');
  });

  it('handles very short segments gracefully', () => {
    const path = squigglyPath([[50, 50], [50.01, 50.01]], 42);
    expect(path).toMatch(/^M 50 50/);
  });
});
