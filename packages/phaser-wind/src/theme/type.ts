import type { Game } from 'phaser';

import type { ColorToken } from '../core/color';
import type { FontSizeKey } from '../core/font-size';

export type PhaserWithTheme<T> = Game & {
  theme: T;
};

/**
 * Font configuration structure
 */
export type FontConfig = {
    [key: string]: string;
  };
  
  /**
   * Color configuration structure
   */
  export type ColorConfig = {
    [key: string]: ColorToken | string;
  };
  
  /**
   * Spacing configuration structure (following Tailwind spacing scale)
   */
  export type SpacingConfig = {
    [key: string]: number;
  };
  
  /**
   * Typography configuration structure
   */
  export type TypographyConfig = {
    [key: string]: {
      fontSize: FontSizeKey | string;
      fontFamily?: string;
      fontWeight?: number | string;
      lineHeight?: number | string;
      letterSpacing?: number | string;
    };
  };
  
  /**
   * Shadow/Effect configuration structure
   */
  export type EffectConfig = {
    [key: string]: {
      blur?: number;
      offsetX?: number;
      offsetY?: number;
      color?: ColorToken | string;
      alpha?: number;
    };
  };