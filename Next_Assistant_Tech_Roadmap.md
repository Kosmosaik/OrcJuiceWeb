# Orcslime Web – Technical Roadmap (Next Assistant Handoff)

**Context:** The project runs as a browser game hosted via GitHub Pages. We keep **ES Modules** and avoid “file://” execution; development/testing is done via the GitHub Pages URL (or any HTTP server). The goal is to build the MVP cleanly with a modular architecture, planning for persistence and future expansion.

---

## Key Design Decisions (Locked for Now)

### World / Plot
- **Tile size:** `128×128` pixels, **configurable**.
- **Coordinate system:** `(0,0)` is the **top-left** tile.
- **Starting plot dimensions:** **configurable**, but must support:
  - **Tree slots:** `(1,0)` and `(2,0)`  
  - **Chest slot:** `(0,2)`
- Starting plot is a “base module” that later expands by snapping additional modules.

> Note: tree slots at x=3 implies plot width is at least **4** tiles. Keep plot width/height configurable, with default likely `4×3` to match `(3,0)` and `(0,2)`.

### Starting Tree
- **Starting tree begins with 2 branches** (only branches).
- Nodes and fruits are **not prefilled**; they grow via seasonal scheduling.
- Growth is based on **configurable ranges** and **randomized scheduling** (spread across seasons), not “all at once”.

### Tree Lifecycle (Core Rules)
- Tree structure: **Branch → Node → Fruit**
- Totals are computed as sums (no “branch_count × nodes_per_branch” shortcuts).
- **Progressive ripening** in Autumn:
  - ripening converts **unripe → ripe** (does not increase total fruit).
- **Winter decay** affects ripe fruit.
- Tree has **birth date**, age increments on the tree’s birthday (or equivalent model in JS).

### Workers
- Worker is a **physical entity** on the plot (simple sprite).
- Worker assignment is via **click → DOM popup**.
- Profession includes **Orchardist**; only Orchardists harvest in Autumn.

---

## Engineering Goals (Non-Negotiables)
1. **ES Modules**, no global-script bundling.
2. **No frameworks**, no build step.
3. **Clear module boundaries** (core / world / render / ui).
4. **Single source of truth state object** (`gameState`).
5. **Persistence planned from day 1**:
   - State is serializable to JSON.
   - Avoid storing non-serializable objects inside state (e.g., canvas ctx, DOM nodes).
6. **Deterministic-enough simulation**:
   - Use a single RNG wrapper so we can seed later if needed.
7. **Config-driven**:
   - Tile size, plot size, growth ranges, ripen chance, etc. live in `config.js`.

---

## Repository Structure (Recommended)

```
orcslime/
  index.html
  styles.css
  /src
    main.js
    config.js
    /core
      gameLoop.js
      rng.js
      timeSystem.js
      persistence.js
      eventLog.js
    /state
      initialState.js
      selectors.js
      reducers.js
    /world
      plot.js
      entities.js
      tree.js
      treeSystem.js
      worker.js
      workerSystem.js
    /render
      canvasRenderer.js
      sprites.js
      camera.js
    /ui
      uiRoot.js
      panels.js
      workerPopup.js
      bindings.js
```

### Why this split
- `/state` keeps state changes consistent (simple reducer pattern, no framework).
- `/core` contains engine-like systems that don’t depend on rendering.
- `/world` contains domain models + simulation logic.
- `/render` contains Canvas drawing only.
- `/ui` contains DOM-only logic.

---

## State & Persistence Strategy

### Single Source of Truth
Use one `gameState` object:
- Serializable data only
- No DOM elements
- No Canvas context
- No functions

Example:
```js
gameState = {
  meta: { version: 1 },
  time: { day: 1, month: 1, year: 0, season: "Spring", paused: false, acc: 0 },
  plot: { width: 4, height: 3, tileSize: 128, slots: [...] },
  entities: {
    trees: { byId: {}, allIds: [] },
    workers: { byId: {}, allIds: [] },
  },
  inventory: { slimeFruit: 0 },
  log: { entries: [] }
}
```

