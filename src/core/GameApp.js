import { SceneManager } from './SceneManager.js';
import { TableFactory } from './TableFactory.js';
import { BallFactory } from './BallFactory.js';
import { PhysicsEngine } from './PhysicsEngine.js';
import { CueController } from './CueController.js';
import { CameraController } from './CameraController.js';
import { SoundManager } from './SoundManager.js';
import { UIManager } from './UIManager.js';
import { InputManager } from './InputManager.js';
import { GameLogic } from './GameLogic.js';
import { AIController } from './AIController.js';
import { ReplaySystem } from './ReplaySystem.js';

export class GameApp {
  constructor(root) {
    this.root = root;
    this.sceneManager = new SceneManager(root);
    this.table = new TableFactory(this.sceneManager.scene);
    this.sound = new SoundManager();
    this.physics = new PhysicsEngine(this.table.pocketPositions, this.sound);
    this.cue = new CueController(this.sceneManager.scene);
    this.camera = new CameraController(this.sceneManager.camera, this.sceneManager.renderer.domElement);
    this.game = new GameLogic();
    this.ai = new AIController();
    this.replay = new ReplaySystem();

    this.uiLayer = document.createElement('div');
    this.uiLayer.className = 'ui-layer';
    root.appendChild(this.uiLayer);
    this.ui = new UIManager(this.uiLayer);
    this.input = new InputManager(this.sceneManager.renderer.domElement, this.cue);

    this.balls = [];
    this.mode = '8ball';
    this.shotInProgress = false;
    this.paused = false;
    this.aiEnabled = true;
    this.topView = false;

    this.bindUI();
    this.animate();
  }

  bindUI() {
    this.ui.on('start8', () => this.startGame('8ball'));
    this.ui.on('startSnooker', () => this.startGame('snooker'));
    this.ui.on('shoot', () => this.tryShoot());
    this.ui.on('toggleView', () => {
      this.topView = !this.topView;
      this.camera.setTopView(this.topView);
    });
    this.ui.on('pause', () => {
      this.paused = !this.paused;
      this.ui.setPaused(this.paused);
    });
    this.ui.on('resume', () => {
      this.paused = false;
      this.ui.setPaused(false);
    });
    this.ui.on('reset', () => this.startGame(this.mode));
    this.ui.on('restart', () => {
      this.ui.hideGameOver();
      this.startGame(this.mode);
    });
    this.ui.on('replay', () => {
      const ok = this.replay.startReplay();
      this.ui.setMessage(ok ? 'Replaying last shot...' : 'Not enough replay data yet.');
    });

    this.ui.on('onPower', (p) => this.cue.setPower(p));
    this.ui.on('onSpin', (x, y) => this.cue.setSpin(x, y));
    this.ui.on('onAI', (on) => (this.aiEnabled = on));
    this.ui.on('onMusic', (on) => this.sound.toggleAmbient(on));
    this.ui.on('onVolume', (v) => this.sound.setVolume(v));
  }

  clearBalls() {
    this.balls.forEach((ball) => this.sceneManager.scene.remove(ball.mesh));
    this.balls = [];
  }

  startGame(mode) {
    this.mode = mode;
    this.game.reset(mode);
    this.clearBalls();

    const factory = new BallFactory(this.sceneManager.scene);
    this.balls = factory.create(mode);

    this.shotInProgress = false;
    this.replay.clear();
    this.ui.showHUD();
    this.ui.setScore(this.game.scores[0], this.game.scores[1], this.game.currentPlayer, this.mode);
    this.ui.setMessage(`${mode === 'snooker' ? 'Snooker' : '8 Ball'} started. Aim and shoot.`);
  }

  get cueBall() {
    return this.balls.find((b) => b.type === 'cue');
  }

  tryShoot() {
    if (!this.balls.length || this.shotInProgress || this.paused || this.replay.isReplaying) return;
    if (this.aiEnabled && this.game.currentPlayer === 1) return;

    this.game.onShotStart();
    this.cue.shoot(this.cueBall);
    this.sound.play('cue', 0.8);
    this.camera.addShake(this.cue.power > 0.75 ? 0.05 : 0.02);
    this.shotInProgress = true;
  }

  maybeAIShoot() {
    if (!this.aiEnabled || this.game.currentPlayer !== 1 || this.shotInProgress || this.paused || this.replay.isReplaying) return;
    const shot = this.ai.chooseShot({ balls: this.balls });
    if (!shot) return;
    this.cue.angle = shot.angle;
    this.cue.setPower(shot.power);
    this.cue.setSpin(shot.spinX, shot.spinY);
    this.game.onShotStart();
    this.cue.shoot(this.cueBall);
    this.sound.play('cue', 0.75);
    this.camera.addShake(0.025);
    this.shotInProgress = true;
    this.ui.setMessage('AI taking a shot...');
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const dt = this.sceneManager.getDelta();

    if (!this.paused && this.balls.length) {
      if (this.replay.isReplaying) {
        this.replay.stepReplay(this.balls);
      } else {
        const moving = this.physics.step(this.balls, dt, {
          onBallCollision: (a, b) => this.game.onBallCollision(a, b),
          onPocket: (ball) => this.game.onPocket(ball),
        });

        if (this.shotInProgress) this.replay.record(this.balls);
        if (this.shotInProgress && !moving) {
          this.shotInProgress = false;
          const result = this.game.completeShot(this.balls);
          if (result.foul) this.ui.setMessage('Foul committed. Turn switched.');
          else this.ui.setMessage(result.legalPots > 0 ? `Great shot! +${result.legalPots}` : 'No pot. Turn switched.');

          if (result.winner !== null) {
            this.ui.showGameOver(result.winner);
          }

          const cue = this.cueBall;
          if (cue?.pocketed) {
            cue.pocketed = false;
            cue.pocketProgress = 0;
            cue.mesh.visible = true;
            cue.mesh.scale.setScalar(1);
            cue.pos.set(-0.7, 0);
            cue.mesh.position.set(-0.7, cue.radius + 0.03, 0);
          }
        }
      }

      this.maybeAIShoot();
      this.ui.setScore(this.game.scores[0], this.game.scores[1], this.game.currentPlayer, this.mode);
      this.cue.update(this.cueBall, !this.shotInProgress && !this.replay.isReplaying, dt);
    }

    this.camera.update(dt);
    this.sceneManager.render();
  };
}
