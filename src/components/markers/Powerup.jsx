import { bufColor } from '../../utils/colors';

const DESCRIPTIONS = {
  speed: '+100% Move Speed 10s',
  berserk: '+30% Dmg / +10% Dmg Taken 60s',
  restore: 'Restore HP+Mana 10s',
};

const SYMBOLS = {
  speed: '⚡',
  berserk: '⚔',
  restore: '♥',
};

export default function Powerup({ data, index, onDragStart, onContextMenu }) {
  const c = bufColor(data.t);
  const sym = SYMBOLS[data.t] || '♥';
  return (
    <g
      className="mk lbuf"
      data-layer="powerups"
      data-idx={index}
      transform={`translate(${data.x},${data.y})`}
      onMouseDown={(e) => onDragStart?.(e, 'powerups', index)}
      onContextMenu={(e) => onContextMenu?.(e, 'powerups', index)}
    >
      <title>{data.n} — {DESCRIPTIONS[data.t] || ''}</title>
      <polygon
        points="0,-1.4 1.4,0 0,1.4 -1.4,0"
        fill={c} stroke="#000a" strokeWidth="0.2" opacity=".9"
      />
      <text x="0" y=".3" textAnchor="middle" fontSize=".9" fill="#000a">{sym}</text>
    </g>
  );
}
