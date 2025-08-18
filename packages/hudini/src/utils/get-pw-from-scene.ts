import { Scene } from 'phaser';
import { PhaserWindPlugin, SceneWithPhaserWind } from 'phaser-wind';

export const getPWFromScene = (scene: Scene): PhaserWindPlugin<{}> => {
  return (scene as unknown as SceneWithPhaserWind<{}>).pw;
};
