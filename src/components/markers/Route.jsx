import { pts } from '../../utils/geometry';
import { squigglyPath } from '../../utils/squiggly';

export default function Route({ data, index, squigglyMode, onWpDragStart, onWpContextMenu, onRouteContextMenu, onInsertWaypoint }) {
  const wps = data.pts.map((p, pi) => (
    <circle
      key={pi}
      className="rte-wp"
      data-ridx={index}
      data-pidx={pi}
      cx={p[0]}
      cy={p[1]}
      r="1.8"
      fill={data.c}
      stroke="#fff"
      strokeWidth=".4"
      opacity=".85"
      onMouseDown={(e) => onWpDragStart?.(e, index, pi)}
      onContextMenu={(e) => onWpContextMenu?.(e, index, pi)}
    />
  ));

  if (squigglyMode) {
    const seed = index * 7919 + 42;
    const d = squigglyPath(data.pts, seed);
    return (
      <g
        className="lrte"
        data-ridx={index}
        onContextMenu={(e) => {
          if (!e.target.closest('.rte-wp')) onRouteContextMenu?.(e, index);
        }}
      >
        <path className="rte-glow" d={d} fill="none" stroke={data.c}
          strokeWidth="3" opacity=".15" />
        <path className="rte-line" d={d} fill="none" stroke={data.c}
          strokeWidth="1.1" opacity=".85" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts(data.pts)} fill="none" stroke="transparent"
          strokeWidth="4" className="rte-hit" data-ridx={index}
          onClick={(e) => onInsertWaypoint?.(e, index)} />
        <title>{data.n}</title>
        {wps}
      </g>
    );
  }

  return (
    <g
      className="lrte"
      data-ridx={index}
      onContextMenu={(e) => {
        if (!e.target.closest('.rte-wp')) onRouteContextMenu?.(e, index);
      }}
    >
      <polyline className="rte-glow" points={pts(data.pts)} fill="none" stroke={data.c}
        strokeWidth="2.25" opacity=".12" />
      <polyline className="rte-line" points={pts(data.pts)} fill="none" stroke={data.c}
        strokeWidth=".6" opacity=".75" strokeLinecap="round" strokeLinejoin="round"
        markerEnd={`url(#arr-${data.c.slice(1)})`} />
      <polyline points={pts(data.pts)} fill="none" stroke="transparent"
        strokeWidth="4" className="rte-hit" data-ridx={index}
        onClick={(e) => onInsertWaypoint?.(e, index)} />
      <title>{data.n}</title>
      {wps}
    </g>
  );
}
