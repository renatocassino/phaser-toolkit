export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export type FontSizeKey = keyof typeof fontSizes;

export class FontSizePicker {
  static px(key: FontSizeKey): number {
    return fontSizes[key];
  }

  static rem(key: FontSizeKey): number {
    return fontSizes[key] / 16;
  }

  static css(key: FontSizeKey): string {
    return `${fontSizes[key]}px`;
  }
}
