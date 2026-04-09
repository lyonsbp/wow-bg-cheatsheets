export type Faction = 'alliance' | 'horde' | 'neutral';
export type PowerupType = 'speed' | 'berserk' | 'restore';
export type ObjectiveType = 'node' | 'flag' | 'tower' | 'base' | 'orb' | 'zone';
export type BGCategory = 'blitz' | 'epic';
export type LayerKey = 'gy' | 'buf' | 'rte' | 'obj';

export interface Graveyard {
  n: string;
  x: number;
  y: number;
  f: Faction;
}

export interface Powerup {
  n: string;
  x: number;
  y: number;
  t: PowerupType;
}

export interface Route {
  n: string;
  pts: [number, number][];
  c: string;
  d?: boolean;
}

export interface Objective {
  n: string;
  x: number;
  y: number;
  t: ObjectiveType;
  f?: Faction;
}

export interface Battleground {
  name: string;
  short: string;
  type: string;
  size: string;
  cat: BGCategory;
  map: string | null;
  win: string;
  tips: string[];
  graveyards: Graveyard[];
  powerups: Powerup[];
  routes: Route[];
  objectives: Objective[];
}

export type BGMap = Record<string, Battleground>;

export interface Layers {
  gy: boolean;
  buf: boolean;
  rte: boolean;
  obj: boolean;
}

export interface AppState {
  bgs: BGMap;
  curBG: string;
  layers: Layers;
  editMode: boolean;
  squigglyMode: boolean;
  zoomScale: number;
  strokeWidth: number;
  hiddenItems: Set<string>;
  loading: boolean;
}

export type AppAction =
  | { type: 'SELECT_BG'; id: string }
  | { type: 'TOGGLE_LAYER'; key: LayerKey }
  | { type: 'TOGGLE_EDIT' }
  | { type: 'TOGGLE_SQUIGGLY' }
  | { type: 'SET_ZOOM'; scale: number }
  | { type: 'SET_STROKE_WIDTH'; width: number }
  | { type: 'TOGGLE_ITEM_VISIBILITY'; key: string }
  | { type: 'TOGGLE_GROUP_VISIBILITY'; keys: string[] }
  | { type: 'UPDATE_BG_DATA'; bgId: string; field: keyof Battleground; data: Battleground[keyof Battleground] }
  | { type: 'UPDATE_MARKER_POS'; bgId: string; layer: 'graveyards' | 'powerups' | 'objectives'; index: number; x: number; y: number }
  | { type: 'UPDATE_WAYPOINT_POS'; bgId: string; routeIdx: number; pointIdx: number; x: number; y: number }
  | { type: 'DELETE_MARKER'; bgId: string; layer: 'graveyards' | 'powerups' | 'objectives'; index: number }
  | { type: 'DELETE_ROUTE'; bgId: string; index: number }
  | { type: 'DELETE_WAYPOINT'; bgId: string; routeIdx: number; pointIdx: number }
  | { type: 'INSERT_WAYPOINT'; bgId: string; routeIdx: number; insertIdx: number; x: number; y: number }
  | { type: 'ADD_MARKER'; bgId: string; layer: 'graveyards' | 'powerups' | 'objectives'; marker: Graveyard | Powerup | Objective }
  | { type: 'ADD_ROUTE'; bgId: string; route: Route }
  | { type: 'RESET_BG'; bgId: string }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT_DATA'; bgId: string; data: Partial<Pick<Battleground, 'graveyards' | 'powerups' | 'routes' | 'objectives' | 'tips'>> }
  | { type: 'INIT_DATA'; bgs: BGMap };

export interface MapPoint {
  x: number;
  y: number;
}

export type MarkerLayer = 'graveyards' | 'powerups' | 'objectives';
