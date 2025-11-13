// Global mock for Phaser in tests
import { vi } from 'vitest';

// Mock Phaser globally first (must be before phaser-wind mock)
vi.mock('phaser', () => {
  class Scene { }

  type Positionable = { setPosition(x: number, y: number): void };

  class Container {
    public list: unknown[] = [];
    public x: number;
    public y: number;
    public width = 0;
    public height = 0;

    constructor(_scene: Scene, x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    add(child: Positionable | Positionable[]): this {
      if (Array.isArray(child)) {
        this.list.push(...child);
      } else {
        this.list.push(child);
      }
      return this;
    }

    setSize(width: number, height: number): this {
      this.width = width;
      this.height = height;
      return this;
    }
  }

  class Text {
    // Mock Text class for Phaser.GameObjects.Text
    // eslint-disable-next-line no-unused-vars
    constructor(..._args: unknown[]) { }
  }

  const GameObjects = { Container, Text } as const;
  const Phaser = { GameObjects, Scene };
  return { GameObjects, Scene, Phaser, default: Phaser };
});

// Mock phaser-wind globally (after Phaser mock)
vi.mock('phaser-wind', () => {
  return {
    Color: {
      rgb: vi.fn((color: string) => `rgb-${color}`),
      hex: vi.fn((color: string) => `hex-${color}`),
    },
    getDisplayWidthOf: vi.fn((child: { displayWidth?: number; width?: number; getBounds?: () => { width: number } }) => {
      if (typeof child.displayWidth === 'number') return child.displayWidth;
      if (typeof child.width === 'number') return child.width;
      const bounds = child.getBounds?.();
      return bounds ? bounds.width : 0;
    }),
    getDisplayHeightOf: vi.fn((child: { displayHeight?: number; height?: number; getBounds?: () => { height: number } }) => {
      if (typeof child.displayHeight === 'number') return child.displayHeight;
      if (typeof child.height === 'number') return child.height;
      const bounds = child.getBounds?.();
      return bounds ? bounds.height : 0;
    }),
    PhaserWindPlugin: class PhaserWindPlugin { },
    SceneWithPhaserWind: class SceneWithPhaserWind { },
  };
});