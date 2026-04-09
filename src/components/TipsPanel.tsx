import { useBG } from '../context/BattlegroundContext';
import type { Battleground } from '../types';
import {
  ROUTE_COLORS,
  ALLIANCE_BLUE, HORDE_RED, NEUTRAL_GRAY,
  SPEED_CYAN, BERSERK_ORANGE, RESTORE_GREEN,
} from '../utils/constants';

const rowBase = "flex items-center gap-1.5 mb-[5px] text-[var(--text-secondary)] cursor-pointer select-none transition-opacity duration-150";
const groupHeader = "text-xs text-[var(--text-muted)] uppercase tracking-wide mt-2 mb-1 cursor-pointer select-none flex items-center gap-1 hover:text-[var(--accent-gold)] transition-colors duration-150";
const subGroupHeader = "text-xs text-[var(--text-muted)] uppercase tracking-wide mt-1 mb-0.5 pl-2 cursor-pointer select-none flex items-center gap-1 hover:text-[var(--accent-gold)] transition-colors duration-150";

const GY_COLORS: Record<string, string> = { alliance: ALLIANCE_BLUE, horde: HORDE_RED, neutral: NEUTRAL_GRAY };
const BUF_COLORS: Record<string, string> = { speed: SPEED_CYAN, berserk: BERSERK_ORANGE, restore: RESTORE_GREEN };

