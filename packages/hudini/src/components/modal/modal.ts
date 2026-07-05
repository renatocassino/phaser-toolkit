/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { type IconKey } from 'font-awesome-for-phaser';
import { GameObjects, Scene } from 'phaser';
import {
  Color,
  Column,
  Ease,
  PhaserWindPlugin,
  Row,
  type ColorKey,
  type ColorToken,
  type FontKey,
  type RadiusKey,
  type SpacingKey,
} from 'phaser-wind';

import { type ButtonVariant } from '../../utils/button-style';
import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { IconButton } from '../icon-button';
import { Overlay } from '../overlay';
import { Text } from '../text';
import { TextButton } from '../text-button';

/**
 * One action button rendered in the modal footer. Actions are laid out
 * left-to-right in a row aligned to the right edge; the LAST action is
 * treated as the primary CTA (variant `'filled'`) and the rest are secondary
 * (variant `'outline'`) unless overridden.
 */
export type ModalAction = {
  /** Button label. */
  label: string;
  /** Called on click. Modal does NOT auto-close — call `modal.close()` yourself if desired. */
  onClick: () => void;
  /** Overrides the auto-assigned primary/secondary variant. */
  variant?: 'filled' | 'outline';
  /** Overrides the auto-assigned color. */
  color?: ColorToken | string;
};

/**
 * Visual customization for the top-right close button. `showCloseButton`
 * controls whether it's rendered at all; this object tweaks its appearance
 * when it is shown. All fields are optional and merged with sensible defaults.
 */
export type ModalCloseButtonConfig = {
  /** Font Awesome icon key. Defaults to `'xmark'`. */
  icon?: IconKey;
  /**
   * Icon/border color. Accepts the same palette family names as IconButton
   * (`'gray'`, `'blue'`, `'red-500'`, …). Defaults to `'gray'`.
   */
  color?: Omit<ColorKey, 'black' | 'white'>;
  /** Icon size in pixels. Defaults to `14`. */
  size?: number;
  /** `'outline'` (default) or `'filled'`. */
  variant?: ButtonVariant;
};

/**
 * Named modal widths. Height auto-fits the content.
 * - `'sm'` — 320px (compact confirmations).
 * - `'md'` — 480px (default, standard dialog).
 * - `'lg'` — 640px (rich content, forms).
 * - `{ width }` — explicit pixel width for custom sizing.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | { width: number };

/**
 * Friendly key names accepted by `keysToClose`. Case-insensitive strings
 * mapped internally to `KeyboardEvent.key`. Common shortcuts:
 * `'ESC'`, `'ENTER'`, `'SPACE'`, single letters (`'C'`, `'Y'`).
 */
export type ModalKey = string;

