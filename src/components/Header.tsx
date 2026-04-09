import { useState } from 'react';
import { getTheme, toggleTheme } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [theme, setTheme] = useState(getTheme);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAnonymous, signOut } = useAuth();

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
      <div className="ml-auto flex items-center gap-2">
        {isAnonymous ? (
          <button
            className="bg-transparent border border-[var(--border-default)] rounded-md px-2.5 py-1 cursor-pointer text-[var(--text-secondary)] text-xs flex items-center gap-1.5 transition-all duration-150 hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)]"
            onClick={() => setShowAuth(true)}
          >
            Sign Up
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</span>
            <button
              className="bg-transparent border border-[var(--border-default)] rounded-md px-2.5 py-1 cursor-pointer text-[var(--text-secondary)] text-xs flex items-center gap-1.5 transition-all duration-150 hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)]"
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>
        )}
        <button
          className="bg-transparent border border-[var(--border-default)] rounded-md px-2.5 py-1 cursor-pointer text-[var(--text-secondary)] text-base flex items-center gap-2 transition-all duration-150 hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)]"
          onClick={handleToggle}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
          <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
}
