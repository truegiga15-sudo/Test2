export type StellarStage =
  | "PROTOSTAR"
  | "MAIN_SEQUENCE"
  | "RED_SUPERGIANT"
  | "CORE_COLLAPSE"
  | "SUPERNOVA"
  | "BLACK_HOLE";

export interface StellarState {
  ageYears: number;
  stage: StellarStage;
  massSolar: number;
  coreMassSolar: number;
  radiusSolar: number;
  temperatureK: number;
  luminositySolar: number;
  surfaceGravity: number;
  metallicity: number;
  rotation: number;
  emittedEnergyJ: number;
  supernovaEnergyJ: number;
  remnantMassSolar: number;
  eventIndex: number;
}

export interface SimulationSnapshot {
  elapsedRealSeconds: number;
  simulatedYears: number;
  speed: number;
  paused: boolean;
  state: StellarState;
}

export interface StageDefinition {
  stage: StellarStage;
  label: string;
  startYears: number;
  endYears: number;
  color: number;
  description: string;
}
