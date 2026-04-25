export class ReplaySystem {
  constructor() {
    this.frames = [];
    this.maxFrames = 1200;
    this.isReplaying = false;
    this.playhead = 0;
  }

  clear() {
    this.frames = [];
    this.isReplaying = false;
    this.playhead = 0;
  }

  record(balls) {
    const snapshot = balls.map((b) => ({
      id: b.id,
      x: b.pos.x,
      z: b.pos.y,
      pocketed: b.pocketed,
    }));
    this.frames.push(snapshot);
    if (this.frames.length > this.maxFrames) this.frames.shift();
  }

  startReplay() {
    if (this.frames.length < 5) return false;
    this.isReplaying = true;
    this.playhead = 0;
    return true;
  }

  stepReplay(balls) {
    if (!this.isReplaying) return false;
    const frame = this.frames[this.playhead];
    if (!frame) {
      this.isReplaying = false;
      return false;
    }

    frame.forEach((saved) => {
      const ball = balls.find((b) => b.id === saved.id);
      if (!ball) return;
      ball.pos.set(saved.x, saved.z);
      ball.mesh.position.set(saved.x, ball.mesh.position.y, saved.z);
      ball.mesh.visible = !saved.pocketed;
    });

    this.playhead += 1;
    if (this.playhead >= this.frames.length) this.isReplaying = false;
    return true;
  }
}
