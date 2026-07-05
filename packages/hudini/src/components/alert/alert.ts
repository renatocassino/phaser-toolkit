/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontKey,
  type FontSizeKey,
  type RadiusKey,
  type SpacingKey,
} from 'phaser-wind';

import {
  BUTTON_STROKE_THICKNESS,
  getButtonStrokeColor,
} from '../../utils/button-style';
import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Stack } from '../stack';
import { Text } from '../text';

/**
 * Semantic color intent for an Alert. Each variant defines a default fill
 * color and (for the semantic ones) a default left icon — matching daisyUI's
 * alert conventions.
 */
export type AlertVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral';

/** Parameters for creating an {@link Alert}. */
export type AlertParams = {
  /** Phaser scene where the alert will be added. */
  scene: Scene;
  /** X position (center of the alert box). */
  x: number;
  /** Y position (center of the alert box). */
  y: number;
  /** Alert text. */
  text: string;
  /**
   * Semantic variant. Drives the default `color` and default `leftIcon`.
   * Defaults to `'info'`.
   */
  variant?: AlertVariant;
  /**
   * Background color. Overrides the variant's default. Accepts a palette
   * family (`'blue'`), a full token (`'blue-500'`), a theme key, or a CSS
   * string.
   */
  color?: ColorKey | string;
  /** Text color. Defaults to `'white'`. */
  textColor?: ColorKey | string;
  /**
   * Font Awesome icon shown to the LEFT of the text. When omitted, uses the
   * variant's default (`circle-check` for success, `circle-xmark` for error,
   * etc). Pass `null` to explicitly disable the default icon.
   */
  leftIcon?: IconKey | null;
  /**
   * Font Awesome icon shown to the RIGHT of the text. No default — omit for
   * no right icon, or pass an icon key (commonly `'xmark'` for a "close"
   * affordance).
   */
  rightIcon?: IconKey;
  /**
   * Font size in px (number) or a Phaser Wind font size token. Defaults to
   * `'base'`.
   */
  fontSize?: FontSizeKey | number;
  /** Font family. Defaults to `'Fredoka'`. */
  font?: FontKey | string;
  /**
   * Border radius in px (number) or a Phaser Wind radius token. Defaults to
   * `'md'`.
   */
  borderRadius?: RadiusKey | number;
  /**
   * Inner padding around the content in px (number) or a Phaser Wind spacing
   * token. Defaults to `'4'`.
   */
  padding?: SpacingKey | number;
  /**
   * Gap between icons and text in pixels. Defaults to a value proportional
   * to the font size.
   */
  iconGap?: number;
  /**
   * Optional click handler. When provided, the alert becomes interactive
   * and the cursor turns into a pointer on hover. When omitted, the alert
   * is a static banner.
   */
  onClick?: () => void;
};

type VariantConfig = {
  color: ColorKey;
  leftIcon: IconKey | undefined;
};

const VARIANT_CONFIGS: Record<AlertVariant, VariantConfig> = {
  success: { color: 'green-500' as ColorKey, leftIcon: 'circle-check' },
  error: { color: 'red-500' as ColorKey, leftIcon: 'circle-xmark' },
  warning: { color: 'yellow-500' as ColorKey, leftIcon: 'triangle-exclamation' },
  info: { color: 'blue-500' as ColorKey, leftIcon: 'circle-info' },
  neutral: { color: 'slate-600' as ColorKey, leftIcon: undefined },
};

/** See {@link TEXTURE_ANTIALIAS_MARGIN} in text-button. */
const TEXTURE_ANTIALIAS_MARGIN = 1;
const MIN_ICON_TEXT_GAP_PX = 4;
const ICON_TEXT_GAP_RATIO = 0.35;

