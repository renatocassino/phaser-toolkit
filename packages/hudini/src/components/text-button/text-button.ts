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

export type TextButtonParams = {
  scene: Scene;
  x: number;
  y: number;
  text: string;
  /** Font size in px (number) or a Phaser Wind font size token (string). Defaults to 'md'. */
  textSize?: FontSizeKey | number;
  /** Font family. Defaults to 'sans'. */
  font?: FontKey | string;
  /** Background color. Defaults to 'blue'. */
  backgroundColor?: ColorKey | string;
  /** Text color. Defaults to 'white'. */
  textColor?: ColorKey | string;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'md'. */
  borderRadius?: RadiusKey | number;
  /** Margin/padding in px (number) or a Phaser Wind spacing token (string). Defaults to 'md'. */
  margin?: SpacingKey | number;
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

export class TextButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public shadowSprite!: GameObjects.Sprite;
  public buttonText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private textSizePx!: number;
  private marginPx!: number;
  private borderRadiusPx!: number;
  private backgroundColorValue!: string;
  private textColorValue!: string;
  private fontValue!: string;
  private textValue!: string;

  constructor({
    scene,
    x,
    y,
    text,
    textSize,
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
    this.textSizePx =
      typeof textSize === 'number'
        ? textSize
        : this.pw.fontSize.px(textSize ?? ('md' as FontSizeKey));
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
  public setText(text: string): this {
    this.textValue = text;
    this.buttonText.setText(text);
    this.regenerateSprites();
    return this;
  }

  public setTextSize(textSize: FontSizeKey | number): this {
    this.textSizePx =
      typeof textSize === 'number'
        ? textSize
        : this.pw.fontSize.px(textSize ?? ('md' as FontSizeKey));
    this.buttonText.setFontSize(this.textSizePx);
    this.regenerateSprites();
    return this;
  }

  public setFont(font: FontKey | string): this {
    this.fontValue =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('primary' as FontKey));
    this.buttonText.setFontFamily(this.fontValue);
    this.regenerateSprites();
    return this;
  }

  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
    this.regenerateSprites();
    return this;
  }

  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.buttonText.setColor(this.textColorValue);
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

  public setMargin(margin: SpacingKey | number): this {
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.regenerateSprites();
    return this;
  }

  private createButtonText(scene: Scene): void {
    this.buttonText = scene.add.text(0, 0, this.textValue, {
      fontSize: `${this.textSizePx}px`,
      fontFamily: this.fontValue,
      color: this.textColorValue,
    });
    this.buttonText.setOrigin(0.5, 0.5);
  }

  private createShadowSprite(scene: Scene): void {
    const shadowTexture = this.createShadowTexture(scene);
    this.shadowSprite = scene.add.sprite(0, SHADOW_OFFSET, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
  }

  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private regenerateSprites(): void {
    // Update text bounds after text/font changes
    this.buttonText.setText(this.textValue);

    // Regenerate textures
    const shadowTexture = this.createShadowTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.shadowSprite.setTexture(shadowTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  private getButtonDimensions(): { width: number; height: number } {
    const textBounds = this.buttonText.getBounds();
    const width = textBounds.width + this.marginPx * 2;
    const height = textBounds.height + this.marginPx * 2;
    return { width, height };
  }

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

  private setupContainer(): void {
    this.add([this.shadowSprite, this.backgroundSprite, this.buttonText]);
  }

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
}
