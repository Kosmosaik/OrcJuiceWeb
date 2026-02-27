// src/render.js
// Canvas rendering (Milestone 0 only).

export function initRenderer(config) {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
  if (!canvas) throw new Error("Renderer init failed: #gameCanvas not found.");

  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
  if (!ctx) throw new Error("Renderer init failed: canvas 2D context not available.");

  // Keep canvas dimensions in sync with config (safe even if HTML already sets it)
  canvas.width = config.canvasSizePx;
  canvas.height = config.canvasSizePx;

  function render() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw placeholder text so we know rendering works
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "18px system-ui";
    ctx.fillText("Orcslime MVP", 20, 40);

    ctx.fillStyle = "#9aa4b2";
    ctx.font = "14px system-ui";
    ctx.fillText("Next: draw 3×3 plot grid", 20, 70);
  }

  return { render };
}
