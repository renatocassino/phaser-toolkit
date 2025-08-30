import { PhaserSoundStudioPlugin } from "../plugin";
import { ChannelConfig, SoundListConfig } from "../types";

import { SoundPlayer } from "./sound-player";

export class SoundRegistry<TSoundKey extends string = string, TChannel extends string = string> {
  constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey, TChannel>) {
    this.plugin = plugin;
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
}
