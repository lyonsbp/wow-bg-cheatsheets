import type { Faction, PowerupType, ObjectiveType } from '../types';

export function gyColor(f: Faction): string {
  return f === 'alliance' ? '#4488cc' : f === 'horde' ? '#cc3344' : '#7a8898';
}

export function bufColor(t: PowerupType): string {
  return t === 'speed' ? '#00e5ff' : t === 'berserk' ? '#ff6600' : '#44dd88';
}

export function objColor(t: ObjectiveType, f: Faction): string {
  if (t === 'flag') return f === 'alliance' ? '#4488cc' : f === 'horde' ? '#cc3344' : '#ffd700';
  if (t === 'base') return f === 'alliance' ? '#3377bb' : f === 'horde' ? '#aa2233' : '#7a7a8a';
  if (t === 'tower') return f === 'alliance' ? '#5599cc' : f === 'horde' ? '#dd4455' : '#ffaa33';
  if (t === 'orb') return '#cc88ff';
  if (t === 'zone') return '#44cc88';
  return '#ffd700';
}
