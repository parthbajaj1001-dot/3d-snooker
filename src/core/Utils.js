export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export function distance2D(ax, az, bx, bz) {
  return Math.hypot(ax - bx, az - bz);
}

export function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
