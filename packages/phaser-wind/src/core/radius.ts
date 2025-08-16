import type { BaseThemeConfig } from '../theme';

/** Available border radius keys matching Tailwind CSS radius scale. */
export type RadiusKey =
  | 'none'
  | 'sm'
  | 'default'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

/** Map of radius tokens to pixel values. */
export type RadiusMap = Record<RadiusKey | string, number>;

/**
 * Mapping of radius keys to their pixel values
 */
/** Default radius scale mapping (in pixels). */
export const radiusMap: RadiusMap = {
  none: 0,
  sm: 2,
  default: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

/**
 * Utility functions for working with border radius values
 */
/** API for resolving radius tokens to px/rem/css. */
export type RadiusApi<T extends RadiusMap | undefined> = {
  px: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)) => number;
  rem: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)) => number;
  css: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)) => string;
};

/**
 * Create a radius API bound to an optional theme radius map.
 * @example
 * const r = createRadius({ card: 12 });
 * r.css('card'); // '12px'
 */
export const createRadius = <
  T extends RadiusMap | undefined = BaseThemeConfig['radius'],
>(
  themeRadius?: T
): RadiusApi<T> => {
  const map: RadiusMap = {
    ...radiusMap,
    ...(themeRadius as RadiusMap | undefined),
  } as RadiusMap;

  const get = (key: string): number => {
    return typeof map[key] === 'number' ? (map[key] as number) : 0;
  };

  return {
    px: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)): number =>
      get(key as string),
    rem: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)): number =>
      get(key as string) / 16,
    css: (key: RadiusKey | (T extends RadiusMap ? keyof T : never)): string =>
      `${get(key as string)}px`,
  };
};

/** Convenience instance using default radius map (no theme). */
export const Radius: RadiusApi<undefined> = createRadius<undefined>(undefined);
