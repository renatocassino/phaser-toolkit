import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
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
  shape?: 'circle' | 'square';
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
const SQUARE_RADIUS_RATIO = 0.25; // smooth corner radius proportion for square

export class IconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public shadowSprite!: GameObjects.Sprite;
  public iconText!: IconText;
  private pw: PhaserWindPlugin<{}>;
  private shape: 'circle' | 'square' = 'circle';
  private baseColor!: Omit<ColorKey, 'black' | 'white'>;
  private sizePx!: number;

  constructor({ scene, x, y, icon, size, color, onClick, shape }: IconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);
    this.shape = shape ?? 'circle';

    const sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    const baseColor = color ?? 'gray';
    this.sizePx = sizePx;
    this.baseColor = baseColor;

    this.createShadowSprite(scene, sizePx, baseColor, this.shape);
    this.createBackgroundSprite(scene, sizePx, baseColor, this.shape);
    this.createIconText(scene, icon, sizePx, baseColor);
    this.setupContainer();
    this.setupInteractivity(onClick);
  }

  public setShape(shape: 'circle' | 'square'): this {
    if (this.shape === shape) return this;
    this.shape = shape;

    // Regenerate textures for background and shadow
    const shadowTexture = this.createShadowTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.shape
    );
    const backgroundTexture = this.createBackgroundTexture(
      this.scene,
      this.sizePx,
      this.baseColor,
      this.shape
    );
    this.shadowSprite.setTexture(shadowTexture);
    this.backgroundSprite.setTexture(backgroundTexture);
    return this;
  }

  private createShadowSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    shape: 'circle' | 'square'
  ): void {
    const shadowTexture = this.createShadowTexture(scene, size, baseColor, shape);
    this.shadowSprite = scene.add.sprite(1, SHADOW_OFFSET, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
  }

  private createShadowTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    shape: 'circle' | 'square'
  ): string {
    const textureKey = `iconButton_shadow_${shape}_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    if (shape === 'circle') {
      graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
      graphics.fillCircle(centerX + 1, centerY, size * CENTER_OFFSET);
      graphics.fillStyle(Color.hex(`${baseColor}-900`), MAIN_SHADOW_OPACITY);
      graphics.fillCircle(centerX, centerY - CLICK_OFFSET, size);
    } else {
      // square with smooth border radius
      const sideOuter = size * 2 * CENTER_OFFSET;
      const side = size * 2;
      const radiusOuter = sideOuter * SQUARE_RADIUS_RATIO;
      const radius = side * SQUARE_RADIUS_RATIO;
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
    }

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  private createBackgroundSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    shape: 'circle' | 'square'
  ): void {
    const backgroundTexture = this.createBackgroundTexture(
      scene,
      size,
      baseColor,
      shape
    );
    this.backgroundSprite = scene.add.sprite(1, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private createBackgroundTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>,
    shape: 'circle' | 'square'
  ): string {
    const textureKey = `iconButton_${shape}_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    if (shape === 'circle') {
      graphics.fillStyle(Color.hex(`${baseColor}-600`), 1);
      graphics.fillCircle(centerX, centerY, size * MAIN_OVERLAY_SCALE);
      graphics.fillStyle(Color.hex(`${baseColor}-500`), INNER_OVERLAY_OPACITY);
      graphics.fillCircle(centerX, centerY, size * INNER_OVERLAY_SCALE);
    } else {
      const side = size * 2;
      const mainSide = side * MAIN_OVERLAY_SCALE;
      const innerSide = side * INNER_OVERLAY_SCALE;
      const mainRadius = mainSide * SQUARE_RADIUS_RATIO;
      const innerRadius = innerSide * SQUARE_RADIUS_RATIO;
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
    }

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
