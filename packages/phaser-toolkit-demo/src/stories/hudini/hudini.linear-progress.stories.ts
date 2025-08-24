/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import {
    Color,
    ColorToken,
    createTheme,
    defaultLightTheme,
    HUDINI_KEY,
    HudiniPlugin,
    HudiniPluginData,
    LinearProgress,
    RadiusKey,
    radiusMap,
    SceneWithHudini,
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-linear-progress';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    LinearProgress,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progressBars: LinearProgress[] = [];
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic determinate progress bar
        const basicProgress = new LinearProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            width: 300,
            height: 8,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            borderRadius: 'default',
            progress: 65,
        });

        // Indeterminate progress bar
        const loadingBar = new LinearProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 200,
            width: 300,
            height: 12,
            backgroundColor: 'gray-200',
            progressColor: 'purple-500',
            borderRadius: 'full',
            indeterminate: true,
        });

        this.add.existing(basicProgress);
        this.add.existing(loadingBar);
        
        this.progressBars.push(basicProgress, loadingBar);
    }
}
`;

const meta: Meta = {
    title: 'Hudini/Components/LinearProgress',
    parameters: {
        docs: {
            description: {
                component: 'LinearProgress is a customizable progress bar component that supports both determinate and indeterminate modes with phaser-wind styling.',
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

class InteractiveScene extends SceneWithHudini<Theme> {
    private progressBar?: LinearProgress;
    private currentProgress = 0;
    private progressTimer?: Phaser.Time.TimerEvent;

    constructor() {
        super('interactive');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create the interactive progress bar
        this.progressBar = new LinearProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            width: 400,
            height: 16,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            borderRadius: 'default',
            progress: 50,
        });

        this.add.existing(this.progressBar);

        // Add title text
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 60,
            'Interactive LinearProgress Component',
            {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );
        title.setOrigin(0.5);

        // Add progress text
        const progressText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 40,
            '50%',
            {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );
        progressText.setOrigin(0.5);
        progressText.setName('progressText');

        // Listen for property updates from Storybook controls
        this.events.on('props:update', (props: {
            progress: number;
            backgroundColor: ColorToken;
            progressColor: ColorToken;
            borderRadius: RadiusKey | number;
            indeterminate: boolean;
            animate: boolean;
        }) => this.applyProps(props));
    }

    private applyProps(props: {
        progress: number;
        backgroundColor: ColorToken;
        progressColor: ColorToken;
        borderRadius: RadiusKey | number;
        indeterminate: boolean;
        animate: boolean;
    }): void {
        if (!this.progressBar) return;

        // Update colors
        this.progressBar.setBackgroundColor(props.backgroundColor);
        this.progressBar.setProgressColor(props.progressColor);

        // Update border radius
        this.progressBar.setBorderRadius(props.borderRadius);

        // Update indeterminate mode
        this.progressBar.setIndeterminate(props.indeterminate);

        // Update progress if not indeterminate
        if (!props.indeterminate) {
            this.progressBar.setProgress(props.progress, props.animate);

            // Update progress text
            const progressText = this.children.getByName('progressText') as Phaser.GameObjects.Text;
            if (progressText) {
                progressText.setText(`${Math.round(props.progress)}%`);
            }
        } else {
            // Hide progress text for indeterminate mode
            const progressText = this.children.getByName('progressText') as Phaser.GameObjects.Text;
            if (progressText) {
                progressText.setText('Loading...');
            }
        }

        // Note: For dimension changes, we would need to recreate the progress bar
        // This is a limitation of the current implementation
        // For now, we'll just update the existing properties
    }
}

class ShowcaseScene extends SceneWithHudini<Theme> {
    private progressBars: LinearProgress[] = [];
    private animationTimers: Phaser.Time.TimerEvent[] = [];

    constructor() {
        super('showcase');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Title
        const title = this.add.text(
            this.cameras.main.centerX,
            30,
            'LinearProgress Showcase',
            {
                fontSize: '28px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );
        title.setOrigin(0.5);

        // Basic progress bars with different colors
        this.createProgressBarSection('Basic Progress Bars', 80, [
            { backgroundColor: 'gray-200' as const, progressColor: 'blue-500' as const, progress: 25 },
            { backgroundColor: 'gray-200' as const, progressColor: 'green-500' as const, progress: 50 },
            { backgroundColor: 'gray-200' as const, progressColor: 'red-500' as const, progress: 75 },
        ]);

        // Different border radius examples
        this.createProgressBarSection('Border Radius Variants', 220, [
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, borderRadius: 'none' as const },
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, borderRadius: 'sm' as const },
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, borderRadius: 'lg' as const },
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, borderRadius: 'full' as const },
        ]);

        // Different sizes
        this.createProgressBarSection('Size Variants', 360, [
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, height: 4 },
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, height: 8 },
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, height: 16 },
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, height: 24 },
        ]);

        // Indeterminate examples
        this.createIndeterminateSection('Indeterminate Progress', 500);

        // Animated progress example
        this.createAnimatedSection('Animated Progress', 580);
    }

    private createProgressBarSection(
        title: string,
        y: number,
        configs: Array<{
            backgroundColor: ColorToken;
            progressColor: ColorToken;
            progress: number;
            borderRadius?: RadiusKey;
            height?: number;
        }>
    ): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        configs.forEach((config, index) => {
            const progressBar = new LinearProgress({
                scene: this,
                x: 200 + (index * 120),
                y: y + 30,
                width: 100,
                height: config.height ?? 8,
                backgroundColor: config.backgroundColor,
                progressColor: config.progressColor,
                borderRadius: config.borderRadius ?? 'default',
                progress: config.progress,
            });

            this.add.existing(progressBar);
            this.progressBars.push(progressBar);

            // Add progress label
            const label = this.add.text(
                200 + (index * 120),
                y + 50,
                `${config.progress}%`,
                {
                    fontSize: '12px',
                    color: '#ffffff',
                    fontFamily: 'Arial'
                }
            );
            label.setOrigin(0.5);
        });
    }

    private createIndeterminateSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        const colors: Array<{ bg: ColorToken; fill: ColorToken }> = [
            { bg: 'gray-200', fill: 'blue-500' },
            { bg: 'gray-200', fill: 'green-500' },
            { bg: 'gray-200', fill: 'purple-500' },
            { bg: 'gray-200', fill: 'pink-500' },
        ];

        colors.forEach((color, index) => {
            const progressBar = new LinearProgress({
                scene: this,
                x: 200 + (index * 120),
                y: y + 30,
                width: 100,
                height: 8,
                backgroundColor: color.bg,
                progressColor: color.fill,
                borderRadius: 'full',
                indeterminate: true,
            });

            this.add.existing(progressBar);
            this.progressBars.push(progressBar);
        });
    }

    private createAnimatedSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        const animatedBar = new LinearProgress({
            scene: this,
            x: 400,
            y: y + 30,
            width: 300,
            height: 12,
            backgroundColor: 'gray-300',
            progressColor: 'emerald-500',
            borderRadius: 'lg',
            progress: 0,
        });

        this.add.existing(animatedBar);
        this.progressBars.push(animatedBar);

        // Animate progress from 0 to 100 and back
        let currentProgress = 0;
        let increasing = true;

        const timer = this.time.addEvent({
            delay: 50,
            callback: () => {
                if (increasing) {
                    currentProgress += 2;
                    if (currentProgress >= 100) {
                        increasing = false;
                    }
                } else {
                    currentProgress -= 2;
                    if (currentProgress <= 0) {
                        increasing = true;
                    }
                }
                animatedBar.setProgress(currentProgress, false);
            },
            loop: true,
        });

        this.animationTimers.push(timer);
    }

    destroy(): void {
        // Clean up timers
        this.animationTimers.forEach(timer => timer.destroy());
        super.destroy();
    }
}

// Color options for Storybook controls
const colorOptions: ColorToken[] = [
    'gray-200', 'gray-300', 'gray-400',
    'slate-200', 'slate-300', 'slate-400',
    'blue-200', 'blue-300', 'blue-400', 'blue-500', 'blue-600',
    'green-200', 'green-300', 'green-400', 'green-500', 'green-600',
    'red-200', 'red-300', 'red-400', 'red-500', 'red-600',
    'purple-200', 'purple-300', 'purple-400', 'purple-500', 'purple-600',
    'orange-200', 'orange-300', 'orange-400', 'orange-500', 'orange-600',
    'yellow-200', 'yellow-300', 'yellow-400', 'yellow-500', 'yellow-600',
    'pink-200', 'pink-300', 'pink-400', 'pink-500', 'pink-600',
    'cyan-200', 'cyan-300', 'cyan-400', 'cyan-500', 'cyan-600',
    'emerald-200', 'emerald-300', 'emerald-400', 'emerald-500', 'emerald-600',
];

export const Interactive: StoryObj<{
    progress: number;
    backgroundColor: ColorToken;
    progressColor: ColorToken;
    borderRadius: RadiusKey;
    indeterminate: boolean;
    animate: boolean;
}> = {
    render: (args: Args): HTMLElement => {
        const root = document.getElementById(`${ID}-interactive`) ?? document.createElement('div');
        root.id = `${ID}-interactive`;

        const apply = (): void => {
            const game = getGame(`${ID}-interactive`);
            if (!game) return;
            const scene = game.scene.getScene('interactive') as InteractiveScene;
            scene.events.emit('props:update', args);
        };

        if (getGame(`${ID}-interactive`)) {
            apply();
        } else {
            getGame(`${ID}-interactive`)?.events.once(Phaser.Core.Events.READY, apply);
        }

        return root;
    },
    play: async (): Promise<void> => {
        cleanGames();
        await nextFrames(3);

        createGame(`${ID}-interactive`, {
            type: Phaser.AUTO,
            width: 800,
            height: 400,
            backgroundColor: Color.slate(900),
            parent: document.getElementById(`${ID}-interactive`) as HTMLElement,
            scene: [InteractiveScene],
            plugins: {
                global: [
                    {
                        key: HUDINI_KEY,
                        plugin: HudiniPlugin,
                        mapping: HUDINI_KEY,
                        data: { theme } as HudiniPluginData,
                    },
                ],
            },
        });
    },
    args: {
        progress: 50,
        backgroundColor: 'gray-200',
        progressColor: 'blue-500',
        borderRadius: 'default',
        indeterminate: false,
        animate: true,
    },
    argTypes: {
        progress: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Progress value (0-100). Only applies when indeterminate is false.',
        },
        backgroundColor: {
            control: 'select',
            options: colorOptions,
            description: 'Background color using phaser-wind color tokens',
        },
        progressColor: {
            control: 'select',
            options: colorOptions,
            description: 'Progress fill color using phaser-wind color tokens',
        },
        borderRadius: {
            control: 'select',
            options: Object.keys(radiusMap) as RadiusKey[],
            description: 'Border radius using phaser-wind radius tokens',
        },
        indeterminate: {
            control: 'boolean',
            description: 'Whether to show indeterminate loading animation',
        },
        animate: {
            control: 'boolean',
            description: 'Whether to animate progress changes',
        },
    },
};

export const Showcase: StoryObj = {
    render: () => {
        const root = document.createElement('div');
        root.id = `${ID}-showcase`;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(3);
        createGame(`${ID}-showcase`, {
            type: Phaser.AUTO,
            width: 800,
            height: 650,
            backgroundColor: Color.slate(900),
            parent: document.getElementById(`${ID}-showcase`) as HTMLElement,
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
            scene: [ShowcaseScene]
        });
    }
};

Interactive.parameters = {
    docs: {
        description: {
            story: 'Interactive LinearProgress component with live controls. Adjust the properties to see real-time changes.',
        },
    },
};

Showcase.parameters = {
    docs: {
        autoplay: true,
        story: { inline: false },
        description: {
            story: 'Comprehensive showcase of LinearProgress component variations including different colors, sizes, border radius, and animations.',
        },
        source: {
            code: usageSnippet
        }
    }
};