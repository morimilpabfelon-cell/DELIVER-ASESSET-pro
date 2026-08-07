type MotionMode = 'enhanced' | 'reduced' | 'static';

export function resolveMotionMode(reduceMotion: boolean, supportsObserver: boolean): MotionMode {
  if (reduceMotion) return 'reduced';
  return supportsObserver ? 'enhanced' : 'static';
}
