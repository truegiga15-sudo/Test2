export const SIMULATION = {
  defaultMassSolar: 25,
  defaultMetallicity: 0.014,
  yearsPerRealSecond: 10_000_000,
  fixedStepSeconds: 1 / 60,
  maxAccumulatorSeconds: 0.25,

  protostarYears: 12_000_000,
  mainSequenceYears: 7_000_000,
  redSupergiantYears: 1_200_000,
  collapseYears: 2_000,

  supernovaDurationYears: 40,
  blackHoleRadiusKm: 74.0,

  solarMassKg: 1.98847e30,
  solarRadiusKm: 695_700,
  solarLuminosityW: 3.828e26
} as const;

export const COLORS = {
  protostar: 0xffd9a8,
  mainSequence: 0xfff3cc,
  giant: 0xff6f1d,
  shock: 0xffe8c7,
  blackHole: 0x050505
} as const;
