import type { Game, Scene } from "phaser";

import { PhaserSoundStudioPlugin } from "../plugin";

export class SoundLoader<TSoundKey extends string = string, TChannel extends string = string> {
    constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey, TChannel>) {
        this.plugin = plugin;
    }

    get game(): Game {
        return this.plugin.getGame();
    }

    /**
     * Loads a sound by its key into the given scene.
     * @param {Scene} scene - The Phaser scene to load the sound into.
     * @param {TSoundKey} soundKey - The key of the sound to load.
     * @returns {void}
     */
    loadBySoundKey(scene: Scene, soundKey: TSoundKey): void {
        const { game, plugin } = this;
        if (!game.cache.audio.has(soundKey)) {
            scene.load.audio(soundKey, plugin.soundList[soundKey]?.path);
        }
    }
}
