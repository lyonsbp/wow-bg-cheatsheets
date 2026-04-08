import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import BGS_ORIGINAL from '../data/battlegrounds';
import { saveData, loadData } from '../utils/storage';

const BGS_DEFAULT = JSON.parse(JSON.stringify(BGS_ORIGINAL));

const initialState = {
  bgs: loadData(BGS_ORIGINAL),
  curBG: 'wsg',
  layers: { gy: true, buf: true, rte: true, obj: true },
  editMode: false,
  squigglyMode: false,
  zoomScale: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_BG':
      return { ...state, curBG: action.id };

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

    case 'UPDATE_BG_DATA': {
      const { bgId, field, data } = action;
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], [field]: data },
        },
      };
    }

    case 'UPDATE_MARKER_POS': {
      const { bgId, layer, index, x, y } = action;
      const newArr = [...state.bgs[bgId][layer]];
      newArr[index] = { ...newArr[index], x, y };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], [layer]: newArr },
        },
      };
    }

    case 'UPDATE_WAYPOINT_POS': {
      const { bgId, routeIdx, pointIdx, x, y } = action;
      const newRoutes = [...state.bgs[bgId].routes];
      const newPts = [...newRoutes[routeIdx].pts];
      newPts[pointIdx] = [x, y];
      newRoutes[routeIdx] = { ...newRoutes[routeIdx], pts: newPts };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], routes: newRoutes },
        },
      };
    }

    case 'DELETE_MARKER': {
      const { bgId, layer, index } = action;
      const newArr = [...state.bgs[bgId][layer]];
      newArr.splice(index, 1);
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], [layer]: newArr },
        },
      };
    }

    case 'DELETE_ROUTE': {
      const { bgId, index } = action;
      const newRoutes = [...state.bgs[bgId].routes];
      newRoutes.splice(index, 1);
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], routes: newRoutes },
        },
      };
    }

    case 'DELETE_WAYPOINT': {
      const { bgId, routeIdx, pointIdx } = action;
      const newRoutes = [...state.bgs[bgId].routes];
      const route = newRoutes[routeIdx];
      if (route.pts.length <= 2) {
        newRoutes.splice(routeIdx, 1);
      } else {
        const newPts = [...route.pts];
        newPts.splice(pointIdx, 1);
        newRoutes[routeIdx] = { ...route, pts: newPts };
      }
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], routes: newRoutes },
        },
      };
    }

    case 'INSERT_WAYPOINT': {
      const { bgId, routeIdx, insertIdx, x, y } = action;
      const newRoutes = [...state.bgs[bgId].routes];
      const newPts = [...newRoutes[routeIdx].pts];
      newPts.splice(insertIdx, 0, [x, y]);
      newRoutes[routeIdx] = { ...newRoutes[routeIdx], pts: newPts };
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], routes: newRoutes },
        },
      };
    }

    case 'ADD_MARKER': {
      const { bgId, layer, marker } = action;
      const newArr = [...state.bgs[bgId][layer], marker];
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], [layer]: newArr },
        },
      };
    }

    case 'ADD_ROUTE': {
      const { bgId, route } = action;
      const newRoutes = [...state.bgs[bgId].routes, route];
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: { ...state.bgs[bgId], routes: newRoutes },
        },
      };
    }

    case 'RESET_BG': {
      const { bgId } = action;
      const def = BGS_DEFAULT[bgId];
      return {
        ...state,
        bgs: {
          ...state.bgs,
          [bgId]: {
            ...state.bgs[bgId],
            graveyards: JSON.parse(JSON.stringify(def.graveyards)),
            powerups: JSON.parse(JSON.stringify(def.powerups)),
            routes: JSON.parse(JSON.stringify(def.routes)),
            objectives: JSON.parse(JSON.stringify(def.objectives)),
            tips: JSON.parse(JSON.stringify(def.tips)),
          },
        },
      };
    }

    case 'IMPORT_DATA': {
      const { bgId, data } = action;
      const bg = { ...state.bgs[bgId] };
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

    default:
      return state;
  }
}

const BattlegroundContext = createContext(null);

export function BattlegroundProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveData(state.bgs);
  }, [state.bgs]);

  return (
    <BattlegroundContext.Provider value={{ state, dispatch }}>
      {children}
    </BattlegroundContext.Provider>
  );
}

export function useBG() {
  const ctx = useContext(BattlegroundContext);
  if (!ctx) throw new Error('useBG must be used within BattlegroundProvider');
  return ctx;
}
