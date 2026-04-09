import { useBG } from '../context/BattlegroundContext';
import { exportJSON, importJSON } from '../utils/storage';

export default function EditBar() {
  const { state, dispatch } = useBG();
  const { editMode, curBG, bgs } = state;
  const bg = bgs[curBG];

  const handleExport = () => {
    exportJSON(curBG, bgs);
  };

  const handleImport = async () => {
    const data = await importJSON();
    if (data) {
      dispatch({ type: 'IMPORT_DATA', bgId: curBG, data });
    }
  };

  const handleReset = () => {
    if (!bg || !confirm('Reset ' + bg.name + ' to defaults?')) return;
    dispatch({ type: 'RESET_BG', bgId: curBG });
  };

  if (!editMode) return null;

  return (
    <div className="px-3.5 py-[5px] bg-[var(--edit-bg)] border-b border-[var(--edit-border)] flex gap-2 items-center shrink-0 text-[var(--edit-text)]">
      <span>✎ Editing: <strong>{bg?.name}</strong></span>
      <button className="px-2.5 py-1 rounded border border-[var(--border-accent)] bg-[var(--bg-surface)] text-[var(--edit-text)] cursor-pointer transition-all duration-[120ms] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--accent-gold)]" onClick={handleExport}>Export JSON</button>
      <button className="px-2.5 py-1 rounded border border-[var(--border-accent)] bg-[var(--bg-surface)] text-[var(--edit-text)] cursor-pointer transition-all duration-[120ms] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--accent-gold)]" onClick={() => void handleImport()}>Import JSON</button>
      <button className="px-2.5 py-1 rounded border border-[var(--danger-border)] bg-[var(--bg-surface)] text-[var(--danger)] cursor-pointer transition-all duration-[120ms] hover:bg-[var(--danger-hover-bg)] hover:border-[var(--danger)]" onClick={handleReset}>Reset to Default</button>
      <span className="text-[var(--edit-hint)] text-xs ml-auto">Click map to add · Drag to move · Right-click to delete · Click route to add waypoint</span>
    </div>
  );
}
