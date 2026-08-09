import type { StellarSimulation } from "../core/simulation";

export class Controls {
  private pauseButton: HTMLButtonElement;
  private speedSelect: HTMLSelectElement;

  constructor(container: HTMLElement, simulation: StellarSimulation) {
    container.innerHTML = `
      <div class="controls">
        <button id="pause" class="primary">PAUSE</button>
        <label>
          TIME ACCELERATION
          <select id="speed">
            <option value="0.25">0.25×</option>
            <option value="0.5">0.5×</option>
            <option value="1" selected>1×</option>
            <option value="2">2×</option>
            <option value="5">5×</option>
            <option value="10">10×</option>
            <option value="25">25×</option>
            <option value="100">100×</option>
          </select>
        </label>
        <button id="reset">RESET STAR</button>
      </div>
    `;

    this.pauseButton = container.querySelector("#pause") as HTMLButtonElement;
    this.speedSelect = container.querySelector("#speed") as HTMLSelectElement;

    this.pauseButton.onclick = () => {
      simulation.togglePause();
      this.pauseButton.textContent = simulation.isPaused() ? "RESUME" : "PAUSE";
    };

    this.speedSelect.onchange = () => simulation.setSpeed(Number(this.speedSelect.value));
    container.querySelector("#reset")!.addEventListener("click", () => {
      simulation.reset();
      this.pauseButton.textContent = "PAUSE";
      this.speedSelect.value = "1";
    });
  }
}