function Legend({ bg }: { bg: Battleground }) {
  const { state, dispatch } = useBG();
  const { hiddenItems } = state;

  const toggle = (key: string) => dispatch({ type: 'TOGGLE_ITEM_VISIBILITY', key });
  const toggleGroup = (keys: string[]) => dispatch({ type: 'TOGGLE_GROUP_VISIBILITY', keys });
  const isHidden = (key: string) => hiddenItems.has(key);
  const isGroupHidden = (keys: string[]) => keys.length > 0 && keys.every(k => hiddenItems.has(k));

  const gyKeys = bg.graveyards.map((_, i) => `gy-${i}`);
  const bufKeys = bg.powerups.map((_, i) => `buf-${i}`);
  const objKeys = bg.objectives.map((_, i) => `obj-${i}`);
  const rteKeys = bg.routes.map((_, i) => `rte-${i}`);

  return (
    <div className="mt-3 font-medium">
      <div className="font-semibold text-lg text-[var(--accent-gold)] uppercase tracking-wide mb-1.5 pb-[3px] border-b border-[var(--border-default)]">Legend</div>

      {bg.graveyards.length > 0 && (
        <>
          <div className={`${groupHeader} ${isGroupHidden(gyKeys) ? 'opacity-40' : ''}`} onClick={() => toggleGroup(gyKeys)}>
            <span className="text-xs">{isGroupHidden(gyKeys) ? '▶' : '▼'}</span> Graveyards
          </div>
          {bg.graveyards.map((g, i) => {
            const key = `gy-${i}`;
            return (
              <div key={key} className={`${rowBase} pl-2 ${isHidden(key) ? 'opacity-30 line-through' : ''}`} onClick={() => toggle(key)}>
                <div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ background: GY_COLORS[g.f] ?? NEUTRAL_GRAY }}></div>
                {g.n}
              </div>
            );
          })}
        </>
      )}

      {bg.powerups.length > 0 && (
        <>
          <div className={`${groupHeader} ${isGroupHidden(bufKeys) ? 'opacity-40' : ''}`} onClick={() => toggleGroup(bufKeys)}>
            <span className="text-xs">{isGroupHidden(bufKeys) ? '▶' : '▼'}</span> Power-ups
          </div>
          {bg.powerups.map((p, i) => {
            const key = `buf-${i}`;
            return (
              <div key={key} className={`${rowBase} pl-2 ${isHidden(key) ? 'opacity-30 line-through' : ''}`} onClick={() => toggle(key)}>
                <div className="w-[9px] h-[9px] rotate-45 shrink-0" style={{ background: BUF_COLORS[p.t] ?? RESTORE_GREEN }}></div>
                {p.n}
              </div>
            );
          })}
        </>
      )}

      {bg.objectives.length > 0 && (
        <>
          <div className={`${groupHeader} ${isGroupHidden(objKeys) ? 'opacity-40' : ''}`} onClick={() => toggleGroup(objKeys)}>
            <span className="text-xs">{isGroupHidden(objKeys) ? '▶' : '▼'}</span> Objectives
          </div>
          {bg.objectives.map((o, i) => {
            const key = `obj-${i}`;
            return (
              <div key={key} className={`${rowBase} pl-2 ${isHidden(key) ? 'opacity-30 line-through' : ''}`} onClick={() => toggle(key)}>
                <div className="w-3 h-3 shrink-0 flex items-center justify-center text-xs">★</div>
                {o.n}
              </div>
            );
          })}
        </>
      )}

      {bg.routes.length > 0 && (() => {
        const colorGroups: { color: string; name: string; items: { idx: number; key: string }[] }[] = [];
        const colorMap = new Map<string, typeof colorGroups[number]>();
        bg.routes.forEach((r, i) => {
          let g = colorMap.get(r.c);
          if (!g) {
            g = { color: r.c, name: ROUTE_COLORS[r.c as keyof typeof ROUTE_COLORS] ?? r.c, items: [] };
            colorMap.set(r.c, g);
            colorGroups.push(g);
          }
          g.items.push({ idx: i, key: `rte-${i}` });
        });

        const routeSwatch = (r: typeof bg.routes[number]) => (
          <div className="w-[18px] h-[3px] shrink-0 rounded-sm" style={{
            background: r.d ? 'transparent' : r.c,
            borderBottom: r.d ? `2px dashed ${r.c}` : undefined,
            height: r.d ? 0 : undefined,
          }}></div>
        );

        return (
          <>
            <div className={`${groupHeader} ${isGroupHidden(rteKeys) ? 'opacity-40' : ''}`} onClick={() => toggleGroup(rteKeys)}>
              <span className="text-xs">{isGroupHidden(rteKeys) ? '▶' : '▼'}</span> Routes
            </div>
            {colorGroups.map(cg => {
              const cgKeys = cg.items.map(it => it.key);

              if (cg.items.length === 1) {
                const it = cg.items[0]!;
                const r = bg.routes[it.idx]!;
                return (
                  <div key={it.key} className={`${rowBase} pl-2 ${isHidden(it.key) ? 'opacity-30 line-through' : ''}`} onClick={() => toggle(it.key)}>
                    {routeSwatch(r)} {r.n}
                  </div>
                );
              }

              return (
                <div key={cg.color}>
                  <div className={`${subGroupHeader} ${isGroupHidden(cgKeys) ? 'opacity-40' : ''}`} onClick={() => toggleGroup(cgKeys)}>
                    <span className="text-xs">{isGroupHidden(cgKeys) ? '▶' : '▼'}</span>
                    <div className="w-2.5 h-0.5 rounded-sm shrink-0" style={{ background: cg.color }}></div>
                    {cg.name}
                  </div>
                  {cg.items.map(it => {
                    const r = bg.routes[it.idx]!;
                    return (
                      <div key={it.key} className={`${rowBase} pl-4 ${isHidden(it.key) ? 'opacity-30 line-through' : ''}`} onClick={() => toggle(it.key)}>
                        {routeSwatch(r)} {r.n}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        );
      })()}
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
      <div className="text-[var(--accent-gold)] uppercase tracking-wide mb-2 pb-[5px] border-b border-[var(--border-default)] font-bold">Strategy Tips</div>
      <div>
        {editMode ? (
          <>
            {bg.tips.map((t, i) => (
              <div key={i} className="flex items-start gap-1 mb-1.5 relative">
                <textarea
                  className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-[var(--text-primary)] px-[7px] py-[5px] leading-[1.5] resize-y min-h-[32px] font-[inherit] focus:border-[var(--input-focus-border)] focus:outline-none"
                  rows={2}
                  defaultValue={t}
                  onBlur={(e) => handleTipChange(i, e.target.value)}
                />
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]" title="Move up" onClick={() => handleTipMove(i, -1)}>▲</button>
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-gold)] hover:border-[var(--border-accent)]" title="Move down" onClick={() => handleTipMove(i, 1)}>▼</button>
                  <button className="w-[22px] h-[22px] border border-[var(--border-default)] rounded bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs cursor-pointer flex items-center justify-center transition-all duration-100 p-0 hover:text-[var(--danger)] hover:border-[var(--danger-border)]" title="Delete" onClick={() => handleTipDelete(i)}>✕</button>
                </div>
              </div>
            ))}
            <button className="block w-full py-[5px] mt-1 bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] rounded text-[var(--text-muted)] text-xs cursor-pointer text-center transition-all duration-[120ms] hover:border-[var(--border-accent)] hover:text-[var(--edit-text)] hover:bg-[var(--bg-surface-hover)]" onClick={handleTipAdd}>+ Add Tip</button>
          </>
        ) : (
          bg.tips.map((t, i) => (
            <div key={i} className="tip-item text-[var(--text-secondary)] mb-2 pl-3 relative leading-[1.5] font-bold">{t}</div>
          ))
        )}
      </div>
      <Legend bg={bg} />
    </div>
  );
}
