import { GameObjects, Scene } from 'phaser';
import {
  Color,
  Duration,
  Ease,
  PhaserWindPlugin,
  type ColorKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

export type OverlayParams = {
  /** Phaser scene where the overlay will be added. */
  scene: Scene;
  /**
   * Dim color. Accepts a palette family (`'black'`), a full token
   * (`'gray-900'`), a theme key, or a CSS hex string. Defaults to `'black'`.
   */
  color?: ColorKey | string;
  /**
   * Final alpha after fade-in. Values in the range 0..1. Defaults to `0.6` —
   * enough to darken the background without hiding it entirely.
   */
  alpha?: number;
  /**
   * setDepth() value applied to the overlay rectangle. Defaults to
   * `pw.depth.value('overlay')`.
   */
  depth?: number;
  /**
   * If `true`, clicking the overlay calls `onClick`. Defaults to `true`.
   * Set to `false` for non-dismissable overlays (loading screens,
   * transitions).
   */
  interactive?: boolean;
  /** Click handler. Only invoked when `interactive` is `true`. */
  onClick?: () => void;
  /** Fade-in duration in ms. Defaults to `Duration.ms('200')` (200ms). */
  fadeInDuration?: number;
  /** Fade-out duration in ms. Defaults to `Duration.ms('200')` (200ms). */
  fadeOutDuration?: number;
};

const DEFAULT_ALPHA = 0.6;

/**
 * Overlay — a fullscreen dim rectangle anchored to the camera. Used as the
 * backdrop for modals, drawers, loading screens, tutorial dims, and any
 * "interrupt the world" moment.
 *
 * Overlay sits at `depth.overlay` by default so it stays above HUD content
 * but below modals/tooltips. Fade-in/out animation is built in — call
 * `open()` after construction to fade to the target alpha, and `close()`
 * to fade back to 0.
 *
 * @example
 * const overlay = new Overlay({ scene, onClick: () => overlay.close() });
 * await overlay.open();
 *
 * @example
 * // Loading screen dim — non-dismissable.
 * const loading = new Overlay({ scene, alpha: 0.8, interactive: false });
 * await loading.open();
 * // ...load assets...
 * await loading.close();
 * loading.destroy();
 */
export class Overlay extends GameObjects.Container {
  /** The underlying dim rectangle. */
  public rect!: GameObjects.Rectangle;

  private pw: PhaserWindPlugin<{}>;
  private targetAlpha: number;
  private fadeInMs: number;
  private fadeOutMs: number;
  private onClickCallback: (() => void) | undefined;
  private activeTween: Phaser.Tweens.Tween | undefined;

  constructor({
    scene,
    color = 'black',
    alpha = DEFAULT_ALPHA,
    depth,
    interactive = true,
    onClick,
    fadeInDuration,
    fadeOutDuration,
  }: OverlayParams) {
    super(scene, 0, 0);
    this.pw = getPWFromScene(scene);

    this.targetAlpha = alpha;
    this.fadeInMs = fadeInDuration ?? Duration.ms('200');
    this.fadeOutMs = fadeOutDuration ?? Duration.ms('200');
    this.onClickCallback = onClick;

    const cam = scene.cameras.main;
    this.rect = scene.add.rectangle(
      cam.width / 2,
      cam.height / 2,
      cam.width,
      cam.height,
      Color.hex(color as ColorKey)
    );
    this.rect.setScrollFactor(0);
    this.rect.setAlpha(0);
    this.add(this.rect);

    const resolvedDepth = depth ?? this.pw.depth.value('overlay');
    this.setDepth(resolvedDepth);

    if (interactive) {
      this.rect.setInteractive({ useHandCursor: false });
      this.rect.on('pointerdown', (): void => {
        this.onClickCallback?.();
      });
    }

    scene.add.existing(this);
  }

  /** Fade in to the target alpha. Resolves when the tween finishes. */
  public open(): Promise<void> {
    this.killActiveTween();
    return new Promise((resolve): void => {
      this.activeTween = this.scene.tweens.add({
        targets: this.rect,
        alpha: this.targetAlpha,
        duration: this.fadeInMs,
        ease: Ease.value('out'),
        onComplete: (): void => {
          this.activeTween = undefined;
          resolve();
        },
      });
    });
  }

  /** Fade back to 0. Resolves when the tween finishes. */
  public close(): Promise<void> {
    this.killActiveTween();
    return new Promise((resolve): void => {
      this.activeTween = this.scene.tweens.add({
        targets: this.rect,
        alpha: 0,
        duration: this.fadeOutMs,
        ease: Ease.value('out'),
        onComplete: (): void => {
          this.activeTween = undefined;
          resolve();
        },
      });
    });
  }

  /** Replace the click handler. Pass `undefined` to clear it. */
  public setOnClick(callback: (() => void) | undefined): this {
    this.onClickCallback = callback;
    return this;
  }

  public override destroy(): void {
    this.killActiveTween();
    super.destroy();
  }

  private killActiveTween(): void {
    if (this.activeTween) {
      this.activeTween.stop();
      this.activeTween = undefined;
    }
  }
}
