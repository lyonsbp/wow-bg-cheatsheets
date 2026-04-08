import { gyColor } from '../../utils/colors';

export default function Graveyard({ data, index, onDragStart, onContextMenu }) {
  const c = gyColor(data.f || 'neutral');
  return (
    <g
      className="mk lgy"
      data-layer="graveyards"
      data-idx={index}
      transform={`translate(${data.x},${data.y})`}
      onMouseDown={(e) => onDragStart?.(e, 'graveyards', index)}
      onContextMenu={(e) => onContextMenu?.(e, 'graveyards', index)}
    >
      <title>{data.n}</title>
      <circle r="1.15" fill={c} stroke="#000a" strokeWidth="0.2" opacity=".88" />
      <text x="0" y=".4" textAnchor="middle" fontSize="1" fill="#fff" fontWeight="700" opacity=".9">†</text>
    </g>
  );
}
