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

export class IconButton extends GameObjects.Container {
  public backgroundSprite!: GameObjects.Sprite;
  public shadowSprite!: GameObjects.Sprite;
  public iconText!: IconText;
  private pw: PhaserWindPlugin<{}>;

  constructor({ scene, x, y, icon, size, color, onClick }: IconButtonParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    const sizePx =
      typeof size === 'number'
        ? size
        : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));
    const baseColor = color ?? 'gray';

    this.createShadowSprite(scene, sizePx, baseColor);
    this.createBackgroundSprite(scene, sizePx, baseColor);
    this.createIconText(scene, icon, sizePx, baseColor);
    this.setupContainer();
    this.setupInteractivity(onClick);
  }

  private createShadowSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>
  ): void {
    const shadowTexture = this.createShadowTexture(scene, size, baseColor);
    this.shadowSprite = scene.add.sprite(1, SHADOW_OFFSET, shadowTexture);
    this.shadowSprite.setOrigin(0.5, 0.5);
  }

  private createShadowTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>
  ): string {
    const textureKey = `iconButton_shadow_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
    graphics.fillCircle(centerX + 1, centerY, size * CENTER_OFFSET);
    graphics.fillStyle(Color.hex(`${baseColor}-900`), MAIN_SHADOW_OPACITY);
    graphics.fillCircle(centerX, centerY - CLICK_OFFSET, size);

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();

    return textureKey;
  }

  private createBackgroundSprite(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>
  ): void {
    const backgroundTexture = this.createBackgroundTexture(
      scene,
      size,
      baseColor
    );
    this.backgroundSprite = scene.add.sprite(1, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  private createBackgroundTexture(
    scene: Scene,
    size: number,
    baseColor: Omit<ColorKey, 'black' | 'white'>
  ): string {
    const textureKey = `iconButton_${baseColor}_${size}`;
    const textureSize = size * BUTTON_SCALE;
    const centerX = size * CENTER_OFFSET;
    const centerY = size * CENTER_OFFSET;

    const graphics = scene.add.graphics();
    graphics.fillStyle(Color.hex(`${baseColor}-600`), 1);
    graphics.fillCircle(centerX, centerY, size * MAIN_OVERLAY_SCALE);
    graphics.fillStyle(Color.hex(`${baseColor}-500`), INNER_OVERLAY_OPACITY);
    graphics.fillCircle(centerX, centerY, size * INNER_OVERLAY_SCALE);

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
