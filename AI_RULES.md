# HexConquest AI Development Rules

## Technology

- Phaser 3
- TypeScript
- Vite
- Node.js

## Coding Style

- Never rewrite an entire file.
- Only modify affected methods.
- Preserve comments.
- Preserve formatting.
- Do not rename methods.
- Do not rename variables unless requested.
- Use strict TypeScript.
- Never use `any`.
- Reuse existing helper methods.
- Avoid duplicate logic.

## Architecture

- One Scene per file.
- UI logic stays in UI classes.
- Game rules stay in gameplay classes.
- Rendering and game logic remain separate.

## Preferred Output

When changing code:

1. Explain the change.
2. Generate a unified diff or minimal patch.
3. Do not output the entire file unless requested.

## Goal

Maintain a clean, modular, AI-friendly codebase.