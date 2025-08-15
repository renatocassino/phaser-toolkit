import type { BaseThemeConfig } from '../theme';

/** Default shadow keys. */
export type ShadowKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

/**
 * Shadow configuration type defining blur, offset and alpha values
 */
/** Shadow configuration shape (compatible with Phaser effects). */
export type ShadowConfig = {
  blur: number;
  offsetX: number;
  offsetY: number;
  alpha: number;
};

/** Default shadow presets. */
export const defaultShadowMap: Record<ShadowKey, ShadowConfig> = {
  sm: { blur: 2, offsetX: 1, offsetY: 1, alpha: 0.15 },
  md: { blur: 4, offsetX: 2, offsetY: 2, alpha: 0.2 },
  lg: { blur: 6, offsetX: 4, offsetY: 4, alpha: 0.25 },
  xl: { blur: 8, offsetX: 6, offsetY: 6, alpha: 0.3 },
  '2xl': { blur: 12, offsetX: 8, offsetY: 8, alpha: 0.35 },
  inner: { blur: 4, offsetX: -2, offsetY: -2, alpha: 0.2 },
};

/** Map of shadow keys to shadow configs. */
export type ShadowMap = Record<ShadowKey | string, ShadowConfig>;

/** API for resolving shadow tokens to configs. */
export type ShadowApi<T extends Record<string, unknown> | undefined> = {
  get: (
    key: ShadowKey | (T extends Record<string, unknown> ? keyof T : never)
  ) => ShadowConfig;
};

/**
 * Create a shadow API bound to an optional effects map.
 * @example
 * const sh = createShadow({ glow: { blur: 8, offsetX: 0, offsetY: 0, alpha: .6 } });
 * sh.get('glow');
 */
export const createShadow = <
  T extends BaseThemeConfig['effects'] = BaseThemeConfig['effects'],
>(
  effects?: T
): ShadowApi<T> => {
  const map: ShadowMap = {
    ...defaultShadowMap,
    ...(effects as unknown as ShadowMap | undefined),
  } as ShadowMap;

  const getConfig = (key: string): ShadowConfig => {
    const cfg = map[key];
    if (cfg && typeof cfg === 'object') return cfg as ShadowConfig;
    return defaultShadowMap['md'];
  };

  return {
    get: (
      key: ShadowKey | (T extends Record<string, unknown> ? keyof T : never)
    ): ShadowConfig => getConfig(key as string),
  };
};

/** Convenience instance using default shadows (no theme). */
export const Shadow: ShadowApi<undefined> = createShadow<undefined>(undefined);
