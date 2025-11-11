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

import { getPWFromScene } from '../../utils/get-pw-from-scene';

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
  backgroundColor?: ColorKey | string;
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
   * Margin/padding in px (number) or a Phaser Wind spacing token (string). 
   * Defaults to 'md'.
   */
  margin?: SpacingKey | number;
  /** 
   * Callback function for click event.
   */
  onClick?: () => void;
};

const durations = {
  click: 100,
  hover: 150,
};

const HOVER_SCALE = 1.05;
const CLICK_OFFSET = 2;
const SHADOW_OFFSET = 4;
const SHADOW_OPACITY = 0.15;

/**
 * A customizable text button component for Phaser, supporting auto-sizing, 
 * design tokens, and interactive effects.
 */
export class TextButton extends GameObjects.Container {
  /** The background sprite of the button. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The shadow sprite of the button. */
  public shadowSprite!: GameObjects.Sprite;
  /** The text object of the button. */
  public buttonText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private marginPx!: number;
  private borderRadiusPx!: number;
  private backgroundColorValue!: string;
  private textColorValue!: string;
  private fontValue!: string;
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
    fontSize = 'base',
    font,
    backgroundColor = 'blue',
    textColor = 'white',
    borderRadius = 'md',
    margin = '4',
    onClick,
  }: TextButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    // Store values
    this.textValue = text;
    this.fontSizePx =
      typeof fontSize === 'number'
        ? fontSize
        : this.pw.fontSize.px(fontSize ?? ('md' as FontSizeKey));
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));

    this.backgroundColorValue = Color.rgb(backgroundColor as ColorKey);
    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontValue =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('primary' as FontKey));

    this.createButtonText(scene);
    this.createShadowSprite(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.setupInteractivity(onClick);
  }

  // API Methods

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
    this.fontValue =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('primary' as FontKey));
    this.buttonText.setFontFamily(this.fontValue);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the background color.
   * @param color Color as token or CSS string.
   * @returns This TextButton instance.
   */
  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
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
   * Sets the margin (padding).
   * @param margin Margin in px or token.
   * @returns This TextButton instance.
   */
  public setMargin(margin: SpacingKey | number): this {
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.regenerateSprites();
    return this;
  }

  /**
   * Creates the button text GameObject.
   * @param scene Phaser scene.
   */
  private createButtonText(scene: Scene): void {
    this.buttonText = scene.add.text(0, 0, this.textValue, {
      fontSize: `${this.fontSizePx}px`,
      fontFamily: this.fontValue,
      color: this.textColorValue,
    });
    this.buttonText.setOrigin(0.5, 0.5);
  }

  /**
   * Creates the shadow sprite for the button.
   * @param scene Phaser scene.
   */
  private createShadowSprite(scene: Scene): void {
    const shadowTexture = this.createShadowTexture(scene);
    this.shadowSprite = scene.add.sprite(0, SHADOW_OFFSET, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
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
    const shadowTexture = this.createShadowTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.shadowSprite.setTexture(shadowTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  /**
   * Calculates the button's width and height based on text and margin.
   * @returns Object with width and height.
   */
  private getButtonDimensions(): { width: number; height: number } {
    const textBounds = this.buttonText.getBounds();
    const width = textBounds.width + this.marginPx * 2;
    const height = textBounds.height + this.marginPx * 2;
    return { width, height };
  }

  /**
   * Creates a texture for the button's shadow.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createShadowTexture(scene: Scene): string {
    const { width, height } = this.getButtonDimensions();
    const textureKey = `textButton_shadow_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for shadow
    const shadowPadding = 8;
    const textureWidth = width + shadowPadding * 2;
    const textureHeight = height + shadowPadding * 2;

    const graphics = scene.add.graphics();

    // Limit radius to maximum possible for the button dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Shadow
    graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
    graphics.fillRoundedRect(
      shadowPadding,
      shadowPadding + SHADOW_OFFSET,
      width,
      height,
      effectiveRadius
    );

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Creates a texture for the button's background.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getButtonDimensions();
    const textureKey = `textButton_bg_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    // Limit radius to maximum possible for the button dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Main background
    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Adds the button's visual elements to the container.
   */
  private setupContainer(): void {
    this.add([this.shadowSprite, this.backgroundSprite, this.buttonText]);
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
        scaleX: HOVER_SCALE,
        scaleY: HOVER_SCALE,
        duration: durations.hover,
        ease: 'Back.easeOut',
      });
    });

    this.backgroundSprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: durations.hover,
        ease: 'Back.easeOut',
      });
    });

    // Click effects
    this.backgroundSprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.buttonText],
        y: CLICK_OFFSET,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.buttonText],
        y: 0,
        duration: durations.click,
        ease: 'Linear',
      });
      onClick?.();
    });
  }


  /**
   * Gets the interactive sprite of the icon button
   * @returns The interactive sprite
   */
  public get interactive(): Pick<GameObjects.Sprite, 'on' | 'off' | 'setInteractive' | 'setInteractive' | 'once'> {
    const { on, off, setInteractive, once } = this.backgroundSprite;
    return {
      on: on.bind(this.backgroundSprite),
      off: off.bind(this.backgroundSprite),
      setInteractive: setInteractive.bind(this.backgroundSprite),
      once: once.bind(this.backgroundSprite),
    };
  }
}
