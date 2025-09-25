/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/html';
import {
    Column,
    defaultLightTheme,
    HUDINI_KEY,
    HudiniPlugin,
    HudiniPluginData,
    SceneWithHudini,
    SizedBox,
    TextButton,
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-sized-box-example';

const usageSnippet = `
import { Column, SizedBox, TextButton } from 'hudini';

const column = new Column({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 1',
            backgroundColor: 'red-500',
            textColor: 'white',
            borderRadius: 'lg',
            margin: '4',
            fontSize: 'lg',
        }),
        new SizedBox({
            scene: this,
            x: 0,
            y: 0,
            width: 0,
            height: 20, // Creates vertical spacing between buttons
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 2',
            backgroundColor: 'blue-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 3',
            backgroundColor: 'green-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 4',
            backgroundColor: 'yellow-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
    ]
});

// Other methods:
// sizedBox.setWidth(50);
// sizedBox.setHeight(30);
// sizedBox.setSize(100, 50);
`;

class PreviewScene extends SceneWithHudini {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const column = new Column({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            gap: 16,
            align: 'center',
            children: [
                new TextButton({
                    scene: this,
                    x: 0,
                    y: 0,
                    text: 'Button 1',
                    backgroundColor: 'red-500',
                    textColor: 'white',
                    borderRadius: 'lg',
                    margin: '4',
                    fontSize: 'lg',
                }),
                new SizedBox({
                    scene: this,
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 20, // Creates vertical spacing between buttons
                }),
                new TextButton({
                    scene: this,
                    x: 0,
                    y: 0,
                    text: 'Button 2',
                    backgroundColor: 'blue-500',
                    textColor: 'white',
                    fontSize: 'lg',
                }),
                new TextButton({
                    scene: this,
                    x: 0,
                    y: 0,
                    text: 'Button 3',
                    backgroundColor: 'green-500',
                    textColor: 'white',
                    fontSize: 'lg',
                }),
                new TextButton({
                    scene: this,
                    x: 0,
                    y: 0,
                    text: 'Button 4',
                    backgroundColor: 'yellow-500',
                    textColor: 'white',
                    fontSize: 'lg',
                }),
            ]
        });

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'Notice the spacing using SizedBox', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        this.add.existing(column);
    }
}

const meta: Meta = {
    title: 'Hudini/Components/SizedBox',
    parameters: {
        docs: {
            description: {
                component: 'SizedBox is a simple invisible rectangle component that can be used for spacing and layout purposes. It has no visual appearance but occupies space.',
            },
        },
    },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
    render: () => {
        const root = document.createElement('div');
        root.id = 'phaser-sized-box-example';
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(3);
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
    docs: {
        autoplay: true,
        story: { inline: false },
        source: {
            code: usageSnippet
        }
    }
};