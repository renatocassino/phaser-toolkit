// Global mock for Phaser in tests
import { vi } from 'vitest';

// Mock Phaser globally
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

  const GameObjects = { Container } as const;
  return { GameObjects, Scene };
});