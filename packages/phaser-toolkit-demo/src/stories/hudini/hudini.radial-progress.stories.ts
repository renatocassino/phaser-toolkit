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
    FontSizeKey,
    fontSizeMap,
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
            showText: true,
            textColor: 'white',
            fontSize: 'base',
            textAlpha: 1,
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

        // Listen for property updates from Storybook controls
        this.events.on('props:update', (props: {
            progress: number;
            backgroundColor: ColorToken;
            backgroundAlpha: number;
            progressColor: ColorToken;
            thickness: number;
            animate: boolean;
            showText: boolean;
            textColor: ColorToken;
            fontSize: FontSizeKey;
            textAlpha: number;
            radius: number;
        }) => this.applyProps(props));
    }

    private applyProps(props: {
        progress: number;
        backgroundColor: ColorToken;
        backgroundAlpha: number;
        progressColor: ColorToken;
        thickness: number;
        animate: boolean;
        showText: boolean;
        textColor: ColorToken;
        fontSize: FontSizeKey;
        textAlpha: number;
        radius: number;
    }): void {
        if (!this.progressCircle) return;

        // Update colors
        this.progressCircle.setBackgroundColor(props.backgroundColor);
        this.progressCircle.setProgressColor(props.progressColor);

        // Update background alpha
        this.progressCircle.setBackgroundAlpha(props.backgroundAlpha);

        // Update thickness
        this.progressCircle.setThickness(props.thickness);

        // Update text properties
        this.progressCircle.setShowText(props.showText);
        this.progressCircle.setTextColor(props.textColor);
        this.progressCircle.setFontSize(props.fontSize);
        this.progressCircle.setTextAlpha(props.textAlpha);
        this.progressCircle.setProgress(props.progress, props.animate);
        this.progressCircle.setRadius(props.radius);
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

        // Radius examples
        this.createRadiusSection('Radius Variants', 620);

        // Text examples
        this.createTextSection('Text Examples', 800);

        // Background alpha examples
        this.createBackgroundAlphaSection('Background Alpha Examples', 980);

        // Animated progress example
        this.createAnimatedSection('Animated Progress', 1160);
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

    private createTextSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Example with text enabled
        const textCircle = new RadialProgress({
            scene: this,
            x: 300,
            y: y + 80,
            radius: 48,
            thickness: 12,
            backgroundColor: 'purple-200',
            progressColor: 'purple-500',
            progress: 75,
            showText: true,
            textColor: 'white',
            fontSize: 'base',
            textAlpha: 1,
        });

        this.add.existing(textCircle);
        this.progressCircles.push(textCircle);

        // Add label
        this.add.text(300, y + 80, 'With Text (75%)', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Example with different text color
        const coloredTextCircle = new RadialProgress({
            scene: this,
            x: 500,
            y: y + 80,
            radius: 48,
            thickness: 12,
            backgroundColor: 'yellow-200',
            progressColor: 'yellow-600',
            progress: 60,
            showText: true,
            textColor: 'yellow-800',
            fontSize: 'lg',
            textAlpha: 0.9,
        });

        this.add.existing(coloredTextCircle);
        this.progressCircles.push(coloredTextCircle);

        // Add label
        this.add.text(500, y + 80, 'Colored Text (60%)', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    private createRadiusSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Different radius examples
        const radiusOptions = [32, 48, 64, 80, 96, 120];
        const colors = ['blue-500', 'green-500', 'red-500', 'purple-500', 'orange-500', 'cyan-500'];

        radiusOptions.forEach((radius, index) => {
            const progressCircle = new RadialProgress({
                scene: this,
                x: 150 + (index * 100),
                y: y + 80,
                radius: radius,
                thickness: Math.max(4, radius / 8), // Proportional thickness
                backgroundColor: 'gray-200',
                progressColor: colors[index] as ColorToken,
                progress: 60,
                showText: true,
                textColor: 'white',
                fontSize: radius < 48 ? 'sm' : radius < 80 ? 'base' : 'lg',
                textAlpha: 1,
            });

            this.add.existing(progressCircle);
            this.progressCircles.push(progressCircle);

            // Add radius label
            this.add.text(150 + (index * 100), y + 80 + radius + 20, `${radius}px`, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });
    }

    private createBackgroundAlphaSection(title: string, y: number): void {
        // Section title
        this.add.text(50, y, title, {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Different background alpha examples
        const alphaOptions = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0];
        const colors = ['blue-500', 'green-500', 'red-500', 'purple-500', 'orange-500', 'cyan-500'];

        alphaOptions.forEach((alpha, index) => {
            const progressCircle = new RadialProgress({
                scene: this,
                x: 150 + (index * 100),
                y: y + 80,
                radius: 48,
                thickness: 12,
                backgroundColor: 'gray-200',
                backgroundAlpha: alpha,
                progressColor: colors[index] as ColorToken,
                progress: 60,
                showText: true,
                textColor: 'white',
                fontSize: 'base',
                textAlpha: 1,
            });

            this.add.existing(progressCircle);
            this.progressCircles.push(progressCircle);

            // Add alpha label
            this.add.text(150 + (index * 100), y + 80 + 60, `α: ${alpha}`, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });
    }

    destroy(): void {
        // Clean up timers
        this.animationTimers.forEach(timer => timer.destroy());
        // super.destroy();
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
    backgroundAlpha: number;
    progressColor: ColorToken;
    thickness: number;
    animate: boolean;
    showText: boolean;
    textColor: ColorToken;
    fontSize: FontSizeKey;
    textAlpha: number;
    radius: number;
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
        backgroundAlpha: 0.2,
        progressColor: 'blue-500',
        thickness: 16,
        animate: true,
        showText: false,
        textColor: 'white',
        fontSize: 'base',
        textAlpha: 1,
        radius: 80,
    },
    argTypes: {
        backgroundColor: {
            control: 'select',
            options: colorOptions,
            description: 'Background color using phaser-wind color tokens',
        },
        backgroundAlpha: {
            control: { type: 'range', min: 0, max: 1, step: 0.1 },
            description: 'Alpha (transparency) of the background circle',
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
        showText: {
            control: 'boolean',
            description: 'Whether to show the percentage text in the center',
        },
        textColor: {
            control: 'select',
            options: colorOptions,
            description: 'Color of the percentage text',
        },
        fontSize: {
            control: 'select',
            options: Object.keys(fontSizeMap) as FontSizeKey[],
            description: 'Font size of the percentage text in pixels',
        },
        textAlpha: {
            control: { type: 'range', min: 0, max: 1, step: 0.1 },
            description: 'Alpha (transparency) of the percentage text',
        },
        radius: {
            control: 'select',
            options: [32, 48, 64, 80, 96, 120, 160],
            description: 'Radius of the progress circle in pixels',
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
            height: 1400,
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