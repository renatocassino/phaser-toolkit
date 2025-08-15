/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { createFontSize, fontSizeMap } from './font-size';

describe('FontSize', () => {
  describe('factory', () => {
    it('should return correct font size in pixels', () => {
      const fontSize = createFontSize();
      expect(fontSize.px('sm')).toBe(14);
      expect(fontSize.px('lg')).toBe(18);
      expect(fontSize.px('2xl')).toBe(24);
    });

    it('should return correct font size with extra theme param', () => {
      const fontSize = createFontSize({
        tooMuchLarge: 300,
      });
      expect(fontSize.px('sm')).toBe(14);
      expect(fontSize.px('lg')).toBe(18);
      expect(fontSize.px('2xl')).toBe(24);
      expect(fontSize.px('tooMuchLarge')).toBe(300);
    });
  });

  describe('px', () => {
    it('should return pixel value for font size key', () => {
      const fontSize = createFontSize();
      expect(fontSize.px('sm')).toBe(14);
      expect(fontSize.px('lg')).toBe(18);
      expect(fontSize.px('2xl')).toBe(24);
    });
  });

  describe('rem', () => {
    it('should convert pixel value to rem', () => {
      const fontSize = createFontSize();
      expect(fontSize.rem('sm')).toBe(14 / 16);
      expect(fontSize.rem('lg')).toBe(18 / 16);
      expect(fontSize.rem('2xl')).toBe(24 / 16);
    });

    it('should handle theme values', () => {
      const fontSize = createFontSize({
        sm: 16,
        lg: 24,
        '2xl': 32,
      });

      expect(fontSize.rem('sm')).toBe(1); // 16/16
      expect(fontSize.rem('lg')).toBe(1.5); // 24/16
      expect(fontSize.rem('2xl')).toBe(2); // 32/16
    });

    it('should return 0 for invalid keys', () => {
      const fontSize = createFontSize();
      // @ts-ignore
      expect(fontSize.rem('invalid')).toBe(0);
    });
  });

  describe('css', () => {
    it('should return CSS string with px unit', () => {
      const fontSize = createFontSize();
      expect(fontSize.css('sm')).toBe('14px');
      expect(fontSize.css('lg')).toBe('18px');
      expect(fontSize.css('2xl')).toBe('24px');
    });
  });

  describe('with theme', () => {
    it('should return value from theme', () => {
      const fontSize = createFontSize();
      expect(fontSize.px('sm')).toBe(fontSizeMap['sm']);
      expect(fontSize.px('lg')).toBe(fontSizeMap['lg']);
      expect(fontSize.px('2xl')).toBe(fontSizeMap['2xl']);

      const fontSize2 = createFontSize({
        sm: 16,
        lg: 24,
        '2xl': 32,
        custom: 42,
        '11': 100,
      });

      expect(fontSize2.px('sm')).toBe(16);
      expect(fontSize2.px('lg')).toBe(24);
      expect(fontSize2.px('2xl')).toBe(32);
      expect(fontSize2.px('custom')).toBe(42);
      expect(fontSize2.px('11')).toBe(100);
    });
  });
});
