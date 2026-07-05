/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('phaser-wind', () => {
  class MockLayout {
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    addChild(): this {
      return this;
    }
    addChildren(): this {
      return this;
    }
    layout(): void {
      /* noop */
    }
  }
  return {
    Row: class extends MockLayout {},
    Column: class extends MockLayout {},
  };
});

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    spacing: {
      px: vi.fn((token: string) => {
        const map = { '0': 0, '1': 4, '2': 8, '4': 16, '6': 24 };
        return map[token as keyof typeof map] ?? 16;
      }),
    },
    radius: {
      px: vi.fn(() => 8),
    },
  })),
}));

vi.mock('../card', () => {
  class MockCard {
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    setSize(): this {
      return this;
    }
  }
  return { Card: MockCard };
});

vi.mock('phaser', () => {
  class Container {
    scene: Scene;
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this {
      return this;
    }
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
      return this;
    }
  }
  class Scene {}
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

import { Stack } from './stack';

describe('Stack', () => {
  it('should create a row Stack by default', () => {
    const scene = new Scene();
    const stack = new Stack({ scene, x: 0, y: 0 });
    expect(stack).toBeInstanceOf(Stack);
    expect(stack.background).toBeNull();
  });

  it('should create a column Stack when direction=column', () => {
    const scene = new Scene();
    const stack = new Stack({ scene, x: 0, y: 0, direction: 'column' });
    expect(stack).toBeInstanceOf(Stack);
  });

  it('should create a background Card when backgroundColor is set', () => {
    const scene = new Scene();
    const stack = new Stack({
      scene,
      x: 0,
      y: 0,
      backgroundColor: 'slate-800',
      padding: '4',
      borderRadius: 'lg',
    });
    expect(stack.background).not.toBeNull();
  });

  it('should NOT create a background when backgroundColor is omitted', () => {
    const scene = new Scene();
    const stack = new Stack({ scene, x: 0, y: 0, padding: '4' });
    expect(stack.background).toBeNull();
  });

  it('should expose the inner layout container', () => {
    const scene = new Scene();
    const stack = new Stack({ scene, x: 0, y: 0 });
    expect(stack.layoutContainer).toBeDefined();
  });

  it('should support method chaining on addChild', () => {
    const scene = new Scene();
    const stack = new Stack({ scene, x: 0, y: 0 });
    const fakeChild = {} as never;
    expect(stack.addChild(fakeChild)).toBe(stack);
  });
});
