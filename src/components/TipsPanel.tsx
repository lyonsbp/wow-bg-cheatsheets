import { useBG } from '../context/BattlegroundContext';
import type { Route } from '../types';

function Legend({ routes }: { routes: Route[] }) {
  return (
    <div className="mt-3.5">
      <div className="text-[.75rem] text-[var(--text-muted)] uppercase tracking-wide mb-1.5 pb-[3px] border-b border-[var(--border-default)]">Legend</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ background: '#4488cc' }}></div>Alliance Graveyard</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ background: '#cc3344' }}></div>Horde Graveyard</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ background: '#7a8898' }}></div>Neutral Graveyard</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rotate-45 shrink-0" style={{ background: '#00e5ff' }}></div>Speed Buff (+100% MS)</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rotate-45 shrink-0" style={{ background: '#ff6600' }}></div>Berserking (+30% dmg)</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-[9px] h-[9px] rotate-45 shrink-0" style={{ background: '#44dd88' }}></div>Restoration (HP/mana)</div>
      <div className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium"><div className="w-3 h-3 shrink-0 flex items-center justify-center text-[.75rem]">★</div>Capture Node / Objective</div>
      {routes.map((r, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-[5px] text-[.8rem] text-[var(--text-secondary)] font-medium">
          <div
            className="w-[18px] h-[3px] shrink-0 rounded-sm"
            style={{
              background: r.d ? 'transparent' : r.c,
              borderBottom: r.d ? `2px dashed ${r.c}` : undefined,
              height: r.d ? 0 : undefined,
            }}
          ></div>
          {r.n}
        </div>
      ))}
    </div>
  );
}

interface Props {
  visible: boolean;
}

export default function TipsPanel({ visible }: Props) {
  const { state, dispatch } = useBG();
  const { bgs, curBG, editMode } = state;
  const bg = bgs[curBG];
  if (!bg) return null;

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...bg.tips];
    newTips[index] = value;
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: newTips });
  };

  const handleTipMove = (index: number, dir: number) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= bg.tips.length) return;
    const newTips = [...bg.tips];
    [newTips[index], newTips[newIdx]] = [newTips[newIdx]!, newTips[index]!];
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: newTips });
  };

  const handleTipDelete = (index: number) => {
    const newTips = [...bg.tips];
    newTips.splice(index, 1);
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: newTips });
  };

  const handleTipAdd = () => {
    const text = prompt('New strategy tip:');
    if (!text) return;
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: [...bg.tips, text] });
  };

  return (
    <div className={`tips-panel w-[230px] bg-[var(--bg-panel)] border-l border-[var(--border-default)] p-3 overflow-y-auto shrink-0${visible ? '' : ' hidden'}`} id="tipsPanel">
      <div className="text-[.8rem] text-[var(--accent-gold)] uppercase tracking-wide mb-2 pb-[5px] border-b border-[var(--border-default)] font-bold">Strategy Tips</div>
      <div>
        {editMode ? (
          <>
            {bg.tips.map((t, i) => (
              <div key={i} className="flex items-start gap-1 mb-1.5 relative">
                <textarea
                  className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-[var(--text-primary)] text-[.8rem] px-[7px] py-[5px] leading-[1.5] resize-y min-h-[32px] font-[inherit] focus:border-[var(--input-focus-border)] focus:outline-none"
                  rows={2}
                  defaultValue={t}
                  onBlur={(e) => handleTipChange(i, e.target.value)}
                />
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-[.75rem] cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]" title="Move up" onClick={() => handleTipMove(i, -1)}>▲</button>
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-[.75rem] cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]" title="Move down" onClick={() => handleTipMove(i, 1)}>▼</button>
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-[.75rem] cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:text-[var(--danger)] hover:border-[var(--danger-border)]" title="Delete" onClick={() => handleTipDelete(i)}>✕</button>
                </div>
              </div>
            ))}
            <button className="block w-full py-[5px] mt-1 bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] rounded text-[var(--text-muted)] text-[.75rem] cursor-pointer text-center transition-all duration-[120ms] hover:border-[var(--border-accent)] hover:text-[var(--edit-text)] hover:bg-[var(--bg-surface-hover)]" onClick={handleTipAdd}>+ Add Tip</button>
          </>
        ) : (
          bg.tips.map((t, i) => (
            <div key={i} className="tip-item text-[.8rem] text-[var(--text-secondary)] mb-2 pl-3 relative leading-[1.5] font-bold">{t}</div>
          ))
        )}
      </div>
      <Legend routes={bg.routes} />
    </div>
  );
}
