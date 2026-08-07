import { describe, expect, it } from 'vitest';
import { resolveMotionMode } from './motion';

describe('motion contract', () => {
  it('resolves enhanced, reduced and static modes explicitly', () => {
    expect(resolveMotionMode(false, true)).toBe('enhanced');
    expect(resolveMotionMode(true, true)).toBe('reduced');
    expect(resolveMotionMode(false, false)).toBe('static');
    expect(resolveMotionMode(true, false)).toBe('reduced');
  });
});
