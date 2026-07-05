/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-identical-functions */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('font-awesome-for-phaser', () => {
  class IconText {
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    setFontStyle(): this {
      return this;
    }
    setOrigin(): this {
      return this;
    }
    setColor(): this {
      return this;
    }
    setAlpha(): this {
      return this;
    }
  }
  return { IconText };
});

vi.mock('../stack', () => {
  class MockStack {
    public width = 50;
    public height = 24;
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
    layout(): void {
      /* noop */
    }
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
      return this;
    }
  }
  return { Stack: MockStack };
});

vi.mock('phaser-wind', () => ({
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn(() => 0x22c55e),
  },
}));

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    fontSize: {
      px: vi.fn((size: string) => {
        const sizes = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20 };
        return sizes[size as keyof typeof sizes] || 16;
      }),
    },
    radius: {
      px: vi.fn(() => 9999),
    },
  })),
}));

vi.mock('../text', () => {
  class MockText {
    private text: string;
    // eslint-disable-next-line no-unused-vars
    constructor(params: { text: string }) {
      this.text = params.text;
    }
    setText(t: string): this {
      this.text = t;
      return this;
    }
    setOrigin(): this {
      return this;
    }
    setColor(): this {
      return this;
    }
    setAlpha(): this {
      return this;
    }
    getBounds(): { width: number; height: number } {
      return { width: this.text.length * 10, height: 18 };
    }
  }
  return { Text: MockText };
});

vi.mock('phaser', () => {
  class MockSprite {
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _texture: string) {}
    setOrigin(): this {
      return this;
    }
    setTexture(): this {
      return this;
    }
    setAlpha(): this {
      return this;
    }
  }
  class MockRectangle {
    public width = 0;
    public height = 0;
    public listeners: Record<string, Array<() => void>> = {};
    constructor(
      _x: number,
      _y: number,
      w: number,
      h: number,
      // eslint-disable-next-line no-unused-vars
      _c: number,
      // eslint-disable-next-line no-unused-vars
      _a: number
    ) {
      this.width = w;
      this.height = h;
    }
    setOrigin(): this {
      return this;
    }
    setInteractive(): this {
      return this;
    }
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
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
  class MockGraphics {
    fillStyle(): this {
      return this;
    }
    fillRoundedRect(): this {
      return this;
    }
    generateTexture(): this {
      return this;
    }
    destroy(): this {
      return this;
    }
  }
  class MockInnerContainer {
    public width = 0;
    public height = 0;
    public x = 0;
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
    list: unknown[] = [];
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this {
      return this;
    }
    remove(): this {
      return this;
    }
    addAt(): this {
      return this;
    }
    setSize(): this {
      return this;
    }
  }
  class Scene {
    tweens = {
      add: vi.fn(),
      killTweensOf: vi.fn(),
    };
    textures = {
      exists: vi.fn(() => false),
    };
    add = {
      existing: vi.fn(),
      sprite: vi.fn(
        (x: number, y: number, texture: string) => new MockSprite(x, y, texture)
      ),
      rectangle: vi.fn(
        (
          x: number,
          y: number,
          w: number,
          h: number,
          c: number,
          a: number
        ) => new MockRectangle(x, y, w, h, c, a)
      ),
      graphics: vi.fn(() => new MockGraphics()),
      container: vi.fn(
        (x: number, y: number, children: unknown[]) =>
          new MockInnerContainer(x, y, children)
      ),
    };
  }
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

import { Toggle } from './toggle';

describe('Toggle', () => {
  it('should default to unchecked', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0 });
    expect(t.getValue()).toBe(false);
    expect(t.isChecked()).toBe(false);
  });

  it('should honor the initial checked prop', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0, checked: true });
    expect(t.getValue()).toBe(true);
  });

  it('should toggle', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0 });
    t.toggle();
    expect(t.isChecked()).toBe(true);
    t.toggle();
    expect(t.isChecked()).toBe(false);
  });

  it('should fire onChange with the new value + name', () => {
    const scene = new Scene();
    const changes: Array<[boolean, string | undefined]> = [];
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      name: 'dark',
      onChange: (v, n): void => {
        changes.push([v, n]);
      },
    });
    t.toggle();
    t.toggle();
    expect(changes).toEqual([
      [true, 'dark'],
      [false, 'dark'],
    ]);
  });

  it('should NOT fire onChange when setChecked is called with the same value', () => {
    const scene = new Scene();
    let calls = 0;
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      checked: true,
      onChange: (): void => {
        calls++;
      },
    });
    t.setChecked(true);
    expect(calls).toBe(0);
    t.setChecked(false);
    expect(calls).toBe(1);
  });

  it('should ignore clicks when disabled', () => {
    const scene = new Scene();
    let calls = 0;
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      disabled: true,
      onChange: (): void => {
        calls++;
      },
    });
    (t.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(calls).toBe(0);
    expect(t.getValue()).toBe(false);
  });

  it('should ignore clicks when readOnly but still allow programmatic setChecked', () => {
    const scene = new Scene();
    let calls = 0;
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      readOnly: true,
      onChange: (): void => {
        calls++;
      },
    });
    (t.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(calls).toBe(0);
    t.setChecked(true);
    expect(calls).toBe(1);
  });

  it('should support disable/enable shortcuts', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0 });
    t.disable();
    expect(t.isDisabled()).toBe(true);
    t.enable();
    expect(t.isDisabled()).toBe(false);
  });

  it('should support setReadOnly / isReadOnly', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0 });
    t.setReadOnly(true);
    expect(t.isReadOnly()).toBe(true);
  });

  it('should create both onIcon and offIcon by default', () => {
    const scene = new Scene();
    const t = new Toggle({ scene, x: 0, y: 0 });
    expect(t.onIconText).toBeDefined();
    expect(t.offIconText).toBeDefined();
  });

  it('should skip an icon when explicitly set to null', () => {
    const scene = new Scene();
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      onIcon: null,
      offIcon: null,
    });
    expect(t.onIconText).toBeUndefined();
    expect(t.offIconText).toBeUndefined();
  });

  it('should fire onClick even when the state does not change internally', () => {
    const scene = new Scene();
    let clicks = 0;
    const t = new Toggle({
      scene,
      x: 0,
      y: 0,
      onClick: (): void => {
        clicks++;
      },
    });
    (t.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(clicks).toBe(1);
  });

  it('should allow replacing the onChange callback', () => {
    const scene = new Scene();
    let calls = 0;
    const t = new Toggle({ scene, x: 0, y: 0 });
    t.onChange((): void => {
      calls++;
    });
    t.toggle();
    expect(calls).toBe(1);
    t.onChange(undefined);
    t.toggle();
    expect(calls).toBe(1);
  });
});
