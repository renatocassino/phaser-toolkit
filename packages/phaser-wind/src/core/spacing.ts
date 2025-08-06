/**
 * Valid spacing scale keys following Tailwind's spacing scale
 * Values range from '0' to '96', including fractional values
 */
export type SpacingKey =
  | '0'
  | 'px'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96';

/**
 * Maps spacing scale keys to their pixel values
 */
export type SpacingMap = Record<SpacingKey, number>;

/**
 * Spacing scale mapping following Tailwind's spacing scale
 * Values are in pixels, with a base unit of 4px (1 = 4px)
 */
export const spacingMap: SpacingMap = {
  '0': 0,
  px: 1,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
  '36': 144,
  '40': 160,
  '44': 176,
  '48': 192,
  '52': 208,
  '56': 224,
  '60': 240,
  '64': 256,
  '72': 288,
  '80': 320,
  '96': 384,
};

/**
 * Utility functions for working with spacing values
 */
export const Spacing = {
  /**
   * Get spacing value in pixels
   * @param key - Spacing scale key
   * @returns Pixel value
   */
  px: (key: SpacingKey): number => spacingMap[key],

  /**
   * Get spacing value in rem units (divided by 16)
   * @param key - Spacing scale key
   * @returns Rem value
   */
  rem: (key: SpacingKey): number => spacingMap[key] / 16,

  /**
   * Get spacing value as CSS pixel string
   * @param key - Spacing scale key
   * @returns CSS pixel value string (e.g. "16px")
   */
  css: (key: SpacingKey): string => `${spacingMap[key]}px`,
};
