/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-lines-per-function */
import { BaseThemeConfig } from '../theme';
import { isValidColor } from '../utils';

import { palette } from './palette';

/** Regular expression to match RGB color format */
const RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

/**
 * Available color families from the built-in palette.
 * Matches Tailwind CSS color families.
 */
export type ColorKey = keyof typeof palette;

/**
 * Available shade values for the color palette.
 * Accepts string or numeric literal shades for convenience.
 */
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
  | '950'
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/**
 * Color token combining a color family and a shade.
 * Also accepts special tokens `black` and `white`.
 *
 * @example
 * Color.rgb('blue-500') // => 'rgb(59, 130, 246)'
 * Color.hex('black') // => 0x000000
 */
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
 * @throws {Error} If RGB format is invalid
 */
const convertRgbToNumber = (rgbValue: string): number => {
  const matches = rgbValue.match(RGB_REGEX);
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
 * Color utility API interface
 * Provides methods to work with colors in different formats
 */
/**
 * API for resolving colors to RGB strings or Hex numbers.
 * When parameterized with a theme type `T`, accepts either palette tokens or `keyof T`.
 *
 * @typeParam T - Theme colors map (e.g. `{ primary: 'blue-500' }`)
 * @example
 * const c = createColor();
 * c.rgb('red-500');
 * c.hex('white');
 */
export type Color<T = BaseThemeConfig['colors']> = {
  /** Get RGB string representation of a color */
  rgb(color: ColorToken | keyof T): string;
  /** Get hex number representation of a color */
  hex(color: ColorToken | keyof T): number;

  /** Get RGB string for slate color with specified shade */
  slate(shade: ShadeKey): string;
  /** Get RGB string for gray color with specified shade */
  gray(shade: ShadeKey): string;
  /** Get RGB string for zinc color with specified shade */
  zinc(shade: ShadeKey): string;
  /** Get RGB string for neutral color with specified shade */
  neutral(shade: ShadeKey): string;
  /** Get RGB string for stone color with specified shade */
  stone(shade: ShadeKey): string;
  /** Get RGB string for red color with specified shade */
  red(shade: ShadeKey): string;
  /** Get RGB string for orange color with specified shade */
  orange(shade: ShadeKey): string;
  /** Get RGB string for amber color with specified shade */
  amber(shade: ShadeKey): string;
  /** Get RGB string for yellow color with specified shade */
  yellow(shade: ShadeKey): string;
  /** Get RGB string for lime color with specified shade */
  lime(shade: ShadeKey): string;
  /** Get RGB string for green color with specified shade */
  green(shade: ShadeKey): string;
  /** Get RGB string for emerald color with specified shade */
  emerald(shade: ShadeKey): string;
  /** Get RGB string for teal color with specified shade */
  teal(shade: ShadeKey): string;
  /** Get RGB string for cyan color with specified shade */
  cyan(shade: ShadeKey): string;
  /** Get RGB string for sky color with specified shade */
  sky(shade: ShadeKey): string;
  /** Get RGB string for blue color with specified shade */
  blue(shade: ShadeKey): string;
  /** Get RGB string for indigo color with specified shade */
  indigo(shade: ShadeKey): string;
  /** Get RGB string for violet color with specified shade */
  violet(shade: ShadeKey): string;
  /** Get RGB string for purple color with specified shade */
  purple(shade: ShadeKey): string;
  /** Get RGB string for fuchsia color with specified shade */
  fuchsia(shade: ShadeKey): string;
  /** Get RGB string for pink color with specified shade */
  pink(shade: ShadeKey): string;
  /** Get RGB string for rose color with specified shade */
  rose(shade: ShadeKey): string;

  /** Get hex number for slate color with specified shade */
  slateHex(shade: ShadeKey): number;
  /** Get hex number for gray color with specified shade */
  grayHex(shade: ShadeKey): number;
  /** Get hex number for zinc color with specified shade */
  zincHex(shade: ShadeKey): number;
  /** Get hex number for neutral color with specified shade */
  neutralHex(shade: ShadeKey): number;
  /** Get hex number for stone color with specified shade */
  stoneHex(shade: ShadeKey): number;
  /** Get hex number for red color with specified shade */
  redHex(shade: ShadeKey): number;
  /** Get hex number for orange color with specified shade */
  orangeHex(shade: ShadeKey): number;
  /** Get hex number for amber color with specified shade */
  amberHex(shade: ShadeKey): number;
  /** Get hex number for yellow color with specified shade */
  yellowHex(shade: ShadeKey): number;
  /** Get hex number for lime color with specified shade */
  limeHex(shade: ShadeKey): number;
  /** Get hex number for green color with specified shade */
  greenHex(shade: ShadeKey): number;
  /** Get hex number for emerald color with specified shade */
  emeraldHex(shade: ShadeKey): number;
  /** Get hex number for teal color with specified shade */
  tealHex(shade: ShadeKey): number;
  /** Get hex number for cyan color with specified shade */
  cyanHex(shade: ShadeKey): number;
  /** Get hex number for sky color with specified shade */
  skyHex(shade: ShadeKey): number;
  /** Get hex number for blue color with specified shade */
  blueHex(shade: ShadeKey): number;
  /** Get hex number for indigo color with specified shade */
  indigoHex(shade: ShadeKey): number;
  /** Get hex number for violet color with specified shade */
  violetHex(shade: ShadeKey): number;
  /** Get hex number for purple color with specified shade */
  purpleHex(shade: ShadeKey): number;
  /** Get hex number for fuchsia color with specified shade */
  fuchsiaHex(shade: ShadeKey): number;
  /** Get hex number for pink color with specified shade */
  pinkHex(shade: ShadeKey): number;
  /** Get hex number for rose color with specified shade */
  roseHex(shade: ShadeKey): number;
};

/**
 * Factory that creates a color utility API based on the provided theme colors
 * @param themeColors - Theme colors configuration
 * @returns Color utility API instance
 */
/**
 * Create a color API bound to an optional theme colors map.
 * If a key exists in `themeColors`, it will be resolved to a palette token and then to RGB/Hex.
 *
 * @typeParam T - Theme colors map
 * @param themeColors - Optional map of theme color tokens
 * @example
 * const c = createColor({ primary: 'blue-500' });
 * c.rgb('primary'); // rgb(59, 130, 246)
 */
export const createColor = <T = BaseThemeConfig['colors']>(
  themeColors: T
): Color<T> => {
  /**
   * Get color value from theme configuration
   * @param key - Color token or theme color key
   * @returns Color value from theme or null if not found
   */
  const getValueFromTheme = (key: ColorToken | keyof T): T[keyof T] | null => {
    if (themeColors && key in (themeColors as Object)) {
      return themeColors[key as keyof T];
    }
    return null;
  };

  /**
   * Get RGB string representation of a color
   * @param color - Color token, theme color key or valid color string
   * @returns RGB color string
   * @throws {Error} If color token is not found
   */
  const rgb = (color: ColorToken | keyof T): string => {
    // Runtime supports direct CSS strings for flexibility, but
    // the public type restricts to palette tokens or theme keys.
    if (typeof color === 'string' && isValidColor(color)) {
      return color;
    }

    const colorFromTheme = getValueFromTheme(color as ColorToken | keyof T);
    if (colorFromTheme) {
      return rgb(colorFromTheme as ColorToken);
    }

    const parts = (color as string).split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorValue = palette[colorKey]?.[shade];
      if (!colorValue) {
        if (isValidColor(color as string)) {
          return color as string;
        }
        throw new Error(`Color token "${colorKey}-${shade}" not found`);
      }
      return colorValue;
    }

    const colorValue = palette[color as 'black' | 'white'];
    if (!colorValue) {
      if (isValidColor(color as string)) {
        return color as string;
      }
      throw new Error(`Color token "${color as string}" not found`);
    }
    return colorValue;
  };

  /**
   * Get hex number representation of a color
   * @param color - Color token, theme color key or valid color string
   * @returns Hex color number
   * @throws {Error} If color token is not found
   */
  const hex = (color: ColorToken | keyof T): number => {
    // See note in rgb()
    if (typeof color === 'string' && isValidColor(color)) {
      return convertColorValueToNumber(color);
    }

    const colorFromTheme = getValueFromTheme(color as ColorToken | keyof T);
    if (colorFromTheme) {
      return hex(colorFromTheme as ColorToken);
    }

    const parts = (color as string).split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorValue = palette[colorKey]?.[shade];
      if (!colorValue) {
        if (isValidColor(color as string)) {
          return convertColorValueToNumber(color as string);
        }
        throw new Error(`Color token "${colorKey}-${shade}" not found`);
      }
      return convertColorValueToNumber(colorValue);
    }

    const colorToConvert = palette[color as 'black' | 'white'] as string;
    if (isValidColor(colorToConvert)) {
      return convertColorValueToNumber(colorToConvert);
    }
    throw new Error(`Color token "${color as string}" not found`);
  };

  const api: Color<T> = {
    rgb,
    hex,

    slate: (shade: ShadeKey) => rgb(`slate-${shade}`),
    gray: (shade: ShadeKey) => rgb(`gray-${shade}`),
    zinc: (shade: ShadeKey) => rgb(`zinc-${shade}`),
    neutral: (shade: ShadeKey) => rgb(`neutral-${shade}`),
    stone: (shade: ShadeKey) => rgb(`stone-${shade}`),
    red: (shade: ShadeKey) => rgb(`red-${shade}`),
    orange: (shade: ShadeKey) => rgb(`orange-${shade}`),
    amber: (shade: ShadeKey) => rgb(`amber-${shade}`),
    yellow: (shade: ShadeKey) => rgb(`yellow-${shade}`),
    lime: (shade: ShadeKey) => rgb(`lime-${shade}`),
    green: (shade: ShadeKey) => rgb(`green-${shade}`),
    emerald: (shade: ShadeKey) => rgb(`emerald-${shade}`),
    teal: (shade: ShadeKey) => rgb(`teal-${shade}`),
    cyan: (shade: ShadeKey) => rgb(`cyan-${shade}`),
    sky: (shade: ShadeKey) => rgb(`sky-${shade}`),
    blue: (shade: ShadeKey) => rgb(`blue-${shade}`),
    indigo: (shade: ShadeKey) => rgb(`indigo-${shade}`),
    violet: (shade: ShadeKey) => rgb(`violet-${shade}`),
    purple: (shade: ShadeKey) => rgb(`purple-${shade}`),
    fuchsia: (shade: ShadeKey) => rgb(`fuchsia-${shade}`),
    pink: (shade: ShadeKey) => rgb(`pink-${shade}`),
    rose: (shade: ShadeKey) => rgb(`rose-${shade}`),

    slateHex: (shade: ShadeKey) => hex(`slate-${shade}`),
    grayHex: (shade: ShadeKey) => hex(`gray-${shade}`),
    zincHex: (shade: ShadeKey) => hex(`zinc-${shade}`),
    neutralHex: (shade: ShadeKey) => hex(`neutral-${shade}`),
    stoneHex: (shade: ShadeKey) => hex(`stone-${shade}`),
    redHex: (shade: ShadeKey) => hex(`red-${shade}`),
    orangeHex: (shade: ShadeKey) => hex(`orange-${shade}`),
    amberHex: (shade: ShadeKey) => hex(`amber-${shade}`),
    yellowHex: (shade: ShadeKey) => hex(`yellow-${shade}`),
    limeHex: (shade: ShadeKey) => hex(`lime-${shade}`),
    greenHex: (shade: ShadeKey) => hex(`green-${shade}`),
    emeraldHex: (shade: ShadeKey) => hex(`emerald-${shade}`),
    tealHex: (shade: ShadeKey) => hex(`teal-${shade}`),
    cyanHex: (shade: ShadeKey) => hex(`cyan-${shade}`),
    skyHex: (shade: ShadeKey) => hex(`sky-${shade}`),
    blueHex: (shade: ShadeKey) => hex(`blue-${shade}`),
    indigoHex: (shade: ShadeKey) => hex(`indigo-${shade}`),
    violetHex: (shade: ShadeKey) => hex(`violet-${shade}`),
    purpleHex: (shade: ShadeKey) => hex(`purple-${shade}`),
    fuchsiaHex: (shade: ShadeKey) => hex(`fuchsia-${shade}`),
    pinkHex: (shade: ShadeKey) => hex(`pink-${shade}`),
    roseHex: (shade: ShadeKey) => hex(`rose-${shade}`),
  };

  return api;
};

/**
 * Convenience instance using only the default palette tokens (no theme).
 *
 * @example
 * Color.rgb('emerald-400')
 * Color.hex('black')
 */
// eslint-disable-next-line no-redeclare
export const Color: Color<Record<string, never>> = createColor<
  Record<string, never>
>({} as Record<string, never>);
