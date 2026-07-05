/* eslint-disable max-lines-per-function */
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
import { Text } from '../text';

/**
 * Parameters for creating a Badge.
 *
 * Same visual language as `TextButton` (flat fill + outlined text), but
 * without interactivity — meant for titles on top of a panel, tags,
 * status pills, notification counts, etc.
 */
export type BadgeParams = {
  /** Phaser scene where the badge will be added. */
  scene: Scene;
  /** X position of the badge. */
  x: number;
  /** Y position of the badge. */
  y: number;
  /** Badge text. */
  text: string;
  /**
   * Font size in px (number) or a Phaser Wind font size token (string).
   * Defaults to `'lg'`.
   */
  fontSize?: FontSizeKey | number;
  /**
   * Font family. Defaults to `'Fredoka'` (the Hudini base font).
   */
  font?: FontKey | string;
  /**
   * Background color. Accepts a palette family (`'blue'`), a full token
   * (`'blue-600'`), a theme key, or a CSS string. Defaults to `'blue-600'`.
   */
  color?: ColorKey | string;
  /**
   * Text color. Defaults to `'white'`.
   */
  textColor?: ColorKey | string;
  /**
   * Border radius in px (number) or a Phaser Wind radius token. Defaults to
   * `'md'`.
   */
  borderRadius?: RadiusKey | number;
  /**
   * Inner padding around the text in px (number) or a Phaser Wind spacing
   * token. Defaults to `'4'`.
   */
  padding?: SpacingKey | number;
};

/**
 * Extra transparent margin around the drawn badge inside its texture, just
 * enough so the anti-aliased rounded-corner fill isn't clipped at the edge.
 * The container itself is resized to the *visual* box (see setSize below),
 * so this margin never leaks into layout measurements.
 */
const TEXTURE_ANTIALIAS_MARGIN = 1;

/**
 * A flat, non-interactive labeled box — the static counterpart to
 * `TextButton`. Uses the same fill + outlined-text visual language and shares
 * `getButtonStrokeColor` / `BUTTON_STROKE_THICKNESS` with the buttons, so the
 * UI kit stays cohesive.
 */
export class Badge extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the badge. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The text object of the badge. */
  public badgeText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private paddingPx!: number;
  private borderRadiusPx!: number;
  private colorInput!: string;
  private colorBadge!: string;
  private textColorValue!: string;
  private fontFamily!: string;
  private textValue!: string;

  constructor({
    scene,
    x,
    y,
    text,
    fontSize = 'lg',
    font,
    color = 'blue-600',
    textColor = 'white',
    borderRadius = 'md',
    padding = '4',
  }: BadgeParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    this.textValue = text;
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('lg' as FontSizeKey));

    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));

    this.colorInput = String(color);
    this.colorBadge = Color.rgb(color as ColorKey);
    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontFamily = font
      ? typeof font === 'string'
        ? font
        : this.pw.font.family(font)
      : 'Fredoka';

    this.createBadgeText(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.hitArea = this.backgroundSprite;
    this.syncContainerSize();
  }

  public setText(text: string): this {
    this.textValue = text;
    this.badgeText.setText(text);
    this.regenerateSprites();
    return this;
  }

  public setFontSize(fontSize: FontSizeKey | number): this {
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('lg' as FontSizeKey));
    this.badgeText.setFontSize(this.fontSizePx);
    this.regenerateSprites();
    return this;
  }

  public setFont(font: FontKey | string): this {
    this.fontFamily =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('primary' as FontKey));
    this.badgeText.setFontFamily(this.fontFamily);
    this.regenerateSprites();
    return this;
  }

  public setColor(color: ColorKey | string): this {
    this.colorInput = String(color);
    this.colorBadge = Color.rgb(color as ColorKey);
    this.regenerateSprites();
    return this;
  }

  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.badgeText.setColor(this.textColorValue);
    return this;
  }

  public setBorderRadius(borderRadius: RadiusKey | number): this {
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.regenerateSprites();
    return this;
  }

  public setPadding(padding: SpacingKey | number): this {
    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));
    this.regenerateSprites();
    return this;
  }

  private createBadgeText(scene: Scene): void {
    this.badgeText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.textValue,
      size: this.fontSizePx,
      fontFamily: this.fontFamily,
      strokeThickness: BUTTON_STROKE_THICKNESS,
      strokeColor: getButtonStrokeColor(this.colorInput),
    });
    this.badgeText.setColor(this.textColorValue);
    this.badgeText.setOrigin(0.5, 0.5);
  }

  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private regenerateSprites(): void {
    this.badgeText.setText(this.textValue);
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.syncContainerSize();
  }

  /**
   * Keep the container's own width/height in sync with the visible badge box
   * (excluding the transparent margin baked into the sprite texture). This is
   * what layout containers like Row/Column read when computing positions.
   */
  private syncContainerSize(): void {
    const { width, height } = this.getBadgeDimensions();
    this.setSize(width, height);
  }

  private getBadgeDimensions(): { width: number; height: number } {
    const textBounds = this.badgeText.getBounds();
    const width = textBounds.width + this.paddingPx * 2;
    const height = textBounds.height + this.paddingPx * 2;
    return { width, height };
  }

  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getBadgeDimensions();
    const textureKey = `badge_bg_${this.colorBadge}_${this.borderRadiusPx}_${width}_${height}`;

    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    this.drawBadgeBackground(graphics, padding, width, height, finalRadius);
    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws the badge's background as a flat filled rounded rect.
   */
  private drawBadgeBackground(
    graphics: Phaser.GameObjects.Graphics,
    padding: number,
    width: number,
    height: number,
    effectiveRadius: number
  ): void {
    graphics.fillStyle(Color.hex(this.colorBadge), 1);
    graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);
  }

  private setupContainer(): void {
    this.add([this.backgroundSprite, this.badgeText]);
  }
}
