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

/** Parameters for creating a {@link Checkbox}. */
export type CheckboxParams = {
  /** Phaser scene where the checkbox will be added. */
  scene: Scene;
  /** X position (center of the whole content — box + label). */
  x: number;
  /** Y position (center of the whole content). */
  y: number;
  /** Initial checked state. Default `false`. */
  checked?: boolean;
  /** If `true`, the checkbox is muted and non-interactive. Default `false`. */
  disabled?: boolean;
  /** If `true`, the checkbox is visually normal but ignores clicks. Default `false`. */
  readOnly?: boolean;
  /**
   * Optional metadata used by a future Form container. Not consumed by the
   * Checkbox itself; passed back as the second arg of `onChange`.
   */
  name?: string;
  /**
   * Optional text label to the right of the box. Clicking the label toggles
   * the checkbox (same as clicking the box), matching `<label>` behavior.
   */
  label?: string;
  /**
   * Font Awesome icon key shown when checked. Default `'check'`. Use any FA
   * key — `'heart'`, `'star'`, `'thumbs-up'` — to theme it per game.
   */
  icon?: IconKey;
  /** Icon color. Default `'white'`. */
  iconColor?: ColorKey | string;
  /** Box fill / border color. Default `'blue-500'`. */
  color?: ColorKey | string;
  /** Label text color. Default `'slate-800'`. */
  labelColor?: ColorKey | string;
  /**
   * Visual size (font size for the label and reference size for the box).
   * Default `'base'` (16px). Box side = `size + 8`.
   */
  size?: FontSizeKey | number;
  /** Border radius of the box. Default `'sm'`. */
  borderRadius?: RadiusKey | number;
  /** Gap between box and label, in pixels. Default 8. */
  labelGap?: number;
  /** Fires whenever the checked state changes (via click or `setChecked`). */
  onChange?: (checked: boolean, name?: string) => void;
  /** Fires on any click / tap — regardless of whether the state changed. */
  onClick?: () => void;
};

const DEFAULT_SIZE_KEY: FontSizeKey = 'base';
const DEFAULT_ICON: IconKey = 'check';
const BOX_PADDING_PX = 4;
const BOX_BORDER_THICKNESS = 2;
const TEXTURE_ANTIALIAS_MARGIN = 1;
const DEFAULT_LABEL_GAP = 8;
const DISABLED_ALPHA = 0.4;
const CHECK_TWEEN_DURATION_MS = 140;
const CHECK_TWEEN_EASE = 'Back.easeOut';
const UNCHECK_TWEEN_DURATION_MS = 100;
const UNCHECK_TWEEN_EASE = 'Sine.easeIn';

/**
 * Checkbox — a toggleable form control.
 *
 * The Checkbox owns its own state (uncontrolled). Read it back via
 * `getValue()` / `isChecked()`, mutate it via `toggle()` / `setChecked(v)`,
 * observe it via the `onChange` callback.
 *
 * For persistent named state, wire it up with `phaser-hooks` on the outside:
 * `withLocalState(scene, 'settings.sound', true)` + pass `.get()` to
 * `checked` + call `.set(v)` from `onChange`. The Checkbox stays decoupled.
 *
 * @example
 * const cb = new Checkbox({
 *   scene, x: 100, y: 100,
 *   checked: true,
 *   label: 'Enable sound',
 *   onChange: (v) => console.log('sound:', v),
 * });
 * cb.toggle();
 * cb.getValue(); // false
 *
 * @example
 * // Custom icon + color (great for game-flavored toggles)
 * new Checkbox({
 *   scene, x, y,
 *   label: 'Favorite',
 *   icon: 'heart',
 *   color: 'red-500',
 * });
 */
export class Checkbox extends ContainerInteractive<Phaser.GameObjects.Rectangle> {
  /** The rectangle drawn as the checkbox box (visible fill + border). */
  public boxSprite!: GameObjects.Sprite;
  /** The check-mark icon shown when checked (alpha 0 when unchecked). */
  public iconText!: IconText;
  /** Optional label text next to the box, when `label` is set. */
  public labelText: GameObjects.Text | undefined;
  /**
   * The invisible click target sized to `box + label`. Wider than the box
   * alone so clicking the label also toggles.
   */
  public hitRect!: GameObjects.Rectangle;

