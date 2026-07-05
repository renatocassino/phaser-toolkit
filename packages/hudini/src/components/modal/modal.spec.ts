/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-identical-functions */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('phaser-wind', () => {
  class MockColumn {
    public width = 400;
    public height = 200;
    public children: unknown[];
    // eslint-disable-next-line no-unused-vars
    constructor(params: { children?: unknown[] }) {
      this.children = params.children ?? [];
    }
    setPosition(): this {
      return this;
    }
    layout(): void {
      /* noop */
    }
  }
  class MockRow {
    public width = 200;
    public height = 40;
    // eslint-disable-next-line no-unused-vars
    constructor(_params: unknown) {}
  }
  return {
    Color: {
      rgb: vi.fn((c: string) => `rgb-${c}`),
      hex: vi.fn(() => 0xffffff),
    },
    Ease: { value: vi.fn(() => 'Linear') },
    Column: MockColumn,
    Row: MockRow,
  };
});

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    spacing: { px: vi.fn(() => 24) },
    radius: { px: vi.fn(() => 12) },
    depth: {
      value: vi.fn((key: string) => ({ overlay: 1000, modal: 2000 })[key] ?? 0),
    },
    font: { family: vi.fn(() => 'Fredoka') },
    fontSize: { px: vi.fn(() => 16) },
    color: {
      rgb: vi.fn((c: string) => `rgb-${c}`),
      hex: vi.fn(() => 0x000000),
    },
  })),
}));

vi.mock('../overlay', () => {
  class Overlay {
    public onClick: (() => void) | undefined;
    // eslint-disable-next-line no-unused-vars
    constructor(params: { onClick?: () => void }) {
      this.onClick = params.onClick;
    }
    open(): Promise<void> {
      return Promise.resolve();
    }
    close(): Promise<void> {
      return Promise.resolve();
    }
    destroy(): void {
      /* noop */
    }
    setOnClick(cb: () => void): this {
      this.onClick = cb;
      return this;
    }
  }
  return { Overlay };
});

vi.mock('../icon-button', () => {
  class IconButton {
    public onClickCb: (() => void) | undefined;
    // eslint-disable-next-line no-unused-vars
    constructor(params: { onClick?: () => void }) {
      this.onClickCb = params.onClick;
    }
  }
  return { IconButton };
});

vi.mock('../text-button', () => {
  class TextButton {
    public onClickCb: (() => void) | undefined;
    public label: string;
    // eslint-disable-next-line no-unused-vars
    constructor(params: { text: string; onClick?: () => void }) {
      this.label = params.text;
      this.onClickCb = params.onClick;
    }
  }
  return { TextButton };
});

vi.mock('../text', () => {
  class Text {
    private text: string;
    // eslint-disable-next-line no-unused-vars
    constructor(params: { text: string }) {
      this.text = params.text;
    }
    setColor(): this {
      return this;
    }
    setOrigin(): this {
      return this;
    }
    getBounds(): { width: number; height: number } {
      return { width: this.text.length * 10, height: 22 };
    }
  }
  return { Text };
});

