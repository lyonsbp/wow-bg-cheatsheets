import { useBG } from '../context/BattlegroundContext';

export default function BgHeader() {
  const { state } = useBG();
  const bg = state.bgs[state.curBG];
  if (!bg) return null;

  return (
    <div className="px-3.5 py-2 bg-[var(--bg-panel)] border-b border-[var(--border-default)] flex items-center gap-3 shrink-0 flex-wrap">
      <span className="text-xl text-[var(--accent-gold)] font-semibold">{bg.name}</span>
      <span className="px-2 py-0.5 rounded-[10px] bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">{bg.type} · {bg.size}</span>
      <span className="text-[var(--text-secondary)] ml-auto italic">🏆 {bg.win}</span>
    </div>
  );
}
