/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import { BaseThemeConfig, SceneWithHudini } from 'hudini';
import { withGlobalState, withLocalState } from 'phaser-hooks';
import { Color, FontSize } from 'phaser-wind';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-hooks-game';

export class PreviewScene extends SceneWithHudini<BaseThemeConfig> {
    constructor() {
        super('PreviewScene');
    }

    preload(): void { }

    create(): void {
        const state = withLocalState(this, 'test', 'test');
        state.set('Local state definido na preview 1');

        const globalState = withGlobalState(this, 'test', 'Global state definido na preview 1');
        globalState.set('Global state definido na preview 1');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        const button = this.add.text(centerX, centerY, 'Go to Scene 2', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('2xl'),
            backgroundColor: '#4A5568',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerdown', () => {
            this.scene.start('PreviewScene2');
        });

    }
}


export class PreviewScene2 extends SceneWithHudini<BaseThemeConfig> {
    constructor() {
        super('PreviewScene2');
    }

    preload(): void { }

    create(): void {

        const state = withLocalState(this, 'test', 'test');
        console.log(state.get(), '<<<<< preview 2');

        const globalState = withGlobalState(this, 'test', 'Global state definido na preview 2');
        console.log(globalState.get(), '<<<<< preview 2');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);
    }
}

const meta: Meta = {
    title: 'Phaser Hooks/Game Example',
    parameters: {
        docs: {
            description: {
                component: 'A basic game example using Phaser Hooks for state management',
            },
        },
    },
};
export default meta;

export const GameExample: StoryObj = {
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
        });
        await nextFrames(1);
    },
};
