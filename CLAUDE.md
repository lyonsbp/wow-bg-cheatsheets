# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive web app for World of Warcraft battleground strategy — maps, markers, routes, and tips for all 13 battlegrounds.

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check + production build to dist/
npm run typecheck  # Type-check only (tsc --noEmit)
npm run preview    # Preview production build
```

There are no tests, linters, or CI pipelines.

## Architecture

React 18 + TypeScript app built with Vite. Strict mode enabled (`noUncheckedIndexedAccess`, `strict`). No CSS modules — all styles in a single `App.css` with well-namespaced class prefixes.

### Types (`src/types.ts`)
All shared types: `Battleground`, `Graveyard`, `Powerup`, `Route`, `Objective`, `BGMap`, `AppState`, `AppAction`, `LayerKey`, `MarkerLayer`, etc.

### State Management (`src/context/BattlegroundContext.tsx`)
React Context + `useReducer`. Single source of truth for:
- `bgs` — full battleground data object (13 BGs)
- `curBG` — selected BG id
- `layers` — `{gy, buf, rte, obj}` visibility booleans
- `editMode`, `squigglyMode`, `zoomScale`

All data mutations go through dispatch actions. `saveData()` to localStorage fires in a `useEffect` watching `bgs`.

### Data (`src/data/battlegrounds.ts`)
Master database of 13 battlegrounds (10 blitz, 3 epic). Each BG entry has:
- `graveyards[]`: `{n, x, y, f}` — faction: alliance/horde/neutral
- `powerups[]`: `{n, x, y, t}` — type: speed/berserk/restore
- `routes[]`: `{n, pts, c}` — pts is `[[x,y],...]` waypoints, c is hex color
- `objectives[]`: `{n, x, y, t, f?}` — type: node/flag/tower/base/orb/zone

All positions are **percentages (0–100)** relative to map image dimensions.

### Component Hierarchy
```
App
├── Header
├── Sidebar              — BG selection nav
└── main
    ├── BgHeader         — title/badge/win condition
    ├── LayerBar         — layer toggles + edit/squiggly toggles
    ├── EditBar          — export/import/reset (visible in edit mode)
    └── MapView          — map image + zoom/pan + SVG overlay
        ├── ZoomControls
        ├── SvgOverlay   — builds all SVG markers, handles drag/delete
        │   └── markers/ — Graveyard, Powerup, Route, Objective
        ├── TipsPanel    — strategy tips + legend
        └── AddDialog    — portal for adding markers in edit mode
```

### Utilities (`src/utils/`)
- `colors.ts` — `gyColor(f)`, `bufColor(t)`, `objColor(t,f)` map data values to hex colors
- `squiggly.ts` — seeded RNG + squigglyPath for MS Paint-style route jitter
- `geometry.ts` — `pts()`, `distToSegment()`, `svgPoint()` helpers
- `storage.ts` — localStorage persistence, JSON export/import

## Key Conventions

- **Coordinate system**: All marker positions are percentages (0–100), not pixels
- **Drag editing**: Managed via document-level mousemove/mouseup listeners with refs, dispatching position updates on mouseup
- **SVG layer visibility**: Controlled by wrapping each marker type in a `<g>` with `style.display` toggled
- **CSS class prefixes**: `.mk` (markers), `.lgy`/`.lbuf`/`.lrte`/`.lobj` (layer groups), `.rte` (routes), `.edit-active` (edit mode)
- **localStorage key**: `'wow-bg-cheatsheets-data'`
