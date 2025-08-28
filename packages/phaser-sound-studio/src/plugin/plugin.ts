import { Plugins, Scene } from 'phaser';

import { SoundListConfig } from '../types';

export const PHASER_SOUND_STUDIO_KEY: string = 'soundStudio';

/**
 * Plugin configuration data type.
 *
 * @typedef {Object} PhaserSoundStudioPluginData
 * @property {SoundListConfig} [soundList] - List of sounds to be loaded
 * @property {string[]} [channels] - List of channels to be used
 */
export type PhaserSoundStudioPluginData<T extends string = string> = {
  soundList: SoundListConfig<T>;
  channels: string[];
  storage: 'local' | 'session';
};

/**
 * Phaser Wind Plugin class that manages theme configuration
 * @extends Plugins.BasePlugin
 */
export class PhaserSoundStudioPlugin<T extends string = string> extends Plugins.BasePlugin {
  private soundList: SoundListConfig<T>;
  public channels: string[]
  public storage: 'local' | 'session'
  private loadedSounds: Set<string> = new Set();

  protected sounds: Partial<Record<string, Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>> = {};

  /**
   * Creates an instance of PhaserSoundStudioPlugin
   * @param pluginManager - Phaser plugin manager instance
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
    this.soundList = {} as SoundListConfig<T>;
    this.channels = [];
    this.storage = 'local';
  }

  override init({ soundList, channels, storage }: PhaserSoundStudioPluginData<T>): void {
    this.soundList = soundList;
    this.channels = channels;
    this.storage = storage;
  }

  loadAll(scene: Scene): void {
    for (const [key, sound] of Object.entries(this.soundList)) {
      if (typeof sound === 'object' && sound !== null && 'path' in sound) {
        scene.load.audio(key as T, (sound as { path: string }).path);
        this.loadedSounds.add(key);
      }
    }
  }

  play(scene: Scene, key: T): void {
    if (!this.loadedSounds.has(key)) {
      scene.load.audio(key, this.soundList[key]?.path);
      // Wait for the audio to finish loading before proceeding
      scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        this.loadedSounds.add(key);
        this.sounds[key] = scene.sound.add(key, this.soundList[key]);

        scene.sound.play(key);
      });
      scene.load.start();
      return;
    }

    // if (!(key in this.sounds)) {
    //   throw new Error(`Sound ${key} not loaded`);
    // }

    scene.sound.play(key);
  }
}
