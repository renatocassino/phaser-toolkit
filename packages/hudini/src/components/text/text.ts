import { Color } from 'hudini';

/**
 * The default font size for the Text component.
 * @constant
 */
const DEFAULT_FONT_SIZE = 22;

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
   * @defaultValue 16
   */
  size?: number;
  /**
   * (Optional) The font family to use.
   * @defaultValue 'monospace'
   */
  fontFamily?: string;
};

/**
 * A simple customizable text component using Phaser's GameObjects.Text.
 * 
 * Applies default shadow, stroke, and color styles.
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
    fontFamily = 'Bebas Neue',
  }: TextParams) {
    super(scene, x, y, text, {
      font: `${size}px "${fontFamily}"`,
      color: Color.white(),
      stroke: Color.black(),
      strokeThickness: 2,
      shadow: {
        offsetX: 0,
        offsetY: 3,
        color: Color.black(),
        blur: 0,
        stroke: true,
        fill: true,
      },
    });
  }
}
