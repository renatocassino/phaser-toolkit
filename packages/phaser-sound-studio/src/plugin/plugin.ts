import { withPersistentState } from 'packages/phaser-hooks';
import { Plugins, Scene } from 'phaser';

import { SoundConfig, SoundListConfig } from '../types';

/**
 * The key used to register the Phaser Sound Studio plugin.
 * @type {string}
 */
export const PHASER_SOUND_STUDIO_KEY: string = 'soundStudio';

/**
 * Plugin configuration data type.
 *
 * @template TSoundKey - The type of the sound key (defaults to string).
 * @template TChannel - The type of the channel name (defaults to string).
 * @typedef {Object} PhaserSoundStudioPluginData
 * @property {SoundListConfig} soundList - List of sounds to be loaded.
 * @property {TChannel[]} channels - List of channels to be used.
 * @property {'local' | 'session'} storage - Storage type for sound settings.
 * @property {string} [gameName] - Optional name of the game for storage key.
 */
export type PhaserSoundStudioPluginData<
  TSoundKey extends string = string,
  TChannel extends string = string,
> = {
  soundList: SoundListConfig<TSoundKey, TChannel>;
  channels: TChannel[];
  storage: 'local' | 'session';
  gameName?: string;
};

/**
 * Phaser Sound Studio Plugin class that manages sound configuration and playback.
 * @template TSoundKey - The type of the sound key (defaults to string).
 * @template TChannel - The type of the channel name (defaults to string).
 * @extends Plugins.BasePlugin
 */
export class PhaserSoundStudioPlugin<
  TSoundKey extends string = string,
  TChannel extends string = string,
