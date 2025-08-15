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
  hex: (color: ColorToken | string): number => {
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

  /**
   * Get RGB color value for stone color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  stone: (shade: ShadeKey) => Color.rgb(`stone-${shade}`),

  /**
   * Get RGB color value for red color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  red: (shade: ShadeKey) => Color.rgb(`red-${shade}`),

  /**
   * Get RGB color value for orange color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  orange: (shade: ShadeKey) => Color.rgb(`orange-${shade}`),

  /**
   * Get RGB color value for amber color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  amber: (shade: ShadeKey) => Color.rgb(`amber-${shade}`),

  /**
   * Get RGB color value for yellow color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  yellow: (shade: ShadeKey) => Color.rgb(`yellow-${shade}`),

  /**
   * Get RGB color value for lime color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  lime: (shade: ShadeKey) => Color.rgb(`lime-${shade}`),

  /**
   * Get RGB color value for green color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  green: (shade: ShadeKey) => Color.rgb(`green-${shade}`),

  /**
   * Get RGB color value for emerald color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  emerald: (shade: ShadeKey) => Color.rgb(`emerald-${shade}`),

  /**
   * Get RGB color value for teal color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  teal: (shade: ShadeKey) => Color.rgb(`teal-${shade}`),

  /**
   * Get RGB color value for cyan color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  cyan: (shade: ShadeKey) => Color.rgb(`cyan-${shade}`),

  /**
   * Get RGB color value for sky color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  sky: (shade: ShadeKey) => Color.rgb(`sky-${shade}`),

  /**
   * Get RGB color value for blue color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  blue: (shade: ShadeKey) => Color.rgb(`blue-${shade}`),

  /**
   * Get RGB color value for indigo color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  indigo: (shade: ShadeKey) => Color.rgb(`indigo-${shade}`),

  /**
   * Get RGB color value for violet color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  violet: (shade: ShadeKey) => Color.rgb(`violet-${shade}`),

  /**
   * Get RGB color value for purple color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  purple: (shade: ShadeKey) => Color.rgb(`purple-${shade}`),

  /**
   * Get RGB color value for fuchsia color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  fuchsia: (shade: ShadeKey) => Color.rgb(`fuchsia-${shade}`),

  /**
   * Get RGB color value for pink color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  pink: (shade: ShadeKey) => Color.rgb(`pink-${shade}`),

  /**
   * Get RGB color value for rose color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns RGB color value in format 'rgb(R, G, B)'
   */
  rose: (shade: ShadeKey) => Color.rgb(`rose-${shade}`),

  /**
   * Get hex number for stone color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  stoneHex: (shade: ShadeKey) => Color.hex(`stone-${shade}`),

  /**
   * Get hex number for red color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  redHex: (shade: ShadeKey) => Color.hex(`red-${shade}`),

  /**
   * Get hex number for orange color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  orangeHex: (shade: ShadeKey) => Color.hex(`orange-${shade}`),

  /**
   * Get hex number for amber color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  amberHex: (shade: ShadeKey) => Color.hex(`amber-${shade}`),

  /**
   * Get hex number for yellow color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  yellowHex: (shade: ShadeKey) => Color.hex(`yellow-${shade}`),

  /**
   * Get hex number for lime color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  limeHex: (shade: ShadeKey) => Color.hex(`lime-${shade}`),

  /**
   * Get hex number for green color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  greenHex: (shade: ShadeKey) => Color.hex(`green-${shade}`),

  /**
   * Get hex number for emerald color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  emeraldHex: (shade: ShadeKey) => Color.hex(`emerald-${shade}`),

  /**
   * Get hex number for teal color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  tealHex: (shade: ShadeKey) => Color.hex(`teal-${shade}`),

  /**
   * Get hex number for cyan color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  cyanHex: (shade: ShadeKey) => Color.hex(`cyan-${shade}`),

  /**
   * Get hex number for sky color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  skyHex: (shade: ShadeKey) => Color.hex(`sky-${shade}`),

  /**
   * Get hex number for blue color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  blueHex: (shade: ShadeKey) => Color.hex(`blue-${shade}`),

  /**
   * Get hex number for indigo color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  indigoHex: (shade: ShadeKey) => Color.hex(`indigo-${shade}`),

  /**
   * Get hex number for violet color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  violetHex: (shade: ShadeKey) => Color.hex(`violet-${shade}`),

  /**
   * Get hex number for purple color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  purpleHex: (shade: ShadeKey) => Color.hex(`purple-${shade}`),

  /**
   * Get hex number for fuchsia color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  fuchsiaHex: (shade: ShadeKey) => Color.hex(`fuchsia-${shade}`),

  /**
   * Get hex number for pink color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  pinkHex: (shade: ShadeKey) => Color.hex(`pink-${shade}`),

  /**
   * Get hex number for rose color with specified shade
   * @param shade - Shade key (e.g., '50', '100', '200', etc.)
   * @returns Hex number format 0xRRGGBB
   */
  roseHex: (shade: ShadeKey) => Color.hex(`rose-${shade}`),
} as const;