/**
 * Alert — a static (or optionally clickable) notification banner.
 *
 * Same visual language as a filled `TextButton` (colored fill + white
 * outlined text + optional icons), but without hover/click tweens.
 * Semantic variants (`success`/`error`/`warning`/`info`/`neutral`) come with
 * sensible default colors and icons.
 *
 * Meant to be used inline (permanent banner, form error, achievement popup)
 * or wrapped in a Toast for auto-dismiss behavior (separate component).
 *
 * @example
 * new Alert({
 *   scene, x: 400, y: 100,
 *   variant: 'success',
 *   text: 'Player saved!',
 * });
 *
 * @example
 * // With a right icon acting as a "close" hint + a click handler
 * new Alert({
 *   scene, x: 400, y: 100,
 *   variant: 'warning',
 *   text: 'Low health!',
 *   rightIcon: 'xmark',
 *   onClick: () => alert.destroy(),
 * });
 */
export class Alert extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the alert. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The text object. */
  public alertText!: GameObjects.Text;
  /** The horizontal Stack composing [leftIcon?, text, rightIcon?]. */
  public contentStack!: Stack;
  /** Left icon glyph, when set (either by variant default or explicit). */
  public leftIconText: IconText | undefined;
  /** Right icon glyph, when explicitly set. */
  public rightIconText: IconText | undefined;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private paddingPx!: number;
  private borderRadiusPx!: number;
  private colorInput!: string;
  private colorAlert!: string;
  private textColorValue!: string;
  private fontFamily!: string;
  private textValue!: string;
  private variant!: AlertVariant;
  private leftIconKey: IconKey | undefined;
  private rightIconKey: IconKey | undefined;
  private iconGap: number | undefined;

  constructor({
    scene,
    x,
    y,
    text,
    variant = 'info',
    color,
    textColor = 'white',
    leftIcon,
    rightIcon,
    fontSize = 'base',
    font,
    borderRadius = 'md',
    padding = '4',
    iconGap,
    onClick,
  }: AlertParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    // Resolve variant defaults.
    const variantConfig = VARIANT_CONFIGS[variant];
    const resolvedColor = color ?? variantConfig.color;
    // `leftIcon === null` means "explicitly disable the default"; omitting
    // it falls back to the variant's default; passing an IconKey overrides.
    const resolvedLeftIcon =
      leftIcon === null
        ? undefined
        : leftIcon ?? variantConfig.leftIcon;

    this.variant = variant;
    this.textValue = text;
    this.leftIconKey = resolvedLeftIcon;
    this.rightIconKey = rightIcon;
    this.iconGap = iconGap;

    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('base' as FontSizeKey));

    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));

    this.colorInput = String(resolvedColor);
    this.colorAlert = Color.rgb(resolvedColor as ColorKey);

    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontFamily = font
      ? typeof font === 'string'
        ? font
        : this.pw.font.family(font)
      : 'Fredoka';

    this.createAlertContent(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.hitArea = this.backgroundSprite;
    if (onClick) {
      this.setupClickHandler(onClick);
    }
    this.syncContainerSize();
  }

  /** Change the alert text. */
  public setText(text: string): this {
    this.textValue = text;
    this.alertText.setText(text);
    this.contentStack.layout();
    this.regenerateSprites();
    return this;
  }

  /** Change the background color (overrides the variant's default). */
  public setColor(color: ColorKey | string): this {
    this.colorInput = String(color);
    this.colorAlert = Color.rgb(color as ColorKey);
    // Text stroke derives from colorInput — rebuild content.
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /** Change the text color. */
  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.alertText.setColor(this.textColorValue);
    this.leftIconText?.setColor(this.textColorValue);
    this.rightIconText?.setColor(this.textColorValue);
    return this;
  }

  /**
   * Switch to another semantic variant. Applies the variant's default color
   * and left icon unless the caller had previously overridden them (in which
   * case the overrides stick — call `setColor` / `setLeftIcon` separately to
   * clear them).
   */
  public setVariant(variant: AlertVariant): this {
    if (this.variant === variant) return this;
    this.variant = variant;
    const cfg = VARIANT_CONFIGS[variant];
    this.colorInput = String(cfg.color);
    this.colorAlert = Color.rgb(cfg.color);
    this.leftIconKey = cfg.leftIcon;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /** Set (or clear with `undefined`) the left icon. */
  public setLeftIcon(icon: IconKey | undefined): this {
    this.leftIconKey = icon;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /** Set (or clear with `undefined`) the right icon. */
  public setRightIcon(icon: IconKey | undefined): this {
    this.rightIconKey = icon;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /** Change the border radius. */
  public setBorderRadius(borderRadius: RadiusKey | number): this {
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.regenerateSprites();
    return this;
  }

  /** Change the inner padding. */
  public setPadding(padding: SpacingKey | number): this {
    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));
    this.regenerateSprites();
    return this;
  }

  private createAlertContent(scene: Scene): void {
    const strokeThickness = BUTTON_STROKE_THICKNESS;
    const strokeColor = getButtonStrokeColor(this.colorInput);

    this.alertText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.textValue,
      size: this.fontSizePx,
      fontFamily: this.fontFamily,
      strokeThickness,
      strokeColor,
    });
    this.alertText.setColor(this.textColorValue);
    this.alertText.setOrigin(0.5, 0.5);

    this.leftIconText = this.leftIconKey
      ? this.createIcon(scene, this.leftIconKey, strokeColor, strokeThickness)
      : undefined;
    this.rightIconText = this.rightIconKey
      ? this.createIcon(scene, this.rightIconKey, strokeColor, strokeThickness)
      : undefined;

    const children: GameObjects.GameObject[] = [];
    if (this.leftIconText) children.push(this.leftIconText);
    children.push(this.alertText);
    if (this.rightIconText) children.push(this.rightIconText);

    const gap =
      this.iconGap ??
      Math.max(
        MIN_ICON_TEXT_GAP_PX,
        Math.round(this.fontSizePx * ICON_TEXT_GAP_RATIO)
      );
    this.contentStack = new Stack({
      scene,
      x: 0,
      y: 0,
      direction: 'row',
      align: 'center',
      gap,
      children,
    });
  }

  private createIcon(
    scene: Scene,
    icon: IconKey,
    strokeColor: string,
    strokeThickness: number
  ): IconText {
    const iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon,
      size: this.fontSizePx,
      style: {
        color: this.textColorValue,
        strokeThickness,
        stroke: strokeColor,
      },
    });
    iconText.setFontStyle('900');
    iconText.setOrigin(0.5, 0.5);
    scene.add.existing(iconText);
    return iconText;
  }

  private rebuildContent(): void {
    this.remove(this.contentStack, true);
    this.createAlertContent(this.scene);
    this.add(this.contentStack);
  }

  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private regenerateSprites(): void {
    this.alertText.setText(this.textValue);
    this.contentStack.layout();
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.syncContainerSize();
  }

  private syncContainerSize(): void {
    const { width, height } = this.getAlertDimensions();
    this.setSize(width, height);
  }

  private getAlertDimensions(): { width: number; height: number } {
    const contentWidth = this.contentStack.width;
    const contentHeight = this.contentStack.height;
    return {
      width: contentWidth + this.paddingPx * 2,
      height: contentHeight + this.paddingPx * 2,
    };
  }

  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getAlertDimensions();
    const textureKey = `alert_bg_${this.colorAlert}_${this.borderRadiusPx}_${width}_${height}`;

    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    graphics.fillStyle(Color.hex(this.colorAlert), 1);
    graphics.fillRoundedRect(padding, padding, width, height, finalRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  private setupContainer(): void {
    this.add([this.backgroundSprite, this.contentStack]);
  }

  private setupClickHandler(onClick: () => void): void {
    this.backgroundSprite.setInteractive({ useHandCursor: true });
    this.backgroundSprite.on('pointerdown', onClick);
  }
}