### Persistence
- Implement `save()` / `load()` early (Milestone 1 or 2).
- Store to:
  - `localStorage` (primary MVP)
  - Optional: export/import JSON later
- Add a `meta.version` and migration stub:
  - `migrateState(oldState) -> newState`

---

## Immediate Roadmap (Next Development Steps)

### Milestone A — Modularize the Current Skeleton
**Goal:** Move logic out of `main.js` into modules without changing behavior.
- `core/gameLoop.js`: requestAnimationFrame loop, dt, calling update/render.
- `core/timeSystem.js`: time progression and season computation.
- `core/eventLog.js`: append-only log, trimming.
- `ui/uiRoot.js`: wire DOM references + render sidebar UI.

**Acceptance:** Game still runs on GitHub Pages and time ticks.

---

### Milestone B — Plot Data Model + Canvas Rendering
**Goal:** Create a plot grid model and draw it.
- `world/plot.js`:
  - `createPlot(width,height,tileSize)`
  - slot types: `EMPTY`, `TREE_SLOT`, `CHEST`
  - helper: `index(x,y)` and bounds checks
- `render/canvasRenderer.js`:
  - draws tiles with different colors/icons
  - draws coordinate debug text optionally (config flag)

**Locked placement:**
- tree slots: `(2,0)` and `(3,0)`
- chest slot: `(0,2)`

**Acceptance:** Canvas shows grid, tree slot markers, chest marker.

---

### Milestone C — Entity System & Starting Tree Placement
**Goal:** Add entity registry and place the starting tree on a tree slot.
- `world/entities.js`: create IDs, add/remove entities, lookup
- `world/tree.js`: tree model with 2 starting branches
- `world/treeSystem.js`: seasonal scheduling + growth + ripening + decay (config-driven)

**Acceptance:** Tree exists in state; UI panel shows its derived totals; rendering draws a tree icon in the correct tile.

---

### Milestone D — Worker Entity + Click + Popup Assignment
**Goal:** Worker appears physically and is clickable.
- `world/worker.js` + `world/workerSystem.js`
- `ui/workerPopup.js`: show popup on click; assign profession
- `ui/bindings.js`: canvas click hit-testing (tile or sprite bbox)

**Acceptance:** Clicking worker opens popup; assigning Orchardist updates state.

---

### Milestone E — Autumn Auto-Harvest Loop (Orchardist Only)
**Goal:** If worker is Orchardist, harvest in Autumn.
- When season transitions to Autumn:
  - worker gets a “HARVEST” task if ripe fruit exists
  - worker moves toward tree tile (simple movement)
  - harvest progress accumulates; on completion:
    - remove ripe fruit from tree structure
    - add to inventory (slimeFruit)
    - log event

**Acceptance:** If not Orchardist, no harvest happens. If Orchardist, inventory increases in Autumn.

---

## Configuration Checklist (Add to `src/config.js`)
- `tileSizePx = 128`
- `plotWidthTiles = 4`
- `plotHeightTiles = 3`
- `treeSlots = [{x:2,y:0},{x:3,y:0}]`
- `chestSlot = {x:0,y:2}`
- Tree growth ranges (per year):
  - `nodesPerBranchMin/Max`
  - `fruitsPerNodeMin/Max`
- Ripening:
  - `ripenChancePerDay`
- Winter decay:
  - `winterDecayRate`
- Debug flags:
  - `drawTileCoords`
  - `drawEntityIds`

---

## Implementation Recommendations (Short)
- Use **pure functions** for updates where practical:
  - `nextState = reduce(state, action)` style without frameworks.
- Keep time/season transitions centralized in `timeSystem`:
  - emit “events” (action objects) when season changes.
- Keep rendering stateless:
  - renderer reads from `gameState` and draws; never mutates state.
- Keep UI stateless:
  - UI renders from state; interactions dispatch actions.

---

## “If you are a GPT assistant” constraints
1. Do not introduce frameworks or build tooling.
2. Keep ES modules; assume HTTP (GitHub Pages).
3. Respect module boundaries and state/persistence rules.
4. Keep iterations small; ensure the project remains runnable after each step.
5. Do not invent new gameplay beyond what’s in the GDD/discussion.
