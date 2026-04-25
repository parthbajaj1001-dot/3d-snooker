import { isMobileDevice } from './Utils.js';

export class InputManager {
  constructor(domElement, cueController) {
    this.dom = domElement;
    this.cue = cueController;
    this.isAiming = false;
    this.isMobile = isMobileDevice();
    this.init();
  }

  init() {
    this.dom.addEventListener('pointerdown', (e) => {
      if (e.button === 0) {
        this.isAiming = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isAiming) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.cue.angle -= dx * 0.01;
      this.cue.power = Math.min(1, Math.max(0.05, this.cue.power + dy * -0.002));
    });

    window.addEventListener('pointerup', () => {
      this.isAiming = false;
    });

    if (this.isMobile) {
      const mobileShoot = document.getElementById('mobileShoot');
      if (mobileShoot) mobileShoot.classList.remove('hidden');
    }
  }
}
