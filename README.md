# WoW Midnight — Battleground Cheat Sheets

Interactive single-page web app providing strategic maps, markers, and tips for all 13 World of Warcraft battlegrounds.

## Features

- **Interactive Maps** — Overlay markers on battleground maps from warcraft.wiki.gg
- **Layer Toggles** — Show/hide Graveyards, Power-ups, Routes, and Objectives independently
- **Edit Mode** — Full marker editing capability:
  - Drag markers and route waypoints to reposition
  - Right-click to delete markers, waypoints, or routes
  - Click empty map space to add new markers (graveyards, power-ups, objectives, routes)
  - Click a route line to insert new waypoints
- **Zoom & Pan** — Mouse wheel or button zoom (50%–400%), click-drag panning when zoomed
- **Collapsible Panels** — Hide/show the sidebar and tips panel for a larger map view
- **Persistence** — Edits auto-save to localStorage; export/import JSON per battleground
- **Reset** — Restore any battleground's markers to defaults

## Battlegrounds

**Blitz (8v8–15v15):** Warsong Gulch, Arathi Basin, Eye of the Storm, Battle for Gilneas, Twin Peaks, Silvershard Mines, Temple of Kotmogu, Deepwind Gorge, Deephaul Ravine, Seething Shore

**Epic (40v40):** Alterac Valley, Isle of Conquest, Slayer's Rise

## Usage

Open `index.html` in any modern browser. No build step or dependencies required.

## Data Format

Marker data is stored inline as JSON in the `BGS` object. Each battleground contains:

- `graveyards` — `{n, x, y, f}` (name, position %, faction)
- `powerups` — `{n, x, y, t}` (name, position %, type: speed/berserk/restore)
- `routes` — `{n, pts, c}` (name, array of [x,y] waypoints, color)
- `objectives` — `{n, x, y, t, f?}` (name, position %, type: node/flag/tower/base/orb/zone, optional faction)

Positions are percentages (0–100) relative to the map image dimensions.
