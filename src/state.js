import { createGrid, applyStartingTiles } from "./grid.js";
// src/state.js
// Owns the single source of truth (game state) + small state helpers.

export function createInitialState(config) {
  const grid = createGrid(config.grid);
  const warnings = applyStartingTiles(grid, config);

  const initialState = {
    isPaused: false,

    // Time (temporary simple version for Milestone 0)
    time: {
      day: 1,
      month: 1,
      year: 0,
      season: "Spring",
      // Internal accumulator so 1 real second -> 1 game day
      _acc: 0,
    },

    // Inventory (temporary)
    inventory: {
      slimeFruit: 0,
    },

    // World
    world: {
      grid,
    },

    // Log messages (append-only)
    log: [],
  };

  // Any config warnings go to log
  for (const w of warnings) initialState.log.push(`⚠️ ${w}`);

  return initialState;
}

/**
 * Add a log line and keep log capped to avoid unbounded growth.
 * @param {ReturnType<typeof createInitialState>} state
 * @param {string} msg
 * @param {number} max
 */
export function pushLog(state, msg, max = 200) {
  state.log.push(msg);
  if (state.log.length > max) state.log.shift();
}
