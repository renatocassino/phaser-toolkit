/**
 * Available font size keys matching Tailwind CSS font size scale
 */
export type FontSizeKey =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

export type FontSizeMap = Record<FontSizeKey, number>;

/**
 * Mapping of font size keys to their pixel values
 */
export const fontSizeMap: FontSizeMap = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
};

/**
 * Utility functions for working with font sizes
 */
export const FontSize = {
  /**
   * Get font size in pixels
   * @param key - Font size key (e.g., 'sm', 'lg', '2xl')
   * @returns Font size in pixels
   */
  px: (key: FontSizeKey): number => fontSizeMap[key],

  /**
   * Get font size in rem units (relative to 16px base)
   * @param key - Font size key (e.g., 'sm', 'lg', '2xl')
   * @returns Font size in rem units
   */
  rem: (key: FontSizeKey): number => fontSizeMap[key] / 16,

  /**
   * Get font size as CSS pixel string
   * @param key - Font size key (e.g., 'sm', 'lg', '2xl')
   * @returns Font size as CSS string (e.g., '14px')
   */
  css: (key: FontSizeKey): string => `${fontSizeMap[key]}px`,
};
