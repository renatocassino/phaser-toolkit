/* eslint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { Shadow, createShadow } from './shadow';

describe('Shadow', () => {
  it('should provide defaults via Shadow constant', () => {
    expect(Shadow.get('sm')).toEqual({
      blur: 2,
      offsetX: 1,
      offsetY: 1,
      alpha: 0.15,
    });
    expect(Shadow.get('md').blur).toBe(4);
  });

  it('should allow theme effect keys via factory', () => {
    const shadow = createShadow({
      customGlow: { blur: 20, offsetX: 0, offsetY: 0, alpha: 0.5 },
    });
    expect(shadow.get('customGlow').blur).toBe(20);
  });
});
