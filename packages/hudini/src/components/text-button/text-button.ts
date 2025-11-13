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

import { getColorVariant } from '../../utils/color-variants';
import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Text } from '../text';

/**
 * Parameters for creating a TextButton.
 */
export type TextButtonParams = {
  /** Phaser scene where the button will be added. */
  scene: Scene;
  /** X position of the button. */
  x: number;
  /** Y position of the button. */
  y: number;
  /** Button text. */
  text: string;
  /** 
   * Font size in px (number) or a Phaser Wind font size token (string). 
   * Defaults to 'md'.
   */
  fontSize?: FontSizeKey | number;
  /** 
   * Font family. Defaults to 'sans'.
   */
  font?: FontKey | string;
  /** 
   * Background color. Defaults to 'blue'.
   */
  color?: ColorKey | string;
  /** 
   * Text color. Defaults to 'white'.
   */
  textColor?: ColorKey | string;
  /** 
   * Border radius in px (number) or a Phaser Wind radius token (string). 
   * Defaults to 'md'.
   */
  borderRadius?: RadiusKey | number;
  /** 
   * Padding in px (number) or a Phaser Wind spacing token (string). 
   * Defaults to 'md'.
   */
  padding?: SpacingKey | number;
  /** 
   * Callback function for click event.
   */
  onClick?: () => void;
};

const durations = {
  click: 60,
  hover: 100,
};

const HOVER_SCALE = 1.05;
const POINTER_DOWN_SCALE = 0.95;
const TOKEN_LIGHTER_DIFF = -100;
const TOKEN_DARKER_DIFF = 100;

const COLOR_LIGHTER_AMOUNT = 30;
const COLOR_DARKER_AMOUNT = -30;

/**
 * A customizable text button component for Phaser, supporting auto-sizing,
 * design tokens, and interactive effects.
 */
