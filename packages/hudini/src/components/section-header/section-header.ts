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

export type SectionHeaderParams = {
  scene: Scene;
  x: number;
  y: number;
  text: string;
  /** Font size in px (number) or a Phaser Wind font size token (string). Defaults to 'lg'. */
  textSize?: FontSizeKey | number;
  /** Font family. Defaults to 'display'. */
  font?: FontKey | string;
  /** Background color. Defaults to 'blue-600'. */
  backgroundColor?: ColorKey | string;
  /** Text color. Defaults to 'white'. */
  textColor?: ColorKey | string;
  /** Text stroke color. Defaults to a darker version of backgroundColor. */
  strokeColor?: ColorKey | string;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'md'. */
  borderRadius?: RadiusKey | number;
  /** Margin/padding in px (number) or a Phaser Wind spacing token (string). Defaults to '4'. */
  margin?: SpacingKey | number;
};

const SHADOW_OFFSET_Y = 4;
const SHADOW_OPACITY = 0.25;
const STROKE_THICKNESS = 2;

export class SectionHeader extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public shadowSprite!: GameObjects.Sprite;
  public headerText!: GameObjects.Text;

  private pw: PhaserWindPlugin<{}>;
  private textSizePx!: number;
  private marginPx!: number;
  private borderRadiusPx!: number;
  private backgroundColorValue!: string;
  private textColorValue!: string;
  private strokeColorValue!: string;
  private fontValue!: string;
  private textValue!: string;

  constructor({
    scene,
    x,
    y,
    text,
    textSize,
    font,
    backgroundColor = 'blue-600',
    textColor = 'white',
    strokeColor,
    borderRadius = 'md',
    margin = '4',
  }: SectionHeaderParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    // Store values
    this.textValue = text;
    this.textSizePx =
      typeof textSize === 'number'
        ? textSize
        : this.pw.fontSize.px(textSize ?? ('lg' as FontSizeKey));
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

    // If no stroke color provided, use a darker version of the background
    this.strokeColorValue = strokeColor
      ? Color.rgb(strokeColor as ColorKey)
      : this.getDarkerColor(backgroundColor as ColorKey);

    this.fontValue =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('display' as FontKey));

    this.createHeaderText(scene);
    this.createShadowSprite(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
  }

  // API Methods
  public setText(text: string): this {
    this.textValue = text;
    this.headerText.setText(text);
    this.regenerateSprites();
    return this;
  }

  public setTextSize(textSize: FontSizeKey | number): this {
    this.textSizePx =
      typeof textSize === 'number'
        ? textSize
        : this.pw.fontSize.px(textSize ?? ('lg' as FontSizeKey));
    this.headerText.setFontSize(this.textSizePx);
    this.regenerateSprites();
    return this;
  }

  public setFont(font: FontKey | string): this {
    this.fontValue =
      typeof font === 'string'
        ? font
        : this.pw.font.family(font ?? ('display' as FontKey));
    this.headerText.setFontFamily(this.fontValue);
    this.regenerateSprites();
    return this;
  }

  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
    // Update stroke color to match new background if it was auto-generated
    if (!this.strokeColorValue.startsWith('#')) {
      this.strokeColorValue = this.getDarkerColor(color as ColorKey);
      this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
    }
    this.regenerateSprites();
    return this;
  }

  public setTextColor(color: ColorKey | string): this {
    this.textColorValue = Color.rgb(color as ColorKey);
    this.headerText.setColor(this.textColorValue);
    return this;
  }

  public setStrokeColor(color: ColorKey | string): this {
    this.strokeColorValue = Color.rgb(color as ColorKey);
    this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
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

  private createHeaderText(scene: Scene): void {
    this.headerText = scene.add.text(0, 0, this.textValue, {
      fontSize: `${this.textSizePx}px`,
      fontFamily: this.fontValue,
      color: this.textColorValue,
      stroke: this.strokeColorValue,
      strokeThickness: STROKE_THICKNESS,
      fontStyle: 'bold', // Make section headers bold by default
    });
    this.headerText.setOrigin(0.5, 0.5);
  }

  private createShadowSprite(scene: Scene): void {
    const shadowTexture = this.createShadowTexture(scene);
    this.shadowSprite = scene.add.sprite(0, SHADOW_OFFSET_Y, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
  }

  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private regenerateSprites(): void {
    // Update text bounds after text/font changes
    this.headerText.setText(this.textValue);

    // Regenerate textures
    const shadowTexture = this.createShadowTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);

    this.shadowSprite.setTexture(shadowTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  private getHeaderDimensions(): { width: number; height: number } {
    const textBounds = this.headerText.getBounds();
    const width = textBounds.width + this.marginPx * 2;
    const height = textBounds.height + this.marginPx * 2;
    return { width, height };
  }

  private createShadowTexture(scene: Scene): string {
    const { width, height } = this.getHeaderDimensions();
    const textureKey = `sectionHeader_shadow_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for shadow
    const shadowPadding = 8;
    const textureWidth = width + shadowPadding * 2;
    const textureHeight = height + shadowPadding * 2 + SHADOW_OFFSET_Y;

    const graphics = scene.add.graphics();

    // Limit radius to maximum possible for the header dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Shadow (only vertical offset, no horizontal)
    graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
    graphics.fillRoundedRect(
      shadowPadding,
      shadowPadding + SHADOW_OFFSET_Y,
      width,
      height,
      effectiveRadius
    );

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getHeaderDimensions();
    const textureKey = `sectionHeader_bg_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;

    // Add some padding for texture
    const padding = 8;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    // Limit radius to maximum possible for the header dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Main background with subtle gradient effect
    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);

    const depth = 0.15;

    // Add a subtle highlight on top for depth
    const highlightHeight = Math.max(2, height * depth);
    graphics.fillStyle(Color.hex('white'), depth);
    graphics.fillRoundedRect(
      padding,
      padding,
      width,
      highlightHeight,
      effectiveRadius
    );

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  private setupContainer(): void {
    this.add([this.shadowSprite, this.backgroundSprite, this.headerText]);
  }

  private getDarkerColor(color: ColorKey): string {
    // Try to get a darker shade of the same color family
    const colorStr = color as string;

    // If it's already a shade (e.g., "blue-600"), try to make it darker
    if (colorStr.includes('-')) {
      const [family, shade] = colorStr.split('-');
      if (family && shade) {
        const currentShade = parseInt(shade);

        const shadeLimit = 900;
        const shadeIncrement = 200;
        if (!isNaN(currentShade) && currentShade < shadeLimit) {
          const darkerShade = Math.min(
            shadeLimit,
            currentShade + shadeIncrement
          );
          return Color.rgb(`${family}-${darkerShade}` as ColorKey);
        }
      }
    }

    // If it's a base color (e.g., "blue"), add a dark shade
    const baseColors = [
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'orange',
      'pink',
      'gray',
    ];
    if (baseColors.includes(colorStr)) {
      return Color.rgb(`${colorStr}-800` as ColorKey);
    }

    // Fallback to a dark color
    return Color.rgb('gray-800');
  }
}
