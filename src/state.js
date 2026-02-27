// src/state.js
// Owns the single source of truth (game state) + small state helpers.

export function createInitialState() {
  return {
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

    // Log messages (append-only)
    log: [],
  };
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
