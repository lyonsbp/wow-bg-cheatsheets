import type { BGMap, Battleground } from '../types';
import type { StorageAdapter } from './storage-adapter';
import { supabase } from './supabase';

type SavedBGData = Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>;

export class SupabaseStorageAdapter implements StorageAdapter {
  async load(defaults: BGMap): Promise<BGMap> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return defaults;

    const { data, error } = await supabase
      .from('user_bg_configs')
      .select('bg_id, graveyards, powerups, routes, objectives, tips')
      .eq('user_id', user.id);

    if (error || !data || data.length === 0) return defaults;

    const merged: BGMap = JSON.parse(JSON.stringify(defaults)) as BGMap;
    for (const row of data) {
      const bg = merged[row.bg_id];
      if (!bg) continue;
      bg.graveyards = row.graveyards as Battleground['graveyards'];
      bg.powerups = row.powerups as Battleground['powerups'];
      bg.routes = row.routes as Battleground['routes'];
      bg.objectives = row.objectives as Battleground['objectives'];
      bg.tips = row.tips as string[];
    }
    return merged;
  }

  async save(bgs: BGMap): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const rows = Object.entries(bgs).map(([bgId, bg]) => ({
      user_id: user.id,
      bg_id: bgId,
      graveyards: bg.graveyards,
      powerups: bg.powerups,
      routes: bg.routes,
      objectives: bg.objectives,
      tips: bg.tips,
    }));

    await supabase
      .from('user_bg_configs')
      .upsert(rows, { onConflict: 'user_id,bg_id' });
  }

  async saveBG(bgId: string, bg: SavedBGData): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_bg_configs')
      .upsert({
        user_id: user.id,
        bg_id: bgId,
        graveyards: bg.graveyards,
        powerups: bg.powerups,
        routes: bg.routes,
        objectives: bg.objectives,
        tips: bg.tips,
      }, { onConflict: 'user_id,bg_id' });
  }
}
