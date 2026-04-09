import { useBG } from '../context/BattlegroundContext';

function Toggle({ on, color, borderColor, bgColor, onClick, children }: {
  on: boolean; color: string; borderColor: string; bgColor: string;
  onClick: () => void; children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 cursor-pointer px-2.5 py-[3px] rounded border text-sm transition-all duration-150 select-none"
      style={{
        borderColor,
        color,
        opacity: on ? 1 : 'var(--toggle-off-opacity)' as unknown as number,
        background: on ? bgColor : 'transparent',
      }}
      onClick={onClick}
    >
      <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: 'currentColor' }}></span>
      {children}
    </span>
  );
}

export default function LayerBar() {
  const { state, dispatch } = useBG();
  const { layers, editMode, squigglyMode, strokeWidth } = state;

  return (
    <div className="px-3.5 py-1.5 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex gap-2 items-center shrink-0 flex-wrap">
      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide mr-0.5">Layers:</span>
      <Toggle on={layers.gy} color="var(--ltog-gy)" borderColor="var(--ltog-gy-border)" bgColor="var(--ltog-gy-bg)" onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'gy' })}>Graveyards</Toggle>
      <Toggle on={layers.buf} color="var(--ltog-buf)" borderColor="var(--ltog-buf-border)" bgColor="var(--ltog-buf-bg)" onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'buf' })}>Power-ups</Toggle>
      <Toggle on={layers.rte} color="var(--ltog-rte)" borderColor="var(--ltog-rte-border)" bgColor="var(--ltog-rte-bg)" onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'rte' })}>Routes</Toggle>
      <label className="inline-flex items-center gap-1 text-xs text-[var(--ltog-rte)] cursor-default" title="Route thickness">
        <span className="text-[var(--text-muted)] uppercase tracking-[.5px]">Thickness</span>
        <input
          type="range"
          min="0.3"
          max="2.0"
          step="0.1"
          value={strokeWidth}
          className="w-[60px] h-1 bg-[var(--slider-track)] rounded-sm outline-none cursor-pointer"
          onChange={(e) => dispatch({ type: 'SET_STROKE_WIDTH', width: parseFloat(e.target.value) })}
        />
      </label>
      <Toggle on={squigglyMode} color="var(--ltog-rte)" borderColor="var(--ltog-rte-border)" bgColor="var(--ltog-rte-bg)" onClick={() => dispatch({ type: 'TOGGLE_SQUIGGLY' })}>Squiggly</Toggle>
      <Toggle on={layers.obj} color="var(--ltog-obj)" borderColor="var(--ltog-obj-border)" bgColor="var(--ltog-obj-bg)" onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'obj' })}>Objectives</Toggle>
      <span className="ml-auto"></span>
      <Toggle on={editMode} color="var(--ltog-edt)" borderColor="var(--ltog-edt-border)" bgColor="var(--ltog-edt-bg)" onClick={() => dispatch({ type: 'TOGGLE_EDIT' })}>Edit Mode</Toggle>
    </div>
  );
}
