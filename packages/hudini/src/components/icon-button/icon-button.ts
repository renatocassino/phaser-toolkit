import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
  type RadiusKey,
} from 'phaser-wind';

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
  click: 100,
  hover: 150,
};

const BUTTON_SCALE = 2.2;
const CENTER_OFFSET = 1.1;
const SHADOW_OFFSET = 4;
const SHADOW_OPACITY = 0.1;
const MAIN_SHADOW_OPACITY = 0.9;
const INNER_OVERLAY_OPACITY = 0.7;
const HOVER_SCALE = 1.07;
const CLICK_OFFSET = 2;
const MAIN_OVERLAY_SCALE = 0.9;
const INNER_OVERLAY_SCALE = 0.7;
// no-magic-number for ratios used by overlays

export class IconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public shadowSprite!: GameObjects.Sprite;
  public iconText!: IconText;
  private pw: PhaserWindPlugin<{}>;
  private baseColor!: Omit<ColorKey, 'black' | 'white'>;
  private sizePx!: number;
  private borderRadiusPx!: number;

  constructor({ scene, x, y, icon, size, color, onClick, borderRadius }: IconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    const sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    const baseColor = color ?? 'gray';
    this.sizePx = sizePx;
    this.baseColor = baseColor;
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px((borderRadius ?? 'full') as RadiusKey);

    this.createShadowSprite(scene, sizePx, baseColor, this.borderRadiusPx);
    this.createBackgroundSprite(scene, sizePx, baseColor, this.borderRadiusPx);
    this.createIconText(scene, icon, sizePx, baseColor);
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

    // Regenerate textures for background and shadow
    const shadowTexture = this.createShadowTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.borderRadiusPx
    );
    this.shadowSprite.setTexture(shadowTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }

  private createShadowSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    borderRadiusPx: number
  ): void {
    const shadowTexture = this.createShadowTexture(scene, size, baseColor, borderRadiusPx);
    this.shadowSprite = scene.add.sprite(1, SHADOW_OFFSET, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
  }

  private createShadowTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    borderRadiusPx: number
  ): string {
    const textureKey = `iconButton_shadow_r${borderRadiusPx}_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    const sideOuter = size * 2 * CENTER_OFFSET;
    const side = size * 2;
    const radiusOuter = Math.min(borderRadiusPx, sideOuter / 2);
    const radius = Math.min(borderRadiusPx, side / 2);
    graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
    graphics.fillRoundedRect(
      centerX + 1 - sideOuter / 2,
      centerY - sideOuter / 2,
      sideOuter,
      sideOuter,
      radiusOuter
    );
    graphics.fillStyle(Color.hex(`${baseColor}-900`), MAIN_SHADOW_OPACITY);
    graphics.fillRoundedRect(
      centerX - side / 2,
      centerY - CLICK_OFFSET - side / 2,
      side,
      side,
      radius
    );

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  private createBackgroundSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    borderRadiusPx: number
  ): void {
    const backgroundTexture = this.createBackgroundTexture(scene, size, baseColor, borderRadiusPx);
    this.backgroundSprite = scene.add.sprite(1, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
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
    const mainSide = side * MAIN_OVERLAY_SCALE;
    const innerSide = side * INNER_OVERLAY_SCALE;
    const mainRadius = Math.min(borderRadiusPx, mainSide / 2);
    const innerRadius = Math.min(borderRadiusPx, innerSide / 2);
    graphics.fillStyle(Color.hex(`${baseColor}-600`), 1);
    graphics.fillRoundedRect(
      centerX - mainSide / 2,
      centerY - mainSide / 2,
      mainSide,
      mainSide,
      mainRadius
    );
    graphics.fillStyle(Color.hex(`${baseColor}-500`), INNER_OVERLAY_OPACITY);
    graphics.fillRoundedRect(
      centerX - innerSide / 2,
      centerY - innerSide / 2,
      innerSide,
      innerSide,
      innerRadius
    );

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  private createIconText(
    scene: Scene,
    icon: IconKey,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>
  ): void {
    this.iconText = new IconText({
      scene,
      x: 1,
      y: 1,
      icon,
      size,
      style: {
        color: Color.rgb('white'),
        strokeThickness: 3,
        stroke: Color.rgb(`${baseColor}-900`),
      },
    });
    this.iconText.setFontStyle('900');
    this.iconText.setOrigin(0.5, 0.5);
  }

  private setupContainer(): void {
    this.add([this.shadowSprite, this.backgroundSprite, this.iconText]);
  }

  private setupInteractivity(onClick?: () => void): void {
    this.backgroundSprite.setInteractive({ useHandCursor: true });

    this.backgroundSprite.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this.iconText,
        scale: HOVER_SCALE,
        duration: durations.hover,
        ease: 'Linear',
      });
    });

    this.backgroundSprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this.iconText,
        scale: 1,
        duration: durations.hover,
        ease: 'Linear',
      });
    });

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
