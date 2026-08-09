# Stellar Collapse Lab

A deliberately over-engineered, browser-based stellar-evolution simulator.

The simulation begins with a newborn massive star and advances its internal clock every real-world second. It models a simplified stellar lifecycle:

**Protostar → Main Sequence → Red Supergiant → Core Collapse → Supernova → Black Hole**

This is an educational visualization, not a research-grade stellar-evolution code. The physics is intentionally parameterized so the architecture can be extended without rewriting the renderer or UI.

## Highlights

- TypeScript + Vite
- Three.js starfield and physically-inspired volumetric-looking sphere
- Fixed-step simulation clock with pause, speed control, and deterministic state transitions
- Event bus for decoupled simulation/render/UI communication
- Modular stellar physics model
- Supernova shockwave, debris particles, lensing-like black-hole visualization
- Live telemetry panels
- Evolution timeline
- Event log
- Reset and speed controls
- Unit-aware formatting utilities
- Vitest tests for lifecycle transitions and conservation-style invariants

## Quick start

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
npm run typecheck
npm test
npm run build
```

## Simulation assumptions

The default star is intentionally massive (`~25 M☉`) so that it follows a core-collapse path. The simulation compresses cosmic time aggressively:

- 1 real second = 10 million simulated years by default.
- The timescale can be changed from the UI.
- The transition thresholds are pedagogical and should not be interpreted as exact astrophysical predictions.

The black-hole remnant is formed from the collapsed core after the supernova event. The UI distinguishes the progenitor's pre-collapse mass from the remnant mass.

## Project layout

```text
src/
  core/
    events.ts       Event bus
    lifecycle.ts    State machine
    physics.ts      Simplified stellar model
    simulation.ts   Fixed-step simulation engine
    types.ts        Domain types
  data/
    constants.ts    Simulation constants
  render/
    StarScene.ts    Three.js scene
    effects.ts      Shockwave/debris helpers
  ui/
    Dashboard.ts    DOM dashboard
    controls.ts     Control wiring
  utils/
    format.ts       Display formatting
    math.ts         Math helpers
  main.ts           Application composition root
tests/
  lifecycle.test.ts
  physics.test.ts
```

## Why the architecture is split up

The renderer should not know *why* a star becomes a red supergiant, and the physics model should not know *how* pixels are drawn. Keeping those concerns separate makes it straightforward to add:

- binary-star interactions
- metallicity
- neutron-star outcomes
- Type II / Type Ib/c supernova variants
- accretion disks
- gravitational lensing
- multiple stars
- save/load snapshots
- Web Workers for large populations
- procedural spectral lines
- a scientific-data export pipeline
