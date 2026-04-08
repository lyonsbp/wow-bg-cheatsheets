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
    if (!confirm('Reset ' + bg.name + ' to defaults?')) return;
    dispatch({ type: 'RESET_BG', bgId: curBG });
  };

  return (
    <div className={`edit-bar${editMode ? ' show' : ''}`}>
      <span>✎ Editing: <strong>{bg?.name}</strong></span>
      <button className="ebtn" onClick={handleExport}>Export JSON</button>
      <button className="ebtn" onClick={handleImport}>Import JSON</button>
      <button className="ebtn danger" onClick={handleReset}>Reset to Default</button>
      <span className="edit-bar-hint">Click map to add · Drag to move · Right-click to delete · Click route to add waypoint</span>
    </div>
  );
}
