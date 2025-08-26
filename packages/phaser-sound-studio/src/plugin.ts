import { Plugins, Scene } from 'phaser';

import { SoundListConfig } from './types';

export const PHASER_SOUND_STUDIO_KEY: string = 'soundStudio';

/**
 * Plugin configuration data type.
 *
 * @typedef {Object} PhaserSoundStudioPluginData
 * @property {SoundListConfig} [soundList] - List of sounds to be loaded
 * @property {string[]} [channels] - List of channels to be used
 */
export type PhaserSoundStudioPluginData = {
  soundList: SoundListConfig;
  channels: string[];
  storage: 'local' | 'session';
};

/**
 * Phaser Wind Plugin class that manages theme configuration
 * @extends Plugins.BasePlugin
 */
export class PhaserSoundStudioPlugin extends Plugins.BasePlugin {
  private soundList: SoundListConfig;
  private channels: string[];
  private storage: 'local' | 'session';
  private loadedSounds: Set<string> = new Set();

  protected sounds: Partial<Record<string, Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>> = {};

  /**
   * Creates an instance of PhaserSoundStudioPlugin
   * @param pluginManager - Phaser plugin manager instance
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
    this.soundList = {};
    this.channels = [];
    this.storage = 'local';

    // @ts-ignore
    window.a = {
      soundList: this.soundList,
      channels: this.channels,
      storage: this.storage,
      loadedSounds: this.loadedSounds,
      sounds: this.sounds,
    }
  }

  override init({ soundList, channels, storage }: PhaserSoundStudioPluginData): void {
    this.soundList = soundList;
    this.channels = channels;
    this.storage = storage;
  }

  loadAll(scene: Scene): void {
    for (const [key, sound] of Object.entries(this.soundList)) {
      scene.load.audio(key, sound.path);
      this.loadedSounds.add(key);
    }
  }

  play(scene: Scene, key: string): void {
    if (!this.loadedSounds.has(key)) {
      scene.load.audio(key, this.soundList[key]?.path);
    }

    this.sounds[key]?.play();
  }
}
