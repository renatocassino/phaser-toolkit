import { describe, expect, it } from 'vitest';

import { isValidScene } from './is-valid-scene';

describe('isValidScene', () => {
  it('should return true for valid Phaser scene', () => {
    const mockScene = {
      registry: {},
      scene: {},
    };

    expect(isValidScene(mockScene)).toBe(true);
  });

  it('should return false for invalid scene', () => {
    expect(isValidScene(null)).toBe(false);
    expect(isValidScene(undefined)).toBe(false);
    expect(isValidScene({})).toBe(false);
    expect(isValidScene({ registry: {} })).toBe(false);
    expect(isValidScene({ scene: {} })).toBe(false);
  });
});
