/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { GameObjects, Scene } from 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Typed mock of 'phaser' to avoid canvas dependency
vi.mock('phaser', () => {
  class Scene { }

  type Positionable = { setPosition(x: number, y: number): void };

  class Container {
    public list: unknown[] = [];
    public x: number;
    public y: number;
    public width = 0;
    public height = 0;

    constructor(_scene: Scene, x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    add(child: Positionable | Positionable[]): this {
      if (Array.isArray(child)) {
        this.list.push(...child);
      } else {
        this.list.push(child);
      }
      return this;
    }

    setSize(width: number, height: number): this {
      this.width = width;
      this.height = height;
      return this;
    }
  }

  const GameObjects = { Container } as const;
  return { GameObjects, Scene };
});

import { Row } from './row';

class TestChild {
  public displayWidth?: number;
  public width?: number;
  public displayHeight?: number;
  public height?: number;
  public originX?: number;
  public originY?: number;
  public displayOriginX?: number;
  public displayOriginY?: number;

  public lastPosition: { x: number; y: number } | null = null;

  constructor(params: Partial<
    Pick<
      TestChild,
      | 'displayWidth'
      | 'width'
      | 'displayHeight'
      | 'height'
      | 'originX'
      | 'originY'
      | 'displayOriginX'
      | 'displayOriginY'
    >
  > = {}) {
    Object.assign(this, params);
  }

  setPosition(x: number, y: number): void {
    this.lastPosition = { x, y };
  }

  getBounds(): { width: number; height: number } {
    return {
      width: this.width ?? this.displayWidth ?? 0,
      height: this.height ?? this.displayHeight ?? 0,
    };
  }
}

let scene: Scene;

beforeEach(() => {
  scene = new Scene();
});

describe('Row layout', () => {
  it('centers children by default with horizontalOrigin center', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const row = new Row({ scene, x: 0, y: 0, gap: 10, align: 'center', horizontalOrigin: 'center', children: [] });
    row.addChildren([a, b] as unknown as GameObjects.GameObject[]);

    // totalWidth = 100 + 200 + 10 = 310; contentLeft = -155
    expect(a.lastPosition).toEqual({ x: -155 + 0.5 * 100, y: 0 }); // -105, 0
    expect(b.lastPosition).toEqual({ x: -45 + 0.5 * 200, y: 0 }); // 55, 0

    // width = totalWidth; height = max child height
    expect((row as unknown as { width: number }).width).toBe(310);
    expect((row as unknown as { height: number }).height).toBe(100);
  });

  it('align top positions children at content top edge', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const row = new Row({ scene, x: 0, y: 0, gap: 10, align: 'top', horizontalOrigin: 'center', children: [a, b] as unknown as GameObjects.GameObject[] });

    // maxHeight = 100
    expect(a.lastPosition?.y).toBe(-50 + 0.5 * 50); // -25
    expect(b.lastPosition?.y).toBe(-50 + 0.5 * 100); // 0

    expect((row as unknown as { width: number }).width).toBe(310);
    expect((row as unknown as { height: number }).height).toBe(100);
  });

  it('align bottom positions children at content bottom edge', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    new Row({ scene, x: 0, y: 0, gap: 10, align: 'bottom', horizontalOrigin: 'center', children: [a, b] as unknown as GameObjects.GameObject[] });

    expect(a.lastPosition?.y).toBe(50 - (1 - 0.5) * 50); // 25
    expect(b.lastPosition?.y).toBe(50 - (1 - 0.5) * 100); // 0
  });

  it('horizontalOrigin left places content starting at x=0', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const row = new Row({ scene, x: 0, y: 0, gap: 10, align: 'center', horizontalOrigin: 'left', children: [a, b] as unknown as GameObjects.GameObject[] });

    expect(a.lastPosition?.x).toBe(0 + 0.5 * 100); // 50
    expect(b.lastPosition?.x).toBe(110 + 0.5 * 200); // 210

    expect((row as unknown as { width: number }).width).toBe(310);
    expect((row as unknown as { height: number }).height).toBe(100);
  });

  it('respects per-child origin when computing alignment and positions', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50, originX: 0.0, originY: 0.0 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100, originX: 1.0, originY: 1.0 });

    // totalWidth = 310; left = 0 (horizontalOrigin left); maxHeight = 100
    new Row({ scene, x: 0, y: 0, gap: 10, align: 'top', horizontalOrigin: 'left', children: [a, b] as unknown as GameObjects.GameObject[] });

    // a: x = 0 + 0*100 = 0; y = -50 + 0*50 = -50
    expect(a.lastPosition).toEqual({ x: 0, y: -50 });
    // cursor = 0 + 100 + 10 = 110; b: x = 110 + 1*200 = 310; y = -50 + 1*100 = 50
    expect(b.lastPosition).toEqual({ x: 310, y: 50 });
  });

  it('setGap and setAlign trigger relayout', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const row = new Row({ scene, x: 0, y: 0, children: [a, b] as unknown as GameObjects.GameObject[] }); // default gap=8, align=center, horizontalOrigin=center

    // Initial container width with gap=8
    const initialWidth = (row as unknown as { width: number }).width;

    row.setGap(20); // triggers layout
    const afterWidth = (row as unknown as { width: number }).width;
    expect(afterWidth).toBe(initialWidth + (20 - 8));

    row.setAlign('top');
    // For align top, y positions as computed earlier with maxHeight=100
    expect(a.lastPosition?.y).toBe(-50 + 0.5 * 50); // -25
    expect(b.lastPosition?.y).toBe(-50 + 0.5 * 100); // 0
  });

  it('addChild/addChildren optionally avoid relayout when requested', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const row = new Row({ scene, x: 0, y: 0, children: [a] as unknown as GameObjects.GameObject[] });

    // b added without relayout
    row.addChild(b as unknown as GameObjects.GameObject, false);
    const before = b.lastPosition;
    expect(before).toBeNull();

    // layout computes positions
    row.layout();
    expect(b.lastPosition).not.toBeNull();
  });

  it('empty row has size 0,0', () => {
    const row = new Row({ scene, x: 0, y: 0, children: [] });
    expect((row as unknown as { width: number }).width).toBe(0);
    expect((row as unknown as { height: number }).height).toBe(0);
  });
});
