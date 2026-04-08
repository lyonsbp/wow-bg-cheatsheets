export function seededRng(seed) {
  return function () {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function squigglyPath(waypoints, seed) {
  const rng = seededRng(seed);
  const wobble = 1.4;
  const segLen = 2.5;
  let d = `M ${waypoints[0][0]} ${waypoints[0][1]}`;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const ax = waypoints[i][0], ay = waypoints[i][1];
    const bx = waypoints[i + 1][0], by = waypoints[i + 1][1];
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.1) continue;
    const nx = -dy / len, ny = dx / len;
    const steps = Math.max(2, Math.ceil(len / segLen));

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const px = ax + dx * t;
      const py = ay + dy * t;
      const isEnd = (s === steps && i === waypoints.length - 2);
      const w = isEnd ? 0 : (rng() - 0.5) * 2 * wobble;
      d += ` L ${(px + nx * w).toFixed(2)} ${(py + ny * w).toFixed(2)}`;
    }
  }
  return d;
}
