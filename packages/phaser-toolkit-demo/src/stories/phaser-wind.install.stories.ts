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

import { createContainer } from './helpers/container';

type WindowWithPhaser = Window & {
    __phaserGame?: Phaser.Game;
    __phaserScene?: PreviewScene;
};


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


class PreviewScene extends SceneWithPhaserWind<Theme> { // Inherit from SceneWithPhaserWind to get the pw property
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this; // Don't need to cast to SceneWithPhaserWind<Theme> because we're using the generic type
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
    title: 'PhaserWind/Install',
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

class PreviewScene extends SceneWithPhaserWind<Theme> {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

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


const ensureGameOnce = (parent: HTMLElement): Phaser.Game => {
    const w = window as unknown as WindowWithPhaser;
    if (!w.__phaserGame) {
        w.__phaserGame = new Phaser.Game({
            type: Phaser.AUTO,
            width: 600,
            height: 400,
            backgroundColor: Color.slate(900),
            parent,
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

        w.__phaserGame.events.once(Phaser.Core.Events.READY, () => {
            w.__phaserScene = w.__phaserGame?.scene.getScene(
                'preview'
            ) as PreviewScene;
        });
    }

    return w.__phaserGame;
};

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
        const root = createContainer();

        (async (): Promise<void> => {
            ensureGameOnce(root);
        })();

        // @ts-expect-error Storybook will call this on unmount if present
        root.destroy = (): void => {
            const w = window as unknown as WindowWithPhaser;
            if (w.__phaserGame) {
                w.__phaserGame.destroy(true);
                w.__phaserGame = undefined as unknown as Phaser.Game;
                w.__phaserScene = undefined as unknown as PreviewScene;
            }
        };

        return root;
    },
};
