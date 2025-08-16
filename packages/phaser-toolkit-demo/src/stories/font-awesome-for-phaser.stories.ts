/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
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

type WindowWithPhaser = Window & {
  __phaserGame?: Phaser.Game;
  __phaserScene?: PreviewScene;
  __faLoaded?: boolean;
};

const meta: Meta = {
  title: 'Font Awesome For Phaser/IconText',
  parameters: {
    docs: {
      description: {
        component:
          'Render Font Awesome icons in Phaser via font. Load the fonts with `loadFont()` and use `IconText`. See the example below.',
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

const createDocWrapper = (): HTMLDivElement => {
  const docId = 'phaser-story-doc';
  let docWrap = document.getElementById(docId) as HTMLDivElement | null;
  if (!docWrap) {
    docWrap = document.createElement('div');
    docWrap.id = docId;
    docWrap.style.padding = '12px';
    docWrap.style.color = '#e5e7eb';
    docWrap.style.fontFamily =
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    docWrap.style.background = '#0b1220';
    docWrap.style.borderTop = '1px solid #1f2937';
  }
  return docWrap;
};

const createTitle = (docWrap: HTMLDivElement): HTMLDivElement => {
  const titleId = 'phaser-story-doc-title';
  let title = document.getElementById(titleId) as HTMLDivElement | null;
  if (!title) {
    title = document.createElement('div');
    title.id = titleId;
    title.style.fontWeight = '600';
    title.style.marginBottom = '6px';
    docWrap.appendChild(title);
  }
  title.textContent = 'Usage:';
  return title;
};

const createCodeBlock = (docWrap: HTMLDivElement): HTMLElement => {
  const preId = 'phaser-story-doc-pre';
  let pre = document.getElementById(preId) as HTMLPreElement | null;
  if (!pre) {
    pre = document.createElement('pre');
    pre.id = preId;
    pre.style.margin = '0';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.overflowX = 'auto';
    docWrap.appendChild(pre);
  }

  const codeId = 'phaser-story-doc-code';
  let code = document.getElementById(codeId) as HTMLElement | null;
  if (!code) {
    code = document.createElement('code');
    code.id = codeId;
    code.className = 'language-typescript';
    pre.appendChild(code);
  }
  return code;
};

const loadHighlightJS = (code: HTMLElement): void => {
  const styleId = 'hljs-style';
  if (!document.getElementById(styleId)) {
    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    document.head.appendChild(link);
  }

  const scriptId = 'hljs-script';
  const applyHighlight = (): void => {
    // @ts-expect-error global from hljs
    if (window.hljs && code) window.hljs.highlightElement(code);
  };

  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = applyHighlight;
    document.body.appendChild(script);
    applyHighlight();
  } else {
    applyHighlight();
  }
};

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

    // Ensure a single docs block that can be updated across re-renders
    const docWrap = createDocWrapper();
    createTitle(docWrap);
    const code = createCodeBlock(docWrap);

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

      // Append or move the docs block to be after the Phaser canvas
      if (docWrap && docWrap.parentElement !== root) {
        root.appendChild(docWrap);
      } else if (docWrap && docWrap.parentElement === root) {
        // Move to the end to ensure it's after canvas
        root.appendChild(docWrap);
      }
    })();

    code.textContent = `import { IconText, loadFont } from 'font-awesome-for-phaser';

await loadFont().then(() => {
  new Phaser.Game({ /** parameters here */ });
});

// CustomScene.ts - inside your Scene
const icon = new IconText({
  scene: this,
  x: 300,
  y: 200,
  icon: '${String(args['icon'] ?? 'gamepad')}',
  iconStyle: '${String(args['iconStyle'] ?? 'solid')}', // 'solid' | 'regular' | 'brands'
  size: ${Number.isFinite(Number(args['size'])) ? Number(args['size']) : 64},
  style: { color: '${String(args['color'] ?? '#ffffff')}' },
});
this.add.existing(icon);`;

    // Load highlight.js once and highlight this block
    loadHighlightJS(code);

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
