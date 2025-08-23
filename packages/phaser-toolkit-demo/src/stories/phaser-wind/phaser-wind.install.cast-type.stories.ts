/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    PHASER_WIND_KEY,
    PhaserWindPlugin,
    SceneWithPhaserWind
} from 'phaser-wind';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'phaser-wind-install-cast-type';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    PHASER_WIND_KEY,
    PhaserWindPlugin,
    SceneWithPhaserWind
} from 'phaser-wind';

const theme = createTheme({
    colors: {
        primary: 'red-500',
        secondary: 'blue-500',
        tertiary: 'green-500',
    }
});
type Theme = typeof theme;


class PreviewScene extends Phaser.Scene {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = (this as unknown as SceneWithPhaserWind<Theme>); // cast to get the pw property
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        let y = 90;
        this.add
            .text(300, y, 'Primary color', {
                fontSize: pw.fontSize.css('2xl'), // use the pw property to get the font size
                color: pw.color.rgb('primary'), // use the pw property to get the color with type safety
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Secondary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('secondary'),
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Tertiary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('tertiary'),
            })
            .setOrigin(0.5);

        // if you try to use a color that is not in the theme, it will throw an error
        // ❌ pw.color.rgb('invalid-color')
        // ✅ pw.color.rgb('primary') -> Defined in the theme

        // if you try to use a font size that is not in the theme, it will throw an error
        // ❌ pw.fontSize.css('invalid-size')
        // ✅ pw.fontSize.css('2xl')

        // if you try to use a color that is not in the theme, it will throw an error
        // ❌ pw.color.rgb('invalid-color')
    }
}
`;

const meta: Meta = {
    title: 'PhaserWind/Install/WithCastType',
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use PhaserWind',
            },
        },
    },
};
export default meta;

const theme = createTheme({
    colors: {
        primary: 'red-500',
        secondary: 'blue-500',
        tertiary: 'green-500',
    }
});
type Theme = typeof theme;

class PreviewScene extends Phaser.Scene {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = (this as unknown as SceneWithPhaserWind<Theme>);
        this.cameras.main.setBackgroundColor(pw.color.slate(800));

        let y = 90;
        this.add
            .text(300, y, 'Primary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('primary'),
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Secondary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('secondary'),
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Tertiary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('tertiary'),
            })
            .setOrigin(0.5);
    }
}

export const WithCastType: StoryObj = {
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use PhaserWind',
            },
            source: {
                language: 'ts',
                code: usageSnippet,
            },
        },
    },
    render: (): HTMLElement => {
        const root = document.getElementById(ID) ?? document.createElement('div');
        root.id = ID;
        return root;
    },
    play: async (): Promise<void> => {
        await cleanGames();
        await nextFrames(2);

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
                        key: PHASER_WIND_KEY,
                        plugin: PhaserWindPlugin,
                        mapping: PHASER_WIND_KEY,
                        data: {
                            theme,
                        }
                    },
                ],
            }
        });
    },
};
