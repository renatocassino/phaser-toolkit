/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { Scene } from 'phaser';
import { describe, expect, it, vi } from 'vitest';

// Mock the getPWFromScene utility
vi.mock('../../utils/get-pw-from-scene', () => ({
    getPWFromScene: vi.fn(() => ({
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
            style: Record<string, string | number> = {}
        ) {
            this.text = text;
            this.style = { fontSize: '18px', ...style };
        }

        setText(text: string): this {
            this.text = text;
            return this;
        }

        setPosition(): this {
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

    class MockGraphics {
        clear(): this {
            return this;
        }
        fillStyle(): this {
            return this;
        }
        fillRoundedRect(): this {
            return this;
        }
    }

    class Container {
        // eslint-disable-next-line no-unused-vars
        constructor(_scene: Scene, _x: number, _y: number) { }
        add(): this {
            return this;
        }
        remove(): this {
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
            graphics: vi.fn(() => new MockGraphics()),
        };
    }

    class BasePlugin {
        constructor() { }
    }

    const GameObjects = { Container };
    const Plugins = { BasePlugin };
    return { GameObjects, Scene, Plugins };
});

import { Card } from './card';

describe('Card', () => {
    it('should create a Card instance', () => {
        const scene = new Scene();
        const child = scene.add.text(0, 0, 'Test Content');

        const card = new Card({
            scene,
            x: 100,
            y: 100,
            child,
        });

        expect(card).toBeInstanceOf(Card);
    });

    it('should create with custom properties', () => {
        const scene = new Scene();
        const child = scene.add.text(0, 0, 'Custom Card');

        const card = new Card({
            scene,
            x: 100,
            y: 100,
            backgroundColor: 'blue-500',
            borderRadius: 'lg',
            margin: '6',
            child,
        });

        expect(card).toBeInstanceOf(Card);
    });

    it('should support method chaining', () => {
        const scene = new Scene();
        const child = scene.add.text(0, 0, 'Chained Card');

        const card = new Card({
            scene,
            x: 100,
            y: 100,
            child,
        });

        const result = card
            .setBackgroundColor('green-500')
            .setBorderRadius('xl')
            .setMargin('8');

        expect(result).toBe(card);
    });

    it('should adapt to child size', () => {
        const scene = new Scene();
        const child = scene.add.text(0, 0, 'Adaptive Content');

        const card = new Card({
            scene,
            x: 100,
            y: 100,
            margin: '4',
            child,
        });

        expect(card.child).toBe(child);
    });

    it('should handle child replacement', () => {
        const scene = new Scene();
        const child1 = scene.add.text(0, 0, 'First Child');
        const child2 = scene.add.text(0, 0, 'Second Child');

        const card = new Card({
            scene,
            x: 100,
            y: 100,
            child: child1,
        });

        const result = card.setChild(child2);
        expect(result).toBe(card);
        expect(card.child).toBe(child2);
    });
});
