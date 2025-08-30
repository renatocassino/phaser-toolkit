import type { Game } from "phaser";

import { PhaserSoundStudioPlugin } from "../plugin";
import { ChannelConfig, ChannelItem, SoundConfig, SoundListConfig } from "../types";

import { SoundPlayer } from "./sound-player";

export class SoundRegistry<TSoundKey extends string = string, TChannel extends string = string> {
  constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey, TChannel>) {
    this.plugin = plugin;
  }

  get game(): Game {
    return this.plugin.getGame();
  }

  get soundPlayer(): SoundPlayer<TSoundKey> {
    return this.plugin.soundPlayer;
  }

  get channels(): ChannelConfig<TChannel> {
    return this.plugin.channels;
  }

  get soundList(): SoundListConfig<TSoundKey, TChannel> {
    return this.plugin.soundList;
  }

  getSoundConfigBySoundKey(soundKey: TSoundKey): SoundConfig<TChannel> | null {
    return this.soundList[soundKey] ?? null;
  }

  getSoundBySoundKey(soundKey: TSoundKey): Phaser.Sound.BaseSound | null {
    const sounds = this.fetchSoundsBySoundKey(soundKey);
    return sounds.length > 0 ? sounds[0] as Phaser.Sound.BaseSound : null;
  }

  fetchSoundsBySoundKey(soundKey: TSoundKey): Phaser.Sound.BaseSound[] {
    return this.game.sound.getAll(soundKey);
  }

  getChannelBySoundKey(soundKey: TSoundKey): ChannelItem {
    const sound = this.soundList[soundKey];
    const channel = this.channels[sound.channel];
    return channel;
  }
}
