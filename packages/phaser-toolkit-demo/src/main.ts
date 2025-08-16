import Phaser from 'phaser';
import {
  PhaserWindPlugin,
  PHASER_WIND_KEY,
  PhaserWindPluginData,
} from 'phaser-wind';

import { DemoScene } from './demo-scene';
import { theme } from './theme';

const config: Phaser.Types.Core.GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  backgroundColor: '#0b1020',
  width: 900,
  height: 600,
  scene: [DemoScene],
  render: { pixelArt: true },
  plugins: {
    global: [
      {
        key: PHASER_WIND_KEY,
        plugin: PhaserWindPlugin,
        mapping: PHASER_WIND_KEY,
        data: {
          theme,
        } as PhaserWindPluginData,
        start: true,
      },
    ],
  },
};

new Phaser.Game(config);
