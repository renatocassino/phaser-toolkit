/**
 * Available shadow keys matching common shadow scales
 */
export type ShadowKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

/**
 * Shadow configuration type defining blur, offset and alpha values
 */
export type ShadowConfig = {
  blur: number;
  offsetX: number;
  offsetY: number;
  alpha: number;
};

/**
 * Utility for working with shadow configurations
 */
export const Shadow = {
  /**
   * Get shadow configuration for given key
   * @param key - Shadow key (e.g., 'sm', 'lg', 'inner')
   * @param defaultKey - Optional default key if provided key is invalid
   * @returns Shadow configuration with blur, offset and alpha values
   */
  get: (key: ShadowKey, defaultKey: ShadowKey = 'md'): ShadowConfig => {
    const shadows: Record<ShadowKey, ShadowConfig> = {
      sm: { blur: 2, offsetX: 1, offsetY: 1, alpha: 0.15 },
      md: { blur: 4, offsetX: 2, offsetY: 2, alpha: 0.2 },
      lg: { blur: 6, offsetX: 4, offsetY: 4, alpha: 0.25 },
      xl: { blur: 8, offsetX: 6, offsetY: 6, alpha: 0.3 },
      '2xl': { blur: 12, offsetX: 8, offsetY: 8, alpha: 0.35 },
      inner: { blur: 4, offsetX: -2, offsetY: -2, alpha: 0.2 },
    };
    return shadows[key] || shadows[defaultKey];
  },
};
