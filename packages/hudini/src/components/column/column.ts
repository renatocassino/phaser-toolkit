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

    // Measure sizes and origins
    const entries = children.map((child) => ({
      child,
      width: this.getDisplayWidth(child),
      height: this.getDisplayHeight(child),
      origin: this.getNormalizedOrigin(child),
    }));

    const maxWidth = entries.reduce((m, s) => Math.max(m, s.width), 0);
    const totalHeight = entries.reduce((sum, s) => sum + s.height, 0) + this.gap * (entries.length - 1);

    // Determine top of content based on verticalOrigin
    const contentTopY = this.verticalOrigin === 'top' ? 0 : this.verticalOrigin === 'center' ? -totalHeight / 2 : -totalHeight;

    // Walk from top to bottom, aligning considering each child's origin
    let cursorTopY = contentTopY;
    for (const { child, width, height, origin } of entries) {
      // Horizontal alignment: align left/right edges or centers correctly using origin
      let x = 0;
      if (this.align === 'left') {
        // place child's left edge at content left
        x = -maxWidth / 2 + origin.x * width;
      } else if (this.align === 'right') {
        // place child's right edge at content right
        x = maxWidth / 2 - (1 - origin.x) * width;
      } else {
        // center alignment: center of child at 0 accounting for origin
        x = (origin.x - 0.5) * width;
      }

      // Vertical position so that child's top is at cursorTopY
      const y = cursorTopY + origin.y * height;

      (child as unknown as { setPosition: (x: number, y: number) => void }).setPosition(x, y);

      cursorTopY += height + this.gap;
    }

    // Update this container size to match content bounds
    this.setSize(maxWidth, totalHeight);
  }

  private getDisplayWidth(child: GameObjects.GameObject): number {
    // Prefer displayWidth when available, fall back to width/bounds
    const anyChild = child as unknown as { displayWidth?: number; width?: number; getBounds?: () => { width: number } };
    if (typeof anyChild.displayWidth === 'number') return anyChild.displayWidth;
    if (typeof anyChild.width === 'number') return anyChild.width as number;
    const bounds = anyChild.getBounds?.();
    return bounds ? bounds.width : 0;
  }

  private getDisplayHeight(child: GameObjects.GameObject): number {
    const anyChild = child as unknown as { displayHeight?: number; height?: number; getBounds?: () => { height: number } };
    if (typeof anyChild.displayHeight === 'number') return anyChild.displayHeight;
    if (typeof anyChild.height === 'number') return anyChild.height as number;
    const bounds = anyChild.getBounds?.();
    return bounds ? bounds.height : 0;
  }

  private getNormalizedOrigin(child: GameObjects.GameObject): { x: number; y: number } {
    const width = this.getDisplayWidth(child);
    const height = this.getDisplayHeight(child);

    const childTyped = child as unknown as { originX?: number; originY?: number; displayOriginX?: number; displayOriginY?: number };

    let ox: number | undefined = childTyped.originX;
    let oy: number | undefined = childTyped.originY;

    if (ox === undefined && typeof childTyped.displayOriginX === 'number' && width > 0) {
      ox = childTyped.displayOriginX / width;
    }
    if (oy === undefined && typeof childTyped.displayOriginY === 'number' && height > 0) {
      oy = childTyped.displayOriginY / height;
    }

    return { x: ox ?? 0.5, y: oy ?? 0.5 };
  }
}
