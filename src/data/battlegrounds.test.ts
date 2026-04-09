import BGS from './battlegrounds';

describe('battlegrounds data', () => {
  it('contains 13 battlegrounds', () => {
    expect(Object.keys(BGS)).toHaveLength(13);
  });

  it('has 10 blitz and 3 epic BGs', () => {
    const blitz = Object.values(BGS).filter(bg => bg.cat === 'blitz');
    const epic = Object.values(BGS).filter(bg => bg.cat === 'epic');
    expect(blitz).toHaveLength(10);
    expect(epic).toHaveLength(3);
  });

  it('every BG has required fields', () => {
    for (const [id, bg] of Object.entries(BGS)) {
      expect(bg.name, `${id} missing name`).toBeTruthy();
      expect(bg.short, `${id} missing short`).toBeTruthy();
      expect(bg.type, `${id} missing type`).toBeTruthy();
      expect(bg.size, `${id} missing size`).toBeTruthy();
      expect(bg.win, `${id} missing win`).toBeTruthy();
      expect(bg.tips.length, `${id} has no tips`).toBeGreaterThan(0);
      expect(Array.isArray(bg.graveyards), `${id} graveyards not array`).toBe(true);
      expect(Array.isArray(bg.powerups), `${id} powerups not array`).toBe(true);
      expect(Array.isArray(bg.routes), `${id} routes not array`).toBe(true);
      expect(Array.isArray(bg.objectives), `${id} objectives not array`).toBe(true);
    }
  });

  it('all marker positions are within 0-100 range', () => {
    for (const [id, bg] of Object.entries(BGS)) {
      for (const gy of bg.graveyards) {
        expect(gy.x, `${id} gy ${gy.n} x`).toBeGreaterThanOrEqual(0);
        expect(gy.x, `${id} gy ${gy.n} x`).toBeLessThanOrEqual(100);
        expect(gy.y, `${id} gy ${gy.n} y`).toBeGreaterThanOrEqual(0);
        expect(gy.y, `${id} gy ${gy.n} y`).toBeLessThanOrEqual(100);
      }
      for (const obj of bg.objectives) {
        expect(obj.x, `${id} obj ${obj.n} x`).toBeGreaterThanOrEqual(0);
        expect(obj.x, `${id} obj ${obj.n} x`).toBeLessThanOrEqual(100);
        expect(obj.y, `${id} obj ${obj.n} y`).toBeGreaterThanOrEqual(0);
        expect(obj.y, `${id} obj ${obj.n} y`).toBeLessThanOrEqual(100);
      }
    }
  });

  it('all routes have at least 2 waypoints', () => {
    for (const [id, bg] of Object.entries(BGS)) {
      for (const r of bg.routes) {
        expect(r.pts.length, `${id} route "${r.n}"`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('route colors use the approved palette (no red/blue)', () => {
    const allowed = new Set(['#ff9933', '#ffd700', '#44cc44', '#00cccc', '#cc66ff', '#ff66aa']);
    for (const [id, bg] of Object.entries(BGS)) {
      for (const r of bg.routes) {
        expect(allowed.has(r.c), `${id} route "${r.n}" has unapproved color ${r.c}`).toBe(true);
      }
    }
  });

  it('map paths point to local files or are null', () => {
    for (const bg of Object.values(BGS)) {
      if (bg.map !== null) {
        expect(bg.map).toMatch(/^\/maps\/\w+\.jpg$/);
      }
    }
  });
});
