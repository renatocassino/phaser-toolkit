/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import {
    fontIcons,
    IconKey,
    IconStyle,
    loadFont
} from 'font-awesome-for-phaser';
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
    __faLoaded?: boolean;
};

const meta: Meta = {
    title: 'PhaserWind/Install',
    parameters: {
        docs: {
            description: {
                code: `
                    <h2>Aqui aparece bonito</h2>
                `,
                component:
                    'Examples of how to install and use PhaserWind',
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

const template = `
<div
    id="phaser-story-doc"
    style="
        padding: 12px;
        color: rgb(229, 231, 235);
        font-family: ui-monospace, monospace;
        background: rgb(11, 18, 32);
        border-top: 1px solid rgb(31, 41, 55);
    ">
    <div id="phaser-story-doc-title" style="font-weight: 600; margin-bottom: 6px;">Usage:</div>
    <pre id="phaser-story-doc-pre">
        <code id="phaser-story-doc-code" class="language-typescript">
        </code>
    </pre>
</div>
`;

const createDocWrapper = (root: HTMLDivElement): { title: HTMLDivElement; code: HTMLElement; docWrap: HTMLDivElement } => {
    const docId = 'phaser-story-doc';
    let docWrap = document.getElementById(docId) as HTMLDivElement | null;
    if (!docWrap) {
        const div = document.createElement('div');
        div.innerHTML = template;
        root.appendChild(div);
        docWrap = div;
    }

    const title = docWrap.querySelector('#phaser-story-doc-title') as HTMLDivElement;
    const code = docWrap.querySelector('#phaser-story-doc-code') as HTMLElement;

    return { title, code, docWrap };
};

const loadHighlightJS = (code: HTMLElement): void => {
    const styleId = 'hljs-style';
    if (!document.getElementById(styleId)) {
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href =
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
        document.head.appendChild(link);
    }

    const scriptId = 'hljs-script';
    const applyHighlight = (): void => {
        // @ts-expect-error global from hljs
        if (window.hljs && code) window.hljs.highlightElement(code);
    };

    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        script.onload = applyHighlight;
        document.body.appendChild(script);
        applyHighlight();
    } else {
        applyHighlight();
    }
};

const ensureFontOnce = async (): Promise<void> => {
    const w = window as unknown as WindowWithPhaser;
    if (!w.__faLoaded) {
        await loadFont();
        w.__faLoaded = true;
    }
};

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

export const WithPhaserWind: StoryObj<{
    icon: IconKey;
    iconStyle: IconStyle;
    size: number;
    color: string;
}> = {
    args: {
        icon: 'house',
        iconStyle: 'regular',
        size: 64,
        color: '#ffffff',
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
            control: {
                type: 'number',
                min: 8,
                max: 256,
                step: 1,
            },
        },
        color: {
            control: { type: 'color' },
        },
    },
    render: (args: Args): HTMLElement => {
        const root = createContainer();
        const { docWrap, code } = createDocWrapper(root);

        const w = window as unknown as WindowWithPhaser;

        (async (): Promise<void> => {
            await ensureFontOnce();
            const game = ensureGameOnce(root);

            const apply = (): void => {
                const scene = (w.__phaserScene ??
                    game.scene.getScene('preview')) as PreviewScene;

                scene.events.emit(
                    'props:update',
                    args as {
                        icon: IconKey;
                        iconStyle: IconStyle;
                        size: number;
                        color: string;
                    }
                );
            };

            if (w.__phaserScene) apply();
            else game.events.once(Phaser.Core.Events.READY, apply);

            // Append or move the docs block to be after the Phaser canvas
            if (docWrap && docWrap.parentElement !== root) {
                root.appendChild(docWrap);
            } else if (docWrap && docWrap.parentElement === root) {
                // Move to the end to ensure it's after canvas
                root.appendChild(docWrap);
            }
        })();

        code.textContent = `import { IconText, loadFont } from 'font-awesome-for-phaser';

await loadFont().then(() => {
  new Phaser.Game({ /** parameters here */ });
});

// CustomScene.ts - inside your Scene
const icon = new IconText({
  scene: this,
  x: 300,
  y: 200,
  icon: '${String(args['icon'] ?? 'gamepad')}',
  iconStyle: '${String(args['iconStyle'] ?? 'solid')}', // 'solid' | 'regular' | 'brands'
  size: ${Number.isFinite(Number(args['size'])) ? Number(args['size']) : 64},
  style: { color: '${String(args['color'] ?? '#ffffff')}' },
});
this.add.existing(icon);`;

        // Load highlight.js once and highlight this block
        loadHighlightJS(code);

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
