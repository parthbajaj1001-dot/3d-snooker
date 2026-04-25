import { randomRange } from './Utils.js';

export class AIController {
  chooseShot(state) {
    const cueBall = state.balls.find((b) => b.type === 'cue');
    const targets = state.balls.filter((b) => !b.pocketed && b.type !== 'cue');
    if (!cueBall || targets.length === 0) return null;

    targets.sort((a, b) => cueBall.pos.distanceTo(a.pos) - cueBall.pos.distanceTo(b.pos));
    const target = targets[0];

    const dx = target.pos.x - cueBall.pos.x;
    const dz = target.pos.y - cueBall.pos.y;
    return {
      angle: Math.atan2(dz, dx) + randomRange(-0.07, 0.07),
      power: randomRange(0.35, 0.82),
      spinX: randomRange(-0.25, 0.25),
      spinY: randomRange(-0.3, 0.3),
    };
  }
}
