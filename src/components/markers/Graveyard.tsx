import type { Graveyard as GraveyardData, MarkerLayer } from '../../types';
import { gyColor } from '../../utils/colors';

interface Props {
  data: GraveyardData;
  index: number;
  onDragStart?: (e: React.MouseEvent, layer: MarkerLayer, index: number) => void;
  onContextMenu?: (e: React.MouseEvent, layer: MarkerLayer, index: number) => void;
}

export default function Graveyard({ data, index, onDragStart, onContextMenu }: Props) {
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
      <title>{data.n} ({data.f.charAt(0).toUpperCase() + data.f.slice(1)} Graveyard)</title>
      <circle r="1.15" fill={c} stroke="#000a" strokeWidth="0.2" opacity=".88" />
      <text x="0" y=".4" textAnchor="middle" fontSize="1" fill="#fff" fontWeight="700" opacity=".9">†</text>
    </g>
  );
}
