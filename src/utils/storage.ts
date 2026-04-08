import type { BGMap, Battleground } from '../types';

const STORAGE_KEY = 'wow-bg-cheatsheets-data';

type SavedBGData = Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>;

export function saveData(bgs: BGMap): void {
  const out: Record<string, SavedBGData> = {};
  for (const [id, bg] of Object.entries(bgs)) {
    out[id] = {
      graveyards: bg.graveyards,
      powerups: bg.powerups,
      routes: bg.routes,
      objectives: bg.objectives,
      tips: bg.tips
    };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
}

export function loadData(bgs: BGMap): BGMap {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return bgs;
  try {
    const data = JSON.parse(raw) as Record<string, Partial<SavedBGData>>;
    const merged: BGMap = JSON.parse(JSON.stringify(bgs)) as BGMap;
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
    return bgs;
  }
}

export function exportJSON(bgId: string, bgs: BGMap): void {
  const bg = bgs[bgId];
  if (!bg) return;
  const data: SavedBGData = {
    graveyards: bg.graveyards,
    powerups: bg.powerups,
    routes: bg.routes,
    objectives: bg.objectives,
    tips: bg.tips
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = bgId + '-data.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importJSON(): Promise<Partial<SavedBGData> | null> {
  return new Promise((resolve) => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json';
    inp.onchange = () => {
      const f = inp.files?.[0];
      if (!f) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result as string) as Partial<SavedBGData>);
        } catch {
          alert('Invalid JSON file');
          resolve(null);
        }
      };
      reader.readAsText(f);
    };
    inp.click();
  });
}
