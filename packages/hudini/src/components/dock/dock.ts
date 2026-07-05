/* eslint-disable max-lines-per-function */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
  type SpacingKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { Stack } from '../stack';

/** A single entry in a Dock. */
export type DockItem = {
  /** Unique identifier passed back to `onSelect`. */
  id: string;
  /** Font Awesome icon key to render above the label. */
  icon: IconKey;
  /** Text shown under the icon. */
  label: string;
};

/**
 * Parameters for creating a Dock.
 *
 * A Dock is a bottom-navigation-style bar (daisyUI's `dock`) — a horizontal
 * strip of icon + label items where one can be marked "active". The Dock
 * itself is stateless in the React sense: it renders whatever `active` the
 * client passes and fires `onSelect(id, index)` on click. It's up to the
 * client to update `active` (via `setActiveItem`) if they want the visual to
 * reflect the selection.
 */
export type DockParams = {
  /** Phaser scene where the dock will be added. */
  scene: Scene;
  /** X position of the dock (center of the whole bar). */
  x: number;
  /** Y position of the dock (center of the whole bar). */
  y: number;
  /** Items to render, in order. */
  items: DockItem[];
  /** Currently active item id. If omitted, no item is highlighted initially. */
  active?: string;
  /** Gap between items in pixels. Defaults to `24`. */
  gap?: number;
  /**
   * Inner padding between the items and the background edge. Only visible
   * when `backgroundColor` is set. Defaults to `'3'`.
   */
  padding?: SpacingKey | number;
  /** Background fill color for the dock bar. */
  backgroundColor?: ColorKey | string;
  /** Border radius on the background. Defaults to `'lg'`. */
  borderRadius?: RadiusKey | number;
  /** Icon color for the active item. Defaults to `'blue-500'`. */
  activeColor?: ColorKey | string;
  /** Icon color for inactive items. Defaults to `'slate-400'`. */
  inactiveColor?: ColorKey | string;
  /** Icon size in px or FontSizeKey. Defaults to `'2xl'` (24px). */
  iconSize?: FontSizeKey | number;
  /** Label font size in px or FontSizeKey. Defaults to `'xs'` (12px). */
  labelSize?: FontSizeKey | number;
  /**
   * Extra horizontal padding around each item's hit area, in pixels.
   * Widens the click target beyond the icon+label footprint. Defaults to `8`.
   */
  itemHitPaddingX?: number;
  /**
   * Extra vertical padding around each item's hit area, in pixels.
   * Defaults to `4`.
   */
  itemHitPaddingY?: number;
  /** Fired when an item is clicked. */
  onSelect?: (id: string, index: number) => void;
};

type DockItemVisual = {
  icon: IconText;
  label: GameObjects.Text;
  container: GameObjects.Container;
};

const DEFAULT_ICON_SIZE_KEY: FontSizeKey = '2xl';
const DEFAULT_LABEL_SIZE_KEY: FontSizeKey = 'xs';
const DEFAULT_GAP = 24;
const DEFAULT_ITEM_HIT_PADDING_X = 8;
const DEFAULT_ITEM_HIT_PADDING_Y = 4;
const ICON_LABEL_GAP = 2;

/**
 * Dock — a daisyUI-inspired bottom navigation bar.
 *
 * The client controls the "active" state; the Dock itself just renders and
 * fires callbacks.
 *
 * @example
 * const dock = new Dock({
 *   scene, x: 400, y: 560,
 *   backgroundColor: 'slate-800',
 *   active: 'home',
 *   items: [
 *     { id: 'home',    icon: 'house',    label: 'Home' },
 *     { id: 'search',  icon: 'magnifying-glass', label: 'Search' },
 *     { id: 'profile', icon: 'user',     label: 'Profile' },
 *   ],
 *   onSelect: (id) => {
 *     dock.setActiveItem(id);           // update visual
 *     game.scene.start(`scene-${id}`); // client-side reaction
 *   },
 * });
 */
export class Dock extends GameObjects.Container {
  /** The underlying horizontal Stack containing all items. */
  public bar!: Stack;

  private pw: PhaserWindPlugin<{}>;
  private itemsById: Map<string, DockItemVisual> = new Map();
  private activeId: string | undefined;
  private activeColorValue: string;
  private inactiveColorValue: string;
  private iconSizePx: number;
  private labelSizePx: number;
  private onSelect: ((id: string, index: number) => void) | undefined;

