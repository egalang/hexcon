# Hex Conquest Prototype

A simple turn-based hex strategy prototype built with Phaser 3 + Vite.

## Rules

- Blue and Red start on opposite ends of the board.
- Blue moves first.
- On each turn, select one friendly soldier and move it to one adjacent empty hex.
- After moving, all adjacent enemy soldiers are converted to your color.
- Convert all enemy soldiers to win.
- Press **R** or tap **Restart** to restart.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```
