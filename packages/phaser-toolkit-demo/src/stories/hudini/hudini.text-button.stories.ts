/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import {
  Color,
  createTheme,
  FontSizeKey,
  HUDINI_KEY,
  HudiniPlugin,
  SceneWithHudini,
  TextButton,
  type ColorKey,
  type SpacingKey,
  type RadiusKey
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-text-button';

const colorFamilies: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
const colorShades: Array<'400' | '500' | '600' | '700'> = ['400', '500', '600', '700'];
const colorTokens: string[] = [
  ...colorFamilies.flatMap((f) => colorShades.map((s) => `${f}-${s}`)),
  'white',
  'black',
];

const radiusTokens: RadiusKey[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
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

const spacingTokens: SpacingKey[] = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20'];
const fontTokens = ['primary', 'secondary', 'monospace', 'display'] as const;

// Provide a simple, reusable snippet via Storybook Docs
const usageSnippet = `
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    TextButton
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private buttons: TextButton[] = [];
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const colors: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

        let y = 90;
        for (let i = 0; i < colors.length; i++) {
            const color: ColorKey = colors[i] as ColorKey;

            const btn = new TextButton({
                scene: this,
                x: 100 + (i * 120),
                y: y,
                text: 'Click Me!',
                textSize: 'lg',
                backgroundColor: \`${'${color}'}-600\`,
                textColor: 'white',
                borderRadius: 'md',
                margin: '4',
                onClick: (): void => {
                    console.log('clicked:', color);
                },
            });
            this.add.existing(btn);
            this.buttons.push(btn);
        }
    }
}
`;

const meta: Meta = {
  title: 'Hudini/Components/TextButton',
  parameters: {
    docs: {
      description: {
        component: 'Text button with auto-sizing and full customization support. The button automatically adjusts its size based on the text content plus margin.',
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
  private button?: TextButton;
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this.hudini;
    this.cameras.main.setBackgroundColor(pw.color.slate(900));

    const btn = new TextButton({
      scene: this,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
      text: 'Hello World!',
      textSize: 'lg',
      font: 'primary',
      backgroundColor: 'blue-600',
      textColor: 'white',
      borderRadius: 'md',
      margin: '4',
      onClick: (): void => {
        console.log('TextButton clicked!');
      },
    });
    this.add.existing(btn);
    this.button = btn;

    this.events.on(
      'props:update',
      (p: {
        text: string;
        textSize: FontSizeKey;
        font: string;
        backgroundColor: string;
        textColor: string;
        borderRadius: string | number;
        margin: string | number;
      }): void => this.applyProps(p)
    );
  }

  private applyProps(p: {
    text: string;
    textSize: FontSizeKey;
    font: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string | number;
    margin: string | number;
  }): void {
    if (!this.button) return;
    this.button.setText(p.text);
    this.button.setTextSize(p.textSize);
    this.button.setFont(p.font);
    this.button.setBackgroundColor(p.backgroundColor);
    this.button.setTextColor(p.textColor);
    this.button.setBorderRadius(p.borderRadius);
    this.button.setMargin(p.margin);
  }
}

export const TextButtonExample: StoryObj<{
  text: string;
  textSize: number | string;
  font: string;
  backgroundColor: string;
  textColor: string;
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
        text: string;
        textSize: number | string;
        font: string;
        backgroundColor: string;
        textColor: string;
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
    text: 'Hello World!',
    textSize: 'lg',
    font: 'primary',
    backgroundColor: 'blue-600',
    textColor: 'white',
    borderRadius: 'md',
    margin: '4',
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the button',
    },
    textSize: {
      control: 'select',
      options: sizeTokens as unknown as string[],
      description: 'Font size token or pixel value',
    },
    font: {
      control: 'select',
      options: fontTokens as unknown as string[],
      description: 'Font family token',
    },
    backgroundColor: {
      control: 'select',
      options: colorTokens,
      description: 'Background color token (e.g., "blue-600")',
    },
    textColor: {
      control: 'select',
      options: colorTokens,
      description: 'Text color token',
    },
    borderRadius: {
      control: 'select',
      options: radiusTokens as unknown as string[],
      description: 'Border radius token or pixel value',
    },
    margin: {
      control: 'select',
      options: spacingTokens as unknown as string[],
      description: 'Internal margin/padding token or pixel value',
    },
  },
};

// Additional story for showcase of different variations
export const TextButtonShowcase: StoryObj = {
  render: (): HTMLElement => {
    const showcaseId = 'hudini-text-button-showcase';
    const root = document.getElementById(showcaseId) ?? document.createElement('div');
    root.id = showcaseId;
    return root;
  },
  play: async (): Promise<void> => {
    const showcaseId = 'hudini-text-button-showcase';
    
    class ShowcaseScene extends SceneWithHudini<Theme> {
      constructor() {
        super('showcase');
      }

      create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Title
        const title = this.add.text(this.cameras.main.centerX, 50, 'TextButton Showcase', {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        });
        title.setOrigin(0.5);

        // Different sizes
        const sizes: FontSizeKey[] = ['sm', 'base', 'lg', 'xl'];
        sizes.forEach((size, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + (index * 150),
            y: 150,
            text: `Size ${size}`,
            textSize: size,
            backgroundColor: 'blue-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '3',
            onClick: () => console.log(`Size ${size} clicked`),
          });
          this.add.existing(btn);
        });

        // Different colors
        const colors = ['red-500', 'green-500', 'purple-500', 'orange-500'];
        colors.forEach((color, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + (index * 150),
            y: 230,
            text: color.split('-')[0].toUpperCase(),
            textSize: 'base',
            backgroundColor: color,
            textColor: 'white',
            borderRadius: 'lg',
            margin: '4',
            onClick: () => console.log(`${color} clicked`),
          });
          this.add.existing(btn);
        });

        // Different border radius
        const radiuses: RadiusKey[] = ['none', 'sm', 'lg', 'full'];
        radiuses.forEach((radius, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + (index * 150),
            y: 310,
            text: radius === 'full' ? 'Fully Rounded' : `${radius}`,
            textSize: 'base',
            backgroundColor: 'gray-600',
            textColor: 'white',
            borderRadius: radius,
            margin: '4',
            onClick: () => console.log(`Radius ${radius} clicked`),
          });
          this.add.existing(btn);
        });

        // Different margins
        const margins: SpacingKey[] = ['2', '4', '6', '8'];
        margins.forEach((margin, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + (index * 150),
            y: 390,
            text: `Margin ${margin}`,
            textSize: 'base',
            backgroundColor: 'indigo-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: margin,
            onClick: () => console.log(`Margin ${margin} clicked`),
          });
          this.add.existing(btn);
        });

        // Different fonts
        const fonts = ['primary', 'secondary', 'monospace', 'display'] as const;
        fonts.forEach((font, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + (index * 150),
            y: 470,
            text: font,
            textSize: 'base',
            font: font,
            backgroundColor: 'teal-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
            onClick: () => console.log(`Font ${font} clicked`),
          });
          this.add.existing(btn);
        });
      }
    }

    await nextFrames(3);

    createGame(showcaseId, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.slate(900),
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
        story: 'Showcase of different TextButton configurations showing various sizes, colors, border radiuses, margins, and fonts.',
      },
    },
  },
};