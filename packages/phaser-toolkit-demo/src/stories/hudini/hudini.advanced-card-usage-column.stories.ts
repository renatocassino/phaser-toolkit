/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import type { Meta, StoryObj } from '@storybook/html';
import { loadFont } from 'font-awesome-for-phaser';
import {
  Card,
  Color,
  createTheme,
  HUDINI_KEY,
  HudiniPlugin,
  IconButton,
  Column,
  SceneWithHudini
} from 'hudini';
import Phaser from 'phaser';

import { cleanGames, createGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'hudini-advanced-card-usage';

const meta: Meta = {
  title: 'HUDini/Advanced Card Usage (Column)',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Advanced card usage with nested layout components. Shows how to create a card containing a column with a row of small icon buttons.',
      },
    },
  },
};

export default meta;

class PreviewScene extends SceneWithHudini {
  constructor() {
    super('preview');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Color.rgb('slate-100'));

    this.add
      .text(300, 50, 'Advanced Card Usage', {
        fontSize: '24px',
        color: Color.rgb('slate-800'),
      })
      .setOrigin(0.5);

    // Create a row of small icon buttons
    const buttonRow = new Column({
      scene: this,
      x: 0,
      y: 0,
      gap: 10,
      align: 'center',
      verticalOrigin: 'center',
      children: [
        new IconButton({
          scene: this,
          x: 0,
          y: 0,
          icon: 'house',
          size: 16,
          color: 'blue',
        }),
        new IconButton({
          scene: this,
          x: 0,
          y: 0,
          icon: 'users',
          size: 16,
          color: 'green',
        }),
        new IconButton({
          scene: this,
          x: 0,
          y: 0,
          icon: 'gear',
          size: 16,
          color: 'purple',
        }),
        new IconButton({
          scene: this,
          x: 0,
          y: 0,
          icon: 'heart-circle-check',
          size: 16,
          color: 'red',
        }),
        new IconButton({
          scene: this,
          x: 0,
          y: 0,
          icon: 'star-of-david',
          size: 16,
          color: 'yellow',
        })
      ]
    });

    // Create a card with the column as content
    const card = new Card({
      scene: this,
      x: 300,
      y: 200,
      backgroundColor: Color.rgb('slate-700'),
      borderRadius: 12,
      margin: 10,
      child: buttonRow
    });

    this.add.existing(card);

    card.layout();
  }
}

const ensureFontOnce = async (): Promise<void> => {
  await loadFont();
};

export const AdvancedCardUsage: StoryObj = {
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await ensureFontOnce();
    await cleanGames();
    await nextFrames(3);

    createGame(ID, {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      backgroundColor: Color.rgb('slate-100'),
      parent: document.getElementById(ID) as HTMLElement,
      plugins: {
        global: [
          {
            key: HUDINI_KEY,
            plugin: HudiniPlugin,
            start: true,
            data: {
              theme: createTheme({}),
            },
          },
        ],
      },
      scene: [PreviewScene],
    });
  }
};
