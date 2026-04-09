import { saveData, loadData } from './storage';
import type { BGMap } from '../types';
import { ROUTE_YELLOW } from './constants';

const makeBgs = (): BGMap => ({
  test: {
    name: 'Test BG', short: 'T', type: 'Test', size: '10v10', cat: 'blitz',
    map: null, win: 'Win',
    tips: ['tip1'],
    graveyards: [{ n: 'GY1', x: 10, y: 20, f: 'alliance' }],
    powerups: [{ n: 'Speed', x: 30, y: 40, t: 'speed' }],
    routes: [{ n: 'Route1', pts: [[0, 0], [50, 50]], c: ROUTE_YELLOW }],
    objectives: [{ n: 'Node1', x: 50, y: 50, t: 'node' }],
  },
});

describe('saveData / loadData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips BG data through localStorage', () => {
    const bgs = makeBgs();
    saveData(bgs);
    const loaded = loadData(makeBgs());
    expect(loaded.test?.graveyards).toEqual(bgs.test?.graveyards);
    expect(loaded.test?.tips).toEqual(bgs.test?.tips);
    expect(loaded.test?.routes).toEqual(bgs.test?.routes);
  });

  it('returns original data when nothing is saved', () => {
    const bgs = makeBgs();
    const loaded = loadData(bgs);
    expect(loaded.test?.name).toBe('Test BG');
  });

  it('merges saved data over defaults', () => {
    const bgs = makeBgs();
    bgs.test!.tips = ['modified tip'];
    saveData(bgs);

    const fresh = makeBgs();
    const loaded = loadData(fresh);
    expect(loaded.test?.tips).toEqual(['modified tip']);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('wow-bg-cheatsheets-data', 'not json');
    const bgs = makeBgs();
    const loaded = loadData(bgs);
    expect(loaded.test?.name).toBe('Test BG');
  });

  it('ignores unknown BG ids in saved data', () => {
    localStorage.setItem('wow-bg-cheatsheets-data', JSON.stringify({
      unknown_bg: { tips: ['should be ignored'] }
    }));
    const bgs = makeBgs();
    const loaded = loadData(bgs);
    expect(loaded['unknown_bg']).toBeUndefined();
  });
});
