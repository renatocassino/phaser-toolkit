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
    RadialProgress,
    SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-radial-progress';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    RadialProgress,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progressCircles: RadialProgress[] = [];
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic determinate radial progress
        const basicProgress = new RadialProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            radius: 48,
            thickness: 12,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            progress: 65,
        });

        this.add.existing(basicProgress);
        this.add.existing(loadingCircle);
        
        this.progressCircles.push(basicProgress, loadingCircle);
    }
}
`;

const meta: Meta = {
    title: 'Hudini/Components/RadialProgress',
    parameters: {
        docs: {
            description: {
                component: 'RadialProgress is a customizable circular progress indicator that supports determinate modes with phaser-wind styling.',
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
    private progressCircle?: RadialProgress;
    private currentProgress = 0;
    private progressTimer?: Phaser.Time.TimerEvent;

    constructor() {
        super('interactive');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create the interactive radial progress
        this.progressCircle = new RadialProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            radius: 80,
            thickness: 16,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            progress: 50,
        });

        this.add.existing(this.progressCircle);

        // Add title text
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 120,
            'Interactive RadialProgress Component',
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
            this.cameras.main.centerY,
            '50%',
            {
                fontSize: '28px',
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
            thickness: number;
            animate: boolean;
        }) => this.applyProps(props));
    }

    private applyProps(props: {
        progress: number;
        backgroundColor: ColorToken;
        progressColor: ColorToken;
        thickness: number;
        animate: boolean;
    }): void {
        if (!this.progressCircle) return;

        // Update colors
        this.progressCircle.setBackgroundColor(props.backgroundColor);
        this.progressCircle.setProgressColor(props.progressColor);

        // Update thickness
        this.progressCircle.setThickness(props.thickness);

        // Update progress if not indeterminate
        this.progressCircle.setProgress(props.progress, props.animate);

        // Update progress text
        const progressText = this.children.getByName('progressText') as Phaser.GameObjects.Text;
        if (progressText) {
            progressText.setText(`${Math.round(props.progress)}%`);
        }

        // Note: For dimension changes, we would need to recreate the progress circle
        // This is a limitation of the current implementation
        // For now, we'll just update the existing properties
    }
}

class ShowcaseScene extends SceneWithHudini<Theme> {
    private progressCircles: RadialProgress[] = [];
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
            'RadialProgress Showcase',
            {
                fontSize: '28px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );
        title.setOrigin(0.5);

        // Basic progress circles with different colors
        this.createProgressCircleSection('Basic Progress Circles', 80, [
            { backgroundColor: 'gray-200' as const, progressColor: 'blue-500' as const, progress: 25 },
            { backgroundColor: 'gray-200' as const, progressColor: 'green-500' as const, progress: 50 },
            { backgroundColor: 'gray-200' as const, progressColor: 'red-500' as const, progress: 75 },
        ]);

        // Different thickness examples
        this.createProgressCircleSection('Thickness Variants', 260, [
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, thickness: 6 },
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, thickness: 12 },
            { backgroundColor: 'slate-200' as const, progressColor: 'cyan-500' as const, progress: 60, thickness: 20 },
        ]);

        // Different sizes
        this.createProgressCircleSection('Size Variants', 440, [
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, radius: 32 },
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, radius: 48 },
            { backgroundColor: 'orange-200' as const, progressColor: 'orange-500' as const, progress: 40, radius: 64 },
        ]);

        // Animated progress example
        this.createAnimatedSection('Animated Progress', 720);
    }

    private createProgressCircleSection(
        title: string,
        y: number,
        configs: Array<{
            backgroundColor: ColorToken;
            progressColor: ColorToken;
            progress: number;
            thickness?: number;
            radius?: number;
        }>
    ): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        configs.forEach((config, index) => {
            const progressCircle = new RadialProgress({
                scene: this,
                x: 200 + (index * 180),
                y: y + 80,
                radius: config.radius ?? 48,
                thickness: config.thickness ?? 12,
                backgroundColor: config.backgroundColor,
                progressColor: config.progressColor,
                progress: config.progress,
            });

            this.add.existing(progressCircle);
            this.progressCircles.push(progressCircle);

            // Add progress label
            const label = this.add.text(
                200 + (index * 180),
                y + 80,
                `${config.progress}%`,
                {
                    fontSize: '16px',
                    color: '#ffffff',
                    fontFamily: 'Arial'
                }
            );
            label.setOrigin(0.5);
        });
    }

    private createAnimatedSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        const animatedCircle = new RadialProgress({
            scene: this,
            x: 400,
            y: y + 80,
            radius: 64,
            thickness: 16,
            backgroundColor: 'gray-300',
            progressColor: 'emerald-500',
            progress: 0,
        });

        this.add.existing(animatedCircle);
        this.progressCircles.push(animatedCircle);

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
                animatedCircle.setProgress(currentProgress, false);
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
    thickness: number;
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
            height: 500,
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
        thickness: 16,
        animate: true,
    },
    argTypes: {
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
        thickness: {
            control: { type: 'range', min: 4, max: 32, step: 1 },
            description: 'Thickness of the progress arc',
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
            height: 900,
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
            story: 'Interactive RadialProgress component with live controls. Adjust the properties to see real-time changes.',
        },
    },
};

Showcase.parameters = {
    docs: {
        autoplay: true,
        story: { inline: false },
        description: {
            story: 'Comprehensive showcase of RadialProgress component variations including different colors, sizes, thickness, and animations.',
        },
        source: {
            code: usageSnippet
        }
    }
};