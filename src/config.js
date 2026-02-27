// src/config.js
// Central place for tuning values so we don't hard-code them all over the codebase.

export const CONFIG = {
  // Canvas/world
  canvasSizePx: 400,

  // Tick speed: how many real seconds = one in-game day (MVP default)
  secondsPerGameDay: 1.0,

  // ---- Plot / Grid (Milestone B foundation) ----
  grid: {
    cols: 3,
    rows: 3,

    // Configurable tile size (we'll draw the grid scaled by this)
    tileSizePx: 128,

    // Gap between tiles
    gapPx: 25,
    
    // Outer padding around the entire grid
    paddingPx: 8,

    // Where to place the grid on the canvas
    // (Renderer will interpret this; for now we’ll center it)
    placement: "center", // "center" | "topLeft" (future)
  },

  // Starting tiles on the grid
  // Coordinates: (x,y) where x increases to the right, y increases downward
  startingTiles: [
    { type: "tree", x: 1, y: 0 },
    { type: "tree", x: 2, y: 0 },
    { type: "chest", x: 0, y: 2 },
  ],
};






