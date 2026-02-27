// src/ui.js
// DOM references + UI rendering + UI event bindings.

export function initUI() {
  const timeDisplay = document.getElementById("timeDisplay");
  const inventoryDisplay = document.getElementById("inventoryDisplay");
  const logEl = document.getElementById("log");
  const btnPause = document.getElementById("btnPause");

  if (!timeDisplay || !inventoryDisplay || !logEl || !btnPause) {
    throw new Error("UI init failed: missing required DOM elements.");
  }

  return { timeDisplay, inventoryDisplay, logEl, btnPause };
}

export function bindUI(ui, state, onLog) {
  ui.btnPause.addEventListener("click", () => {
    state.isPaused = !state.isPaused;
    ui.btnPause.textContent = state.isPaused ? "Play" : "Pause";
    if (onLog) onLog(state.isPaused ? "⏸ Paused" : "▶️ Playing");
  });
}

export function renderUI(state, ui) {
  ui.timeDisplay.textContent =
    `Day ${state.time.day} | Month ${state.time.month} | Year ${state.time.year} | Season: ${state.time.season}`;

  ui.inventoryDisplay.textContent =
    `Slime Fruit: ${state.inventory.slimeFruit}`;

  // Render last N log lines
  const last = state.log.slice(-40);
  ui.logEl.innerHTML = last.map(line => `<div>${escapeHtml(line)}</div>`).join("");
  ui.logEl.scrollTop = ui.logEl.scrollHeight;
}

// Avoid HTML injection in logs
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
