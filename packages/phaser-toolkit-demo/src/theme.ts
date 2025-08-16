import { createTheme, PhaserWindPlugin } from 'phaser-wind';

export const theme = createTheme({
  colors: {
    primary: 'blue-900',
    terciary: 'red-200',
  },
});

export type ThemeType = typeof theme;

declare module 'phaser' {
  type Scene = {
    pw: PhaserWindPlugin<ThemeType>;
  };
}
