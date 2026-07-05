/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-identical-functions */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('phaser-wind', () => ({
  Color: {
    rgb: vi.fn((c: string) => `rgb-${c}`),
    hex: vi.fn(() => 0x000000),
  },
  Duration: { ms: vi.fn(() => 200), seconds: vi.fn(() => 0.2), css: vi.fn(() => '200ms') },
  Ease: { value: vi.fn(() => 'Linear') },
}));

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    depth: {
      value: vi.fn((key: string) => ({ overlay: 1000, modal: 2000 }[key] ?? 0)),
    },
  })),
}));

vi.mock('phaser', () => {
  class MockRectangle {
    public alpha = 1;
    private handlers = new Map<string, Array<(...a: unknown[]) => void>>();
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _w: number, _h: number, _fill: number) {}
    setScrollFactor(): this {
      return this;
    }
    setAlpha(a: number): this {
      this.alpha = a;
      return this;
    }
    setDepth(): this {
      return this;
    }
    setInteractive(): this {
      return this;
    }
    on(event: string, fn: (...a: unknown[]) => void): this {
      const list = this.handlers.get(event) ?? [];
      list.push(fn);
      this.handlers.set(event, list);
      return this;
    }
    emit(event: string, ...args: unknown[]): void {
      (this.handlers.get(event) ?? []).forEach((fn) => fn(...args));
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
    setDepth(): this {
      return this;
    }
    destroy(): void {
      /* noop */
    }
  }
  class Scene {
    cameras = {
      main: { width: 800, height: 600 },
    };
    tweens = {
      add: vi.fn(
        (config: { onComplete?: () => void; targets: { alpha: number }; alpha: number }) => {
          // Simulate immediate completion.
          config.targets.alpha = config.alpha;
          config.onComplete?.();
          return { stop: vi.fn() };
        }
      ),
    };
    add = {
      existing: vi.fn(),
      rectangle: vi.fn(
        (x: number, y: number, w: number, h: number, f: number) =>
          new MockRectangle(x, y, w, h, f)
      ),
    };
  }
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

// eslint-disable-next-line import/first
import { Overlay } from './overlay';

describe('Overlay', () => {
  it('creates a rectangle sized to the main camera', () => {
    const scene = new Scene();
    const overlay = new Overlay({ scene });
    expect(scene.add.rectangle).toHaveBeenCalledWith(400, 300, 800, 600, 0x000000);
    expect(overlay.rect.alpha).toBe(0);
  });

  it('open() fades to the target alpha', async () => {
    const scene = new Scene();
    const overlay = new Overlay({ scene, alpha: 0.7 });
    await overlay.open();
    expect(overlay.rect.alpha).toBe(0.7);
  });

  it('close() fades back to 0', async () => {
    const scene = new Scene();
    const overlay = new Overlay({ scene, alpha: 0.6 });
    await overlay.open();
    await overlay.close();
    expect(overlay.rect.alpha).toBe(0);
  });

  it('invokes onClick when the rect is clicked and interactive is true', () => {
    const scene = new Scene();
    const onClick = vi.fn();
    const overlay = new Overlay({ scene, onClick });
    // Emit through the mocked rectangle
    (overlay.rect as unknown as { emit: (event: string) => void }).emit('pointerdown');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT attach a pointerdown handler when interactive is false', () => {
    const scene = new Scene();
    const onClick = vi.fn();
    const overlay = new Overlay({ scene, interactive: false, onClick });
    (overlay.rect as unknown as { emit: (event: string) => void }).emit('pointerdown');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('setOnClick swaps the handler', () => {
    const scene = new Scene();
    const first = vi.fn();
    const second = vi.fn();
    const overlay = new Overlay({ scene, onClick: first });
    overlay.setOnClick(second);
    (overlay.rect as unknown as { emit: (event: string) => void }).emit('pointerdown');
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
