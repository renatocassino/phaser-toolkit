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

import {
  BUTTON_OUTLINE_THICKNESS,
  BUTTON_STROKE_THICKNESS,
  getButtonStrokeColor,
  type ButtonVariant,
} from '../../utils/button-style';
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
  /**
   * Visual variant. `'filled'` = solid background (default). `'outline'` =
   * transparent background with a colored border and colored icon.
   */
  variant?: ButtonVariant;
};

const durations = {
  click: 60,
  hover: 100,
};

const BUTTON_SCALE = 2.2;
const CENTER_OFFSET = 1.1;
const HOVER_SCALE = 1.05;
const POINTER_DOWN_SCALE = 0.95;

// Origin constants
const SPRITE_ORIGIN = 0.5;

export class IconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public iconText!: IconText;

  private pw: PhaserWindPlugin<{}>;
  private baseColor!: Omit<ColorKey, 'black' | 'white'>;
  private colorButton!: string;
  private sizePx!: number;
  private borderRadiusPx!: number;
  private variant!: ButtonVariant;
  private icon!: IconKey;

  constructor({
    scene,
    x,
    y,
    icon,
    size,
    color,
    onClick,
    borderRadius,
    variant = 'filled',
  }: IconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    const sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));

    const baseColor = color ?? 'blue-500';
    this.sizePx = sizePx;
    this.variant = variant;
    this.icon = icon;

    this.updateSize();

    this.baseColor = baseColor;
    this.colorButton = Color.rgb(baseColor as ColorKey);
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px((borderRadius ?? 'full') as RadiusKey);

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

    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }

  /**
   * Switch between `'filled'` and `'outline'` variants at runtime. Regenerates
   * both the background and the icon so their styling reflects the variant.
   */
  public setVariant(variant: ButtonVariant): this {
    if (this.variant === variant) return this;
    this.variant = variant;
    // Recreate the icon so its color/stroke reflect the new variant.
    this.remove(this.iconText, true);
    this.createIconText(this.scene, this.icon, this.sizePx);
    this.add(this.iconText);
    // Regenerate the background texture with the new drawing mode.
    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
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

    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }


  private updateSize(): void {
    this.setSize(this.sizePx * BUTTON_SCALE, this.sizePx * BUTTON_SCALE);
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

    this.drawButtonBackground(graphics, centerX, centerY, side, finalRadius);

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  /**
   * Draws the button's background. `filled` → solid fill. `outline` → colored
   * border inset by half its thickness so the outer edge sits at the visual
   * box boundary.
   */
  private drawButtonBackground(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    centerY: number,
    side: number,
    effectiveRadius: number
  ): void {
    if (this.variant === 'outline') {
      const half = BUTTON_OUTLINE_THICKNESS / 2;
      graphics.lineStyle(BUTTON_OUTLINE_THICKNESS, Color.hex(this.colorButton), 1);
      graphics.strokeRoundedRect(
        centerX - side / 2 + half,
        centerY - side / 2 + half,
        side - BUTTON_OUTLINE_THICKNESS,
        side - BUTTON_OUTLINE_THICKNESS,
        Math.max(0, effectiveRadius - half)
      );
      return;
    }
    graphics.fillStyle(Color.hex(this.colorButton), 1);
    graphics.fillRoundedRect(
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
    // In `outline`, the border carries the visual weight — icon uses the
    // button color as fill, with no stroke, matching daisyUI.
    const isOutline = this.variant === 'outline';
    this.iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon,
      size,
      style: {
        color: isOutline
          ? Color.rgb(this.baseColor as ColorKey)
          : Color.rgb('white'),
        strokeThickness: isOutline ? 0 : BUTTON_STROKE_THICKNESS,
        stroke: isOutline
          ? 'rgba(0,0,0,0)'
          : getButtonStrokeColor(this.baseColor as string),
      },
    });
    this.iconText.setFontStyle('900');
    this.iconText.setOrigin(SPRITE_ORIGIN, SPRITE_ORIGIN);
  }

  private setupContainer(): void {
    this.add([this.backgroundSprite, this.iconText]);
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
        targets: [this.backgroundSprite, this.iconText],
        scaleX: POINTER_DOWN_SCALE,
        scaleY: POINTER_DOWN_SCALE,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.iconText],
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
