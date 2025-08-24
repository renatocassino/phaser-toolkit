import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorToken,
  type RadiusKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type LinearProgressParams = {
  /** The scene this progress bar belongs to */
  scene: Scene;
  /** X coordinate of the progress bar */
  x: number;
  /** Y coordinate of the progress bar */
  y: number;
  /** Width of the progress bar in pixels */
  width: number;
  /** Height of the progress bar in pixels */
  height: number;
  /** Background color of the progress bar track */
  backgroundColor?: ColorToken;
  /** Color of the progress bar fill */
  progressColor?: ColorToken;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'default'. */
  borderRadius?: RadiusKey | number;
  /** Initial progress value (0-100) */
  progress?: number;
  /** Whether this is an indeterminate progress bar */
  indeterminate?: boolean;
  /** Duration of the indeterminate animation in milliseconds */
  indeterminateAnimationDuration?: number;
};

const A_HUNDRED = 100;
const INDETERMINATE_ANIMATION_DURATION = 1500; // 1.5 seconds

export class LinearProgress extends GameObjects.Container {
  public backgroundProgressBar!: GameObjects.Graphics;
  public progressBar!: GameObjects.Graphics;

  private pw: PhaserWindPlugin<{}>;
  private progressWidth: number;
  private progressHeight: number;
  private borderRadiusPx: number;
  private backgroundColor: ColorToken;
  private progressColor: ColorToken;
  private currentProgress: number;
  private isIndeterminate: boolean;
  private indeterminateAnimation?: Phaser.Tweens.Tween | undefined;
  private indeterminateAnimationDuration: number;

  constructor({
    scene,
    x,
    y,
    width,
    height,
    backgroundColor = 'gray-200',
    progressColor = 'blue-500',
    borderRadius = 'default',
    progress = 0,
    indeterminate = false,
    indeterminateAnimationDuration = INDETERMINATE_ANIMATION_DURATION,
  }: LinearProgressParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    this.progressWidth = width;
    this.progressHeight = height;
    this.backgroundColor = backgroundColor;
    this.progressColor = progressColor;
    this.currentProgress = Math.max(0, Math.min(A_HUNDRED, progress));
    this.isIndeterminate = indeterminate;
    this.indeterminateAnimationDuration = indeterminateAnimationDuration;
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius as RadiusKey);

    this.createBackgroundSprite();
    this.createProgressSprite();
    this.setupContainer();

