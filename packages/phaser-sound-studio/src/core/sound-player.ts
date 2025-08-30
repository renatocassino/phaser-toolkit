import { type Game } from "phaser";

import { PhaserSoundStudioPlugin } from "../plugin";

export class SoundPlayer<TSoundKey extends string = string> {
    constructor(private readonly plugin: PhaserSoundStudioPlugin<TSoundKey>) {
        this.plugin = plugin;
    }

    get game(): Game {
        return this.plugin.getGame();
    }
}
