import { useState } from 'react';
import { getTheme, toggleTheme } from '../utils/theme';

export default function Header() {
  const [theme, setTheme] = useState(getTheme);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <header className="header-bg border-b-2 border-[var(--border-gold)] px-[18px] py-2 flex items-center gap-3.5 shrink-0">
      <div >
        <h1 className="text-xl text-[var(--accent-gold)] tracking-wide px-2">⚔ <span className='font-semibold'>
          WoW Midnight &mdash; Battleground Cheat Sheets
          </span></h1>
        <div className="px-2 text-[var(--text-muted)] mt-px font-semibold">Graveyards &nbsp;·&nbsp; Power-ups &nbsp;·&nbsp; Routes &nbsp;·&nbsp; Objectives &nbsp;·&nbsp; Strategy Tips</div>
      </div>
      <button
        className="ml-auto bg-transparent border border-[var(--border-default)] rounded-md px-2.5 py-1 cursor-pointer text-[var(--text-secondary)] text-base flex items-center gap-2 transition-all duration-150 hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)]"
        onClick={handleToggle}
        title="Toggle theme"
      >
        {theme === 'dark' ? '☀' : '☾'}
        <span className="text-[.75rem]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </header>
  );
}
