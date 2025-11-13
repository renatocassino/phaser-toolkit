/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
} from 'phaser-wind';

import { getColorVariant } from '../../utils/color-variants';
import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type IconButtonParams = {
  scene: Scene;
  x: number;
  y: number;
  icon: IconKey;
  size?: FontSizeKey | number;
  color?: Omit<ColorKey, 'black' | 'white'>;
  onClick?: () => void;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'full'. */
  borderRadius?: RadiusKey | number;
};

const durations = {
  click: 60,
  hover: 100,
};

const BUTTON_SCALE = 2.2;
const CENTER_OFFSET = 1.1;
const HOVER_SCALE = 1.05;
const POINTER_DOWN_SCALE = 0.95;
const TOKEN_LIGHTER_DIFF = -100;

const COLOR_LIGHTER_AMOUNT = 30;

// Border constants
const BLACK_BORDER_THICKNESS = 2;
const WHITE_BORDER_EXTRA_PIXELS_PER_SIDE = 2;
const WHITE_BORDER_TOTAL_EXTRA_PIXELS = WHITE_BORDER_EXTRA_PIXELS_PER_SIDE * 2; // 4 pixels total
const WHITE_BORDER_RADIUS_EXTRA = 2;

// Overlay constants
const LIGHT_OVERLAY_SCALE = 0.6;

// Icon constants
const ICON_STROKE_THICKNESS = 3;
const ICON_SHADOW_OFFSET_X = 0;
const ICON_SHADOW_OFFSET_Y = 3;
const ICON_SHADOW_BLUR = 0;
const ICON_OFFSET_Y = -1.5; // Half of shadow offset to keep visually centered

// Origin constants
const SPRITE_ORIGIN = 0.5;

