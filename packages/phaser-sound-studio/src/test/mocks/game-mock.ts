import { type Game } from "phaser";
import { vi } from 'vitest';

export const factoryGameMock = (): Game => {
    return {
        cache: {
            audio: {
                has: vi.fn(),
            },
        },
    } as unknown as Game;
};