export type ModalParams = {
  /** Phaser scene where the modal will be added. */
  scene: Scene;

  // ---------- Preset content (95% case) ----------

  /** Modal title. Rendered at the top of the header, bold. */
  title?: string;
  /** Supporting description below the title. Regular weight, smaller. */
  description?: string;
  /**
   * Optional media (image/sprite/container) shown ABOVE the header. You are
   * responsible for its size — Modal just places it at the top of the card
   * with the standard content padding.
   */
  media?: GameObjects.GameObject;
  /**
   * Footer action buttons. Rendered right-aligned in a row. The LAST entry
   * is auto-assigned the primary variant (filled); the rest are secondary
   * (outline). Actions do NOT auto-close the modal.
   */
  actions?: ModalAction[];

  // ---------- Slots (custom composition) ----------

  /** Custom header GameObject — overrides `title` + `description`. */
  header?: GameObjects.GameObject;
  /** Custom body GameObject — content between header and footer. */
  body?: GameObjects.GameObject;
  /** Custom footer GameObject — overrides `actions`. */
  footer?: GameObjects.GameObject;

  // ---------- Sizing / styling ----------

  /** Modal width. Defaults to `'md'` (480px). */
  size?: ModalSize;
  /** Card background color. Defaults to `'white'`. */
  backgroundColor?: ColorToken | string;
  /** Card border radius. Defaults to `'lg'`. */
  borderRadius?: RadiusKey | number;
  /** Inner content padding. Defaults to `'6'` (24px). */
  padding?: SpacingKey | number;
  /** Font family for title/description. Defaults to `'Fredoka'`. */
  font?: FontKey | string;

  // ---------- Behavior (convention-over-config) ----------

  /**
   * Show the X close button in the top-right corner. Defaults to `true`.
   * Disable for forced-choice dialogs (error, critical confirmation).
   */
  showCloseButton?: boolean;
  /**
   * Visual customization for the close button (icon, color, size, variant).
   * Only applied when `showCloseButton` is `true`. Fields are optional and
   * merged with defaults (`icon: 'xmark'`, `color: 'gray'`, `size: 14`,
   * `variant: 'outline'`).
   */
  closeButton?: ModalCloseButtonConfig;
  /**
   * Close when the user clicks the dim overlay. Defaults to `true`.
   * Disable for confirmations you don't want dismissed by accident.
   */
  closeOnOverlayClick?: boolean;
  /**
   * Keyboard keys that dismiss the modal. Defaults to `['ESC']`. Pass `[]`
   * to disable keyboard closing entirely. Case-insensitive; strings map to
   * `KeyboardEvent.key` (`'ESC'` → `'Escape'`, `'SPACE'` → `' '`).
   */
  keysToClose?: ModalKey[];

  // ---------- Callback ----------

  /**
   * Called after the modal has been closed (by X button, overlay click,
   * keyboard, or `modal.close()`). Fires AFTER the exit animation completes,
   * BEFORE the modal is destroyed. Not called if `modal.destroy()` is called
   * directly without a close.
   */
  onClose?: () => void;
};

// -------------------- Constants --------------------

const SIZE_TO_WIDTH: Record<Exclude<ModalSize, { width: number }>, number> = {
  sm: 320,
  md: 480,
  lg: 640,
};

const DEFAULT_SIZE: ModalSize = 'md';
const DEFAULT_BACKGROUND: ColorToken = 'white';
const DEFAULT_RADIUS: RadiusKey = 'lg';
const DEFAULT_PADDING: SpacingKey = '6';
const DEFAULT_FONT = 'Fredoka';

const TITLE_FONT_SIZE = 22;
const DESCRIPTION_FONT_SIZE = 16;
const TITLE_COLOR: ColorToken = 'gray-900';
const DESCRIPTION_COLOR: ColorToken = 'gray-600';

const CONTENT_ROW_GAP = 16;
const FOOTER_BUTTON_GAP = 8;
const HEADER_GAP = 4;

const CLOSE_BUTTON_SIZE = 14;
const CLOSE_BUTTON_INSET = 12;
const CLOSE_BUTTON_COLOR: ColorKey = 'gray';

const PRIMARY_ACTION_COLOR: ColorToken = 'blue-500';
const SECONDARY_ACTION_COLOR: ColorToken = 'gray-500';

const TEXTURE_ANTIALIAS_MARGIN = 1;

// Open/close animation
const OPEN_DURATION_MS = 200;
const CLOSE_DURATION_MS = 150;
const START_SCALE = 0.9;
const CLOSE_END_SCALE = 0.95;

// Friendly key aliases → KeyboardEvent.key value
const KEY_ALIAS: Record<string, string> = {
  ESC: 'Escape',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  RETURN: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
};

// -------------------- Component --------------------

