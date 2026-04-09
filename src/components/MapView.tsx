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
    wrap.classList.add('cursor-grabbing');
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
      mapWrapRef.current?.classList.remove('cursor-grabbing');
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
    <div className="flex-1 flex overflow-hidden min-h-0 relative">
      <button
        className="absolute top-1/2 left-0 z-[60] w-5 h-11 bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-muted)] cursor-pointer flex items-center justify-center transition-all duration-150 rounded-r -translate-y-1/2 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]"
        onClick={onToggleSidebar}
        title="Toggle sidebar"
      >
        {sidebarVisible ? '◀' : '▶'}
      </button>
      <button
        className="absolute top-1/2 right-0 z-[60] w-5 h-11 bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-muted)] cursor-pointer flex items-center justify-center transition-all duration-150 rounded-l -translate-y-1/2 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]"
        onClick={onToggleTips}
        title="Toggle tips"
      >
        {tipsVisible ? '▶' : '◀'}
      </button>

      <div
        ref={mapWrapRef}
        className={`flex-1 flex items-center justify-center p-3.5 overflow-auto bg-[var(--map-bg)] min-w-0 relative${zoomScale > 1 ? ' cursor-grab' : ''}`}
        onMouseDown={handlePanStart}
      >
        <ZoomControls />
        <div
          className={`relative inline-block leading-none origin-center transition-transform duration-150 ease-out${editMode ? ' edit-active' : ''}`}
          style={{ transform: `scale(${zoomScale})` }}
        >
          {bg.map ? (
            <img
              className="block max-w-full max-h-[calc(100vh-160px)] border-2 border-[var(--map-border)] rounded"
              src={bg.map}
              alt={bg.name + ' map'}
              style={{ display: mapLoaded ? 'block' : 'none' }}
              onLoad={() => { setMapLoaded(true); setMapError(false); }}
              onError={() => { setMapLoaded(false); setMapError(true); }}
            />
          ) : null}

          {(!bg.map || mapError) && (
            <div className="w-[580px] h-[460px] max-w-full border-2 border-dashed border-[var(--border-default)] rounded flex flex-col items-center justify-center gap-2.5 text-[var(--text-muted)]" style={{ background: 'var(--map-ph-bg)' }}>
              <div className="text-lg text-[var(--text-secondary)] font-semibold">{bg.name}</div>
              <div className="text-[var(--text-muted)]">Map image unavailable &mdash; check warcraft.wiki.gg</div>
            </div>
          )}

          {bg.map && !mapLoaded && !mapError && (
            <div className="w-[580px] h-[460px] max-w-full border-2 border-dashed border-[var(--border-default)] rounded flex flex-col items-center justify-center gap-2.5 text-[var(--text-muted)]" style={{ background: 'var(--map-ph-bg)' }}>
              <div className="text-lg text-[var(--text-secondary)] font-semibold">{bg.name}</div>
              <div className="text-[var(--text-muted)]">Loading map...</div>
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
