/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */

import { describe, expect, it } from 'vitest';

import { createFont, fontMap } from './font';

describe('Font', () => {
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
    it('should return font string with size and family', () => {
      const font = createFont();
      expect(font.format({ size: 'base', family: 'primary' })).toBe(
        "16px 'Inter, system-ui, sans-serif'"
      );
      expect(font.format({ size: 'lg', family: 'secondary' })).toBe(
        "18px 'Roboto, Arial, sans-serif'"
      );
    });
  });

  describe('family', () => {
    it('should return font family from theme using short key', () => {
      const font = createFont(
        {
          primary: 'Arial',
          display: 'Helvetica',
        },
        {
          base: 16,
        }
      );
      expect(font.family('primary')).toBe('Arial');
      expect(font.family('display')).toBe('Helvetica');
    });

    it('should return font family from theme using full path', () => {
      const font = createFont(
        {
          primary: 'Arial',
          display: 'Helvetica',
        },
        {
          base: 16,
        }
      );
      expect(font.family('primary')).toBe('Arial');
      expect(font.family('display')).toBe('Helvetica');
    });

    it('should return key itself if font not found in theme', () => {
      const font = createFont(
        {
          primary: 'Arial',
          display: 'Helvetica',
        },
        {
          base: 16,
        }
      );
      expect(font.family('primary')).toBe('Arial');
    });
  });

  describe('getAvailableFonts', () => {
    it('should return array of available font tokens', () => {
      const font = createFont(
        {
          primary: 'Arial',
          secondary: 'Helvetica',
          monospace: 'Courier New',
          display: 'Roboto',
          anotherCrazyFont: 'Comic Sans MS',
        },
        {
          base: 16,
        }
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
      const font = createFont();
      expect(font.getAvailableFonts()).toEqual(Object.keys(fontMap));
    });
  });
});
