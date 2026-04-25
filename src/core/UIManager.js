export class UIManager {
  constructor(container) {
    this.container = container;
    this.callbacks = {};
    this.build();
  }

  build() {
    this.container.innerHTML = `
      <div class="menu-screen" id="startMenu">
        <h1>Royal 3D Billiards Arena</h1>
        <p>Premium table simulation with AI, spin, replay and cinematic gameplay.</p>
        <div class="menu-row">
          <button data-action="start8">Start 8 Ball</button>
          <button data-action="startSnooker">Start Snooker</button>
        </div>
      </div>

      <div class="hud hidden" id="hud">
        <div class="panel scoreboard">
          <div id="turn">Turn: Player 1</div>
          <div id="score">P1 0 - 0 P2</div>
          <div id="mode">Mode: 8 Ball</div>
        </div>

        <div class="panel meter">
          <label>Power <span id="powerLabel">35%</span></label>
          <input id="power" type="range" min="5" max="100" value="35" />
          <label>Spin X/Z</label>
          <div class="spin-grid" id="spinPad"></div>
        </div>

        <div class="panel controls">
          <button data-action="shoot">Shoot</button>
          <button data-action="toggleView">Top View</button>
          <button data-action="replay">Replay</button>
          <button data-action="pause">Pause</button>
          <button data-action="reset">Reset</button>
        </div>

        <div class="panel settings" id="settingsPanel">
          <label><input id="aiToggle" type="checkbox" checked /> AI Opponent</label>
          <label><input id="musicToggle" type="checkbox" /> Ambient Music</label>
          <label>Volume <input id="volume" type="range" min="0" max="100" value="70" /></label>
        </div>

        <div class="message" id="message"></div>
      </div>

      <div class="menu-screen hidden" id="pauseMenu">
        <h2>Paused</h2>
        <button data-action="resume">Resume</button>
      </div>

      <div class="menu-screen hidden" id="gameOver">
        <h2 id="winnerLabel">Game Over</h2>
        <button data-action="restart">Play Again</button>
      </div>

      <button class="mobile-shoot hidden" id="mobileShoot" data-action="shoot">Shoot</button>
    `;

    this.hud = this.container.querySelector('#hud');
    this.startMenu = this.container.querySelector('#startMenu');
    this.pauseMenu = this.container.querySelector('#pauseMenu');
    this.gameOver = this.container.querySelector('#gameOver');
    this.turn = this.container.querySelector('#turn');
    this.score = this.container.querySelector('#score');
    this.mode = this.container.querySelector('#mode');
    this.message = this.container.querySelector('#message');
    this.power = this.container.querySelector('#power');
    this.powerLabel = this.container.querySelector('#powerLabel');
    this.spinPad = this.container.querySelector('#spinPad');
    this.winnerLabel = this.container.querySelector('#winnerLabel');

    this.container.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => this.callbacks[btn.dataset.action]?.());
    });

    this.power.addEventListener('input', () => {
      const value = Number(this.power.value) / 100;
      this.powerLabel.textContent = `${Math.round(value * 100)}%`;
      this.callbacks.onPower?.(value);
    });

    this.spinPad.addEventListener('pointerdown', (e) => this.handleSpin(e));
    this.spinPad.addEventListener('pointermove', (e) => {
      if (e.buttons) this.handleSpin(e);
    });

    this.container.querySelector('#aiToggle').addEventListener('change', (e) => this.callbacks.onAI?.(e.target.checked));
    this.container.querySelector('#musicToggle').addEventListener('change', (e) => this.callbacks.onMusic?.(e.target.checked));
    this.container.querySelector('#volume').addEventListener('input', (e) => this.callbacks.onVolume?.(Number(e.target.value) / 100));
  }

  on(action, cb) {
    this.callbacks[action] = cb;
  }

  handleSpin(e) {
    const rect = this.spinPad.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    this.callbacks.onSpin?.(x, y);
    this.spinPad.style.setProperty('--sx', `${x * 42}px`);
    this.spinPad.style.setProperty('--sy', `${-y * 42}px`);
  }

  showHUD() {
    this.hud.classList.remove('hidden');
    this.startMenu.classList.add('hidden');
  }

  setMessage(text) {
    this.message.textContent = text;
  }

  setScore(p1, p2, current, mode) {
    this.turn.textContent = `Turn: Player ${current + 1}`;
    this.score.textContent = `P1 ${p1} - ${p2} P2`;
    this.mode.textContent = `Mode: ${mode === 'snooker' ? 'Snooker' : '8 Ball'}`;
  }

  setPaused(paused) {
    this.pauseMenu.classList.toggle('hidden', !paused);
  }

  showGameOver(playerIndex) {
    this.gameOver.classList.remove('hidden');
    this.winnerLabel.textContent = `Winner: Player ${playerIndex + 1}`;
  }

  hideGameOver() {
    this.gameOver.classList.add('hidden');
  }
}
