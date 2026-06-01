import Phaser from 'phaser';
import blueSoldierUrl from './public/assets/blue_01.png';
import redSoldierUrl from './public/assets/red_01.png';

type Player = 'blue' | 'red';
type Owner = Player | null;
type GameMode = 'campaign' | 'ai' | 'local' | 'online';

type Hex = {
  q: number;
  r: number;
  s: number;
  owner: Owner;
  poly?: Phaser.GameObjects.Polygon;
  piece?: Phaser.GameObjects.Image;
  text?: Phaser.GameObjects.Text;
};

type OnlineRoomState = {
  room_code: string;
  player_id?: string;
  player_color?: Player | null;
  red_joined: boolean;
  current_player: Player;
  turn: number;
  game_over: boolean;
  winner: Player | null;
  counts: { blue: number; red: number };
  cells: { q: number; r: number; s: number; owner: Owner }[];
  updated_at: number;
};

const WIDTH = 450;
const HEIGHT = 800;
const BOARD_RADIUS = 4;
const HEX_SIZE = 27.5;
const SQRT3 = Math.sqrt(3);

const BLUE_SOLDIER_KEY = 'blue_soldier';
const RED_SOLDIER_KEY = 'red_soldier';

const DEFAULT_PVP_SERVER_URL =
  localStorage.getItem('hex_pvp_server_url') || 'http://hex-conquest-pvp-alb-1620546806.ap-southeast-2.elb.amazonaws.com';

const COLORS = {
  bgTop: 0x1db9e8,
  bgBottom: 0x163d5d,
  empty: 0xf1f5e9,
  emptyStroke: 0x1a1a1a,
  blue: 0x1889ff,
  blueDark: 0x003d8f,
  red: 0xff2a2a,
  redDark: 0x8f0000,
  selected: 0xffdf40,
  valid: 0x7cff83,
  panel: 0xffffff,
  text: '#ffffff',
};

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.createBackground();

    this.add.text(WIDTH / 2, 76, 'HEX CONQUEST', {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 118, 'Move 1 hex. Convert adjacent enemies.', {
      fontSize: '16px',
      color: '#eaf7ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 177, 'SELECT GAME MODE', {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.createMenuButton(225, 'Campaign', 'Complete levels with increasing difficulty', () => {
      this.scene.start('HexConquestScene', { mode: 'campaign', campaignLevel: 1 });
    });

    this.createMenuButton(315, 'Play Against AI', 'Current single-player behavior', () => {
      this.scene.start('HexConquestScene', { mode: 'ai', campaignLevel: 1 });
    });

    this.createMenuButton(405, 'Local 2 Player', 'Blue and Red take turns on one device', () => {
      this.scene.start('HexConquestScene', { mode: 'local', campaignLevel: 1 });
    });

    this.createMenuButton(495, 'Play Against Online Player', 'Create or join a private room code', () => {
      this.scene.start('OnlineLobbyScene');
    });

    this.add.text(WIDTH / 2, 690, 'Tip: Press R during a match to restart.', {
      fontSize: '15px',
      color: '#eaf7ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
  }

  private createBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.bgTop, COLORS.bgTop, COLORS.bgBottom, COLORS.bgBottom, 1);
    g.fillRect(0, 0, WIDTH, HEIGHT);
  }

  private createMenuButton(y: number, title: string, subtitle: string, callback: () => void) {
    const button = this.add.container(WIDTH / 2, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x163d5d, 0.82);
    bg.lineStyle(3, 0xffffff, 0.58);
    bg.fillRoundedRect(-185, -36, 370, 72, 16);
    bg.strokeRoundedRect(-185, -36, 370, 72, 16);

    const titleText = this.add.text(0, -10, title, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    const subtitleText = this.add.text(0, 17, subtitle, {
      fontSize: '13px',
      color: '#dff5ff',
    }).setOrigin(0.5);

    button.add([bg, titleText, subtitleText]);
    button.setSize(370, 72);
    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      button.setScale(1.03);
    });

    button.on('pointerout', () => {
      button.setScale(1);
    });

    button.on('pointerdown', callback);
  }
}

