import { GameObjects, Scene } from 'phaser';

/**
 * Parameters for creating a SizedBox.
 */
export type SizedBoxParams = {
  /** Phaser scene where the SizedBox will be added. */
  scene: Scene;
  /** X position of the SizedBox. */
  x: number;
  /** Y position of the SizedBox. */
  y: number;
  /** Width of the SizedBox in pixels. If not provided, defaults to 1px. */
  width?: number;
  /** Height of the SizedBox in pixels. If not provided, defaults to 1px. */
  height?: number;
};

/**
 * SizedBox is a simple invisible rectangle component that can be used for spacing
 * and layout purposes. It has no visual appearance but occupies space.
 */
export class SizedBox extends GameObjects.Rectangle {
  /**
   * Creates a new SizedBox instance.
   * @param params SizedBoxParams
   */
  constructor({ scene, x, y, width = 1, height = 1 }: SizedBoxParams) {
    // Validate that at least one dimension is provided
    if (width === undefined && height === undefined) {
      throw new Error('SizedBox must have at least width or height specified');
    }

    const finalWidth = width ?? 1;
    const finalHeight = height ?? 1;

    // Create invisible rectangle (no fill, no stroke)
    super(scene, x, y, finalWidth, finalHeight, 0x000000, 0);
  }

  /**
   * Sets the width of the SizedBox.
   * @param width New width in pixels.
   * @returns This SizedBox instance.
   */
  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  /**
   * Sets the height of the SizedBox.
   * @param height New height in pixels.
   * @returns This SizedBox instance.
   */
  public setHeight(height: number): this {
    this.height = height;
    return this;
  }

  /**
   * Sets both width and height of the SizedBox.
   * @param width New width in pixels.
   * @param height New height in pixels.
   * @returns This SizedBox instance.
   */
  public override setSize(width: number, height: number): this {
    this.width = width;
    this.height = height;
    return this;
  }
}
