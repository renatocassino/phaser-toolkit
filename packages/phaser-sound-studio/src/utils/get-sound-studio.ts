import type { Scene } from 'phaser';

import { PHASER_SOUND_STUDIO_KEY, PhaserSoundStudioPlugin } from '../plugin';

export const getSoundStudio = <
  TSoundKey extends string = string,
  TChannel extends string = string,
>(
  scene: Scene,
  mappingKey: string = PHASER_SOUND_STUDIO_KEY
): PhaserSoundStudioPlugin<TSoundKey, TChannel> => {
  return scene.plugins.get(mappingKey) as PhaserSoundStudioPlugin<
    TSoundKey,
    TChannel
  >;
};
