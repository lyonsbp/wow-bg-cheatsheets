import { renderHook, act } from '@testing-library/react';
import { BattlegroundProvider, useBG } from './BattlegroundContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <BattlegroundProvider>{children}</BattlegroundProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('BattlegroundContext', () => {
  it('provides initial state with wsg selected', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    expect(result.current.state.curBG).toBe('wsg');
    expect(result.current.state.editMode).toBe(false);
    expect(result.current.state.layers).toEqual({ gy: true, buf: true, rte: true, obj: true });
  });

  it('SELECT_BG changes current battleground', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({ type: 'SELECT_BG', id: 'ab' }));
    expect(result.current.state.curBG).toBe('ab');
  });

  it('TOGGLE_LAYER toggles layer visibility', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    expect(result.current.state.layers.gy).toBe(true);
    act(() => result.current.dispatch({ type: 'TOGGLE_LAYER', key: 'gy' }));
    expect(result.current.state.layers.gy).toBe(false);
    act(() => result.current.dispatch({ type: 'TOGGLE_LAYER', key: 'gy' }));
    expect(result.current.state.layers.gy).toBe(true);
  });

  it('TOGGLE_EDIT toggles edit mode', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({ type: 'TOGGLE_EDIT' }));
    expect(result.current.state.editMode).toBe(true);
    act(() => result.current.dispatch({ type: 'TOGGLE_EDIT' }));
    expect(result.current.state.editMode).toBe(false);
  });

  it('TOGGLE_SQUIGGLY toggles squiggly mode', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({ type: 'TOGGLE_SQUIGGLY' }));
    expect(result.current.state.squigglyMode).toBe(true);
  });

  it('SET_ZOOM updates zoom scale', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({ type: 'SET_ZOOM', scale: 2.5 }));
    expect(result.current.state.zoomScale).toBe(2.5);
  });

  it('UPDATE_MARKER_POS updates a graveyard position', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origX = result.current.state.bgs['wsg']!.graveyards[0]!.x;
    act(() => result.current.dispatch({
      type: 'UPDATE_MARKER_POS', bgId: 'wsg', layer: 'graveyards', index: 0, x: 55, y: 66,
    }));
    expect(result.current.state.bgs['wsg']!.graveyards[0]!.x).toBe(55);
    expect(result.current.state.bgs['wsg']!.graveyards[0]!.y).toBe(66);
    expect(origX).not.toBe(55);
  });

  it('DELETE_MARKER removes a marker', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.graveyards.length;
    act(() => result.current.dispatch({
      type: 'DELETE_MARKER', bgId: 'wsg', layer: 'graveyards', index: 0,
    }));
    expect(result.current.state.bgs['wsg']!.graveyards.length).toBe(origLen - 1);
  });

  it('ADD_MARKER adds a new marker', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.powerups.length;
    act(() => result.current.dispatch({
      type: 'ADD_MARKER', bgId: 'wsg', layer: 'powerups',
      marker: { n: 'Test Buff', x: 50, y: 50, t: 'speed' },
    }));
    expect(result.current.state.bgs['wsg']!.powerups.length).toBe(origLen + 1);
    expect(result.current.state.bgs['wsg']!.powerups.at(-1)!.n).toBe('Test Buff');
  });

  it('ADD_ROUTE adds a new route', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.routes.length;
    act(() => result.current.dispatch({
      type: 'ADD_ROUTE', bgId: 'wsg',
      route: { n: 'Test Route', pts: [[10, 10], [90, 90]], c: '#ff0000' },
    }));
    expect(result.current.state.bgs['wsg']!.routes.length).toBe(origLen + 1);
  });

  it('DELETE_ROUTE removes a route', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.routes.length;
    act(() => result.current.dispatch({ type: 'DELETE_ROUTE', bgId: 'wsg', index: 0 }));
    expect(result.current.state.bgs['wsg']!.routes.length).toBe(origLen - 1);
  });

  it('UPDATE_WAYPOINT_POS moves a waypoint', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({
      type: 'UPDATE_WAYPOINT_POS', bgId: 'wsg', routeIdx: 0, pointIdx: 0, x: 99, y: 88,
    }));
    expect(result.current.state.bgs['wsg']!.routes[0]!.pts[0]).toEqual([99, 88]);
  });

  it('INSERT_WAYPOINT inserts a new waypoint', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.routes[0]!.pts.length;
    act(() => result.current.dispatch({
      type: 'INSERT_WAYPOINT', bgId: 'wsg', routeIdx: 0, insertIdx: 1, x: 33, y: 44,
    }));
    expect(result.current.state.bgs['wsg']!.routes[0]!.pts.length).toBe(origLen + 1);
    expect(result.current.state.bgs['wsg']!.routes[0]!.pts[1]).toEqual([33, 44]);
  });

  it('DELETE_WAYPOINT removes a waypoint (route with >2 pts)', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origLen = result.current.state.bgs['wsg']!.routes[0]!.pts.length;
    expect(origLen).toBeGreaterThan(2);
    act(() => result.current.dispatch({
      type: 'DELETE_WAYPOINT', bgId: 'wsg', routeIdx: 0, pointIdx: 1,
    }));
    expect(result.current.state.bgs['wsg']!.routes[0]!.pts.length).toBe(origLen - 1);
  });

  it('DELETE_WAYPOINT on 2-point route deletes the entire route', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    // Add a 2-point route first
    act(() => result.current.dispatch({
      type: 'ADD_ROUTE', bgId: 'wsg',
      route: { n: 'Short', pts: [[10, 10], [20, 20]], c: '#ff0000' },
    }));
    const routeCount = result.current.state.bgs['wsg']!.routes.length;
    act(() => result.current.dispatch({
      type: 'DELETE_WAYPOINT', bgId: 'wsg', routeIdx: routeCount - 1, pointIdx: 0,
    }));
    expect(result.current.state.bgs['wsg']!.routes.length).toBe(routeCount - 1);
  });

  it('UPDATE_BG_DATA updates tips', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({
      type: 'UPDATE_BG_DATA', bgId: 'wsg', field: 'tips', data: ['new tip'],
    }));
    expect(result.current.state.bgs['wsg']!.tips).toEqual(['new tip']);
  });

  it('RESET_BG restores defaults', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    const origTips = [...result.current.state.bgs['wsg']!.tips];
    act(() => result.current.dispatch({
      type: 'UPDATE_BG_DATA', bgId: 'wsg', field: 'tips', data: ['modified'],
    }));
    expect(result.current.state.bgs['wsg']!.tips).toEqual(['modified']);
    act(() => result.current.dispatch({ type: 'RESET_BG', bgId: 'wsg' }));
    expect(result.current.state.bgs['wsg']!.tips).toEqual(origTips);
  });

  it('IMPORT_DATA merges partial data', () => {
    const { result } = renderHook(() => useBG(), { wrapper });
    act(() => result.current.dispatch({
      type: 'IMPORT_DATA', bgId: 'wsg', data: { tips: ['imported tip'] },
    }));
    expect(result.current.state.bgs['wsg']!.tips).toEqual(['imported tip']);
    // Other fields unchanged
    expect(result.current.state.bgs['wsg']!.graveyards.length).toBeGreaterThan(0);
  });
});
