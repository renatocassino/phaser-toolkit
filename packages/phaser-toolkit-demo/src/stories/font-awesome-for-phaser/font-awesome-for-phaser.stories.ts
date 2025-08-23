/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { Args, Meta, StoryObj } from '@storybook/html';
import {
  fontIcons,
  IconKey,
  IconStyle,
  IconText,
  loadFont,
} from 'font-awesome-for-phaser';
import Phaser from 'phaser';
import { Color, FontSize } from 'phaser-wind';

import { cleanGames, createGame, getGame } from '../helpers/create-game';
import { nextFrames } from '../helpers/next-tick';

const ID = 'font-awesome-for-phaser-basic';


const usageSnippet = `import { IconText, loadFont } from 'font-awesome-for-phaser';

await loadFont();

class MyScene extends Phaser.Scene {
  create() {
    const icon = new IconText({
      scene: this,
      x: 300,
      y: 200,
      icon: 'house',
      iconStyle: 'regular', // 'solid' | 'regular' | 'brands'
      size: 64,
      style: { color: '#ffffff' },
    });
    this.add.existing(icon);
  }
}`;

const meta: Meta = {
  title: 'Font Awesome For Phaser/IconText',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Render Font Awesome icons in Phaser via font. Load the fonts with `loadFont()` and use `IconText`.',
      },
      source: {
        language: 'ts',
        code: usageSnippet,
      },
    },
  },
};
export default meta;

class PreviewScene extends Phaser.Scene {
  private iconGO?: IconText;

  constructor() {
    super('preview');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Color.slate(900));

    this.add
      .text(300, 100, 'Icons', {
        fontSize: FontSize.css('2xl'),
        color: Color.rgb('white'),
      })
      .setOrigin(0.5);

    this.events.on(
      'props:update',
      (p: {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number;
        color: string;
      }) => this.applyProps(p)
    );
  }

  applyProps(p: {
    icon: IconKey;
    iconStyle: IconStyle;
    size: number;
    color: string;
  }): void {
    if (!this.iconGO) {
      this.iconGO = new IconText({
        scene: this,
        x: 300,
        y: 200,
        icon: p.icon,
        iconStyle: p.iconStyle,
        size: p.size,
        style: { color: p.color },
      });
      this.add.existing(this.iconGO);
    } else {
      this.iconGO.setIcon(p.icon, { iconStyle: p.iconStyle });
      // Ensure size and color are updated on rerender
      // setFontSize exists on Phaser.GameObjects.Text
      if (typeof this.iconGO.setFontSize === 'function')
        this.iconGO.setFontSize(p.size);
      this.iconGO.setColor(p.color);
    }
  }
}

const ensureFontOnce = async (): Promise<void> => {
  await loadFont();
};

export const Basic: StoryObj<{
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
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;

    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = game.scene.getScene('preview');

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

    if (getGame(ID)) {
      apply();
    } else {
      getGame(ID)?.events.once(Phaser.Core.Events.READY, apply);
    }

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
      backgroundColor: Color.slate(900),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [PreviewScene],
    });
  }
};
