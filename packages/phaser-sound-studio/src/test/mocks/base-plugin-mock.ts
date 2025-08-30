
import { type Game } from "phaser";

import { PhaserSoundStudioPlugin } from "../../plugin";
import { audioConfig, GameChannels, GameSounds } from "../fake-config";

import { factoryGameMock } from "./game-mock";

export type FactoryPluginProps = {
    game?: Game;
}

export const factoryPluginBase = ({ game }: FactoryPluginProps): PhaserSoundStudioPlugin<GameSounds, GameChannels> => ({
    soundList: audioConfig.soundList,
    getGame: () => game ?? factoryGameMock(),
} as unknown as PhaserSoundStudioPlugin<GameSounds, GameChannels>);
