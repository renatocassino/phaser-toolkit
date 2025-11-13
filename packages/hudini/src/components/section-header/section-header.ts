/* eslint-disable no-magic-numbers */
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

import { getColorVariant } from '../../utils/color-variants';
import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Text } from '../text';

export type SectionHeaderParams = {
  /** The Phaser scene to add the header to */
  scene: Scene;
  /** X position of the header */
  x: number;
  /** Y position of the header */
  y: number;
  /** Text content of the header */
  text: string;
  /** Font size in px (number) or a Phaser Wind font size token (string). Defaults to 'lg'. */
  fontSize?: FontSizeKey | number;
  /** Font family. Defaults to 'display'. */
  font?: FontKey | string;
  /** Background color. Defaults to 'blue-600'. */
  backgroundColor?: ColorKey | string;
  /** Text color. Defaults to 'white'. */
  textColor?: ColorKey | string;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'md'. */
  borderRadius?: RadiusKey | number;
  /** Margin/padding in px (number) or a Phaser Wind spacing token (string). Defaults to '4'. */
  margin?: SpacingKey | number;
};

// Border constants
const BLACK_BORDER_THICKNESS = 2;
const WHITE_BORDER_EXTRA_PIXELS_PER_SIDE = 2;
const WHITE_BORDER_TOTAL_EXTRA_PIXELS = WHITE_BORDER_EXTRA_PIXELS_PER_SIDE * 2; // 4 pixels total
const WHITE_BORDER_RADIUS_EXTRA = 2;

// Color variant constants
const TOKEN_LIGHTER_DIFF = -100;
const TOKEN_DARKER_DIFF = 100;
const COLOR_LIGHTER_AMOUNT = 30;
const COLOR_DARKER_AMOUNT = -30;

/**
 * A stylized section header component with shadow, text stroke and auto-sizing
 */
