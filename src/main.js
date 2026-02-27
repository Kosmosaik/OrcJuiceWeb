// src/main.js
// Entry point: initializes state, starts the game loop, updates UI, draws to canvas.

import { CONFIG } from "./config.js";

// ---------- DOM references ----------
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

const timeDisplay = document.getElementById("timeDisplay");
const inventoryDisplay = document.getElementById("inventoryDisplay");
const logEl = document.getElementById("log");
const btnPause = document.getElementById("btnPause");

// ---------- Game state (single source of truth) ----------
/**
 * Keep everything here. Systems will update this state over time.
 * Later we will split this into modules (TimeSystem, Plot, etc.).
 */
const game = {
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

// ---------- Helpers ----------
function log(msg) {
  game.log.push(msg);
  // Keep log from growing forever in MVP
  if (game.log.length > 200) game.log.shift();
}

function updateUI() {
  timeDisplay.textContent = `Day ${game.time.day} | Month ${game.time.month} | Year ${game.time.year} | Season: ${game.time.season}`;
  inventoryDisplay.textContent = `Slime Fruit: ${game.inventory.slimeFruit}`;

  // Render last N log lines
  const last = game.log.slice(-40);
  logEl.innerHTML = last.map(line => `<div>${escapeHtml(line)}</div>`).join("");
  logEl.scrollTop = logEl.scrollHeight;
}

// Avoid HTML injection in logs
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- Temporary Time Simulation (Milestone 0 only) ----------
function updateTime(dt) {
  // dt is seconds since last frame
  game.time._acc += dt;

  if (game.time._acc >= CONFIG.secondsPerGameDay) {
    game.time._acc = 0;
    // Advance one in-game day
    game.time.day += 1;

    // Super simple month/year for now (30-day months)
    if (game.time.day > 30) {
      game.time.day = 1;
      game.time.month += 1;
      if (game.time.month > 12) {
        game.time.month = 1;
        game.time.year += 1;
        log(`🎉 Happy new year! Year is now ${game.time.year}`);
      }
    }

    // Update season based on month
    game.time.season = getSeasonFromMonth(game.time.month);
  }
}

function getSeasonFromMonth(month) {
  if (month >= 1 && month <= 3) return "Spring";
  if (month >= 4 && month <= 6) return "Summer";
  if (month >= 7 && month <= 9) return "Autumn";
  return "Winter";
}

// ---------- Rendering (Milestone 0 only) ----------
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

// ---------- Game Loop ----------
let lastTs = performance.now();

function loop(ts) {
  const dt = (ts - lastTs) / 1000;
  lastTs = ts;

  if (!game.isPaused) {
    updateTime(dt);
  }

  render();
  updateUI();

  requestAnimationFrame(loop);
}

// ---------- Inputs ----------
btnPause.addEventListener("click", () => {
  game.isPaused = !game.isPaused;
  btnPause.textContent = game.isPaused ? "Play" : "Pause";
  log(game.isPaused ? "⏸ Paused" : "▶️ Playing");
});

// ---------- Boot ----------
log("Boot complete. Skeleton running.");
updateUI();
requestAnimationFrame(loop);