/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import { fontIcons, IconKey, IconStyle, loadFont } from 'font-awesome-for-phaser';
import {
  Color,
  createTheme,
  FlatIconButton,
  FontSizeKey,
  HUDINI_KEY,
  HudiniPlugin,
  SceneWithHudini,
  type ColorKey
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-flat-icon-button';

const colorFamilies: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
const colorShades: Array<'400' | '500' | '600' | '700'> = ['400', '500', '600', '700'];
const colorTokens: string[] = [
  ...colorFamilies.flatMap((f) => colorShades.map((s) => `${f}-${s}`)),
  'white',
  'black',
];

const radiusTokens = ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const;
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

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    FlatIconButton
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private buttons: FlatIconButton[] = [];
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

            const btn = new FlatIconButton({
                scene: this,
                x: 50 + (i * 65),
                y: y,
                icon: 'plus',
                size: 'xl',
                backgroundColor: \`${'${color}'}-600\`,
                iconColor: 'white',
                borderRadius: 'md',
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
  title: 'Hudini/Components/FlatIconButton',
  parameters: {
    docs: {
      description: {
        component: 'Flat icon button with customizable radius and colors',
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
  private button?: FlatIconButton;
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this.hudini;
    this.cameras.main.setBackgroundColor(pw.color.slate(900));

    const btn = new FlatIconButton({
      scene: this,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
      icon: 'plus',
      size: 'xl',
      backgroundColor: 'gray-600',
      iconColor: 'white',
      borderRadius: 'md',
      backgroundOpacity: 1,
      iconOpacity: 1,
      onClick: (): void => {
        console.log('clicked');
      },
    });
    this.add.existing(btn);
    this.button = btn;

    this.events.on(
      'props:update',
      (p: {
        icon: IconKey;
        iconStyle: IconStyle;
        size: FontSizeKey;
        backgroundColor: string;
        iconColor: string;
        borderRadius: string | number;
        backgroundOpacity: number;
        iconOpacity: number;
      }): void => this.applyProps(p)
    );
  }

  private applyProps(p: {
    icon: IconKey;
    iconStyle: IconStyle;
    size: FontSizeKey;
    backgroundColor: string;
    iconColor: string;
    borderRadius: string | number;
    backgroundOpacity: number;
    iconOpacity: number;
  }): void {
    if (!this.button) return;
    this.button.setIcon(p.icon, { iconStyle: p.iconStyle });
    this.button.setButtonSize(p.size);
    this.button.setBackgroundColor(p.backgroundColor);
    this.button.setIconColor(p.iconColor);
    this.button.setBorderRadius(p.borderRadius);
    this.button.setBackgroundOpacity(p.backgroundOpacity);
    this.button.setIconOpacity(p.iconOpacity);
  }
}

const ensureFontOnce = async (): Promise<void> => {
  const w = window as unknown as Record<string, unknown>;
  if (!w['__fontLoaded']) {
    await loadFont();
    w['__fontLoaded'] = true;
  }
};


export const FlatIconButtonExample: StoryObj<{
  icon: IconKey;
  iconStyle: IconStyle;
  size: number | string;
  backgroundColor: string;
  iconColor: string;
  borderRadius: string | number;
  backgroundOpacity: number;
  iconOpacity: number;
}> = {
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;

    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = (game.scene.getScene('preview') ?? game.scene.getScene('preview')) as PreviewScene;

      scene.events.emit('props:update', args as {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number | string;
        backgroundColor: string;
        iconColor: string;
        borderRadius: string | number;
        backgroundOpacity: number;
        iconOpacity: number;
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
    backgroundColor: 'gray-600',
    iconColor: 'white',
    borderRadius: 'md',
    backgroundOpacity: 1,
    iconOpacity: 1,
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
      options: sizeTokens as unknown as string[],
    },
    backgroundColor: {
      control: 'select',
      options: colorTokens,
      description: 'Choose a color token (e.g., "gray-600")',
    },
    iconColor: {
      control: 'select',
      options: colorTokens,
      description: 'Choose a color token for the icon',
    },
    borderRadius: {
      control: 'select',
      options: radiusTokens as unknown as string[],
      description: 'Choose a color token (e.g., "gray-600")',
    },
    backgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    iconOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
  },
};
