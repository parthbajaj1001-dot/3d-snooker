import * as THREE from 'three';
import { TABLE, BALL_COLORS_8BALL, BALL_COLORS_SNOOKER } from './Constants.js';

function makeBallMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  });
}

export class BallFactory {
  constructor(scene) {
    this.scene = scene;
    this.ballGeometry = new THREE.SphereGeometry(TABLE.ballRadius, 32, 32);
  }

  create(mode = '8ball') {
    return mode === 'snooker' ? this.createSnookerSet() : this.create8BallSet();
  }

  createBall({ id, type, color, x, z, label }) {
    const mesh = new THREE.Mesh(this.ballGeometry, makeBallMaterial(color));
    mesh.castShadow = true;
    mesh.position.set(x, TABLE.ballRadius + 0.03, z);

    const ball = {
      id,
      type,
      label,
      radius: TABLE.ballRadius,
      mesh,
      pos: new THREE.Vector2(x, z),
      vel: new THREE.Vector2(),
      spin: new THREE.Vector2(),
      pocketed: false,
      pocketProgress: 0,
    };

    this.scene.add(mesh);
    return ball;
  }

  create8BallSet() {
    const balls = [];
    balls.push(this.createBall({ id: 'cue', type: 'cue', color: BALL_COLORS_8BALL.cue, x: -0.7, z: 0, label: 'Cue' }));

    const startX = 0.55;
    const rowSpacing = TABLE.ballRadius * 2.02;
    let n = 1;
    const palette = [...BALL_COLORS_8BALL.solids, ...BALL_COLORS_8BALL.stripes, BALL_COLORS_8BALL.black];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * rowSpacing;
        const z = (col - row / 2) * rowSpacing;
        const color = palette[(n - 1) % palette.length];
        const type = n === 8 ? 'black' : n <= 7 ? 'solid' : 'stripe';
        balls.push(this.createBall({ id: `b${n}`, type, color, x, z, label: String(n) }));
        n += 1;
      }
    }
    return balls;
  }

  createSnookerSet() {
    const balls = [];
    balls.push(this.createBall({ id: 'cue', type: 'cue', color: BALL_COLORS_SNOOKER.cue, x: -0.6, z: 0, label: 'Cue' }));

    let id = 1;
    const startX = 0.45;
    const rowSpacing = TABLE.ballRadius * 2.02;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * rowSpacing;
        const z = (col - row / 2) * rowSpacing;
        balls.push(this.createBall({ id: `r${id++}`, type: 'red', color: BALL_COLORS_SNOOKER.reds, x, z, label: 'R' }));
      }
    }

    const colors = [
      ['yellow', -TABLE.width / 4, -TABLE.height / 4],
      ['green', -TABLE.width / 4, TABLE.height / 4],
      ['brown', -TABLE.width / 4, 0],
      ['blue', 0, 0],
      ['pink', 0.25, 0],
      ['black', TABLE.width / 2 - 0.22, 0],
    ];
    colors.forEach(([name, x, z]) => {
      balls.push(this.createBall({ id: name, type: name, color: BALL_COLORS_SNOOKER[name], x, z, label: name[0].toUpperCase() }));
    });
    return balls;
  }
}
