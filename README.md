# Royal 3D Billiards Arena

A browser-based premium-style 3D billiards/snooker game built with **Three.js + vanilla JS modules**.

## Features

- Playable **8 Ball mode** and **Snooker mode**.
- Real-time custom billiards physics:
  - ball-ball collisions
  - cushion rebounds
  - friction and gradual stop
  - pockets + sink animation
- Cue system with:
  - aim/power control
  - spin (english) pad
  - animated cue strike
  - shot prediction guide line
- Camera controls:
  - orbit (right-mouse drag)
  - zoom (mouse wheel)
  - top-view toggle
  - impact camera shake
- Gameplay and UX:
  - start screen, pause, game over
  - turn-based two player scoring
  - basic foul detection (cue pocket + no-touch)
  - replay of the latest shot
  - AI opponent toggle
  - settings (volume + ambient toggle)
- Responsive UI with glass/neon styling and mobile-friendly shoot flow.

## Tech Stack

- Vite
- Three.js
- HTML/CSS/JavaScript (ES modules)

## Folder Structure

```text
.
├── index.html
├── package.json
├── README.md
└── src
    ├── main.js
    ├── styles.css
    └── core
        ├── AIController.js
        ├── BallFactory.js
        ├── CameraController.js
        ├── Constants.js
        ├── CueController.js
        ├── GameApp.js
        ├── GameLogic.js
        ├── InputManager.js
        ├── PhysicsEngine.js
        ├── ReplaySystem.js
        ├── SceneManager.js
        ├── SoundManager.js
        ├── TableFactory.js
        ├── UIManager.js
        └── Utils.js
```

## Major File Guide

- `src/core/GameApp.js`: Main orchestrator. Initializes systems, wires gameplay loop/UI, handles shots, AI turns, replay, and game state transitions.
- `src/core/SceneManager.js`: Three.js renderer/camera/lights/arena environment setup.
- `src/core/TableFactory.js`: Snooker table geometry, cloth, wooden border, pocket positions.
- `src/core/BallFactory.js`: Creates full ball sets for 8-ball and snooker modes.
- `src/core/PhysicsEngine.js`: Custom 2D-plane billiards physics simulation and sink handling.
- `src/core/CueController.js`: Cue model, strike animation, spin, shot impulse and prediction line.
- `src/core/CameraController.js`: Orbit + zoom + top-view + camera shake.
- `src/core/GameLogic.js`: Turn/score/foul/win rules.
- `src/core/AIController.js`: Lightweight AI shot planner.
- `src/core/ReplaySystem.js`: Records and replays last shot frame-by-frame.
- `src/core/UIManager.js`: Menus, HUD, settings, controls and event bindings.
- `src/core/SoundManager.js`: Procedural SFX and ambient audio toggle.

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite.

### Build

```bash
npm run build
npm run preview
```

## Controls

### Desktop
- **Left drag**: aim and adjust power quickly.
- **Power slider**: precise shot power.
- **Spin pad**: set side/top/back spin.
- **Shoot button**: hit shot.
- **Right drag**: rotate camera.
- **Mouse wheel**: zoom.

### Mobile
- Touch drag for aim/power.
- Use on-screen power slider + spin pad.
- Tap floating **Shoot** button.

## Improvement Ideas

- Replace procedural sounds with high-quality sampled audio.
- Add physically-based post-processing (bloom/SSR/DOF).
- Upgrade AI with shot search and tactical safety play.
- Add true rule-accurate 8-ball assignment and snooker foul scoring.
- Add online multiplayer with rollback/net prediction.
- Add replay timeline + cinematic camera cuts export.
