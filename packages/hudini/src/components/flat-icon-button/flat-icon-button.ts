/* eslint-disable max-lines */
import {
  IconText,
  type IconKey,
  type IconStyle,
} from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type FlatIconButtonParams = {
  scene: Scene;
  x: number;
  y: number;
  icon: IconKey;
  iconStyle?: IconStyle;
  size?: FontSizeKey | number;
  backgroundColor?: ColorKey | string; // accepts palette token or CSS color
  iconColor?: ColorKey | string; // accepts palette token or CSS color
  onClick?: () => void;
  borderRadius?: string | number; // token or px
  backgroundOpacity?: number; // 0..1
  iconOpacity?: number; // 0..1
};

const durations = {
  click: 60,
  hover: 100,
};

const BUTTON_SCALE = 2.2;
const CENTER_OFFSET = 1.1;
const HOVER_SCALE = 1.05;
const POINTER_DOWN_SCALE = 0.95;

// Border constants
const BLACK_BORDER_THICKNESS = 2;
const WHITE_BORDER_EXTRA_PIXELS_PER_SIDE = 3;
const WHITE_BORDER_TOTAL_EXTRA_PIXELS = WHITE_BORDER_EXTRA_PIXELS_PER_SIDE * 2; // 6 pixels total
const WHITE_BORDER_RADIUS_EXTRA = 2;

// Icon constants
const ICON_STROKE_THICKNESS = 3;
const ICON_SHADOW_OFFSET_X = 0;
const ICON_SHADOW_OFFSET_Y = 3;
const ICON_SHADOW_BLUR = 0;
const ICON_OFFSET_Y = -1.5; // Half of shadow offset to keep visually centered

// Origin constants
const SPRITE_ORIGIN = 0.5;