export class TextButton extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the button. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The text object of the button. */
  public buttonText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private paddingPx!: number;
  private borderRadiusPx!: number;
  private colorButton!: string;
  private lightColorButton!: number;
  private darkColorButton!: number;
  private textColorValue!: string;
  private fontFamily!: string;
  private textValue!: string;
  /**
   * Creates a new TextButton instance.
   * @param params TextButtonParams
   */
  constructor({
    scene,
    x,
    y,
    text,
    fontSize = 'lg',
    font,
    color = 'blue',
    textColor = 'white',
    borderRadius = 'md',
    padding = '4',
    onClick,
  }: TextButtonParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    // Store values
    this.textValue = text;
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('md' as FontSizeKey));

    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));

    this.colorButton = Color.rgb(color as ColorKey);
    this.lightColorButton = getColorVariant(color, TOKEN_LIGHTER_DIFF, COLOR_LIGHTER_AMOUNT);
    this.darkColorButton = getColorVariant(color, TOKEN_DARKER_DIFF, COLOR_DARKER_AMOUNT);

    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontFamily = font ? (typeof font === 'string' ? font : this.pw.font.family(font)) : 'Bebas Neue';

    this.createButtonText(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.setupInteractivity(onClick);

    this.hitArea = this.backgroundSprite;
  }

  /**
   * Sets the button text.
   * @param text The new text.
   * @returns This TextButton instance.
   */
  public setText(text: string): this {
    this.textValue = text;
    this.buttonText.setText(text);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the font size.
   * @param fontSize Font size in px or token.
   * @returns This TextButton instance.
   */
  public setFontSize(fontSize: FontSizeKey | number): this {
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('md' as FontSizeKey));
    this.buttonText.setFontSize(this.fontSizePx);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the font family.
   * @param font Font family as string or token.
   * @returns This TextButton instance.
   */
  public setFont(font: FontKey | string): this {
    this.fontFamily =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('primary' as FontKey));
    this.buttonText.setFontFamily(this.fontFamily);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the background color.
   * @param color Color as token or CSS string.
   * @returns This TextButton instance.
   */
  public setColor(color: ColorKey | string): this {
    this.colorButton = Color.rgb(color as ColorKey);
    this.lightColorButton = getColorVariant(color, TOKEN_LIGHTER_DIFF, COLOR_LIGHTER_AMOUNT);
    this.darkColorButton = getColorVariant(color, TOKEN_DARKER_DIFF, COLOR_DARKER_AMOUNT);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the text color.
   * @param color Color as token or CSS string.
   * @returns This TextButton instance.
   */
  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.buttonText.setColor(this.textColorValue);
    return this;
  }

  /**
   * Sets the border radius.
   * @param borderRadius Border radius in px or token.
   * @returns This TextButton instance.
   */
  public setBorderRadius(borderRadius: RadiusKey | number): this {
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the padding.
   * @param padding Padding in px or token.
   * @returns This TextButton instance.
   */
  public setPadding(padding: SpacingKey | number): this {
    this.paddingPx =
      typeof padding === 'number'
        ? padding
        : this.pw.spacing.px(padding ?? ('4' as SpacingKey));
    this.regenerateSprites();
    return this;
  }

  /**
   * Creates the button text GameObject.
   * @param scene Phaser scene.
   */
  private createButtonText(scene: Scene): void {
    this.buttonText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.textValue,
      size: this.fontSizePx,
      fontFamily: this.fontFamily,
    });
    this.buttonText.setOrigin(0.5, 0.5);
  }

  /**
   * Creates the background sprite for the button.
   * @param scene Phaser scene.
   */
  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  /**
   * Regenerates the background and shadow textures based on current state.
   */
  private regenerateSprites(): void {
    // Update text bounds after text/font changes
    this.buttonText.setText(this.textValue);

    // Regenerate textures
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.backgroundSprite.setTexture(backgroundTexture);
  }

  /**
   * Calculates the button's width and height based on text and margin.
   * @returns Object with width and height.
   */
  private getButtonDimensions(): { width: number; height: number } {
    const textBounds = this.buttonText.getBounds();
    const width = textBounds.width + this.paddingPx * 2;
    const height = textBounds.height + this.paddingPx * 2;
    return { width, height };
  }

  /**
   * Creates a texture for the button's background.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getButtonDimensions();
    const textureKey = `textButton_bg_${this.colorButton}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    // Limit radius to maximum possible for the button dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    this.drawCssColorGradient(graphics, padding, width, height, effectiveRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws gradient using white/black overlays on CSS color.
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

    // Top lighter overlay (white with alpha)
    const PERCENT_HEIGHT = 0.15;
    const overlayHeight = height * PERCENT_HEIGHT;
    graphics.fillStyle(this.lightColorButton, 1);
    graphics.fillRoundedRect(padding, padding, width, overlayHeight, effectiveRadius);

    // Bottom darker overlay (black with alpha)
    graphics.fillStyle(this.darkColorButton, 1);
    graphics.fillRoundedRect(
      padding,
      padding + height - overlayHeight,
      width,
      overlayHeight,
      effectiveRadius,
    );

    // Black stroke border
    graphics.lineStyle(2, Color.hex('black'), 1);
    graphics.strokeRoundedRect(padding, padding, width, height, effectiveRadius);
  }

  /**
   * Adds the button's visual elements to the container.
   */
  private setupContainer(): void {
    this.add([this.backgroundSprite, this.buttonText]);
  }

  /**
   * Sets up interactivity for the button, including hover and click effects.
   * @param onClick Optional click callback.
   */
  private setupInteractivity(onClick?: () => void): void {
    this.backgroundSprite.setInteractive({ useHandCursor: true });

    // Hover effects
    this.backgroundSprite.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this,
        duration: durations.hover,
        scaleX: HOVER_SCALE,
        scaleY: HOVER_SCALE,
        ease: 'Back.easeOut',
      });
    });

    this.backgroundSprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this,
        duration: durations.hover,
        scaleX: 1,
        scaleY: 1,
        ease: 'Back.easeOut',
      });
    });

    // Click effects
    this.backgroundSprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.buttonText],
        scaleX: POINTER_DOWN_SCALE,
        scaleY: POINTER_DOWN_SCALE,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: durations.click,
        ease: 'Linear',
      });
      onClick?.();
    });
  }
}
