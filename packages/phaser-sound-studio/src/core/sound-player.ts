import type { Game } from "phaser";

import { DEFAULT_MAX_INSTANCES } from "../constants/default";
import { PhaserSoundStudioPlugin } from "../plugin";

import { SoundRegistry } from "./sound-registry";

/**
 * SoundPlayer is responsible for playing sounds according to their channel mode.
 *
 * @template TSoundKey - The type of the sound key (defaults to string).
 * @template TChannel - The type of the channel name (defaults to string).
 */
export class SoundPlayer<TSoundKey extends string = string, TChannel extends string = string> {
    /**
     * Creates an instance of SoundPlayer.
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
     * Returns the SoundRegistry instance.
     * @returns {SoundRegistry<TSoundKey, TChannel>} The SoundRegistry instance.
     */
    get soundRegistry(): SoundRegistry<TSoundKey, TChannel> {
        return this.plugin.soundRegistry;
    }

    /**
     * Plays a sound by its key, using the appropriate channel mode.
     * @param {TSoundKey} key - The key of the sound to play.
     * @returns {void}
     */
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

    /**
     * Plays a sound in 'single' mode (only one instance can play at a time).
     * @param {TSoundKey} key - The key of the sound to play.
     * @returns {void}
     */
    playSingleMode(key: TSoundKey): void {
        const sound = this.soundRegistry.getSoundBySoundKey(key);
        if (sound) {
            if (!sound.isPlaying) {
                sound.play();
            }
            return;
        }

        const soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
        this.game.sound.add(key, {
            volume: soundConfig?.channel ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
            loop: soundConfig?.loop ?? false,
        }).play();
    }

    /**
     * Plays a sound in 'multiple' mode (multiple instances can play simultaneously, up to maxInstances).
     * @param {TSoundKey} key - The key of the sound to play.
     * @param {number} [maxInstances=DEFAULT_MAX_INSTANCES] - The maximum number of simultaneous instances allowed.
     * @returns {void}
     */
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
