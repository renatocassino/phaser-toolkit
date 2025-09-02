/* eslint-disable complexity */
import { GameObjects, Scene } from 'phaser';

import {
  DEFAULT_GAP,
  getDisplayHeightOf,
  getDisplayWidthOf,
  getNormalizedOriginOf,
} from '../layout/layout-utils';

/** Vertical alignment options for row items */
export type VerticalAlign = 'top' | 'center' | 'bottom';

/** Parameters for creating a Row container */
export type RowParams = {
  /** The scene this row belongs to */
  scene: Scene;
  /** X coordinate of the row */
  x: number;
  /** Y coordinate of the row */
  y: number;
  /** Gap between elements in pixels */
  gap?: number;
  /** Vertical alignment of elements */
  align?: VerticalAlign;
  /** Initial child elements */
  children?: GameObjects.GameObject[];
  /** Horizontal origin point of the row */
  horizontalOrigin?: 'left' | 'center' | 'right';
};

/**
 * Row is a layout container that arranges children horizontally with a gap.
 * The container position (x, y) represents the center of the whole row.
 */
export class Row extends GameObjects.Container {
  /** Gap between elements in pixels */
  private gap: number;
  /** Vertical alignment of elements */
  private align: VerticalAlign;
  /** Horizontal origin point of the row */
  private horizontalOrigin: 'left' | 'center' | 'right';

  /**
   * Creates a new Row container
   * @param params Configuration parameters for the row
   */
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

  /**
   * Sets the gap between elements and updates layout
   * @param gap Gap size in pixels
   */
  public setGap(gap: number): void {
    this.gap = gap;
    this.layout();
  }

  /**
   * Sets the vertical alignment and updates layout
   * @param align New vertical alignment
   */
  public setAlign(align: VerticalAlign): void {
    this.align = align;
    this.layout();
  }

  /**
   * Adds a single child to the row
   * @param child GameObject to add
   * @param relayout Whether to update layout after adding
   * @returns This row instance for chaining
   */
  public addChild(
    child: GameObjects.GameObject,
    relayout: boolean = true
  ): this {
    this.add(child);
    if (relayout) {
      this.layout();
    }
    return this;
  }

  /**
   * Adds multiple children to the row
   * @param children Array of GameObjects to add
   * @param relayout Whether to update layout after adding
   * @returns This row instance for chaining
   */
  public addChildren(
    children: GameObjects.GameObject[],
    relayout: boolean = true
  ): this {
    if (children.length > 0) this.add(children);
    if (relayout) this.layout();
    return this;
  }

  /**
   * Recomputes children's positions and updates this container size
   */
  public layout(): void {
    const children = this.list as GameObjects.GameObject[];
    if (children.length === 0) {
      this.setSize(0, 0);
      return;
    }

    // Measure sizes and origins
    const entries = children.map(child => ({
      child,
      width: this.getDisplayWidth(child),
      height: this.getDisplayHeight(child),
      origin: this.getNormalizedOrigin(child),
    }));

    const maxHeight = entries.reduce((m, s) => Math.max(m, s.height), 0);
    const totalWidth =
      entries.reduce((sum, s) => sum + s.width, 0) +
      this.gap * (entries.length - 1);

    // Determine left of content based on horizontalOrigin
    const contentLeftX =
      this.horizontalOrigin === 'left'
        ? 0
        : this.horizontalOrigin === 'center'
          ? -totalWidth / 2
          : -totalWidth;

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

      (
        child as unknown as { setPosition: (x: number, y: number) => void }
      ).setPosition(x, y);

      cursorLeftX += width + this.gap;
    }

    this.setSize(totalWidth, maxHeight);
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
  public getNormalizedOrigin(child: GameObjects.GameObject): {
    x: number;
    y: number;
  } {
    return getNormalizedOriginOf(child);
  }
}
