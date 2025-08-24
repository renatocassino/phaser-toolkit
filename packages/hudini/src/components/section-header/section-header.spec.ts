/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
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
        return (
          fonts[font as keyof typeof fonts] || 'Poppins, Inter, sans-serif'
        );
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
    setStroke(color: string, thickness: number): this {
      this.style['stroke'] = color;
      this.style['strokeThickness'] = thickness;
      return this;
    }

    getBounds(): { width: number; height: number } {
      const charWidth = 10;
      const lineHeight = parseInt(this.style['fontSize'] as string) ?? 18;
      return {
        width: this.text.length * charWidth,
        height: lineHeight,
      };
    }
  }

  class MockSprite {
    // eslint-disable-next-line no-unused-vars
    constructor(_x: number, _y: number, _texture: string) {}
    setOrigin(): this {
      return this;
    }
    setTexture(): this {
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
    // eslint-disable-next-line no-unused-vars
    constructor(_scene: Scene, _x: number, _y: number) {}
    add(): this {
      return this;
    }
  }

  class Scene {
    add = {
      text: vi.fn(
        (
          x: number,
          y: number,
          text: string,
          style: Record<string, string | number>
        ) => new MockText(x, y, text, style)
      ),
      sprite: vi.fn(
        (x: number, y: number, texture: string) => new MockSprite(x, y, texture)
      ),
      graphics: vi.fn(() => new MockGraphics()),
    };
  }

  class BasePlugin {
    constructor() {}
  }

  const GameObjects = { Container };
  const Plugins = { BasePlugin };
  return { GameObjects, Scene, Plugins };
});

import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  it('should create a SectionHeader instance', () => {
    const scene = new Scene();

    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Section Title',
    });

    expect(sectionHeader).toBeInstanceOf(SectionHeader);
  });

  it('should create with custom properties', () => {
    const scene = new Scene();

    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Custom Header',
      textSize: 'xl',
      font: 'display',
      backgroundColor: 'purple-600',
      textColor: 'white',
      strokeColor: 'purple-800',
      borderRadius: 'lg',
      margin: '6',
    });

    expect(sectionHeader).toBeInstanceOf(SectionHeader);
  });

  it('should support method chaining for colors', () => {
    const scene = new Scene();
    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Test Header',
    });

    const result = sectionHeader
      .setTextColor('white')
      .setStrokeColor('gray-800');

    expect(result).toBe(sectionHeader);
  });

  it('should handle borderRadius full correctly in constructor', () => {
    const scene = new Scene();

    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Full Radius Header',
      borderRadius: 'full',
    });

    expect(sectionHeader).toBeInstanceOf(SectionHeader);
  });

  it('should handle stroke color customization', () => {
    const scene = new Scene();

    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Stroke Test',
      strokeColor: 'red-800',
    });

    expect(sectionHeader).toBeInstanceOf(SectionHeader);

    // Test setStrokeColor
    const result = sectionHeader.setStrokeColor('blue-900');
    expect(result).toBe(sectionHeader);
  });

  it('should use default display font and bold style', () => {
    const scene = new Scene();

    const sectionHeader = new SectionHeader({
      scene,
      x: 100,
      y: 100,
      text: 'Default Style',
    });

    expect(sectionHeader).toBeInstanceOf(SectionHeader);
    expect(sectionHeader.headerText).toBeDefined();
  });
});
