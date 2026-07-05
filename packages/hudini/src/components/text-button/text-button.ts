/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  Duration,
  Ease,
  PhaserWindPlugin,
  type ColorKey,
  type FontKey,
  type FontSizeKey,
  type RadiusKey,
  type SpacingKey,
} from 'phaser-wind';

import {
  BUTTON_OUTLINE_THICKNESS,
  BUTTON_STROKE_THICKNESS,
  getButtonStrokeColor,
  type ButtonVariant,
} from '../../utils/button-style';
import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';
import { Stack } from '../stack';
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
   * Text color. Defaults to `'white'` in the `'filled'` variant, and to the
   * button's own `color` in the `'outline'` variant (matching daisyUI).
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
   * Visual variant. `'filled'` = solid background (default). `'outline'` =
   * transparent background with a colored border and colored text.
   */
  variant?: ButtonVariant;
  /**
   * Optional Font Awesome icon shown to the LEFT of the text.
   * Renders with the same color/stroke rules as the text (variant-aware).
   */
  leftIcon?: IconKey;
  /**
   * Optional Font Awesome icon shown to the RIGHT of the text.
   * Renders with the same color/stroke rules as the text (variant-aware).
   */
  rightIcon?: IconKey;
  /**
   * Gap between icon(s) and text in pixels. Defaults to a value proportional
   * to the font size (roughly `fontSize * 0.35`), min 4px.
   */
  iconGap?: number;
  /**
   * Callback function for click event.
   */
  onClick?: () => void;
};


const HOVER_SCALE = 1.05;
const POINTER_DOWN_SCALE = 0.95;

/**
 * Extra transparent margin around the drawn button inside its texture, just
 * enough so the anti-aliased rounded-corner fill isn't clipped at the edge.
 * The container itself is resized to the *visual* box (see setSize below),
 * so this margin never leaks into layout measurements.
 */
const TEXTURE_ANTIALIAS_MARGIN = 1;

/** Minimum gap between icon and text, in pixels. */
const MIN_ICON_TEXT_GAP_PX = 4;
/** Default icon-text gap as a fraction of the font size. */
const ICON_TEXT_GAP_RATIO = 0.35;

/**
 * A customizable text button component for Phaser, supporting auto-sizing,
 * design tokens, and interactive effects.
 */
