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
    setScale(): this {
      return this;
    }
  }
  return { IconText };
});

vi.mock('../stack', () => {
  class MockStack {
    public width = 40;
    public height = 20;
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
  Duration: { ms: vi.fn(() => 100), seconds: vi.fn(() => 0.1), css: vi.fn(() => '100ms') },
  Ease: { value: vi.fn(() => 'Linear') },
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn(() => 0x3b82f6),
  },
  Opacity: {
    value: vi.fn(() => 0.1),
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
      px: vi.fn(() => 4),
    },
  })),
}));

vi.mock('../text', () => {
  class MockText {
    private text: string;
    public width = 60;
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
    lineStyle(): this {
      return this;
    }
    strokeRoundedRect(): this {
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

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('should default to unchecked', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0 });
    expect(cb.getValue()).toBe(false);
    expect(cb.isChecked()).toBe(false);
  });

  it('should honor the initial checked prop', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0, checked: true });
    expect(cb.getValue()).toBe(true);
  });

  it('should toggle', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0 });
    cb.toggle();
    expect(cb.isChecked()).toBe(true);
    cb.toggle();
    expect(cb.isChecked()).toBe(false);
  });

  it('should fire onChange with the new value and name', () => {
    const scene = new Scene();
    const changes: Array<[boolean, string | undefined]> = [];
    const cb = new Checkbox({
      scene,
      x: 0,
      y: 0,
      name: 'agree',
      onChange: (v, n): void => {
        changes.push([v, n]);
      },
    });
    cb.toggle();
    cb.toggle();
    expect(changes).toEqual([
      [true, 'agree'],
      [false, 'agree'],
    ]);
  });

  it('should NOT fire onChange when setChecked is called with the same value', () => {
    const scene = new Scene();
    let calls = 0;
    const cb = new Checkbox({
      scene,
      x: 0,
      y: 0,
      checked: true,
      onChange: (): void => { calls++; },
    });
    cb.setChecked(true);
    expect(calls).toBe(0);
    cb.setChecked(false);
    expect(calls).toBe(1);
  });

  it('should ignore toggles when disabled', () => {
    const scene = new Scene();
    let calls = 0;
    const cb = new Checkbox({
      scene,
      x: 0,
      y: 0,
      disabled: true,
      onChange: (): void => { calls++; },
    });
    // Simulate a click via the hit rect.
    (cb.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(calls).toBe(0);
    expect(cb.getValue()).toBe(false);
  });

  it('should ignore toggles when readOnly, but still fire onChange for programmatic setChecked', () => {
    const scene = new Scene();
    let calls = 0;
    const cb = new Checkbox({
      scene,
      x: 0,
      y: 0,
      readOnly: true,
      onChange: (): void => { calls++; },
    });
    (cb.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(calls).toBe(0);
    // Programmatic mutation still works.
    cb.setChecked(true);
    expect(calls).toBe(1);
    expect(cb.getValue()).toBe(true);
  });

  it('should support disable/enable shortcuts', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0 });
    expect(cb.isDisabled()).toBe(false);
    cb.disable();
    expect(cb.isDisabled()).toBe(true);
    cb.enable();
    expect(cb.isDisabled()).toBe(false);
  });

  it('should support setReadOnly / isReadOnly', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0 });
    cb.setReadOnly(true);
    expect(cb.isReadOnly()).toBe(true);
  });

  it('should allow replacing the onChange callback', () => {
    const scene = new Scene();
    let calls = 0;
    const cb = new Checkbox({ scene, x: 0, y: 0 });
    cb.onChange((): void => { calls++; });
    cb.toggle();
    expect(calls).toBe(1);
    cb.onChange(undefined);
    cb.toggle();
    expect(calls).toBe(1);
  });

  it('should fire onClick on interaction even when the state does not change', () => {
    const scene = new Scene();
    let clicks = 0;
    const cb = new Checkbox({
      scene,
      x: 0,
      y: 0,
      onClick: (): void => { clicks++; },
    });
    (cb.hitRect as unknown as { emit: (e: string) => void }).emit('pointerdown');
    expect(clicks).toBe(1);
  });

  it('should expose the name prop back through onChange', () => {
    const scene = new Scene();
    const cb = new Checkbox({ scene, x: 0, y: 0, name: 'sound' });
    expect(cb.name).toBe('sound');
  });
});
