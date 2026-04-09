import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { AppState, AppAction, BGMap, Battleground } from '../types';
import BGS_ORIGINAL from '../data/battlegrounds';
import type { StorageAdapter } from '../services/storage-adapter';
import { LocalStorageAdapter } from '../services/local-storage-adapter';

const BGS_DEFAULT: BGMap = JSON.parse(JSON.stringify(BGS_ORIGINAL)) as BGMap;

const defaultAdapter: StorageAdapter = new LocalStorageAdapter();

const initialState: AppState = {
  bgs: JSON.parse(JSON.stringify(BGS_ORIGINAL)) as BGMap,
  curBG: 'wsg',
  layers: { gy: true, buf: true, rte: true, obj: true },
  editMode: false,
  squigglyMode: false,
  zoomScale: 1,
  strokeWidth: 1,
  hiddenItems: new Set<string>(),
  loading: true,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_BG':
      return { ...state, curBG: action.id, hiddenItems: new Set<string>() };

    case 'TOGGLE_LAYER':
      return {
        ...state,
        layers: { ...state.layers, [action.key]: !state.layers[action.key] },
      };

    case 'TOGGLE_EDIT':
      return { ...state, editMode: !state.editMode };

    case 'TOGGLE_SQUIGGLY':
      return { ...state, squigglyMode: !state.squigglyMode };

    case 'SET_ZOOM':
      return { ...state, zoomScale: action.scale };

    case 'SET_STROKE_WIDTH':
      return { ...state, strokeWidth: action.width };

    case 'TOGGLE_ITEM_VISIBILITY': {
      const next = new Set(state.hiddenItems);
      if (next.has(action.key)) {
        next.delete(action.key);
      } else {
        next.add(action.key);
      }
      return { ...state, hiddenItems: next };
    }

    case 'TOGGLE_GROUP_VISIBILITY': {
      const next = new Set(state.hiddenItems);
      const allHidden = action.keys.every(k => next.has(k));
      for (const k of action.keys) {
        if (allHidden) {
          next.delete(k);
        } else {
          next.add(k);
        }
      }
      return { ...state, hiddenItems: next };
    }

    case 'UPDATE_BG_DATA': {
      const { bgId, field, data } = action;
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId]!, [field]: data },
        },
      };
    }

    case 'UPDATE_MARKER_POS': {
      const { bgId, layer, index, x, y } = action;
      const bg = state.bgs[bgId]!;
      const newArr = [...bg[layer]];
      newArr[index] = { ...newArr[index]!, x, y };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, [layer]: newArr },
        },
      };
    }

    case 'UPDATE_WAYPOINT_POS': {
      const { bgId, routeIdx, pointIdx, x, y } = action;
      const bg = state.bgs[bgId]!;
      const newRoutes = [...bg.routes];
      const route = newRoutes[routeIdx]!;
      const newPts: [number, number][] = [...route.pts];
      newPts[pointIdx] = [x, y];
      newRoutes[routeIdx] = { ...route, pts: newPts };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, routes: newRoutes },
        },
      };
    }

    case 'DELETE_MARKER': {
      const { bgId, layer, index } = action;
      const bg = state.bgs[bgId]!;
      const newArr = [...bg[layer]];
      newArr.splice(index, 1);
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, [layer]: newArr },
        },
      };
    }

    case 'DELETE_ROUTE': {
      const { bgId, index } = action;
      const bg = state.bgs[bgId]!;
      const newRoutes = [...bg.routes];
      newRoutes.splice(index, 1);
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, routes: newRoutes },
        },
      };
    }

    case 'DELETE_WAYPOINT': {
      const { bgId, routeIdx, pointIdx } = action;
      const bg = state.bgs[bgId]!;
      const newRoutes = [...bg.routes];
      const route = newRoutes[routeIdx]!;
      if (route.pts.length <= 2) {
        newRoutes.splice(routeIdx, 1);
      } else {
        const newPts: [number, number][] = [...route.pts];
        newPts.splice(pointIdx, 1);
        newRoutes[routeIdx] = { ...route, pts: newPts };
      }
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, routes: newRoutes },
        },
      };
    }

    case 'INSERT_WAYPOINT': {
      const { bgId, routeIdx, insertIdx, x, y } = action;
      const bg = state.bgs[bgId]!;
      const newRoutes = [...bg.routes];
      const route = newRoutes[routeIdx]!;
      const newPts: [number, number][] = [...route.pts];
      newPts.splice(insertIdx, 0, [x, y]);
      newRoutes[routeIdx] = { ...route, pts: newPts };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, routes: newRoutes },
        },
      };
    }

    case 'ADD_MARKER': {
      const { bgId, layer, marker } = action;
      const bg = state.bgs[bgId]!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArr = [...bg[layer] as any[], marker];
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, [layer]: newArr },
        },
      };
    }

    case 'ADD_ROUTE': {
      const { bgId, route } = action;
      const bg = state.bgs[bgId]!;
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...bg, routes: [...bg.routes, route] },
        },
      };
    }

    case 'RESET_BG': {
      const { bgId } = action;
      const def = BGS_DEFAULT[bgId]!;
      const bg = state.bgs[bgId]!;
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: {
            ...bg,
            graveyards: JSON.parse(JSON.stringify(def.graveyards)) as Battleground['graveyards'],
            powerups: JSON.parse(JSON.stringify(def.powerups)) as Battleground['powerups'],
            routes: JSON.parse(JSON.stringify(def.routes)) as Battleground['routes'],
            objectives: JSON.parse(JSON.stringify(def.objectives)) as Battleground['objectives'],
            tips: JSON.parse(JSON.stringify(def.tips)) as string[],
          },
        },
      };
    }

    case 'RESET_ALL':
      return { ...state, bgs: JSON.parse(JSON.stringify(BGS_DEFAULT)) as BGMap };

    case 'IMPORT_DATA': {
      const { bgId, data } = action;
      const bg = { ...state.bgs[bgId]! };
      if (data.graveyards) bg.graveyards = data.graveyards;
      if (data.powerups) bg.powerups = data.powerups;
      if (data.routes) bg.routes = data.routes;
      if (data.objectives) bg.objectives = data.objectives;
      if (data.tips) bg.tips = data.tips;
      return {
        ...state,
        bgs: { ...state.bgs, [bgId]: bg },
      };
    }

    case 'INIT_DATA':
      return { ...state, bgs: action.bgs, loading: false };

    default:
      return state;
  }
}

interface BGContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const BattlegroundContext = createContext<BGContextValue | null>(null);

export function BattlegroundProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: StorageAdapter;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const adapterRef = useRef(adapter);
  const isInitialized = useRef(false);

  useEffect(() => {
    adapterRef.current = adapter;
  }, [adapter]);

  useEffect(() => {
    adapterRef.current.load(BGS_ORIGINAL).then((bgs) => {
      dispatch({ type: 'INIT_DATA', bgs });
      isInitialized.current = true;
    });
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;
    adapterRef.current.save(state.bgs);
  }, [state.bgs]);

  return (
    <BattlegroundContext.Provider value={{ state, dispatch }}>
      {children}
    </BattlegroundContext.Provider>
  );
}

export function useBG(): BGContextValue {
  const ctx = useContext(BattlegroundContext);
  if (!ctx) throw new Error('useBG must be used within BattlegroundProvider');
  return ctx;
}