class OnlineLobbyScene extends Phaser.Scene {
  private serverUrl = DEFAULT_PVP_SERVER_URL;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('OnlineLobbyScene');
  }

  create() {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.bgTop, COLORS.bgTop, COLORS.bgBottom, COLORS.bgBottom, 1);
    g.fillRect(0, 0, WIDTH, HEIGHT);

    this.add.text(WIDTH / 2, 72, 'ONLINE PVP', {
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 116, 'Create a room or join with a code.', {
      fontSize: '16px',
      color: '#eaf7ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const panel = this.add.graphics();
    panel.fillStyle(0x163d5d, 0.78);
    panel.lineStyle(3, 0xffffff, 0.6);
    panel.fillRoundedRect(24, 145, WIDTH - 48, 110, 18);
    panel.strokeRoundedRect(24, 145, WIDTH - 48, 110, 18);

    this.statusText = this.add.text(WIDTH / 2, 200, `Server:\n${this.serverUrl}`, {
      fontSize: '15px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: 370 },
    }).setOrigin(0.5);

    this.createLobbyButton(315, 'Create Room', () => this.createRoom());
    this.createLobbyButton(405, 'Join Room', () => this.joinRoom());
    this.createLobbyButton(495, 'Set Server URL', () => this.setServerUrl());
    this.createLobbyButton(650, 'Back to Menu', () => this.scene.start('MenuScene'));
  }

  private createLobbyButton(y: number, labelText: string, callback: () => void) {
    const button = this.add.container(WIDTH / 2, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xb78a55, 1);
    bg.fillRoundedRect(-155, -29, 310, 58, 14);

    const label = this.add.text(0, 0, labelText, {
      fontSize: '23px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(310, 58);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', callback);
  }

  private setStatus(text: string) {
    this.statusText.setText(text);
  }

  private normalizeServerUrl(url: string) {
    return url.trim().replace(/\/$/, '');
  }

  private setServerUrl() {
    const entered = window.prompt('Enter PvP server URL', this.serverUrl);
    if (!entered) return;

    this.serverUrl = this.normalizeServerUrl(entered);
    localStorage.setItem('hex_pvp_server_url', this.serverUrl);
    this.setStatus(`Server:\n${this.serverUrl}`);
  }

  private async createRoom() {
    try {
      this.setStatus('Creating room...');

      const res = await fetch(`${this.serverUrl}/rooms/create`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error(await res.text());

      const state: OnlineRoomState = await res.json();
      this.scene.start('HexConquestScene', {
        mode: 'online',
        onlineServerUrl: this.serverUrl,
        roomCode: state.room_code,
        playerId: state.player_id,
        playerColor: state.player_color,
      });
    } catch (error) {
      this.setStatus(`Create room failed:\n${String(error).slice(0, 160)}`);
    }
  }

  private async joinRoom() {
    try {
      const code = window.prompt('Enter room code')?.trim().toUpperCase();
      if (!code) return;

      this.setStatus(`Joining ${code}...`);

      const res = await fetch(`${this.serverUrl}/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: code }),
      });

      if (!res.ok) throw new Error(await res.text());

      const state: OnlineRoomState = await res.json();
      this.scene.start('HexConquestScene', {
        mode: 'online',
        onlineServerUrl: this.serverUrl,
        roomCode: state.room_code,
        playerId: state.player_id,
        playerColor: state.player_color,
      });
    } catch (error) {
      this.setStatus(`Join room failed:\n${String(error).slice(0, 160)}`);
    }
  }
}

class HexConquestScene extends Phaser.Scene {
  private hexes = new Map<string, Hex>();
  private currentPlayer: Player = 'blue';
  private selected: Hex | null = null;
  private turn = 1;
  private gameOver = false;
  private mode: GameMode = 'ai';
  private campaignLevel = 1;
  private aiPlayer: Player | null = 'red';
  private aiThinking = false;
  private statusText!: Phaser.GameObjects.Text;
  private countText!: Phaser.GameObjects.Text;
  private boardCenterX = (WIDTH / 2) + 25;
  private boardCenterY = 475;
  private validMoves = new Set<string>();
  private previewTexts: Phaser.GameObjects.Text[] = [];
  private endButtons: Phaser.GameObjects.Container[] = [];

  private onlineServerUrl = '';
  private roomCode = '';
  private playerId = '';
  private playerColor: Player | null = null;
  private pollingEvent?: Phaser.Time.TimerEvent;
  private onlineSubmittingMove = false;
  private onlineInteracting = false;
  private lastAppliedOnlineUpdate = 0;

  constructor() {
    super('HexConquestScene');
  }

  preload() {
    this.load.image(BLUE_SOLDIER_KEY, blueSoldierUrl);
    this.load.image(RED_SOLDIER_KEY, redSoldierUrl);
  }

  init(data: {
    mode?: GameMode;
    campaignLevel?: number;
    onlineServerUrl?: string;
    roomCode?: string;
    playerId?: string;
    playerColor?: Player | null;
  }) {
    this.mode = data.mode ?? 'ai';
    this.campaignLevel = data.campaignLevel ?? 1;
    this.aiPlayer = this.mode === 'local' || this.mode === 'online' ? null : 'red';

    this.onlineServerUrl = data.onlineServerUrl ?? '';
    this.roomCode = data.roomCode ?? '';
    this.playerId = data.playerId ?? '';
    this.playerColor = data.playerColor ?? null;
  }

  private resetState() {
    this.hexes.clear();
    this.currentPlayer = 'blue';
    this.selected = null;
    this.turn = 1;
    this.gameOver = false;
    this.aiThinking = false;
    this.validMoves.clear();
    this.previewTexts = [];
    this.endButtons = [];
    this.pollingEvent = undefined;
    this.onlineSubmittingMove = false;
    this.onlineInteracting = false;
    this.lastAppliedOnlineUpdate = 0;
  }

  create() {
    this.resetState();
    this.createBackground();
    this.createHeader();
    this.createBoard();
    this.createBottomButtons();
    this.input.keyboard?.off('keydown-R');
    this.input.keyboard?.on('keydown-R', () => this.restartGame());
    this.updateHud();

    if (this.mode === 'online') {
      this.startOnlinePolling();
    }
  }

  private createBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.bgTop, COLORS.bgTop, COLORS.bgBottom, COLORS.bgBottom, 1);
    g.fillRect(0, 0, WIDTH, HEIGHT);

    this.add.text(WIDTH / 2, 42, 'HEX CONQUEST', {
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const modeLabel = this.getModeLabel();
    this.add.text(WIDTH / 2, 78, modeLabel, {
      fontSize: '16px',
      color: '#eaf7ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
  }

  private getModeLabel() {
    if (this.mode === 'campaign') return `Campaign Level ${this.campaignLevel}`;
    if (this.mode === 'ai') return 'Play Against AI';
    if (this.mode === 'local') return 'Local 2 Player';
    if (this.mode === 'online') return `Online PvP Room ${this.roomCode}`;
    return 'Online Multiplayer';
  }

  private createHeader() {
    const panel = this.add.graphics();
    panel.fillStyle(0x163d5d, 0.78);
    panel.lineStyle(3, 0xffffff, 0.6);
    panel.fillRoundedRect(24, 105, WIDTH - 48, 100, 18);
    panel.strokeRoundedRect(24, 105, WIDTH - 48, 100, 18);

    this.statusText = this.add.text(WIDTH / 2, 129, '', {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5);

    this.countText = this.add.text(WIDTH / 2, 171, '', {
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: WIDTH - 60 },
    }).setOrigin(0.5);
  }

  private createBottomButtons() {
    this.createSmallButton(WIDTH / 2 - 93, 740, 'Menu', () => this.backToMenu());
    this.createSmallButton(WIDTH / 2 + 93, 740, this.mode === 'online' ? 'Leave' : 'Restart', () => this.restartGame());
  }

  private createSmallButton(x: number, y: number, labelText: string, callback: () => void) {
    const button = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xb78a55, 1);
    bg.fillRoundedRect(-78, -27, 156, 54, 14);

    const label = this.add.text(0, 0, labelText, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(156, 54);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', callback);
    return button;
  }

  private createBoard() {
    this.hexes.clear();
    this.selected = null;
    this.validMoves.clear();
    this.previewTexts = [];

    for (let q = -BOARD_RADIUS; q <= BOARD_RADIUS; q++) {
      const r1 = Math.max(-BOARD_RADIUS, -q - BOARD_RADIUS);
      const r2 = Math.min(BOARD_RADIUS, -q + BOARD_RADIUS);
      for (let r = r1; r <= r2; r++) {
        const s = -q - r;
        const owner = this.getInitialOwner(q, r, s);
        const hex: Hex = { q, r, s, owner };
        this.hexes.set(this.key(q, r), hex);
      }
    }

    for (const hex of this.hexes.values()) {
      this.drawHex(hex);
    }
  }

  private getInitialOwner(q: number, _r: number, s: number): Owner {
    if (q <= -3 || s >= 3) return 'blue';
    if (q >= 3 || s <= -3) return 'red';

    if (this.mode === 'campaign' && this.campaignLevel >= 3 && (q === 2 || s === -2) && Phaser.Math.Between(0, 100) < 24) {
      return 'red';
    }

    if (this.mode === 'campaign' && this.campaignLevel >= 5 && (q === -2 || s === 2) && Phaser.Math.Between(0, 100) < 12) {
      return null;
    }

    return null;
  }

  private drawHex(hex: Hex) {
    const { x, y } = this.hexToPixel(hex.q, hex.r);
    const points = this.getHexPoints(HEX_SIZE - 1).flatMap(p => [p.x, p.y]);
    const fill = hex.owner === 'blue' ? COLORS.blue : hex.owner === 'red' ? COLORS.red : COLORS.empty;

    const poly = this.add.polygon(x, y, points, fill, 1);
    poly.setStrokeStyle(2, COLORS.emptyStroke, 1);
    poly.setInteractive(new Phaser.Geom.Polygon(this.getHexPoints(HEX_SIZE - 1)), Phaser.Geom.Polygon.Contains);
    poly.on('pointerdown', () => this.handleHexTap(hex));
    hex.poly = poly;

    if (hex.owner) this.createPiece(hex);
  }

  private createPiece(hex: Hex) {
    if (!hex.owner) return;

    const { x, y } = this.hexToPixel(hex.q, hex.r);

    const PIECE_OFFSET_X = -25;
    const PIECE_OFFSET_Y = -30;

    const texture = hex.owner === 'blue' ? BLUE_SOLDIER_KEY : RED_SOLDIER_KEY;

    const sprite = this.add.image(
      x + PIECE_OFFSET_X,
      y + PIECE_OFFSET_Y,
      texture
    );

    sprite.setDisplaySize(44, 44);
    sprite.setDepth(5);

    hex.piece = sprite;
  }

  private handleHexTap(hex: Hex) {
    if (this.gameOver || this.aiThinking || this.onlineSubmittingMove) return;

    if (this.mode === 'online') {
      if (!this.playerColor) return;
      if (this.currentPlayer !== this.playerColor) {
        this.shakeInvalid(hex);
        return;
      }
    } else if (this.currentPlayer === this.aiPlayer) {
      return;
    }

    if (hex.owner === this.currentPlayer) {
      this.selectHex(hex);
      return;
    }

    if (this.selected && !hex.owner && this.validMoves.has(this.key(hex.q, hex.r))) {
      if (this.mode === 'online') {
        this.submitOnlineMove(this.selected, hex);
      } else {
        this.moveSelectedTo(hex);
      }
      return;
    }

    this.shakeInvalid(hex);
  }

  private selectHex(hex: Hex) {
    if (this.mode === 'online') {
      this.onlineInteracting = true;
    }

    this.clearHighlights();
    this.selected = hex;
    hex.poly?.setStrokeStyle(5, COLORS.selected, 1);

    for (const n of this.neighbors(hex)) {
      if (!n.owner) {
        this.validMoves.add(this.key(n.q, n.r));
        n.poly?.setFillStyle(COLORS.valid, 1);
        this.createMovePreview(n, this.currentPlayer);
      }
    }
  }

  private createMovePreview(target: Hex, player: Player) {
    const captureCount = this.countAdjacentEnemies(target, player);
    if (captureCount <= 0) return;

    const { x, y } = this.hexToPixel(target.q, target.r);

    const preview = this.add.text(x, y, `+${captureCount}`, {
      fontSize: '19px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    preview.setDepth(20);
    this.previewTexts.push(preview);

    this.tweens.add({
      targets: preview,
      y: y - 4,
      duration: 450,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private moveSelectedTo(target: Hex) {
    if (!this.selected) return;
    const from = this.selected;
    const mover: Player = this.currentPlayer;

    from.owner = null;
    if (from.piece) {
      from.piece.destroy();
      from.piece = undefined;
    }
    from.poly?.setFillStyle(COLORS.empty, 1);

    target.owner = mover;
    target.poly?.setFillStyle(mover === 'blue' ? COLORS.blue : COLORS.red, 1);
    this.createPiece(target);

    this.selected = null;
    this.clearHighlights();

    const converted = this.convertAdjacent(target, mover);
    this.flashConversions(target, converted);

    this.time.delayedCall(250, () => {
      if (this.checkVictory()) return;

      this.currentPlayer = this.currentPlayer === 'blue' ? 'red' : 'blue';
      this.turn++;
      this.updateHud();

      if (this.checkVictory()) return;

      if (this.currentPlayer === this.aiPlayer) {
        this.time.delayedCall(500, () => this.runAiTurn());
      }
    });
  }

  private convertAdjacent(hex: Hex, player: Player): Hex[] {
    const converted: Hex[] = [];
    for (const n of this.neighbors(hex)) {
      if (n.owner && n.owner !== player) {
        n.owner = player;
        n.poly?.setFillStyle(player === 'blue' ? COLORS.blue : COLORS.red, 1);
        n.piece?.destroy();
        n.piece = undefined;
        this.createPiece(n);
        converted.push(n);
      }
    }
    return converted;
  }

  private flashConversions(center: Hex, converted: Hex[]) {
    const all = [center, ...converted];
    for (const h of all) {
      if (!h.poly) continue;
      this.tweens.add({
        targets: h.poly,
        scaleX: 1.12,
        scaleY: 1.12,
        duration: 100,
        yoyo: true,
        ease: 'Sine.easeOut',
      });
      if (h.piece) {
        this.tweens.add({
          targets: h.piece,
          y: h.piece.y - 8,
          duration: 100,
          yoyo: true,
          ease: 'Sine.easeOut',
        });
      }
    }
  }

  private runAiTurn() {
    if (this.gameOver || this.currentPlayer !== this.aiPlayer || this.aiThinking) return;

    const move = this.getBestAiMove(this.aiPlayer);
    if (!move) {
      this.checkVictory();
      return;
    }

    this.aiThinking = true;
    this.clearHighlights();
    this.updateHud();

    move.from.poly?.setStrokeStyle(5, COLORS.selected, 1);
    move.to.poly?.setFillStyle(COLORS.valid, 1);

    this.time.delayedCall(350, () => {
      this.selected = move.from;
      this.validMoves.clear();
      this.validMoves.add(this.key(move.to.q, move.to.r));
      this.aiThinking = false;
      this.moveSelectedTo(move.to);
    });
  }

  private getBestAiMove(player: Player): { from: Hex; to: Hex; score: number } | null {
    const moves: { from: Hex; to: Hex; score: number }[] = [];

    for (const from of this.hexes.values()) {
      if (from.owner !== player) continue;

      for (const to of this.neighbors(from)) {
        if (to.owner) continue;

        const converted = this.countAdjacentEnemies(to, player);
        const centerDistance = Math.abs(to.q) + Math.abs(to.r) + Math.abs(to.s);
        const centerBonus = (BOARD_RADIUS * 3 - centerDistance) * 2;
        const randomBonus = Phaser.Math.Between(0, 4);

        const score = converted * 100 + centerBonus + randomBonus;
        moves.push({ from, to, score });
      }
    }

    if (!moves.length) return null;
    moves.sort((a, b) => b.score - a.score);

    if (this.mode === 'campaign') {
      const pickFromTop = Math.max(1, 6 - this.campaignLevel);
      const maxIndex = Math.min(pickFromTop, moves.length) - 1;
      return moves[Phaser.Math.Between(0, maxIndex)];
    }

    return moves[0];
  }

  private async startOnlinePolling() {
    await this.pollOnlineState();

    this.pollingEvent = this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => this.pollOnlineState(),
    });
  }

  private async pollOnlineState() {
    if (this.mode !== 'online' || !this.roomCode || !this.onlineServerUrl) return;

    // Prevent incoming polling data from clearing the player's current selection
    // or overwriting the board while a move is being submitted.
    if (this.onlineSubmittingMove || this.onlineInteracting) return;

    try {
      const res = await fetch(
        `${this.onlineServerUrl}/rooms/${this.roomCode}/state?player_id=${encodeURIComponent(this.playerId)}`
      );

      if (!res.ok) throw new Error(await res.text());

      const state: OnlineRoomState = await res.json();
      this.applyOnlineState(state);
    } catch (error) {
      this.countText.setText(`PvP sync error: ${String(error).slice(0, 80)}`);
    }
  }

  private async submitOnlineMove(from: Hex, to: Hex) {
    if (!this.onlineServerUrl || !this.roomCode || !this.playerId) return;
    if (this.onlineSubmittingMove) return;

    this.onlineSubmittingMove = true;
    this.onlineInteracting = false;
    this.selected = null;
    this.clearHighlights();
    this.statusText.setText('SUBMITTING MOVE...');

    try {
      const res = await fetch(`${this.onlineServerUrl}/rooms/${this.roomCode}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: this.playerId,
          from_q: from.q,
          from_r: from.r,
          to_q: to.q,
          to_r: to.r,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const state: OnlineRoomState = await res.json();
      this.applyOnlineState(state, true);
    } catch (error) {
      this.statusText.setText('MOVE FAILED');
      this.countText.setText(String(error).slice(0, 100));
    } finally {
      this.onlineSubmittingMove = false;

      // Give the backend response a short moment to settle before polling resumes.
      this.time.delayedCall(350, () => {
        this.onlineInteracting = false;
      });
    }
  }

  private applyOnlineState(state: OnlineRoomState, force = false) {
    if (!force && this.onlineSubmittingMove) return;

    // Avoid applying stale poll responses after a newer state has already arrived.
    if (!force && state.updated_at && state.updated_at < this.lastAppliedOnlineUpdate) return;
    if (state.updated_at) this.lastAppliedOnlineUpdate = state.updated_at;

    this.roomCode = state.room_code;
    this.currentPlayer = state.current_player;
    this.turn = state.turn;
    this.gameOver = state.game_over;

    if (state.player_id) this.playerId = state.player_id;
    if (state.player_color) this.playerColor = state.player_color;

    for (const cell of state.cells) {
      const h = this.hexes.get(this.key(cell.q, cell.r));
      if (!h || h.owner === cell.owner) continue;

      h.owner = cell.owner;
      h.piece?.destroy();
      h.piece = undefined;

      const fill = h.owner === 'blue' ? COLORS.blue : h.owner === 'red' ? COLORS.red : COLORS.empty;
      h.poly?.setFillStyle(fill, 1);
      if (h.owner) this.createPiece(h);
    }

    this.clearHighlights();

    if (this.mode === 'online' && this.currentPlayer !== this.playerColor) {
      this.onlineInteracting = false;
      this.selected = null;
    }

    if (!state.red_joined) {
      this.statusText.setText(`ROOM ${state.room_code}`);
      this.statusText.setColor('#ffffff');
      this.countText.setText('Waiting for Player 2 to join...');
      return;
    }

    if (state.game_over) {
      const winner = state.winner ?? 'blue';
      this.statusText.setText(`${winner.toUpperCase()} WINS!`);
      this.statusText.setColor(winner === 'blue' ? '#7cc3ff' : '#ff8f8f');
      this.countText.setText(`Room ${state.room_code}  Blue ${state.counts.blue} | Red ${state.counts.red}`);
      return;
    }

    this.updateHud();
  }

  private countAdjacentEnemies(hex: Hex, player: Player): number {
    return this.neighbors(hex).filter(n => n.owner && n.owner !== player).length;
  }

  private checkVictory(): boolean {
    const counts = this.getCounts();
    if (counts.blue === 0 || counts.red === 0) {
      this.gameOver = true;
      const winner: Player = counts.blue > 0 ? 'blue' : 'red';
      this.statusText.setText(`${winner.toUpperCase()} WINS!`);
      this.statusText.setColor(winner === 'blue' ? '#7cc3ff' : '#ff8f8f');
      this.countText.setText(`Final Score  Blue ${counts.blue}  |  Red ${counts.red}`);
      this.clearHighlights();
      this.showEndButtons(winner);
      return true;
    }

    const movable = [...this.hexes.values()].some(h => h.owner === this.currentPlayer && this.neighbors(h).some(n => !n.owner));
    if (!movable) {
      this.gameOver = true;
      const winner: Player = counts.blue >= counts.red ? 'blue' : 'red';
      this.statusText.setText(`NO MOVES — ${winner.toUpperCase()} WINS!`);
      this.statusText.setColor(winner === 'blue' ? '#7cc3ff' : '#ff8f8f');
      this.countText.setText(`Blue ${counts.blue}  |  Red ${counts.red}`);
      this.clearHighlights();
      this.showEndButtons(winner);
      return true;
    }
    return false;
  }

  private showEndButtons(winner: Player) {
    for (const b of this.endButtons) b.destroy();
    this.endButtons = [];

    if (this.mode === 'campaign' && winner === 'blue') {
      const next = this.createWideButton(WIDTH / 2, 650, `Next Level ${this.campaignLevel + 1}`, () => {
        this.scene.start('HexConquestScene', {
          mode: 'campaign',
          campaignLevel: this.campaignLevel + 1,
        });
      });
      this.endButtons.push(next);
      return;
    }

    if (this.mode === 'campaign' && winner === 'red') {
      const retry = this.createWideButton(WIDTH / 2, 650, `Retry Level ${this.campaignLevel}`, () => this.restartGame());
      this.endButtons.push(retry);
    }
  }

  private createWideButton(x: number, y: number, labelText: string, callback: () => void) {
    const button = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xb78a55, 1);
    bg.fillRoundedRect(-145, -27, 290, 54, 14);

    const label = this.add.text(0, 0, labelText, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(290, 54);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', callback);
    return button;
  }

  private updateHud() {
    const counts = this.getCounts();

    if (this.aiThinking) {
      this.statusText.setText('RED IS THINKING...');
      this.statusText.setColor('#ff8f8f');
      this.countText.setText(`Turn ${this.turn}    Blue ${counts.blue}  |  Red ${counts.red}`);
      return;
    }

    if (this.mode === 'online') {
      const turnText = this.currentPlayer === this.playerColor ? 'YOUR TURN' : `${this.currentPlayer.toUpperCase()}'S TURN`;
      const colorText = this.playerColor ? `You are ${this.playerColor.toUpperCase()}` : 'Online PvP';
      this.statusText.setText(turnText);
      this.statusText.setColor(this.currentPlayer === 'blue' ? '#7cc3ff' : '#ff8f8f');
      this.countText.setText(`Room ${this.roomCode}  ${colorText}\nTurn ${this.turn}  Blue ${counts.blue} | Red ${counts.red}`);
      return;
    }

    this.statusText.setText(`${this.currentPlayer.toUpperCase()}'S TURN`);
    this.statusText.setColor(this.currentPlayer === 'blue' ? '#7cc3ff' : '#ff8f8f');

    const modePart = this.mode === 'campaign' ? `Level ${this.campaignLevel}  ` : '';
    this.countText.setText(`${modePart}Turn ${this.turn}    Blue ${counts.blue}  |  Red ${counts.red}`);
  }

  private getCounts() {
    let blue = 0;
    let red = 0;
    for (const h of this.hexes.values()) {
      if (h.owner === 'blue') blue++;
      if (h.owner === 'red') red++;
    }
    return { blue, red };
  }

  private clearHighlights() {
    for (const t of this.previewTexts) {
      this.tweens.killTweensOf(t);
      t.destroy();
    }
    this.previewTexts = [];

    this.validMoves.clear();

    for (const h of this.hexes.values()) {
      const fill = h.owner === 'blue' ? COLORS.blue : h.owner === 'red' ? COLORS.red : COLORS.empty;
      h.poly?.setFillStyle(fill, 1);
      h.poly?.setStrokeStyle(2, COLORS.emptyStroke, 1);
    }
  }

  private shakeInvalid(hex: Hex) {
    if (!hex.poly) return;
    this.tweens.add({ targets: hex.poly, x: hex.poly.x + 4, duration: 45, yoyo: true, repeat: 2 });
  }

  private restartGame() {
    this.time.removeAllEvents();
    this.tweens.killAll();

    if (this.mode === 'online') {
      this.scene.start('OnlineLobbyScene');
      return;
    }

    this.resetState();
    this.scene.restart({ mode: this.mode, campaignLevel: this.campaignLevel });
  }

  private backToMenu() {
    this.time.removeAllEvents();
    this.tweens.killAll();
    this.scene.start('MenuScene');
  }

  private key(q: number, r: number) {
    return `${q},${r}`;
  }

  private hexToPixel(q: number, r: number) {
    const x = this.boardCenterX + HEX_SIZE * SQRT3 * (q + r / 2);
    const y = this.boardCenterY + HEX_SIZE * 1.5 * r;
    return { x, y };
  }

  private getHexPoints(size: number) {
    const pts: Phaser.Types.Math.Vector2Like[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = Phaser.Math.DegToRad(60 * i - 30);
      pts.push({ x: size * Math.cos(angle), y: size * Math.sin(angle) });
    }
    return pts;
  }

  private neighbors(hex: Hex): Hex[] {
    const dirs = [
      [1, 0], [1, -1], [0, -1],
      [-1, 0], [-1, 1], [0, 1],
    ];
    return dirs
      .map(([dq, dr]) => this.hexes.get(this.key(hex.q + dq, hex.r + dr)))
      .filter((h): h is Hex => Boolean(h));
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game',
  backgroundColor: '#101826',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, OnlineLobbyScene, HexConquestScene],
};

new Phaser.Game(config);
