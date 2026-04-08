import { useState, useRef, useEffect, useCallback } from 'react';
import { useBG } from '../context/BattlegroundContext';
import SvgOverlay from './SvgOverlay';
import ZoomControls, { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from './ZoomControls';
import AddDialog from './AddDialog';
import TipsPanel from './TipsPanel';
import type { MapPoint } from '../types';

interface Props {
  sidebarVisible: boolean;
  tipsVisible: boolean;
  onToggleSidebar: () => void;
  onToggleTips: () => void;
}

export default function MapView({ sidebarVisible, tipsVisible, onToggleSidebar, onToggleTips }: Props) {
  const { state, dispatch } = useBG();
  const { bgs, curBG, editMode, zoomScale } = state;
  const bg = bgs[curBG];

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [addDlg, setAddDlg] = useState<{ position: { x: number; y: number }; mapPoint: MapPoint } | null>(null);

  const mapWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isPanningRef = useRef(false);
  const wasPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  useEffect(() => {
    setMapLoaded(false);
    setMapError(false);
    setAddDlg(null);
  }, [curBG]);

  // Wheel zoom
  useEffect(() => {
    const wrap = mapWrapRef.current;
    if (!wrap) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        dispatch({ type: 'SET_ZOOM', scale: Math.min(ZOOM_MAX, zoomScale + ZOOM_STEP) });
      } else {
        dispatch({ type: 'SET_ZOOM', scale: Math.max(ZOOM_MIN, zoomScale - ZOOM_STEP) });
      }
    };
    wrap.addEventListener('wheel', handler, { passive: false });
    return () => wrap.removeEventListener('wheel', handler);
  }, [zoomScale, dispatch]);

  // Pan handlers
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    if (editMode && ((e.target as Element).closest('.mk') || (e.target as Element).closest('.rte-wp') || (e.target as Element).closest('.rte-hit'))) return;
    if (e.button !== 0) return;
    if ((e.target as Element).closest('.add-dlg')) return;

    isPanningRef.current = true;
    wasPanningRef.current = false;
    const wrap = mapWrapRef.current!;
    panStartRef.current = {
      x: e.clientX, y: e.clientY,
      sx: wrap.scrollLeft, sy: wrap.scrollTop,
    };
    wrap.classList.add('panning');
    e.preventDefault();
  }, [zoomScale, editMode]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasPanningRef.current = true;
      const wrap = mapWrapRef.current;
      if (wrap) {
        wrap.scrollLeft = panStartRef.current.sx - dx;
        wrap.scrollTop = panStartRef.current.sy - dy;
      }
    };
    const onUp = () => {
      if (!isPanningRef.current) return;
      isPanningRef.current = false;
      mapWrapRef.current?.classList.remove('panning');
      setTimeout(() => { wasPanningRef.current = false; }, 0);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleMapClick = useCallback((_e: React.MouseEvent, pt: MapPoint) => {
    if (wasPanningRef.current) return;
    setAddDlg({ position: { x: _e.clientX, y: _e.clientY }, mapPoint: pt });
  }, []);

  if (!bg) return null;

  return (
    <div className="content" style={{ position: 'relative' }}>
      <button
        className="panel-tog left"
        onClick={onToggleSidebar}
        title="Toggle sidebar"
      >
        {sidebarVisible ? '◀' : '▶'}
      </button>
      <button
        className="panel-tog right"
        onClick={onToggleTips}
        title="Toggle tips"
      >
        {tipsVisible ? '▶' : '◀'}
      </button>

      <div
        ref={mapWrapRef}
        className={`map-wrap${zoomScale > 1 ? ' pannable' : ''}`}
        onMouseDown={handlePanStart}
      >
        <ZoomControls />
        <div
          className={`map-box${editMode ? ' edit-active' : ''}`}
          style={{ transform: `scale(${zoomScale})` }}
        >
          {bg.map ? (
            <img
              className="map-img"
              src={bg.map}
              alt={bg.name + ' map'}
              style={{ display: mapLoaded ? 'block' : 'none' }}
              onLoad={() => { setMapLoaded(true); setMapError(false); }}
              onError={() => { setMapLoaded(false); setMapError(true); }}
            />
          ) : null}

          {(!bg.map || mapError) && (
            <div className="map-ph" style={{ display: 'flex' }}>
              <div className="ph-name">{bg.name}</div>
              <div className="ph-note">Map image unavailable &mdash; check warcraft.wiki.gg</div>
            </div>
          )}

          {bg.map && !mapLoaded && !mapError && (
            <div className="map-ph" style={{ display: 'flex' }}>
              <div className="ph-name">{bg.name}</div>
              <div className="ph-note">Loading map...</div>
            </div>
          )}

          <SvgOverlay svgRef={svgRef} onMapClick={handleMapClick} />
        </div>
      </div>

      <TipsPanel visible={tipsVisible} />

      {addDlg && (
        <AddDialog
          position={addDlg.position}
          mapPoint={addDlg.mapPoint}
          onClose={() => setAddDlg(null)}
        />
      )}
    </div>
  );
}
