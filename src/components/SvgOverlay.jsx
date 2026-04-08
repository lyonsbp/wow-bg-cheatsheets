import { useRef, useCallback } from 'react';
import { useBG } from '../context/BattlegroundContext';
import { svgPoint, distToSegment } from '../utils/geometry';
import Graveyard from './markers/Graveyard';
import Powerup from './markers/Powerup';
import Route from './markers/Route';
import Objective from './markers/Objective';

function buildDefs(routes) {
  const seen = new Set();
  return routes.map((r, i) => {
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

export default function SvgOverlay({ onMapClick, svgRef: externalSvgRef }) {
  const { state, dispatch } = useBG();
  const { bgs, curBG, layers, editMode, squigglyMode } = state;
  const bg = bgs[curBG];

  const dragRef = useRef(null);
  const wpDragRef = useRef(null);
  const internalSvgRef = useRef(null);
  const svgRef = externalSvgRef || internalSvgRef;

  const getSvg = useCallback(() => svgRef.current, [svgRef]);

  // ── Marker drag ──
  const handleDragStart = useCallback((e, layer, index) => {
    if (!editMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    el.classList.add('dragging');
    dragRef.current = { el, layer, index };

    const onMove = (me) => {
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
  const handleMarkerContext = useCallback((e, layer, index) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const item = bg[layer][index];
    if (!confirm('Delete "' + item.n + '"?')) return;
    dispatch({ type: 'DELETE_MARKER', bgId: curBG, layer, index });
  }, [editMode, bg, curBG, dispatch]);

  // ── Waypoint drag ──
  const handleWpDragStart = useCallback((e, ridx, pidx) => {
    if (!editMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    el.classList.add('dragging');
    wpDragRef.current = { el, ridx, pidx };

    const onMove = (me) => {
      const wd = wpDragRef.current;
      if (!wd) return;
      const svg = getSvg();
      if (!svg) return;
      const pt = svgPoint(me, svg);
      const nx = Math.round(pt.x * 10) / 10;
      const ny = Math.round(pt.y * 10) / 10;
      wd.el.setAttribute('cx', nx);
      wd.el.setAttribute('cy', ny);
      wd.lastPos = { x: nx, y: ny };

      // Update polylines live
      const g = wd.el.closest('.lrte');
      if (g) {
        const route = bg.routes[wd.ridx];
        const tempPts = [...route.pts];
        tempPts[wd.pidx] = [nx, ny];
        const newPtsStr = tempPts.map(p => p[0] + ',' + p[1]).join(' ');
        const glow = g.querySelector('.rte-glow');
        const line = g.querySelector('.rte-line');
        const hit = g.querySelector('.rte-hit');
        if (glow?.getAttribute('points') !== undefined) {
          glow.setAttribute('points', newPtsStr);
          line.setAttribute('points', newPtsStr);
          hit.setAttribute('points', newPtsStr);
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
  const handleWpContext = useCallback((e, ridx, pidx) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const route = bg.routes[ridx];
    if (route.pts.length <= 2) {
      if (!confirm('Route "' + route.n + '" only has 2 points. Delete entire route?')) return;
      dispatch({ type: 'DELETE_ROUTE', bgId: curBG, index: ridx });
    } else {
      dispatch({ type: 'DELETE_WAYPOINT', bgId: curBG, routeIdx: ridx, pointIdx: pidx });
    }
  }, [editMode, bg, curBG, dispatch]);

  // ── Delete route ──
  const handleRouteContext = useCallback((e, ridx) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const route = bg.routes[ridx];
    if (!confirm('Delete route "' + route.n + '"?')) return;
    dispatch({ type: 'DELETE_ROUTE', bgId: curBG, index: ridx });
  }, [editMode, bg, curBG, dispatch]);

  // ── Insert waypoint ──
  const handleInsertWaypoint = useCallback((e, ridx) => {
    if (!editMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = getSvg();
    if (!svg) return;
    const pt = svgPoint(e, svg);
    const route = bg.routes[ridx];
    if (!route) return;

    let bestIdx = route.pts.length - 1;
    let bestDist = Infinity;
    for (let i = 0; i < route.pts.length - 1; i++) {
      const d = distToSegment(pt.x, pt.y, route.pts[i], route.pts[i + 1]);
      if (d < bestDist) { bestDist = d; bestIdx = i + 1; }
    }

    const nx = Math.round(pt.x * 10) / 10;
    const ny = Math.round(pt.y * 10) / 10;
    dispatch({ type: 'INSERT_WAYPOINT', bgId: curBG, routeIdx: ridx, insertIdx: bestIdx, x: nx, y: ny });
  }, [editMode, bg, curBG, dispatch, getSvg]);

  // ── SVG click for adding markers ──
  const handleSvgClick = useCallback((e) => {
    if (!editMode || !curBG || e.button !== 0) return;
    if (e.target.closest('.mk') || e.target.closest('.lrte')) return;
    const svg = getSvg();
    if (!svg) return;
    const pt = svgPoint(e, svg);
    onMapClick?.(e, pt);
  }, [editMode, curBG, onMapClick, getSvg]);

  const handleSvgContext = useCallback((e) => {
    if (!editMode) return;
    e.preventDefault();
  }, [editMode]);

  if (!bg) return null;

  return (
    <svg
      ref={svgRef}
      className={`map-svg${editMode ? ' iact' : ' iact'}`}
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
