import * as THREE from 'three';
import { PHYSICS, TABLE } from './Constants.js';
import { distance2D } from './Utils.js';

export class PhysicsEngine {
  constructor(pockets, soundManager) {
    this.pockets = pockets;
    this.sound = soundManager;
  }

  step(balls, dt, hooks = {}) {
    let anyMoving = false;
    const ballR = TABLE.ballRadius;

    for (const ball of balls) {
      if (ball.pocketed) {
        if (ball.pocketProgress < 1) {
          ball.pocketProgress += dt * 2.2;
          ball.mesh.position.y = THREE.MathUtils.lerp(TABLE.ballRadius + 0.03, -0.06, ball.pocketProgress);
          ball.mesh.scale.setScalar(1 - ball.pocketProgress * 0.5);
        }
        continue;
      }

      if (ball.vel.lengthSq() > 0.000001) {
        anyMoving = true;
        ball.pos.addScaledVector(ball.vel, dt);

        if (ball.spin.lengthSq() > 0.0001) {
          const curve = new THREE.Vector2(-ball.vel.y, ball.vel.x).normalize();
          ball.vel.addScaledVector(curve, ball.spin.x * PHYSICS.spinToCurve * dt);
          ball.spin.multiplyScalar(0.99);
        }

        ball.vel.multiplyScalar(PHYSICS.friction);
        if (ball.vel.length() < PHYSICS.stopEpsilon) ball.vel.set(0, 0);
      }

      const limitX = TABLE.width / 2 - ballR;
      const limitZ = TABLE.height / 2 - ballR;
      if (ball.pos.x < -limitX || ball.pos.x > limitX) {
        ball.pos.x = THREE.MathUtils.clamp(ball.pos.x, -limitX, limitX);
        ball.vel.x *= -PHYSICS.restitutionCushion;
        ball.vel.y += ball.spin.y * 0.08;
        this.sound.play('collision', 0.3);
      }
      if (ball.pos.y < -limitZ || ball.pos.y > limitZ) {
        ball.pos.y = THREE.MathUtils.clamp(ball.pos.y, -limitZ, limitZ);
        ball.vel.y *= -PHYSICS.restitutionCushion;
        ball.vel.x += ball.spin.y * 0.08;
        this.sound.play('collision', 0.3);
      }

      for (const pocket of this.pockets) {
        if (distance2D(ball.pos.x, ball.pos.y, pocket.x, pocket.y) <= TABLE.pocketRadius * 0.85) {
          ball.pocketed = true;
          ball.vel.set(0, 0);
          hooks.onPocket?.(ball);
          this.sound.play('pocket', 0.8);
          break;
        }
      }

      ball.mesh.position.set(ball.pos.x, TABLE.ballRadius + 0.03, ball.pos.y);
      ball.mesh.rotateX(ball.vel.length() * dt * 14);
      ball.mesh.rotateZ(ball.vel.length() * dt * 14);
    }

    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      if (a.pocketed) continue;
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j];
        if (b.pocketed) continue;

        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.y - a.pos.y;
        const dist = Math.hypot(dx, dz);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0.000001) {
          const nx = dx / dist;
          const nz = dz / dist;
          const overlap = minDist - dist;
          a.pos.x -= nx * overlap * 0.5;
          a.pos.y -= nz * overlap * 0.5;
          b.pos.x += nx * overlap * 0.5;
          b.pos.y += nz * overlap * 0.5;

          const rvx = b.vel.x - a.vel.x;
          const rvz = b.vel.y - a.vel.y;
          const relVelAlongNormal = rvx * nx + rvz * nz;
          if (relVelAlongNormal > 0) continue;

          const impulse = -(1 + PHYSICS.restitutionBall) * relVelAlongNormal / 2;
          a.vel.x -= impulse * nx;
          a.vel.y -= impulse * nz;
          b.vel.x += impulse * nx;
          b.vel.y += impulse * nz;
          a.vel.clampLength(0, PHYSICS.maxSpeed);
          b.vel.clampLength(0, PHYSICS.maxSpeed);

          hooks.onBallCollision?.(a, b);
          this.sound.play('collision', 0.5);
        }
      }
    }

    return anyMoving;
  }
}
