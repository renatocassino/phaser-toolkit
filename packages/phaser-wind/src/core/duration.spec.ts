/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { createDuration, Duration } from './duration';

describe('Duration', () => {
  describe('ms', () => {
    it('should return milliseconds for tailwind-style tokens', () => {
      const d = createDuration();
      expect(d.ms('75')).toBe(75);
      expect(d.ms('150')).toBe(150);
      expect(d.ms('300')).toBe(300);
      expect(d.ms('1000')).toBe(1000);
    });

    it('should return 0 for the "0" token', () => {
      const d = createDuration();
      expect(d.ms('0')).toBe(0);
    });
  });

  describe('seconds', () => {
    it('should convert to seconds', () => {
      const d = createDuration();
      expect(d.seconds('1000')).toBe(1);
      expect(d.seconds('500')).toBe(0.5);
      expect(d.seconds('75')).toBe(0.075);
    });
  });

  describe('css', () => {
    it('should return a CSS-style duration string', () => {
      const d = createDuration();
      expect(d.css('300')).toBe('300ms');
      expect(d.css('0')).toBe('0ms');
    });

    it('should work with the default Duration constant', () => {
      expect(Duration.ms('300')).toBe(300);
      expect(Duration.seconds('500')).toBe(0.5);
      expect(Duration.css('75')).toBe('75ms');
    });
  });

  describe('theme override', () => {
    it('should resolve custom theme keys', () => {
      const d = createDuration({ hover: 120, slide: 240 });
      expect(d.ms('hover')).toBe(120);
      expect(d.ms('slide')).toBe(240);
    });

    it('should keep default tokens available alongside theme keys', () => {
      const d = createDuration({ hover: 120 });
      expect(d.ms('300')).toBe(300);
      expect(d.ms('hover')).toBe(120);
    });

    it('should let theme keys override the same-name defaults', () => {
      const d = createDuration({ '300': 250 });
      expect(d.ms('300')).toBe(250);
    });
  });
});
