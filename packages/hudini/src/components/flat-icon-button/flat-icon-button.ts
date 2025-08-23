import { IconText, type IconKey, type IconStyle } from 'font-awesome-for-phaser';
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
  click: 100,
  hover: 150,
};

const CLICK_OFFSET = 2;
const BUTTON_SCALE = 2.2;
const CENTER_OFFSET = 1.1;

export class FlatIconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
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
      typeof size === 'number' ? size : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));

    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px((borderRadius ?? 'md') as RadiusKey);

    this.backgroundColorValue = Color.rgb(backgroundColor as ColorKey);
    this.iconColorValue = Color.rgb(iconColor as ColorKey);
    this.backgroundOpacityValue = backgroundOpacity;
    this.iconOpacityValue = iconOpacity;

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
    this.regenerateBackgroundTexture();
    return this;
  }

  // API: icon
  public setIcon(icon: IconKey, opts?: { iconStyle?: IconStyle }): this {
    this.iconText.setIcon(icon, opts);
    return this;
  }

  public setButtonSize(size: FontSizeKey | number): this {
    this.baseSizePx =
      typeof size === 'number' ? size : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    this.iconText.setFontSize(`${this.baseSizePx}px`);
    this.regenerateBackgroundTexture();
    return this;
  }

  private createBackgroundSprite(scene: Scene): void {
    const textureKey = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, textureKey);
    this.backgroundSprite.setOrigin(0.5, 0.5);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
  }

  private regenerateBackgroundTexture(): void {
    const textureKey = this.createBackgroundTexture(this.scene);
    this.backgroundSprite.setTexture(textureKey);
    this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
  }

  private createBackgroundTexture(scene: Scene): string {
    const size = this.baseSizePx;
    const textureKey = `flatIconButton_${this.backgroundColorValue}_${this.borderRadiusPx}_${size}`;
    const textureSize = size * BUTTON_SCALE; // match icon-button scale for consistency
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);

    const side = size * 2;
    const radius = Math.min(this.borderRadiusPx, side / 2);
    graphics.fillRoundedRect(
      centerX - side / 2,
      centerY - side / 2,
      side,
      side,
      radius
    );

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();
    return textureKey;
  }

  private createIconText(scene: Scene, icon: IconKey, iconStyle: IconStyle): void {
    this.iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon,
      size: this.baseSizePx,
      style: {
        color: this.iconColorValue,
        strokeThickness: 0,
      },
      iconStyle,
    });
    this.iconText.setAlpha(this.iconOpacityValue);
    this.iconText.setOrigin(0.5, 0.5);
  }

  private setupContainer(): void {
    this.add([this.backgroundSprite, this.iconText]);
  }

  private setupInteractivity(onClick?: () => void): void {
    this.backgroundSprite.setInteractive({ useHandCursor: true });

    this.backgroundSprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.iconText],
        y: CLICK_OFFSET,
        duration: durations.click,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerup', () => {
      this.scene.tweens.add({
        targets: [this.backgroundSprite, this.iconText],
        y: 0,
        duration: durations.click,
        ease: 'Linear',
      });
      onClick?.();
    });
  }
}
