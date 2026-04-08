import { useRef, useCallback, type RefObject } from 'react';
import { useBG } from '../context/BattlegroundContext';
import { svgPoint, distToSegment } from '../utils/geometry';
import type { MapPoint, MarkerLayer, Route as RouteData } from '../types';
import Graveyard from './markers/Graveyard';
import Powerup from './markers/Powerup';
import Route from './markers/Route';
import Objective from './markers/Objective';

function buildDefs(routes: RouteData[]) {
  const seen = new Set<string>();
  return routes.map((r) => {
    const id = 'arr-' + r.c.slice(1);
    if (seen.has(id)) return null;
    seen.add(id);
    return (
      <marker key={id} id={id} markerWidth="4" markerHeight="4"
        refX="3.5" refY="2" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L4,2 L0,4 Z" fill={r.c} opacity=".85" />
      </marker>
    );
  }).filter(Boolean);
}

interface DragState {
  el: SVGElement;
  layer: MarkerLayer;
  index: number;
  lastPos?: { x: number; y: number };
}

interface WpDragState {
  el: SVGElement;
  ridx: number;
  pidx: number;
  lastPos?: { x: number; y: number };
}

interface Props {
  onMapClick?: (e: React.MouseEvent, pt: MapPoint) => void;
  svgRef: RefObject<SVGSVGElement | null>;
}

