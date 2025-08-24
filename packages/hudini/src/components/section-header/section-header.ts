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

import { getPWFromScene } from '../../utils/get-pw-from-scene';

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

/** Vertical offset for the shadow */
const SHADOW_OFFSET_Y = 4;
/** Opacity value for the shadow */
const SHADOW_OPACITY = 0.25;
/** Thickness of the text stroke */
const STROKE_THICKNESS = 2;
/** Shadow size as a percentage of the header size */
const SHADOW_SCALE = 0.95;

/**
 * A stylized section header component with shadow, text stroke and auto-sizing
 */
export class SectionHeader extends GameObjects.Container {
  /** The background graphics of the header */
  public backgroundGraphics!: GameObjects.Graphics;
  /** The shadow graphics below the header */
  public shadowGraphics!: GameObjects.Graphics;
  /** The text object of the header */
  public headerText!: GameObjects.Text;

  /** Reference to the PhaserWind plugin */
  private pw: PhaserWindPlugin<{}>;
  /** Font size in pixels */
  private textSizePx!: number;
  /** Margin size in pixels */
  private marginPx!: number;
  /** Border radius in pixels */
  private borderRadiusPx!: number;
  /** Background color value */
  private backgroundColorValue!: string;
  /** Text color value */
  private textColorValue!: string;
  /** Stroke color value */
  private strokeColorValue!: string;
  /** Font family value */
  private fontValue!: string;
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

    this.fontValue = typeof font === 'string' ? font : this.pw.font.family(font ?? ('display' as FontKey));

    this.createHeaderText(scene);
    this.createShadowGraphics(scene);
    this.createBackgroundGraphics(scene);
    this.setupContainer();
    this.setupInteractivity();
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
   * @param textSize New font size (number in px or FontSizeKey)
   * @returns this for chaining
   */
  public setTextSize(textSize: FontSizeKey | number): this {
    this.textSizePx =
      typeof textSize === 'number'
        ? textSize
        : this.pw.fontSize.px(textSize ?? ('lg' as FontSizeKey));
    this.headerText.setFontSize(this.textSizePx);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the font family of the header text
   * @param font New font family (FontKey or string)
   * @returns this for chaining
   */
  public setFont(font: FontKey | string): this {
    this.fontValue = typeof font === 'string' ? font : this.pw.font.family(font ?? ('display' as FontKey));
    this.headerText.setFontFamily(this.fontValue);
    this.regenerateGraphics();
    return this;
  }

  /**
   * Sets the background color of the header
   * @param color New background color (ColorKey or string)
   * @returns this for chaining
   */
  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
    // Update stroke color to match new background if it was auto-generated
    if (!this.strokeColorValue.startsWith('#')) {
      this.strokeColorValue = this.getDarkerColor(color as ColorKey);
      this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
    }
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
   * Sets the stroke color of the header text
   * @param color New stroke color (ColorKey or string)
   * @returns this for chaining
   */
  public setStrokeColor(color: ColorKey | string): this {
    this.strokeColorValue = Color.rgb(color as ColorKey);
    this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
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

  /**
   * Creates the shadow graphics below the header
   * @param scene The scene to add the graphics to
   */
  private createShadowGraphics(scene: Scene): void {
    this.shadowGraphics = scene.add.graphics();
    this.drawShadow();
  }

  /**
   * Creates the background graphics for the header
   * @param scene The scene to add the graphics to
   */
  private createBackgroundGraphics(scene: Scene): void {
    this.backgroundGraphics = scene.add.graphics();
    this.drawBackground();
  }

  /**
   * Regenerates all graphics after a property change
   */
  private regenerateGraphics(): void {
    // Update text bounds after text/font changes
    this.headerText.setText(this.textValue);

    // Redraw graphics with new properties
    this.drawShadow();
    this.drawBackground();
  }

  /**
   * Draws the shadow graphics
   */
  private drawShadow(): void {
    const sizes = this.getHeaderDimensions();
    const { height, width } = sizes;

    this.shadowGraphics.clear();

    // Limit radius to maximum possible for the header dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Shadow size is 80% of the header size
    const shadowWidth = width * SHADOW_SCALE;
    const shadowHeight = height * SHADOW_SCALE;

    // Calculate shadow position to center it
    // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
    const shadowX = -shadowWidth / 2;
    const shadowY = SHADOW_OFFSET_Y - shadowHeight / 2 + 4;

    // Calculate shadow radius (proportional to shadow size)
    const shadowMaxRadius = Math.min(shadowWidth / 2, shadowHeight / 2);
    const shadowEffectiveRadius = Math.min(effectiveRadius * SHADOW_SCALE, shadowMaxRadius);

    // Shadow (only vertical offset, no horizontal)
    this.shadowGraphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
    this.shadowGraphics.fillRoundedRect(
      shadowX,
      shadowY,
      shadowWidth,
      shadowHeight,
      shadowEffectiveRadius
    );
  }

  /**
   * Draws the background graphics
   */
  private drawBackground(): void {
    const { width, height } = this.getHeaderDimensions();

    this.backgroundGraphics.clear();

    // Limit radius to maximum possible for the header dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

    // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
    const bgX = -width / 2;
    const bgY = -height / 2;

    // Main background with subtle gradient effect
    this.backgroundGraphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    this.backgroundGraphics.fillRoundedRect(bgX, bgY, width, height, effectiveRadius);

    const depth = 0.15;

    let hightlightWidth = width;
    if (this.borderRadiusPx > 12) {
      hightlightWidth = width * 0.7;
    }
    const highlightX = bgX + (width - hightlightWidth) / 2;
    // Add a subtle highlight on top for depth
    const highlightHeight = Math.max(2, height * depth);
    // For the highlight, use a smaller radius if the highlight is too small
    const highlightRadius = Math.min(effectiveRadius, highlightHeight / 2);
    this.backgroundGraphics.fillStyle(Color.hex('white'), depth);
    this.backgroundGraphics.fillRoundedRect(
      highlightX,
      bgY,
      hightlightWidth,
      highlightHeight,
      highlightRadius
    );
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
   * Sets up the container with all graphics in the correct order
   */
  private setupContainer(): void {
    this.add([this.shadowGraphics, this.backgroundGraphics, this.headerText]);
  }

  /**
   * Sets up interactivity for the header
   */
  private setupInteractivity(): void {
    this.setInteractive();
    this.on('pointerdown', () => {
      this.setScale(0.95);
      this.on('pointerup', () => {
        this.setScale(1);
      });
    });
  }

  /**
   * Gets a darker version of the given color
   * @param color Base color to darken
   * @returns Darker color string
   */
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
          const darkerShade = Math.min(shadeLimit, currentShade + shadeIncrement);
          return Color.rgb(`${family}-${darkerShade}` as ColorKey);
        }
      }
    }

    // If it's a base color (e.g., "blue"), add a dark shade
    const baseColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
    if (baseColors.includes(colorStr)) {
      return Color.rgb(`${colorStr}-800` as ColorKey);
    }

    // Fallback to a dark color
    return Color.rgb('gray-800');
  }
}