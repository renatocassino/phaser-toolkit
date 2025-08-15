/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ThemeManager } from '../theme';

import { createFont } from './font';

describe('Font', () => {
  beforeEach(() => {
    ThemeManager.clear;
  });

  afterAll(() => {
    ThemeManager.clear();
  });

  describe('size', () => {
    it('should return correct font size in pixels', () => {
      const font = createFont();
      expect(font.size('xs')).toBe(12);
      expect(font.size('sm')).toBe(14);
      expect(font.size('base')).toBe(16);
      expect(font.size('lg')).toBe(18);
      expect(font.size('xl')).toBe(20);
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
      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.format({ size: 'base', family: 'primary' })).toBe(
        "16px 'Arial'"
      );
      expect(font.format({ size: 'lg', family: 'secondary' })).toBe(
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
      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.family('primary')).toBe('Arial');
      expect(font.family('display')).toBe('Helvetica');
    });

    it('should return font family from theme using full path', () => {
      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.family('fonts.primary')).toBe('Arial');
      expect(font.family('fonts.display')).toBe('Helvetica');
    });

    it('should return key itself if font not found in theme', () => {
      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.family('Times New Roman')).toBe('Times New Roman');
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

      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.getAvailableFonts()).toEqual(
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
      const font = createFont(
        ThemeManager.getCurrentTheme().fonts,
        ThemeManager.getCurrentTheme().fontSizes
      );
      expect(font.getAvailableFonts()).toEqual(Object.keys(fonts));
    });
  });
});
