import { EventBus } from "./events";
import { evolve, initialState } from "./physics";
import type { SimulationSnapshot, StellarState } from "./types";
import { SIMULATION } from "../data/constants";

export class StellarSimulation {
  readonly events = new EventBus();
  private state: StellarState = initialState();
  private accumulator = 0;
  private realSeconds = 0;
  private speed = 1;
  private paused = false;

  getState(): StellarState { return this.state; }
  getSpeed(): number { return this.speed; }
  isPaused(): boolean { return this.paused; }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.05, Math.min(100, speed));
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  reset(): void {
    this.state = initialState();
    this.accumulator = 0;
    this.realSeconds = 0;
    this.paused = false;
    this.events.emit({ type: "reset" });
  }

  tick(realDeltaSeconds: number): void {
    if (this.paused) return;

    const frameDelta = Math.min(realDeltaSeconds, SIMULATION.maxAccumulatorSeconds);
    this.realSeconds += frameDelta;
    this.accumulator += frameDelta * this.speed;

    while (this.accumulator >= SIMULATION.fixedStepSeconds) {
      const before = this.state.stage;
      const dtYears = SIMULATION.fixedStepSeconds * SIMULATION.yearsPerRealSecond;
      this.state = evolve(this.state, dtYears);
      this.accumulator -= SIMULATION.fixedStepSeconds;

      if (before !== this.state.stage) {
        this.events.emit({
          type: "stageChanged",
          from: before,
          to: this.state.stage,
          ageYears: this.state.ageYears
        });
        if (this.state.stage === "SUPERNOVA") {
          this.events.emit({
            type: "supernova",
            energyJ: 1.0e44,
            remnantMassSolar: Math.max(3, this.state.coreMassSolar * 0.92)
          });
        }
      }
    }

    this.events.emit({ type: "tick", ageYears: this.state.ageYears });
  }

  snapshot(): SimulationSnapshot {
    return {
      elapsedRealSeconds: this.realSeconds,
      simulatedYears: this.state.ageYears,
      speed: this.speed,
      paused: this.paused,
      state: { ...this.state }
    };
  }
}
