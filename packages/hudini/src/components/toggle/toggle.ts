/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Stack } from '../stack';
import { Text } from '../text';

/** Parameters for creating a {@link Toggle}. */
export type ToggleParams = {
  /** Phaser scene where the toggle will be added. */
  scene: Scene;
  /** X position (center of the whole content — switch + label). */
  x: number;
  /** Y position (center of the whole content). */
  y: number;
  /** Initial checked state. Default `false`. */
  checked?: boolean;
  /** Muted + non-interactive when `true`. Default `false`. */
  disabled?: boolean;
  /** Visually normal but ignores clicks when `true`. Default `false`. */
  readOnly?: boolean;
  /** Optional metadata passed back as the 2nd arg of `onChange`. */
  name?: string;
  /** Optional text label to the right of the switch. Clicking it toggles too. */
  label?: string;
  /**
   * Icon inside the handle when checked. Default `'check'`. Pass `null` to
   * render no icon in the on state.
   */
  onIcon?: IconKey | null;
  /**
   * Icon inside the handle when unchecked. Default `'xmark'`. Pass `null` to
   * render no icon in the off state.
   */
  offIcon?: IconKey | null;
  /** Icon color (default `'slate-700'` for contrast on a white handle). */
  iconColor?: ColorKey | string;
  /** Track color when checked. Default `'green-500'`. */
  color?: ColorKey | string;
  /** Track color when unchecked. Default `'slate-400'`. */
  offColor?: ColorKey | string;
  /** Handle (circle) color. Default `'white'`. */
  handleColor?: ColorKey | string;
  /** Label text color. Default `'slate-800'`. */
  labelColor?: ColorKey | string;
  /**
   * Reference size. Drives label font size and switch proportions. Default
   * `'base'` (16px).
   */
  size?: FontSizeKey | number;
  /**
   * Track border radius. Default `'full'` — pill shape, which matches
   * daisyUI's toggle.
   */
  borderRadius?: RadiusKey | number;
  /** Gap between switch and label in pixels. Default 8. */
  labelGap?: number;
  /** Fires whenever the checked state changes. */
  onChange?: (checked: boolean, name?: string) => void;
  /** Fires on any click, regardless of whether the state changed. */
  onClick?: () => void;
};

const DEFAULT_SIZE_KEY: FontSizeKey = 'base';
const DEFAULT_ON_ICON: IconKey = 'check';
const DEFAULT_OFF_ICON: IconKey = 'xmark';

// Sizing constants (relative to `size`).
const HANDLE_PADDING_INSIDE_TRACK = 2;
const TRACK_PADDING_AROUND_HANDLE = 2;
const TRACK_ASPECT_RATIO = 2; // width = height * ratio

const TEXTURE_ANTIALIAS_MARGIN = 1;
const DEFAULT_LABEL_GAP = 8;
const DISABLED_ALPHA = 0.4;

// Tween timings — a hair slower than Checkbox for a physical "switch" feel.
const SLIDE_DURATION_MS = 180;
const SLIDE_EASE = 'Back.easeOut';
const ICON_FADE_DURATION_MS = 150;

/**
 * Toggle — a daisyUI-style switch. Same API contract as {@link Checkbox},
 * different look and feel: a pill-shaped track with a sliding handle that
 * can carry an icon per state (with a cross-fade when the icons differ).
 *
 * @example
 * new Toggle({
 *   scene, x, y,
 *   checked: true,
 *   label: 'Sound',
 *   color: 'green-500',
 * });
 *
 * @example
 * // Themed icons per state (e.g., dark-mode switcher)
 * new Toggle({
 *   scene, x, y,
 *   label: 'Dark mode',
 *   onIcon: 'moon',
 *   offIcon: 'sun',
 *   color: 'indigo-600',
 *   offColor: 'yellow-400',
 * });
 */
export class Toggle extends ContainerInteractive<Phaser.GameObjects.Rectangle> {
  /** The track (pill background) sprite. */
  public trackSprite!: GameObjects.Sprite;
  /** The handle (circle) sprite. */
  public handleSprite!: GameObjects.Sprite;
  /** Container that holds handle + icons and slides between the two positions. */
  public handleGroup!: GameObjects.Container;
  /** Icon rendered when checked (invisible when unchecked). */
  public onIconText: IconText | undefined;
  /** Icon rendered when unchecked (invisible when checked). */
  public offIconText: IconText | undefined;
  /** Optional label text. */
  public labelText: GameObjects.Text | undefined;
  /** Invisible hit rect covering track + label. */
  public hitRect!: GameObjects.Rectangle;

