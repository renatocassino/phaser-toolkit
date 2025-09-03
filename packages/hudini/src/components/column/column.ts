/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { GameObjects, Scene } from 'phaser';

import {
  DEFAULT_GAP,
  getDisplayHeightOf,
  getDisplayWidthOf,
  getNormalizedOriginOf,
} from '../layout/layout-utils';

/** Horizontal alignment options for column items */
export type HorizontalAlign = 'left' | 'center' | 'right';

/** Parameters for creating a Column container */
export type ColumnParams = {
  /** The scene this column belongs to */
  scene: Scene;
  /** X coordinate of the column */
  x: number;
  /** Y coordinate of the column */
  y: number;
  /** Gap between elements in pixels */
  gap?: number;
  /** Horizontal alignment of elements */
  align?: HorizontalAlign;
  /** Initial child elements */
  children?: GameObjects.GameObject[];
  /** Vertical origin point of the column */
  verticalOrigin?: 'top' | 'center' | 'bottom';
};

/**
 * Column is a layout container that stacks children vertically with a gap.
 * The container position (x, y) represents the center of the whole column.
 */
export class Column extends GameObjects.Container {
  /** Gap between elements in pixels */
  private gap: number;
  /** Horizontal alignment of elements */
  private align: HorizontalAlign;
  /** Vertical origin point of the column */
  private verticalOrigin: 'top' | 'center' | 'bottom';

  /**
   * Creates a new Column container
   * @param params Configuration parameters for the column
   */
  constructor({
    scene,
    x,
    y,
    gap = DEFAULT_GAP,
    align = 'center',
    children = [],
    verticalOrigin = 'center',
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

  /**
   * Sets the spacing between children and relayouts
   * @param gap Gap in pixels between elements
   */
  public setGap(gap: number): void {
    this.gap = gap;
    this.layout();
  }

  /**
   * Sets the horizontal alignment and relayouts
   * @param align New horizontal alignment
   */
  public setAlign(align: HorizontalAlign): void {
    this.align = align;
    this.layout();
  }

  /**
   * Adds a child game object to the column
   * @param child Game object to add
   * @param relayout Whether to relayout after adding (default: true)
   * @returns This column instance for chaining
   */
  public addChild(child: GameObjects.GameObject, relayout: boolean = true): this {
    this.add(child);
    if (relayout) this.layout();
    return this;
  }

  /**
   * Adds multiple children to the column
   * @param children Array of game objects to add
   * @param relayout Whether to relayout after adding (default: true)
   * @returns This column instance for chaining
   */
  public addChildren(children: GameObjects.GameObject[], relayout: boolean = true): this {
    if (children.length > 0) this.add(children);
    if (relayout) this.layout();
    return this;
  }

  /**
   * Recomputes children's positions and updates this container size
   * Positions are calculated based on alignment, origins and gaps
   */
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

  /**
   * Gets the display width of a game object
   * @param child GameObject to measure
   * @returns Display width in pixels
   */
  public getDisplayWidth(child: GameObjects.GameObject): number {
    return getDisplayWidthOf(child);
  }

  /**
   * Gets the display height of a game object
   * @param child GameObject to measure
   * @returns Display height in pixels
   */
  public getDisplayHeight(child: GameObjects.GameObject): number {
    return getDisplayHeightOf(child);
  }

  /**
   * Gets the normalized origin point of a game object
   * @param child GameObject to get origin from
   * @returns Object with normalized x,y coordinates of the origin point
   */
  public getNormalizedOrigin(child: GameObjects.GameObject): { x: number; y: number } {
    return getNormalizedOriginOf(child);
  }
}
