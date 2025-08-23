import { Types } from "phaser";

export type WindowWithPhaser = Window & {
    __phaserGames: Record<string, Phaser.Game>;
}

export const createGame = (id: string, gameConfig: Types.Core.GameConfig): void => {
    const w = window as unknown as WindowWithPhaser;
    w.__phaserGames = w.__phaserGames || {};

    Object.entries(w.__phaserGames).filter(([key]) => key !== id).forEach(([key, game]) => {
        game?.destroy(true);
        delete w.__phaserGames[key];
        document.getElementById(key)?.remove();
    });

    if (w.__phaserGames[id]) {
        w.__phaserGames[id].destroy(true);
        delete w.__phaserGames[id];
    }

    const game = new Phaser.Game({
        ...gameConfig,
    });
    w.__phaserGames[id] = game;
}
