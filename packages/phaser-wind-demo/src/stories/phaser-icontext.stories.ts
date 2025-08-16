/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj, Args } from '@storybook/html';
import {
  IconKey,
  IconStyle,
  IconText,
  loadFont,
  fontIcons,
} from 'font-awesome-for-phaser';
import Phaser from 'phaser';
import { Color, FontSize } from 'phaser-wind';

type WindowWithGame = Window & {
  game: Phaser.Game;
};

const meta: Meta = {
  title: 'Phaser/IconText',
};

export default meta;

const removeContainer = (): void => {
  const container = document.getElementById('phaser-story');
  if (container) {
    container.remove();
  }
};

const createContainer = (): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = 'phaser-story';
  container.style.width = '600px';
  container.style.height = '400px';
  container.style.border = '1px solid #333';
  container.style.background = '#111';
  return container;
};

const disposeGame = (game?: Phaser.Game): void => {
  if (game) {
    console.log('destroying game');
    game.destroy(true);
  }
};

const bootstrap = (
  parent: HTMLElement,
  onReady: (scene: Phaser.Scene) => void
): Phaser.Game => {
  class DemoScene extends Phaser.Scene {
    create(): void {
      onReady(this);
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: Color.slate(900),
    parent,
    scene: [DemoScene],
  });

  return game;
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
    const { icon, iconStyle, size, color } = args as {
      icon: IconKey;
      iconStyle: IconStyle;
      size: number;
      color: string;
    };
    removeContainer();
    const root = createContainer();

    if ((window as unknown as WindowWithGame).game) {
      console.log('destroying game');
      disposeGame((window as unknown as WindowWithGame).game);
    }

    const iconElement = document.createElement('i');
    iconElement.className = `fa-${iconStyle} fa-${icon}`;
    iconElement.style.fontSize = '32px';
    iconElement.style.color = 'white';
    root.appendChild(iconElement);

    let game: Phaser.Game | undefined;
    void loadFont().then(() => {
      game = bootstrap(root, scene => {
        const txt = scene.add.text(300, 100, 'Icons', {
          fontSize: FontSize.css('2xl'),
          color: Color.rgb('white'),
        });
        txt.setOrigin(0.5);

        const i = new IconText({
          scene,
          x: 300,
          y: 200,
          icon: icon,
          iconStyle: iconStyle,
          size: size,
          style: { color: color },
        });
        scene.add.existing(i);

        (window as unknown as WindowWithGame).game = game as Phaser.Game;
      });
    });

    // @ts-expect-error storybook will call this on unmount if present
    root.destroy = (): void => disposeGame(game);

    return root;
  },
};
