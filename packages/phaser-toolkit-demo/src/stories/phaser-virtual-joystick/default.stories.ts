/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import { Color, FontSize } from 'phaser-wind';
import { VirtualJoystick } from 'phaser-virtual-joystick';
import Phaser from 'phaser';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-virtual-joystick-default';

const usageSnippet = `
import { VirtualJoystick } from 'phaser-virtual-joystick';

class GameScene extends Phaser.Scene {
    create() {
        // Create a virtual joystick with default settings
        const joystick = new VirtualJoystick({
            scene: this
        });

        // Listen to joystick events
        joystick.on('move', (data) => {
            console.log(\`Joystick position: \${data.x}, \${data.y}\`);
        });

        joystick.on('press', () => {
            console.log('Joystick pressed');
        });

        joystick.on('release', () => {
            console.log('Joystick released');
        });
    }
}
`;

class PreviewScene extends Phaser.Scene {
    private joystick?: VirtualJoystick;
    private positionText?: Phaser.GameObjects.Text;
    private eventText?: Phaser.GameObjects.Text;
    private character?: Phaser.GameObjects.Arc;
    private axesPosition: { x: number; y: number } = { x: 0, y: 0 };

    constructor() {
        super('preview');
    }

    preload(): void { }

    create(): void {
        this.cameras.main.setBackgroundColor(Color.rgb('slate-900'));

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Title
        this.add
            .text(centerX, 80, 'Phaser Virtual Joystick', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('4xl'),
            })
            .setOrigin(0.5, 0.5);

        // Instructions
        this.add
            .text(centerX, 140, 'Touch and drag in the left half of the screen to use the joystick', {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
                wordWrap: { width: 600 },
            })
            .setOrigin(0.5, 0.5);

        // Position display
        this.positionText = this.add
            .text(centerX, centerY - 100, 'Position: (0, 0)', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('2xl'),
            })
            .setOrigin(0.5, 0.5);

        // Event display
        this.eventText = this.add
            .text(centerX, centerY - 50, 'Status: Ready', {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Create a character to move with the joystick
        const character = this.add.circle(centerX + 200, centerY, 20, 0x4F46E5, 1);
        this.character = character;
        character.setStrokeStyle(2, 0x312E81);

        // Create joystick only on touch devices
        if (this.sys.game.device.input.touch) {
            this.joystick = new VirtualJoystick({
                scene: this,
                bounds: {
                    topLeft: { x: 0, y: 40 },
                    bottomRight: { x: this.cameras.main.width / 2, y: this.cameras.main.height },
                },
                stickIcon: this.add.text(0, 0, '🎮', {
                    fontSize: '24px',
                    color: '#ffffff'
                }),
                enableWithoutTouch: true,
            });
            this.add.existing(this.joystick);

            // Listen to joystick events
            this.joystick.on('move', (data) => {
                this.axesPosition = { x: data.x, y: data.y };
                if (this.positionText) {
                    this.positionText.setText(`Position: (${data.x.toFixed(2)}, ${data.y.toFixed(2)})`);
                }
            });

            this.joystick.on('press', () => {
                this.axesPosition = { x: 0, y: 0 };
                if (this.eventText) {
                    this.eventText.setText('Status: Joystick Pressed');
                    this.eventText.setColor(Color.rgb('green-400'));
                }
            });

            this.joystick.on('release', () => {
                this.axesPosition = { x: 0, y: 0 };
                if (this.eventText) {
                    this.eventText.setText('Status: Joystick Released');
                    this.eventText.setColor(Color.rgb('red-400'));
                }
            });
        } else {
            // Show message for non-touch devices
            this.add
                .text(centerX, centerY, 'This demo requires a touch device to work properly', {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 500 },
                })
                .setOrigin(0.5, 0.5);
        }

        // Add some visual elements to show the joystick area
        const joystickArea = this.add.rectangle(
            this.cameras.main.width / 4,
            this.cameras.main.height / 2,
            this.cameras.main.width / 2,
            this.cameras.main.height,
            0x1E293B,
            0.1
        );
        joystickArea.setStrokeStyle(2, 0x475569, 0.3);

        // Add label for joystick area
        this.add
            .text(this.cameras.main.width / 4, 50, 'Joystick Area', {
                color: Color.rgb('slate-400'),
                align: 'center',
                fontSize: FontSize.px('sm'),
            })
            .setOrigin(0.5, 0.5);

        // Add label for character area
        this.add
            .text(centerX + 200, 50, 'Character (moves with joystick)', {
                color: Color.rgb('slate-400'),
                align: 'center',
                fontSize: FontSize.px('sm'),
            })
            .setOrigin(0.5, 0.5);
    }

    override update(): void {
        this.joystick?.update();
        const speed = 1.1;
        if (this.axesPosition.x !== 0 || this.axesPosition.y !== 0) {
            this.character?.setPosition(this.character.x + this.axesPosition.x * speed, this.character.y + this.axesPosition.y * speed);
        }
    }

    destroy(): void {
        if (this.joystick) {
            this.joystick.destroy();
        }
    }
}

const meta: Meta = {
    title: 'Phaser Virtual Joystick/Examples/Default',
    parameters: {
        docs: {
            description: {
                component: 'Basic example showing the default behavior of the Virtual Joystick component.',
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
            backgroundColor: Color.rgb('slate-900'),
            parent: document.getElementById(ID) as HTMLElement,
            scene: [PreviewScene],
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
