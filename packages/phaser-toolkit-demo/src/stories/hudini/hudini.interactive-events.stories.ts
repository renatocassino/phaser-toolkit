/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { Args, Meta, StoryObj } from '@storybook/html';
import { loadFont } from 'font-awesome-for-phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    IconButton,
    SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-interactive-events';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    IconButton,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({});
type Theme = typeof theme;

class InteractiveEventsScene extends SceneWithHudini<Theme> {
    private button?: IconButton;
    private statusSquare?: Phaser.GameObjects.Rectangle;
    private statusText?: Phaser.GameObjects.Text;

    constructor() {
        super('interactive-events');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create status square
        this.statusSquare = this.add.rectangle(400, 200, 60, 60, 0x666666);
        
        // Create status text
        this.statusText = this.add.text(500, 200, 'Ready', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Create button
        this.button = new IconButton({
            scene: this,
            x: 400,
            y: 100,
            icon: 'play',
            size: 'xl',
            color: 'blue',
            onClick: () => {
                this.updateStatus('onClick', 0x00ff00);
            },
        });

        this.add.existing(this.button);

        // Use interactive API for advanced event handling
        // Wait for next frame to ensure button is fully initialized
        this.time.delayedCall(0, () => {
            if (this.button) {
                this.button.interactive.on('pointerover', () => {
                    this.updateStatus('pointerover', 0xffff00);
                });

                this.button.interactive.on('pointerout', () => {
                    this.updateStatus('pointerout', 0x666666);
                });

                this.button.interactive.on('pointerdown', () => {
                    this.updateStatus('pointerdown', 0xff0000);
                });

                this.button.interactive.on('pointerup', () => {
                    this.updateStatus('pointerup', 0x00ff00);
                });
            }
        });
    }

    private updateStatus(event: string, color: number): void {
        if (this.statusSquare) {
            this.statusSquare.setFillStyle(color);
        }
        if (this.statusText) {
            this.statusText.setText(event);
        }
    }
}
`;

const meta: Meta = {
    title: 'Hudini/Components/Interactive Events',
    parameters: {
        docs: {
            description: {
                component: 'Demonstrates the interactive API of IconButton and FlatIconButton components. The square below changes color and the text shows the current event state when interacting with the button.',
            },
            source: {
                language: 'ts',
                code: usageSnippet,
            },
        },
    },
};

export default meta;

const theme = createTheme({});
type Theme = typeof theme;

class InteractiveEventsScene extends SceneWithHudini<Theme> {
    private button?: IconButton;
    private statusSquare?: Phaser.GameObjects.Rectangle;
    private statusText?: Phaser.GameObjects.Text;

    constructor() {
        super('interactive-events');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create status square
        this.statusSquare = this.add.rectangle(400, 200, 60, 60, 0x666666);
        
        // Create status text
        this.statusText = this.add.text(500, 200, 'Ready', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Create button
        this.button = new IconButton({
            scene: this,
            x: 400,
            y: 100,
            icon: 'play',
            size: 'xl',
            color: 'blue',
            onClick: () => {
                this.updateStatus('onClick', 0x00ff00);
            },
        });

        this.add.existing(this.button);

        this.button.interactive.on('pointerover', () => {
            this.updateStatus('pointerover', 0xffff00);
        });

        this.button.interactive.on('pointerout', () => {
            this.updateStatus('pointerout', 0x666666);
        });

        this.button.interactive.on('pointerdown', () => {
            this.updateStatus('pointerdown', 0xff0000);
        });

        this.button.interactive.on('pointerup', () => {
            this.updateStatus('pointerup', 0x00ff00);
        });

        // Add legend
        this.add.text(50, 300, 'Interactive Events Demo', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        this.add.text(50, 330, '• Yellow: pointerover (hover)', {
            fontSize: '14px',
            color: '#ffff00',
            fontFamily: 'Arial'
        });

        this.add.text(50, 350, '• Red: pointerdown (press)', {
            fontSize: '14px',
            color: '#ff0000',
            fontFamily: 'Arial'
        });

        this.add.text(50, 370, '• Green: pointerup/onClick (release)', {
            fontSize: '14px',
            color: '#00ff00',
            fontFamily: 'Arial'
        });

        this.add.text(50, 390, '• Gray: pointerout (leave)', {
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Arial'
        });

        this.add.text(50, 420, 'The interactive API provides direct access to the underlying sprite\'s event methods:', {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'Arial'
        });

        this.add.text(50, 440, 'button.interactive.on(event, callback)', {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'Arial'
        });

        this.add.text(50, 460, 'button.interactive.off(event, callback)', {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'Arial'
        });

        this.add.text(50, 480, 'button.interactive.once(event, callback)', {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'Arial'
        });
    }

    private updateStatus(event: string, color: number): void {
        if (this.statusSquare) {
            this.statusSquare.setFillStyle(color);
        }
        if (this.statusText) {
            this.statusText.setText(event);
        }
    }
}

const ensureFontOnce = async (): Promise<void> => {
    const w = window as unknown as Record<string, unknown>;
    if (!w['__fontLoaded']) {
        await loadFont();
        w['__fontLoaded'] = true;
    }
};

export const InteractiveEventsExample: StoryObj = {
    render: (): HTMLElement => {
        const root = document.getElementById(ID) ?? document.createElement('div');
        root.id = ID;
        return root;
    },
    play: async (): Promise<void> => {
        cleanGames();
        await ensureFontOnce();
        await nextFrames(3);

        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: Color.slate(900),
            parent: document.getElementById(ID) as HTMLElement,
            scene: [InteractiveEventsScene],
            plugins: {
                global: [
                    {
                        key: HUDINI_KEY,
                        plugin: HudiniPlugin,
                        mapping: HUDINI_KEY,
                        data: {
                            theme,
                        },
                    },
                ],
            },
        });
    },
};