export default function SvgOverlay({ onMapClick, svgRef }: Props) {
  const { state, dispatch } = useBG();
  const { bgs, curBG, layers, editMode, squigglyMode } = state;
  const bg = bgs[curBG];

  const dragRef = useRef<DragState | null>(null);
  const wpDragRef = useRef<WpDragState | null>(null);

  const getSvg = useCallback(() => svgRef.current, [svgRef]);

  // ── Marker drag ──
  const handleDragStart = useCallback((e: React.MouseEvent, layer: MarkerLayer, index: number) => {
    if (!editMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as SVGElement;
    el.classList.add('dragging');
    dragRef.current = { el, layer, index };

    const onMove = (me: MouseEvent) => {
      const dr = dragRef.current;
      if (!dr) return;
      const svg = getSvg();
      if (!svg) return;
      const pt = svgPoint(me, svg);
      const nx = Math.round(pt.x * 10) / 10;
      const ny = Math.round(pt.y * 10) / 10;
      dr.el.setAttribute('transform', `translate(${nx},${ny})`);
      dr.lastPos = { x: nx, y: ny };
    };

    const onUp = () => {
      const dr = dragRef.current;
      if (dr) {
        dr.el.classList.remove('dragging');
        if (dr.lastPos) {
          dispatch({
            type: 'UPDATE_MARKER_POS',
            bgId: curBG,
            layer: dr.layer,
            index: dr.index,
            x: dr.lastPos.x,
            y: dr.lastPos.y,
          });
        }
        dragRef.current = null;
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [editMode, curBG, dispatch, getSvg]);

  // ── Delete marker ──
  const handleMarkerContext = useCallback((e: React.MouseEvent, layer: MarkerLayer, index: number) => {
    if (!editMode || !bg) return;
    e.preventDefault();
    e.stopPropagation();
    const item = bg[layer][index];
    if (!item || !confirm('Delete "' + item.n + '"?')) return;
    dispatch({ type: 'DELETE_MARKER', bgId: curBG, layer, index });
  }, [editMode, bg, curBG, dispatch]);

  // ── Waypoint drag ──
  const handleWpDragStart = useCallback((e: React.MouseEvent, ridx: number, pidx: number) => {
    if (!editMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as SVGElement;
    el.classList.add('dragging');
    wpDragRef.current = { el, ridx, pidx };

    const onMove = (me: MouseEvent) => {
      const wd = wpDragRef.current;
      if (!wd || !bg) return;
      const svg = getSvg();
      if (!svg) return;
      const pt = svgPoint(me, svg);
      const nx = Math.round(pt.x * 10) / 10;
      const ny = Math.round(pt.y * 10) / 10;
      wd.el.setAttribute('cx', String(nx));
      wd.el.setAttribute('cy', String(ny));
      wd.lastPos = { x: nx, y: ny };

      const g = (wd.el as Element).closest('.lrte');
      if (g) {
        const route = bg.routes[wd.ridx];
        if (route) {
          const tempPts = [...route.pts] as [number, number][];
          tempPts[wd.pidx] = [nx, ny];
          const newPtsStr = tempPts.map(p => p[0] + ',' + p[1]).join(' ');
          g.querySelector('.rte-glow')?.setAttribute('points', newPtsStr);
          g.querySelector('.rte-line')?.setAttribute('points', newPtsStr);
          g.querySelector('.rte-hit')?.setAttribute('points', newPtsStr);
        }
      }
    };

    const onUp = () => {
      const wd = wpDragRef.current;
      if (wd) {
        wd.el.classList.remove('dragging');
        if (wd.lastPos) {
          dispatch({
            type: 'UPDATE_WAYPOINT_POS',
            bgId: curBG,
            routeIdx: wd.ridx,
            pointIdx: wd.pidx,
            x: wd.lastPos.x,
            y: wd.lastPos.y,
          });
        }
        wpDragRef.current = null;
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [editMode, bg, curBG, dispatch, getSvg]);

  // ── Delete waypoint ──
  const handleWpContext = useCallback((e: React.MouseEvent, ridx: number, pidx: number) => {
    if (!editMode || !bg) return;
    e.preventDefault();
    e.stopPropagation();
    const route = bg.routes[ridx];
    if (!route) return;
    if (route.pts.length <= 2) {
      if (!confirm('Route "' + route.n + '" only has 2 points. Delete entire route?')) return;
      dispatch({ type: 'DELETE_ROUTE', bgId: curBG, index: ridx });
    } else {
      dispatch({ type: 'DELETE_WAYPOINT', bgId: curBG, routeIdx: ridx, pointIdx: pidx });
    }
  }, [editMode, bg, curBG, dispatch]);

  // ── Delete route ──
  const handleRouteContext = useCallback((e: React.MouseEvent, ridx: number) => {
    if (!editMode || !bg) return;
    e.preventDefault();
    e.stopPropagation();
    const route = bg.routes[ridx];
    if (!route || !confirm('Delete route "' + route.n + '"?')) return;
    dispatch({ type: 'DELETE_ROUTE', bgId: curBG, index: ridx });
  }, [editMode, bg, curBG, dispatch]);

  // ── Insert waypoint ──
  const handleInsertWaypoint = useCallback((e: React.MouseEvent, ridx: number) => {
    if (!editMode || e.button !== 0 || !bg) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = getSvg();
    if (!svg) return;
    const pt = svgPoint(e.nativeEvent, svg);
    const route = bg.routes[ridx];
    if (!route) return;

    let bestIdx = route.pts.length - 1;
    let bestDist = Infinity;
    for (let i = 0; i < route.pts.length - 1; i++) {
      const d = distToSegment(pt.x, pt.y, route.pts[i]!, route.pts[i + 1]!);
      if (d < bestDist) { bestDist = d; bestIdx = i + 1; }
    }

    const nx = Math.round(pt.x * 10) / 10;
    const ny = Math.round(pt.y * 10) / 10;
    dispatch({ type: 'INSERT_WAYPOINT', bgId: curBG, routeIdx: ridx, insertIdx: bestIdx, x: nx, y: ny });
  }, [editMode, bg, curBG, dispatch, getSvg]);

  // ── SVG click for adding markers ──
  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    if (!editMode || !curBG || e.button !== 0) return;
    if ((e.target as Element).closest('.mk') || (e.target as Element).closest('.lrte')) return;
    const svg = getSvg();
    if (!svg) return;
    const pt = svgPoint(e.nativeEvent, svg);
    onMapClick?.(e, pt);
  }, [editMode, curBG, onMapClick, getSvg]);

  const handleSvgContext = useCallback((e: React.MouseEvent) => {
    if (!editMode) return;
    e.preventDefault();
  }, [editMode]);

  if (!bg) return null;

  return (
    <svg
      ref={svgRef}
      className="map-svg iact"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      onClick={handleSvgClick}
      onContextMenu={handleSvgContext}
    >
      <defs>{buildDefs(bg.routes)}</defs>
      <g style={{ display: layers.rte ? '' : 'none' }}>
        {bg.routes.map((r, i) => (
          <Route
            key={i}
            data={r}
            index={i}
            squigglyMode={squigglyMode}
            onWpDragStart={handleWpDragStart}
            onWpContextMenu={handleWpContext}
            onRouteContextMenu={handleRouteContext}
            onInsertWaypoint={handleInsertWaypoint}
          />
        ))}
      </g>
      <g style={{ display: layers.gy ? '' : 'none' }}>
        {bg.graveyards.map((g, i) => (
          <Graveyard
            key={i}
            data={g}
            index={i}
            onDragStart={handleDragStart}
            onContextMenu={handleMarkerContext}
          />
        ))}
      </g>
      <g style={{ display: layers.buf ? '' : 'none' }}>
        {bg.powerups.map((b, i) => (
          <Powerup
            key={i}
            data={b}
            index={i}
            onDragStart={handleDragStart}
            onContextMenu={handleMarkerContext}
          />
        ))}
      </g>
      <g style={{ display: layers.obj ? '' : 'none' }}>
        {bg.objectives.map((o, i) => (
          <Objective
            key={i}
            data={o}
            index={i}
            onDragStart={handleDragStart}
            onContextMenu={handleMarkerContext}
          />
        ))}
      </g>
    </svg>
  );
}
