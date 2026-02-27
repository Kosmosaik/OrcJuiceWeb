# Orcslime Web – Technical Roadmap (Next Assistant Handoff)

Context:  
The project runs as a browser game hosted via GitHub Pages. ES Modules are used. No frameworks, no build step. Development and testing are done over HTTP (GitHub Pages or local server).

The MVP is being built incrementally with strong modular boundaries and planned persistence.

---

# Current Status

Milestone A and Milestone B are complete.

The project now includes:
- Modular architecture
- Single source of truth state
- Config-driven grid system
- Canvas-based plot rendering
- Time system with seasons
- Pause functionality
- Configurable tile size, gap, and padding
- Configurable starting tile placements

Next focus: Interaction System (Path A).

---

# Locked Design Decisions

## World / Plot

- Tile size: 128×128 pixels, configurable.
- Coordinate system: (0,0) is top-left.
- Grid dimensions: configurable via config.
- Starting placements:
  - Tree slots: (1,0) and (2,0)
  - Chest slot: (0,2)
- Grid supports configurable:
  - tileSizePx
  - gapPx (space between tiles)
  - paddingPx (outer margin)
- Canvas auto-resizes based on grid dimensions.

The grid currently renders placeholder tree and chest tiles.

---

## Engineering Rules (Non-Negotiable)

1. ES Modules only.
2. No frameworks.
3. No build tools.
4. Single serializable state object.
5. No DOM or Canvas context inside state.
6. Renderer reads from state but never mutates it.
7. UI reads from state and dispatches changes.
8. Config-driven values only. No hardcoded layout values.
9. Project must remain runnable after every milestone.

---

# Current Repository Structure (Actual)

```
index.html
styles.css
/src
  main.js
  config.js
  state.js
  time.js
  grid.js
  render.js
  gameLoop.js
  ui.js
```

This structure is intentionally simple for MVP.  
Subfolders may be introduced later if complexity increases.

---

# State Structure (Current Model)

The single source of truth:

```js
state = {
  isPaused: false,
  time: {
    day,
    month,
    year,
    season,
    _acc
  },
  inventory: {
    slimeFruit
  },
  world: {
    grid
  },
  log: []
}
```

Grid model:
- Flat tile array
- Each tile:
  {
    x,
    y,
    type: "empty" | "tree" | "chest"
  }

No entities yet.

---

# Updated Roadmap

## Milestone C – Interaction System (Next)

Goal: Allow player interaction with tiles.

### Scope

1. Hover detection on canvas
2. Highlight hovered tile
3. Click detection
4. Selected tile state
5. Log entry on selection

### Requirements

- No mutation inside renderer.
- Hit-testing logic must not live inside render.js.
- Selection state stored inside `state`:
  ```
  state.ui = {
    hoveredTile: {x,y} | null,
    selectedTile: {x,y} | null
  }
  ```
- Interaction must scale automatically with tileSizePx, gapPx, paddingPx.

### Acceptance Criteria

- Hovering a tile visually highlights it.
- Clicking a tile selects it.
- Selected tile visually distinct from hover.
- Selection stored in state.
- Log shows selection event.

This milestone establishes the foundation for:
- Tree interaction
- Worker selection
- Context panels

---

## Milestone D – Entity Layer Introduction

Goal: Introduce entity registry and attach a Tree entity to tree slots.

### Scope

- Add entity system structure
- Create Tree entity model
- Place starting tree on first tree slot
- Renderer draws tree entity (not tile placeholder)

Acceptance:
- Tree exists in state.
- Tree rendered based on entity, not tile type.

---

## Milestone E – Tree Growth System

Goal: Seasonal scheduling and growth.

- Tree starts with 2 branches.
- Nodes and fruits generated over time.
- Ripening occurs during Autumn.
- Winter decay removes ripe fruit.
- All values configurable.

Acceptance:
- Tree totals computed from structure.
- Seasonal changes affect tree state.

---

## Milestone F – Worker Entity + Assignment

Goal: Worker exists physically and is clickable.

- Worker entity appears on plot.
- Click worker to open DOM popup.
- Assign profession (Orchardist).
- State updates accordingly.

Acceptance:
- Worker selection works.
- Profession stored in state.

---

## Milestone G – Autumn Harvest Loop

Goal: Orchardist harvests ripe fruit in Autumn.

- Detect season change.
- Assign harvest task.
- Remove ripe fruit.
- Add to inventory.
- Log event.

Acceptance:
- Inventory increases only if Orchardist assigned.

---

# Configuration Checklist (Keep Updated)

In config.js:

- tileSizePx
- gapPx
- paddingPx
- cols
- rows
- startingTiles
- Future:
  - growth ranges
  - ripenChancePerDay
  - winterDecayRate
  - debug flags

---

# Implementation Guidance for Future Assistants

- Keep changes incremental.
- Do not refactor architecture unless necessary.
- Do not introduce frameworks.
- Respect module boundaries.
- Avoid expanding scope beyond current milestone.
- Always maintain runnable state.

---

End of Roadmap
