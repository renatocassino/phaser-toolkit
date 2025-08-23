import { Types } from "phaser";

import { nextFrames } from "./next-tick";

export type WindowWithPhaser = Window & {
    __phaserGames: Record<string, Phaser.Game>;
}

export const createGame = (id: string, gameConfig: Types.Core.GameConfig): void => {
    const w = window as unknown as WindowWithPhaser;
    w.__phaserGames = w.__phaserGames || {};

    const game = new Phaser.Game({
        ...gameConfig,
    });
    w.__phaserGames[id] = game;
}

export const getGame = (id: string): Phaser.Game | undefined => {
    const w = window as unknown as WindowWithPhaser;
    w.__phaserGames = w.__phaserGames ?? {};
    return w.__phaserGames[id];
}

export const cleanGames = async (): Promise<void> => {
    const w = window as unknown as WindowWithPhaser;
    w.__phaserGames = w.__phaserGames ?? {};
    Object.entries(w.__phaserGames).forEach(([key, game]) => {
        game?.destroy(true);
        delete w.__phaserGames[key];
        document.getElementById(key)?.remove();
    });

    await nextFrames(2);
}