export class IconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public whiteBorderSprite!: GameObjects.Sprite;
  public iconText!: IconText;

  private pw: PhaserWindPlugin<{}>;
  private baseColor!: Omit<ColorKey, 'black' | 'white'>;
  private colorButton!: string;
  private lightColorButton!: number;
  private darkColorButton!: number;
  private sizePx!: number;
  private borderRadiusPx!: number;

  constructor({
    scene,
    x,
    y,
    icon,
    size,
    color,
    onClick,
    borderRadius,
  }: IconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    const sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));

    const baseColor = color ?? 'gray';
    this.sizePx = sizePx;

    this.updateSize();

    this.baseColor = baseColor;
    this.colorButton = Color.rgb(baseColor as ColorKey);
    this.lightColorButton = getColorVariant(baseColor as string, TOKEN_LIGHTER_DIFF, COLOR_LIGHTER_AMOUNT);
    // this.darkColorButton = getColorVariant(baseColor as string, TOKEN_DARKER_DIFF, COLOR_DARKER_AMOUNT);
    this.darkColorButton = Color.blackHex();
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px((borderRadius ?? 'full') as RadiusKey);

    this.createWhiteBorderSprite(scene, sizePx, this.borderRadiusPx);
    this.createBackgroundSprite(scene, sizePx, baseColor, this.borderRadiusPx);
    this.createIconText(scene, icon, sizePx);
    this.setupContainer();
    this.setupInteractivity(onClick);
  }

  public setBorderRadius(borderRadius: RadiusKey | number): this {
    const newRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius as RadiusKey);
    if (this.borderRadiusPx === newRadiusPx) return this;
    this.borderRadiusPx = newRadiusPx;

    // Regenerate textures for white border and background
    const whiteBorderTexture = this.createWhiteBorderTexture(
      this.scene,
      this.sizePx,
      this.borderRadiusPx
    );
    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }

  public setButtonSize(size: FontSizeKey | number): this {
    this.sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    this.iconText.setFontSize(`${this.sizePx}px`);

    this.updateSize();

    const whiteBorderTexture = this.createWhiteBorderTexture(
      this.scene,
      this.sizePx,
      this.borderRadiusPx
    );
    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    this.whiteBorderSprite.setTexture(whiteBorderTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }


  private updateSize(): void {
    this.setSize(this.sizePx * BUTTON_SCALE, this.sizePx * BUTTON_SCALE);
  }

  private createWhiteBorderSprite(
    scene: Scene,
    size: number,
    borderRadiusPx: number
  ): void {
    const whiteBorderTexture = this.createWhiteBorderTexture(
      scene,
      size,
      borderRadiusPx
    );
    this.whiteBorderSprite = scene.add.sprite(0, 0, whiteBorderTexture);
    this.whiteBorderSprite.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
  }

  private createBackgroundSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    borderRadiusPx: number
  ): void {
    const backgroundTexture = this.createBackgroundTexture(
      scene,
      size,
      baseColor,
      borderRadiusPx
    );
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
  }

  private createWhiteBorderTexture(
    scene: Scene,
    size: number,
    borderRadiusPx: number
  ): string {
    const textureKey = `iconButton_whiteBorder_r${borderRadiusPx}_${size}`;
    // White border is larger on each side
    const side = size * 2 + WHITE_BORDER_TOTAL_EXTRA_PIXELS;
    // Increase texture size to accommodate the larger border
    const textureSize = size * BUTTON_SCALE + WHITE_BORDER_TOTAL_EXTRA_PIXELS;
    const centerX = textureSize / 2;
    const centerY = textureSize / 2;

    const graphics = scene.add.graphics();
    const maxRadius = Math.floor(Math.min(side / 2, side / 2));
    const effectiveRadius = Math.min(borderRadiusPx + WHITE_BORDER_RADIUS_EXTRA, maxRadius);
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

  private createBackgroundTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    borderRadiusPx: number
  ): string {
    const textureKey = `iconButton_r${borderRadiusPx}_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    const side = size * 2;
    const maxRadius = Math.floor(Math.min(side / 2, side / 2));
    const effectiveRadius = Math.min(borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    this.drawCssColorGradient(graphics, centerX, centerY, side, finalRadius);

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws gradient using a centered light overlay on CSS color.
   * For round buttons, uses a smaller centered graphic with light color.
   */
  private drawCssColorGradient(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    centerY: number,
    side: number,
    effectiveRadius: number
  ): void {
    // Main background
    graphics.fillStyle(Color.hex(this.colorButton), 1);
    graphics.fillRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      effectiveRadius
    );

    // Centered light overlay (smaller, circular/rounded)
    const overlaySide = side * LIGHT_OVERLAY_SCALE;
    const overlayRadius = Math.min(effectiveRadius, overlaySide / 2);
    
    graphics.fillStyle(this.lightColorButton, 1);
    graphics.fillRoundedRect(
      centerX - overlaySide / 2,
      centerY - overlaySide / 2,
      overlaySide,
      overlaySide,
      overlayRadius
    );

    // Black stroke border
    graphics.lineStyle(BLACK_BORDER_THICKNESS, Color.hex('black'), 1);
    graphics.strokeRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      effectiveRadius
    );
  }

  private createIconText(
    scene: Scene,
    icon: IconKey,
    size: number
  ): void {
    // Convert darkColorButton (number) to RGB string
    const darkColorObj = Phaser.Display.Color.ValueToColor(this.darkColorButton);
    const RGB_MASK = 0xff;
    const RGB_SHIFT_R = 16;
    const RGB_SHIFT_G = 8;
    const darkColorString = `rgb(${darkColorObj.color32 >> RGB_SHIFT_R & RGB_MASK}, ${darkColorObj.color32 >> RGB_SHIFT_G & RGB_MASK}, ${darkColorObj.color32 & RGB_MASK})`;

    this.iconText = new IconText({
      scene,
      x: 0,
      y: ICON_OFFSET_Y,
      icon,
      size,
      style: {
        color: Color.rgb('white'),
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
    });
    this.iconText.setFontStyle('900');
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
   * Gets the bounds of the icon button for layout calculations
   * @param output Optional rectangle to store the result
   * @returns Rectangle with the button bounds
   */
  public override getBounds(
    output?: Phaser.Geom.Rectangle
  ): Phaser.Geom.Rectangle {
    const width = this.backgroundSprite.displayWidth ?? this.backgroundSprite.width;
    const height = this.backgroundSprite.displayHeight ?? this.backgroundSprite.height;

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
