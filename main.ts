import "./style.css";
import { StellarSimulation } from "./core/simulation";
import { StarScene } from "./render/StarScene";
import { Dashboard } from "./ui/Dashboard";
import { Controls } from "./ui/controls";
import { formatYears } from "./utils/format";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="shell">
    <section id="viewport" class="viewport">
      <div class="hud">
        <span>REAL TIME → COSMIC TIME</span>
        <strong>1 SEC ≈ 10 MILLION YEARS</strong>
      </div>
      <div id="controls" class="controls-host"></div>
    </section>
    <section id="dashboard"></section>
  </main>
`;

const simulation = new StellarSimulation();
const viewport = document.querySelector<HTMLElement>("#viewport")!;
const dashboard = new Dashboard(document.querySelector<HTMLElement>("#dashboard")!);
const scene = new StarScene(viewport);
new Controls(document.querySelector<HTMLElement>("#controls")!, simulation);

simulation.events.on("stageChanged", (event) => {
  dashboard.pushEvent(`STAGE TRANSITION: ${event.from} → ${event.to} at ${formatYears(event.ageYears)}`);
});

simulation.events.on("supernova", (event) => {
  dashboard.pushEvent(`SUPERNOVA DETECTED: ${event.energyJ.toExponential(2)} J; remnant ${event.remnantMassSolar.toFixed(2)} M☉`);
  scene.triggerSupernova();
});

simulation.events.on("reset", () => dashboard.pushEvent("STAR RESET: molecular-cloud collapse initialized"));

let last = performance.now();

function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;

  simulation.tick(dt);
  dashboard.update(simulation.getState());
  scene.update(simulation.getState(), dt);

  requestAnimationFrame(frame);
}

dashboard.pushEvent("SIMULATION ONLINE: newborn massive star created");
dashboard.update(simulation.getState());
requestAnimationFrame(frame);