/**
 * Modal — centered dialog with an animated dim overlay, keyboard/click
 * dismissal, and preset slots for title/description/media/actions. Composes
 * on top of the Overlay primitive.
 *
 * Constructor sets it up invisible; call `modal.open()` to fade in. It is
 * destroyed after `modal.close()` completes.
 *
 * @example
 * const modal = new Modal({
 *   scene,
 *   title: 'Delete save?',
 *   description: 'This cannot be undone.',
 *   actions: [
 *     { label: 'Cancel', onClick: () => modal.close() },
 *     { label: 'Delete', onClick: () => { deleteSave(); modal.close(); } },
 *   ],
 * });
 * modal.open();
 */
export class Modal extends GameObjects.Container {
  /** Underlying dim overlay. */
  public overlay!: Overlay;
  /** Card background sprite. */
  public backgroundSprite!: GameObjects.Sprite;
  /** Column composing media/header/body/footer. */
  public contentColumn!: Column;
  /** X button (top-right). Only present when `showCloseButton` is `true`. */
  public closeButton: IconButton | undefined;

  private pw: PhaserWindPlugin<{}>;

  // Resolved config
  private cardWidth: number;
  private paddingPx: number;
  private borderRadiusPx: number;
  private backgroundColorValue: string;
  private fontFamily: string;
  private closeOnOverlayClick: boolean;
  private keysToClose: string[];
  private onCloseCallback: (() => void) | undefined;

  // State
  private isOpen: boolean = false;
  private isAnimating: boolean = false;
  private cardHeight: number = 0;
  private keydownHandler: ((event: KeyboardEvent) => void) | undefined;

  constructor(params: ModalParams) {
    const { scene } = params;
    const cam = scene.cameras.main;
    super(scene, cam.width / 2, cam.height / 2);

    this.pw = getPWFromScene(scene);

    this.cardWidth = Modal.resolveWidth(params.size ?? DEFAULT_SIZE);
    this.paddingPx = Modal.resolvePadding(this.pw, params.padding);
    this.borderRadiusPx = Modal.resolveRadius(this.pw, params.borderRadius);
    this.backgroundColorValue = Color.rgb(
      (params.backgroundColor ?? DEFAULT_BACKGROUND) as ColorToken
    );
    this.fontFamily = Modal.resolveFont(this.pw, params.font);
    this.closeOnOverlayClick = params.closeOnOverlayClick ?? true;
    this.keysToClose = (params.keysToClose ?? ['ESC']).map((k): string =>
      Modal.normalizeKey(k)
    );
    this.onCloseCallback = params.onClose;

    this.createOverlay(scene);
    this.buildContent(scene, params);
    this.createBackgroundSprite(scene);
    this.arrangeChildren();
    this.createCloseButton(
      scene,
      params.showCloseButton ?? true,
      params.closeButton
    );

    // Start invisible + slightly shrunk for pop-in animation.
    this.setAlpha(0);
    this.setScale(START_SCALE);
    this.setDepth(this.pw.depth.value('modal'));
    this.setScrollFactor(0);

    scene.add.existing(this);
  }

