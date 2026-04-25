import * as THREE from 'three';
import { clamp, lerp } from './Utils.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.dom = domElement;

    this.target = new THREE.Vector3(0, 0.02, 0);
    this.distance = 2.7;
    this.azimuth = 0.8;
    this.elevation = 0.78;

    this.isDragging = false;
    this.topView = false;
    this.shake = 0;

    this.attachListeners();
  }

  attachListeners() {
    this.dom.addEventListener('pointerdown', (e) => {
      if (e.button !== 2) return;
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      this.azimuth -= dx * 0.004;
      this.elevation = clamp(this.elevation + dy * 0.004, 0.15, 1.4);
    });

    window.addEventListener('pointerup', () => (this.isDragging = false));
    this.dom.addEventListener('wheel', (e) => {
      this.distance = clamp(this.distance + e.deltaY * 0.0025, 1.3, 4.5);
    });

    this.dom.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  setTopView(on) {
    this.topView = on;
  }

  addShake(amount) {
    this.shake = Math.max(this.shake, amount);
  }

  update(dt) {
    if (this.topView) {
      this.elevation = lerp(this.elevation, 1.52, dt * 4);
      this.distance = lerp(this.distance, 2.0, dt * 4);
    }

    const x = this.target.x + this.distance * Math.cos(this.elevation) * Math.cos(this.azimuth);
    const z = this.target.z + this.distance * Math.cos(this.elevation) * Math.sin(this.azimuth);
    const y = this.target.y + this.distance * Math.sin(this.elevation);

    const jitter = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    this.camera.position.set(x + jitter, y + jitter * 0.4, z + jitter);
    this.camera.lookAt(this.target);
    this.shake = Math.max(0, this.shake - dt * 1.8);
  }
}
