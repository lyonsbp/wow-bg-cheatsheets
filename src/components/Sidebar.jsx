import { useBG } from '../context/BattlegroundContext';

export default function Sidebar({ visible }) {
  const { state, dispatch } = useBG();
  const { bgs, curBG } = state;

  const blitz = Object.entries(bgs).filter(([, v]) => v.cat === 'blitz');
  const epic = Object.entries(bgs).filter(([, v]) => v.cat === 'epic');

  return (
    <nav className={`sidebar${visible ? '' : ' hidden'}`} id="sidebar">
      <div className="sb-section">Blitz &nbsp;8v8</div>
      {blitz.map(([id, bg]) => (
        <button
          key={id}
          className={`bg-btn${curBG === id ? ' active' : ''}`}
          data-bg={id}
          onClick={() => dispatch({ type: 'SELECT_BG', id })}
        >
          <span className="bgn">{bg.name}</span>
          <span className="bgm">{bg.short} &middot; {bg.type}</span>
        </button>
      ))}
      <div className="sb-section">Epic &nbsp;40v40</div>
      {epic.map(([id, bg]) => (
        <button
          key={id}
          className={`bg-btn${curBG === id ? ' active' : ''}`}
          data-bg={id}
          onClick={() => dispatch({ type: 'SELECT_BG', id })}
        >
          <span className="bgn">{bg.name}</span>
          <span className="bgm">{bg.short} &middot; {bg.type}</span>
        </button>
      ))}
    </nav>
  );
}
