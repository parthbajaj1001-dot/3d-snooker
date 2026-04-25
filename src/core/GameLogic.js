export class GameLogic {
  constructor() {
    this.reset('8ball');
  }

  reset(mode = '8ball') {
    this.mode = mode;
    this.currentPlayer = 0;
    this.scores = [0, 0];
    this.pottedThisShot = [];
    this.ballTouched = false;
    this.turnLocked = false;
    this.winner = null;
  }

  onShotStart() {
    this.pottedThisShot = [];
    this.ballTouched = false;
    this.turnLocked = true;
  }

  onBallCollision(a, b) {
    if (!this.ballTouched && (a.type === 'cue' || b.type === 'cue')) this.ballTouched = true;
  }

  onPocket(ball) {
    this.pottedThisShot.push(ball);
  }

  completeShot(balls) {
    const foulCuePocket = this.pottedThisShot.some((b) => b.type === 'cue');
    const foulNoTouch = !this.ballTouched;
    const foul = foulCuePocket || foulNoTouch;

    const legalPots = this.pottedThisShot.filter((b) => b.type !== 'cue');
    this.scores[this.currentPlayer] += legalPots.length;

    if (this.mode === '8ball') {
      const black = balls.find((b) => b.type === 'black');
      if (black?.pocketed) this.winner = this.currentPlayer;
    }
    if (this.mode === 'snooker') {
      const remaining = balls.filter((b) => !b.pocketed && b.type !== 'cue').length;
      if (remaining === 0) this.winner = this.scores[0] >= this.scores[1] ? 0 : 1;
    }

    if (foul || legalPots.length === 0) this.currentPlayer = this.currentPlayer ? 0 : 1;
    this.turnLocked = false;
    return { foulCuePocket, foulNoTouch, foul, legalPots: legalPots.length, winner: this.winner };
  }
}
