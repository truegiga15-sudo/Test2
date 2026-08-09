import type { StellarStage, StageDefinition } from "./types";
import { SIMULATION, COLORS } from "../data/constants";

export const STAGES: StageDefinition[] = [
  {
    stage: "PROTOSTAR",
    label: "Newborn Protostar",
    startYears: 0,
    endYears: SIMULATION.protostarYears,
    color: COLORS.protostar,
    description: "A collapsing molecular-cloud core heats as gravity converts potential energy into thermal energy."
  },
  {
    stage: "MAIN_SEQUENCE",
    label: "Main Sequence",
    startYears: SIMULATION.protostarYears,
    endYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears,
    color: COLORS.mainSequence,
    description: "Hydrogen fusion dominates the core. The star spends most of its stable life here."
  },
  {
    stage: "RED_SUPERGIANT",
    label: "Red Supergiant",
    startYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears,
    endYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears,
    color: COLORS.giant,
    description: "The core contracts while the envelope expands dramatically and cools at the photosphere."
  },
  {
    stage: "CORE_COLLAPSE",
    label: "Core Collapse",
    startYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears,
    endYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears,
    color: 0x8c0000,
    description: "The iron-rich core loses pressure support and collapses in milliseconds in the physical universe."
  },
  {
    stage: "SUPERNOVA",
    label: "Supernova",
    startYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears,
    endYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears + SIMULATION.supernovaDurationYears,
    color: COLORS.shock,
    description: "A catastrophic explosion ejects the stellar envelope and leaves a compact remnant."
  },
  {
    stage: "BLACK_HOLE",
    label: "Black Hole",
    startYears: SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears + SIMULATION.supernovaDurationYears,
    endYears: Number.POSITIVE_INFINITY,
    color: COLORS.blackHole,
    description: "The remnant is modeled as a rotating black hole surrounded by a stylized accretion/lensing field."
  }
];

export function stageDefinition(stage: StellarStage): StageDefinition {
  return STAGES.find((item) => item.stage === stage)!;
}

export function stageProgress(stage: StellarStage, ageYears: number): number {
  const d = stageDefinition(stage);
  if (!Number.isFinite(d.endYears)) return 1;
  return Math.min(1, Math.max(0, (ageYears - d.startYears) / (d.endYears - d.startYears)));
}
