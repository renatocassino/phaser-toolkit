/* eslint-disable security/detect-unsafe-regex */

/**
 * Checks if a string is a valid CSS color value
 * @param color - The color string to validate
 * @returns True if the color string is valid, false otherwise
 *
 * Supports the following formats:
 * - Hex colors (#RRGGBB or #RGB)
 * - RGB colors (rgb(r, g, b))
 * - RGBA colors (rgba(r, g, b, a))
 * - OKLCH colors (oklch(l c h [/ a]))
 */
export const isValidColor = (color: string): boolean => {
  if (typeof color !== 'string') {
    return false;
  }

  const trimmedColor = color.trim();
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(trimmedColor)) {
    return true;
  }

  if (
    /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/.test(
      trimmedColor
    )
  ) {
    return true;
  }

  if (
    /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]|0?\.\d+)\s*\)$/.test(
      trimmedColor
    )
  ) {
    return true;
  }

  if (
    /^oklch\(\s*(\d*\.?\d+%?)\s+(\d*\.?\d+)\s+(\d*\.?\d+)(?:\s*\/\s*([01]|0?\.\d+))?\s*\)$/.test(
      trimmedColor
    )
  ) {
    return true;
  }

  return false;
};
