import { IconText, type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  ColorToken,
  PhaserWindPlugin,
  type ColorKey,
  type FontSizeKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type CircularProgressParams = {
  scene: Scene;
  x: number;
  y: number;
  icon?: IconKey;
  size?: FontSizeKey | number;
  color?: ColorKey | ColorToken;
  rotationsPerSecond?: number;
};

const DEFAULT_ICON: IconKey = 'spinner';
const DEFAULT_COLOR: ColorKey = 'blue';
const ROTATIONS_PER_SECOND = 2;
const ONE_SECOND = 1000;

export class CircularProgress extends GameObjects.Container {
  public iconText!: IconText;

  private pw: PhaserWindPlugin<{}>;
  private rotationSpeed: number;
  private isSpinning: boolean = true;

  constructor({
    scene,
    x,
    y,
    icon = DEFAULT_ICON,
    size,
    color = DEFAULT_COLOR,
    rotationsPerSecond = ROTATIONS_PER_SECOND
  }: CircularProgressParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);
    this.rotationSpeed = rotationsPerSecond;

    const sizePx = typeof size === 'number'
      ? size
      : this.pw.fontSize.px(size ?? ('md' as FontSizeKey));

    this.createIconText(scene, icon, sizePx, color);
    this.setupContainer();
    this.startSpinning();
  }

  /**
   * Start the spinning animation
   */
  public start(): this {
    if (!this.isSpinning) {
      this.isSpinning = true;
      this.startSpinning();
    }
    return this;
  }

  /**
   * Stop the spinning animation
   */
  public stop(): this {
    this.isSpinning = false;
    this.scene.tweens.killTweensOf(this.iconText);
    return this;
  }

  /**
   * Set the rotation speed
   * @param speed - Rotations per second
   */
  public setRotationsPerSecond(rotationsPerSecond: number): this {
    this.rotationSpeed = rotationsPerSecond;
    if (this.isSpinning) {
      this.scene.tweens.killTweensOf(this.iconText);
      this.startSpinning();
    }
    return this;
  }

  /**
   * Set the icon
   * @param icon - Font Awesome icon key
   */
  public setIcon(icon: IconKey): this {
    this.iconText.setIcon(icon);
    return this;
  }

  /**
   * Set the color
   * @param color - Phaser Wind color token
   */
  public setColor(color: ColorToken): this {
    this.iconText.setStyle({
      color: this.pw.color.rgb(color),
    });
    return this;
  }

  /**
   * Set the size
   * @param size - Font size key or pixel value
   */
  public override setSize(size: FontSizeKey | number): this {
    const sizePx = typeof size === 'number'
      ? size
      : this.pw.fontSize.px(size);

    this.iconText.setFontSize(`${sizePx}px`);
    return this;
  }

  /**
   * Check if the spinner is currently spinning
   */
  public get spinning(): boolean {
    return this.isSpinning;
  }

  private createIconText(
    scene: Scene,
    icon: IconKey,
    size: number,
    color: ColorKey | ColorToken
  ): void {
    // Convert color to ColorToken if it's just a ColorKey
    // 'black' and 'white' are already ColorTokens, and colors with '-' are already ColorTokens
    let colorToken: ColorToken;
    if (color === 'black' || color === 'white' || color.includes('-')) {
      colorToken = color as ColorToken;
    } else {
      // Default to -500 shade for ColorKey
      colorToken = `${color}-500` as ColorToken;
    }
    
    this.iconText = new IconText({
      scene,
      x: 0,
      y: 0,
      icon,
      size,
      style: {
        color: this.pw.color.rgb(colorToken),
      },
    });
    this.iconText.setOrigin(0.5, 0.5);
  }

  private setupContainer(): void {
    this.add([this.iconText]);
  }

  private startSpinning(): void {
    if (!this.isSpinning) return;

    const duration = ONE_SECOND / this.rotationSpeed;

    this.scene.tweens.add({
      targets: this.iconText,
      rotation: Math.PI * 2,
      duration,
      ease: 'Linear',
      repeat: -1,
      onComplete: () => {
        // Reset rotation to prevent accumulation
        this.iconText.rotation = 0;
      },
    });
  }

  /**
   * Clean up the component
   */
  public override destroy(): void {
    this.stop();
    super.destroy();
  }
}