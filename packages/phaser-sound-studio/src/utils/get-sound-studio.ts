import type { Scene } from 'phaser';

import { PHASER_SOUND_STUDIO_KEY, PhaserSoundStudioPlugin } from '../plugin';

export const getSoundStudio = <T extends string = string>(scene: Scene, mappingKey: string = PHASER_SOUND_STUDIO_KEY): PhaserSoundStudioPlugin<T> => {
    return scene.plugins.get(mappingKey) as PhaserSoundStudioPlugin<T>;
};
