/* eslint-disable max-lines */
import { GameObjects, Scene } from 'phaser';
import { FontSizeKey, PhaserWindPlugin, type ColorToken } from 'phaser-wind';

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
    /** Whether to show the percentage text in the center */
    showText?: boolean;
    /** Color of the percentage text */
    textColor?: ColorToken;
    /** Font size of the percentage text */
    fontSize?: FontSizeKey;
    /** Alpha of the percentage text */
    textAlpha?: number;
};

const A_HUNDRED = 100;
const THREE_SIXTY = 360;
const START_ANGLE = 270;
const DEFAULT_THICKNESS = 4;
const DEFAULT_BACKGROUND_ALPHA = 0.2;
const DEFAULT_TEXT_COLOR = 'white';
const DEFAULT_FONT_SIZE: FontSizeKey = 'base';
const DEFAULT_TEXT_ALPHA = 1;

export class RadialProgress extends GameObjects.Container {
    public backgroundProgressBar!: GameObjects.Graphics;
    public progressBar!: GameObjects.Graphics;
    public radialArc!: GameObjects.Graphics;
    public percentageText?: GameObjects.Text | undefined;

    private pw: PhaserWindPlugin<{}>;
    private radius: number;
    private thickness: number;
    private backgroundColor: ColorToken;
    private backgroundAlpha: number;
    private progressColor: ColorToken;
    private currentProgress: number;
    private startAngle: number;
    private showText: boolean;
    private textColor: ColorToken;
    private fontSize: FontSizeKey;
    private textAlpha: number;

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
        showText = false,
        textColor = DEFAULT_TEXT_COLOR,
        fontSize = DEFAULT_FONT_SIZE,
        textAlpha = DEFAULT_TEXT_ALPHA,
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
        this.showText = showText;
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.textAlpha = textAlpha;

        this.createBackgroundSprite();
        this.createRadialArc();
        if (this.showText) {
            this.createPercentageText();
        }
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
                    this.updatePercentageText();
                },
            });
        } else {
            this.currentProgress = newProgress;
            this.updateProgressBar();
            this.updatePercentageText();
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
     * Sets the background alpha of the progress bar
     * @param alpha Background alpha value (0-1)
     */
    public setBackgroundAlpha(alpha: number): this {
        if (this.backgroundAlpha === alpha) {
            return this;
        }

        this.backgroundAlpha = alpha;
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
     * Sets whether to show the percentage text
     * @param show Whether to show the text
     */
    public setShowText(show: boolean): this {
        if (this.showText === show) {
            return this;
        }

        this.showText = show;
        if (show && !this.percentageText) {
            this.createPercentageText();
            if (this.percentageText) {
                this.add(this.percentageText);
            }
        } else if (!show && this.percentageText) {
            this.remove(this.percentageText);
            this.percentageText.destroy();
            this.percentageText = undefined;
        }

        return this;
    }

    /**
     * Sets the text color
     * @param color Text color token
     */
    public setTextColor(color: ColorToken): this {
        if (this.textColor === color) {
            return this;
        }

        this.textColor = color;
        if (this.percentageText) {
            this.percentageText.destroy();
            this.createPercentageText();
            this.add(this.percentageText);
        }
        return this;
    }

    /**
     * Sets the font size
     * @param size Font size in pixels
     */
    public setFontSize(size: FontSizeKey): this {
        if (this.fontSize === size) {
            return this;
        }

        this.fontSize = size;
        if (this.percentageText) {
            this.percentageText.destroy();
            this.createPercentageText();
            this.add(this.percentageText);
        }
        return this;
    }

    /**
     * Sets the text alpha
     * @param alpha Alpha value (0-1)
     */
    public setTextAlpha(alpha: number): this {
        if (this.textAlpha === alpha) {
            return this;
        }

        this.textAlpha = alpha;
        if (this.percentageText) {
            this.percentageText.setAlpha(this.textAlpha);
        }
        return this;
    }

    /**
     * Sets the radius of the progress bar
     * @param radius New radius in pixels
     */
    public setRadius(radius: number): this {
        if (this.radius === radius) {
            return this;
        }

        this.radius = radius;
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

    private createPercentageText(): void {
        this.percentageText = this.scene.add.text(0, 0, `${Math.round(this.currentProgress)}%`, {
            fontSize: this.pw.fontSize.css(this.fontSize),
            color: this.pw.color.rgb(this.textColor),
            fontStyle: 'bold',
        });
        this.percentageText.setOrigin(0.5);
        this.percentageText.setAlpha(this.textAlpha);
    }

    public setThickness(thickness: number): void {
        this.thickness = thickness;
        this.recreateSprites();
    }

    private setupContainer(): void {
        const children: GameObjects.GameObject[] = [this.backgroundProgressBar, this.radialArc];
        if (this.percentageText) {
            children.push(this.percentageText);
        }
        this.add(children);
    }

    private updateProgressBar(): void {
        if (!this.radialArc) return;

        this.radialArc.clear();
        const startAngleRad = Phaser.Math.DegToRad(this.startAngle);
        const sweepRad = Phaser.Math.DegToRad((this.currentProgress / A_HUNDRED) * THREE_SIXTY);
        const endAngleRad = startAngleRad + sweepRad;
        const isFullCircle = this.currentProgress >= A_HUNDRED;

        this.radialArc.lineStyle(this.thickness, this.pw.color.hex(this.progressColor), 1);
        this.radialArc.beginPath();

        if (isFullCircle) {
            this.radialArc.arc(0, 0, this.radius, 0, Phaser.Math.PI2, false);
        } else {
            this.radialArc.arc(0, 0, this.radius, startAngleRad, endAngleRad, false);
        }

        this.radialArc.strokePath();
    }

    private updatePercentageText(): void {
        if (this.percentageText) {
            this.percentageText.setText(`${Math.round(this.currentProgress)}%`);
        }
    }

    private recreateSprites(): void {
        const children: GameObjects.GameObject[] = [this.backgroundProgressBar, this.radialArc];
        if (this.percentageText) {
            children.push(this.percentageText);
        }
        this.remove(children);
        this.backgroundProgressBar.destroy();
        this.radialArc.destroy();
        if (this.percentageText) {
            this.percentageText.destroy();
            this.percentageText = undefined;
        }

        this.createBackgroundSprite();
        this.createRadialArc();
        if (this.showText) {
            this.createPercentageText();
        }
        this.setupContainer();
        this.updateProgressBar();
    }
}
