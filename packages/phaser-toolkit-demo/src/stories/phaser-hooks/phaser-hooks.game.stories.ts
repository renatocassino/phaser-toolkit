/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import { BaseThemeConfig, SceneWithHudini } from 'hudini';
import { withGlobalState, withLocalState, withPersistentState } from 'phaser-hooks';
import { Color, FontSize } from 'phaser-wind';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-hooks-game';
const ID_SESSION = 'phaser-hooks-session';
const ID_LOCAL = 'phaser-hooks-local';

export class PreviewScene extends SceneWithHudini<BaseThemeConfig> {
    constructor() {
        super('PreviewScene');
    }

    preload(): void { }

    create(): void {
        const state = withLocalState(this, 'localState', 'Local state defined in preview 1');
        state.set('Local state defined in preview 1');

        const globalState = withGlobalState(this, 'globalState', 'Global state defined in preview 1');
        globalState.set('Global state defined in preview 1');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 1', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        // Display local state
        this.add
            .text(centerX, centerY - 100, `Local State: ${state.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Display global state
        this.add
            .text(centerX, centerY - 60, `Global State: ${globalState.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
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
        const state = withLocalState(this, 'localState');
        const globalState = withGlobalState(this, 'globalState');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 2', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        // Display local state (will show undefined as it's not shared between scenes)
        this.add
            .text(centerX, centerY - 100, `Local State: ${state.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Display global state (will show the value from preview 1)
        this.add
            .text(centerX, centerY - 60, `Global State: ${globalState.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Explanation about local and global state behavior
        this.add
            .text(
                centerX,
                centerY + 20,
                'Note that in this scene, the localState did not bring the value from the other scene,\nbut the globalState did share the value between scenes.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);
    }
}

export class SessionStorageScene extends SceneWithHudini<BaseThemeConfig> {
    constructor() {
        super('SessionStorageScene');
    }

    preload(): void { }

    create(): void {
        const counter = withPersistentState(this, 'sessionCounter', 0, undefined, 'session');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'SessionStorage Counter', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        // Minus button
        const minusButton = this.add.text(centerX - 100, centerY, '-', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('4xl'),
            backgroundColor: '#DC2626',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        minusButton.on('pointerdown', () => {
            counter.set(counter.get() - 1);
        });

        // Plus button
        const plusButton = this.add.text(centerX + 100, centerY, '+', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('4xl'),
            backgroundColor: '#059669',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        plusButton.on('pointerdown', () => {
            counter.set(counter.get() + 1);
        });

        // Update counter display when value changes
        counter.onChange((newValue: number) => {
            const counterText = this.children.getByName('counterText') as Phaser.GameObjects.Text;
            if (counterText) {
                counterText.setText(`Counter: ${newValue}`);
            }
        });

        // Store reference to counter text for updates
        const counterText = this.add
            .text(centerX, centerY - 100, `Counter: ${counter.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('3xl'),
            })
            .setOrigin(0.5, 0.5);
        counterText.setName('counterText');

        // Explanation text
        this.add
            .text(
                centerX,
                centerY + 80,
                'This counter uses sessionStorage.\nThe value persists during the browser session but is lost when the tab is closed.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);
    }
}

export class LocalStorageScene extends SceneWithHudini<BaseThemeConfig> {
    constructor() {
        super('LocalStorageScene');
    }

    preload(): void { }

    create(): void {
        const counter = withPersistentState(this, 'localCounter', 0, undefined, 'local');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'LocalStorage Counter', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        // Minus button
        const minusButton = this.add.text(centerX - 100, centerY, '-', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('4xl'),
            backgroundColor: '#DC2626',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        minusButton.on('pointerdown', () => {
            counter.set(counter.get() - 1);
        });

        // Plus button
        const plusButton = this.add.text(centerX + 100, centerY, '+', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('4xl'),
            backgroundColor: '#059669',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        plusButton.on('pointerdown', () => {
            counter.set(counter.get() + 1);
        });

        // Update counter display when value changes
        counter.onChange((newValue: number) => {
            const counterText = this.children.getByName('counterText') as Phaser.GameObjects.Text;
            if (counterText) {
                counterText.setText(`Counter: ${newValue}`);
            }
        });

        // Store reference to counter text for updates
        const counterText = this.add
            .text(centerX, centerY - 100, `Counter: ${counter.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('3xl'),
            })
            .setOrigin(0.5, 0.5);
        counterText.setName('counterText');

        // Explanation text
        this.add
            .text(
                centerX,
                centerY + 80,
                'This counter uses localStorage.\nThe value persists even after closing the browser and will survive page refreshes.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);
    }
}

const meta: Meta = {
    title: 'Phaser Hooks/Examples',
    parameters: {
        docs: {
            description: {
                component: 'Examples using Phaser Hooks for state management',
            },
        },
    },
};
export default meta;

export const LocalStateVsGlobalState: StoryObj = {
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

export const SessionStorageExample: StoryObj = {
    render: (): HTMLElement => {
        const root = document.createElement('div');
        root.id = ID_SESSION;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(1);
        createGame(ID_SESSION, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: ID_SESSION,
            backgroundColor: '#2c3e50',
            scene: [SessionStorageScene],
        });
        await nextFrames(1);
    },
};

export const LocalStorageExample: StoryObj = {
    render: (): HTMLElement => {
        const root = document.createElement('div');
        root.id = ID_LOCAL;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(1);
        createGame(ID_LOCAL, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: ID_LOCAL,
            backgroundColor: '#2c3e50',
            scene: [LocalStorageScene],
        });
        await nextFrames(1);
    },
};