> extends Plugins.BasePlugin {
  /**
   * Map of channel names to their current volume.
   * @type {Record<TChannel, number>}
   * @private
   */
  private channelVolumes: Record<TChannel, number> = {} as Record<TChannel, number>;

  /**
   * The list of sound configurations.
   * @type {SoundListConfig<TSoundKey, TChannel>}
   * @private
   */
  private soundList: SoundListConfig<TSoundKey, TChannel>;

  /**
   * The list of available channels.
   * @type {TChannel[]}
   * @public
   */
  public channels: TChannel[];

  /**
   * The storage type for sound settings.
   * @type {'local' | 'session'}
   * @public
   */
  public storage: 'local' | 'session';

  /**
   * The name of the game.
   * @type {string | undefined}
   * @public
   */
  public gameName: string | undefined;

  /**
   * Map of sound keys to Phaser sound objects.
   * @type {Partial<Record<string, Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>>}
   * @protected
   */
  protected sounds: Partial<
    Record<
      string,
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound
    >
  > = {};

  /**
   * Creates an instance of PhaserSoundStudioPlugin.
   * @param {Plugins.PluginManager} pluginManager - Phaser plugin manager instance.
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
    /**
     * @type {SoundListConfig<TSoundKey, TChannel>}
     */
    this.soundList = {} as SoundListConfig<TSoundKey, TChannel>;
    /**
     * @type {TChannel[]}
     */
    this.channels = [];
    /**
     * @type {'local' | 'session'}
     */
    this.storage = 'local';
  }

  /**
   * Initializes the plugin with configuration data.
   * @param {PhaserSoundStudioPluginData<TSoundKey, TChannel>} param0 - The plugin configuration data.
   * @returns {void}
   * @override
   */
  override init({
    soundList,
    channels,
    storage,
    gameName,
  }: PhaserSoundStudioPluginData<TSoundKey, TChannel>): void {
    /**
     * @type {SoundListConfig<TSoundKey, TChannel>}
     */
    this.soundList = soundList;
    /**
     * @type {TChannel[]}
     */
    this.channels = channels;
    /**
     * @type {'local' | 'session'}
     */
    this.storage = storage;
    /**
     * @type {string | undefined}
     */
    this.gameName = gameName;

    this.channels.forEach(channel => {
      this.channelVolumes[channel] = 1.0;
    });
  }

  /**
   * Loads all sounds defined in the sound list into the given scene.
   * @param {Scene} scene - The Phaser scene to load sounds into.
   * @returns {void}
   */
  loadAll(scene: Scene): void {
    for (const [key, sound] of Object.entries<SoundConfig<TChannel>>(this.soundList)) {
      if (sound.preload !== false) {
        scene.load.audio(key as TSoundKey, sound.path);
        this.sounds[key] = scene.sound.add(key, {
          volume: this.channelVolumes[sound.channel] ?? 1,
          loop: sound.loop ?? false,
        });
      }
    }
    this.loadChannelVolumes(scene);
  }

  /**
   * Loads all sounds for a specific channel into the given scene.
   * @param {Scene} scene - The Phaser scene to load sounds into.
   * @param {TChannel} channel - The channel to load sounds for.
   * @returns {void}
   */
  loadByChannel(scene: Scene, channel: TChannel): void {
    Object.entries<SoundConfig<TChannel>>(this.soundList)
      .filter(s => s[1].channel === channel)
      .forEach(([soundKey, sound]) => {
        scene.load.audio(soundKey, sound.path);
      });
    this.loadChannelVolumes(scene);
  }

  /**
   * Loads a specific sound by its key into the given scene.
   * @param {Scene} scene - The Phaser scene to load the sound into.
   * @param {TSoundKey} soundKey - The key of the sound to load.
   * @returns {void}
   */
  loadBySoundKey(scene: Scene, soundKey: TSoundKey): void {
    if (!scene.cache.audio.has(soundKey)) {
      scene.load.audio(soundKey, this.soundList[soundKey]?.path);
    }
  }

  /**
   * Plays a sound by key in the given scene. If the sound is not loaded, it loads and then plays it.
   * @param {Scene} scene - The Phaser scene to play the sound in.
   * @param {TSoundKey} key - The key of the sound to play.
   * @returns {void}
   */
  play(scene: Scene, key: TSoundKey): void {
    if (!scene.cache.audio.has(key)) {
      this.lazyLoadPlay(scene, key);
      return;
    }

    const soundConfig = this.soundList[key];
    if (!soundConfig) {
      return;
    }
    const channelVolume = this.channelVolumes[soundConfig.channel] ?? 1;

    scene.sound.play(key, { volume: channelVolume });
  }

  /**
   * Plays a sound by key only if it is not already playing.
   * @param {Scene} scene - The Phaser scene to play the sound in.
   * @param {TSoundKey} key - The key of the sound to play.
   * @returns {void}
   */
  playOnce(scene: Scene, key: TSoundKey): void {
    const sound = scene.sound.get(key);
    if (sound?.isPlaying) {
      return;
    }

    this.play(scene, key);
  }

  /**
   * Lazy loads a sound by key in the given scene.
   * @param {Scene} scene - The Phaser scene to load the sound into.
   * @param {TSoundKey} key - The key of the sound to load.
   * @returns {void}
   */
  public lazyLoadPlay(scene: Scene, key: TSoundKey): void {
    const path = this.soundList[key]?.path;
    if (!path) {
      return;
    }

    scene.load.audio(key, path);
    // Wait for the audio to finish loading before proceeding
    scene.load.once(`filecomplete-audio-${key}`, () => {
      this.sounds[key] = scene.sound.add(key, {
        volume: this.channelVolumes[this.soundList[key].channel] ?? 1,
        loop: this.soundList[key].loop ?? false,
      });
      scene.sound.play(key);
    });
  }

  /**
   * Sets the volume for a specific channel.
   * @param {Scene} scene - The Phaser scene context.
   * @param {TChannel} channel - The channel to set the volume for.
   * @param {number} volume - The volume to set (0.0 to 1.0).
   * @returns {void}
   */
  setChannelVolume(scene: Scene, channel: TChannel, volume: number): void {
    if (volume < 0 || volume > 1) {
      volume = Math.max(0, Math.min(1, volume));
      // eslint-disable-next-line no-console
      console.warn(
        `Volume must be between 0 and 1. Setting volume to ${volume} instead in channel ${channel}.`
      );
    }
    this.channelVolumes[channel] = volume;

    Object.entries<SoundConfig<TChannel>>(this.soundList)
      .filter(s => s[1].channel === channel)
      .forEach(([soundKey]) => {
        const soundInstance = this.sounds[soundKey] ?? scene.sound.get(soundKey);
        if (soundInstance && 'setVolume' in soundInstance) {
          soundInstance.setVolume(volume);
        }
      });

    this.saveChannelVolumes(scene);
  }

  /**
   * Gets the volume for a specific channel.
   * @param {TChannel} channel - The channel to get the volume for.
   * @returns {number} The volume for the channel.
   */
  getChannelVolume(channel: TChannel): number {
    return this.channelVolumes[channel] || 1;
  }

  /**
   * Mutes a specific channel.
   * @param {Scene} scene - The Phaser scene context.
   * @param {TChannel} channel - The channel to mute.
   * @returns {void}
   */
  muteChannel(scene: Scene, channel: TChannel): void {
    this.setChannelVolume(scene, channel, 0);
  }

  /**
   * Unmutes a specific channel.
   * @param {Scene} scene - The Phaser scene context.
   * @param {TChannel} channel - The channel to unmute.
   * @returns {void}
   */
  unmuteChannel(scene: Scene, channel: TChannel): void {
    this.setChannelVolume(scene, channel, 1);
  }

  /**
   * Gets all channels.
   * @returns {TChannel[]} All channels.
   */
  getAllChannels(): TChannel[] {
    return this.channels;
  }

  /**
   * Returns the persistent storage key for channel volumes.
   * @returns {string} The storage key for channel volumes.
   */
  persistNameKey(): string {
    if (!this.gameName) {
      return 'phaser-sound-studio-volumes';
    }
    return `phaser-sound-studio-volumes:${this.gameName}`;
  }

  /**
   * Saves the channel volumes to the storage.
   * @param {Scene} scene - The Phaser scene context.
   * @returns {void}
   * @private
   */
  private saveChannelVolumes(scene: Scene): void {
    const hook = withPersistentState(
      scene,
      this.persistNameKey(),
      this.channelVolumes,
      undefined,
      this.storage
    );
    hook.set(this.channelVolumes);
  }

  /**
   * Loads the channel volumes from the storage.
   * @param {Scene} scene - The Phaser scene context.
   * @returns {void}
   * @private
   */
  private loadChannelVolumes(scene: Scene): void {
    const hook = withPersistentState(
      scene,
      this.persistNameKey(),
      this.channelVolumes,
      undefined,
      this.storage
    );
    this.channelVolumes = hook.get();
  }
}
