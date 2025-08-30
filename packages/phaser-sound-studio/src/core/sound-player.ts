import type { Game } from "phaser";

import { DEFAULT_MAX_INSTANCES } from "../constants/default";
import { PhaserSoundStudioPlugin } from "../plugin";

import { SoundRegistry } from "./sound-registry";

export class SoundPlayer<TSoundKey extends string = string, TChannel extends string = string> {
    constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey, TChannel>) {
        this.plugin = plugin;
    }

    get game(): Game {
        return this.plugin.getGame();
    }

    get soundRegistry(): SoundRegistry<TSoundKey, TChannel> {
        return this.plugin.soundRegistry;
    }

    play(key: TSoundKey): void {
        const channel = this.soundRegistry.getChannelBySoundKey(key);
        const channelMode = channel.mode;
        switch (channelMode) {
            case 'single':
                this.playSingleMode(key);
                break;
            case 'multiple':
                this.playMultipleMode(key, channel.maxInstances);
                break;
        }
    }

    playSingleMode(key: TSoundKey): void {
        const sound = this.soundRegistry.getSoundBySoundKey(key);
        if (sound && !sound.isPlaying) {
            sound.play();
        }
    }

    playMultipleMode(key: TSoundKey, maxInstances: number = DEFAULT_MAX_INSTANCES): void {
        const sounds = this.soundRegistry.fetchSoundsBySoundKey(key);
        const stoppedSound = sounds.find((sound) => !sound.isPlaying);
        if (stoppedSound) {
            stoppedSound.play();
            return;
        }

        if (sounds.length < maxInstances) {
            const soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
            this.game.sound.add(key, {
                volume: soundConfig?.channel ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
                loop: soundConfig?.loop ?? false,
            }).play();
        }
    }
}
