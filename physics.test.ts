import { describe, expect, it } from "vitest";
import { evolve, initialState } from "../src/core/physics";

describe("stellar physics", () => {
  it("does not reduce a massive progenitor below the configured floor before collapse", () => {
    let state = initialState(25);
    for (let i = 0; i < 100; i++) state = evolve(state, 1_000_000);
    expect(state.massSolar).toBeGreaterThanOrEqual(8);
  });

  it("produces a compact remnant in the black-hole stage", () => {
    const state = initialState(25);
    const blackHole = evolve(state, 30_000_000);
    expect(blackHole.stage).toBe("BLACK_HOLE");
    expect(blackHole.remnantMassSolar).toBeGreaterThanOrEqual(3);
    expect(blackHole.luminositySolar).toBe(0);
  });
});
