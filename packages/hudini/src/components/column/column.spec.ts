/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { GameObjects, Scene } from 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock to phaser with type to avoid canvas dependency in runtime
vi.mock('phaser', () => {
  class Scene { }

  type Positionable = { setPosition(x: number, y: number): void };

  class Container {
    public list: unknown[] = [];
    public x: number;
    public y: number;
    public width = 0;
    public height = 0;

    // scene is accepted but not used in the mock
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

import { Column } from './column';

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

describe('Column layout', () => {
  it('centers children by default with verticalOrigin top', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const col = new Column({ scene, x: 0, y: 0, gap: 10, align: 'center', verticalOrigin: 'top', children: [] });
    col.addChildren([a, b] as unknown as GameObjects.GameObject[]);

    // After construction or addition, layout is applied
    expect(a.lastPosition).toEqual({ x: 0, y: 25 }); // 0 + 0.5*50
    expect(b.lastPosition).toEqual({ x: 0, y: 110 }); // (50 + 10) + 0.5*100

    // width = max child width; height = sum + gaps
    // maxWidth = 200; totalHeight = 50 + 100 + 10 = 160
    expect((col as unknown as { width: number }).width).toBe(200);
    expect((col as unknown as { height: number }).height).toBe(160);
  });

  it('align left positions children at content left edge', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const col = new Column({ scene, x: 0, y: 0, gap: 10, align: 'left', verticalOrigin: 'top', children: [a, b] as unknown as GameObjects.GameObject[] });

    // maxWidth = 200
    expect(a.lastPosition?.x).toBe(-50); // -maxWidth/2 + 0.5*100 = -100 + 50
    expect(b.lastPosition?.x).toBe(0);   // -100 + 0.5*200 = 0

    expect((col as unknown as { width: number }).width).toBe(200);
    expect((col as unknown as { height: number }).height).toBe(160);
  });

  it('align right positions children at content right edge', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    new Column({ scene, x: 0, y: 0, gap: 10, align: 'right', verticalOrigin: 'top', children: [a, b] as unknown as GameObjects.GameObject[] });

    expect(a.lastPosition?.x).toBe(50);  // +maxWidth/2 - (1-0.5)*100 = 100 - 50
    expect(b.lastPosition?.x).toBe(0);   // 100 - (1-0.5)*200 = 0
  });

  it('verticalOrigin center shifts content up by half height', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    // totalHeight = 50 + 100 + 10 = 160; top starts at -80
    new Column({ scene, x: 0, y: 0, gap: 10, align: 'center', verticalOrigin: 'center', children: [a, b] as unknown as GameObjects.GameObject[] });

    expect(a.lastPosition?.y).toBe(-80 + 0.5 * 50); // -55
    expect(b.lastPosition?.y).toBe(-80 + 50 + 10 + 0.5 * 100); // -80 + 60 + 50 = 30
  });

  it('respects per-child origin when computing alignment and positions', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50, originX: 0.0, originY: 0.0 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100, originX: 1.0, originY: 1.0 });

    // maxWidth = 200; totalHeight = 160; top = 0 (verticalOrigin top)
    new Column({ scene, x: 0, y: 0, gap: 10, align: 'left', verticalOrigin: 'top', children: [a, b] as unknown as GameObjects.GameObject[] });

    // a: x = -100 + 0*100 = -100; y = 0 + 0*50 = 0
    expect(a.lastPosition).toEqual({ x: -100, y: 0 });
    // cursor = 50 + 10 = 60; b: x = -100 + 1*200 = 100; y = 60 + 1*100 = 160
    expect(b.lastPosition).toEqual({ x: 100, y: 160 });
  });

  it('setGap and setAlign trigger relayout', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const col = new Column({ scene, x: 0, y: 0, children: [a, b] as unknown as GameObjects.GameObject[] }); // default gap=8, align=center, verticalOrigin=top

    // Initial state with gap=8
    expect(b.lastPosition?.y).toBe(50 + 8 + 50); // 108

    col.setGap(20); // changes layout
    expect(b.lastPosition?.y).toBe(50 + 20 + 50); // 120

    col.setAlign('left');
    // maxWidth=200 => a.x = -100 + 0.5*100 = -50; b.x = -100 + 0.5*200 = 0
    expect(a.lastPosition?.x).toBe(-50);
    expect(b.lastPosition?.x).toBe(0);
  });

  it('addChild/addChildren optionally avoid relayout when requested', () => {
    const a = new TestChild({ displayWidth: 100, displayHeight: 50 });
    const b = new TestChild({ displayWidth: 200, displayHeight: 100 });

    const col = new Column({ scene, x: 0, y: 0, children: [a] as unknown as GameObjects.GameObject[] });

    // b added without relayout
    col.addChild(b as unknown as GameObjects.GameObject, false);
    const before = b.lastPosition;
    expect(before).toBeNull();

    // When calling layout, positions are calculated
    col.layout();
    expect(b.lastPosition).not.toBeNull();
  });

  it('empty column has size 0,0', () => {
    const col = new Column({ scene, x: 0, y: 0, children: [] as unknown as GameObjects.GameObject[] });
    // After constructor, layout runs and sizes to 0,0
    expect((col as unknown as { width: number }).width).toBe(0);
    expect((col as unknown as { height: number }).height).toBe(0);
  });
});
