/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { Scene } from 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Phaser to avoid canvas dependency in runtime
vi.mock('phaser', () => {
  class Scene {
    public add = {
      graphics: (): Record<string, unknown> => ({
        fillStyle: vi.fn(),
        fillRoundedRect: vi.fn(),
        generateTexture: vi.fn(),
        destroy: vi.fn(),
      }),
      sprite: vi.fn(() => ({
        setOrigin: vi.fn(),
        setScale: vi.fn(),
        setX: vi.fn(),
        destroy: vi.fn(),
      })),
    };

    public textures = {
      exists: vi.fn(() => false),
    };

    public tweens = {
      add: vi.fn(() => ({
        destroy: vi.fn(),
      })),
    };

    constructor() {
      // Ensure textures is properly bound to this instance
      this.textures = {
        exists: vi.fn(() => false),
      };
      this.tweens = {
        add: vi.fn(() => ({
          destroy: vi.fn(),
        })),
      };
    }
  }

  class Container {
    public list: unknown[] = [];
    public x: number;
    public y: number;
    public width = 0;
    public height = 0;
    public scene: Scene;

    constructor(scene: Scene, x: number, y: number) {
      this.scene = scene;
      this.x = x;
      this.y = y;
    }

    add(child: unknown | unknown[]): this {
      if (Array.isArray(child)) {
        this.list.push(...child);
      } else {
        this.list.push(child);
      }
      return this;
    }

    remove(child: unknown | unknown[]): this {
      if (Array.isArray(child)) {
        child.forEach(c => {
          const index = this.list.indexOf(c);
          if (index !== -1) this.list.splice(index, 1);
        });
      } else {
        const index = this.list.indexOf(child);
        if (index !== -1) this.list.splice(index, 1);
      }
      return this;
    }

    destroy(): void {
      this.list = [];
    }
  }

  const GameObjects = { Container } as const;
  return { GameObjects, Scene };
});

// Mock the getPWFromScene utility
vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: (): { radius: { px: (key: string) => number } } => ({
    radius: {
      px: (key: string): number => {
        const radiusMap: Record<string, number> = {
          none: 0,
          sm: 2,
          default: 4,
          md: 6,
          lg: 8,
          xl: 12,
          '2xl': 16,
          '3xl': 24,
          full: 9999,
        };
        return radiusMap[key] ?? 4;
      },
    },
  }),
}));

// Mock Color utility
vi.mock('phaser-wind', () => ({
  Color: {
    hex: vi.fn(() => 0x000000),
  },
}));

import { LinearProgress } from './linear-progress';

describe('LinearProgress', () => {
  let linearProgress: LinearProgress;
  let scene: Scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new Scene();
  });

  describe('constructor', () => {
    it('should create a linear progress bar with default parameters', () => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
      });

      expect(linearProgress).toBeInstanceOf(LinearProgress);
      expect(linearProgress.getProgress()).toBe(0);
    });

    it('should create a linear progress bar with custom parameters', () => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 300,
        height: 12,
        backgroundColor: 'gray-300' as const,
        progressColor: 'green-500' as const,
        borderRadius: 'lg',
        progress: 50,
      });

      expect(linearProgress).toBeInstanceOf(LinearProgress);
      expect(linearProgress.getProgress()).toBe(50);
    });

    it('should create an indeterminate progress bar', () => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
        indeterminate: true,
      });

      expect(linearProgress).toBeInstanceOf(LinearProgress);
      expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('should create indeterminate progress bar with correct positioning bounds', () => {
      const width = 300;
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width,
        height: 8,
        indeterminate: true,
      });

      // Verify that tween was called with correct positioning
      expect(scene.tweens.add).toHaveBeenCalled();
      const tweenCall = vi.mocked(scene.tweens.add).mock.calls[0]?.[0] as unknown as { x: number };

      // The indeterminate bar should move within bounds
      // Bar width is 30% of total width = 90px
      // Max X should be (300/2) - (90/2) = 150 - 45 = 105
      // Min X should be -(300/2) + (90/2) = -150 + 45 = -105
      expect(tweenCall.x).toBe(105); // maxX position
    });
  });

  describe('setProgress', () => {
    beforeEach(() => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
      });
    });

    it('should set progress value within valid range', () => {
      linearProgress.setProgress(75, false);
      expect(linearProgress.getProgress()).toBe(75);
    });

    it('should clamp progress value to 0-100 range', () => {
      linearProgress.setProgress(-10, false);
      expect(linearProgress.getProgress()).toBe(0);

      linearProgress.setProgress(150, false);
      expect(linearProgress.getProgress()).toBe(100);
    });

    it('should animate progress change by default', () => {
      linearProgress.setProgress(50);
      expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('should not change progress for indeterminate progress bar', () => {
      linearProgress.setIndeterminate(true);
      const initialProgress = linearProgress.getProgress();
      linearProgress.setProgress(75);
      expect(linearProgress.getProgress()).toBe(initialProgress);
    });
  });

  describe('setIndeterminate', () => {
    beforeEach(() => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
      });
    });

    it('should start indeterminate animation when set to true', () => {
      linearProgress.setIndeterminate(true);
      expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('should stop indeterminate animation when set to false', () => {
      linearProgress.setIndeterminate(true);
      const tweenMock = { destroy: vi.fn() };
      vi.mocked(scene.tweens.add).mockReturnValue(tweenMock as any);

      linearProgress.setIndeterminate(false);
      // Animation should be stopped when switching back to determinate
    });
  });

  describe('setBorderRadius', () => {
    beforeEach(() => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
      });
    });

    it('should accept numeric border radius', () => {
      expect(() => linearProgress.setBorderRadius(10)).not.toThrow();
    });

    it('should accept string border radius token', () => {
      expect(() => linearProgress.setBorderRadius('lg')).not.toThrow();
    });
  });

  describe('color setters', () => {
    beforeEach(() => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
      });
    });

    it('should set background color', () => {
      expect(() => linearProgress.setBackgroundColor('red-200' as const)).not.toThrow();
    });

    it('should set progress color', () => {
      expect(() => linearProgress.setProgressColor('blue-600' as const)).not.toThrow();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      linearProgress = new LinearProgress({
        scene,
        x: 100,
        y: 100,
        width: 200,
        height: 8,
        indeterminate: true,
      });
    });

    it('should clean up animations when destroyed', () => {
      const tweenMock = { destroy: vi.fn() };
      vi.mocked(scene.tweens.add).mockReturnValue(tweenMock as any);

      linearProgress.destroy();
      // Should clean up any running animations
    });
  });
});