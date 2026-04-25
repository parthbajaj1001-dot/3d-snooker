export class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterVolume = 0.7;
    this.ambientOn = false;
    this.ambientNode = null;
  }

  ensure() {
    if (!this.ctx) this.ctx = new AudioContext();
  }

  setVolume(volume) {
    this.masterVolume = volume;
  }

  play(type, intensity = 0.5) {
    this.ensure();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    const volume = this.masterVolume * Math.min(1, intensity);

    if (type === 'collision') osc.frequency.value = 250 + intensity * 380;
    if (type === 'cue') osc.frequency.value = 150;
    if (type === 'pocket') osc.frequency.value = 90;
    if (type === 'click') osc.frequency.value = 420;

    gain.gain.setValueAtTime(volume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  toggleAmbient(on) {
    this.ensure();
    this.ambientOn = on;

    if (!on && this.ambientNode) {
      this.ambientNode.stop();
      this.ambientNode.disconnect();
      this.ambientNode = null;
      return;
    }

    if (on && !this.ambientNode) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 45;
      gain.gain.value = this.masterVolume * 0.03;
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      this.ambientNode = osc;
    }
  }
}
