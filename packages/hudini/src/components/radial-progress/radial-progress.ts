import { GameObjects, Scene } from 'phaser';
import { PhaserWindPlugin, type ColorToken } from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type RadialProgressParams = {
  /** The scene this progress bar belongs to */
  scene: Scene;
  /** X coordinate of the progress bar */
  x: number;
  /** Y coordinate of the progress bar */
  y: number;
  /** Radius of the progress bar in pixels */
  radius: number;
  /** Background color of the progress bar track */
  backgroundColor?: ColorToken;
  /** Alpha of the background color */
  backgroundAlpha?: number;
  /** Color of the progress bar fill */
  progressColor?: ColorToken;
  /** Thickness of the progress bar in pixels */
  thickness?: number;
  /** Initial progress value (0-100) */
  progress?: number;

  /** Start angle of the progress bar in degrees */
  startAngle?: number;
};

const A_HUNDRED = 100;
const THREE_SIXTY = 360;
const START_ANGLE = 270;
const DEFAULT_THICKNESS = 4;
const DEFAULT_BACKGROUND_ALPHA = 0.2;

export class RadialProgress extends GameObjects.Container {
  public backgroundProgressBar!: GameObjects.Graphics;
  public progressBar!: GameObjects.Graphics;
  public radialArc!: GameObjects.Graphics;

  private pw: PhaserWindPlugin<{}>;
  private radius: number;
  private thickness: number;
  private backgroundColor: ColorToken;
  private backgroundAlpha: number;
  private progressColor: ColorToken;
  private currentProgress: number;
  private startAngle: number;

  constructor({
    scene,
    x,
    y,
    radius,
    thickness = DEFAULT_THICKNESS,
    backgroundColor = 'gray-200',
    backgroundAlpha = DEFAULT_BACKGROUND_ALPHA,
    progressColor = 'blue-500',
    progress = 0,
    startAngle = START_ANGLE,
  }: RadialProgressParams) {
    super(scene, x, y);
    this.pw = getPWFromScene(scene);

    this.radius = radius;
    this.thickness = thickness;
    this.backgroundColor = backgroundColor;
    this.backgroundAlpha = backgroundAlpha;
    this.progressColor = progressColor;
    this.currentProgress = Math.max(0, Math.min(A_HUNDRED, progress));
    this.startAngle = startAngle;

    this.createBackgroundSprite();
    this.createRadialArc();
    this.setupContainer();
    this.updateProgressBar();
  }

  /**
   * Sets the progress value (0-100)
   * @param progress Progress value between 0 and 100
   * @param animate Whether to animate the change (default: true)
   */
  public setProgress(progress: number, animate: boolean = true): this {
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
    super.destroy();
  }

  private createBackgroundSprite(): void {
    const bgGraphic = this.scene.add.graphics();
    // Draw a circle with alpha background
    bgGraphic.fillStyle(
      this.pw.color.hex(this.backgroundColor),
      this.backgroundAlpha
    );
    bgGraphic.beginPath();
    bgGraphic.arc(0, 0, this.radius, 0, Phaser.Math.PI2, false);
    bgGraphic.closePath();
    bgGraphic.fillPath();

    this.backgroundProgressBar = bgGraphic;
  }

  private createRadialArc(): void {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(
      this.thickness,
      this.pw.color.hex(this.progressColor),
      1
    );
    graphics.beginPath();
    graphics.arc(
      0,
      0,
      this.radius,
      this.startAngle,
      Phaser.Math.DegToRad(THREE_SIXTY),
      true
    );
    graphics.strokePath();
    this.radialArc = graphics;
  }

  public setThickness(thickness: number): void {
    this.thickness = thickness;
    this.recreateSprites();
  }

  private setupContainer(): void {
    this.add([this.backgroundProgressBar, this.radialArc]);
  }

  private updateProgressBar(): void {
    // Calcula o ângulo do arco com base na porcentagem de progresso (0 = 0°, 100 = 360°)
    if (this.radialArc) {
      this.radialArc.clear();
      // O arco deve começar no topo (ângulo 270° em radianos)
      const startAngleRad = Phaser.Math.DegToRad(this.startAngle);
      // O ângulo final é o início + fração do círculo (progresso)
      const sweepRad = Phaser.Math.DegToRad(
        (this.currentProgress / A_HUNDRED) * THREE_SIXTY
      );
      let endAngleRad = startAngleRad + sweepRad;

      // Se for 100%, desenhe o círculo completo (Phaser não fecha o arco se start==end)
      const isFullCircle = this.currentProgress >= A_HUNDRED;

      this.radialArc.lineStyle(
        this.thickness,
        this.pw.color.hex(this.progressColor),
        1
      );
      this.radialArc.beginPath();
      if (isFullCircle) {
        // Desenha o círculo completo
        this.radialArc.arc(0, 0, this.radius, 0, Phaser.Math.PI2, false);
      } else {
        // Desenha o arco de acordo com o progresso
        this.radialArc.arc(
          0,
          0,
          this.radius,
          startAngleRad,
          endAngleRad,
          false
        );
      }
      this.radialArc.strokePath();
    }
  }

  private recreateSprites(): void {
    // Remove old sprites
    this.remove([this.backgroundProgressBar, this.radialArc]);
    this.backgroundProgressBar.destroy();
    this.radialArc.destroy();

    // Create new sprites with updated properties
    this.createBackgroundSprite();
    this.createRadialArc();
    this.setupContainer();
    this.updateProgressBar();
  }
}