  private pw: PhaserWindPlugin<{}>;
  private checkedState: boolean;
  private disabledState: boolean;
  private readOnlyState: boolean;
  private sizePx!: number;
  private trackWidthPx!: number;
  private trackHeightPx!: number;
  private handleDiameterPx!: number;
  private handleXOn!: number;
  private handleXOff!: number;
  private borderRadiusPx!: number;
  private trackOnColorHex!: number;
  private trackOffColorHex!: number;
  private handleColorHex!: number;
  private iconColorValue!: string;
  private labelColorValue!: string;
  private onIconKey: IconKey | undefined;
  private offIconKey: IconKey | undefined;
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
    onIcon,
    offIcon,
    iconColor = 'slate-700',
    color = 'green-500',
    offColor = 'slate-400',
    handleColor = 'white',
    labelColor = 'slate-800',
    size = DEFAULT_SIZE_KEY,
    borderRadius = 'full',
    labelGap = DEFAULT_LABEL_GAP,
    onChange,
    onClick,
  }: ToggleParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    this.checkedState = checked;
    this.disabledState = disabled;
    this.readOnlyState = readOnly;
    if (name !== undefined) this.name = name;
    this.labelValue = label;
    // Default on/off icons; `null` explicitly disables one.
    this.onIconKey =
      onIcon === null ? undefined : onIcon ?? DEFAULT_ON_ICON;
    this.offIconKey =
      offIcon === null ? undefined : offIcon ?? DEFAULT_OFF_ICON;
    this.labelGap = labelGap;
    this.onChangeCb = onChange;
    this.onClickCb = onClick;

    this.sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? DEFAULT_SIZE_KEY);

    this.handleDiameterPx = this.sizePx + HANDLE_PADDING_INSIDE_TRACK * 2;
    this.trackHeightPx =
      this.handleDiameterPx + TRACK_PADDING_AROUND_HANDLE * 2;
    this.trackWidthPx = this.trackHeightPx * TRACK_ASPECT_RATIO;
    this.handleXOff =
      -this.trackWidthPx / 2 +
      this.handleDiameterPx / 2 +
      TRACK_PADDING_AROUND_HANDLE;
    this.handleXOn = -this.handleXOff;

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('full' as RadiusKey));

    this.trackOnColorHex = Color.hex(color as ColorKey);
    this.trackOffColorHex = Color.hex(offColor as ColorKey);
    this.handleColorHex = Color.hex(handleColor as ColorKey);
    this.iconColorValue = Color.rgb(iconColor as ColorKey);
    this.labelColorValue = Color.rgb(labelColor as ColorKey);

    this.createTrack(scene);
    this.createHandle(scene);
    this.createIcons(scene);
    this.createLabel(scene);
    this.createHitRect(scene);
    this.setupContainer();
    this.hitArea = this.hitRect;

    this.applyInitialState();
    this.applyDisabledVisual();
    this.setupInteractivity();
    this.syncSize();
  }

  // -------- public API --------

  public toggle(): this {
    return this.setChecked(!this.checkedState);
  }

  public setChecked(checked: boolean): this {
    if (this.checkedState === checked) return this;
    this.checkedState = checked;
    this.animateToState(checked);
    this.onChangeCb?.(checked, this.name === '' ? undefined : this.name);
    return this;
  }

  public isChecked(): boolean {
    return this.checkedState;
  }

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
    cb: ((checked: boolean, name?: string) => void) | undefined
  ): this {
    this.onChangeCb = cb;
    return this;
  }

  public onClick(cb: (() => void) | undefined): this {
    this.onClickCb = cb;
    return this;
  }

  // -------- private --------

  private createTrack(scene: Scene): void {
    // Generate both textures upfront so switching between them is instant.
    this.drawTrackTexture(scene, this.trackTextureKey(true), this.trackOnColorHex);
    this.drawTrackTexture(scene, this.trackTextureKey(false), this.trackOffColorHex);
    const initialKey = this.trackTextureKey(this.checkedState);
    this.trackSprite = scene.add.sprite(0, 0, initialKey);
    this.trackSprite.setOrigin(0.5, 0.5);
  }

  private createHandle(scene: Scene): void {
    const handleKey = `toggle_handle_${this.handleColorHex}_${this.handleDiameterPx}`;
    this.drawHandleTexture(scene, handleKey);
    this.handleSprite = scene.add.sprite(0, 0, handleKey);
    this.handleSprite.setOrigin(0.5, 0.5);
  }

  private createIcons(scene: Scene): void {
    if (this.onIconKey) {
      this.onIconText = new IconText({
        scene,
        x: 0,
        y: 0,
        icon: this.onIconKey,
        size: this.sizePx,
        style: { color: this.iconColorValue },
      });
      this.onIconText.setFontStyle('900');
      this.onIconText.setOrigin(0.5, 0.5);
      scene.add.existing(this.onIconText);
    }
    if (this.offIconKey) {
      this.offIconText = new IconText({
        scene,
        x: 0,
        y: 0,
        icon: this.offIconKey,
        size: this.sizePx,
        style: { color: this.iconColorValue },
      });
      this.offIconText.setFontStyle('900');
      this.offIconText.setOrigin(0.5, 0.5);
      scene.add.existing(this.offIconText);
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
      this.trackWidthPx,
      this.trackHeightPx,
      0x000000,
      0
    );
    this.hitRect.setOrigin(0.5, 0.5);
  }

  private setupContainer(): void {
    // The handle group: handle sprite + both icons stacked at the same
    // position. We translate this group between on/off X.
    const groupChildren: GameObjects.GameObject[] = [this.handleSprite];
    if (this.onIconText) groupChildren.push(this.onIconText);
    if (this.offIconText) groupChildren.push(this.offIconText);
    this.handleGroup = this.scene.add.container(0, 0, groupChildren);

    // Switch container: track + handle group.
    const switchContainer = this.scene.add.container(0, 0, [
      this.trackSprite,
      this.handleGroup,
    ]);
    switchContainer.setSize(this.trackWidthPx, this.trackHeightPx);

    // Outer: hit rect + horizontal Stack (switch + optional label).
    const stackChildren: GameObjects.GameObject[] = [switchContainer];
    if (this.labelText) stackChildren.push(this.labelText);
    const contentStack = new Stack({
      scene: this.scene,
      x: 0,
      y: 0,
      direction: 'row',
      align: 'center',
      gap: this.labelGap,
      children: stackChildren,
    });

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
    const labelBounds = this.labelText?.getBounds();
    const labelWidth = labelBounds?.width ?? 0;
    const labelHeight = labelBounds?.height ?? 0;
    const totalWidth =
      this.trackWidthPx +
      (this.labelText ? this.labelGap + labelWidth : 0);
    const totalHeight = Math.max(this.trackHeightPx, labelHeight);
    this.hitRect.setSize(totalWidth, totalHeight);
    this.setSize(totalWidth, totalHeight);
  }

  private applyInitialState(): void {
    // Position the handle at the correct end and set icon visibility.
    this.handleGroup.x = this.checkedState ? this.handleXOn : this.handleXOff;
    if (this.onIconText) this.onIconText.setAlpha(this.checkedState ? 1 : 0);
    if (this.offIconText) this.offIconText.setAlpha(this.checkedState ? 0 : 1);
  }

  private applyDisabledVisual(): void {
    const targetAlpha = this.disabledState ? DISABLED_ALPHA : 1;
    this.trackSprite.setAlpha(targetAlpha);
    this.handleSprite.setAlpha(targetAlpha);
    if (this.onIconText && this.checkedState) {
      this.onIconText.setAlpha(targetAlpha);
    }
    if (this.offIconText && !this.checkedState) {
      this.offIconText.setAlpha(targetAlpha);
    }
    if (this.labelText) this.labelText.setAlpha(targetAlpha);
  }

  private animateToState(checked: boolean): void {
    // Swap the track texture instantly (color change).
    this.trackSprite.setTexture(this.trackTextureKey(checked));

    // Slide the handle.
    this.scene.tweens.killTweensOf(this.handleGroup);
    this.scene.tweens.add({
      targets: this.handleGroup,
      x: checked ? this.handleXOn : this.handleXOff,
      duration: SLIDE_DURATION_MS,
      ease: SLIDE_EASE,
    });

    // Cross-fade icons if they differ. When only one is set, the other side
    // fades in/out from 0.
    const iconTargetAlpha = this.disabledState ? DISABLED_ALPHA : 1;
    if (this.onIconText) {
      this.scene.tweens.killTweensOf(this.onIconText);
      this.scene.tweens.add({
        targets: this.onIconText,
        alpha: checked ? iconTargetAlpha : 0,
        duration: ICON_FADE_DURATION_MS,
        ease: 'Sine.easeInOut',
      });
    }
    if (this.offIconText) {
      this.scene.tweens.killTweensOf(this.offIconText);
      this.scene.tweens.add({
        targets: this.offIconText,
        alpha: checked ? 0 : iconTargetAlpha,
        duration: ICON_FADE_DURATION_MS,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private trackTextureKey(on: boolean): string {
    const colorHex = on ? this.trackOnColorHex : this.trackOffColorHex;
    return `toggle_track_${colorHex}_${this.borderRadiusPx}_${this.trackWidthPx}_${this.trackHeightPx}`;
  }

  private drawTrackTexture(
    scene: Scene,
    textureKey: string,
    colorHex: number
  ): void {
    if (scene.textures.exists(textureKey)) return;
    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureWidth = this.trackWidthPx + padding * 2;
    const textureHeight = this.trackHeightPx + padding * 2;

    const graphics = scene.add.graphics();
    const maxRadius = Math.floor(this.trackHeightPx / 2);
    const radius = Math.min(this.borderRadiusPx, maxRadius);

    graphics.fillStyle(colorHex, 1);
    graphics.fillRoundedRect(
      padding,
      padding,
      this.trackWidthPx,
      this.trackHeightPx,
      radius
    );

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();
  }

  private drawHandleTexture(scene: Scene, textureKey: string): void {
    if (scene.textures.exists(textureKey)) return;
    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureSide = this.handleDiameterPx + padding * 2;

    const graphics = scene.add.graphics();
    graphics.fillStyle(this.handleColorHex, 1);
    // Full circle via radius = diameter/2.
    graphics.fillRoundedRect(
      padding,
      padding,
      this.handleDiameterPx,
      this.handleDiameterPx,
      this.handleDiameterPx / 2
    );

    graphics.generateTexture(textureKey, textureSide, textureSide);
    graphics.destroy();
  }
}
