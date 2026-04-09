import { useBG } from '../context/BattlegroundContext';

interface Props {
  visible: boolean;
}

export default function Sidebar({ visible }: Props) {
  const { state, dispatch } = useBG();
  const { bgs, curBG } = state;

  const blitz = Object.entries(bgs).filter(([, v]) => v.cat === 'blitz');
  const epic = Object.entries(bgs).filter(([, v]) => v.cat === 'epic');

  return (
    <nav className={`sidebar w-[200px] bg-[var(--bg-panel)] border-r border-[var(--border-default)] overflow-y-auto shrink-0 pb-4${visible ? '' : ' hidden'}`} id="sidebar">
      <div className="px-3 pt-2.5 pb-1 text-sm text-[var(--text-muted)] uppercase tracking-[1.2px] font-bold">Blitz &nbsp;8v8</div>
      {blitz.map(([id, bg]) => (
        <button
          key={id}
          className={`block w-full py-2 px-3 bg-transparent border-none cursor-pointer text-left transition-[background] duration-[120ms] border-l-[3px] ${curBG === id ? 'bg-[var(--bg-surface)] border-l-[var(--accent-gold)]' : 'border-l-transparent hover:bg-[var(--bg-surface-hover)] hover:border-l-[var(--accent-gold-dim)]'}`}
          data-bg={id}
          onClick={() => dispatch({ type: 'SELECT_BG', id })}
        >
          <span className={`font-medium block ${curBG === id ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'}`}>{bg.name}</span>
          <span className="text-[var(--text-muted)] text-sm block mt-0.5 font-semibold">{bg.short} &middot; {bg.type}</span>
        </button>
      ))}
      <div className="px-3 pt-2.5 pb-1 text-[var(--text-muted)] uppercase tracking-[1.2px] font-bold border-t border-[var(--border-default)] mt-1">Epic &nbsp;40v40</div>
      {epic.map(([id, bg]) => (
        <button
          key={id}
          className={`block w-full py-2 px-3 bg-transparent border-none cursor-pointer text-left transition-[background] duration-[120ms] border-l-[3px] ${curBG === id ? 'bg-[var(--bg-surface)] border-l-[var(--accent-gold)]' : 'border-l-transparent hover:bg-[var(--bg-surface-hover)] hover:border-l-[var(--accent-gold-dim)]'}`}
          data-bg={id}
          onClick={() => dispatch({ type: 'SELECT_BG', id })}
        >
          <span className={`font-medium block ${curBG === id ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'}`}>{bg.name}</span>
          <span className="text-[var(--text-muted)] block mt-0.5 font-semibold text-sm">{bg.short} &middot; {bg.type}</span>
        </button>
      ))}
    </nav>
  );
}
