/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-lines-per-function */
import { BaseThemeConfig } from '../theme';
import { isValidColor } from '../utils';

import { palette } from './palette';

const RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

export type ColorKey = keyof typeof palette;
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

export type Color<T = BaseThemeConfig['colors']> = {
  rgb(color: ColorToken | keyof T | string): string;
  hex(color: ColorToken | keyof T | string): number;

  slate(shade: ShadeKey): string;
  gray(shade: ShadeKey): string;
  zinc(shade: ShadeKey): string;
  neutral(shade: ShadeKey): string;
  stone(shade: ShadeKey): string;
  red(shade: ShadeKey): string;
  orange(shade: ShadeKey): string;
  amber(shade: ShadeKey): string;
  yellow(shade: ShadeKey): string;
  lime(shade: ShadeKey): string;
  green(shade: ShadeKey): string;
  emerald(shade: ShadeKey): string;
  teal(shade: ShadeKey): string;
  cyan(shade: ShadeKey): string;
  sky(shade: ShadeKey): string;
  blue(shade: ShadeKey): string;
  indigo(shade: ShadeKey): string;
  violet(shade: ShadeKey): string;
  purple(shade: ShadeKey): string;
  fuchsia(shade: ShadeKey): string;
  pink(shade: ShadeKey): string;
  rose(shade: ShadeKey): string;

  slateHex(shade: ShadeKey): number;
  grayHex(shade: ShadeKey): number;
  zincHex(shade: ShadeKey): number;
  neutralHex(shade: ShadeKey): number;
  stoneHex(shade: ShadeKey): number;
  redHex(shade: ShadeKey): number;
  orangeHex(shade: ShadeKey): number;
  amberHex(shade: ShadeKey): number;
  yellowHex(shade: ShadeKey): number;
  limeHex(shade: ShadeKey): number;
  greenHex(shade: ShadeKey): number;
  emeraldHex(shade: ShadeKey): number;
  tealHex(shade: ShadeKey): number;
  cyanHex(shade: ShadeKey): number;
  skyHex(shade: ShadeKey): number;
  blueHex(shade: ShadeKey): number;
  indigoHex(shade: ShadeKey): number;
  violetHex(shade: ShadeKey): number;
  purpleHex(shade: ShadeKey): number;
  fuchsiaHex(shade: ShadeKey): number;
  pinkHex(shade: ShadeKey): number;
  roseHex(shade: ShadeKey): number;
};

/**
 * Factory that creates a color utility API based on the provided theme colors
 */
export const createColor = <T = BaseThemeConfig['colors']>(
  themeColors: T
): Color<T> => {
  const getValueFromTheme = (key: ColorToken | keyof T): T[keyof T] | null => {
    if (themeColors && key in (themeColors as Object)) {
      return themeColors[key as keyof T];
    }
    return null;
  };

  const rgb = (color: ColorToken | keyof T | string): string => {
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

  const hex = (color: ColorToken | keyof T | string): number => {
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
