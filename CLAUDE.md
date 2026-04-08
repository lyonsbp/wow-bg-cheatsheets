# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive single-page web app for World of Warcraft battleground strategy. Zero dependencies, no build tools — everything lives in `index.html` (HTML + CSS + JS).

## Running

Open `index.html` in any modern browser. No build step, no install, no server required.

There are no tests, linters, or CI pipelines.

## Architecture

The entire app is a single `index.html` file (~1,760 lines) organized into these sections:

### Embedded CSS (~lines 8–264)
Dark fantasy theme. Key class prefixes: `.mk` (markers), `.lgy`/`.lbuf`/`.lrte`/`.lobj` (layer visibility), `.rte` (routes).

### Data Layer — `BGS` object (~lines 346–859)
Master database of 13 battlegrounds (10 blitz, 3 epic). Each BG entry has:
- `graveyards[]`: `{n, x, y, f}` — faction: alliance/horde/neutral
- `powerups[]`: `{n, x, y, t}` — type: speed/berserk/restore
- `routes[]`: `{n, pts, c}` — pts is `[[x,y],...]` waypoints, c is hex color
- `objectives[]`: `{n, x, y, t, f?}` — type: node/flag/tower/base/orb/zone

All positions are **percentages (0–100)** relative to map image dimensions.

### SVG Rendering (~lines 869–1102)
Markers rendered as inline SVG `<g>` elements. `renderBG(id)` is the main render function — loads the map image, builds SVG overlay, wires event listeners. Routes use `<polyline>` with invisible wider hit-detection strokes (`.rte-hit`). Squiggly mode uses seeded RNG for reproducible MS Paint-style jitter.

### Layer System (~lines 1186–1199)
State object `L = {gy, buf, rte, obj}` controls visibility. `applyLayers()` toggles CSS classes on the SVG container.

### Persistence (~lines 1227–1314)
localStorage key: `'wow-bg-cheatsheets-data'`. `BGS_DEFAULT` is a deep clone made at startup for reset. Export/import works per-BG as JSON files.

### Edit Mode (~lines 1319–1652)
Full CRUD: drag to move, right-click to delete, click empty space to add, click route line to insert waypoint. Tips become editable textareas.

### Zoom & Pan (~lines 1682–1755)
Mouse wheel or buttons, 50%–400% range. Pan via click-drag when zoomed >1x. `wasPanning` flag prevents accidental clicks after pan.

### Initialization (~lines 1757–1759)
`loadData()` → `initSidebar()` → `renderBG('wsg')`

## Key Conventions

- **Coordinate system**: All marker positions are percentages, not pixels
- **Color functions**: `gyColor(f)`, `bufColor(t)`, `objColor(t,f)` map data values to hex colors
- **SVG is rebuilt completely** on any marker change (acceptable for small marker counts)
- **Data attributes**: `data-bg`, `data-layer`, `data-idx`, `data-ridx`, `data-pidx` connect DOM to data
- **No modules or imports** — all code is global scope in a single file
