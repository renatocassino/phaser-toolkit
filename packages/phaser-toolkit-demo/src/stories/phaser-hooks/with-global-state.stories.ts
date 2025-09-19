/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';
import { PreviewScene, PreviewScene2 } from './with-global-state/simple-example';
import { defaultLightTheme, HUDINI_KEY, HudiniPlugin, HudiniPluginData } from 'hudini';
import { PreviewScene2OnChange, PreviewSceneOnChange } from './with-global-state/on-change-example';

const ID = 'phaser-hooks-game-with-global-state';

const meta: Meta = {
    title: 'Phaser Hooks/With Global State/Basic Example',
    parameters: {
        docs: {
            description: {
                component: 'Basic example using Phaser Hooks for global state management that persists across scenes',
            },
        },
    },
};
export default meta;

export const BasicExample: StoryObj = {
    render: (): HTMLElement => {
        const root = document.createElement('div');
        root.id = ID;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(1);
        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: ID,
            backgroundColor: '#2c3e50',
            scene: [PreviewScene, PreviewScene2],
            plugins: {
                global: [
                    {
                        key: HUDINI_KEY,
                        plugin: HudiniPlugin,
                        mapping: HUDINI_KEY,
                        start: true,
                        data: {
                            theme: defaultLightTheme,
                        } as HudiniPluginData,
                    }
                ]
            },
        });
        await nextFrames(1);
    },
};

export const ListenerOnChange: StoryObj = {
    render: (): HTMLElement => {
        const root = document.createElement('div');
        root.id = ID;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(1);
        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: ID,
            backgroundColor: '#2c3e50',
            scene: [PreviewSceneOnChange, PreviewScene2OnChange],
            plugins: {
                global: [
                    {
                        key: HUDINI_KEY,
                        plugin: HudiniPlugin,
                        mapping: HUDINI_KEY,
                        start: true,
                        data: {
                            theme: defaultLightTheme,
                        } as HudiniPluginData,
                    }
                ]
            },
        });
        await nextFrames(1);
    },
};