  /** Open the modal — fades in overlay + pops the card. Idempotent while open. */
  public open(): Promise<void> {
    if (this.isOpen || this.isAnimating) return Promise.resolve();
    this.isOpen = true;
    this.isAnimating = true;
    this.attachKeyboardListener();

    const overlayPromise = this.overlay.open();
    const cardPromise = new Promise<void>((resolve): void => {
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: OPEN_DURATION_MS,
        ease: Ease.value('back-out'),
        onComplete: (): void => {
          this.isAnimating = false;
          resolve();
        },
      });
    });

    return Promise.all([overlayPromise, cardPromise]).then((): void => undefined);
  }

  /**
   * Close the modal — reverses the animation and destroys the instance.
   * Fires `onClose` after the exit animation completes. Idempotent.
   */
  public close(): Promise<void> {
    if (!this.isOpen) return Promise.resolve();
    this.isOpen = false;
    this.isAnimating = true;
    this.detachKeyboardListener();

    const overlayPromise = this.overlay.close();
    const cardPromise = new Promise<void>((resolve): void => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: CLOSE_END_SCALE,
        scaleY: CLOSE_END_SCALE,
        duration: CLOSE_DURATION_MS,
        ease: Ease.value('out'),
        onComplete: (): void => resolve(),
      });
    });

    return Promise.all([overlayPromise, cardPromise]).then((): void => {
      this.isAnimating = false;
      this.onCloseCallback?.();
      this.destroy();
    });
  }

  /** `true` while the modal is open (between `open()` start and `close()` end). */
  public get opened(): boolean {
    return this.isOpen;
  }

  public override destroy(): void {
    this.detachKeyboardListener();
    this.overlay?.destroy();
    super.destroy();
  }

  // -------------------- Construction helpers --------------------

  private createOverlay(scene: Scene): void {
    this.overlay = new Overlay({
      scene,
      interactive: true,
      onClick: (): void => {
        if (this.closeOnOverlayClick && this.isOpen && !this.isAnimating) {
          void this.close();
        }
      },
    });
  }

  private buildContent(scene: Scene, params: ModalParams): void {
    const contentWidth = this.cardWidth - this.paddingPx * 2;
    const sections: GameObjects.GameObject[] = [];

    if (params.media) sections.push(params.media);

    const header = params.header ?? this.buildDefaultHeader(scene, params, contentWidth);
    if (header) sections.push(header);

    if (params.body) sections.push(params.body);

    const footer = params.footer ?? this.buildDefaultFooter(scene, params.actions);
    if (footer) sections.push(footer);

    this.contentColumn = new Column({
      scene,
      x: 0,
      y: 0,
      gap: CONTENT_ROW_GAP,
      align: 'center',
      children: sections,
    });
  }

  private buildDefaultHeader(
    scene: Scene,
    params: ModalParams,
    _contentWidth: number
  ): GameObjects.GameObject | undefined {
    if (!params.title && !params.description) return undefined;

    const items: GameObjects.GameObject[] = [];
    if (params.title) {
      const title = new Text({
        scene,
        x: 0,
        y: 0,
        text: params.title,
        size: TITLE_FONT_SIZE,
        fontFamily: this.fontFamily,
        strokeThickness: 0,
      });
      title.setColor(Color.rgb(TITLE_COLOR));
      title.setOrigin(0.5, 0.5);
      items.push(title);
    }
    if (params.description) {
      const desc = new Text({
        scene,
        x: 0,
        y: 0,
        text: params.description,
        size: DESCRIPTION_FONT_SIZE,
        fontFamily: this.fontFamily,
        strokeThickness: 0,
      });
      desc.setColor(Color.rgb(DESCRIPTION_COLOR));
      desc.setOrigin(0.5, 0.5);
      items.push(desc);
    }

    if (items.length === 1) return items[0];

    return new Column({
      scene,
      x: 0,
      y: 0,
      gap: HEADER_GAP,
      align: 'center',
      children: items,
    });
  }

  private buildDefaultFooter(
    scene: Scene,
    actions: ModalAction[] | undefined
  ): GameObjects.GameObject | undefined {
    if (!actions || actions.length === 0) return undefined;

    const buttons = actions.map((action, index): TextButton => {
      const isLast = index === actions.length - 1;
      const variant = action.variant ?? (isLast ? 'filled' : 'outline');
      const color =
        action.color ?? (isLast ? PRIMARY_ACTION_COLOR : SECONDARY_ACTION_COLOR);
      return new TextButton({
        scene,
        x: 0,
        y: 0,
        text: action.label,
        color,
        variant,
        onClick: action.onClick,
      });
    });

    return new Row({
      scene,
      x: 0,
      y: 0,
      gap: FOOTER_BUTTON_GAP,
      align: 'center',
      children: buttons,
    });
  }

  private createBackgroundSprite(scene: Scene): void {
    const height = this.measureContentHeight() + this.paddingPx * 2;
    this.cardHeight = height;
    const textureKey = this.createBackgroundTexture(scene, this.cardWidth, height);
    this.backgroundSprite = scene.add.sprite(0, 0, textureKey);
    this.backgroundSprite.setOrigin(0.5, 0.5);
    this.addAt(this.backgroundSprite, 0);
  }

  private arrangeChildren(): void {
    this.add(this.contentColumn);
    this.contentColumn.setPosition(0, 0);
  }

  private createCloseButton(
    scene: Scene,
    show: boolean,
    config: ModalCloseButtonConfig | undefined
  ): void {
    if (!show) return;
    const btn = new IconButton({
      scene,
      x: this.cardWidth / 2 - CLOSE_BUTTON_INSET,
      y: -this.cardHeight / 2 + CLOSE_BUTTON_INSET,
      icon: config?.icon ?? 'xmark',
      size: config?.size ?? CLOSE_BUTTON_SIZE,
      color: config?.color ?? CLOSE_BUTTON_COLOR,
      variant: config?.variant ?? 'outline',
      onClick: (): void => {
        if (this.isOpen && !this.isAnimating) void this.close();
      },
    });
    this.closeButton = btn;
    this.add(btn);
  }

  private measureContentHeight(): number {
    // Column measures children via layout(); read its computed height.
    const { height } = this.contentColumn as unknown as { height: number };
    return typeof height === 'number' ? height : 0;
  }

  private createBackgroundTexture(
    scene: Scene,
    width: number,
    height: number
  ): string {
    const key = `modal_bg_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;
    if (scene.textures.exists(key)) return key;

    const graphics = scene.add.graphics();
    const pad = TEXTURE_ANTIALIAS_MARGIN;
    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const finalRadius = Math.max(0, Math.min(this.borderRadiusPx, maxRadius));

    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    graphics.fillRoundedRect(pad, pad, width, height, finalRadius);
    graphics.generateTexture(key, width + pad * 2, height + pad * 2);
    graphics.destroy();

    return key;
  }

  // -------------------- Keyboard --------------------

  private attachKeyboardListener(): void {
    if (this.keysToClose.length === 0) return;
    const keyboard = this.scene.input?.keyboard;
    if (!keyboard) return;
    const handler = (event: KeyboardEvent): void => {
      if (!this.isOpen || this.isAnimating) return;
      if (this.keysToClose.includes(event.key)) {
        event.preventDefault();
        void this.close();
      }
    };
    this.keydownHandler = handler;
    keyboard.on('keydown', handler);
  }

  private detachKeyboardListener(): void {
    if (!this.keydownHandler) return;
    const keyboard = this.scene.input?.keyboard;
    keyboard?.off('keydown', this.keydownHandler);
    this.keydownHandler = undefined;
  }

  // -------------------- Static resolvers --------------------

  private static resolveWidth(size: ModalSize): number {
    if (typeof size === 'object') return size.width;
    return SIZE_TO_WIDTH[size];
  }

  private static resolvePadding(
    pw: PhaserWindPlugin<{}>,
    padding: SpacingKey | number | undefined
  ): number {
    if (typeof padding === 'number') return padding;
    return pw.spacing.px((padding ?? DEFAULT_PADDING) as SpacingKey);
  }

  private static resolveRadius(
    pw: PhaserWindPlugin<{}>,
    radius: RadiusKey | number | undefined
  ): number {
    if (typeof radius === 'number') return radius;
    return pw.radius.px((radius ?? DEFAULT_RADIUS) as RadiusKey);
  }

  private static resolveFont(
    pw: PhaserWindPlugin<{}>,
    font: FontKey | string | undefined
  ): string {
    if (!font) return DEFAULT_FONT;
    if (typeof font === 'string') return font;
    return pw.font.family(font);
  }

  private static normalizeKey(key: string): string {
    const upper = key.toUpperCase();
    return KEY_ALIAS[upper] ?? key;
  }
}
