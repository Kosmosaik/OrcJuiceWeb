// src/main.js
// Entry point: bootstraps modules and starts the loop.

import { CONFIG } from "./config.js";
import { createInitialState, pushLog } from "./state.js";
import { updateTime } from "./time.js";
import { initUI, bindUI, renderUI } from "./ui.js";
import { initRenderer } from "./render.js";
import { startGameLoop } from "./gameLoop.js";

// ---------- Boot ----------
const state = createInitialState();
const ui = initUI();
const renderer = initRenderer(CONFIG);

// Centralized logger so systems/UI can log safely
function log(msg) {
  pushLog(state, msg);
}

// Bind inputs
bindUI(ui, state, log);

// Initial UI
log("Boot complete. Skeleton running.");
renderUI(state, ui);

// Start loop
startGameLoop({
  state,
  config: CONFIG,
  onUpdate: (dt, { state, config }) => {
    updateTime(state, dt, config, log);
  },
  onRender: () => {
    renderer.render();
  },
  onUI: () => {
    renderUI(state, ui);
  },
});
