/* eslint-disable no-magic-numbers */
import type { BaseThemeConfig } from '../theme';

import {
  createFontSize,
  type FontSizeApi,
  type FontSizeKey,
  type FontSizeMap,
} from './font-size';

export const fontMap = {
  primary: 'Inter, system-ui, sans-serif',
  secondary: 'Roboto, Arial, sans-serif',
  monospace: 'Fira Code, Consolas, monospace',
  display: 'Poppins, Inter, sans-serif',
} as const;

export type FontKey = keyof typeof fontMap;
export type FontMap = Record<FontKey | string, string>;

export type FontApi<
  TFonts extends FontMap | undefined,
  TFontSizes extends FontSizeMap | undefined,
> = {
  size: (
    key:
      | FontSizeKey
      | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never)
  ) => number;
  format: (args: {
    size:
      | FontSizeKey
      | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never);
    family: FontKey | (TFonts extends FontMap ? keyof TFonts : never);
  }) => string;
  family: (
    key: FontKey | (TFonts extends FontMap ? keyof TFonts : never)
  ) => string;
  getAvailableFonts: () => string[];
};

export const createFont = <
  TFonts extends FontMap | undefined = BaseThemeConfig['fonts'],
  TFontSizes extends FontSizeMap | undefined = BaseThemeConfig['fontSizes'],
>(
  fonts?: TFonts,
  fontSizes?: TFontSizes
): FontApi<TFonts, TFontSizes> => {
  const map: FontMap = {
    ...fontMap,
    ...(fonts as FontMap | undefined),
  } as FontMap;

  const fontSizeApi: FontSizeApi<TFontSizes> = createFontSize<TFontSizes>(
    fontSizes as TFontSizes
  );

  const getFamily = (key: string): string => {
    if (key.includes('.')) {
      const [, short] = key.split('.');
      if (short && typeof map[short] === 'string') {
        return map[short] as string;
      }
    }
    return typeof map[key] === 'string' ? (map[key] as string) : key;
  };

  return {
    size: (
      key:
        | FontSizeKey
        | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never)
    ): number => {
      return fontSizeApi.px(key) ?? 0;
    },
    format: ({ size, family }): string => {
      const sizePx = fontSizeApi.px(size) ?? 0;
      return `${sizePx}px '${getFamily(family as string)}'`;
    },
    family: (
      key: FontKey | (TFonts extends FontMap ? keyof TFonts : never)
    ): string => getFamily(key as string),
    getAvailableFonts: (): string[] => {
      return Array.from(
        new Set([...(Object.keys(fontMap) as string[]), ...Object.keys(map)])
      );
    },
  };
};