  private pw: PhaserWindPlugin<{}>;
  private checkedState: boolean;
  private disabledState: boolean;
  private readOnlyState: boolean;
  private sizePx!: number;
  private boxSidePx!: number;
  private borderRadiusPx!: number;
  private colorInput!: string;
  private colorFilled!: number;
  private iconColorValue!: string;
  private labelColorValue!: string;
  private iconKey!: IconKey;
  private labelValue: string | undefined;
  private labelGap: number;
  private onChangeCb: ((checked: boolean, name?: string) => void) | undefined;
  private onClickCb: (() => void) | undefined;

  constructor({
    scene,
    x,
    y,
    checked = false,
    disabled = false,
    readOnly = false,
    name,
    label,
    icon = DEFAULT_ICON,
    iconColor = 'white',
    color = 'blue-500',
    labelColor = 'slate-800',
    size = DEFAULT_SIZE_KEY,
    borderRadius = 'sm',
    labelGap = DEFAULT_LABEL_GAP,
    onChange,
    onClick,
  }: CheckboxParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    this.checkedState = checked;
    this.disabledState = disabled;
    this.readOnlyState = readOnly;
    // Store the form field name via Phaser Container's built-in `name` slot.
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

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('sm' as RadiusKey));

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

  /** Flip the checked state. Fires `onChange`. */
  public toggle(): this {
    return this.setChecked(!this.checkedState);
  }

  /** Programmatically set the checked state. Fires `onChange` if it changes. */
  public setChecked(checked: boolean): this {
    if (this.checkedState === checked) return this;
    this.checkedState = checked;
    this.regenerateBoxTexture();
    this.animateIcon(checked);
    // Phaser Container `name` defaults to `''`; normalize to `undefined` for
    // consumers so an unnamed checkbox reads as no-name.
    this.onChangeCb?.(checked, this.name === '' ? undefined : this.name);
    return this;
  }

  /** Current checked state. */
  public isChecked(): boolean {
    return this.checkedState;
  }

  /** Alias for {@link isChecked}, meant for form-style value collection. */
  public getValue(): boolean {
    return this.checkedState;
  }

  /** Set the disabled state (muted + non-interactive). */
  public setDisabled(disabled: boolean): this {
    if (this.disabledState === disabled) return this;
    this.disabledState = disabled;
    this.applyDisabledVisual();
    return this;
  }

  /** Shortcut: `setDisabled(true)`. */
  public disable(): this {
    return this.setDisabled(true);
  }

  /** Shortcut: `setDisabled(false)`. */
  public enable(): this {
    return this.setDisabled(false);
  }

  /** Current disabled state. */
  public isDisabled(): boolean {
    return this.disabledState;
  }

  /**
   * Set the read-only state. Visually the same as an interactive checkbox,
   * but clicks are ignored.
   */
  public setReadOnly(readOnly: boolean): this {
    this.readOnlyState = readOnly;
    return this;
  }

  /** Current read-only state. */
  public isReadOnly(): boolean {
    return this.readOnlyState;
  }

  /** Replace the change callback. Pass `undefined` to clear. */
  public onChange(
    cb: ((checked: boolean, name?: string) => void) | undefined
  ): this {
    this.onChangeCb = cb;
    return this;
  }

