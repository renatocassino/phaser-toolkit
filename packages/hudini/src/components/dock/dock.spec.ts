/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-identical-functions */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('phaser-wind', () => ({
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
  },
}));

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    fontSize: {
      px: vi.fn((key: string) => {
        const map: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24 };
        return map[key] ?? 16;
      }),
    },
  })),
}));

vi.mock('font-awesome-for-phaser', () => {
  class IconText {
    public style: Record<string, unknown> = {};
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    setFontStyle(): this {
      return this;
    }
    setOrigin(): this {
      return this;
    }
    setColor(c: string): this {
      this.style['color'] = c;
      return this;
    }
  }
  return { IconText };
});

vi.mock('../stack', () => {
  class MockStack {
    public width = 100;
    public height = 40;
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
      return this;
    }
  }
  return { Stack: MockStack };
});

vi.mock('phaser', () => {
  class MockText {
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _t: string, _s: unknown) {}
    setOrigin(): this {
      return this;
    }
    setColor(): this {
      return this;
    }
  }
  class MockRectangle {
    public listeners: Record<string, Array<() => void>> = {};
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _w: number, _h: number, _c: number, _a: number) {}
    setOrigin(): this {
      return this;
    }
    setInteractive(): this {
      return this;
    }
    on(evt: string, cb: () => void): this {
      (this.listeners[evt] ||= []).push(cb);
      return this;
    }
    emit(evt: string): this {
      (this.listeners[evt] ?? []).forEach((cb) => cb());
      return this;
    }
  }
  class MockInnerContainer {
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _children: unknown[]) {}
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
      return this;
    }
  }
  class Container {
    scene: Scene;
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this {
      return this;
    }
    setSize(): this {
      return this;
    }
  }
  class Scene {
    add = {
      existing: vi.fn(),
      text: vi.fn((x: number, y: number, t: string, s: unknown) => new MockText(x, y, t, s)),
      rectangle: vi.fn(
        (x: number, y: number, w: number, h: number, c: number, a: number) =>
          new MockRectangle(x, y, w, h, c, a)
      ),
      container: vi.fn((x: number, y: number, children: unknown[]) => new MockInnerContainer(x, y, children)),
    };
  }
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

import { Dock, type DockItem } from './dock';

const items: DockItem[] = [
  { id: 'home', icon: 'house', label: 'Home' },
  { id: 'search', icon: 'magnifying-glass', label: 'Search' },
  { id: 'profile', icon: 'user', label: 'Profile' },
];

describe('Dock', () => {
  it('should create a Dock instance', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items });
    expect(dock).toBeInstanceOf(Dock);
  });

  it('should return the initial active id via getActiveItem', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items, active: 'home' });
    expect(dock.getActiveItem()).toBe('home');
  });

  it('should update active id via setActiveItem', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items, active: 'home' });
    dock.setActiveItem('search');
    expect(dock.getActiveItem()).toBe('search');
  });

  it('should support chaining on setActiveItem', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items });
    expect(dock.setActiveItem('profile')).toBe(dock);
  });

  it('should silently ignore setActiveItem for an unknown id (still updates internal state)', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items });
    dock.setActiveItem('does-not-exist');
    expect(dock.getActiveItem()).toBe('does-not-exist');
  });

  it('should be constructable without a background', () => {
    const scene = new Scene();
    const dock = new Dock({ scene, x: 0, y: 0, items });
    expect(dock).toBeInstanceOf(Dock);
  });
});
