import type { BGMap, Battleground } from '../types';
import type { StorageAdapter } from './storage-adapter';

const STORAGE_KEY = 'wow-bg-cheatsheets-data';

type SavedBGData = Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>;

export class LocalStorageAdapter implements StorageAdapter {
  async load(defaults: BGMap): Promise<BGMap> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    try {
      const data = JSON.parse(raw) as Record<string, Partial<SavedBGData>>;
      const merged: BGMap = JSON.parse(JSON.stringify(defaults)) as BGMap;
      for (const [id, saved] of Object.entries(data)) {
        const bg = merged[id];
        if (!bg) continue;
        if (saved.graveyards) bg.graveyards = saved.graveyards;
        if (saved.powerups) bg.powerups = saved.powerups;
        if (saved.routes) bg.routes = saved.routes;
        if (saved.objectives) bg.objectives = saved.objectives;
        if (saved.tips) bg.tips = saved.tips;
      }
      return merged;
    } catch (e) {
      console.warn('Failed to load saved data:', e);
      return defaults;
    }
  }

  async save(bgs: BGMap): Promise<void> {
    const out: Record<string, SavedBGData> = {};
    for (const [id, bg] of Object.entries(bgs)) {
      out[id] = {
        graveyards: bg.graveyards,
        powerups: bg.powerups,
        routes: bg.routes,
        objectives: bg.objectives,
        tips: bg.tips,
      };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  }
}
