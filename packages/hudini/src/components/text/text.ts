import { Color, Opacity } from 'hudini';

/**
 * The default font size for the Text component.
 * @constant
 */
const DEFAULT_FONT_SIZE = 22;

/**
 * The default stroke thickness for the Text component.
 * @constant
 */
const DEFAULT_STROKE_THICKNESS = 3;

/**
 * Parameters for creating a {@link Text} object.
 */
export type TextParams = {
  /**
   * The Phaser scene where the text will be added.
   */
  scene: Phaser.Scene;
  /**
   * The X coordinate for the text object.
   */
  x: number;
  /**
   * The Y coordinate for the text object.
   */
  y: number;
  /**
   * The displayed string for the text object.
   */
  text: string;
  /**
   * (Optional) Font size in pixels.
   * @defaultValue 22
   */
  size?: number;
  /**
   * (Optional) The font family to use.
   * @defaultValue 'Fredoka'
   */
  fontFamily?: string;
  /**
   * (Optional) Color of the text in RGB.
   * @defaultValue Color.white()
   */
  color?: string;
  /**
   * (Optional) Color of the stroke around the text.
   * @defaultValue 'black'
   */
  strokeColor?: string | CanvasGradient | CanvasPattern;
  /**
   * (Optional) Thickness of the stroke around the text.
   * @defaultValue 3
   */
  strokeThickness?: number;
};

const blackWithAlpha = (alpha: number): string => `rgba(0, 0, 0, ${alpha})`;

/**
 * A simple customizable text component using Phaser's GameObjects.Text.
 *
 * Applies default shadow, stroke, and color styles. The stroke and shadow
 * use semi-transparent black by default (via phaser-wind's `Opacity` tokens)
 * so they layer nicely over any palette instead of looking chapado.
 */
export class Text extends Phaser.GameObjects.Text {
  /**
   * Creates a new {@link Text} object.
   *
   * @param params - Parameters for the text object.
   */
  constructor({
    scene,
    x,
    y,
    text,
    size = DEFAULT_FONT_SIZE,
    fontFamily = 'Fredoka',
    strokeColor = blackWithAlpha(Opacity.value('90')),
    color = Color.white(),
    strokeThickness = DEFAULT_STROKE_THICKNESS,
  }: TextParams) {
    super(scene, x, y, text, {
      font: `${size}px "${fontFamily}"`,
      color,
      stroke: strokeColor,
      strokeThickness,
    });
  }
}
