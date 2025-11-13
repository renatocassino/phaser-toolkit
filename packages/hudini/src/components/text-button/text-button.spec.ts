/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

// Mock phaser-wind
vi.mock('phaser-wind', () => ({
  Color: {
    rgb: vi.fn((color: string) => `rgb-${color}`),
    hex: vi.fn((color: string) => `hex-${color}`),
  },
}));

// Mock the getPWFromScene utility
vi.mock('../../utils/get-pw-from-scene', () => ({
  getPWFromScene: vi.fn(() => ({
    fontSize: {
      px: vi.fn((size: string) => {
        const sizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };
        return sizes[size as keyof typeof sizes] || 16;
      }),
    },
    spacing: {
      px: vi.fn((spacing: string) => {
        const spacings = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
        return spacings[spacing as keyof typeof spacings] || 12;
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
          sans: 'Arial, sans-serif',
          serif: 'Georgia, serif',
          mono: 'Courier, monospace',
        };
        return fonts[font as keyof typeof fonts] || 'Arial, sans-serif';
      }),
    },
  })),
}));

// Mock Phaser
vi.mock('phaser', () => {
  class MockText {
    private text: string;
    private style: Record<string, string | number>;

    constructor(
      _x: number,
      _y: number,
      text: string,
      style: Record<string, string | number>
    ) {
      this.text = text;
      this.style = style;
    }

    setText(text: string): this {
      this.text = text;
      return this;
    }

    setOrigin(): this {
      return this;
    }
    setFontSize(size: number): this {
      this.style['fontSize'] = size;
      return this;
    }
    setFontFamily(family: string): this {
      this.style['fontFamily'] = family;
      return this;
    }
    setColor(color: string): this {
      this.style['color'] = color;
      return this;
    }

    getBounds(): { width: number; height: number } {
      const charWidth = 10;
      const lineHeight = parseInt(this.style['fontSize'] as string) || 16;
      return {
        width: this.text.length * charWidth,
        height: lineHeight,
      };
    }
  }

  class MockSprite {
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _texture: string) { }
    setOrigin(): this {
      return this;
    }
    setInteractive(): this {
      return this;
    }
    setTexture(): this {
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

  class MockContainer {
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {
      this.scene = _scene;
    }
    add(): this {
      return this;
    }
    scene: Scene;
  }

  class Scene {
    add = {
      text: vi.fn((x, y, text, style) => new MockText(x, y, text, style)),
      sprite: vi.fn((x, y, texture) => new MockSprite(x, y, texture)),
      graphics: vi.fn(() => new MockGraphics()),
    };
    tweens = { add: vi.fn() };
  }

  class BasePlugin {
    constructor() { }
  }

  const GameObjects = { Container: MockContainer };
  const Plugins = { BasePlugin };
  return { GameObjects, Scene, Plugins };
});

import { TextButton } from './text-button';

describe('TextButton', () => {
  it('should create a TextButton instance', () => {
    const scene = new Scene();

    const textButton = new TextButton({
      scene,
      x: 100,
      y: 100,
      text: 'Click Me',
    });

    expect(textButton).toBeInstanceOf(TextButton);
  });

  it('should create with custom properties', () => {
    const scene = new Scene();

    const textButton = new TextButton({
      scene,
      x: 100,
      y: 100,
      text: 'Custom Button',
      fontSize: 'lg',
      color: 'red',
      textColor: 'white',
      borderRadius: 'lg',
      padding: '4',
    });

    expect(textButton).toBeInstanceOf(TextButton);
  });

  it('should support method chaining', () => {
    const scene = new Scene();
    const textButton = new TextButton({
      scene,
      x: 100,
      y: 100,
      text: 'Test',
    });

    const result = textButton
      .setText('Chained')
      .setFontSize('lg')
      .setColor('green')
      .setBorderRadius('lg')
      .setPadding('4');

    expect(result).toBe(textButton);
  });

  it('should handle borderRadius full correctly', () => {
    const scene = new Scene();

    const textButton = new TextButton({
      scene,
      x: 100,
      y: 100,
      text: 'Full Radius Test',
      borderRadius: 'full',
    });

    expect(textButton).toBeInstanceOf(TextButton);

    // Test setBorderRadius with 'full'
    const result = textButton.setBorderRadius('full');
    expect(result).toBe(textButton);
  });
});
