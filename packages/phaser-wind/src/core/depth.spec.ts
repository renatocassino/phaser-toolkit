/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { createDepth, Depth } from './depth';

describe('Depth', () => {
  describe('value', () => {
    it('should return the numeric depth for named layers', () => {
      const d = createDepth();
      expect(d.value('base')).toBe(0);
      expect(d.value('content')).toBe(100);
      expect(d.value('overlay')).toBe(1000);
      expect(d.value('modal')).toBe(2000);
      expect(d.value('tooltip')).toBe(3000);
    });

    it('should work with the default Depth constant', () => {
      expect(Depth.value('base')).toBe(0);
      expect(Depth.value('modal')).toBe(2000);
      expect(Depth.value('tooltip')).toBe(3000);
    });
  });

  describe('theme override', () => {
    it('should resolve custom theme keys', () => {
      const d = createDepth({ toast: 2500, hud: 150 });
      expect(d.value('toast')).toBe(2500);
      expect(d.value('hud')).toBe(150);
    });

    it('should keep default tokens available alongside theme keys', () => {
      const d = createDepth({ toast: 2500 });
      expect(d.value('modal')).toBe(2000);
      expect(d.value('toast')).toBe(2500);
    });

    it('should let theme keys override the same-name defaults', () => {
      const d = createDepth({ modal: 5000 });
      expect(d.value('modal')).toBe(5000);
    });
  });
});
