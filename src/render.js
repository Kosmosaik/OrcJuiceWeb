// src/render.js
// Canvas rendering: Milestone B draws the plot grid + placeholders for tiles.

export function initRenderer(config) {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
  if (!canvas) throw new Error("Renderer init failed: #gameCanvas not found.");

  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
  if (!ctx) throw new Error("Renderer init failed: canvas 2D context not available.");

  // Keep canvas dimensions in sync with config
  canvas.width = config.canvasSizePx;
  canvas.height = config.canvasSizePx;

  /**
   * @param {{ state:any, config:any }} args
   */
  function render({ state, config }) {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background label (optional debug text)
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "18px system-ui";
    ctx.fillText("Orcslime MVP", 20, 40);

    // Draw grid (if exists)
    const grid = state?.world?.grid;
    if (!grid) return;

    const tileSize = config.grid.tileSizePx;

    // Compute pixel size of grid
    const gridW = grid.cols * tileSize;
    const gridH = grid.rows * tileSize;

    // Placement: center (for now)
    const originX = Math.floor((canvas.width - gridW) / 2);
    const originY = Math.floor((canvas.height - gridH) / 2);

    // Draw tiles
    for (const tile of grid.tiles) {
      const x = originX + tile.x * tileSize;
      const y = originY + tile.y * tileSize;

      // Tile background
      ctx.fillStyle = "#1b1f24";
      ctx.fillRect(x, y, tileSize, tileSize);

      // Tile border
      ctx.strokeStyle = "#39424e";
      ctx.strokeRect(x, y, tileSize, tileSize);

      // Draw placeholder content per tile type
      drawTileContent(ctx, tile, x, y, tileSize);
    }
  }

  return { render };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{type:string, x:number, y:number}} tile
 * @param {number} px
 * @param {number} py
 * @param {number} s
 */
function drawTileContent(ctx, tile, px, py, s) {
  if (tile.type === "empty") return;

  ctx.font = "14px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (tile.type === "tree") {
    // simple icon + label
    ctx.fillStyle = "#7ee787";
    ctx.fillText("🌳", px + s / 2, py + s / 2 - 10);
    ctx.fillStyle = "#c9d1d9";
    ctx.fillText("Tree", px + s / 2, py + s / 2 + 14);
    return;
  }

  if (tile.type === "chest") {
    ctx.fillStyle = "#ffdf5d";
    ctx.fillText("📦", px + s / 2, py + s / 2 - 10);
    ctx.fillStyle = "#c9d1d9";
    ctx.fillText("Chest", px + s / 2, py + s / 2 + 14);
    return;
  }

  // Unknown type (debug)
  ctx.fillStyle = "#ff7b72";
  ctx.fillText("?", px + s / 2, py + s / 2);
}