export class TextButton extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the button. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The text object of the button. */
  public buttonText!: GameObjects.Text;
  /** Horizontal Stack composing (optional leftIcon) + text + (optional rightIcon). */
  public contentStack!: Stack;
  /** Left icon glyph, when `leftIcon` is set. */
  public leftIconText: IconText | undefined;
  /** Right icon glyph, when `rightIcon` is set. */
  public rightIconText: IconText | undefined;

  private pw: PhaserWindPlugin<{}>;
  private fontSizePx!: number;
  private paddingPx!: number;
  private borderRadiusPx!: number;
  private colorInput!: string;
  private colorButton!: string;
  private textColorValue!: string;
  private fontFamily!: string;
  private textValue!: string;
  private variant!: ButtonVariant;
  private leftIconKey: IconKey | undefined;
  private rightIconKey: IconKey | undefined;
  private iconGap: number | undefined;
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
    color = 'blue-500',
    textColor,
    borderRadius = 'md',
    padding = '4',
    variant = 'filled',
    leftIcon,
    rightIcon,
    iconGap,
    onClick,
  }: TextButtonParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    // Store values
    this.textValue = text;
    this.variant = variant;
    this.leftIconKey = leftIcon;
    this.rightIconKey = rightIcon;
    this.iconGap = iconGap;
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
        : this.pw.radius.px(borderRadius ?? ('3xl' as RadiusKey));

    this.colorInput = String(color);
    this.colorButton = Color.rgb(color as ColorKey);

    // Default text color depends on variant: filled → white, outline → same
    // as the button color (daisyUI parity). Explicit user value always wins.
    const resolvedTextColor =
      textColor ?? (variant === 'outline' ? color : 'white');
    this.textColorValue = Color.rgb(resolvedTextColor as ColorKey);
    this.fontFamily = font
      ? typeof font === 'string'
        ? font
        : this.pw.font.family(font)
      : 'Fredoka';

    this.createButtonContent(scene);
    this.createBackgroundSprite(scene);
    this.setupContainer();
    this.hitArea = this.backgroundSprite;
    this.setupInteractivity(onClick);
    this.syncContainerSize();
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
    // Icons also scale with fontSizePx, so rebuild the whole content.
    this.rebuildContent();
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
    this.colorInput = String(color);
    this.colorButton = Color.rgb(color as ColorKey);
    // Text stroke + icon colors derive from `colorInput` — rebuild.
    this.rebuildContent();
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
   * Switch between `'filled'` and `'outline'` variants at runtime.
   * Rebuilds both content (text + icons stroke/color) and the background.
   */
  public setVariant(variant: ButtonVariant): this {
    if (this.variant === variant) return this;
    this.variant = variant;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets (or removes) the left icon. Pass `undefined` to clear.
   */
  public setLeftIcon(icon: IconKey | undefined): this {
    this.leftIconKey = icon;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets (or removes) the right icon. Pass `undefined` to clear.
   */
  public setRightIcon(icon: IconKey | undefined): this {
    this.rightIconKey = icon;
    this.rebuildContent();
    this.regenerateSprites();
    return this;
  }

  /**
   * Creates the button's content: optional left icon + text + optional right
   * icon, composed in a horizontal Stack. In `outline` mode, icons and text
   * share the same colored appearance (no stroke); in `filled` mode both
   * carry a darker outline stroke via `getButtonStrokeColor`.
   */
  private createButtonContent(scene: Scene): void {
    const isOutline = this.variant === 'outline';
    const strokeThickness = isOutline ? 0 : BUTTON_STROKE_THICKNESS;
    const strokeColor = isOutline
      ? 'rgba(0,0,0,0)'
      : getButtonStrokeColor(this.colorInput);
    const glyphColor = isOutline
      ? Color.rgb(this.colorInput as ColorKey)
      : Color.rgb('white');

    // Text
    this.buttonText = new Text({
      scene,
      x: 0,
      y: 0,
      text: this.textValue,
      size: this.fontSizePx,
      fontFamily: this.fontFamily,
      strokeThickness,
      strokeColor,
    });
    // Preserve legacy behavior for `filled`: `textColor` on the constructor
    // was historically dead (only `setTextColor()` after construction applied
    // it). Outline needs the color for the border/text pairing to work, so
    // we only push it into the Text object in that mode.
    if (isOutline) {
      this.buttonText.setColor(this.textColorValue);
    }
    this.buttonText.setOrigin(0.5, 0.5);

    // Optional icons — same visual treatment as the text so the composition
    // reads as one unified label.
    this.leftIconText = this.leftIconKey
      ? this.createIcon(scene, this.leftIconKey, glyphColor, strokeColor, strokeThickness)
      : undefined;
    this.rightIconText = this.rightIconKey
      ? this.createIcon(scene, this.rightIconKey, glyphColor, strokeColor, strokeThickness)
      : undefined;

    // Compose in a horizontal Stack. Order: [leftIcon?, text, rightIcon?].
    const children: GameObjects.GameObject[] = [];
    if (this.leftIconText) children.push(this.leftIconText);
    children.push(this.buttonText);
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
    color: string,
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
        color,
        strokeThickness,
        stroke: strokeColor,
      },
    });
    iconText.setFontStyle('900');
    iconText.setOrigin(0.5, 0.5);
    scene.add.existing(iconText);
    return iconText;
  }

  /**
   * Tear down the current content stack and rebuild it. Used by setters that
   * change how the content should be rendered (variant, color, font size,
   * icons). Cheap enough to not worry about it — buttons aren't tweened on
   * every frame.
   */
  private rebuildContent(): void {
    this.remove(this.contentStack, true);
    this.createButtonContent(this.scene);
    this.add(this.contentStack);
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
   * Regenerates the background sprite based on current state. Also relayouts
   * the content Stack (icons + text) to reflect fresh text bounds.
   */
  private regenerateSprites(): void {
    // Update text bounds after text/font changes
    this.buttonText.setText(this.textValue);
    // Re-layout the horizontal Stack so icons stay flush to the new text width.
    this.contentStack.layout();

    // Regenerate textures
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.syncContainerSize();
  }

  /**
   * Keep the container's own width/height in sync with the visible button box
   * (excluding the transparent margin baked into the sprite texture). This is
   * what layout containers like Row/Column read when computing positions.
   */
  private syncContainerSize(): void {
    const { width, height } = this.getButtonDimensions();
    this.setSize(width, height);
  }

  /**
   * Calculates the button's width and height from the horizontal content
   * Stack (icons + text) plus the button's own padding on both axes.
   */
  private getButtonDimensions(): { width: number; height: number } {
    const contentWidth = this.contentStack.width;
    const contentHeight = this.contentStack.height;
    const width = contentWidth + this.paddingPx * 2;
    const height = contentHeight + this.paddingPx * 2;
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

    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    this.drawButtonBackground(graphics, padding, width, height, finalRadius);
    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws the button's background. `filled` → solid fill. `outline` → colored
   * border only, drawn inset by half the stroke width so the outer edge of
   * the stroke sits exactly at the visual box boundary (i.e. `.width` /
   * `.height` remain accurate for Row/Column).
   */
  private drawButtonBackground(
    graphics: Phaser.GameObjects.Graphics,
    padding: number,
    width: number,
    height: number,
    effectiveRadius: number
  ): void {
    if (this.variant === 'outline') {
      const half = BUTTON_OUTLINE_THICKNESS / 2;
      graphics.lineStyle(BUTTON_OUTLINE_THICKNESS, Color.hex(this.colorButton), 1);
      graphics.strokeRoundedRect(
        padding + half,
        padding + half,
        width - BUTTON_OUTLINE_THICKNESS,
        height - BUTTON_OUTLINE_THICKNESS,
        Math.max(0, effectiveRadius - half)
      );
      return;
    }
    graphics.fillStyle(Color.hex(this.colorButton), 1);
    graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);
  }

  /**
   * Adds the button's visual elements to the container. Order matters:
   * background first (behind), then the icon+text content (in front).
   */
  private setupContainer(): void {
    this.add([this.backgroundSprite, this.contentStack]);
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
        duration: Duration.ms("100"),
        scaleX: HOVER_SCALE,
        scaleY: HOVER_SCALE,
        ease: Ease.value("back-out"),
      });
    });

    this.backgroundSprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this,
        duration: Duration.ms("100"),
        scaleX: 1,
        scaleY: 1,
        ease: Ease.value("back-out"),
      });
    });

    // Click effects
    this.backgroundSprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.contentStack],
        scaleX: POINTER_DOWN_SCALE,
        scaleY: POINTER_DOWN_SCALE,
        duration: Duration.ms("75"),
        ease: Ease.value("linear"),
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.contentStack],
        scaleX: 1,
        scaleY: 1,
        duration: Duration.ms("75"),
        ease: Ease.value("linear"),
      });
      onClick?.();
    });
  }
}
