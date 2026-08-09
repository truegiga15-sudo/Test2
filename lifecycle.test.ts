import { describe, expect, it } from "vitest";
import { stageAtAge } from "../src/core/physics";
import { SIMULATION } from "../src/data/constants";

describe("stellar lifecycle", () => {
  it("starts as a protostar", () => {
    expect(stageAtAge(0)).toBe("PROTOSTAR");
  });

  it("reaches the main sequence", () => {
    expect(stageAtAge(SIMULATION.protostarYears + 1)).toBe("MAIN_SEQUENCE");
  });

  it("becomes a red supergiant", () => {
    const age = SIMULATION.protostarYears + SIMULATION.mainSequenceYears + 1;
    expect(stageAtAge(age)).toBe("RED_SUPERGIANT");
  });

  it("collapses and then explodes", () => {
    const giantEnd =
      SIMULATION.protostarYears +
      SIMULATION.mainSequenceYears +
      SIMULATION.redSupergiantYears;

    expect(stageAtAge(giantEnd + 1)).toBe("CORE_COLLAPSE");
    expect(stageAtAge(giantEnd + SIMULATION.collapseYears + 1)).toBe("SUPERNOVA");
  });

  it("ends as a black hole", () => {
    const finalAge =
      SIMULATION.protostarYears +
      SIMULATION.mainSequenceYears +
      SIMULATION.redSupergiantYears +
      SIMULATION.collapseYears +
      SIMULATION.supernovaDurationYears + 1;

    expect(stageAtAge(finalAge)).toBe("BLACK_HOLE");
  });
});