  constructor({
    scene,
    x,
    y,
    items,
    active,
    gap = DEFAULT_GAP,
    padding = '3',
    backgroundColor,
    borderRadius = 'lg',
    activeColor = 'blue-500',
    inactiveColor = 'slate-400',
    iconSize,
    labelSize,
    itemHitPaddingX = DEFAULT_ITEM_HIT_PADDING_X,
    itemHitPaddingY = DEFAULT_ITEM_HIT_PADDING_Y,
    onSelect,
  }: DockParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    this.activeId = active;
    this.activeColorValue = Color.rgb(activeColor as ColorKey);
    this.inactiveColorValue = Color.rgb(inactiveColor as ColorKey);
    this.iconSizePx =
      typeof iconSize === 'number'
        ? iconSize
        : this.pw.fontSize.px(iconSize ?? DEFAULT_ICON_SIZE_KEY);
    this.labelSizePx =
      typeof labelSize === 'number'
        ? labelSize
        : this.pw.fontSize.px(labelSize ?? DEFAULT_LABEL_SIZE_KEY);
    this.onSelect = onSelect;

    const itemContainers = items.map((item, index) =>
      this.buildItem(item, index, itemHitPaddingX, itemHitPaddingY)
    );

    this.bar = new Stack({
      scene,
      x: 0,
      y: 0,
      direction: 'row',
      align: 'center',
      gap,
      padding,
      // Only pass `backgroundColor` when defined — Stack's optional field
      // trips exactOptionalPropertyTypes if we send `undefined`.
      ...(backgroundColor !== undefined && { backgroundColor }),
      borderRadius,
      children: itemContainers,
    });
    this.add(this.bar);

    // Publish size for a parent layout container.
    this.setSize(this.bar.width, this.bar.height);
  }

  /**
   * Change the active item and re-tint the visuals. No callback is fired —
   * this is the "controlled" setter meant to be called from an `onSelect`
   * handler in the client.
   */
  public setActiveItem(id: string | undefined): this {
    const prev = this.activeId;
    this.activeId = id;
    if (prev && this.itemsById.has(prev)) {
      this.applyState(prev);
    }
    if (id && this.itemsById.has(id)) {
      this.applyState(id);
    }
    return this;
  }

  /** Currently active item id, or `undefined` if none. */
  public getActiveItem(): string | undefined {
    return this.activeId;
  }

  private buildItem(
    item: DockItem,
    index: number,
    hitPaddingX: number,
    hitPaddingY: number
  ): GameObjects.Container {
    const scene = this.scene;
    const initialColor =
      item.id === this.activeId
        ? this.activeColorValue
        : this.inactiveColorValue;

    const iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon: item.icon,
      size: this.iconSizePx,
      style: { color: initialColor },
    });
    iconText.setFontStyle('900');
    iconText.setOrigin(0.5, 0.5);
    scene.add.existing(iconText);

    const label = scene.add.text(0, 0, item.label, {
      fontFamily: 'Fredoka',
      fontSize: `${this.labelSizePx}px`,
      color: initialColor,
    });
    label.setOrigin(0.5, 0.5);

    // Icon+label as a vertical Stack (pure layout, no bg).
    const column = new Stack({
      scene,
      x: 0,
      y: 0,
      direction: 'column',
      gap: ICON_LABEL_GAP,
      align: 'center',
      children: [iconText, label],
    });

    // Widen the click target beyond the visible column footprint.
    const hitWidth = column.width + hitPaddingX * 2;
    const hitHeight = column.height + hitPaddingY * 2;
    const hitRect = scene.add.rectangle(0, 0, hitWidth, hitHeight, 0x000000, 0);
    hitRect.setOrigin(0.5, 0.5);
    hitRect.setInteractive({ useHandCursor: true });

    hitRect.on('pointerdown', () => {
      this.onSelect?.(item.id, index);
    });

    const itemContainer = scene.add.container(0, 0, [hitRect, column]);
    // Report the padded size so the outer Stack measures the click target.
    itemContainer.setSize(hitWidth, hitHeight);

    this.itemsById.set(item.id, {
      icon: iconText,
      label,
      container: itemContainer,
    });

    return itemContainer;
  }

  private applyState(itemId: string): void {
    const visual = this.itemsById.get(itemId);
    if (!visual) return;
    const isActive = itemId === this.activeId;
    const c = isActive ? this.activeColorValue : this.inactiveColorValue;
    visual.icon.setColor(c);
    visual.label.setColor(c);
  }
}