export class FlatIconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public whiteBorderSprite!: GameObjects.Sprite;
  public iconText!: IconText;
  private pw: PhaserWindPlugin<{}>;

  private baseSizePx!: number;
  private borderRadiusPx!: number;
  private backgroundColorValue!: string; // rgb string
  private iconColorValue!: string; // rgb string
  private backgroundOpacityValue = 1;
  private iconOpacityValue = 1;

  constructor({
    scene,
    x,
    y,
    icon,
    iconStyle = 'solid',
    size,
    backgroundColor = 'gray-600',
    iconColor = 'white',
    onClick,
    borderRadius = 'md',
    backgroundOpacity = 1,
    iconOpacity = 1,
  }: FlatIconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    this.baseSizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));

    this.updateSize();

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px((borderRadius ?? 'md') as RadiusKey);

    this.backgroundColorValue = Color.rgb(backgroundColor as ColorKey);
    this.iconColorValue = Color.rgb(iconColor as ColorKey);
    this.backgroundOpacityValue = backgroundOpacity;
    this.iconOpacityValue = iconOpacity;

    this.createWhiteBorderSprite(scene);
    this.createBackgroundSprite(scene);
    this.createIconText(scene, icon, iconStyle);
    this.setupContainer();
    this.setupInteractivity(onClick);
  }

  // API: colors
  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
    this.regenerateBackgroundTexture();
    return this;
  }

  public setIconColor(color: ColorKey | string): this {
    this.iconColorValue = Color.rgb(color as ColorKey);
    this.iconText.setColor(this.iconColorValue);
    this.iconText.setAlpha(this.iconOpacityValue);
    return this;
  }

  // API: opacity
  public setBackgroundOpacity(opacity: number): this {
    this.backgroundOpacityValue = Math.max(0, Math.min(1, opacity));
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
    return this;
  }

  public setIconOpacity(opacity: number): this {
    this.iconOpacityValue = Math.max(0, Math.min(1, opacity));
    this.iconText.setAlpha(this.iconOpacityValue);
    return this;
  }

  // API: radius
  public setBorderRadius(borderRadius: string | number): this {
    const newRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius as RadiusKey);
    if (this.borderRadiusPx === newRadiusPx) return this;
    this.borderRadiusPx = newRadiusPx;
    
    // Regenerate textures for white border and background
    const whiteBorderTexture = this.createWhiteBorderTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
    return this;
  }

  // API: icon
  public setIcon(icon: IconKey, opts?: { iconStyle?: IconStyle }): this {
    this.iconText.setIcon(icon, opts);
    return this;
  }

  public setButtonSize(size: FontSizeKey | number): this {
    this.baseSizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    this.iconText.setFontSize(`${this.baseSizePx}px`);

    this.updateSize();

    const whiteBorderTexture = this.createWhiteBorderTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
    return this;
  }

  private updateSize(): void {
    this.width = this.baseSizePx * BUTTON_SCALE;
    this.height = this.baseSizePx * BUTTON_SCALE;
  }

  private createWhiteBorderSprite(scene: Scene): void {
    const whiteBorderTexture = this.createWhiteBorderTexture(scene);
    this.whiteBorderSprite = scene.add.sprite(0, 0, whiteBorderTexture);
    this.whiteBorderSprite.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
  }

  private createBackgroundSprite(scene: Scene): void {
    const textureKey = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, textureKey);
    this.backgroundSprite.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
  }

  private regenerateBackgroundTexture(): void {
    const whiteBorderTexture = this.createWhiteBorderTexture(this.scene);
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
  }

  private createWhiteBorderTexture(scene: Scene): string {
    const textureKey = `flatIconButton_whiteBorder_r${this.borderRadiusPx}_${this.baseSizePx}`;
    // White border is larger on each side
    const side = this.baseSizePx * 2 + WHITE_BORDER_TOTAL_EXTRA_PIXELS;
    // Increase texture size to accommodate the larger border
    const textureSize = this.baseSizePx * BUTTON_SCALE + WHITE_BORDER_TOTAL_EXTRA_PIXELS;
    const centerX = textureSize / 2;
    const centerY = textureSize / 2;

    const graphics = scene.add.graphics();
    const maxRadius = Math.floor(Math.min(side / 2, side / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx + WHITE_BORDER_RADIUS_EXTRA, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    // White border (outer)
    graphics.fillStyle(Color.hex('white'), 1);
    graphics.fillRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      finalRadius
    );

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  private createBackgroundTexture(scene: Scene): string {
    const size = this.baseSizePx;
    const textureKey = `flatIconButton_${this.backgroundColorValue}_${this.borderRadiusPx}_${size}`;
    const textureSize = size * BUTTON_SCALE; // match icon-button scale for consistency
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    const side = size * 2;
    const maxRadius = Math.floor(Math.min(side / 2, side / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    // Main background (flat, no gradient overlays)
    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    graphics.fillRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      finalRadius
    );

    // Black stroke border
    graphics.lineStyle(BLACK_BORDER_THICKNESS, Color.hex('black'), 1);
    graphics.strokeRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      finalRadius
    );

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();
    return textureKey;
  }

  private createIconText(
    scene: Scene,
    icon: IconKey,
    iconStyle: IconStyle
  ): void {
    // Use black for stroke and shadow (same as IconButton behavior)
    const darkColorString = Color.rgb('black');

    this.iconText = new IconText({
      scene,
      x: 0,
      y: ICON_OFFSET_Y,
      icon,
      size: this.baseSizePx,
      style: {
        color: this.iconColorValue,
        strokeThickness: ICON_STROKE_THICKNESS,
        stroke: darkColorString,
        shadow: {
          offsetX: ICON_SHADOW_OFFSET_X,
          offsetY: ICON_SHADOW_OFFSET_Y,
          color: darkColorString,
          blur: ICON_SHADOW_BLUR,
          stroke: true,
          fill: true,
        },
      },
      iconStyle,
    });
    this.iconText.setAlpha(this.iconOpacityValue);
    this.iconText.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
  }

  private setupContainer(): void {
    this.add([this.whiteBorderSprite, this.backgroundSprite, this.iconText]);
  }

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
        targets: [this.whiteBorderSprite, this.backgroundSprite, this.iconText],
        scaleX: POINTER_DOWN_SCALE,
        scaleY: POINTER_DOWN_SCALE,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.whiteBorderSprite, this.backgroundSprite, this.iconText],
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

  /**
   * Gets the bounds of the flat icon button for layout calculations
   * @param output Optional rectangle to store the result
   * @returns Rectangle with the button bounds
   */
  public override getBounds(
    output?: Phaser.Geom.Rectangle
  ): Phaser.Geom.Rectangle {
    const width = this.baseSizePx * BUTTON_SCALE;
    const height = this.baseSizePx * BUTTON_SCALE;

    if (output) {
      return output.setTo(
        this.x - width / 2,
        this.y - height / 2,
        width,
        height
      );
    }

    return new Phaser.Geom.Rectangle(
      this.x - width / 2,
      this.y - height / 2,
      width,
      height
    );
  }
}
