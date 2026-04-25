export const TABLE = {
  width: 2.54,
  height: 1.27,
  cushion: 0.08,
  pocketRadius: 0.06,
  ballRadius: 0.0285,
};

export const PHYSICS = {
  friction: 0.988,
  stopEpsilon: 0.015,
  restitutionBall: 0.97,
  restitutionCushion: 0.88,
  spinToCurve: 0.15,
  maxSpeed: 4.0,
};

export const GAME = {
  players: ['Player 1', 'Player 2'],
  maxPower: 1,
  minPower: 0.05,
};

export const BALL_COLORS_8BALL = {
  cue: 0xf5f5f5,
  black: 0x0f0f0f,
  solids: [0xf7d038, 0x3e57ff, 0xff3a30, 0x7c2ad9, 0xff8c1a, 0x2d9b44, 0x6f3a1d],
  stripes: [0xf7d038, 0x3e57ff, 0xff3a30, 0x7c2ad9, 0xff8c1a, 0x2d9b44, 0x6f3a1d],
};

export const BALL_COLORS_SNOOKER = {
  cue: 0xf5f5f5,
  reds: 0xb5161a,
  yellow: 0xd7b41f,
  green: 0x2f9e4f,
  brown: 0x704528,
  blue: 0x2f5fd2,
  pink: 0xf2a0bd,
  black: 0x111111,
};
