/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ThemeManager, defaultLightTheme } from '../theme';

import { createRadius, radiusMap, Radius } from './radius';

describe('Radius', () => {
  afterAll(() => {
    ThemeManager.clear();
  });

  beforeEach(() => {
    ThemeManager.init(defaultLightTheme);
  });

  describe('px', () => {
    it('should return pixel value for radius key', () => {
      const radius = createRadius();
      expect(radius.px('sm')).toBe(2);
      expect(radius.px('lg')).toBe(8);
      expect(radius.px('full')).toBe(9999);
    });
  });

  describe('rem', () => {
    it('should convert pixel value to rem', () => {
      const radius = createRadius();
      expect(radius.rem('sm')).toBe(2 / 16);
      expect(radius.rem('lg')).toBe(8 / 16);
      expect(radius.rem('full')).toBe(9999 / 16);
    });
  });

  describe('css', () => {
    it('should return CSS string with px unit', () => {
      const radius = createRadius();
      expect(radius.css('sm')).toBe('2px');
      expect(radius.css('lg')).toBe('8px');
      expect(radius.css('full')).toBe('9999px');
    });

    it('should work with default Radius constant', () => {
      expect(Radius.px('sm')).toBe(2);
      expect(Radius.css('lg')).toBe('8px');
      expect(Radius.rem('full')).toBe(9999 / 16);
    });
  });

  describe('getValueByKey', () => {
    it('should return value from radiusMap', () => {
      const radius = createRadius();
      expect(radius.px('sm')).toBe(radiusMap['sm']);
      expect(radius.px('lg')).toBe(radiusMap['lg']);
      expect(radius.px('full')).toBe(radiusMap['full']);
    });
  });

  describe('with theme', () => {
    it('should return value from theme', () => {
      const radius1 = createRadius();
      expect(radius1.px('sm')).toBe(radiusMap['sm']);

      ThemeManager.setThemeObject({
        radius: {
          sm: 10,
          custom: 42,
          '11': 100,
        },
      });

      const theme = ThemeManager.getCurrentTheme();
      const radius2 = createRadius(theme.radius);
      expect(radius2.px('sm')).toBe(10);
      // Theme custom keys are allowed once factory is created with theme type
      type ThemeRadiusKeys = keyof NonNullable<typeof theme.radius>;
      expect(radius2.px('custom' as ThemeRadiusKeys)).toBe(42);
      expect(radius2.px('11' as ThemeRadiusKeys)).toBe(100);
    });
  });
});
