// src/grid.js
// Plot/grid data model + helpers (no rendering here).

/**
 * @typedef {"empty"|"tree"|"chest"} TileType
 */

/**
 * @typedef {object} Tile
 * @property {number} x
 * @property {number} y
 * @property {TileType} type
 */

/**
 * Create a rows×cols grid of empty tiles.
 * Stored as a flat array for simplicity + speed.
 * @param {{cols:number, rows:number}} gridConfig
 * @returns {{ cols:number, rows:number, tiles: Tile[] }}
 */
export function createGrid(gridConfig) {
  const { cols, rows } = gridConfig;

  /** @type {Tile[]} */
  const tiles = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      tiles.push({ x, y, type: "empty" });
    }
  }

  return { cols, rows, tiles };
}

/**
 * Convert (x,y) -> index in the flat tiles array.
 * @param {{cols:number, rows:number}} grid
 * @param {number} x
 * @param {number} y
 */
export function toIndex(grid, x, y) {
  return y * grid.cols + x;
}

/**
 * Returns the tile at (x,y) or null if out of bounds.
 * @param {{cols:number, rows:number, tiles: Tile[]}} grid
 * @param {number} x
 * @param {number} y
 * @returns {Tile|null}
 */
export function getTile(grid, x, y) {
  if (!isInBounds(grid, x, y)) return null;
  return grid.tiles[toIndex(grid, x, y)] ?? null;
}

/**
 * Safely set a tile type. Returns true if successful.
 * @param {{cols:number, rows:number, tiles: Tile[]}} grid
 * @param {number} x
 * @param {number} y
 * @param {TileType} type
 * @returns {boolean}
 */
export function setTileType(grid, x, y, type) {
  if (!isInBounds(grid, x, y)) return false;
  const idx = toIndex(grid, x, y);
  grid.tiles[idx].type = type;
  return true;
}

/**
 * Apply starting placements from config.
 * Invalid placements are ignored (but returned as warnings).
 * @param {{cols:number, rows:number, tiles: Tile[]}} grid
 * @param {{startingTiles:{type:TileType,x:number,y:number}[]}} config
 * @returns {string[]} warnings
 */
export function applyStartingTiles(grid, config) {
  const warnings = [];

  for (const t of config.startingTiles ?? []) {
    const ok = setTileType(grid, t.x, t.y, t.type);
    if (!ok) {
      warnings.push(`Starting tile out of bounds: ${t.type} at (${t.x},${t.y})`);
    }
  }

  return warnings;
}

/**
 * @param {{cols:number, rows:number}} grid
 * @param {number} x
 * @param {number} y
 */
export function isInBounds(grid, x, y) {
  return x >= 0 && y >= 0 && x < grid.cols && y < grid.rows;
}
