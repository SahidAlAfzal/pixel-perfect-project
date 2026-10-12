export const PLAYER_STATS = { level: 700, cgpa: 9.0 };
export const CART_SCALE = 1.2;

export type Biome = "spawn" | "cave" | "nether" | "cherry";
export const BIOMES: Biome[] = ["spawn", "cave", "nether", "cherry"];

/** Ground line: [x in viewport widths (0..4), y as % of screen height from top]. */
export const TERRAIN: [number, number][] = [
  [0, 61], [0.4, 60], [0.8, 62], [1.1, 63], [1.5, 61], [1.85, 59],
  [2.2, 58], [2.6, 59], [2.9, 62], [3.3, 60], [3.7, 58], [4, 58],
];

export function terrainY(x: number) {
  const pts = TERRAIN;
  if (x <= pts[0]![0]) return pts[0]![1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i]!;
    const [x0, y0] = pts[i - 1]!;
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1]![1];
}

export function terrainPath() {
  return "M" + TERRAIN.map(([x, y]) => `${x * 100} ${y}`).join(" L");
}

export function worldAt(progress: number) {
  return Math.min(3, Math.max(0, Math.round(progress)));
}

export function biomeAt(progress: number): Biome {
  return BIOMES[worldAt(progress)]!;
}
