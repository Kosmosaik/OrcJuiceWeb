# Orcslime – Technical Roadmap & Onboarding

## 1) Project Summary
**Orcslime** is a UI-heavy simulation/management game with:
- Real-time tick-based time system (day/month/year, seasons)
- Base plot grid (starting 3×3)
- Slime Trees: branch/node/fruit lifecycle, seasonal growth, progressive ripening, winter decay
- Workers as physical entities moving on the plot grid
- Worker assignment via UI (click worker → popup → assign Orchardist)
- Harvesting is automatic in Autumn **only for Orchardists**
- Inventory stores Slime Fruit (later Juice, etc.)
- Hosted via **GitHub Pages** (no paid IDEs, no installs required)

**Tech choice:** Vanilla JS + Canvas (world) + DOM (UI) + GitHub Pages.

---

## 2) Repo Structure (no build step)
```
orcslime/
  index.html
  styles.css
  /src
    main.js
    config.js
    /core
      timeSystem.js
      inventorySystem.js
      eventLog.js
      stateStore.js
    /world
      plot.js
      tree.js
      treeSystem.js
      worker.js
      workerSystem.js
      pathing.js
    /render
      canvasRenderer.js
      uiRenderer.js
      input.js
  /docs
    ROADMAP.md
    TECH_NOTES.md
    DATA_MODEL.md
    UI_SPEC.md
  /assets
```

Rule: Everything must run by opening `index.html` directly.

---

## 3) Game Loop Contract
All systems follow:
- `init(game)`
- `update(dt, game)`
- `render(game)` (renderers only)

Single source of truth:
```
game = {
  time: {},
  plot: {},
  trees: [],
  workers: [],
  inventory: {},
  log: []
}
```

---

## 4) Core MVP Milestones

### Milestone 0 — Repo + Pages + Skeleton
- Basic file structure
- Blank canvas + UI panels
- GitHub Pages enabled

### Milestone 1 — Time & Seasons
- Tick system
- Seasons (Spring–Winter)
- Pause/Play
- Date & season UI

### Milestone 2 — Plot System
- 3×3 grid
- Tree slots, chest slot, empty walkable tiles
- Canvas visualization

### Milestone 3 — Trees
- Starting tree pre-seeded
- Saplings start empty
- Seasonal growth, ripening, decay
- Tree list UI

### Milestone 4 — Workers
- Physical worker sprite
- Click → popup → assign Orchardist
- Worker state (idle/busy)

### Milestone 5 — Auto Harvest
- Orchardists harvest in Autumn
- Worker moves to tree
- Harvest removes ripe fruit
- Inventory increases

### Milestone 6 — Save/Load
- Save to localStorage / JSON
- Load restores full state

---

## 5) Data Model Rules

### Plot
- Coordinates (x,y)
- Slot types: EMPTY / TREE_SLOT / CHEST
- Occupancy tracked per slot

### Tree
- Branch → Node → Fruit hierarchy
- Age + birth date
- Scheduled yearly growth

### Worker
- ID, name, profession
- Position (tile/pixel)
- Task object (e.g. HARVEST)

---

## 6) Coding Standards
- No frameworks
- No build step
- ES Modules only
- One responsibility per file
- Config in `config.js`
- Append-only event log

---

## 7) Git + GitHub Pages Workflow
- `main` = stable
- Feature branches later if needed
- Pages deploy from repo root

---

## 8) GPT Assistant Instructions
1. Do not introduce frameworks or build tools.
2. Respect file structure.
3. Keep changes incremental.
4. Comment code heavily.
5. Follow roadmap; do not invent features.
