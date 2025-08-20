import { GameObjects, Scene } from 'phaser';

const DEFAULT_GAP = 8;

export type HorizontalAlign = 'left' | 'center' | 'right';

export type ColumnParams = {
  scene: Scene;
  x: number;
  y: number;
  gap?: number;
  align?: HorizontalAlign;
  children?: GameObjects.GameObject[];
  verticalOrigin?: 'top' | 'center' | 'bottom';
};

/**
 * Column is a layout container that stacks children vertically with a gap.
 * The container position (x, y) represents the center of the whole column.
 */
export class Column extends GameObjects.Container {
  private gap: number;
  private align: HorizontalAlign;
  private verticalOrigin: 'top' | 'center' | 'bottom';

  constructor({
    scene,
    x,
    y,
    gap = DEFAULT_GAP,
    align = 'center',
    children = [],
    verticalOrigin = 'top',
  }: ColumnParams) {
    super(scene, x, y);

    this.gap = gap;
    this.align = align;
    this.verticalOrigin = verticalOrigin;
    if (children.length > 0) {
      this.add(children);
    }

    this.layout();
  }

  /** Sets the spacing (in pixels) between children and relayouts */
  public setGap(gap: number): void {
    this.gap = gap;
    this.layout();
  }

  /** Sets the horizontal alignment and relayouts */
  public setAlign(align: HorizontalAlign): void {
    this.align = align;
    this.layout();
  }

  /** Adds a child and optionally relayouts (default: true) */
  public addChild(child: GameObjects.GameObject, relayout: boolean = true): this {
    this.add(child);
    if (relayout) this.layout();
    return this;
  }

  /** Adds multiple children and optionally relayouts (default: true) */
  public addChildren(children: GameObjects.GameObject[], relayout: boolean = true): this {
    if (children.length > 0) this.add(children);
    if (relayout) this.layout();
    return this;
  }

  /** Recomputes children's positions and updates this container size */
  public layout(): void {
    const children = this.list as GameObjects.GameObject[];
    if (children.length === 0) {
      // Reset size when empty
      this.setSize(0, 0);
      return;
    }

    // Measure sizes
    const sizes = children.map((child) => ({
      width: this.getDisplayWidth(child),
      height: this.getDisplayHeight(child),
    }));

    const maxWidth = sizes.reduce((m, s) => Math.max(m, s.width), 0);
    const totalHeight = sizes.reduce((sum, s) => sum + s.height, 0) + this.gap * (sizes.length - 1);

    // Position vertically centered
    let cursorY = this.verticalOrigin === 'top' ? 0 : this.verticalOrigin === 'center' ? -totalHeight / 2 : totalHeight - totalHeight / 2;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const { width, height } = sizes[i];

      // Horizontal alignment
      let x = 0;
      if (this.align === 'left') {
        x = -(maxWidth - width) / 2;
      } else if (this.align === 'right') {
        x = (maxWidth - width) / 2;
      } else {
        x = 0; // center
      }

      const y = cursorY + height / 2;

      child.setPosition(x, y);

      cursorY += height + this.gap;
    }

    // Update this container size to match content bounds
    this.setSize(maxWidth, totalHeight);
  }

  private getDisplayWidth(child: GameObjects.GameObject): number {
    // Prefer displayWidth when available, fall back to width/bounds
    const anyChild = child as unknown as { displayWidth?: number; width?: number };
    if (typeof anyChild.displayWidth === 'number') return anyChild.displayWidth;
    if (typeof anyChild.width === 'number') return anyChild.width as number;
    return child.getBounds().width;
  }

  private getDisplayHeight(child: GameObjects.GameObject): number {
    const anyChild = child as unknown as { displayHeight?: number; height?: number };
    if (typeof anyChild.displayHeight === 'number') return anyChild.displayHeight;
    if (typeof anyChild.height === 'number') return anyChild.height as number;
    return child.getBounds().height;
  }
}
