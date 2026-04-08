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
    <div className="zoom-bar">
      <button className="zbtn" onClick={zoomIn} title="Zoom in">+</button>
      <div className="zoom-level">{Math.round(zoomScale * 100)}%</div>
      <button className="zbtn" onClick={zoomOut} title="Zoom out">−</button>
      <button className="zbtn" onClick={zoomReset} title="Reset zoom" style={{ fontSize: '.65rem', marginTop: '2px' }}>1:1</button>
    </div>
  );
}
