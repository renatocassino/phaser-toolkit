import { Color, isColorKey, Opacity, type ColorKey } from 'phaser-wind';

/**
 * Visual variants shared by {@link TextButton} and {@link IconButton}.
 *
 * - `'filled'` (default): solid colored fill, white text/icon with a darker
 *   colored outline stroke (daisyUI `btn-<color>`).
 * - `'outline'`: transparent fill, colored border, colored text/icon
 *   (daisyUI `btn-outline btn-<color>`).
 */
export type ButtonVariant = 'filled' | 'outline';

/** Thickness of the outline stroke around a button's text or icon glyph. */
export const BUTTON_STROKE_THICKNESS = 3;

/** Thickness of the outer border used by the `'outline'` button variant. */
export const BUTTON_OUTLINE_THICKNESS = 3;

/**
 * Amount added to the palette shade to derive the button's stroke color.
 * `blue-500` + 400 → `blue-900` — a darker outline that still lives in the
 * same palette family, so it never clashes with the fill.
 */
const STROKE_DARKER_SHIFT = 400;

/**
 * Opacity token used for the fallback stroke when the button color isn't a
 * palette reference. Solid black chapado is too harsh against many fills;
 * ~60% translucent black keeps the outline readable while blending in.
 */
const FALLBACK_STROKE_OPACITY_KEY = '60' as const;

const blackWithAlpha = (alpha: number): string => `rgba(0, 0, 0, ${alpha})`;

/**
 * Compute the outline (stroke) color for the text or icon of a button, given
 * the button's own color input.
 *
 * - Palette-based color (family like `'blue'` or a full token like
 *   `'blue-500'`): a darker shade in the same palette family via
 *   {@link Color.shift}.
 * - Arbitrary CSS color (`'#3B82F6'`, `'rgb(...)'`): soft translucent black.
 *
 * Shared between {@link TextButton} and {@link IconButton} so both render
 * with the same outline style.
 */
export const getButtonStrokeColor = (colorInput: string): string => {
  const isPaletteColor =
    isColorKey(colorInput) || Color.isValidColorToken(colorInput);
  return isPaletteColor
    ? Color.rgb(Color.shift(colorInput as ColorKey, STROKE_DARKER_SHIFT))
    : blackWithAlpha(Opacity.value(FALLBACK_STROKE_OPACITY_KEY));
};
