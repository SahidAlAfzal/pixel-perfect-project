import { describe, expect, it } from "vitest";
import { isNearProjectChest, PLAYER_STATS, SPAWN_SIGN_SCALE, worldAt } from "@/lib/world-progress";

describe("World presentation rules", () => {
  it("shrinks the Spawn sign by 40 percent", () => {
    expect(SPAWN_SIGN_SCALE).toBe(0.6);
  });
  it("uses 700 as the XP level", () => {
    expect(PLAYER_STATS.level).toBe(700);
  });
  it("retains a 9.0 CGPA", () => {
    expect(PLAYER_STATS.cgpa.toFixed(1)).toBe("9.0");
  });
  it("opens projects only close to the Nether chest", () => {
    expect(isNearProjectChest(2)).toBe(true);
    expect(isNearProjectChest(1)).toBe(false);
    expect(isNearProjectChest(3)).toBe(false);
  });
  it("recognizes entry to Cherry Summit", () => {
    expect(worldAt(2.6)).toBe(3);
    expect(worldAt(2)).toBe(2);
  });
});
