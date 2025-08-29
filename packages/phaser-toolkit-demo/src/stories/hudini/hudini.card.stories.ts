/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import {
    Card,
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    SectionHeader,
    TextButton,
    type ColorKey,
    type RadiusKey,
    type SpacingKey
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-card';

const colorFamilies: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
const colorShades: Array<'400' | '500' | '600' | '700' | '800'> = ['400', '500', '600', '700', '800'];
const colorTokens: string[] = [
    ...colorFamilies.flatMap((f) => colorShades.map((s) => `${f}-${s}`)),
    'white',
    'black',
];

const radiusTokens: RadiusKey[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
const spacingTokens: SpacingKey[] = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20'];

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    Card,
    TextButton
} from 'hudini';

const theme = createTheme({
    // Custom theme configuration
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create a button to put inside the card
        const button = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Click Me!',
            backgroundColor: 'blue-500',
            textColor: 'white',
            borderRadius: 'md',
        });

        // Create a card containing the button
        const card = new Card({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            backgroundColor: 'white',
            borderRadius: 'lg',
            margin: '6',
            child: button,
        });
        this.add.existing(card);
    }
}
`;

const meta: Meta = {
    title: 'Hudini/components/Card',
    component: Card,
    parameters: {
        docs: {
            description: {
                component: `A flexible card component that adapts to its child content size, using phaser-wind tokens for styling.

${usageSnippet}

## Features

- 🎯 **Adaptable**: Automatically adjusts to child size
- 🎨 **Stylable**: Uses phaser-wind tokens for colors, border radius, and margins
- 🔄 **Flexible**: Supports any Phaser GameObject as child
- ⚡ **Performance**: Uses Graphics directly (no textures)

## Props

- \`backgroundColor\`: Background color token or CSS color string
- \`borderRadius\`: Border radius token or pixel value
- \`margin\`: Spacing token or pixel value for internal padding
- \`child\`: Any Phaser GameObject to be contained within the card

## Usage Examples

- **Text Cards**: Simple text content with background
- **Button Cards**: Interactive buttons with card styling
- **Progress Cards**: Progress bars with card containers
- **Header Cards**: Section headers with card backgrounds
- **Custom Cards**: Any combination of components`,
            },
        },
    },
    argTypes: {
        backgroundColor: {
            control: 'select',
            options: colorTokens,
            description: 'Background color token (e.g., "blue-600")',
        },
        borderRadius: {
            control: 'select',
            options: radiusTokens,
            description: 'Border radius token or pixel value',
        },
        margin: {
            control: 'select',
            options: spacingTokens,
            description: 'Margin/spacing token or pixel value',
        },
    },
};

export default meta;

class PreviewScene extends SceneWithHudini<Theme> {
    private card?: Card;
    private button?: TextButton;

    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create a button to put inside the card
        this.button = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Click Me!',
            backgroundColor: 'blue-500',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
        });

        // Create a card containing the button
        this.card = new Card({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            backgroundColor: 'white',
            borderRadius: 'lg',
            margin: '6',
            child: this.button,
        });
        this.add.existing(this.card);

        // Listen for prop updates
        this.events.on(
            'props:update',
            (p: { backgroundColor: string; borderRadius: string | number; margin: string | number }): void => this.applyProps(p)
        );
    }

    private applyProps(p: { backgroundColor: string; borderRadius: string | number; margin: string | number }): void {
        if (!this.card) return;

        this.card
            .setBackgroundColor(p.backgroundColor)
            .setBorderRadius(p.borderRadius)
            .setMargin(p.margin);
    }
}

