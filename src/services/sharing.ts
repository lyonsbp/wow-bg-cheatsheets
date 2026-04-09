import type { BGMap, Battleground } from '../types';
import { supabase } from './supabase';

type SavedBGData = Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>;

export async function shareConfig(bgId: string, bgs: BGMap): Promise<string | null> {
  const bg = bgs[bgId];
  if (!bg) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('shared_bg_configs')
    .insert({
      user_id: user.id,
      bg_id: bgId,
      title: bg.name,
      graveyards: bg.graveyards,
      powerups: bg.powerups,
      routes: bg.routes,
      objectives: bg.objectives,
      tips: bg.tips,
    })
    .select('share_code')
    .single();

  if (error || !data) {
    console.error('Failed to share config:', error);
    return null;
  }

  return `${window.location.origin}${window.location.pathname}?share=${data.share_code}`;
}

export async function loadSharedConfig(shareCode: string): Promise<{ bgId: string; title: string; data: SavedBGData } | null> {
  const { data, error } = await supabase
    .from('shared_bg_configs')
    .select('bg_id, title, graveyards, powerups, routes, objectives, tips')
    .eq('share_code', shareCode)
    .single();

  if (error || !data) return null;

  return {
    bgId: data.bg_id as string,
    title: data.title as string,
    data: {
      graveyards: data.graveyards as Battleground['graveyards'],
      powerups: data.powerups as Battleground['powerups'],
      routes: data.routes as Battleground['routes'],
      objectives: data.objectives as Battleground['objectives'],
      tips: data.tips as string[],
    },
  };
}
