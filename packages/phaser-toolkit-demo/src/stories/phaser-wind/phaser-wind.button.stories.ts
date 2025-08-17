/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';
import Phaser from 'phaser';
import {
  Color,
  ColorToken,
  createTheme,
  PHASER_WIND_KEY,
  PhaserWindPlugin,
  SceneWithPhaserWind,
} from 'phaser-wind';

import { createContainer } from '../helpers/container';

const meta: Meta = {
  title: 'PhaserWind/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Example of button using PhaserWind tokens.',
      },
      source: {
        language: 'ts',
        code: `import Phaser from 'phaser';
import {
  Color,
  ColorToken,
  createTheme,
  PHASER_WIND_KEY,
  PhaserWindPlugin,
  SceneWithPhaserWind,
} from 'phaser-wind';
 
const theme = createTheme({});
type Theme = typeof theme;

class PreviewScene extends SceneWithPhaserWind<Theme> {
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this;
    this.cameras.main.setBackgroundColor(Color.slate(900));

    const createButton = (x: number, y: number, label: string, bgToken: ColorToken): Phaser.GameObjects.Container => {
      const text = this.add.text(0, 0, label, {
        fontSize: pw.fontSize.css('lg'),
        color: pw.color.rgb('white'),
      });

      const padX = pw.spacing.px('6');
      const padY = pw.spacing.px('3');
      const width = text.width + padX * 2;
      const height = text.height + padY * 2;

      const bg = this.add.rectangle(0, 0, width, height, pw.color.hex(bgToken));
      bg.setOrigin(0.5);

      const container = this.add.container(x, y, [bg, text]);
      text.setPosition(-text.width / 2, -text.height / 2);
      container.setSize(width, height);

      bg.setInteractive();

      const highColor = bgToken.replace('-500', '-600') as ColorToken;
      const lowColor = bgToken.replace('-500', '-700') as ColorToken;

      bg.on('pointerover', () => (bg.fillColor = pw.color.hex(highColor)));
      bg.on('pointerout', () => (bg.fillColor = pw.color.hex(bgToken as ColorToken)));
      bg.on('pointerdown', () => (bg.fillColor = pw.color.hex(lowColor)));
      bg.on('pointerup', () => (bg.fillColor = pw.color.hex(highColor)));

      return container;
    };

    createButton(300, 120, 'Primary', 'green-500');
    createButton(300, 200, 'Secondary', 'blue-500');
    createButton(300, 280, 'Danger', 'red-500');
  }
}
`,
      },
    },
  },
};
export default meta;

const theme = createTheme({});
type Theme = typeof theme;

class PreviewScene extends SceneWithPhaserWind<Theme> {
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this;
    this.cameras.main.setBackgroundColor(Color.slate(900));

    const createButton = (
      x: number,
      y: number,
      label: string,
      bgToken: ColorToken
    ): Phaser.GameObjects.Container => {
      const text = this.add.text(0, 0, label, {
        fontSize: pw.fontSize.css('lg'),
        color: pw.color.rgb('white'),
      });

      const padX = pw.spacing.px('6');
      const padY = pw.spacing.px('3');
      const width = text.width + padX * 2;
      const height = text.height + padY * 2;

      const bg = this.add.rectangle(0, 0, width, height, pw.color.hex(bgToken));
      bg.setOrigin(0.5);

      const container = this.add.container(x, y, [bg, text]);
      text.setPosition(-text.width / 2, -text.height / 2);
      container.setSize(width, height);

      bg.setInteractive();

      const highColor = bgToken.replace('-500', '-600') as ColorToken;
      const lowColor = bgToken.replace('-500', '-700') as ColorToken;

      bg.on('pointerover', () => (bg.fillColor = pw.color.hex(highColor)));
      bg.on(
        'pointerout',
        () => (bg.fillColor = pw.color.hex(bgToken as ColorToken))
      );
      bg.on('pointerdown', () => (bg.fillColor = pw.color.hex(lowColor)));
      bg.on('pointerup', () => (bg.fillColor = pw.color.hex(highColor)));

      return container;
    };

    createButton(300, 120, 'Primary', 'green-500');
    createButton(300, 200, 'Secondary', 'blue-500');
    createButton(300, 280, 'Danger', 'red-500');
  }
}

const ensureGameOnce = (parent: HTMLElement): Phaser.Game => {
  const w = window as unknown as Window & { __phaserGame?: Phaser.Game };
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
            },
          },
        ],
      },
    });
  }

  return w.__phaserGame;
};

export const Basic: StoryObj = {
  render: (): HTMLElement => {
    const root = createContainer();

    (async (): Promise<void> => {
      ensureGameOnce(root);
    })();

    // @ts-expect-error Storybook chama no unmount
    root.destroy = (): void => {
      const w = window as unknown as Window & { __phaserGame?: Phaser.Game };
      if (w.__phaserGame) {
        w.__phaserGame.destroy(true);
        w.__phaserGame = undefined as unknown as Phaser.Game;
      }
    };

    return root;
  },
};
