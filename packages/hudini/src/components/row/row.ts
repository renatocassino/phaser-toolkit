import { GameObjects, Scene } from 'phaser';

const DEFAULT_GAP = 8;

export type VerticalAlign = 'top' | 'center' | 'bottom';

export type RowParams = {
  scene: Scene;
  x: number;
  y: number;
  gap?: number;
  align?: VerticalAlign;
  children?: GameObjects.GameObject[];
  horizontalOrigin?: 'left' | 'center' | 'right';
};

/**
 * Row is a layout container that arranges children horizontally with a gap.
 * The container position (x, y) represents the center of the whole row.
 */
export class Row extends GameObjects.Container {
  private gap: number;
  private align: VerticalAlign;
  private horizontalOrigin: 'left' | 'center' | 'right';

  constructor({
    scene,
    x,
    y,
    gap = DEFAULT_GAP,
    align = 'center',
    children = [],
    horizontalOrigin = 'center',
  }: RowParams) {
    super(scene, x, y);

    this.gap = gap;
    this.align = align;
    this.horizontalOrigin = horizontalOrigin;

    if (children.length > 0) {
      this.add(children);
    }

    this.layout();
  }

  public setGap(gap: number): void {
    this.gap = gap;
    this.layout();
  }

  public setAlign(align: VerticalAlign): void {
    this.align = align;
    this.layout();
  }

  public addChild(child: GameObjects.GameObject, relayout: boolean = true): this {
    this.add(child);
    if (relayout) this.layout();
    return this;
  }

  public addChildren(children: GameObjects.GameObject[], relayout: boolean = true): this {
    if (children.length > 0) this.add(children);
    if (relayout) this.layout();
    return this;
  }

  /** Recomputes children's positions and updates this container size */
  public layout(): void {
    const children = this.list as GameObjects.GameObject[];
    if (children.length === 0) {
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

    const maxHeight = entries.reduce((m, s) => Math.max(m, s.height), 0);
    const totalWidth = entries.reduce((sum, s) => sum + s.width, 0) + this.gap * (entries.length - 1);

    // Determine left of content based on horizontalOrigin
    const contentLeftX = this.horizontalOrigin === 'left' ? 0 : this.horizontalOrigin === 'center' ? -totalWidth / 2 : -totalWidth;

    // Walk left to right, aligning considering each child's origin
    let cursorLeftX = contentLeftX;
    for (const { child, width, height, origin } of entries) {
      // Vertical alignment: align top/bottom edges or centers correctly using origin
      let y = 0;
      if (this.align === 'top') {
        // place child's top edge at content top
        y = -maxHeight / 2 + origin.y * height;
      } else if (this.align === 'bottom') {
        // place child's bottom edge at content bottom
        y = maxHeight / 2 - (1 - origin.y) * height;
      } else {
        // center alignment
        y = (origin.y - 0.5) * height;
      }

      // Horizontal position so that child's left is at cursorLeftX
      const x = cursorLeftX + origin.x * width;

      (child as unknown as { setPosition: (x: number, y: number) => void }).setPosition(x, y);

      cursorLeftX += width + this.gap;
    }

    this.setSize(totalWidth, maxHeight);
  }

  private getDisplayWidth(child: GameObjects.GameObject): number {
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

  private getNormalizedOrigin(
    child: GameObjects.GameObject
  ): { x: number; y: number } {
    const anyChild = child as unknown as {
      originX?: number;
      originY?: number;
      displayOriginX?: number;
      displayOriginY?: number;
    };

    const width = this.getDisplayWidth(child);
    const height = this.getDisplayHeight(child);

    let ox: number | undefined =
      typeof anyChild.originX === 'number' ? anyChild.originX : undefined;
    let oy: number | undefined =
      typeof anyChild.originY === 'number' ? anyChild.originY : undefined;

    if (ox === undefined && typeof anyChild.displayOriginX === 'number' && width > 0) {
      ox = anyChild.displayOriginX / width;
    }
    if (oy === undefined && typeof anyChild.displayOriginY === 'number' && height > 0) {
      oy = anyChild.displayOriginY / height;
    }

    return { x: ox ?? 0.5, y: oy ?? 0.5 };
  }
}
