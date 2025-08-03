/* eslint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { FontSizePicker, type FontSizeKey } from './font-size-picker';

describe('FontSizePicker', () => {
  it.each([
    ['xs', 12],
    ['sm', 14],
    ['md', 16],
    ['lg', 18],
    ['xl', 20],
    ['2xl', 24],
    ['3xl', 30],
    ['4xl', 36],
    ['5xl', 48],
    ['6xl', 60],
  ])('should return correct pixel value for %s size', (size, expected) => {
    expect(FontSizePicker.px(size as FontSizeKey)).toBe(expected);
  });

  it.each([
    ['xs', 0.75],
    ['sm', 0.875],
    ['md', 1],
    ['lg', 1.125],
    ['xl', 1.25],
    ['2xl', 1.5],
    ['3xl', 1.875],
    ['4xl', 2.25],
    ['5xl', 3],
    ['6xl', 3.75],
  ])('should return correct rem value for %s size', (size, expected) => {
    expect(FontSizePicker.rem(size as FontSizeKey)).toBe(expected);
  });

  it.each([
    ['xs', '12px'],
    ['sm', '14px'],
    ['md', '16px'],
    ['lg', '18px'],
    ['xl', '20px'],
    ['2xl', '24px'],
    ['3xl', '30px'],
    ['4xl', '36px'],
    ['5xl', '48px'],
    ['6xl', '60px'],
  ])('should return correct CSS string for %s size', (size, expected) => {
    expect(FontSizePicker.css(size as FontSizeKey)).toBe(expected);
  });
});
