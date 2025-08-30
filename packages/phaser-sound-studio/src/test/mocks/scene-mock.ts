import { type Scene } from "phaser";
import { vi } from "vitest";

export const factorySceneMock = (): Scene => {
    return {
        load: {
            audio: vi.fn(),
        }
    } as unknown as Scene;
};
