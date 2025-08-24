/* eslint-disable max-lines */
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
  SectionHeader,
  type ColorKey,
  type RadiusKey,
  type SpacingKey
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-section-header';

const colorFamilies: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
const colorShades: Array<'400' | '500' | '600' | '700' | '800'> = ['400', '500', '600', '700', '800'];
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
    SectionHeader
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Main panel header
        const mainHeader = new SectionHeader({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            text: 'Game Settings',
            textSize: 'xl',
            backgroundColor: 'blue-600',
            textColor: 'white',
            borderRadius: 'lg',
            margin: '6',
        });
        this.add.existing(mainHeader);

        // Sub-section headers
        const sections = [
            { text: 'Audio', color: 'green-600' },
            { text: 'Graphics', color: 'purple-600' },
            { text: 'Controls', color: 'orange-600' }
        ];

        sections.forEach((section, index) => {
            const header = new SectionHeader({
                scene: this,
                x: 200 + (index * 200),
                y: 200,
                text: section.text,
                textSize: 'lg',
                backgroundColor: section.color,
                textColor: 'white',
                borderRadius: 'md',
                margin: '4',
            });
            this.add.existing(header);
        });
    }
}
`;

const meta: Meta = {
  title: 'Hudini/Components/SectionHeader',
  parameters: {
    docs: {
      description: {
        component: 'Stylized section header component perfect for panels and menus. Features vertical shadow, text stroke, and auto-sizing based on content.',
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
  private header?: SectionHeader;
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this.hudini;
    this.cameras.main.setBackgroundColor(pw.color.slate(400));

    const header = new SectionHeader({
      scene: this,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
      text: 'Section Title',
      textSize: 'xl',
      font: 'display',
      backgroundColor: 'blue-600',
      textColor: 'white',
      strokeColor: 'blue-800',
      borderRadius: 'lg',
      margin: '6',
    });
    this.add.existing(header);
    this.header = header;

    this.events.on(
      'props:update',
      (p: {
        text: string;
        textSize: FontSizeKey;
        font: string;
        backgroundColor: string;
        textColor: string;
        strokeColor: string;
        borderRadius: RadiusKey | number;
        margin: SpacingKey | number;
      }): void => this.applyProps(p)
    );
  }

  private applyProps(p: {
    text: string;
    textSize: FontSizeKey;
    font: string;
    backgroundColor: string;
    textColor: string;
    strokeColor: string;
    borderRadius: RadiusKey | number;
    margin: SpacingKey | number;
  }): void {
    if (!this.header) return;
    this.header.setText(p.text);
    this.header.setTextSize(p.textSize);
    this.header.setFont(p.font);
    this.header.setBackgroundColor(p.backgroundColor);
    this.header.setTextColor(p.textColor);
    this.header.setStrokeColor(p.strokeColor);
    this.header.setBorderRadius(p.borderRadius);
    this.header.setMargin(p.margin);
  }
}

export const SectionHeaderExample: StoryObj<{
  text: string;
  textSize: number | string;
  font: string;
  backgroundColor: string;
  textColor: string;
  strokeColor: string;
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
        strokeColor: string;
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
    text: 'Section Title',
    textSize: 'xl',
    font: 'display',
    backgroundColor: 'blue-600',
    textColor: 'white',
    strokeColor: 'blue-800',
    borderRadius: 'lg',
    margin: '6',
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the section header',
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
    strokeColor: {
      control: 'select',
      options: colorTokens,
      description: 'Text stroke color token',
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
export const SectionHeaderShowcase: StoryObj = {
  render: (): HTMLElement => {
    const showcaseId = 'hudini-section-header-showcase';
    const root = document.getElementById(showcaseId) ?? document.createElement('div');
    root.id = showcaseId;
    return root;
  },
  play: async (): Promise<void> => {
    const showcaseId = 'hudini-section-header-showcase';

    class ShowcaseScene extends SceneWithHudini<Theme> {
      constructor() {
        super('showcase');
      }

      create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(500));

        // Title
        const title = this.add.text(this.cameras.main.centerX, 40, 'SectionHeader Showcase', {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        });
        title.setOrigin(0.5);

        // Different sizes
        const sizes: FontSizeKey[] = ['base', 'lg', 'xl', '2xl'];
        sizes.forEach((size, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + (index * 150),
            y: 100,
            text: `Size ${size}`,
            textSize: size,
            backgroundColor: 'indigo-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
          });
          this.add.existing(header);
        });

        // Different colors - Panel headers
        const panelColors = ['blue-600', 'green-600', 'purple-600', 'red-600'];
        const panelNames = ['Settings', 'Inventory', 'Skills', 'Combat'];
        panelColors.forEach((color, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + (index * 150),
            y: 180,
            text: panelNames[index] as string,
            textSize: 'lg',
            backgroundColor: color,
            textColor: 'white',
            borderRadius: 'lg',
            margin: '5',
          });
          this.add.existing(header);
        });

        // Different border radius
        const radiuses: RadiusKey[] = ['none', 'sm', 'lg', 'full'];
        radiuses.forEach((radius, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + (index * 150),
            y: 260,
            text: radius === 'full' ? 'Pill Style' : `${radius}`,
            textSize: 'base',
            backgroundColor: 'gray-600',
            textColor: 'white',
            borderRadius: radius,
            margin: '4',
          });
          this.add.existing(header);
        });

        // Different margins - showing size adaptation
        const margins: SpacingKey[] = ['2', '4', '6', '8'];
        margins.forEach((margin, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + (index * 150),
            y: 340,
            text: `Margin ${margin}`,
            textSize: 'base',
            backgroundColor: 'teal-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: margin,
          });
          this.add.existing(header);
        });

        // Different fonts
        const fonts = ['primary', 'secondary', 'display', 'monospace'] as const;
        const fontTexts = ['Primary', 'Secondary', 'Display', 'Monospace'];
        fonts.forEach((font, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + (index * 150),
            y: 420,
            text: fontTexts[index] as string,
            textSize: 'base',
            font: font,
            backgroundColor: 'orange-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
          });
          this.add.existing(header);
        });

        // Usage examples in panels
        const usageY = 500;

        // Main menu header
        const mainMenuHeader = new SectionHeader({
          scene: this,
          x: 150,
          y: usageY,
          text: 'MAIN MENU',
          textSize: 'xl',
          font: 'display',
          backgroundColor: 'slate-700',
          textColor: 'white',
          strokeColor: 'slate-900',
          borderRadius: 'lg',
          margin: '6',
        });
        this.add.existing(mainMenuHeader);

        // Sub-menu headers
        const subMenuHeader = new SectionHeader({
          scene: this,
          x: 400,
          y: usageY,
          text: 'Options',
          textSize: 'lg',
          backgroundColor: 'blue-500',
          textColor: 'white',
          borderRadius: 'md',
          margin: '4',
        });
        this.add.existing(subMenuHeader);

        // Achievement header
        const achievementHeader = new SectionHeader({
          scene: this,
          x: 600,
          y: usageY,
          text: '🏆 Achievements',
          textSize: 'lg',
          backgroundColor: 'yellow-600',
          textColor: 'white',
          strokeColor: 'yellow-800',
          borderRadius: 'full',
          margin: '5',
        });
        this.add.existing(achievementHeader);
      }
    }

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
        story: 'Showcase of different SectionHeader configurations showing various sizes, colors, border radiuses, margins, fonts, and real-world usage examples for panels and menus.',
      },
    },
  },
};