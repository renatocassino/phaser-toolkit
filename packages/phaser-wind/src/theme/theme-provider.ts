/**
 * A ideia
 * 
 * Ter um meio de instalar o phaser-wind no phaser em uma instancia
 * sem se tornar um global
 * 
 * Também ter um tema e ter a tipagem das chaves do tema
 * 
 * Ao mesmo tempo, um meio de eu pegar as chaves validando
 * os tokens em tempo de transpile
 *
 * Algo como: (pseudo código)
 * 
 * const theme = createTheme({
 *   colors: {
 *     primary: 'blue-500',
 *   }
 * })
 * 
 * const game = new Phaser.Game({
 *  // .....
 * });
 * 
 * PhaserWind.init(game, theme);
 * 
 * Com isso o phaser-wind fica disponível em todo o jogo
 * e eu posso usar os tokens do tema em todo o jogo
 * 
 * Entretanto, se eu chamar o Color.rgb('primary') diretamente
 * eu não tenho a tipagem do token
 * 
 * Então eu preciso de um meio de eu ter a tipagem do token
 * e ao mesmo tempo, eu posso usar o Color.rgb('primary') diretamente
 * 
 * Algo como:
 * 
 * const primary = Color.rgb('primary');
 * 
 * Possíveis soluções:
 * 1.
 * 
 * Ter uma instancia no próprio repo que retorne a tipagem do token
 * 
 * Exemplo: o dev terá que ter no projeto algo como:
 * 
 * const theme = createTheme({ /**  .....
 * const game = new Phaser.Game({ // ......
 * const phaserWind = PhaserWind.init(game, theme);
 * 
 * export { Color, FontSize, Spacing, TypographyPicker, ThemeManager } from 'phaser-wind';
 * 
 * import { Color } from '@my-custom-project/game';
 * const primary = Color.rgb('primary');
 * 
 * 
 * No Hudini, eu terei um novo install que se utilizará do phaser-wind.
 * Se o cliente instalar o phaser-wind, ele terá que passar para o hudini
 * Se nao, o Hudini cria um phaser-wind com o tema padrão
 * 
 * exemplo:
 * 
 * const theme = createTheme({ //.....
 * const game = new Phaser.Game({ /////....
 * const phaserWind = PhaserWind.init(game, theme);
 * const hudini = Hudini.init(game, phaserWind);
 *
 * export const { Color, FontSize, Spacing, TypographyPicker, ThemeManager } = hudini;
 */
import { Color as BaseColor } from '../core/color';

import type { ThemeOverride } from './theme-config';
import { ThemeManager } from './theme-manager';
import type { PhaserWithTheme } from './type';

export const init = <T>(game: Phaser.Game, theme: ThemeOverride): PhaserWithTheme<T> => {
    (game as PhaserWithTheme<T>).theme = theme as T;
    // Keep global ThemeManager in sync so Color/Font/etc resolve tokens
    ThemeManager.setThemeObject(theme);
    return game as PhaserWithTheme<T>;
}

export const getThemeFromScene = <T>(scene: Phaser.Scene): T => {
    return (scene.game as PhaserWithTheme<T>).theme;
}

// Utility to extract theme color keys for autocomplete
type ThemeColorKeys<T> = T extends { colors?: Record<string, unknown> }
  ? keyof NonNullable<T['colors']> & string
  : never;

// Typed Color facade that narrows accepted keys to theme colors or ColorToken
export type TypedColor<T extends ThemeOverride> = {
  rgb: (
    key: ThemeColorKeys<T> | import('../core/color').ColorToken
  ) => string;
  hex: (
    key: ThemeColorKeys<T> | import('../core/color').ColorToken
  ) => number;
};

/**
 * Create a Phaser Wind binding with theme-aware, typed helpers.
 * Returns the game and a Color helper that autocompletes theme color tokens.
 */
export const createPhaserWind = <T extends ThemeOverride>(
  game: Phaser.Game,
  theme: T
): {
  game: PhaserWithTheme<T>;
  Color: TypedColor<T>;
  getTheme: () => T;
} => {
  const gameWithTheme = init<T>(game, theme);

  const Color: TypedColor<T> = {
    rgb: (key) => BaseColor.rgb(key as unknown as import('../core/color').ColorToken),
    hex: (key) => BaseColor.hex(key as unknown as import('../core/color').ColorToken),
  };

  return {
    game: gameWithTheme,
    Color,
    getTheme: () => theme,
  };
};
