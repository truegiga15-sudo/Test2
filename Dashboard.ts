import type { StellarState } from "../core/types";
import { stageDefinition, STAGES, stageProgress } from "../core/lifecycle";
import { formatNumber, formatScientific, formatYears } from "../utils/format";

export class Dashboard {
  private root: HTMLElement;
  private eventLog: HTMLElement;
  private stageBadge: HTMLElement;
  private age: HTMLElement;
  private mass: HTMLElement;
  private temp: HTMLElement;
  private radius: HTMLElement;
  private luminosity: HTMLElement;
  private energy: HTMLElement;
  private progress: HTMLProgressElement;
  private timeline: HTMLElement;

  constructor(container: HTMLElement) {
    container.innerHTML = `
      <aside class="dashboard">
        <header class="brand">
          <div>
            <div class="eyebrow">STELLAR COLLAPSE LAB</div>
            <h1>STAR // 001</h1>
          </div>
          <span id="stage-badge" class="badge">PROTOSTAR</span>
        </header>

        <section class="panel hero">
          <div class="metric-large"><span id="age">0 yr</span><small>SIMULATED AGE</small></div>
          <div class="progress-wrap">
            <div class="progress-label"><span>CURRENT PHASE</span><span id="phase-percent">0%</span></div>
            <progress id="phase-progress" value="0" max="1"></progress>
          </div>
        </section>

        <section class="panel grid">
          <div class="stat"><span>MASS</span><strong id="mass">25 M☉</strong></div>
          <div class="stat"><span>RADIUS</span><strong id="radius">3.5 R☉</strong></div>
          <div class="stat"><span>TEMPERATURE</span><strong id="temp">4,500 K</strong></div>
          <div class="stat"><span>LUMINOSITY</span><strong id="luminosity">1,500 L☉</strong></div>
          <div class="stat wide"><span>ENERGY RADIATED</span><strong id="energy">0 J</strong></div>
        </section>

        <section class="panel">
          <div class="section-title">EVOLUTION TRACK</div>
          <div id="timeline" class="timeline"></div>
        </section>

        <section class="panel log-panel">
          <div class="section-title">EVENT STREAM</div>
          <div id="event-log" class="event-log"></div>
        </section>
      </aside>
    `;

    this.root = container;
    this.stageBadge = container.querySelector("#stage-badge")!;
    this.age = container.querySelector("#age")!;
    this.mass = container.querySelector("#mass")!;
    this.temp = container.querySelector("#temp")!;
    this.radius = container.querySelector("#radius")!;
    this.luminosity = container.querySelector("#luminosity")!;
    this.energy = container.querySelector("#energy")!;
    this.progress = container.querySelector("#phase-progress") as HTMLProgressElement;
    this.eventLog = container.querySelector("#event-log")!;
    this.timeline = container.querySelector("#timeline")!;

    this.timeline.innerHTML = STAGES.map((stage) => `
      <div class="timeline-row" data-stage="${stage.stage}">
        <i></i><div><b>${stage.label}</b><span>${stage.description}</span></div>
      </div>
    `).join("");
  }

  update(state: StellarState): void {
    const definition = stageDefinition(state.stage);
    const progress = stageProgress(state.stage, state.ageYears);

    this.stageBadge.textContent = definition.label.toUpperCase();
    this.stageBadge.dataset.stage = state.stage;
    this.age.textContent = formatYears(state.ageYears);
    this.mass.textContent = `${formatNumber(state.massSolar)} M☉`;
    this.radius.textContent = `${formatNumber(state.radiusSolar)} R☉`;
    this.temp.textContent = `${formatNumber(state.temperatureK, 0)} K`;
    this.luminosity.textContent = `${formatScientific(state.luminositySolar, "L☉")}`;
    this.energy.textContent = formatScientific(state.emittedEnergyJ, "J");
    this.progress.value = progress;

    const pct = this.root.querySelector("#phase-percent")!;
    pct.textContent = `${Math.round(progress * 100)}%`;

    this.timeline.querySelectorAll(".timeline-row").forEach((row) => {
      const stage = row.getAttribute("data-stage");
      row.classList.toggle("active", stage === state.stage);
      row.classList.toggle("passed", STAGES.findIndex(s => s.stage === stage) < STAGES.findIndex(s => s.stage === state.stage));
    });
  }

  pushEvent(message: string): void {
    const item = document.createElement("div");
    item.className = "event";
    item.innerHTML = `<time>${new Date().toLocaleTimeString()}</time><span>${message}</span>`;
    this.eventLog.prepend(item);
    while (this.eventLog.children.length > 12) this.eventLog.lastElementChild?.remove();
  }
}
