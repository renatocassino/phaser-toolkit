/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  Opacity,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Stack } from '../stack';
import { Text } from '../text';

/** Parameters for creating a {@link Radio}. */
export type RadioParams = {
  /** Phaser scene where the radio will be added. */
  scene: Scene;
  /** X position (center of the whole content — box + label). */
  x: number;
  /** Y position (center of the whole content). */
  y: number;
  /**
   * Unique identifier within a `RadioGroup`. Optional when the Radio is used
   * standalone (the value is only meaningful within a group).
   */
  value?: string;
  /** Initial checked state. Default `false`. */
  checked?: boolean;
  /** Muted + non-interactive when `true`. Default `false`. */
  disabled?: boolean;
  /** Visually normal but ignores clicks when `true`. Default `false`. */
  readOnly?: boolean;
  /** Optional metadata passed back as the 2nd arg of `onChange`. */
  name?: string;
  /** Optional text label to the right of the circle. */
  label?: string;
  /**
   * Font Awesome icon shown inside the circle when checked. Default
   * `'circle'` (a solid dot — classic radio look). Use any FA key for a
   * game-flavored radio (e.g. `'heart'`, `'star'`, `'skull'`).
   */
  icon?: IconKey;
  /**
   * Icon size in pixels. Default is proportional to `size` (~55%), which
   * renders as a small dot inside the circle. Increase for icon-heavy radios.
   */
  iconSize?: number;
  /** Icon color. Default `'white'`. */
  iconColor?: ColorKey | string;
  /** Circle fill / border color. Default `'blue-500'`. */
  color?: ColorKey | string;
  /** Label text color. Default `'slate-800'`. */
  labelColor?: ColorKey | string;
  /**
   * Reference size (drives the outer circle and the label font). Default
   * `'base'` (16px). Circle side = `size + 8`.
   */
  size?: FontSizeKey | number;
  /**
   * Border radius. Default `'full'` (circular). Override for a "pill radio"
   * or square filter-chip style.
   */
  borderRadius?: RadiusKey | number;
  /** Gap between circle and label. Default 8. */
  labelGap?: number;
  /**
   * Fires whenever the checked state changes. Second and third args are the
   * Radio's `value` and `name` (both optional).
   */
  onChange?: (
    checked: boolean,
    value?: string,
    name?: string
  ) => void;
  /** Fires on any click / tap, regardless of state change. */
  onClick?: () => void;
};

const DEFAULT_SIZE_KEY: FontSizeKey = 'base';
const DEFAULT_ICON: IconKey = 'circle';
const DEFAULT_ICON_SIZE_RATIO = 0.55;
const BOX_PADDING_PX = 4;
const BOX_BORDER_THICKNESS = 2;
const TEXTURE_ANTIALIAS_MARGIN = 1;
const DEFAULT_LABEL_GAP = 8;
const DISABLED_ALPHA = 0.4;
const SELECT_TWEEN_DURATION_MS = 140;
const SELECT_TWEEN_EASE = 'Back.easeOut';
const DESELECT_TWEEN_DURATION_MS = 100;
const DESELECT_TWEEN_EASE = 'Sine.easeIn';

/**
 * Radio — a single-selection form control.
 *
 * The Radio itself is a Checkbox-family component: uncontrolled state,
 * `onChange` callback, `disabled` / `readOnly`, `getValue()`. It differs from
 * Checkbox in ONE semantic: **click always selects, never deselects.** This
 * matches native `<input type="radio">` and daisyUI's radio behavior.
 *
 * **Recommended usage: {@link RadioGroup}.** The group is a controller +
 * factory that ensures only one Radio in the group is selected at a time.
 * Using Radio standalone is supported, but you own the "only one" invariant
 * yourself.
 *
 * @example
 * // Standalone (rare — you manage state manually)
 * const cb = new Radio({
 *   scene, x, y, label: 'Opt in', value: 'yes',
 *   onChange: (checked, value) => console.log(value, checked),
 * });
 *
 * @example
 * // Preferred: via RadioGroup factory
 * const group = new RadioGroup({
 *   scene, name: 'difficulty', value: 'normal',
 *   onChange: (value) => console.log('selected:', value),
 * });
 * const easy = group.createRadio({ x, y, value: 'easy', label: 'Easy' });
 */
export class Radio extends ContainerInteractive<Phaser.GameObjects.Rectangle> {
  /** The outer circle sprite (visible border / fill). */
  public boxSprite!: GameObjects.Sprite;
  /** The icon (dot by default) rendered inside the circle when checked. */
  public iconText!: IconText;
  /** Optional label text. */
  public labelText: GameObjects.Text | undefined;
  /** Invisible hit target covering circle + label. */
  public hitRect!: GameObjects.Rectangle;
  /** The Radio's value within a group. May be undefined when standalone. */
  public readonly value: string | undefined;

