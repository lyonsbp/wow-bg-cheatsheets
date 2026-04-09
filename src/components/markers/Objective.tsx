import type { Objective as ObjectiveData, ObjectiveType, Faction, MarkerLayer } from '../../types';
import { objColor } from '../../utils/colors';

function ObjShape({ type, color }: { type: ObjectiveType; faction?: Faction; color: string }) {
  if (type === 'zone') {
    return <circle r="5" fill={color} opacity=".12" stroke={color} strokeWidth=".4" strokeDasharray="1.2,1" />;
  }
  if (type === 'flag') {
    return (
      <>
        <line x1="0" y1="-2.5" x2="0" y2="2" stroke={color} strokeWidth=".45" />
        <polygon points="0,-2.5 2,-1.4 0,-.3" fill={color} opacity=".9" />
      </>
    );
  }
  if (type === 'base') {
    return (
      <>
        <rect x="-3" y="-3" width="6" height="6" rx=".5" fill={color} opacity=".8" stroke="#000a" strokeWidth=".35" />
        <text x="0" y="1" textAnchor="middle" fontSize="3" fill="#fff" opacity=".9">⚑</text>
      </>
    );
  }
  const pts5 = '0,-3.2 .74,-.9 3.1,-.9 1.2,.7 1.9,2.9 0,1.6 -1.9,2.9 -1.2,.7 -3.1,-.9 -.74,-.9';
  return <polygon points={pts5} fill={color} stroke="#000a" strokeWidth=".3" opacity=".88" />;
}

interface Props {
  data: ObjectiveData;
  index: number;
  onDragStart?: (e: React.MouseEvent, layer: MarkerLayer, index: number) => void;
  onContextMenu?: (e: React.MouseEvent, layer: MarkerLayer, index: number) => void;
}

export default function Objective({ data, index, onDragStart, onContextMenu }: Props) {
  const c = objColor(data.t, data.f ?? 'neutral');
  return (
    <g
      className="mk lobj"
      data-layer="objectives"
      data-idx={index}
      transform={`translate(${data.x},${data.y})`}
      onMouseDown={(e) => onDragStart?.(e, 'objectives', index)}
      onContextMenu={(e) => onContextMenu?.(e, 'objectives', index)}
    >
      <title>{data.n}</title>
      <ObjShape type={data.t} faction={data.f} color={c} />
    </g>
  );
}