    if (this.isIndeterminate) {
      this.startIndeterminateAnimation();
    } else {
      this.updateProgressBar();
    }
  }

  /**
   * Sets the progress value (0-100)
   * @param progress Progress value between 0 and 100
   * @param animate Whether to animate the change (default: true)
   */
  public setProgress(progress: number, animate: boolean = true): this {
    if (this.isIndeterminate) {
      return this;
    }

    const newProgress = Math.max(0, Math.min(A_HUNDRED, progress));
    if (this.currentProgress === newProgress) {
      return this;
    }

    if (animate) {
      const target = { value: this.currentProgress };
      this.scene.tweens.add({
        targets: target,
        value: newProgress,
        duration: 300,
        ease: 'Power2',
        onUpdate: () => {
          this.currentProgress = target.value;
          this.updateProgressBar();
        },
      });
    } else {
      this.currentProgress = newProgress;
      this.updateProgressBar();
    }

    return this;
  }

  /**
   * Gets the current progress value
   * @returns Current progress value (0-100)
   */
  public getProgress(): number {
    return this.currentProgress;
  }

  /**
   * Sets whether the progress bar is indeterminate
   * @param indeterminate Whether to show indeterminate animation
   */
  public setIndeterminate(indeterminate: boolean): this {
    if (this.isIndeterminate === indeterminate) {
      return this;
    }

    this.isIndeterminate = indeterminate;

    if (this.isIndeterminate) {
      this.stopIndeterminateAnimation();
      this.startIndeterminateAnimation();
    } else {
      this.stopIndeterminateAnimation();
      this.updateProgressBar();
    }

    return this;
  }

  /**
   * Sets the border radius of the progress bar
   * @param borderRadius Border radius in px (number) or a Phaser Wind radius token (string)
   */
  public setBorderRadius(borderRadius: RadiusKey | number): this {
    const newRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius as RadiusKey);

    if (this.borderRadiusPx === newRadiusPx) {
      return this;
    }

    this.borderRadiusPx = newRadiusPx;
    this.recreateSprites();
    return this;
  }

  /**
   * Sets the background color of the progress bar
   * @param color Background color token
   */
  public setBackgroundColor(color: ColorToken): this {
    if (this.backgroundColor === color) {
      return this;
    }

    this.backgroundColor = color;
    this.recreateSprites();
    return this;
  }

  /**
   * Sets the progress color of the progress bar
   * @param color Progress color token
   */
  public setProgressColor(color: ColorToken): this {
    if (this.progressColor === color) {
      return this;
    }

    this.progressColor = color;
    this.recreateSprites();
    return this;
  }

  /**
   * Destroys the component and cleans up animations
   */
  public override destroy(): void {
    this.stopIndeterminateAnimation();
    super.destroy();
  }

  private createBackgroundSprite(): void {
    const bgGraphic = this.scene.add.graphics();
    bgGraphic.fillStyle(Color.hex(this.backgroundColor), 1);
    bgGraphic.fillRoundedRect(
      -this.progressWidth / 2,
      -this.progressHeight / 2,
      this.progressWidth,
      this.progressHeight,
      this.borderRadiusPx
    );

    this.backgroundProgressBar = bgGraphic;
  }

  private createProgressSprite(): void {
    const progressBar = this.scene.add.graphics();
    progressBar.fillStyle(Color.hex(this.progressColor), 1);
    progressBar.fillRoundedRect(
      -this.progressWidth / 2,
      -this.progressHeight / 2,
      this.progressWidth,
      this.progressHeight,
      this.borderRadiusPx
    );

    this.progressBar = progressBar;
  }

  private setupContainer(): void {
    this.add([this.backgroundProgressBar, this.progressBar]);
  }

  private calculateProgressDimensions(): { progressWidth: number; leftOffset: number } {
    const progressWidth = (this.progressWidth * this.currentProgress) / A_HUNDRED;
    const leftOffset = (progressWidth - this.progressWidth) / 2;
    return { progressWidth, leftOffset };
  }

  private updateProgressBar(force: boolean = false): void {
    if (this.isIndeterminate && !force) {
      return;
    }

    const { progressWidth, leftOffset } = this.calculateProgressDimensions();
    this.progressBar.setScale(progressWidth / this.progressWidth, 1);
    this.progressBar.setX(leftOffset);
  }

  private startIndeterminateAnimation(): void {
    if (!this.isIndeterminate) {
      return;
    }

    this.currentProgress = 40;
    this.updateProgressBar(true);
    const { progressWidth } = this.calculateProgressDimensions();
    // Calculate the movement range: the bar should move within the background bounds
    // The bar center can move from left edge + half bar width to right edge - half bar width
    const maxX = (this.progressWidth / 2) - (progressWidth / 2);
    const minX = -(this.progressWidth / 2) + (progressWidth / 2);

    // Start from the left
    this.progressBar.setX(minX);

    this.indeterminateAnimation = this.scene.tweens.add({
      targets: this.progressBar,
      x: maxX,
      duration: this.indeterminateAnimationDuration,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private stopIndeterminateAnimation(): void {
    if (this.indeterminateAnimation) {
      this.indeterminateAnimation.destroy();
      this.indeterminateAnimation = undefined;
    }
  }

  private recreateSprites(): void {
    // Remove old sprites
    this.remove([this.backgroundProgressBar, this.progressBar]);
    this.backgroundProgressBar.destroy();
    this.progressBar.destroy();

    // Create new sprites with updated properties
    this.createBackgroundSprite();
    this.createProgressSprite();
    this.setupContainer();

    // Restore state
    if (this.isIndeterminate) {
      this.startIndeterminateAnimation();
    } else {
      this.updateProgressBar();
    }
  }
}