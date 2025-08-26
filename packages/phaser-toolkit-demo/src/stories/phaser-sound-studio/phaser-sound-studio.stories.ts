/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import {
    defaultLightTheme,
    HUDINI_KEY,
    HudiniPlugin,
    HudiniPluginData,
    SceneWithHudini,
    TextButton
} from 'hudini';
import Phaser from 'phaser';
import { PHASER_SOUND_STUDIO_KEY, PhaserSoundStudioPlugin, PhaserSoundStudioPluginData, SoundListConfig } from 'phaser-sound-studio';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-sound-studio-example';

const usageSnippet = `
import { Column } from 'hudini';

const column = new Column({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        this.add.text(0, 0, 'Center Aligned', { fontSize: '24px' }),
        this.add.text(0, 0, 'Multiple', { fontSize: '20px' }),
        this.add.text(0, 0, 'Text Items', { fontSize: '20px' }),
        this.add.rectangle(0, 0, 100, 120, 0xff0000),
        this.add.rectangle(0, 0, 120, 100, 0x0000ff),
        this.add.rectangle(0, 0, 100, 80, 0x00ff00),
    ]
});

// Other methods:
// column.addChild(gameObject);
// column.addChildren([gameObject1, gameObject2]);
// column.setGap(24);
// column.setAlign('left');
`;


enum SountKeys {
    MOUSE_HOVER = 'mouse-hover',
    MOUSE_CLICK = 'mouse-click',
}

const soundKeys: SoundListConfig = {
    [SountKeys.MOUSE_HOVER]: {
        channel: 'hud',
        volume: 1,
        loop: false,
        preload: true,
        path: '/sounds/ui-pop.m4a'
    },
    [SountKeys.MOUSE_CLICK]: {
        channel: 'hud',
        volume: 1,
        loop: false,
        preload: true,
        path: '/sounds/click.mp3'
    }
}

class PreviewScene extends SceneWithHudini {
    constructor() {
        super('preview');
    }

    preload(): void {
        (this.plugins.get(PHASER_SOUND_STUDIO_KEY) as PhaserSoundStudioPlugin).loadAll(this);
    }

    create(): void {
        this.cameras.main.setBackgroundColor(this.pw.color.rgb('slate-900'));

        const button = new TextButton({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            backgroundColor: 'blue-500',
            textColor: 'white',
            text: 'Click me',
            onClick: (): void => {
                (this.plugins.get(PHASER_SOUND_STUDIO_KEY) as PhaserSoundStudioPlugin).play(this, SountKeys.MOUSE_CLICK);
            }
        });

        this.add.existing(button);
    }
}

const meta: Meta = {
    title: 'Phaser Sound Studio/Components/Play Sound',
    parameters: {
        docs: {
            description: {
                component: 'Column is a layout container that stacks children vertically with configurable gap and alignment.',
            },
        },
    },
};

export default meta;

type Story = StoryObj;


export const Default: Story = {
    render: () => {
        const root = document.createElement('div');
        root.id = ID;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(3);
        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: '#F00',
            parent: document.getElementById(ID) as HTMLElement,
            scene: [PreviewScene],
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
                    },
                    {
                        key: PHASER_SOUND_STUDIO_KEY,
                        plugin: PhaserSoundStudioPlugin,
                        mapping: PHASER_SOUND_STUDIO_KEY,
                        start: true,
                        data: {
                            soundList: soundKeys,
                            channels: ['hud'],
                        } as PhaserSoundStudioPluginData,
                    }
                ]
            },
        });
    }
};

Default.parameters = {
    docs: {
        autoplay: true,
        story: { inline: false },
        source: {
            code: usageSnippet
        }
    }
};
