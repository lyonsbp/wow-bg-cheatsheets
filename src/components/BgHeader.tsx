import { useBG } from '../context/BattlegroundContext';

export default function BgHeader() {
  const { state } = useBG();
  const bg = state.bgs[state.curBG];
  if (!bg) return null;

  return (
    <div className="bg-header">
      <span className="bg-title">{bg.name}</span>
      <span className="bg-badge">{bg.type} · {bg.size}</span>
      <span className="bg-win">🏆 {bg.win}</span>
    </div>
  );
}
