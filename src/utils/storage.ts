import type { BGMap, Battleground } from '../types';

type SavedBGData = Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>;

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
