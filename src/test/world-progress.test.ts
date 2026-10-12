import { describe, expect, it } from "vitest";
import { biomeAt, CART_SCALE, PLAYER_STATS, terrainY, worldAt } from "@/lib/world-progress";

describe("World presentation rules", () => {
  it("enlarges the cart by 20 percent", () => {
    expect(CART_SCALE).toBe(1.2);
  });
  it("uses 700 as the XP level", () => {
    expect(PLAYER_STATS.level).toBe(700);
  });
  it("retains a 9.0 CGPA", () => {
    expect(PLAYER_STATS.cgpa.toFixed(1)).toBe("9.0");
  });
  it("maps scroll to biomes", () => {
    expect(biomeAt(0)).toBe("spawn");
    expect(biomeAt(1)).toBe("cave");
    expect(biomeAt(2)).toBe("nether");
    expect(biomeAt(3)).toBe("cherry");
  });
  it("recognizes entry to Cherry Summit", () => {
    expect(worldAt(2.6)).toBe(3);
    expect(worldAt(2)).toBe(2);
  });
  it("interpolates the terrain between points", () => {
    expect(terrainY(0)).toBe(61);
    expect(terrainY(0.2)).toBeCloseTo(60.5);
  });
});
