/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import { fontIcons, IconKey, loadFont } from 'font-awesome-for-phaser';
import {
    CircularProgress,
    Color,
    ColorKey,
    ColorToken,
    createTheme,
    FontSizeKey,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

type ApplyProps = {
    icon: IconKey;
    color: ColorKey;
    size: FontSizeKey | number;
    rotationsPerSecond: number;
    isSpinning: boolean;
};

const sizeTokens = [
    'xs',
    'sm',
    'base',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    '7xl',
    '8xl',
    '9xl'
] as const;

const colorTokens: ColorToken[] = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
].flatMap(c => [100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(s => `${c}-${s}` as ColorToken));

const ID = 'hudini-circular-progress';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    CircularProgress,
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progress?: CircularProgress;
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic usage
        this.progress = new CircularProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            icon: 'spinner',
            color: 'blue',
            size: 'xl',
            rotationsPerSecond: 2,
        });
        this.add.existing(this.progress);

        // Multiple examples with different configurations
        const examples = [
            { x: 150, y: 100, icon: 'spinner', color: 'blue', size: 'md', speed: 2 },
            { x: 300, y: 100, icon: 'gear', color: 'red', size: 'lg', speed: 1 },
            { x: 450, y: 100, icon: 'rotate', color: 'green', size: 'xl', speed: 3 },
            { x: 150, y: 250, icon: 'arrows-rotate', color: 'purple', size: '2xl', speed: 0.5 },
        ];

        examples.forEach(({ x, y, icon, color, size, speed }) => {
            const progress = new CircularProgress({
                scene: this,
                x,
                y,
                icon: icon as IconKey,
                color: color as ColorKey,
                size: size as FontSizeKey,
                rotationsPerSecond: speed,
            });
            this.add.existing(progress);
        });
    }
}
`;

const meta: Meta = {
    title: 'Hudini/Components/CircularProgress',
    parameters: {
        docs: {
            description: {
                component: 'A customizable circular progress indicator with rotating Font Awesome icons and Phaser Wind color tokens.',
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

class PreviewScene extends SceneWithHudini<Theme> {
    private progress?: CircularProgress;
    private multipleProgress: CircularProgress[] = [];

    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Main interactive progress
        this.progress = new CircularProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            icon: 'spinner',
            color: 'blue',
            size: 'xl',
            rotationsPerSecond: 2,
        });
        this.add.existing(this.progress);

        // Label for main progress
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Interactive CircularProgress', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Multiple examples showcase
        this.createShowcaseExamples();

        // Listen for property updates
        this.events.on('props:update', (props: ApplyProps) => this.applyProps(props));
    }

    private createShowcaseExamples(): void {
        const examples = [
            { x: 120, y: 80, icon: 'spinner', color: 'blue', size: 'sm', speed: 2, label: 'Default Spinner' },
            { x: 280, y: 80, icon: 'gear', color: 'red', size: 'md', speed: 1, label: 'Slow Gear' },
            { x: 440, y: 80, icon: 'rotate', color: 'green', size: 'lg', speed: 3, label: 'Fast Rotate' },
            { x: 120, y: 320, icon: 'arrows-rotate', color: 'purple', size: 'xl', speed: 0.5, label: 'Very Slow' },
            { x: 280, y: 320, icon: 'spinner', color: 'yellow', size: '2xl', speed: 4, label: 'Very Fast' },
            { x: 440, y: 320, icon: 'gear', color: 'pink', size: 'lg', speed: 1.5, label: 'Medium Speed' },
        ];

        examples.forEach(({ x, y, icon, color, size, speed, label }) => {
            const progress = new CircularProgress({
                scene: this,
                x,
                y,
                icon: icon as IconKey,
                color: color as ColorKey,
                size: size as FontSizeKey,
                rotationsPerSecond: speed,
            });
            this.add.existing(progress);
            this.multipleProgress.push(progress);

            // Add label
            this.add.text(x, y + 40, label, {
                fontSize: '12px',
                color: '#cccccc',
                fontFamily: 'Arial',
            }).setOrigin(0.5);
        });

        // Add title for showcase
        this.add.text(this.cameras.main.centerX, 30, 'CircularProgress Showcase', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
    }

    private applyProps(props: ApplyProps): void {
        if (!this.progress) return;

        this.progress.setIcon(props.icon);
        this.progress.setColor(props.color);
        this.progress.setSize(props.size);
        this.progress.setRotationsPerSecond(props.rotationsPerSecond);

        if (props.isSpinning && !this.progress.spinning) {
            this.progress.start();
        } else if (!props.isSpinning && this.progress.spinning) {
            this.progress.stop();
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

export const CircularProgressExample: StoryObj<{
    icon: IconKey;
    color: ColorKey;
    size: FontSizeKey | number;
    rotationsPerSecond: number;
    isSpinning: boolean;
}> = {
    render: (args: Args): HTMLElement => {
        const root = document.getElementById(ID) ?? document.createElement('div');
        root.id = ID;

        const apply = (): void => {
            const game = getGame(ID);
            if (!game) return;
            const scene = game.scene.getScene('preview') as PreviewScene;
            scene.events.emit('props:update', args);
        };

        if (getGame(ID)) {
            apply();
        } else {
            getGame(ID)?.events.once(Phaser.Core.Events.READY, apply);
        }

        return root;
    },
    play: async (): Promise<void> => {
        cleanGames();
        await ensureFontOnce();
        await nextFrames(3);

        createGame(ID, {
            type: Phaser.AUTO,
            width: 600,
            height: 400,
            backgroundColor: Color.slate(900),
            parent: document.getElementById(ID) as HTMLElement,
            scene: [PreviewScene],
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
    args: {
        icon: 'spinner',
        color: 'blue',
        size: 'xl',
        rotationsPerSecond: 2,
        isSpinning: true,
    },
    argTypes: {
        icon: {
            control: 'select',
            options: Object.keys(fontIcons).filter(icon =>
                ['spinner', 'gear', 'rotate', 'arrows-rotate', 'circle-notch', 'cog', 'sync'].includes(icon)
            ) as IconKey[],
            description: 'Font Awesome icon to display',
        },
        color: {
            control: 'select',
            options: colorTokens,
            description: 'Phaser Wind color token',
        },
        size: {
            control: 'select',
            options: [...sizeTokens, 16, 24, 32, 48, 64],
            description: 'Size using Phaser Wind token or pixel value',
        },
        rotationsPerSecond: {
            control: {
                type: 'range',
                min: 0.1,
                max: 5,
                step: 0.1,
            },
            description: 'Rotation speed in rotations per second',
        },
        isSpinning: {
            control: 'boolean',
            description: 'Whether the progress indicator is spinning',
        },
    },
};