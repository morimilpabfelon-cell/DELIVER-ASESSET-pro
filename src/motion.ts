export type MotionMode = 'enhanced' | 'reduced' | 'static';

export function clampRevealIndex(index: number, maximum = 6): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  const safeMaximum = Number.isFinite(maximum) ? Math.max(0, Math.floor(maximum)) : 0;
  return Math.min(Math.floor(index), safeMaximum);
}

export function getRevealDelay(index: number, step = 70, maximum = 6): number {
  const safeStep = Number.isFinite(step) ? Math.max(0, step) : 0;
  return clampRevealIndex(index, maximum) * safeStep;
}

export function resolveMotionMode(reduceMotion: boolean, supportsObserver: boolean): MotionMode {
  if (reduceMotion) return 'reduced';
  return supportsObserver ? 'enhanced' : 'static';
}
