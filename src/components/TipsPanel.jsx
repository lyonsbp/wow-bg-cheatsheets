import { useBG } from '../context/BattlegroundContext';

function Legend() {
  return (
    <div className="leg">
      <div className="leg-hd">Legend</div>
      <div className="leg-row"><div className="leg-dot" style={{ background: '#4488cc' }}></div>Alliance Graveyard</div>
      <div className="leg-row"><div className="leg-dot" style={{ background: '#cc3344' }}></div>Horde Graveyard</div>
      <div className="leg-row"><div className="leg-dot" style={{ background: '#7a8898' }}></div>Neutral Graveyard</div>
      <div className="leg-row"><div className="leg-dia" style={{ background: '#00e5ff' }}></div>Speed Buff (+100% MS)</div>
      <div className="leg-row"><div className="leg-dia" style={{ background: '#ff6600' }}></div>Berserking (+30% dmg)</div>
      <div className="leg-row"><div className="leg-dia" style={{ background: '#44dd88' }}></div>Restoration (HP/mana)</div>
      <div className="leg-row"><div className="leg-star">★</div>Capture Node / Objective</div>
      <div className="leg-row"><div className="leg-line" style={{ background: '#ffd700' }}></div>Primary Route</div>
      <div className="leg-row"><div className="leg-line" style={{ background: '#4499ff', opacity: 0.7 }}></div>Secondary Route</div>
      <div className="leg-row"><div className="leg-line" style={{ background: '#88ff44', opacity: 0.7 }}></div>Alternate Route</div>
    </div>
  );
}

export default function TipsPanel({ visible }) {
  const { state, dispatch } = useBG();
  const { bgs, curBG, editMode } = state;
  const bg = bgs[curBG];
  if (!bg) return null;

  const handleTipChange = (index, value) => {
    const newTips = [...bg.tips];
    newTips[index] = value;
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: newTips });
  };

  const handleTipMove = (index, dir) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= bg.tips.length) return;
    const newTips = [...bg.tips];
    [newTips[index], newTips[newIdx]] = [newTips[newIdx], newTips[index]];
    dispatch({ type: 'UPDATE_BG_DATA', bgId: curBG, field: 'tips', data: newTips });
  };

  const handleTipDelete = (index) => {
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
    <div className={`tips${visible ? '' : ' hidden'}`} id="tipsPanel">
      <div className="tips-hd">Strategy Tips</div>
      <div>
        {editMode ? (
          <>
            {bg.tips.map((t, i) => (
              <div key={i} className="tip-edit">
                <textarea
                  className="tip-edit-text"
                  rows="2"
                  defaultValue={t}
                  onBlur={(e) => handleTipChange(i, e.target.value)}
                />
                <div className="tip-edit-acts">
                  <button className="tip-act" title="Move up" onClick={() => handleTipMove(i, -1)}>▲</button>
                  <button className="tip-act" title="Move down" onClick={() => handleTipMove(i, 1)}>▼</button>
                  <button className="tip-act danger" title="Delete" onClick={() => handleTipDelete(i)}>✕</button>
                </div>
              </div>
            ))}
            <button className="tip-add-btn" onClick={handleTipAdd}>+ Add Tip</button>
          </>
        ) : (
          bg.tips.map((t, i) => (
            <div key={i} className="tip-item">{t}</div>
          ))
        )}
      </div>
      <Legend />
    </div>
  );
}
