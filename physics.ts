import { SIMULATION } from "../data/constants";
import type { StellarStage, StellarState } from "./types";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function initialState(massSolar = SIMULATION.defaultMassSolar, metallicity = SIMULATION.defaultMetallicity): StellarState {
  return {
    ageYears: 0,
    stage: "PROTOSTAR",
    massSolar,
    coreMassSolar: massSolar * 0.08,
    radiusSolar: 3.5,
    temperatureK: 4_500,
    luminositySolar: 1_500,
    surfaceGravity: 0.7,
    metallicity,
    rotation: 0.32,
    emittedEnergyJ: 0,
    supernovaEnergyJ: 0,
    remnantMassSolar: 0,
    eventIndex: 0
  };
}

export function stageAtAge(ageYears: number): StellarStage {
  if (ageYears < SIMULATION.protostarYears) return "PROTOSTAR";
  if (ageYears < SIMULATION.protostarYears + SIMULATION.mainSequenceYears) return "MAIN_SEQUENCE";
  if (ageYears < SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears) return "RED_SUPERGIANT";
  if (ageYears < SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears) return "CORE_COLLAPSE";
  if (ageYears < SIMULATION.protostarYears + SIMULATION.mainSequenceYears + SIMULATION.redSupergiantYears + SIMULATION.collapseYears + SIMULATION.supernovaDurationYears) return "SUPERNOVA";
  return "BLACK_HOLE";
}

export function evolve(prev: StellarState, dtYears: number): StellarState {
  const age = prev.ageYears + Math.max(0, dtYears);
  const stage = stageAtAge(age);
  const totalPreCollapse = SIMULATION.protostarYears + SIMULATION.mainSequenceYears;
  const giantStart = totalPreCollapse;
  const giantEnd = giantStart + SIMULATION.redSupergiantYears;
  const collapseEnd = giantEnd + SIMULATION.collapseYears;
  const snEnd = collapseEnd + SIMULATION.supernovaDurationYears;

  let mass = prev.massSolar;
  let radius = prev.radiusSolar;
  let temperature = prev.temperatureK;
  let luminosity = prev.luminositySolar;
  let core = prev.coreMassSolar;
  let emitted = prev.emittedEnergyJ;
  let snEnergy = prev.supernovaEnergyJ;
  let remnant = prev.remnantMassSolar;
  let rotation = prev.rotation;

  // A deliberately simplified wind-loss model.
  const windLossRate = stage === "RED_SUPERGIANT"
    ? 4.0e-7
    : stage === "MAIN_SEQUENCE"
      ? 8.0e-9
      : stage === "PROTOSTAR"
        ? 1.5e-8
        : 0;

  mass = Math.max(8, mass - windLossRate * dtYears);

  if (stage === "PROTOSTAR") {
    const t = clamp(age / SIMULATION.protostarYears, 0, 1);
    radius = 3.5 - 1.8 * smoothstep(t);
    temperature = 4_500 + 10_500 * smoothstep(t);
    luminosity = 1_500 - 1_150 * t;
    core = mass * (0.08 + 0.05 * t);
  } else if (stage === "MAIN_SEQUENCE") {
    const t = clamp((age - SIMULATION.protostarYears) / SIMULATION.mainSequenceYears, 0, 1);
    radius = 1.7 + 2.0 * t;
    temperature = 34_000 - 6_000 * t;
    luminosity = 75_000 * (1 + 0.7 * t);
    core = mass * (0.13 + 0.10 * t);
    rotation = 0.32 - 0.08 * t;
  } else if (stage === "RED_SUPERGIANT") {
    const t = clamp((age - giantStart) / SIMULATION.redSupergiantYears, 0, 1);
    radius = 800 + 900 * smoothstep(t);
    temperature = 4_300 - 1_000 * t;
    luminosity = 280_000 + 130_000 * smoothstep(t);
    core = mass * (0.30 + 0.16 * t);
    rotation = 0.18 - 0.07 * t;
  } else if (stage === "CORE_COLLAPSE") {
    const t = clamp((age - giantEnd) / SIMULATION.collapseYears, 0, 1);
    radius = 1_700 * (1 - smoothstep(t)) + 0.04;
    temperature = 3_300 + 4.5e9 * smoothstep(t);
    luminosity = 420_000 * (1 - t) + 2.0e10 * t;
    core = mass * (0.45 + 0.15 * t);
    rotation = 0.11 * (1 - t);
  } else if (stage === "SUPERNOVA") {
    const t = clamp((age - collapseEnd) / SIMULATION.supernovaDurationYears, 0, 1);
    radius = 30_000 * Math.max(0.02, 1 - t);
    temperature = 1.0e9 * Math.exp(-4 * t) + 8_000;
    luminosity = 1.0e10 * Math.exp(-7 * t);
    core = mass * 0.5;
    snEnergy = 1.0e44 * (1 - Math.exp(-8 * t));
  } else {
    radius = SIMULATION.blackHoleRadiusKm / SIMULATION.solarRadiusKm;
    temperature = 0;
    luminosity = 0;
    remnant = clamp(core * 0.92, 3.0, 15.0);
    mass = remnant;
    core = remnant;
    rotation = 0.65;
  }

  const dtSeconds = (dtYears / SIMULATION.yearsPerRealSecond);
  emitted += Math.max(0, luminosity) * SIMULATION.solarLuminosityW * dtSeconds;

  return {
    ...prev,
    ageYears: age,
    stage,
    massSolar: mass,
    coreMassSolar: core,
    radiusSolar: radius,
    temperatureK: temperature,
    luminositySolar: luminosity,
    surfaceGravity: stage === "BLACK_HOLE" ? Infinity : Math.max(0, mass / Math.max(radius * radius, 1e-6)),
    rotation,
    emittedEnergyJ: emitted,
    supernovaEnergyJ: snEnergy,
    remnantMassSolar: remnant,
    eventIndex: prev.eventIndex
  };
}
