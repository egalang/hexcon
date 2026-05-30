# HEX CONQUEST

## Project Overview

Hex Conquest is a turn-based strategy game built with Phaser 3 and Vite.

The game is inspired by classic territory-conversion games such as Ataxx, Hexxagon, and Othello, but uses a hexagonal battlefield and a very simple ruleset.

The focus is:

* Simple to learn
* Deep tactical gameplay
* Fast matches (2–5 minutes)
* Mobile-first design
* Future online multiplayer

---

# Current Status

## Working Features

### Core Gameplay

* Hexagonal game board
* Turn-based gameplay
* Blue starts first
* One move per turn
* Move exactly one adjacent hex
* Original tile becomes empty after moving
* Occupied tiles cannot be moved into

### Conversion Mechanic

When a unit moves:

* All adjacent enemy units are converted
* Converted units immediately change ownership
* Converted units change appearance and color
* Conversion animation implemented

### Win Conditions

Player wins when:

* Enemy has zero units remaining

OR

* Opponent has no legal moves remaining

---

# Board

Current board:

```text
Radius: 4
Hex Size: 27.5
```

Board centered on screen.

Current placement:

```typescript
boardCenterX = (WIDTH / 2) + 25;
boardCenterY = 475;
```

---

# Units

## Blue Soldier

Image asset:

```text
blue_01.png
```

## Red Soldier

Image asset:

```text
red_01.png
```

Current implementation uses PNG sprite assets instead of procedurally drawn shapes.

Suggested location:

```text
public/assets/blue_01.png
public/assets/red_01.png
```

---

# AI System

Current AI:

* Controls Red side
* Evaluates every legal move
* Scores moves based on:

```text
Enemies Converted
+
Center Position Bonus
+
Small Random Bonus
```

Formula:

```typescript
score =
  converted * 100
  + centerBonus
  + randomBonus
```

AI behavior:

* Waits briefly before moving
* Highlights selected move
* Executes move automatically

---

# Move Preview System

Implemented.

When selecting a unit:

* Legal moves highlighted green
* Shows:

```text
+1
+2
+3
```

indicating number of enemies converted.

Animated floating preview text.

---

# Game Modes

## Campaign

Implemented.

Features:

* Level progression
* Increasing AI difficulty
* Next Level button
* Retry Level button

Current difficulty adjustments:

Level 3+

* Red receives stronger starting positions

Level 5+

* Additional board variations

AI becomes stronger with level.

---

## Play Against AI

Implemented.

Human:

```text
Blue
```

AI:

```text
Red
```

---

## Local 2 Player

Implemented.

Both players use same device.

No AI.

---

## Online Multiplayer

Placeholder screen implemented.

No networking yet.

Future feature.

---

# Main Menu

Implemented.

Options:

```text
Campaign
Play Against AI
Local 2 Player
Play Against Online Player
```

---

# UI Features

Implemented:

* Main menu
* Mode selection
* Restart button
* Return to menu button
* Turn indicator
* Score display
* Campaign level display
* AI thinking indicator
* Victory screen

---

# Bug Fixes Completed

## Soldier Position

Fixed.

Units now centered inside hex tiles.

---

## Board Position

Fixed.

Board centered properly on screen.

---

## Restart Bug

Fixed.

Issue:

```text
Restart worked once
Game became unresponsive
```

Cause:

```typescript
gameOver
aiThinking
```

state not reset.

Resolved using:

```typescript
resetState()
```

and cleanup:

```typescript
time.removeAllEvents()
tweens.killAll()
```

---

# Technical Stack

Frontend:

```text
Phaser 3
TypeScript
Vite
```

Planned Mobile:

```text
Capacitor
Android
```

Future Backend:

```text
FastAPI
WebSocket
PostgreSQL
```

---

# Android Packaging

Not completed yet.

Attempted:

```bash
npm install @capacitor/core
npm install @capacitor/cli
npm install @capacitor/android
```

Blocked due to container networking issue.

Recommendation:

Build on local Windows machine.

Commands:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android

npm run build

npx cap init HexConquest com.obbsco.hexconquest --web-dir=dist

npx cap add android

npx cap sync android

npx cap open android
```

---

# Recommended Next Development Tasks

Priority Order

## 1. Android APK

Package game as APK.

Test on actual devices.

---

## 2. Sound Effects

Add:

```text
select.wav
move.wav
convert.wav
victory.wav
```

---

## 3. Unit Movement Animation

Current:

```text
Teleport
```

Desired:

```text
Tween movement
```

---

## 4. Campaign Expansion

Create:

```text
Level 1-20
```

Introduce:

* Different board layouts
* AI personalities
* Objectives

---

## 5. Save Progress

Store:

```text
Campaign Level
Wins
Losses
Settings
```

using:

```typescript
localStorage
```

---

## 6. Online Multiplayer

Future Architecture:

Client

```text
Phaser + Capacitor
```

Backend

```text
FastAPI
WebSocket
PostgreSQL
```

Features:

* Room Code
* Matchmaking
* Ranked Play
* Spectator Mode

---

# Future Ideas

Potential additions:

## Heroes

Special units with abilities.

## Unit Types

* Infantry
* Archer
* Knight
* Mage

## Skins

Cosmetic only.

## Daily Challenges

Single-player missions.

## Leaderboards

Online rankings.

## Replay System

Save and watch matches.

---

# Current Goal

Primary objective:

Package current game as Android APK and test gameplay on real devices before implementing online multiplayer.
