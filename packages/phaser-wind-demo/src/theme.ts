import { createTheme } from '../../phaser-wind';

export const theme = createTheme({
  colors: {
    primary: 'blue-500',
    terciary: 'red-900',
  },
});

export type ThemeType = typeof theme;
