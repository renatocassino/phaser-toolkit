import { createTheme } from "../../phaser-wind/src";

export const theme = createTheme({
    colors: {
      primary: 'blue-500',
      terciary: 'red-900',
    }
});

export type ThemeType = typeof theme;
