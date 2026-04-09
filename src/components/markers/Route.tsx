import type { Route as RouteData } from '../../types';
import { pts } from '../../utils/geometry';
import { squigglyPath } from '../../utils/squiggly';

interface Props {
  data: RouteData;
  index: number;
  squigglyMode: boolean;
  strokeWidth: number;
  onWpDragStart?: (e: React.MouseEvent, ridx: number, pidx: number) => void;
  onWpContextMenu?: (e: React.MouseEvent, ridx: number, pidx: number) => void;
  onRouteContextMenu?: (e: React.MouseEvent, ridx: number) => void;
  onInsertWaypoint?: (e: React.MouseEvent, ridx: number) => void;
}

export default function Route({ data, index, squigglyMode, strokeWidth, onWpDragStart, onWpContextMenu, onRouteContextMenu, onInsertWaypoint }: Props) {
  const sw = strokeWidth;
  const dash = data.d ? `${2 * sw},${1.5 * sw}` : undefined;

  const wps = data.pts.map((p, pi) => (
    <circle
      key={pi}
      className="rte-wp"
      data-ridx={index}
      data-pidx={pi}
      cx={p[0]}
      cy={p[1]}
      r="1.0"
      fill={data.c}
      stroke="#fff"
      strokeWidth=".3"
      opacity=".85"
      onMouseDown={(e) => onWpDragStart?.(e, index, pi)}
      onContextMenu={(e) => onWpContextMenu?.(e, index, pi)}
    />
  ));

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!(e.target as Element).closest('.rte-wp')) onRouteContextMenu?.(e, index);
  };

  if (squigglyMode) {
    const seed = index * 7919 + 42;
    const d = squigglyPath(data.pts, seed);
    return (
      <g className="lrte" data-ridx={index} onContextMenu={handleContextMenu}>
        <path className="rte-glow" d={d} fill="none" stroke={data.c}
          strokeWidth={3 * sw} opacity=".15" strokeDasharray={dash} />
        <path className="rte-line" d={d} fill="none" stroke={data.c}
          strokeWidth={1.1 * sw} opacity=".85" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={dash} />
        <polyline points={pts(data.pts)} fill="none" stroke="transparent"
          strokeWidth="4" className="rte-hit" data-ridx={index}
          onClick={(e) => onInsertWaypoint?.(e, index)} />
        <title>{data.n}</title>
        {wps}
      </g>
    );
  }

  return (
    <g className="lrte" data-ridx={index} onContextMenu={handleContextMenu}>
      <polyline className="rte-glow" points={pts(data.pts)} fill="none" stroke={data.c}
        strokeWidth={2.25 * sw} opacity=".12" strokeDasharray={dash} />
      <polyline className="rte-line" points={pts(data.pts)} fill="none" stroke={data.c}
        strokeWidth={0.6 * sw} opacity=".75" strokeLinecap="round" strokeLinejoin="round"
        markerEnd={data.d ? undefined : `url(#arr-${data.c.slice(1)})`}
        strokeDasharray={dash} />
      <polyline points={pts(data.pts)} fill="none" stroke="transparent"
        strokeWidth="4" className="rte-hit" data-ridx={index}
        onClick={(e) => onInsertWaypoint?.(e, index)} />
      <title>{data.n}</title>
      {wps}
    </g>
  );
}
