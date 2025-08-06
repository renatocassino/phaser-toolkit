/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { ThemeManager } from '../theme';

import { Radius, radiusMap } from './radius';

describe('Radius', () => {
  describe('px', () => {
    it('should return pixel value for radius key', () => {
      expect(Radius.px('sm')).toBe(2);
      expect(Radius.px('lg')).toBe(8);
      expect(Radius.px('full')).toBe(9999);
    });
  });

  describe('rem', () => {
    it('should convert pixel value to rem', () => {
      expect(Radius.rem('sm')).toBe(2 / 16);
      expect(Radius.rem('lg')).toBe(8 / 16);
      expect(Radius.rem('full')).toBe(9999 / 16);
    });
  });

  describe('css', () => {
    it('should return CSS string with px unit', () => {
      expect(Radius.css('sm')).toBe('2px');
      expect(Radius.css('lg')).toBe('8px');
      expect(Radius.css('full')).toBe('9999px');
    });
  });

  describe('getValueByKey', () => {
    it('should return value from radiusMap', () => {
      expect(Radius.getValueByKey('sm')).toBe(radiusMap.sm);
      expect(Radius.getValueByKey('lg')).toBe(radiusMap.lg);
      expect(Radius.getValueByKey('full')).toBe(radiusMap.full);
    });
  });

  describe('with theme', () => {
    it('should return value from theme', () => {
      expect(Radius.getValueByKey('sm')).toBe(radiusMap.sm);
      expect(Radius.getValueByKey('custom')).toBe(0);
      expect(Radius.getValueByKey('11')).toBe(0);

      ThemeManager.setThemeObject({
        radius: {
          sm: 10,
          custom: 42,
          '11': 100,
        },
      });

      expect(Radius.getValueByKey('sm')).toBe(10);
      expect(Radius.getValueByKey('custom')).toBe(42);
      expect(Radius.getValueByKey('11')).toBe(100);
    });
  });
});
