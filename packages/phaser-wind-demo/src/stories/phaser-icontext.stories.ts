/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/html';
import {
  IconKey,
  IconStyle,
  IconText,
  loadFont,
} from 'font-awesome-for-phaser';
import Phaser from 'phaser';
import { Color, FontSize } from 'phaser-wind';

const meta: Meta = {
  title: 'Phaser/IconText',
};

export default meta;

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

export const Basic: StoryObj = {
  render: () => {
    const root = createContainer();

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-house';
    icon.style.fontSize = '32px';
    icon.style.color = 'white';
    root.appendChild(icon);

    const iconRegular = document.createElement('i');
    iconRegular.className = 'fa-regular fa-house';
    iconRegular.style.fontSize = '32px';
    iconRegular.style.color = 'white';
    root.appendChild(iconRegular);

    const iconBrands = document.createElement('i');
    iconBrands.className = 'fa-brands fa-github';
    iconBrands.style.fontSize = '32px';
    iconBrands.style.color = 'white';
    root.appendChild(iconBrands);

    let game: Phaser.Game | undefined;
    void loadFont().then(() => {
      game = bootstrap(root, scene => {
        const txt = scene.add.text(300, 100, 'Icons', {
          fontSize: FontSize.css('2xl'),
          color: Color.rgb('white'),
        });
        txt.setOrigin(0.5);

        const icons: Array<{ icon: IconKey; iconStyle: IconStyle }> = [
          { icon: 'house', iconStyle: 'solid' },
          { icon: 'house', iconStyle: 'regular' },
          { icon: 'github', iconStyle: 'brands' },
        ];

        icons.forEach(({ icon, iconStyle }, index) => {
          const i = new IconText({
            scene,
            x: 300,
            y: 200 + index * 40,
            icon,
            iconStyle,
          });
          scene.add.existing(i);
        });
      });
    });

    // @ts-expect-error storybook will call this on unmount if present
    root.destroy = (): void => disposeGame(game);

    return root;
  },
};
