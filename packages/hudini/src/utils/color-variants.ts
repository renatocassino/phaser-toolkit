import Phaser from 'phaser';
import { Color, palette, type ColorKey, type ShadeKey } from 'phaser-wind';

/**
 * Calculates a color variant by adjusting brightness.
 *
 * @param color - The base color (can be a Phaser Wind token like "blue-500", a color name like "red", or a CSS color like "#3B82F6")
 * @param tokenDiff - Amount to adjust the shade for color tokens. Positive values make it darker, negative lighter.
 *                    For example: -400 for lighter (blue-500 → blue-100), +400 for darker (blue-500 → blue-900)
 * @param colorDiff - Amount to lighten/darken CSS colors. Positive values lighten, negative values darken.
 *                    Range: 0-100. For example: 90 to lighten, -90 to darken
 * @returns The adjusted color as a number
 *
 * @remarks
 * - If only a color name is provided without a shade (e.g., "red"), it automatically adds "-500" as the default shade
 * - If a color token is provided (e.g., "blue-500"), it uses the token system to calculate variants
 *   by adjusting the shade value with tokenDiff (clamped between 100-900)
 * - If a CSS color is provided (hex or rgb), it uses Phaser's lighten/darken methods
 *   with colorDiff (positive = lighten, negative = darken)
 *
 * @example
 * ```typescript
 * // Using color name only - defaults to -500
 * const defaultRed = getColorVariant('red', 0, 0);
 * // Returns red-500 color value
 *
 * // Using color token - lighter variant
 * const lightBlue = getColorVariant('blue-500', -400, 0);
 * // Returns blue-100 color value
 *
 * // Using color token - darker variant
 * const darkBlue = getColorVariant('blue-500', 400, 0);
 * // Returns blue-900 color value
 *
 * // Using CSS color - lighter
 * const lightCss = getColorVariant('#3B82F6', 0, 90);
 * // Returns lightened color
 *
 * // Using CSS color - darker
 * const darkCss = getColorVariant('#3B82F6', 0, -90);
 * // Returns darkened color
 * ```
 */
export const getColorVariant = (
  color: ColorKey | string,
  tokenDiff: number,
  colorDiff: number
): number => {
  // If only the color name is provided (without shade), validate and add -500 as default
  let normalizedColor = color;
  if (typeof color === 'string' && !color.includes('-') && !Color.isValidColorToken(color)) {
    // Check if the color exists in the palette
    if (color in palette && color !== 'black' && color !== 'white') {
      normalizedColor = `${color}-500`;
    }
  }

  const colorRgb = Color.rgb(normalizedColor as ColorKey);

  if (Color.isValidColorToken(normalizedColor as string)) {
    // Token-based calculation
    const parts: [string, string] = normalizedColor.split('-') as [string, string];
    const colorShade = parseInt(parts[1].toString(), 10);
    const shadeMin = 100;
    const shadeMax = 900;
    const newShade = Math.max(
      Math.min(colorShade + tokenDiff, shadeMax),
      shadeMin
    ).toString() as ShadeKey;

    return Color.hex(`${parts[0]}-${newShade}`);
  }

  // CSS color calculation
  const baseColor = Phaser.Display.Color.ValueToColor(colorRgb);

  if (colorDiff === 0) {
    return baseColor.color;
  }

  if (colorDiff > 0) {
    return baseColor.clone().lighten(colorDiff).color;
  }

  return baseColor.clone().darken(Math.abs(colorDiff)).color;
};
