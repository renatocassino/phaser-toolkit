/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import {
    Column,
    defaultLightTheme,
    HUDINI_KEY,
    HudiniPlugin,
    HudiniPluginData,
    SceneWithHudini,
    Spacing,
} from 'hudini';
import Phaser from 'phaser';

import { createGame } from '../helpers/create-game';

const ID = 'phaser-column-example';

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

class PreviewScene extends SceneWithHudini {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const centerColumn = new Column({
            scene: this,
            x: this.cameras.main.centerX,
            y: Spacing.px('4'),
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

        const leftColumn = new Column({
            scene: this,
            x: this.cameras.main.centerX - 300,
            y: Spacing.px('4'),
            gap: 16,
            align: 'left',
            children: [
                this.add.text(0, 0, 'Left', { fontSize: '24px' }),
                this.add.text(0, 0, 'Text', { fontSize: '20px' }),
                this.add.text(0, 0, 'Items', { fontSize: '20px' }),
                this.add.rectangle(0, 0, 100, 120, 0xff0000),
                this.add.rectangle(0, 0, 120, 100, 0x0000ff),
                this.add.rectangle(0, 0, 100, 80, 0x00ff00),
            ]
        });

        const rightColumn = new Column({
            scene: this,
            x: this.cameras.main.centerX + 300,
            y: Spacing.px('4'),
            gap: 16,
            align: 'right',
            children: [
                this.add.text(0, 0, 'Right Aligned', { fontSize: '24px' }),
                this.add.text(0, 0, 'Text', { fontSize: '20px' }),
                this.add.text(0, 0, 'Items', { fontSize: '20px' }),
                this.add.rectangle(0, 0, 100, 120, 0xff0000),
                this.add.rectangle(0, 0, 120, 100, 0x0000ff),
                this.add.rectangle(0, 0, 100, 80, 0x00ff00),
            ]
        });

        this.add.existing(centerColumn);
        this.add.existing(leftColumn);
        this.add.existing(rightColumn);
    }
}

const meta: Meta = {
    title: 'Hudini/Components/Column',
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

const ensureGameOnce = (root: HTMLElement): Phaser.Game => {
    const g = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: root,
        plugins: {
            global: [
                {
                    key: HUDINI_KEY,
                    plugin: HudiniPlugin,
                    mapping: HUDINI_KEY,
                    data: {
                        theme: defaultLightTheme,
                    } as HudiniPluginData,
                }
            ]
        },
        scene: [PreviewScene]
    });

    // @ts-expect-error Storybook will call this on unmount if present
    window.__GAME = g;

    return g;
}

export const Default: Story = {
    render: () => {
        const root = document.createElement('div');
        root.id = 'phaser-column-example';
        return root;
    },
    play: async (): Promise<void> => {
        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: document.getElementById(ID) as HTMLElement,
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
            scene: [PreviewScene]
        });
    }
};

Default.parameters = {
    forceRemount: true,
    docs: {
        autoplay: true,
        story: { inline: false },
        source: {
            code: usageSnippet
        }
    }
};
