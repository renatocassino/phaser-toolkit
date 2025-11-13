import Phaser from 'phaser';
import { Color, type ColorKey, type ShadeKey } from 'phaser-wind';

/**
 * Calculates a color variant by adjusting brightness.
 *
 * @param color - The base color (can be a Phaser Wind token like "blue-500" or a CSS color like "#3B82F6")
 * @param tokenDiff - Amount to adjust the shade for color tokens. Positive values make it darker, negative lighter.
 *                    For example: -400 for lighter (blue-500 → blue-100), +400 for darker (blue-500 → blue-900)
 * @param colorDiff - Amount to lighten/darken CSS colors. Positive values lighten, negative values darken.
 *                    Range: 0-100. For example: 90 to lighten, -90 to darken
 * @returns The adjusted color as a number
 *
 * @remarks
 * - If a color token is provided (e.g., "blue-500"), it uses the token system to calculate variants
 *   by adjusting the shade value with tokenDiff (clamped between 100-900)
 * - If a CSS color is provided (hex or rgb), it uses Phaser's lighten/darken methods
 *   with colorDiff (positive = lighten, negative = darken)
 *
 * @example
 * ```typescript
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
  const colorRgb = Color.rgb(color as ColorKey);

  if (Color.isValidColorToken(color as string)) {
    // Token-based calculation
    const parts: [string, string] = color.split('-') as [string, string];
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