// Showcase scene with multiple card examples
class ShowcaseScene extends SceneWithHudini<Theme> {
    constructor() {
        super('showcase');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Title
        this.add
            .text(this.cameras.main.centerX, 50, 'Card Component Showcase', {
                color: pw.color.slate(200),
                align: 'center',
                fontSize: '32px',
            })
            .setOrigin(0.5, 0.5);

        // Different background colors
        const colors: Array<'red-500' | 'blue-500' | 'green-500' | 'purple-500' | 'orange-500'> = [
            'red-500',
            'blue-500',
            'green-500',
            'purple-500',
            'orange-500',
        ];

        colors.forEach((color, index) => {
            const text = this.add.text(0, 0, `Card ${index + 1}`, {
                color: 'white',
                align: 'center',
                fontSize: '18px',
            });

            const card = new Card({
                scene: this,
                x: 150 + (index * 120),
                y: 120,
                backgroundColor: color,
                borderRadius: 'md',
                margin: '4',
                child: text,
            });
            this.add.existing(card);
        });

        // Different border radiuses
        const radiuses: RadiusKey[] = ['none', 'sm', 'md', 'lg', 'xl'];
        radiuses.forEach((radius, index) => {
            const text = this.add.text(0, 0, `Radius ${radius}`, {
                color: 'white',
                align: 'center',
                fontSize: '16px',
            });

            const card = new Card({
                scene: this,
                x: 150 + (index * 130),
                y: 200,
                backgroundColor: 'teal-600',
                borderRadius: radius,
                margin: '4',
                child: text,
            });
            this.add.existing(card);
        });

        // Different margins
        const margins: SpacingKey[] = ['2', '4', '6', '8'];
        margins.forEach((margin, index) => {
            const text = this.add.text(0, 0, `Margin ${margin}`, {
                color: 'white',
                align: 'center',
                fontSize: '16px',
            });

            const card = new Card({
                scene: this,
                x: 150 + (index * 150),
                y: 280,
                backgroundColor: 'indigo-600',
                borderRadius: 'md',
                margin: margin,
                child: text,
            });
            this.add.existing(card);
        });

        // Card with button
        const button = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button Card',
            backgroundColor: 'emerald-500',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
        });

        const buttonCard = new Card({
            scene: this,
            x: 150,
            y: 360,
            backgroundColor: 'emerald-100',
            borderRadius: 'lg',
            margin: '6',
            child: button,
        });
        this.add.existing(buttonCard);

        // Card with section header
        const header = new SectionHeader({
            scene: this,
            x: 0,
            y: 0,
            text: 'Header Card',
            fontSize: 'lg',
            backgroundColor: 'purple-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
        });

        const headerCard = new Card({
            scene: this,
            x: 350,
            y: 360,
            backgroundColor: 'purple-50',
            borderRadius: 'lg',
            margin: '6',
            child: header,
        });
        this.add.existing(headerCard);

        // Large card with multiple elements
        const largeText = this.add.text(0, 0, 'Large Content\nMultiple Lines\nof Text', {
            color: 'white',
            align: 'center',
            fontSize: '20px',
        });

        const largeCard = new Card({
            scene: this,
            x: 600,
            y: 390,
            backgroundColor: 'orange-600',
            borderRadius: 'xl',
            margin: '8',
            child: largeText,
        });
        this.add.existing(largeCard);

        // Usage examples section
        const usageY = 510;

        // Info card
        const infoText = this.add.text(0, 0, 'ℹ️ Information\nThis is an info card\nwith multiple lines', {
            color: 'white',
            align: 'center',
            fontSize: '16px',
        });

        const infoCard = new Card({
            scene: this,
            x: 150,
            y: usageY,
            backgroundColor: 'blue-600',
            borderRadius: 'lg',
            margin: '6',
            child: infoText,
        });
        this.add.existing(infoCard);

        // Success card
        const successText = this.add.text(0, 0, '✅ Success\nOperation completed\nsuccessfully!', {
            color: 'white',
            align: 'center',
            fontSize: '16px',
        });

        const successCard = new Card({
            scene: this,
            x: 395,
            y: usageY,
            backgroundColor: 'green-600',
            borderRadius: 'lg',
            margin: '6',
            child: successText,
        });
        this.add.existing(successCard);

        // Warning card
        const warningText = this.add.text(0, 0, '⚠️ Warning\nPlease review your\ninput carefully', {
            color: 'white',
            align: 'center',
            fontSize: '16px',
        });

        const warningCard = new Card({
            scene: this,
            x: 630,
            y: usageY,
            backgroundColor: 'yellow-600',
            borderRadius: 'lg',
            margin: '6',
            child: warningText,
        });
        this.add.existing(warningCard);
    }
}

// Create theme
const theme = createTheme({
    // Use default theme
});

type Theme = typeof theme;

export const CardExample: StoryObj<{
    backgroundColor: string;
    borderRadius: string | number;
    margin: string | number;
}> = {
    render: (args: Args): HTMLElement => {
        const root = document.getElementById(ID) ?? document.createElement('div');
        root.id = ID;

        const apply = (): void => {
            const game = getGame(ID);
            if (!game) return;
            const scene = (game.scene.getScene('preview') ?? game.scene.getScene('preview')) as PreviewScene;

            scene.events.emit('props:update', args as {
                backgroundColor: string;
                borderRadius: string | number;
                margin: string | number;
            });
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
        await nextFrames(3);

        createGame(ID, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: Color.slate(500),
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
        backgroundColor: 'white',
        borderRadius: 'lg',
        margin: '6',
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive Card component with customizable background color, border radius, and margin. The card automatically adapts to its child content size.',
            },
        },
    },
};

export const CardShowcase: StoryObj = {
    render: (): HTMLElement => {
        const showcaseId = 'hudini-card-showcase';
        const root = document.getElementById(showcaseId) ?? document.createElement('div');
        root.id = showcaseId;

        if (!getGame(showcaseId)) {
            getGame(showcaseId)?.events.once(Phaser.Core.Events.READY, () => {
                // Showcase is ready
            });
        }

        return root;
    },
    play: async (): Promise<void> => {
        const showcaseId = 'hudini-card-showcase';
        cleanGames();
        await nextFrames(3);

        createGame(showcaseId, {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: Color.slate(500),
            parent: document.getElementById(showcaseId) as HTMLElement,
            scene: [ShowcaseScene],
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
    parameters: {
        docs: {
            description: {
                story: 'Showcase of different Card configurations showing various colors, border radiuses, margins, and real-world usage examples with different child components.',
            },
        },
    },
};
