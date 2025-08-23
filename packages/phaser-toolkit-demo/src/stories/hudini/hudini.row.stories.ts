/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import {
    defaultLightTheme,
    HUDINI_KEY,
    HudiniPlugin,
    Row,
    SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { createContainer } from '../helpers/container';

type ElementWithPhaser = HTMLElement & {
    __phaserGame?: Phaser.Game;
    __phaserScene?: PreviewScene;
};

const usageSnippet = `
import { Row } from 'hudini';

const row = new Row({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        this.add.text(0, 0, 'Center', { fontSize: '20px' }),
        this.add.text(0, 0, 'Aligned', { fontSize: '20px' }),
        this.add.rectangle(0, 0, 50, 80, 0xff0000),
        this.add.rectangle(0, 0, 80, 50, 0x0000ff),
    ]
});

// Other methods:
// row.addChild(gameObject);
// row.addChildren([gameObject1, gameObject2]);
// row.setGap(24);
// row.setAlign('top');
`;

class PreviewScene extends SceneWithHudini {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const centerRow = new Row({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            gap: 16,
            align: 'center',
            children: [
                this.add.text(0, 0, 'Center', { fontSize: '20px' }).setOrigin(0.5, 0.5),
                this.add.text(0, 0, 'Aligned', { fontSize: '20px' }).setOrigin(0.5, 0.5),
                this.add.rectangle(0, 0, 50, 80, 0xff0000),
                this.add.rectangle(0, 0, 80, 50, 0x0000ff),
            ]
        });

        const topRow = new Row({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY - 200,
            gap: 16,
            align: 'top',
            children: [
                this.add.text(0, 0, 'Top', { fontSize: '24px' }),
                this.add.text(0, 0, 'Text', { fontSize: '20px' }),
                this.add.text(0, 0, 'Items', { fontSize: '20px' }),
                this.add.rectangle(0, 0, 100, 120, 0xff0000),
                this.add.rectangle(0, 0, 120, 100, 0x0000ff),
                this.add.rectangle(0, 0, 100, 80, 0x00ff00),
            ]
        });

        const bottomRow = new Row({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY + 200,
            gap: 16,
            align: 'bottom',
            children: [
                this.add.text(0, 0, 'Bottom', { fontSize: '24px' }),
                this.add.text(0, 0, 'Text', { fontSize: '20px' }),
                this.add.text(0, 0, 'Items', { fontSize: '20px' }),
                this.add.rectangle(0, 0, 100, 120, 0xff0000),
                this.add.rectangle(0, 0, 120, 100, 0x0000ff),
                this.add.rectangle(0, 0, 100, 80, 0x00ff00),
            ]
        });

        this.add.existing(centerRow);
        this.add.existing(topRow);
        this.add.existing(bottomRow);
    }
}

const meta: Meta = {
    title: 'Hudini/Components/Row',
    parameters: {
        docs: {
            description: {
                component: 'Row horizontally arranges children with configurable gap and vertical alignment.',
            },
        },
    },
};

export default meta;

type Story = StoryObj;

const createGame = (parent: HTMLElement): void => {
    const el = parent as ElementWithPhaser;
    if (el.__phaserGame) {
        el.__phaserGame.destroy(true);
    }

    el.__phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent,
        plugins: {
            global: [
                {
                    key: HUDINI_KEY,
                    plugin: HudiniPlugin,
                    mapping: HUDINI_KEY,
                    data: {
                        theme: defaultLightTheme,
                    },
                }
            ]
        },
        scene: [PreviewScene]
    });
};

export const Default: Story = {
    render: (): HTMLElement => {
        const container = createContainer('phaser-row-example');
        createGame(container);
        return container;
    }
};

Default.parameters = {
    docs: {
        source: {
            code: usageSnippet
        }
    }
};
