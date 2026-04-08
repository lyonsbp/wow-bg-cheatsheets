export function seededRng(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function squigglyPath(waypoints: [number, number][], seed: number): string {
  const rng = seededRng(seed);
  const wobble = 1.4;
  const segLen = 2.5;
  let d = `M ${waypoints[0]![0]} ${waypoints[0]![1]}`;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const cur = waypoints[i]!;
    const next = waypoints[i + 1]!;
    const ax = cur[0], ay = cur[1];
    const bx = next[0], by = next[1];
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
