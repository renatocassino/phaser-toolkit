/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/html';
import {
    Card,
    Column,
    defaultLightTheme,
    FlatIconButton,
    HUDINI_KEY,
    HudiniPlugin,
    HudiniPluginData,
    Row,
    SceneWithHudini,
    SizedBox,
    TextButton,
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-modal-example';

const usageSnippet = `
import { Card, Column, Row, TextButton, FlatIconButton, SizedBox } from 'hudini';

// Create a modal card with settings
const modalCard = new Card({
    scene: this,
    x: centerX,
    y: centerY,
    backgroundColor: 'slate-800',
    borderRadius: 'md',
    width: Math.min(width * 0.8, 600),
    child: new Column({
        scene: this,
        x: 0,
        y: 0,
        children: [
            // Audio settings rows
            ...['music', 'ambient', 'fx'].map((channel: string) => 
                buildAudioControlRow(channel)
            ),
            // Action buttons
            new Row({
                scene: this,
                x: 0,
                y: 0,
                children: [
                    new TextButton({
                        scene: this,
                        x: 0,
                        y: 0,
                        text: 'Play again',
                        backgroundColor: 'blue-600',
                        fontSize: '2xl',
                        onClick: () => console.log('Play again clicked'),
                    }),
                    new TextButton({
                        scene: this,
                        x: 0,
                        y: 0,
                        text: 'Back to Main Menu',
                        backgroundColor: 'blue-600',
                        fontSize: '2xl',
                        onClick: () => console.log('Back to menu clicked'),
                    }),
                ],
                gap: 20,
            })
        ],
        gap: 20,
    })
});

// Close button positioned outside the card
const closeButton = new FlatIconButton({
    scene: this,
    x: centerX + Math.min(width * 0.4, 300),
    y: centerY - 240,
    icon: 'xmark',
    size: 'xl',
    onClick: () => console.log('Close modal'),
});
`;

class PreviewScene extends SceneWithHudini {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        const { width, centerY, centerX } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create audio control rows
        const audioControls = ['music', 'ambient', 'fx'].map((channel: string) => 
            this.buildAudioControlRow(channel)
        );

        // Create action buttons
        const restartButton = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Play again',
            backgroundColor: 'blue-600',
            fontSize: '2xl',
            font: 'monospace',
            onClick: (): void => {
                console.log('Play again clicked');
            },
        });

        const backToMainMenuButton = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Back to Main Menu',
            backgroundColor: 'blue-600',
            fontSize: '2xl',
            font: 'monospace',
            onClick: (): void => {
                console.log('Back to Main Menu clicked');
            },
        });

        // Create the main modal card
        const modalCard = new Card({
            scene: this,
            x: centerX,
            y: centerY,
            backgroundColor: 'slate-800',
            borderRadius: 'md',
            // width: Math.min(width * 0.8, 600),
            child: new Column({
                scene: this,
                x: 0,
                y: 0,
                children: [
                    ...audioControls,
                    new SizedBox({
                        scene: this,
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 10, // Extra spacing before buttons
                    }),
                    new Row({
                        scene: this,
                        x: 0,
                        y: 0,
                        children: [
                            restartButton,
                            backToMainMenuButton,
                        ],
                        gap: 20,
                    })
                ],
                gap: 20,
            })
        });

        // Create close button positioned outside the card
        const closeButton = new FlatIconButton({
            scene: this,
            x: centerX + Math.min(width * 0.4, 300),
            y: centerY - 240,
            icon: 'xmark',
            size: 'xl',
            onClick: (): void => {
                console.log('Close modal clicked');
            },
        });

        // Add all elements to the scene
        this.add.existing(modalCard);
        this.add.existing(closeButton);
    }

    buildAudioControlRow(channel: string): Column {
        const topLabel = this.add.text(0, 0, channel.toUpperCase(), {
            fontSize: 24,
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
        });

        const volumeLabel = this.add.text(0, 0, '5', {
            fontSize: 24,
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
        });

        const lessButton = new FlatIconButton({
            scene: this,
            x: 0,
            y: 0,
            icon: 'minus',
            size: 24,
            onClick: (): void => {
                console.log(`Decrease ${channel} volume`);
                volumeLabel.text = Math.max(0, parseInt(volumeLabel.text as string) - 1).toString();
            },
        });

        const plusButton = new FlatIconButton({
            scene: this,
            x: 0,
            y: 0,
            icon: 'plus',
            size: 24,
            onClick: (): void => {
                console.log(`Increase ${channel} volume`);
                volumeLabel.text = Math.min(10, parseInt(volumeLabel.text as string) + 1).toString();
            },
        });

        // @ts-ignore
        plusButton.here = 'AQUI';

        return new Column({
            scene: this,
            x: 0,
            y: 0,
            align: 'center',
            gap: 8,
            children: [
                topLabel,
                new Row({
                    scene: this,
                    x: 0,
                    y: 0,
                    children: [
                        lessButton,
                        volumeLabel,
                        plusButton,
                    ],
                    gap: 10,
                })
            ],
        });
    }
}

const meta: Meta = {
    title: 'Hudini/Advanced/Card Usage Modal',
    parameters: {
        docs: {
            description: {
                component: 'Advanced example showing a modal card with audio controls and action buttons, demonstrating complex layout composition.',
            },
        },
    },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
    render: () => {
        const root = document.createElement('div');
        root.id = 'phaser-modal-example';
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