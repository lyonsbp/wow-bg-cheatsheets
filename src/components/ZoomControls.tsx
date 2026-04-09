import { useBG } from '../context/BattlegroundContext';

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 4;
export const ZOOM_STEP = 0.25;

export default function ZoomControls() {
  const { state, dispatch } = useBG();
  const { zoomScale } = state;

  const zoomIn = () => dispatch({ type: 'SET_ZOOM', scale: Math.min(ZOOM_MAX, zoomScale + ZOOM_STEP) });
  const zoomOut = () => dispatch({ type: 'SET_ZOOM', scale: Math.max(ZOOM_MIN, zoomScale - ZOOM_STEP) });
  const zoomReset = () => dispatch({ type: 'SET_ZOOM', scale: 1 });

  return (
    <div className="absolute bottom-3 right-3 z-50 flex flex-col gap-1">
      <button className="w-8 h-8 rounded border border-[var(--border-default)] bg-[var(--bg-panel)] text-[var(--text-primary)] text-base cursor-pointer flex items-center justify-center transition-all duration-[120ms] leading-none opacity-90 hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)]" onClick={zoomIn} title="Zoom in">+</button>
      <div className="text-xs text-[var(--text-muted)] text-center py-0.5 pointer-events-none select-none">{Math.round(zoomScale * 100)}%</div>
      <button className="w-8 h-8 rounded border border-[var(--border-default)] bg-[var(--bg-panel)] text-[var(--text-primary)] text-base cursor-pointer flex items-center justify-center transition-all duration-[120ms] leading-none opacity-90 hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)]" onClick={zoomOut} title="Zoom out">−</button>
      <button className="w-8 h-8 rounded border border-[var(--border-default)] bg-[var(--bg-panel)] text-[var(--text-primary)] text-xs cursor-pointer flex items-center justify-center transition-all duration-[120ms] leading-none opacity-90 mt-0.5 hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)]" onClick={zoomReset} title="Reset zoom">1:1</button>
    </div>
  );
}
