import type { Game } from "phaser";

import { PhaserSoundStudioPlugin } from "../plugin";
import { ChannelConfig, ChannelItem, SoundConfig, SoundListConfig } from "../types";

import { SoundPlayer } from "./sound-player";

/**
 * SoundRegistry is responsible for managing and providing access to sound and channel configurations.
 *
 * @template TSoundKey - The type of the sound key (defaults to string).
 * @template TChannel - The type of the channel name (defaults to string).
 */
export class SoundRegistry<TSoundKey extends string = string, TChannel extends string = string> {
  /**
   * Creates an instance of SoundRegistry.
   * @param plugin - The PhaserSoundStudioPlugin instance.
   */
  constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey, TChannel>) {
    this.plugin = plugin;
  }

  /**
   * Returns the Phaser Game instance.
   * @returns {Game} The Phaser Game instance.
   */
  get game(): Game {
    return this.plugin.getGame();
  }

  /**
   * Returns the SoundPlayer instance.
   * @returns {SoundPlayer<TSoundKey>} The SoundPlayer instance.
   */
  get soundPlayer(): SoundPlayer<TSoundKey> {
    return this.plugin.soundPlayer;
  }

  /**
   * Returns the channel configuration.
   * @returns {ChannelConfig<TChannel>} The channel configuration.
   */
  get channels(): ChannelConfig<TChannel> {
    return this.plugin.channels;
  }

  /**
   * Returns the sound list configuration.
   * @returns {SoundListConfig<TSoundKey, TChannel>} The sound list configuration.
   */
  get soundList(): SoundListConfig<TSoundKey, TChannel> {
    return this.plugin.soundList;
  }

  /**
   * Gets the sound configuration for a given sound key.
   * @param {TSoundKey} soundKey - The key of the sound.
   * @returns {SoundConfig<TChannel> | null} The sound configuration or null if not found.
   */
  getSoundConfigBySoundKey(soundKey: TSoundKey): SoundConfig<TChannel> | null {
    return this.soundList[soundKey] ?? null;
  }

  /**
   * Gets the first Phaser sound instance for a given sound key.
   * @param soundKey - The key of the sound.
   * @returns {Phaser.Sound.BaseSound | null} The first sound instance or null if not found.
   */
  getSoundBySoundKey(soundKey: TSoundKey): Phaser.Sound.BaseSound | null {
    const sounds = this.fetchSoundsBySoundKey(soundKey);
    return sounds.length > 0 ? (sounds[0] as Phaser.Sound.BaseSound) : null;
  }

  /**
   * Fetches all Phaser sound instances for a given sound key.
   * @param soundKey - The key of the sound.
   * @returns {Phaser.Sound.BaseSound[]} An array of sound instances.
   */
  fetchSoundsBySoundKey(soundKey: TSoundKey): Phaser.Sound.BaseSound[] {
    return this.game.sound.getAll(soundKey);
  }

  /**
   * Gets the channel configuration for a given sound key.
   * @param soundKey - The key of the sound.
   * @returns {ChannelItem} The channel configuration item.
   */
  getChannelBySoundKey(soundKey: TSoundKey): ChannelItem {
    const sound = this.soundList[soundKey];
    const channel = this.channels[sound.channel];
    return channel;
  }
}
