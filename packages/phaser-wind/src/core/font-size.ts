import { BaseThemeConfig } from '../theme';

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

/**
 * Maps font size keys to their pixel values
 */
export type FontSizeMap = Record<FontSizeKey | string, number>;

/**
 * Default mapping of font size keys to their pixel values in pixels
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
 * API for converting font sizes between different units
 * @template T - Optional custom font size map type
 */
export type FontSizeApi<T extends FontSizeMap | undefined> = {
  /**
   * Convert font size key to pixels
   * @param key - Font size key from default or custom map
   * @returns Font size in pixels
   */
  px: (key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)) => number;

  /**
   * Convert font size key to rem units
   * @param key - Font size key from default or custom map
   * @returns Font size in rem units
   */
  rem: (key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)) => number;

  /**
   * Convert font size key to CSS string with px unit
   * @param key - Font size key from default or custom map
   * @returns Font size as CSS string (e.g. "16px")
   */
  css: (key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)) => string;
};

/**
 * Creates a font size conversion API with optional custom font sizes
 * @template T - Optional custom font size map type
 * @param themeFontSizes - Optional custom font size mappings to extend defaults
 * @returns Font size conversion API
 */
export const createFontSize = <
  T extends FontSizeMap | undefined = BaseThemeConfig['fontSizes'],
>(
  themeFontSizes?: T
): FontSizeApi<T> => {
  const fontmap: FontSizeMap = {
    ...fontSizeMap,
    ...(themeFontSizes as FontSizeMap | undefined),
  } as FontSizeMap;

  return {
    px: (
      key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)
    ): number => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return value;
      }

      return 0;
    },
    rem: (
      key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)
    ): number => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return value / 16;
      }

      return 0;
    },
    css: (
      key: FontSizeKey | (T extends FontSizeMap ? keyof T : never)
    ): string => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return `${value}px`;
      }

      return '0px';
    },
  };
};

// Convenience instance using default font sizes (no theme)
export const FontSize: FontSizeApi<undefined> =
  createFontSize<undefined>(undefined);
