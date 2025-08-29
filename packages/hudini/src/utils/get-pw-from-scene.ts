import { Scene } from 'phaser';
import {
  BaseThemeConfig,
  PhaserWindPlugin,
  SceneWithPhaserWind,
} from 'phaser-wind';

import { HudiniPlugin } from '../plugin/plugin';
import { SceneWithHudini } from '../scene/scene-with-hudini';

export const getPWFromScene = (scene: Scene): PhaserWindPlugin<{}> => {
  return (scene as unknown as SceneWithPhaserWind<{}>).pw;
};

export const getHudini = <T extends BaseThemeConfig = BaseThemeConfig>(
  scene: Scene
): HudiniPlugin<T> => {
  return (scene as unknown as SceneWithHudini<T>).hudini;
};
