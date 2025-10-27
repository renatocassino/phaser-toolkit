import { merge } from '../utils/merge';

import { type ThemeOverride, defaultLightTheme } from './theme-config';

export const createTheme = <T extends ThemeOverride>(theme: T): T =>
  merge({} as T, defaultLightTheme, theme);