  /** Replace the click callback. Pass `undefined` to clear. */
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
      size: this.sizePx,
      style: { color: this.iconColorValue },
    });
    this.iconText.setFontStyle('900');
    this.iconText.setOrigin(0.5, 0.5);
    scene.add.existing(this.iconText);
    // Start hidden if unchecked, visible if checked.
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
    // Rectangle sized to (box + labelGap + label) so clicks on the label
    // toggle too. We update its size in syncSize after we know the actual
    // width.
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
    // Compose box + icon into a single "checkbox unit" container so a Stack
    // can measure it as one item.
    const boxUnit = this.scene.add.container(0, 0, [
      this.boxSprite,
      this.iconText,
    ]);
    boxUnit.setSize(this.boxSidePx, this.boxSidePx);

    const children: GameObjects.GameObject[] = [boxUnit];
    if (this.labelText) children.push(this.labelText);

    // Outer horizontal layout — box + optional label.
    const contentStack = new Stack({
      scene: this.scene,
      x: 0,
      y: 0,
      direction: 'row',
      align: 'center',
      gap: this.labelGap,
      children,
    });

    // Z-order: hit rect first (behind, transparent), then the visible content.
    this.add([this.hitRect, contentStack]);
  }

  private setupInteractivity(): void {
    this.hitRect.setInteractive({ useHandCursor: true });
    this.hitRect.on('pointerdown', () => {
      if (this.disabledState || this.readOnlyState) return;
      this.onClickCb?.();
      this.toggle();
    });
  }

  private syncSize(): void {
    // Width: box + (labelGap + label) if any. Height: max of box and label.
    const labelBounds = this.labelText?.getBounds();
    const labelWidth = labelBounds?.width ?? 0;
    const labelHeight = labelBounds?.height ?? 0;
    const totalWidth =
      this.boxSidePx + (this.labelText ? this.labelGap + labelWidth : 0);
    const totalHeight = Math.max(this.boxSidePx, labelHeight);
    // Resize the hit target to cover the whole clickable area.
    this.hitRect.setSize(totalWidth, totalHeight);
    // ContainerInteractive proxies our width/height to the hitRect, so a
    // parent Row/Column/Stack measures this checkbox correctly.
    this.setSize(totalWidth, totalHeight);
  }

  private applyDisabledVisual(): void {
    const targetAlpha = this.disabledState ? DISABLED_ALPHA : 1;
    this.boxSprite.setAlpha(targetAlpha);
    this.iconText.setAlpha(this.checkedState ? targetAlpha : 0);
    if (this.labelText) this.labelText.setAlpha(targetAlpha);
  }

  private animateIcon(toChecked: boolean): void {
    // Kill any in-flight tween on the icon so rapid toggles don't stack.
    this.scene.tweens.killTweensOf(this.iconText);
    const targetAlpha = toChecked ? (this.disabledState ? DISABLED_ALPHA : 1) : 0;
    const targetScale = toChecked ? 1 : 0;
    this.scene.tweens.add({
      targets: this.iconText,
      alpha: targetAlpha,
      scaleX: targetScale,
      scaleY: targetScale,
      duration: toChecked
        ? CHECK_TWEEN_DURATION_MS
        : UNCHECK_TWEEN_DURATION_MS,
      ease: toChecked ? CHECK_TWEEN_EASE : UNCHECK_TWEEN_EASE,
    });
  }

  private getBoxTextureKey(): string {
    return `checkbox_box_${this.colorInput}_${this.borderRadiusPx}_${this.boxSidePx}_${this.checkedState ? 'on' : 'off'}`;
  }

  private drawBoxTexture(scene: Scene, textureKey: string): void {
    if (scene.textures.exists(textureKey)) return;
    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureSide = this.boxSidePx + padding * 2;

    const graphics = scene.add.graphics();
    const maxRadius = Math.floor(this.boxSidePx / 2);
    const radius = Math.min(this.borderRadiusPx, maxRadius);

    if (this.checkedState) {
      // Filled with color.
      graphics.fillStyle(this.colorFilled, 1);
      graphics.fillRoundedRect(
        padding,
        padding,
        this.boxSidePx,
        this.boxSidePx,
        radius
      );
    } else {
      // Outlined — colored border inset by half the stroke so the outer edge
      // sits at the visual box boundary.
      const half = BOX_BORDER_THICKNESS / 2;
      graphics.lineStyle(BOX_BORDER_THICKNESS, this.colorFilled, 1);
      graphics.strokeRoundedRect(
        padding + half,
        padding + half,
        this.boxSidePx - BOX_BORDER_THICKNESS,
        this.boxSidePx - BOX_BORDER_THICKNESS,
        Math.max(0, radius - half)
      );
      // Subtle translucent fill so the empty box is still readable on any bg.
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
