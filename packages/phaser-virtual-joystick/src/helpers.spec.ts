/* eslint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { getDefaultBounds, isWithinBounds } from './helpers';

describe('getDefaultBounds', () => {
  const mockScene = (width: number, height: number): unknown => {
    return {
      scale: {
        width,
        height,
      },
    };
  }

  it('should calculate default bounds using left half of the screen with 20% top padding', () => {
    const width = 800;
    const height = 600;
    const scene = mockScene(width, height);

    // By default: 
    // DEFAULT_TOP_PADDING = 0.2
    // DEFAULT_LEFT_HALF = 0.5 (see config in actual implementation)
    // These should be read from config in the actual code,
    // but we are assuming the constants' default values as above.

    // @ts-expect-error - mockScene returns an unknown object
    const bounds = getDefaultBounds(scene);

    expect(bounds.topLeft.x).toBe(0);
    expect(bounds.topLeft.y).toBeCloseTo(height * 0.2); // 120
    expect(bounds.bottomRight.x).toBeCloseTo(width * 0.5); // 400
    expect(bounds.bottomRight.y).toBe(height);
  });
});

describe('isWithinBounds', () => {
  const bounds = {
    topLeft: { x: 0, y: 100 },
    bottomRight: { x: 400, y: 600 },
  };

  it('should return true for a point inside the bounds', () => {
    expect(isWithinBounds(200, 200, bounds)).toBe(true);
  });

  it('should return true for a point on the topLeft corner', () => {
    expect(isWithinBounds(0, 100, bounds)).toBe(true);
  });

  it('should return true for a point on the bottomRight corner', () => {
    expect(isWithinBounds(400, 600, bounds)).toBe(true);
  });

  it('should return false if x is less than topLeft.x', () => {
    expect(isWithinBounds(-10, 200, bounds)).toBe(false);
  });

  it('should return false if y is less than topLeft.y', () => {
    expect(isWithinBounds(200, 99, bounds)).toBe(false);
  });

  it('should return false if x is greater than bottomRight.x', () => {
    expect(isWithinBounds(401, 200, bounds)).toBe(false);
  });

  it('should return false if y is greater than bottomRight.y', () => {
    expect(isWithinBounds(200, 601, bounds)).toBe(false);
  });
});
