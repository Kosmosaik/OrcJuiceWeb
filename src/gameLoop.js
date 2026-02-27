// src/gameLoop.js
// Owns the requestAnimationFrame loop and calls systems each frame.

export function startGameLoop({ state, config, onUpdate, onRender, onUI }) {
  let lastTs = performance.now();

  function loop(ts) {
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    if (!state.isPaused && onUpdate) {
      onUpdate(dt, { state, config });
    }

    if (onRender) onRender({ state, config });
    if (onUI) onUI({ state, config });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
