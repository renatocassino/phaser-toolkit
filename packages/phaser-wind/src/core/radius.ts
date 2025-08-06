import { ThemeManager } from '../theme';

/**
 * Available border radius keys matching Tailwind CSS radius scale
 */
export type RadiusKey =
  | 'none'
  | 'sm'
  | 'default'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

export type RadiusMap = Record<RadiusKey, number>;

/**
 * Mapping of radius keys to their pixel values
 */
export const radiusMap: RadiusMap = {
  none: 0,
  sm: 2,
  default: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

/**
 * Utility functions for working with border radius values
 */
export const Radius = {
  getValueByKey: (key: RadiusKey | string): number => {
    const value = ThemeManager.getToken(`radius.${key}`);
    if (typeof value === 'number') {
      return value;
    }

    return radiusMap[key as RadiusKey] ?? 0;
  },
  /**
   * Get border radius in pixels
   * @param key - Radius key (e.g., 'sm', 'lg', 'full')
   * @returns Border radius value in pixels
   */
  px: (key: RadiusKey): number => radiusMap[key],

  /**
   * Get border radius in rem units (relative to 16px base)
   * @param key - Radius key (e.g., 'sm', 'lg', 'full')
   * @returns Border radius value in rem units
   */
  rem: (key: RadiusKey): number => radiusMap[key] / 16,

  /**
   * Get border radius as CSS pixel string
   * @param key - Radius key (e.g., 'sm', 'lg', 'full')
   * @returns Border radius value as CSS string (e.g., '4px')
   */
  css: (key: RadiusKey): string => `${radiusMap[key]}px`,
};