export class SectionHeader extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The white border sprite of the header */
  public whiteBorderSprite!: GameObjects.Sprite;
  /** The background sprite of the header */
  public backgroundSprite!: GameObjects.Sprite;
  /** The text object of the header */
  public headerText!: GameObjects.Text;

  /** Reference to the PhaserWind plugin */
  private pw: PhaserWindPlugin<{}>;
  /** Font size in pixels */
  private fontSizePx!: number;
  /** Margin size in pixels */
  private marginPx!: number;
  /** Border radius in pixels */
  private borderRadiusPx!: number;
  /** Background color value */
  private colorButton!: string;
  /** Light color variant for gradient */
  private lightColorButton!: number;
  /** Dark color variant for gradient */
  private darkColorButton!: number;
  /** Text color value */
  private textColorValue!: string;
  /** Font family value */
  private fontFamily!: string;
  /** Text content value */
  private textValue!: string;

  /**
   * Creates a new SectionHeader
   * @param params Configuration parameters for the header
   */
  constructor({
    scene,
    x,
    y,
    text,
    fontSize,
    font,
    backgroundColor = 'blue-600',
    textColor = 'white',
    borderRadius = 'md',
    margin = '4',
  }: SectionHeaderParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    // Store values
    this.textValue = text;
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('lg' as FontSizeKey));
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));

    this.colorButton = Color.rgb(backgroundColor as ColorKey);
    this.lightColorButton = getColorVariant(backgroundColor as string, TOKEN_LIGHTER_DIFF, COLOR_LIGHTER_AMOUNT);
    this.darkColorButton = getColorVariant(backgroundColor as string, TOKEN_DARKER_DIFF, COLOR_DARKER_AMOUNT);
    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontFamily = font ? (typeof font === 'string' ? font : this.pw.font.family(font)) : 'Bebas Neue';

    this.createHeaderText(scene);
    this.createWhiteBorderSprite(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    
    this.hitArea = this.backgroundSprite;
  }

  /**
   * Sets the text content of the header
   * @param text New text content
   * @returns this for chaining
   */
  public setText(text: string): this {
    this.textValue = text;
    this.headerText.setText(text);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the font size of the header text
   * @param fontSize New font size (number in px or FontSizeKey)
   * @returns this for chaining
   */
  public setFontSize(fontSize: FontSizeKey | number): this {
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('lg' as FontSizeKey));
    this.headerText.setFontSize(this.fontSizePx);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the font family of the header text
   * @param font New font family (FontKey or string)
   * @returns this for chaining
   */
  public setFont(font: FontKey | string): this {
    this.fontFamily = font ? (typeof font === 'string' ? font : this.pw.font.family(font)) : 'Bebas Neue';
    this.headerText.setFontFamily(this.fontFamily);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the background color of the header
   * @param color New background color (ColorKey or string)
   * @returns this for chaining
   */
  public setBackgroundColor(color: ColorKey | string): this {
    this.colorButton = Color.rgb(color as ColorKey);
    this.lightColorButton = getColorVariant(color as string, TOKEN_LIGHTER_DIFF, COLOR_LIGHTER_AMOUNT);
    this.darkColorButton = getColorVariant(color as string, TOKEN_DARKER_DIFF, COLOR_DARKER_AMOUNT);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the text color of the header
   * @param color New text color (ColorKey or string)
   * @returns this for chaining
   */
  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.headerText.setColor(this.textColorValue);
    return this;
  }


  /**
   * Sets the border radius of the header
   * @param borderRadius New border radius (number in px or RadiusKey)
   * @returns this for chaining
   */
  public setBorderRadius(borderRadius: RadiusKey | number): this {
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the margin/padding of the header
   * @param margin New margin size (number in px or SpacingKey)
   * @returns this for chaining
   */
  public setMargin(margin: SpacingKey | number): this {
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.regenerateGraphics();
    return this;
  }

  /**
   * Creates the header text game object
   * @param scene The scene to add the text to
   */
  private createHeaderText(scene: Scene): void {
    this.headerText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.textValue,
      size: this.fontSizePx,
      fontFamily: this.fontFamily,
    });
    this.headerText.setOrigin(0.5, 0.5);
  }

  /**
   * Creates the white border sprite for the header
   * @param scene The scene to add the sprite to
   */
  private createWhiteBorderSprite(scene: Scene): void {
    const whiteBorderTexture = this.createWhiteBorderTexture(scene);
    this.whiteBorderSprite = scene.add.sprite(0, 0, whiteBorderTexture);
    this.whiteBorderSprite.setOrigin(0.5, 0.5);
  }

  /**
   * Creates the background sprite for the header
   * @param scene The scene to add the sprite to
   */
  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  /**
   * Regenerates all graphics after a property change
   */
  private regenerateGraphics(): void {
    // Update text bounds after text/font changes
    this.headerText.setText(this.textValue);

    // Regenerate textures
    const whiteBorderTexture = this.createWhiteBorderTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  /**
   * Creates a texture for the header's white border.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createWhiteBorderTexture(scene: Scene): string {
    const { width, height } = this.getHeaderDimensions();
    const textureKey = `sectionHeader_whiteBorder_${this.borderRadiusPx}_${width}_${height}`;

    // White border is larger on each side
    const borderWidth = width + WHITE_BORDER_TOTAL_EXTRA_PIXELS;
    const borderHeight = height + WHITE_BORDER_TOTAL_EXTRA_PIXELS;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = borderWidth + padding * 2;
    const textureHeight = borderHeight + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(borderWidth / 2, borderHeight / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx + WHITE_BORDER_RADIUS_EXTRA, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    // White border (outer)
    graphics.fillStyle(Color.hex('white'), 1);
    graphics.fillRoundedRect(
      padding,
      padding,
      borderWidth,
      borderHeight,
      finalRadius
    );

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Creates a texture for the header's background.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getHeaderDimensions();
    const textureKey = `sectionHeader_bg_${this.colorButton}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    this.drawCssColorGradient(graphics, padding, width, height, finalRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws gradient using light/dark overlays on CSS color.
   * Uses the same system as TextButton.
   */
  private drawCssColorGradient(
    graphics: Phaser.GameObjects.Graphics,
    padding: number,
    width: number,
    height: number,
    effectiveRadius: number
  ): void {
    // Main background
    graphics.fillStyle(Color.hex(this.colorButton), 1);
    graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);

    const PERCENT_HEIGHT = 0.15;
    const overlayHeight = height * PERCENT_HEIGHT;

    const topOverlayRadius = Math.min(effectiveRadius, overlayHeight / 2);
    graphics.fillStyle(this.lightColorButton, 1);
    graphics.fillRoundedRect(padding, padding, width, overlayHeight, topOverlayRadius);

    // Bottom darker overlay
    const bottomOverlayRadius = Math.min(effectiveRadius, overlayHeight / 2);
    graphics.fillStyle(this.darkColorButton, 1);
    graphics.fillRoundedRect(
      padding,
      padding + height - overlayHeight,
      width,
      overlayHeight,
      bottomOverlayRadius,
    );

    // Black stroke border
    graphics.lineStyle(BLACK_BORDER_THICKNESS, Color.hex('black'), 1);
    graphics.strokeRoundedRect(padding, padding, width, height, effectiveRadius);
  }

  /**
   * Gets the dimensions of the header based on text content
   * @returns Object containing width and height
   */
  private getHeaderDimensions(): { width: number; height: number } {
    const textBounds = this.headerText.getBounds();
    const width = textBounds.width + this.marginPx * 2;
    const height = textBounds.height + this.marginPx * 2;
    return { width, height };
  }

  /**
   * Sets up the container with all sprites in the correct order
   */
  private setupContainer(): void {
    this.add([this.whiteBorderSprite, this.backgroundSprite, this.headerText]);
  }

}