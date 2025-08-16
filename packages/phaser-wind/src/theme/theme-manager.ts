import merge from 'lodash/merge';

import { type ThemeOverride, defaultLightTheme } from './theme-config';

export const createTheme = <T extends ThemeOverride>(theme: T): T =>
  merge({}, defaultLightTheme, theme);
