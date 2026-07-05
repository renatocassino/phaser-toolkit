/* eslint-disable max-lines-per-function */
import { GameObjects, Scene } from 'phaser';
import {
  Column,
  Row,
  type ColorKey,
  type HorizontalAlign,
  type RadiusKey,
  type SpacingKey,
  type VerticalAlign,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { Card } from '../card';

/**
 * Direction along which children are stacked. `'row'` = horizontal (like
 * `flex-direction: row`); `'column'` = vertical (`flex-direction: column`).
 */
export type StackDirection = 'row' | 'column';

/**
 * Alignment along the cross-axis. For `'row'` direction, this is vertical
 * (`'top' | 'center' | 'bottom'`). For `'column'`, it is horizontal
 * (`'left' | 'center' | 'right'`).
 */
export type StackAlign = VerticalAlign | HorizontalAlign;

/**
 * Parameters for creating a Stack.
 *
 * Stack is a layout primitive that arranges children in a `'row'` or
 * `'column'`. When `backgroundColor` / `padding` / `borderRadius` are set,
 * Stack also renders a Card behind the children — matching the Tailwind
 * pattern `<div class="flex flex-row bg-slate-800 p-4 rounded-lg">...</div>`.
 *
 * Row and Column remain available as pure-layout primitives; Stack is the
 * combo when you want layout + visual in a single node.
 */
export type StackParams = {
  /** Phaser scene where the stack will be added. */
  scene: Scene;
  /** X position of the stack (center of the whole content area). */
  x: number;
  /** Y position of the stack (center of the whole content area). */
  y: number;
  /** Stack direction. Defaults to `'row'`. */
  direction?: StackDirection;
  /** Gap between children, in pixels. Defaults to `8`. */
  gap?: number;
  /**
   * Cross-axis alignment.
   * - `'row'`: `'top' | 'center' | 'bottom'` (default: `'center'`).
   * - `'column'`: `'left' | 'center' | 'right'` (default: `'center'`).
   */
  align?: StackAlign;
  /** Initial child GameObjects. */
  children?: GameObjects.GameObject[];
  /**
   * Inner padding between the children and the container's visible edge.
   * Only meaningful when `backgroundColor` is set (otherwise the container
   * has no visible edge). Accepts a Phaser Wind spacing token or a raw px
   * number. Defaults to `'4'` (16px).
   */
  padding?: SpacingKey | number;
  /**
   * Background fill color. When provided, a Card is rendered behind the
   * children with the padded size. Omit for a purely transparent layout
   * container.
   */
  backgroundColor?: ColorKey | string;
  /**
   * Border radius on the background. Only meaningful when `backgroundColor`
   * is set. Defaults to `'md'`.
   */
  borderRadius?: RadiusKey | number;
};

const DEFAULT_GAP = 8;

/**
 * Stack — Row or Column with optional background/padding/radius.
 *
 * @example
 * // Pure layout (like Row):
 * new Stack({ scene, x, y, direction: 'row', children: [a, b, c] });
 *
 * @example
 * // Layout + background (like `<div class="flex bg-slate-800 p-4 rounded-lg">`):
 * new Stack({
 *   scene, x, y,
 *   direction: 'row',
 *   gap: 12,
 *   padding: '4',
 *   backgroundColor: 'slate-800',
 *   borderRadius: 'lg',
 *   children: [btnA, btnB, btnC],
 * });
 */
export class Stack extends GameObjects.Container {
  /** The inner layout container (Row or Column). */
  public layoutContainer!: Row | Column;
  /** The background Card, when `backgroundColor` is provided. */
  public background: Card | null = null;

  /** The stack direction (readable so callers can branch on it). */
  public readonly direction: StackDirection;

  private paddingPx: number;
  private hasBackground: boolean;

  constructor({
    scene,
    x,
    y,
    direction = 'row',
    gap = DEFAULT_GAP,
    align,
    children = [],
    padding = '4',
    backgroundColor,
    borderRadius = 'md',
  }: StackParams) {
    super(scene, x, y);
    const pw = getPWFromScene(scene);

    this.direction = direction;
    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : pw.spacing.px(padding ?? ('4' as SpacingKey));
    this.hasBackground = backgroundColor !== undefined;

    // Create the inner layout container (Row or Column) at local (0,0) so it
    // sits centered inside this Stack.
    this.layoutContainer =
      direction === 'row'
        ? new Row({
            scene,
            x: 0,
            y: 0,
            gap,
            align: (align as VerticalAlign) ?? 'center',
            children,
          })
        : new Column({
            scene,
            x: 0,
            y: 0,
            gap,
            align: (align as HorizontalAlign) ?? 'center',
            children,
          });

    // Optional background card, sized to cover the layout + padding.
    if (this.hasBackground) {
      const { width, height } = this.getLayoutSize();
      this.background = new Card({
        scene,
        x: 0,
        y: 0,
        backgroundColor: backgroundColor as ColorKey | string,
        borderRadius,
        margin: 0,
        width: width + this.paddingPx * 2,
        height: height + this.paddingPx * 2,
      });
      // Add card first so it renders BEHIND the layout container.
      this.add(this.background);
    }

    this.add(this.layoutContainer);
    this.syncSize();
  }

  /**
   * Adds a single child to the stack.
   * @param child GameObject to append.
   * @param relayout Whether to trigger a re-layout (default `true`).
   */
  public addChild(
    child: GameObjects.GameObject,
    relayout: boolean = true
  ): this {
    this.layoutContainer.addChild(child, relayout);
    if (relayout) this.syncBackground();
    return this;
  }

  /**
   * Adds multiple children to the stack.
   * @param children Array of GameObjects to append.
   * @param relayout Whether to trigger a re-layout (default `true`).
   */
  public addChildren(
    children: GameObjects.GameObject[],
    relayout: boolean = true
  ): this {
    this.layoutContainer.addChildren(children, relayout);
    if (relayout) this.syncBackground();
    return this;
  }

  /**
   * Re-layouts the children and resyncs the background/size. Call this after
   * mutating child sizes externally.
   */
  public layout(): void {
    this.layoutContainer.layout();
    this.syncBackground();
  }

  private getLayoutSize(): { width: number; height: number } {
    // Row/Column update their own `.width`/`.height` via setSize during
    // layout(). Fall back to 0 defensively for empty containers.
    const width = (this.layoutContainer.width as number) ?? 0;
    const height = (this.layoutContainer.height as number) ?? 0;
    return { width, height };
  }

  private syncBackground(): void {
    if (this.background) {
      const { width, height } = this.getLayoutSize();
      this.background.setSize(
        width + this.paddingPx * 2,
        height + this.paddingPx * 2
      );
    }
    this.syncSize();
  }

  /**
   * Keep this Stack's own `.width`/`.height` in sync with the visible box, so
   * that a parent Row/Column/Stack measures it correctly.
   */
  private syncSize(): void {
    const { width, height } = this.getLayoutSize();
    const outerPadding = this.hasBackground ? this.paddingPx * 2 : 0;
    this.setSize(width + outerPadding, height + outerPadding);
  }
}
