import { useState } from 'react';
import { useBG } from '../context/BattlegroundContext';
import { exportJSON, importJSON } from '../utils/storage';
import { shareConfig } from '../services/sharing';

export default function EditBar() {
  const { state, dispatch } = useBG();
  const { editMode, curBG, bgs } = state;
  const bg = bgs[curBG];
  const [sharing, setSharing] = useState(false);

  const handleExport = () => {
    exportJSON(curBG, bgs);
  };

  const handleImport = async () => {
    const data = await importJSON();
    if (data) {
      dispatch({ type: 'IMPORT_DATA', bgId: curBG, data });
    }
  };

  const handleShare = async () => {
    setSharing(true);
    const url = await shareConfig(curBG, bgs);
    setSharing(false);
    if (url) {
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } else {
      alert('Failed to create share link.');
    }
  };

  const handleReset = () => {
    if (!bg || !confirm('Reset ' + bg.name + ' to defaults?')) return;
    dispatch({ type: 'RESET_BG', bgId: curBG });
  };

  const handleResetAll = () => {
    if (!confirm('Reset ALL battlegrounds to defaults? This cannot be undone.')) return;
    dispatch({ type: 'RESET_ALL' });
  };

  if (!editMode) return null;

  const btnClass = "px-2.5 py-1 rounded border border-[var(--border-accent)] bg-[var(--bg-surface)] text-[var(--edit-text)] cursor-pointer transition-all duration-[120ms] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--accent-gold)]";
  const dangerBtnClass = "px-2.5 py-1 rounded border border-[var(--danger-border)] bg-[var(--bg-surface)] text-[var(--danger)] cursor-pointer transition-all duration-[120ms] hover:bg-[var(--danger-hover-bg)] hover:border-[var(--danger)]";

  return (
    <div className="px-3.5 py-[5px] bg-[var(--edit-bg)] border-b border-[var(--edit-border)] flex gap-2 items-center shrink-0 text-[var(--edit-text)]">
      <span>✎ Editing: <strong>{bg?.name}</strong></span>
      <button className={btnClass} onClick={handleExport}>Export JSON</button>
      <button className={btnClass} onClick={() => void handleImport()}>Import JSON</button>
      <button className={btnClass} onClick={() => void handleShare()} disabled={sharing}>{sharing ? 'Sharing...' : 'Share'}</button>
      <button className={dangerBtnClass} onClick={handleReset}>Reset to Default</button>
      <button className={dangerBtnClass} onClick={handleResetAll}>Reset All BGs</button>
      <span className="text-[var(--edit-hint)] text-xs ml-auto">Click map to add · Drag to move · Right-click to delete · Click route to add waypoint</span>
    </div>
  );
}
