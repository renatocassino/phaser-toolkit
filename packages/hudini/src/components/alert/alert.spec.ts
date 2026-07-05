/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
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
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn((color: string) => `hex-${color}`),
    /* eslint-disable-next-line no-unused-vars */
    shift: vi.fn((token: string, _diff: number) => token),
    isValidColorToken: vi.fn(() => false),
  },
  Opacity: {
    value: vi.fn(() => 0.6),
  },
  isColorKey: vi.fn(() => false),
  palette: {
    red: {}, blue: {}, green: {}, yellow: {}, slate: {}, black: '#000', white: '#fff',
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
    spacing: {
      px: vi.fn(() => 16),
    },
    radius: {
      px: vi.fn(() => 8),
    },
    font: {
      family: vi.fn(() => 'Fredoka'),
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
    setInteractive(): this {
      return this;
    }
    setTexture(): this {
      return this;
    }
    setSize(w: number, h: number): this {
      this.width = w;
      this.height = h;
      return this;
    }
    on(): this {
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
  }
  class Scene {
    add = {
      existing: vi.fn(),
      sprite: vi.fn((x: number, y: number, t: string) => new MockSprite(x, y, t)),
      graphics: vi.fn(() => new MockGraphics()),
    };
  }
  const GameObjects = { Container };
  return { GameObjects, Scene };
});

import { Alert } from './alert';

describe('Alert', () => {
  it('should create with the info variant by default', () => {
    const scene = new Scene();
    const alert = new Alert({ scene, x: 0, y: 0, text: 'hello' });
    expect(alert).toBeInstanceOf(Alert);
  });

  it('should accept every semantic variant', () => {
    const scene = new Scene();
    const variants = ['success', 'error', 'warning', 'info', 'neutral'] as const;
    variants.forEach((variant) => {
      const alert = new Alert({ scene, x: 0, y: 0, text: 't', variant });
      expect(alert).toBeInstanceOf(Alert);
    });
  });

  it('should honor a custom color override', () => {
    const scene = new Scene();
    const alert = new Alert({
      scene,
      x: 0,
      y: 0,
      text: 't',
      variant: 'success',
      color: 'purple-600',
    });
    expect(alert).toBeInstanceOf(Alert);
  });

  it('should disable the default icon when leftIcon is explicitly null', () => {
    const scene = new Scene();
    const alert = new Alert({
      scene,
      x: 0,
      y: 0,
      text: 't',
      variant: 'success',
      leftIcon: null,
    });
    expect(alert.leftIconText).toBeUndefined();
  });

  it('should use the variant default leftIcon when leftIcon is omitted', () => {
    const scene = new Scene();
    const alert = new Alert({
      scene,
      x: 0,
      y: 0,
      text: 't',
      variant: 'success',
    });
    expect(alert.leftIconText).toBeDefined();
  });

  it('should return this for chaining on setters', () => {
    const scene = new Scene();
    const alert = new Alert({ scene, x: 0, y: 0, text: 't' });
    expect(alert.setText('new')).toBe(alert);
    expect(alert.setColor('red-500')).toBe(alert);
    expect(alert.setVariant('warning')).toBe(alert);
  });

  it('should support an optional onClick', () => {
    const scene = new Scene();
    const alert = new Alert({
      scene,
      x: 0,
      y: 0,
      text: 't',
      onClick: (): void => {
        /* noop */
      },
    });
    expect(alert).toBeInstanceOf(Alert);
  });
});
