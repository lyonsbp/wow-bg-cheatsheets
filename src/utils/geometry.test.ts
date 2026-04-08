import { pts, distToSegment } from './geometry';

describe('pts', () => {
  it('formats a single point', () => {
    expect(pts([[10, 20]])).toBe('10,20');
  });

  it('formats multiple points joined by spaces', () => {
    expect(pts([[10, 20], [30, 40], [50, 60]])).toBe('10,20 30,40 50,60');
  });

  it('handles an empty array', () => {
    expect(pts([])).toBe('');
  });
});

describe('distToSegment', () => {
  it('returns 0 when the point is on the segment', () => {
    const d = distToSegment(5, 5, [0, 0], [10, 10]);
    expect(d).toBeCloseTo(0, 5);
  });

  it('returns the perpendicular distance to the midpoint', () => {
    // Point (5, 0), segment from (0, 0) to (10, 0)
    // Distance should be 0 (point is on the segment line)
    expect(distToSegment(5, 0, [0, 0], [10, 0])).toBeCloseTo(0);

    // Point (5, 3), segment from (0, 0) to (10, 0)
    // Distance should be 3
    expect(distToSegment(5, 3, [0, 0], [10, 0])).toBeCloseTo(3);
  });

  it('returns distance to the nearest endpoint when projection is outside', () => {
    // Point (-5, 0), segment from (0, 0) to (10, 0)
    // Closest point is (0, 0), distance = 5
    expect(distToSegment(-5, 0, [0, 0], [10, 0])).toBeCloseTo(5);
  });

  it('handles a zero-length segment (point)', () => {
    expect(distToSegment(3, 4, [0, 0], [0, 0])).toBeCloseTo(5);
  });
});
