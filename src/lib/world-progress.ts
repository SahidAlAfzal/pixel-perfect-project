export const PLAYER_STATS = { level: 700, cgpa: 9.0 };
export const SPAWN_SIGN_SCALE = 0.6;

export function worldAt(progress: number) {
  return Math.min(3, Math.max(0, Math.round(progress)));
}

export function isNearProjectChest(progress: number) {
  return progress >= 1.99 && progress <= 2.5;
}
