/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { createEase, Ease } from './ease';

describe('Ease', () => {
  describe('value', () => {
    it('should resolve the Tailwind-style base curves', () => {
      const e = createEase();
      expect(e.value('linear')).toBe('Linear');
      expect(e.value('in')).toBe('Cubic.easeIn');
      expect(e.value('out')).toBe('Cubic.easeOut');
      expect(e.value('in-out')).toBe('Cubic.easeInOut');
    });

    it('should resolve the character curves', () => {
      const e = createEase();
      expect(e.value('back-out')).toBe('Back.easeOut');
      expect(e.value('sine-in-out')).toBe('Sine.easeInOut');
      expect(e.value('expo-in')).toBe('Expo.easeIn');
      expect(e.value('bounce-out')).toBe('Bounce.easeOut');
      expect(e.value('elastic-in-out')).toBe('Elastic.easeInOut');
    });

    it('should work with the default Ease constant', () => {
      expect(Ease.value('back-out')).toBe('Back.easeOut');
      expect(Ease.value('linear')).toBe('Linear');
    });
  });

  describe('theme override', () => {
    it('should resolve custom theme keys', () => {
      const e = createEase({
        pop: 'Back.easeOut',
        drift: 'Sine.easeInOut',
      });
      expect(e.value('pop')).toBe('Back.easeOut');
      expect(e.value('drift')).toBe('Sine.easeInOut');
    });

    it('should keep default tokens available alongside theme keys', () => {
      const e = createEase({ pop: 'Back.easeOut' });
      expect(e.value('linear')).toBe('Linear');
      expect(e.value('pop')).toBe('Back.easeOut');
    });

    it('should let theme keys override same-name defaults', () => {
      const e = createEase({ 'back-out': 'Elastic.easeOut' });
      expect(e.value('back-out')).toBe('Elastic.easeOut');
    });
  });
});
