import Phaser from 'phaser';

/**
 * Convert a `0xRRGGBB` color number into a CSS `rgb(r, g, b)` string.
 *
 * Handy when a numeric Phaser color (e.g. produced by `pw.color.hex(...)` or
 * `getColorVariant(...)`) needs to feed a `Phaser.GameObjects.Text` style
 * field like `color`, `stroke` or `shadow.color`, which expect strings.
 *
 * @param color - Color as a 24-bit integer (`0xRRGGBB`).
 * @returns CSS `rgb(r, g, b)` string.
 *
 * @example
 * const dark = getColorVariant('blue-500', 400, 0); // number
 * text.setStroke(numberToRgb(dark), 3);
 */
export const numberToRgb = (color: number): string => {
  const c = Phaser.Display.Color.ValueToColor(color);
  return `rgb(${c.red}, ${c.green}, ${c.blue})`;
};
