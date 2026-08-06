import { describe, expect, it } from 'vitest';
import { clampRevealIndex, getRevealDelay, resolveMotionMode } from './motion';

describe('motion contract', () => {
  it('clamps reveal indices to safe whole values', () => {
    expect(clampRevealIndex(-2)).toBe(0);
    expect(clampRevealIndex(Number.NaN)).toBe(0);
    expect(clampRevealIndex(2.9)).toBe(2);
    expect(clampRevealIndex(20, 4)).toBe(4);
    expect(clampRevealIndex(2, -1)).toBe(0);
    expect(clampRevealIndex(2, Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('calculates bounded stagger delays without negative timing', () => {
    expect(getRevealDelay(0)).toBe(0);
    expect(getRevealDelay(3)).toBe(210);
    expect(getRevealDelay(10, 80, 4)).toBe(320);
    expect(getRevealDelay(3, -20)).toBe(0);
    expect(getRevealDelay(3, Number.NaN)).toBe(0);
  });

  it('resolves enhanced, reduced and static modes explicitly', () => {
    expect(resolveMotionMode(false, true)).toBe('enhanced');
    expect(resolveMotionMode(true, true)).toBe('reduced');
    expect(resolveMotionMode(false, false)).toBe('static');
    expect(resolveMotionMode(true, false)).toBe('reduced');
  });
});
