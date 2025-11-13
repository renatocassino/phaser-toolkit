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
import { ContainerInteractive } from '../container-interactive';
import { Text } from '../text';

/**
 * Parameters for creating a FlatTextButton.
 */
export type FlatTextButtonParams = {
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
   * Defaults to 'lg'.
   */
  fontSize?: FontSizeKey | number;
  /** 
   * Font family. Defaults to 'Bebas Neue'.
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
   * Defaults to '4'.
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

// Border constants
const BLACK_BORDER_THICKNESS = 2;
const WHITE_BORDER_EXTRA_PIXELS_PER_SIDE = 2;
const WHITE_BORDER_TOTAL_EXTRA_PIXELS = WHITE_BORDER_EXTRA_PIXELS_PER_SIDE * 2; // 4 pixels total
const WHITE_BORDER_RADIUS_EXTRA = 2;

/**
 * A customizable flat text button component for Phaser, supporting auto-sizing,
 * design tokens, and interactive effects.
 */
export class FlatTextButton extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the button. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The white border sprite of the button. */
  public whiteBorderSprite!: GameObjects.Sprite;
  /** The text object of the button. */
  public buttonText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private paddingPx!: number;
  private borderRadiusPx!: number;
  private colorButton!: string;
  private textColorValue!: string;
  private fontFamily!: string;
  private textValue!: string;

  /**
   * Creates a new FlatTextButton instance.
   * @param params FlatTextButtonParams
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
  }: FlatTextButtonParams) {
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
    this.textColorValue = Color.rgb(textColor as ColorKey);
    this.fontFamily = font ? (typeof font === 'string' ? font : this.pw.font.family(font)) : 'Bebas Neue';

    this.createButtonText(scene);
    this.createWhiteBorderSprite(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.setupInteractivity(onClick);

    this.hitArea = this.backgroundSprite;
  }

  // API Methods

  /**
   * Sets the button text.
   * @param text The new text.
   * @returns This FlatTextButton instance.
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
   * @returns This FlatTextButton instance.
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
   * @returns This FlatTextButton instance.
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
   * @returns This FlatTextButton instance.
   */
  public setColor(color: ColorKey | string): this {
    this.colorButton = Color.rgb(color as ColorKey);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the text color.
   * @param color Color as token or CSS string.
   * @returns This FlatTextButton instance.
   */
  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.buttonText.setColor(this.textColorValue);
    return this;
  }

  /**
   * Sets the border radius.
   * @param borderRadius Border radius in px or token.
   * @returns This FlatTextButton instance.
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
   * @returns This FlatTextButton instance.
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
   * Creates the white border sprite for the button.
   * @param scene Phaser scene.
   */
  private createWhiteBorderSprite(scene: Scene): void {
    const whiteBorderTexture = this.createWhiteBorderTexture(scene);
    this.whiteBorderSprite = scene.add.sprite(0, 0, whiteBorderTexture);
    this.whiteBorderSprite.setOrigin(0.5, 0.5);
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
   * Regenerates the background texture based on current state.
   */
  private regenerateSprites(): void {
    // Update text bounds after text/font changes
    this.buttonText.setText(this.textValue);

    // Regenerate textures
    const whiteBorderTexture = this.createWhiteBorderTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  /**
   * Calculates the button's width and height based on text and padding.
   * @returns Object with width and height.
   */
  private getButtonDimensions(): { width: number; height: number } {
    const textBounds = this.buttonText.getBounds();
    const width = textBounds.width + this.paddingPx * 2;
    const height = textBounds.height + this.paddingPx * 2;
    return { width, height };
  }

  /**
   * Creates a texture for the button's white border.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createWhiteBorderTexture(scene: Scene): string {
    const { width, height } = this.getButtonDimensions();
    const textureKey = `flatTextButton_whiteBorder_${this.borderRadiusPx}_${width}_${height}`;

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
   * Creates a texture for the button's background.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getButtonDimensions();
    const textureKey = `flatTextButton_bg_${this.colorButton}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    // Main background (flat, no gradient overlays)
    graphics.fillStyle(Color.hex(this.colorButton), 1);
    graphics.fillRoundedRect(padding, padding, width, height, finalRadius);

    // Black stroke border
    graphics.lineStyle(BLACK_BORDER_THICKNESS, Color.hex('black'), 1);
    graphics.strokeRoundedRect(padding, padding, width, height, finalRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Adds the button's visual elements to the container.
   */
  private setupContainer(): void {
    this.add([this.whiteBorderSprite, this.backgroundSprite, this.buttonText]);
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
        targets: [this.whiteBorderSprite, this.backgroundSprite, this.buttonText],
        scaleX: POINTER_DOWN_SCALE,
        scaleY: POINTER_DOWN_SCALE,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.whiteBorderSprite, this.backgroundSprite, this.buttonText],
        scaleX: 1,
        scaleY: 1,
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
