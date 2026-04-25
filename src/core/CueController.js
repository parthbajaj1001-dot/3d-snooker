import * as THREE from 'three';
import { GAME, TABLE } from './Constants.js';
import { clamp } from './Utils.js';

export class CueController {
  constructor(scene) {
    this.scene = scene;
    this.angle = 0;
    this.power = 0.35;
    this.spin = new THREE.Vector2(0, 0);
    this.strikeAnim = 0;

    this.cue = this.createCueMesh();
    this.scene.add(this.cue);

    this.predictionLine = this.createPredictionLine();
    this.scene.add(this.predictionLine);
  }

  createCueMesh() {
    const cue = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.015, 1.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xcaa86b, roughness: 0.34, metalness: 0.2 }),
    );
    shaft.rotation.z = Math.PI / 2;
    shaft.castShadow = true;
    cue.add(shaft);

    const tip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.02, 12),
      new THREE.MeshStandardMaterial({ color: 0x3c78a1, roughness: 0.45, metalness: 0.1 }),
    );
    tip.position.x = -0.56;
    tip.rotation.z = Math.PI / 2;
    cue.add(tip);

    return cue;
  }

  createPredictionLine() {
    const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0.3, 0, 0)]);
    const mat = new THREE.LineDashedMaterial({ color: 0xf5dd8a, dashSize: 0.06, gapSize: 0.03 });
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances();
    return line;
  }

  update(cueBall, canShoot, dt) {
    if (!cueBall || cueBall.pocketed) {
      this.cue.visible = false;
      this.predictionLine.visible = false;
      return;
    }

    this.cue.visible = canShoot;
    this.predictionLine.visible = canShoot;

    const distance = 0.54 + this.power * 0.2 + this.strikeAnim;
    const dir = new THREE.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
    this.cue.position.set(cueBall.pos.x - dir.x * distance, TABLE.ballRadius + 0.04, cueBall.pos.y - dir.z * distance);
    this.cue.rotation.y = -this.angle;

    this.strikeAnim = Math.max(0, this.strikeAnim - dt * 2.8);

    const start = new THREE.Vector3(cueBall.pos.x, TABLE.ballRadius + 0.04, cueBall.pos.y);
    const end = start.clone().addScaledVector(dir, 0.8 + this.power * 0.5);
    this.predictionLine.geometry.setFromPoints([start, end]);
    this.predictionLine.computeLineDistances();
  }

  setAimFromDelta(dx, dz) {
    if (Math.abs(dx) + Math.abs(dz) < 0.0001) return;
    this.angle = Math.atan2(dz, dx);
  }

  setPower(normalizedPower) {
    this.power = clamp(normalizedPower, GAME.minPower, GAME.maxPower);
  }

  setSpin(x, y) {
    this.spin.set(clamp(x, -1, 1), clamp(y, -1, 1));
  }

  shoot(cueBall) {
    const speed = 1.2 + this.power * 2.8;
    cueBall.vel.set(Math.cos(this.angle) * speed, Math.sin(this.angle) * speed);
    cueBall.spin.copy(this.spin).multiplyScalar(0.25 + this.power * 0.45);
    this.strikeAnim = 0.2;
  }
}
