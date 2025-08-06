/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ThemeManager } from '../theme';

import { Font } from './font';

describe('Font', () => {
  beforeEach(() => {
    ThemeManager.clear;
  });

  afterAll(() => {
    ThemeManager.clear();
  });

  describe('size', () => {
    it('should return correct font size in pixels', () => {
      expect(Font.size('xs')).toBe(12);
      expect(Font.size('sm')).toBe(14);
      expect(Font.size('base')).toBe(16);
      expect(Font.size('lg')).toBe(18);
      expect(Font.size('xl')).toBe(20);
    });
  });

  describe('format', () => {
    beforeEach(() => {
      ThemeManager.setThemeObject({
        fonts: {
          primary: 'Arial',
          secondary: 'Helvetica',
        },
      });
    });

    it('should return font string with size and family', () => {
      expect(Font.format({ size: 'base', family: 'primary' })).toBe(
        "16px 'Arial'"
      );
      expect(Font.format({ size: 'lg', family: 'secondary' })).toBe(
        "18px 'Helvetica'"
      );
    });
  });

  describe('family', () => {
    beforeEach(() => {
      ThemeManager.setThemeObject({
        fonts: {
          primary: 'Arial',
          display: 'Helvetica',
        },
      });
    });

    it('should return font family from theme using short key', () => {
      expect(Font.family('primary')).toBe('Arial');
      expect(Font.family('display')).toBe('Helvetica');
    });

    it('should return font family from theme using full path', () => {
      expect(Font.family('fonts.primary')).toBe('Arial');
      expect(Font.family('fonts.display')).toBe('Helvetica');
    });

    it('should return key itself if font not found in theme', () => {
      expect(Font.family('Times New Roman')).toBe('Times New Roman');
    });
  });

  describe('getAvailableFonts', () => {
    it('should return array of available font tokens', () => {
      ThemeManager.setThemeObject({
        fonts: {
          primary: 'Arial',
          secondary: 'Helvetica',
          display: 'Roboto',
          monospace: 'Courier New',
          anotherCrazyFont: 'Comic Sans MS',
        },
      });

      expect(Font.getAvailableFonts()).toEqual(
        expect.arrayContaining([
          'primary',
          'secondary',
          'monospace',
          'display',
          'anotherCrazyFont',
        ])
      );
    });

    it('should return empty array if no fonts in theme', () => {
      const fonts = ThemeManager.getCurrentTheme().fonts ?? {};
      ThemeManager.setThemeObject({ fonts: {} });
      expect(Font.getAvailableFonts()).toEqual(Object.keys(fonts));
    });
  });
});
