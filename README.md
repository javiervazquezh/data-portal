# TD Data Portal (Demo)

A modern, fluid React (no TypeScript) demo portal for capital markets data products. It simulates streaming via Confluent Cloud, stream processors, lineage visualization, search, and adding new data products. No backend required.

## Features
- TD Bank color scheme and dark UI
- Products list with search (Fuse.js) and throughput charts
- Stream processors page with simulated metrics
- Lineage graph (React Flow)
- Add Product form (in-memory store)
- Vite + React, ESLint, Prettier, Vitest

## Quick start
```bash
npm install
npm run dev
```
Then open the local URL printed in the terminal.

## Build
```bash
npm run build && npm run preview
```

## Tests
```bash
npm test
```

## Notes
- Streaming, Confluent Cloud integration, and processors are simulated for demo purposes.
- All data lives in-memory; reload resets state.# data-portal
