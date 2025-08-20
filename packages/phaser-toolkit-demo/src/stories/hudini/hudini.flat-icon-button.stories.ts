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
  HUDINI_KEY,
  HudiniPlugin,
  SceneWithHudini,
  type ColorKey,
} from 'hudini';
import Phaser from 'phaser';

import { createContainer } from '../helpers/container';

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
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
] as const;

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
        x: 50 + i * 65,
        y: y,
        icon: 'plus',
        size: 'xl',
        backgroundColor: `${color}-600`,
        iconColor: 'white',
        borderRadius: 'md',
        backgroundOpacity: 1,
        iconOpacity: 1,
        onClick: (): void => {
          console.log('clicked');
        },
      });
      this.add.existing(btn);
      this.buttons.push(btn);
    }

    this.events.on(
      'props:update',
      (p: {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number | string;
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
    size: number | string;
    backgroundColor: string;
    iconColor: string;
    borderRadius: string | number;
    backgroundOpacity: number;
    iconOpacity: number;
  }): void {
    for (const btn of this.buttons) {
      btn.setIcon(p.icon, { iconStyle: p.iconStyle });
      btn.setBackgroundColor(p.backgroundColor);
      btn.setIconColor(p.iconColor);
      btn.setBorderRadius(p.borderRadius);
      btn.setBackgroundOpacity(p.backgroundOpacity);
      btn.setIconOpacity(p.iconOpacity);
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

    w.__phaserGame.events.once(Phaser.Core.Events.READY, () => {
      w.__phaserScene = w.__phaserGame?.scene.getScene('preview') as PreviewScene;
    });
  }

  return w.__phaserGame;
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
    const root = createContainer('hudini-flat-icon-button');

    (async (): Promise<void> => {
      await ensureFontOnce();
      const game = ensureGameOnce(root);

      const w = window as unknown as WindowWithPhaser;
      const apply = (): void => {
        const scene = (w.__phaserScene ?? game.scene.getScene('preview')) as PreviewScene;
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

      if (w.__phaserScene) apply();
      else game.events.once(Phaser.Core.Events.READY, apply);
    })();

    // @ts-expect-error Storybook will call this on unmount if present
    (root as unknown as { destroy?: () => void }).destroy = (): void => {
      const w = window as unknown as WindowWithPhaser;
      if (w.__phaserGame) {
        w.__phaserGame.destroy(true);
        w.__phaserGame = undefined as unknown as Phaser.Game;
        w.__phaserScene = undefined as unknown as PreviewScene;
      }
    };

    return root;
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
      description: 'Escolha um token de cor (ex.: "gray-600")',
    },
    iconColor: {
      control: 'select',
      options: colorTokens,
      description: 'Escolha um token de cor para o ícone',
    },
    borderRadius: {
      control: 'select',
      options: radiusTokens as unknown as string[],
      description: 'Escolha um token de radius',
    },
    backgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    iconOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
  },
};
