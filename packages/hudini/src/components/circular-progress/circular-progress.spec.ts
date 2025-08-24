/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { type Scene } from 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
const mockTweens = {
  add: vi.fn(),
  killTweensOf: vi.fn(),
};

const mockScene = {
  tweens: mockTweens,
} as unknown as Scene;

vi.mock('phaser', () => ({
  GameObjects: {
    Container: class Container {
      public x: number;
      public y: number;
      public scene: unknown;
      public list: unknown[] = [];

      constructor(scene: unknown, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
      }

      add(children: unknown[]): this {
        this.list.push(...children);
        return this;
      }

      destroy(): void {
        // Mock destroy
      }
    },
  },
}));

vi.mock('font-awesome-for-phaser', () => ({
  IconText: class IconText {
    public rotation = 0;

    constructor(public params: unknown) { }

    setOrigin(): this { return this; }
    setIcon(): this { return this; }
    setStyle(): this { return this; }
    setFontSize(): this { return this; }
  },
}));

vi.mock('phaser-wind', () => ({
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
  },
}));

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    color: {
      rgb: vi.fn((color: string) => `rgb-${color}`),
    },
    fontSize: {
      px: vi.fn((size: string) => {
        const sizeMap: Record<string, number> = {
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
        };
        return sizeMap[size] ?? 16;
      }),
    },
  })),
}));

import { CircularProgress } from './circular-progress';


beforeEach(() => {
  vi.clearAllMocks();
});

describe('CircularProgress', () => {
  it('creates with default parameters', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    expect(progress.x).toBe(100);
    expect(progress.y).toBe(200);
    expect(progress.spinning).toBe(true);
    expect(mockTweens.add).toHaveBeenCalled();
  });

  it('creates with custom parameters', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
      icon: 'gear',
      color: 'red',
      size: 'lg',
      rotationsPerSecond: 3,
    });

    expect(progress.spinning).toBe(true);
    expect(mockTweens.add).toHaveBeenCalled();
  });

  it('can start and stop spinning', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    // Should start spinning by default
    expect(progress.spinning).toBe(true);

    // Stop spinning
    progress.stop();
    expect(progress.spinning).toBe(false);
    expect(mockTweens.killTweensOf).toHaveBeenCalled();

    // Start spinning again
    vi.clearAllMocks();
    progress.start();
    expect(progress.spinning).toBe(true);
    expect(mockTweens.add).toHaveBeenCalled();
  });

  it('can change speed', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
      rotationsPerSecond: 1,
    });

    vi.clearAllMocks();
    progress.setRotationsPerSecond(5);

    // Should restart animation with new speed
    expect(mockTweens.killTweensOf).toHaveBeenCalled();
    expect(mockTweens.add).toHaveBeenCalled();
  });

  it('can change icon', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    const result = progress.setIcon('rotate');
    expect(result).toBe(progress); // Should return this for chaining
  });

  it('can change color', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    const result = progress.setColor('green-500');
    expect(result).toBe(progress); // Should return this for chaining
  });

  it('can change size', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    // Test with token
    let result = progress.setSize('xl');
    expect(result).toBe(progress);

    // Test with pixel value
    result = progress.setSize(32);
    expect(result).toBe(progress);
  });

  it('cleans up properly on destroy', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    progress.destroy();
    expect(progress.spinning).toBe(false);
    expect(mockTweens.killTweensOf).toHaveBeenCalled();
  });

  it('supports method chaining', () => {
    const progress = new CircularProgress({
      scene: mockScene,
      x: 100,
      y: 200,
    });

    const result = progress
      .setRotationsPerSecond(3)
      .setIcon('gear')
      .setColor('red-500')
      .setSize('lg')
      .stop()
      .start();

    expect(result).toBe(progress);
  });
});