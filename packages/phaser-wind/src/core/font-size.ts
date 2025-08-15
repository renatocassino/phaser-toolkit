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

export type FontSizeMap = Record<FontSizeKey | string, number>;

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

export type FontSizeApi<T extends FontSizeMap> = {
  px: (key: FontSizeKey | keyof T) => number;
  rem: (key: FontSizeKey | keyof T) => number;
  css: (key: FontSizeKey | keyof T) => string;
};

export const createFontSize = <
  T extends FontSizeMap = NonNullable<BaseThemeConfig['fontSizes']>,
>(
  themeFontSizes: T = {} as T
): FontSizeApi<T> => {
  const fontmap = {
    ...fontSizeMap,
    ...themeFontSizes,
  };

  return {
    px: (key: FontSizeKey | keyof T): number => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return value;
      }

      return 0;
    },
    rem: (key: FontSizeKey | keyof T): number => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return value / 16;
      }

      return 0;
    },
    css: (key: FontSizeKey | keyof T): string => {
      const value = fontmap[key as FontSizeKey];
      if (typeof value === 'number') {
        return `${value}px`;
      }

      return '0px';
    },
  };
};

/**
 * Utility functions for working with font sizes
 */
// Removed legacy global FontSize object in favor of the factory API
