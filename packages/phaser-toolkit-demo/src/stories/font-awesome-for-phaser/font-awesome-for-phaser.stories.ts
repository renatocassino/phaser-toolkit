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

type WindowWithPhaser = Window & {
  __phaserGame?: Phaser.Game;
  __phaserScene?: PreviewScene;
  __faLoaded?: boolean;
};

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

const createContainer = (): HTMLDivElement => {
  const root = document.getElementById('phaser-story');
  if (root) {
    return root as HTMLDivElement;
  }

  const container = document.createElement('div');
  container.id = 'phaser-story';
  container.style.width = '600px';
  container.style.height = '400px';
  container.style.border = '1px solid #333';
  container.style.background = '#111';
  return container;
};

// Removed custom Docs HTML/highlight; using Storybook Docs source block

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
    });

    w.__phaserGame.events.once(Phaser.Core.Events.READY, () => {
      w.__phaserScene = w.__phaserGame?.scene.getScene(
        'preview'
      ) as PreviewScene;
    });
  }

  return w.__phaserGame;
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
    const root = createContainer();

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
    })();

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
