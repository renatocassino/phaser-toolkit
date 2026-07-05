/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

vi.mock('hudini', () => ({
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn((color: string) => `hex-${color}`),
    black: vi.fn(() => 'rgb(0, 0, 0)'),
    white: vi.fn(() => 'rgb(255, 255, 255)'),
  },
  Opacity: {
    value: vi.fn(() => 0.9),
  },
}));

vi.mock('phaser-wind', () => ({
  Duration: { ms: vi.fn(() => 100), seconds: vi.fn(() => 0.1), css: vi.fn(() => '100ms') },
  Ease: { value: vi.fn(() => 'Linear') },
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn((color: string) => `hex-${color}`),
    shift: vi.fn((token: string) => token),
    isValidColorToken: vi.fn(() => false),
  },
  Opacity: {
    value: vi.fn(() => 0.6),
    percent: vi.fn(() => 60),
    css: vi.fn(() => '60%'),
  },
  isColorKey: vi.fn(() => false),
  palette: {
    red: {}, blue: {}, green: {}, purple: {}, amber: {},
    slate: {}, gray: {}, zinc: {}, neutral: {}, stone: {},
    orange: {}, yellow: {}, lime: {}, emerald: {}, teal: {},
    cyan: {}, sky: {}, indigo: {}, violet: {}, fuchsia: {},
    pink: {}, rose: {},
    black: '#000',
    white: '#fff',
  },
  PHASER_WIND_KEY: 'PhaserWind',
  SceneWithPhaserWind: class SceneWithPhaserWind { },
}));

vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    fontSize: {
      px: vi.fn((size: string) => {
        const sizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };
        return sizes[size as keyof typeof sizes] || 18;
      }),
    },
    spacing: {
      px: vi.fn((spacing: string) => {
        const spacings = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
        return spacings[spacing as keyof typeof spacings] || 16;
      }),
    },
    radius: {
      px: vi.fn((radius: string) => {
        const radiuses = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
        return radiuses[radius as keyof typeof radiuses] || 8;
      }),
    },
    font: {
      family: vi.fn((font: string) => {
        const fonts = {
          primary: 'Inter, sans-serif',
          secondary: 'Roboto, Arial, sans-serif',
          monospace: 'Courier, monospace',
          display: 'Poppins, Inter, sans-serif',
        };
        return fonts[font as keyof typeof fonts] || 'Fredoka';
      }),
    },
  })),
}));

vi.mock('../text', () => {
  class MockText {
    private text: string;
    private style: Record<string, string | number>;

    constructor(params: { scene: unknown; x: number; y: number; text: string; size?: number; fontFamily?: string }) {
      this.text = params.text;
      this.style = {
        fontSize: params.size ?? 22,
        fontFamily: params.fontFamily ?? 'Fredoka',
      };
    }

    setText(text: string): this {
      this.text = text;
      return this;
    }
    setOrigin(): this { return this; }
    setFontSize(size: number): this { this.style['fontSize'] = size; return this; }
    setFontFamily(family: string): this { this.style['fontFamily'] = family; return this; }
    setColor(color: string): this { this.style['color'] = color; return this; }

    getBounds(): { width: number; height: number } {
      const charWidth = 10;
      const lineHeight = parseInt(this.style['fontSize'] as string) || 18;
      return {
        width: this.text.length * charWidth,
        height: lineHeight,
      };
    }
  }

  return { Text: MockText };
});

vi.mock('phaser', () => {
  class MockSprite {
    public width = 0;
    public height = 0;
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _texture: string) { }
    setOrigin(): this { return this; }
    setTexture(): this { return this; }
    setSize(width: number, height: number): this {
      this.width = width;
      this.height = height;
      return this;
    }
    on(): this { return this; }
  }

  class MockGraphics {
    fillStyle(): this { return this; }
    fillRoundedRect(): this { return this; }
    generateTexture(): this { return this; }
    destroy(): this { return this; }
  }

  class Container {
    scene: Scene;
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this { return this; }
    setSize(): this { return this; }
    on(): this { return this; }
  }

  class Scene {
    add = {
      sprite: vi.fn((x: number, y: number, texture: string) => new MockSprite(x, y, texture)),
      graphics: vi.fn(() => new MockGraphics()),
    };
  }

  class BasePlugin { constructor() { } }

  const GameObjects = { Container };
  const Plugins = { BasePlugin };
  return { GameObjects, Scene, Plugins };
});

import { Badge } from './badge';

describe('Badge', () => {
  it('should create a Badge instance', () => {
    const scene = new Scene();
    const badge = new Badge({ scene, x: 100, y: 100, text: 'New' });
    expect(badge).toBeInstanceOf(Badge);
  });

  it('should create with custom properties', () => {
    const scene = new Scene();
    const badge = new Badge({
      scene,
      x: 100,
      y: 100,
      text: 'Custom',
      fontSize: 'xl',
      font: 'display',
      color: 'purple-600',
      textColor: 'white',
      borderRadius: 'lg',
      padding: '6',
    });
    expect(badge).toBeInstanceOf(Badge);
  });

  it('should support method chaining for colors', () => {
    const scene = new Scene();
    const badge = new Badge({ scene, x: 0, y: 0, text: 'X' });
    const result = badge.setTextColor('white').setColor('blue-600');
    expect(result).toBe(badge);
  });

  it('should handle borderRadius full correctly', () => {
    const scene = new Scene();
    const badge = new Badge({
      scene,
      x: 0,
      y: 0,
      text: 'Full',
      borderRadius: 'full',
    });
    expect(badge).toBeInstanceOf(Badge);
  });

  it('should expose the internal text object', () => {
    const scene = new Scene();
    const badge = new Badge({ scene, x: 0, y: 0, text: 'Hi' });
    expect(badge.badgeText).toBeDefined();
  });
});