  private pw: PhaserWindPlugin<{}>;
  private checkedState: boolean;
  private disabledState: boolean;
  private readOnlyState: boolean;
  private sizePx!: number;
  private boxSidePx!: number;
  private iconSizePx!: number;
  private borderRadiusPx!: number;
  private colorInput!: string;
  private colorFilled!: number;
  private iconColorValue!: string;
  private labelColorValue!: string;
  private iconKey!: IconKey;
  private labelValue: string | undefined;
  private labelGap: number;
  private onChangeCb:
    | ((checked: boolean, value?: string, name?: string) => void)
    | undefined;
  private onClickCb: (() => void) | undefined;

  constructor({
    scene,
    x,
    y,
    value,
    checked = false,
    disabled = false,
    readOnly = false,
    name,
    label,
    icon = DEFAULT_ICON,
    iconSize,
    iconColor = 'white',
    color = 'blue-500',
    labelColor = 'slate-800',
    size = DEFAULT_SIZE_KEY,
    borderRadius = 'full',
    labelGap = DEFAULT_LABEL_GAP,
    onChange,
    onClick,
  }: RadioParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    this.value = value;
    this.checkedState = checked;
    this.disabledState = disabled;
    this.readOnlyState = readOnly;
    if (name !== undefined) this.name = name;
    this.labelValue = label;
    this.iconKey = icon;
    this.labelGap = labelGap;
    this.onChangeCb = onChange;
    this.onClickCb = onClick;

    this.sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? DEFAULT_SIZE_KEY);
    this.boxSidePx = this.sizePx + BOX_PADDING_PX * 2;
    this.iconSizePx =
      iconSize ?? Math.round(this.sizePx * DEFAULT_ICON_SIZE_RATIO);

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('full' as RadiusKey));

    this.colorInput = String(color);
    this.colorFilled = Color.hex(color as ColorKey);
    this.iconColorValue = Color.rgb(iconColor as ColorKey);
    this.labelColorValue = Color.rgb(labelColor as ColorKey);

    this.createBox(scene);
    this.createIcon(scene);
    this.createLabel(scene);
    this.createHitRect(scene);
    this.setupContainer();
    this.hitArea = this.hitRect;

    this.applyDisabledVisual();
    this.setupInteractivity();
    this.syncSize();
  }

  // -------- public API --------

  /**
   * Select this radio. Idempotent — if already checked, does nothing.
   * This is what click does internally, exposed for programmatic use.
   */
  public select(): this {
    return this.setChecked(true);
  }

  /**
   * Force the checked state. Fires `onChange` if it changes. Unlike a
   * Checkbox, click never invokes `setChecked(false)` — use this method to
   * programmatically deselect.
   */
  public setChecked(checked: boolean): this {
    if (this.checkedState === checked) return this;
    this.checkedState = checked;
    this.regenerateBoxTexture();
    this.animateIcon(checked);
    this.onChangeCb?.(
      checked,
      this.value,
      this.name === '' ? undefined : this.name
    );
    return this;
  }

  public isChecked(): boolean {
    return this.checkedState;
  }

  /** Alias for {@link isChecked} — form-style value read. */
  public getValue(): boolean {
    return this.checkedState;
  }

  public setDisabled(disabled: boolean): this {
    if (this.disabledState === disabled) return this;
    this.disabledState = disabled;
    this.applyDisabledVisual();
    return this;
  }

  public disable(): this {
    return this.setDisabled(true);
  }

  public enable(): this {
    return this.setDisabled(false);
  }

  public isDisabled(): boolean {
    return this.disabledState;
  }

  public setReadOnly(readOnly: boolean): this {
    this.readOnlyState = readOnly;
    return this;
  }

  public isReadOnly(): boolean {
    return this.readOnlyState;
  }

  public onChange(
    cb: ((checked: boolean, value?: string, name?: string) => void) | undefined
  ): this {
    this.onChangeCb = cb;
    return this;
  }

  public onClick(cb: (() => void) | undefined): this {
    this.onClickCb = cb;
    return this;
  }

  // -------- private --------

  private createBox(scene: Scene): void {
    const textureKey = this.getBoxTextureKey();
    this.drawBoxTexture(scene, textureKey);
    this.boxSprite = scene.add.sprite(0, 0, textureKey);
    this.boxSprite.setOrigin(0.5, 0.5);
  }

  private createIcon(scene: Scene): void {
    this.iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon: this.iconKey,
      size: this.iconSizePx,
      style: { color: this.iconColorValue },
    });
    this.iconText.setFontStyle('900');
    this.iconText.setOrigin(0.5, 0.5);
    scene.add.existing(this.iconText);
    if (!this.checkedState) {
      this.iconText.setAlpha(0);
      this.iconText.setScale(0);
    }
  }

  private createLabel(scene: Scene): void {
    if (this.labelValue === undefined || this.labelValue === '') return;
    this.labelText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.labelValue,
      size: this.sizePx,
      fontFamily: 'Fredoka',
      strokeThickness: 0,
      strokeColor: 'rgba(0,0,0,0)',
    });
    this.labelText.setColor(this.labelColorValue);
    this.labelText.setOrigin(0.5, 0.5);
  }

  private createHitRect(scene: Scene): void {
    this.hitRect = scene.add.rectangle(
      0,
      0,
      this.boxSidePx,
      this.boxSidePx,
      0x000000,
      0
    );
    this.hitRect.setOrigin(0.5, 0.5);
  }

  private setupContainer(): void {
    const boxUnit = this.scene.add.container(0, 0, [
      this.boxSprite,
      this.iconText,
    ]);
    boxUnit.setSize(this.boxSidePx, this.boxSidePx);

    const children: GameObjects.GameObject[] = [boxUnit];
    if (this.labelText) children.push(this.labelText);

    const contentStack = new Stack({
      scene: this.scene,
      x: 0,
      y: 0,
      direction: 'row',
      align: 'center',
      gap: this.labelGap,
      children,
    });

    this.add([this.hitRect, contentStack]);
  }

  private setupInteractivity(): void {
    this.hitRect.setInteractive({ useHandCursor: true });
    this.hitRect.on('pointerdown', () => {
      if (this.disabledState || this.readOnlyState) return;
      this.onClickCb?.();
      // Click always selects — never deselects. Matches native radio.
      this.select();
    });
  }

  private syncSize(): void {
    const labelBounds = this.labelText?.getBounds();
    const labelWidth = labelBounds?.width ?? 0;
    const labelHeight = labelBounds?.height ?? 0;
    const totalWidth =
      this.boxSidePx + (this.labelText ? this.labelGap + labelWidth : 0);
    const totalHeight = Math.max(this.boxSidePx, labelHeight);
    this.hitRect.setSize(totalWidth, totalHeight);
    this.setSize(totalWidth, totalHeight);
  }

  private applyDisabledVisual(): void {
    const targetAlpha = this.disabledState ? DISABLED_ALPHA : 1;
    this.boxSprite.setAlpha(targetAlpha);
    this.iconText.setAlpha(this.checkedState ? targetAlpha : 0);
    if (this.labelText) this.labelText.setAlpha(targetAlpha);
  }

  private animateIcon(toChecked: boolean): void {
    this.scene.tweens.killTweensOf(this.iconText);
    const targetAlpha = toChecked
      ? this.disabledState
        ? DISABLED_ALPHA
        : 1
      : 0;
    const targetScale = toChecked ? 1 : 0;
    this.scene.tweens.add({
      targets: this.iconText,
      alpha: targetAlpha,
      scaleX: targetScale,
      scaleY: targetScale,
      duration: toChecked
        ? SELECT_TWEEN_DURATION_MS
        : DESELECT_TWEEN_DURATION_MS,
      ease: toChecked ? SELECT_TWEEN_EASE : DESELECT_TWEEN_EASE,
    });
  }

  private getBoxTextureKey(): string {
    return `radio_box_${this.colorInput}_${this.borderRadiusPx}_${this.boxSidePx}_${this.checkedState ? 'on' : 'off'}`;
  }

  private drawBoxTexture(scene: Scene, textureKey: string): void {
    if (scene.textures.exists(textureKey)) return;
    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureSide = this.boxSidePx + padding * 2;

    const graphics = scene.add.graphics();
    const maxRadius = Math.floor(this.boxSidePx / 2);
    const radius = Math.min(this.borderRadiusPx, maxRadius);

    if (this.checkedState) {
      graphics.fillStyle(this.colorFilled, 1);
      graphics.fillRoundedRect(
        padding,
        padding,
        this.boxSidePx,
        this.boxSidePx,
        radius
      );
    } else {
      const half = BOX_BORDER_THICKNESS / 2;
      graphics.lineStyle(BOX_BORDER_THICKNESS, this.colorFilled, 1);
      graphics.strokeRoundedRect(
        padding + half,
        padding + half,
        this.boxSidePx - BOX_BORDER_THICKNESS,
        this.boxSidePx - BOX_BORDER_THICKNESS,
        Math.max(0, radius - half)
      );
      // Subtle translucent fill — readable on any background.
      graphics.fillStyle(this.colorFilled, Opacity.value('10'));
      graphics.fillRoundedRect(
        padding,
        padding,
        this.boxSidePx,
        this.boxSidePx,
        radius
      );
    }

    graphics.generateTexture(textureKey, textureSide, textureSide);
    graphics.destroy();
  }

  private regenerateBoxTexture(): void {
    const textureKey = this.getBoxTextureKey();
    this.drawBoxTexture(this.scene, textureKey);
    this.boxSprite.setTexture(textureKey);
  }
}
