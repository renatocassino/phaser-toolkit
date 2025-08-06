/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ThemeManager } from '../theme/theme-manager';
import { isValidColor } from '../utils';

import { pallete } from './pallete';

export type ColorKey = keyof typeof pallete;
export type ShadeKey =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

export type ColorToken = `${ColorKey}-${ShadeKey}` | 'black' | 'white';

/**
 * Convert hex color value to number
 * @param hexValue - Hex color value (e.g., '#ff0000')
 * @returns Number representation of hex color
 */
const convertHexToNumber = (hexValue: string): number => {
  const hex = hexValue.slice(1);
  if (hex.length === 3) {
    const r = parseInt(hex[0]! + hex[0]!, 16);
    const g = parseInt(hex[1]! + hex[1]!, 16);
    const b = parseInt(hex[2]! + hex[2]!, 16);
    return (r << 16) + (g << 8) + b;
  }
  return parseInt(hex, 16);
};

/**
 * Convert RGB color value to number
 * @param rgbValue - RGB color value (e.g., 'rgb(255, 0, 0)')
 * @returns Number representation of RGB color
 */
const convertRgbToNumber = (rgbValue: string): number => {
  const matches = rgbValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!matches) {
    throw new Error(`Invalid RGB format: ${rgbValue}`);
  }

  const r = parseInt(matches[1]!);
  const g = parseInt(matches[2]!);
  const b = parseInt(matches[3]!);

  return (r << 16) + (g << 8) + b;
};

/**
 * Convert color value to number
 * @param colorValue - Color value (e.g., '#ff0000' or 'rgb(255, 0, 0)')
 * @returns Number representation of color
 */
const convertColorValueToNumber = (colorValue: string): number => {
  if (colorValue.startsWith('#')) {
    return convertHexToNumber(colorValue);
  }
  return convertRgbToNumber(colorValue);
};

/**
 * Color utility functions
 */
export const Color = {
  getValueFromTheme: (key: ColorToken | string): string | null => {
    const value = ThemeManager.getToken(`colors.${key}`);
    if (value === undefined) {
      return null;
    }

    return value as string;
  },
  /**
   * Get RGB string for a color token or theme token
   * @param color - Color token (e.g., 'blue-500') or theme token (e.g., 'primary', 'colors.primary')
   * @returns RGB string format 'rgb(r, g, b)'
   */
  rgb: (color: ColorToken | string): string => {
    const colorFromTheme = Color.getValueFromTheme(color);
    if (colorFromTheme) {
      return Color.rgb(colorFromTheme);
    }

    // If the color is not a theme token, it must be a color token
    const parts = color.split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorValue = pallete[colorKey]?.[shade];
      if (!colorValue) {
        if (isValidColor(color)) {
          return color;
        }

        throw new Error(`Color token "${colorKey}-${shade}" not found`);
      }
      return colorValue;
    }

    const colorValue = pallete[color as 'black' | 'white'];
    if (!colorValue) {
      if (isValidColor(color)) {
        return color;
      }

      throw new Error(`Color token "${color}" not found`);
    }
    return colorValue;
  },

  /**
   * Get hex number for a color token or theme token
   * @param color - Color token (e.g., 'blue-500') or theme token (e.g., 'primary', 'colors.primary')
   * @returns Hex number format 0xRRGGBB
   */
  hex: (color: ColorToken): number => {
    const colorFromTheme = Color.getValueFromTheme(color);
    if (colorFromTheme) {
      return Color.hex(colorFromTheme as ColorToken);
    }

    // If the color is not a theme token, it must be a color token
    const parts = color.split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorValue = pallete[colorKey]?.[shade];
      if (!colorValue) {
        if (isValidColor(color)) {
          return convertColorValueToNumber(color);
        }

        throw new Error(`Color token "${colorKey}-${shade}" not found`);
      }
      return convertColorValueToNumber(colorValue);
    }

    const colorToConvert = pallete[color as 'black' | 'white'] as string;
    if (isValidColor(colorToConvert)) {
      return convertColorValueToNumber(colorToConvert);
    }

    throw new Error(`Color token "${color}" not found`);
  },

  /**
   * Get RGB color value for slate color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  slate: (shade: ShadeKey) => Color.rgb(`slate-${shade}`),

  /**
   * Get RGB color value for gray color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  gray: (shade: ShadeKey) => Color.rgb(`gray-${shade}`),

  /**
   * Get RGB color value for zinc color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  zinc: (shade: ShadeKey) => Color.rgb(`zinc-${shade}`),

  /**
   * Get RGB color value for neutral color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  neutral: (shade: ShadeKey) => Color.rgb(`neutral-${shade}`),

  /**
   * Get hex number for slate color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  slateHex: (shade: ShadeKey) => Color.hex(`slate-${shade}`),

  /**
   * Get hex number for gray color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  grayHex: (shade: ShadeKey) => Color.hex(`gray-${shade}`),

  /**
   * Get hex number for zinc color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  zincHex: (shade: ShadeKey) => Color.hex(`zinc-${shade}`),

  /**
   * Get hex number for neutral color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  neutralHex: (shade: ShadeKey) => Color.hex(`neutral-${shade}`),
} as const;
