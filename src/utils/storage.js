const STORAGE_KEY = 'wow-bg-cheatsheets-data';

export function saveData(bgs) {
  const out = {};
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

export function loadData(bgs) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return bgs;
  try {
    const data = JSON.parse(raw);
    const merged = JSON.parse(JSON.stringify(bgs));
    for (const [id, saved] of Object.entries(data)) {
      if (!merged[id]) continue;
      if (saved.graveyards) merged[id].graveyards = saved.graveyards;
      if (saved.powerups) merged[id].powerups = saved.powerups;
      if (saved.routes) merged[id].routes = saved.routes;
      if (saved.objectives) merged[id].objectives = saved.objectives;
      if (saved.tips) merged[id].tips = saved.tips;
    }
    return merged;
  } catch (e) {
    console.warn('Failed to load saved data:', e);
    return bgs;
  }
}

export function exportJSON(bgId, bgs) {
  const bg = bgs[bgId];
  if (!bg) return;
  const data = {
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

export function importJSON() {
  return new Promise((resolve) => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json';
    inp.onchange = () => {
      const f = inp.files[0];
      if (!f) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (e) {
          alert('Invalid JSON file');
          resolve(null);
        }
      };
      reader.readAsText(f);
    };
    inp.click();
  });
}