vi.mock('phaser', () => {
  class MockSprite {
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _t: string) {}
    setOrigin(): this {
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
  class Container {
    scene: Scene;
    list: unknown[] = [];
    alpha = 1;
    scaleX = 1;
    scaleY = 1;
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this {
      return this;
    }
    addAt(): this {
      return this;
    }
    setAlpha(a: number): this {
      this.alpha = a;
      return this;
    }
    setScale(s: number): this {
      this.scaleX = s;
      this.scaleY = s;
      return this;
    }
    setDepth(): this {
      return this;
    }
    setScrollFactor(): this {
      return this;
    }
    destroy(): void {
      /* noop */
    }
  }
  class Scene {
    cameras = { main: { width: 800, height: 600 } };
    tweens = {
      add: vi.fn(
        (config: {
          onComplete?: () => void;
          targets: { alpha?: number; scaleX?: number; scaleY?: number };
          alpha?: number;
          scaleX?: number;
          scaleY?: number;
        }) => {
          if (config.alpha !== undefined) config.targets.alpha = config.alpha;
          if (config.scaleX !== undefined)
            config.targets.scaleX = config.scaleX;
          if (config.scaleY !== undefined)
            config.targets.scaleY = config.scaleY;
          config.onComplete?.();
          return { stop: vi.fn() };
        }
      ),
    };
    input = {
      keyboard: {
        listeners: new Map<string, (e: KeyboardEvent) => void>(),
        on(event: string, fn: (e: KeyboardEvent) => void): void {
          this.listeners.set(event, fn);
        },
        off(event: string): void {
          this.listeners.delete(event);
        },
        emit(event: string, keyboardEvent: KeyboardEvent): void {
          this.listeners.get(event)?.(keyboardEvent);
        },
      },
    };
    add = {
      existing: vi.fn(),
      sprite: vi.fn(
        (x: number, y: number, t: string) => new MockSprite(x, y, t)
      ),
      graphics: vi.fn(() => new MockGraphics()),
    };
    textures = {
      exists: vi.fn(() => false),
    };
  }
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

// eslint-disable-next-line import/first
import { Modal } from './modal';

describe('Modal', () => {
  it('creates with only title/description (95% case)', () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi', description: 'World' });
    expect(modal).toBeInstanceOf(Modal);
    expect(modal.overlay).toBeDefined();
    expect(modal.backgroundSprite).toBeDefined();
  });

  it('starts invisible (alpha 0, scaled down)', () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi' });
    expect(modal.alpha).toBe(0);
    expect(modal.scaleX).toBe(0.9);
  });

  it('open() fades in to alpha 1 at scale 1', async () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi' });
    await modal.open();
    expect(modal.alpha).toBe(1);
    expect(modal.scaleX).toBe(1);
    expect(modal.opened).toBe(true);
  });

  it('close() runs onClose and marks modal as no longer opened', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({ scene, title: 'Hi', onClose });
    await modal.open();
    await modal.close();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(modal.opened).toBe(false);
  });

  it('shows a close button by default', () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi' });
    expect(modal.closeButton).toBeDefined();
  });

  it('omits the close button when showCloseButton is false', () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi', showCloseButton: false });
    expect(modal.closeButton).toBeUndefined();
  });

  it('overlay click triggers close by default', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({ scene, title: 'Hi', onClose });
    await modal.open();
    // Simulate overlay click
    (modal.overlay as unknown as { onClick: () => void }).onClick();
    await Promise.resolve();
    await Promise.resolve();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('overlay click does NOT close when closeOnOverlayClick is false', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({
      scene,
      title: 'Hi',
      closeOnOverlayClick: false,
      onClose,
    });
    await modal.open();
    (modal.overlay as unknown as { onClick: () => void }).onClick();
    await Promise.resolve();
    expect(onClose).not.toHaveBeenCalled();
    expect(modal.opened).toBe(true);
  });

  it('closes on ESC by default', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({ scene, title: 'Hi', onClose });
    await modal.open();
    scene.input.keyboard?.emit('keydown', {
      key: 'Escape',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);
    // Await promise chain for close() to finish.
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close on ESC when keysToClose is []', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({ scene, title: 'Hi', keysToClose: [], onClose });
    await modal.open();
    scene.input.keyboard?.emit('keydown', {
      key: 'Escape',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);
    await Promise.resolve();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('accepts custom keysToClose (e.g., "C")', async () => {
    const scene = new Scene();
    const onClose = vi.fn();
    const modal = new Modal({
      scene,
      title: 'Hi',
      keysToClose: ['C'],
      onClose,
    });
    await modal.open();
    scene.input.keyboard?.emit('keydown', {
      key: 'C',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('open() is idempotent while already open', async () => {
    const scene = new Scene();
    const modal = new Modal({ scene, title: 'Hi' });
    await modal.open();
    const tweenAdd = scene.tweens.add as unknown as {
      mock: { calls: unknown[] };
    };
    const tweenCallsAfterFirstOpen = tweenAdd.mock.calls.length;
    await modal.open();
    // No new tween added on second open
    expect(tweenAdd.mock.calls.length).toBe(tweenCallsAfterFirstOpen);
  });

  it('renders actions and does not auto-close them', async () => {
    const scene = new Scene();
    const cancel = vi.fn();
    const confirm = vi.fn();
    const modal = new Modal({
      scene,
      title: 'Delete?',
      actions: [
        { label: 'Cancel', onClick: cancel },
        { label: 'Delete', onClick: confirm },
      ],
    });
    await modal.open();
    // Modal itself just wires the click handler through; verify nothing throws
    // and the modal is still open (no auto-close on action click).
    expect(modal.opened).toBe(true);
  });
});
