/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import { fontIcons, IconKey, IconStyle, loadFont } from 'font-awesome-for-phaser';
import {
    Color,
    createTheme,
    FontSizeKey,
    HUDINI_KEY,
    HudiniPlugin,
    IconButton,
    RadiusKey,
    radiusMap,
    SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

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

const ID = 'hudini-icon-button';

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
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
    private buttons: IconButton[] = [];
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const colors: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];

        let y = 90;
        for (let i = 0; i < colors.length; i++) {
            const color: ColorKey = colors[i] as ColorKey;

            const btn = new IconButton({
                scene: this,
                x: 50 + (i * 65),
                y: y,
                icon: 'plus',
                size: 'xl',
                color: color,
                onClick: (): void => {
                    console.log('clicked');
                },
            });
            this.add.existing(btn);
            this.buttons.push(btn);
        }
    }
}
`;

const meta: Meta = {
    title: 'Hudini/Components/IconButton',
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use Hudini',
            },
            source: {
                language: 'ts',
                code: usageSnippet,
            },
        },
    },
};
export default meta;

const theme = createTheme({
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private button?: IconButton;
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const btn = new IconButton({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            icon: 'plus',
            size: 'xl',
            color: 'red',
            onClick: (): void => {
                console.log('clicked');
            },
        });
        this.add.existing(btn);
        this.button = btn;

        this.events.on(
            'props:update',
            (p: { icon: IconKey; iconStyle: IconStyle; size: FontSizeKey; borderRadius: string | number }): void => this.applyProps(p)
        );
    }

    private applyProps(p: { icon: IconKey; iconStyle: IconStyle; size: FontSizeKey; borderRadius: string | number }): void {
        if (!this.button) return;
        this.button.iconText.setIcon(p.icon, { iconStyle: p.iconStyle });
        this.button.setBorderRadius(p.borderRadius as RadiusKey);
        this.button.setButtonSize(p.size);
    }
}

const ensureFontOnce = async (): Promise<void> => {
    const w = window as unknown as Record<string, unknown>;
    if (!w['__fontLoaded']) {
        await loadFont();
        w['__fontLoaded'] = true;
    }
};

export const IconButtonExample: StoryObj<{ icon: IconKey; iconStyle: IconStyle; size: number | string; color: string; borderRadius: string | number }> = {
    render: (args: Args): HTMLElement => {
        const root = document.getElementById(ID) ?? document.createElement('div');
        root.id = ID;

        const apply = (): void => {
            const game = getGame(ID);
            if (!game) return;
            const scene = game.scene.getScene('preview') as PreviewScene;
            scene.events.emit('props:update', args as { icon: IconKey; iconStyle: IconStyle; size: number | string; color: string; borderRadius: string | number });
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
        icon: 'house',
        iconStyle: 'regular',
        size: 'xl',
        color: '#ffffff',
        borderRadius: 'full',
    },
    argTypes: {
        icon: {
            control: 'select',
            options: Object.keys(fontIcons) as IconKey[],
        },
        iconStyle: {
            control: 'radio',
            options: ['solid', 'regular', 'brands'],
        },
        size: {
            control: 'select',
            options: sizeTokens,
        },
        color: {
            control: {
                type: 'color',
                description: 'Phaser-wind color token (e.g. "red", "blue", "green", "yellow", "purple", "orange", "pink", "gray") or rgb/hex string',
            },
        },
        borderRadius: {
            control: 'select',
            options: Object.keys(radiusMap) as RadiusKey[],
            description: 'Phaser Wind radius token (e.g. "none", "sm", "lg", "full") or a number (px).',
            defaultValue: 'full',
        },
    },
};
