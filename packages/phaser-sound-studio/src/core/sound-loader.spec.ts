/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it, vi } from 'vitest';

import { audioConfig, type GameChannels, type GameSounds } from '../test/fake-config';
import { factoryPluginBase } from '../test/mocks/base-plugin-mock';
import { factoryGameMock } from '../test/mocks/game-mock';
import { factorySceneMock } from '../test/mocks/scene-mock';

import { SoundLoader } from './sound-loader';

describe('SoundLoader', () => {
    it('should be defined', () => {
        expect(SoundLoader).toBeDefined();
    });

    describe('loadBySoundKey', () => {
        it('typecheck error', () => {
            const gameMock = factoryGameMock();
            const basePlugin = factoryPluginBase({ game: gameMock });
            const scene = factorySceneMock();
            const soundLoaderPlugin = new SoundLoader<GameSounds, GameChannels>(basePlugin);

            // @ts-check
            soundLoaderPlugin.loadBySoundKey(scene, 'button-hover');

            // @ts-check
            soundLoaderPlugin.loadBySoundKey(scene, 'bg-music');

            // @ts-check
            soundLoaderPlugin.loadBySoundKey(scene, 'jump-sfx');

            // @ts-expect-error invalid key
            soundLoaderPlugin.loadBySoundKey(scene, 'invalid-key');
        });

        it('should load the sound by sound key when the sound is not loaded', () => {
            const gameMock = factoryGameMock();
            gameMock.cache.audio.has = vi.fn().mockReturnValue(false);

            const plugin = factoryPluginBase({ game: gameMock });
            const scene = factorySceneMock();

            const soundLoaderPlugin = new SoundLoader<GameSounds, GameChannels>(plugin);
            soundLoaderPlugin.loadBySoundKey(scene, 'button-hover');

            expect(scene.load.audio).toHaveBeenCalledWith('button-hover', audioConfig.soundList['button-hover'].path);
            expect(gameMock.cache.audio.has).toHaveBeenCalledWith('button-hover');
        });

        it('should not load the sound by sound key when the sound is already loaded', () => {
            const gameMock = factoryGameMock();
            gameMock.cache.audio.has = vi.fn().mockReturnValue(true);

            const plugin = factoryPluginBase({ game: gameMock });
            const scene = factorySceneMock();

            const soundLoaderPlugin = new SoundLoader<GameSounds, GameChannels>(plugin);
            soundLoaderPlugin.loadBySoundKey(scene, 'button-hover');

            expect(gameMock.cache.audio.has).toHaveBeenCalledWith('button-hover');
            expect(scene.load.audio).not.toHaveBeenCalled();
        });
    });
});
