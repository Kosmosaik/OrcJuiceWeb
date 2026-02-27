// src/render.js
// Canvas rendering: Milestone B draws the plot grid + placeholders for tiles.

export function initRenderer(config) {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
  if (!canvas) throw new Error("Renderer init failed: #gameCanvas not found.");

  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
  if (!ctx) throw new Error("Renderer init failed: canvas 2D context not available.");

  // Keep canvas dimensions in sync with config
  const tileSize = config.grid.tileSizePx;
  const gap = config.grid.gapPx ?? 0;
  const cols = config.grid.cols;
  const rows = config.grid.rows;
  
  const pad = config.grid.paddingPx ?? 0;
  
  const gridWidth =
    cols * tileSize + (cols - 1) * gap;
  
  const gridHeight =
    rows * tileSize + (rows - 1) * gap;
  
  canvas.width = gridWidth + pad * 2;
  canvas.height = gridHeight + pad * 2;

  /**
   * @param {{ state:any, config:any }} args
   */
  function render({ state, config }) {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid (if exists)
    const grid = state?.world?.grid;
    if (!grid) return;

    const tileSize = config.grid.tileSizePx;
    const gap = config.grid.gapPx ?? 0;
    const step = tileSize + gap;
    const pad = config.grid.paddingPx ?? 0;

    // Compute pixel size of grid
    const gridW = grid.cols * tileSize;
    const gridH = grid.rows * tileSize;

    // Placement: center (for now)
    const originX = pad;
    const originY = pad;

    // Draw tiles
    for (const tile of grid.tiles) {
      const x = originX + tile.x * step;
      const y = originY + tile.y * step;

    // Tile background
    ctx.fillStyle = "#15191f";
    ctx.fillRect(x, y, tileSize, tileSize);
    
    // Subtle grid line (lighter + thinner feel)
    ctx.strokeStyle = "rgba(160, 170, 185, 0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, tileSize - 1, tileSize - 1);

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
    ctx.fillText("🌳", px + s / 2, py + s / 2 - 8);
    ctx.fillStyle = "#c9d1d9";
    ctx.fillText("Tree", px + s / 2, py + s / 2 + 16);
    return;
  }

  if (tile.type === "chest") {
    ctx.fillStyle = "#ffdf5d";
    ctx.fillText("📦", px + s / 2, py + s / 2 - 8);
    ctx.fillStyle = "#c9d1d9";
    ctx.fillText("Chest", px + s / 2, py + s / 2 + 16);
    return;
  }

  // Unknown type (debug)
  ctx.fillStyle = "#ff7b72";
  ctx.fillText("?", px + s / 2, py + s / 2);
}
