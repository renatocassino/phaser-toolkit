import { GameObjects, Scene } from 'phaser';
import {
  Color,
  PhaserWindPlugin,
  type ColorKey,
  type RadiusKey,
  type SpacingKey,
  getDisplayHeightOf,
  getDisplayWidthOf
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';
import { ContainerInteractive } from '../container-interactive';

export type CardParams = {
  /** The Phaser scene to add the card to */
  scene: Scene;
  /** X position of the card */
  x: number;
  /** Y position of the card */
  y: number;
  /** Background color of the card. Defaults to 'white'. */
  backgroundColor?: ColorKey | string;
  /** Border radius in px (number) or a Phaser Wind radius token (string). Defaults to 'md'. */
  borderRadius?: RadiusKey | number;
  /** Margin/padding in px (number) or a Phaser Wind spacing token (string). Defaults to '4'. */
  margin?: SpacingKey | number;
  /** Child component to be contained within the card */
  child?: GameObjects.GameObject;
  /** Width of the card in pixels */
  width?: number;
  /** Height of the card in pixels */
  height?: number;
};

/**
 * Extra transparent margin around the drawn card inside its texture, just
 * enough so the anti-aliased rounded-corner fill isn't clipped at the edge.
 * The container itself is resized to the *visual* box, so this margin never
 * leaks into layout measurements.
 */
const TEXTURE_ANTIALIAS_MARGIN = 1;

/**
 * A flexible card component that adapts to its child content size
 */
export class Card extends ContainerInteractive<Phaser.GameObjects.Sprite> {
  /** The background sprite of the card. */
  public backgroundSprite!: GameObjects.Sprite;
  /** The child component contained within the card */
  public child: GameObjects.GameObject | undefined;

  /** Reference to the PhaserWind plugin */
  private pw: PhaserWindPlugin<{}>;
  /** Margin size in pixels */
  private marginPx!: number;
  /** Border radius in pixels */
  private borderRadiusPx!: number;
  /** Background color value */
  private backgroundColorValue!: string;

  /** Whether we have an explicit size set (width and height provided) */
  private hasExplicitSize: boolean = false;
  /**
   * Cached explicit width/height. We can't rely on `this.width` / `this.height`
   * during initial sprite creation because `ContainerInteractive` proxies them
   * through `hitArea`, which isn't assigned yet in the constructor. Reading
   * `this.width` before `hitArea` is set returns 0, so we keep the requested
   * dimensions here and consult them in {@link getCardDimensions}.
   */
  private explicitWidth: number | undefined;
  private explicitHeight: number | undefined;

  /**
   * Creates a new Card
   * @param params Configuration parameters for the card
   */
  constructor({
    scene,
    x,
    y,
    backgroundColor = 'white',
    borderRadius = 'md',
    margin = '4',
    child,
    width,
    height,
  }: CardParams) {
    super({ scene, x, y });
    this.pw = getPWFromScene(scene);

    // Store values
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.backgroundColorValue = Color.rgb(backgroundColor as ColorKey);

    // Store child reference
    this.child = child;

    // Check if explicit size was provided
    this.hasExplicitSize = width !== undefined && height !== undefined;
    this.explicitWidth = width;
    this.explicitHeight = height;

    // Create sprite and setup container
    this.createBackgroundSprite(scene);
    this.setupContainer();

    this.hitArea = this.backgroundSprite;

    // Now that hitArea is set, publish the explicit dimensions through the
    // proxy so that consumers reading `card.width` / `card.height` (Row,
    // Column, Stack, ...) see the real box, not 0.
    if (this.hasExplicitSize) {
      this.backgroundSprite.width = this.explicitWidth as number;
      this.backgroundSprite.height = this.explicitHeight as number;
    }
  }
  /**
   * Override setSize to regenerate sprites when size changes
   * @param width Width in pixels
   * @param height Height in pixels
   * @returns this for chaining
   */
  public override setSize(width: number, height: number): this {
    // Mark that we now have explicit size
    this.hasExplicitSize = true;
    this.explicitWidth = width;
    this.explicitHeight = height;
    // Set size directly on the container to avoid recursion
    this.width = width;
    this.height = height;
    // Regenerate sprites with new size
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the width of the card. Useful when you want to set a fixed width without a child component.
   * @param width Width in pixels
   * @returns this for chaining
   */
  public setWidth(width: number): this {
    this.setSize(width, this.height);
    return this;
  }

  /**
   * Sets the height of the card. Useful when you want to set a fixed height without a child component.
   * @param height Height in pixels
   * @returns this for chaining
   */
  public setHeight(height: number): this {
    this.setSize(this.width, height);
    return this;
  }

  /**
   * Sets the background color of the card
   * @param color Background color token or string
   * @returns this for chaining
   */
  public setBackgroundColor(color: ColorKey | string): this {
    this.backgroundColorValue = Color.rgb(color as ColorKey);
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the border radius of the card
   * @param borderRadius Border radius (number in px or RadiusKey)
   * @returns this for chaining
   */
  public setBorderRadius(borderRadius: RadiusKey | number): this {
    this.borderRadiusPx =
      typeof borderRadius === 'number'
        ? borderRadius
        : this.pw.radius.px(borderRadius ?? ('md' as RadiusKey));
    this.regenerateSprites();
    return this;
  }

  /**
   * Sets the margin/padding of the card
   * @param margin Margin size (number in px or SpacingKey)
   * @returns this for chaining
   */
  public setMargin(margin: SpacingKey | number): this {
    this.marginPx =
      typeof margin === 'number'
        ? margin
        : this.pw.spacing.px(margin ?? ('4' as SpacingKey));
    this.layout();
    return this;
  }

  /**
   * Sets a new child component for the card
   * @param child New child component
   * @returns this for chaining
   */
  public setChild(child: GameObjects.GameObject): this {
    // Remove old child
    if (this.child) {
      this.remove(this.child);
    }

    // Set new child
    this.child = child;

    // Update layout
    this.layout();

    return this;
  }

  /**
   * Creates the background sprite for the card.
   * @param scene Phaser scene.
   */
  private createBackgroundSprite(scene: Scene): void {
    const backgroundTexture = this.createBackgroundTexture(scene);
    this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
    this.backgroundSprite.setOrigin(0.5, 0.5);
  }

  /**
   * Regenerates the background texture based on current state.
   */
  private regenerateSprites(): void {
    const backgroundTexture = this.createBackgroundTexture(this.scene);
    this.backgroundSprite.setTexture(backgroundTexture);
  }

  /**
   * Sets up the container with background and child
   */
  private setupContainer(): void {
    this.add([this.backgroundSprite]);
    if (this.child) {
      this.add([this.child]);
    }
    // Only call layout if we don't have explicit size
    if (!this.hasExplicitSize) {
      this.layout();
    }
  }

  /**
   * Updates the layout after property changes
   */
  public layout(): void {
    if (!this.child) {
      return;
    }

    // Get child bounds using type assertion
    const childBounds = (
      this.child as unknown as {
        getBounds: () => { width: number; height: number };
      }
    ).getBounds();

    // Calculate card dimensions with margin
    const cardWidth = childBounds.width + this.marginPx * 2;
    const cardHeight = childBounds.height + this.marginPx * 2;

    // Check if child has origin property and get its current origin
    const childOrigin = this.getChildOrigin();

    // Calculate child position considering its origin
    const childX = this.calculateChildX(
      cardWidth,
      childBounds.width,
      childOrigin
    );
    const childY = this.calculateChildY(
      cardHeight,
      childBounds.height,
      childOrigin
    );

    // Set size directly (don't use setSize to avoid marking as explicit size)
    this.width = cardWidth;
    this.height = cardHeight;
    // Regenerate sprites with new dimensions
    this.regenerateSprites();

    // Position child in the center of the card
    (
      this.child as unknown as { setPosition: (x: number, y: number) => void }
    ).setPosition(childX, childY);
  }

  /**
   * Gets the child's origin if it exists
   * @returns Object with x and y origin values, or null if not available
   */
  private getChildOrigin(): { x: number; y: number } | null {
    // Check if child has origin property
    if (this.child && 'originX' in this.child && 'originY' in this.child) {
      return {
        x: (this.child as unknown as { originX: number }).originX,
        y: (this.child as unknown as { originY: number }).originY,
      };
    }

    // Check if child has getOrigin method
    if (
      this.child &&
      typeof (
        this.child as unknown as { getOrigin: () => { x: number; y: number } }
      ).getOrigin === 'function'
    ) {
      const origin = (
        this.child as unknown as { getOrigin: () => { x: number; y: number } }
      ).getOrigin();
      if (
        origin &&
        typeof origin.x === 'number' &&
        typeof origin.y === 'number'
      ) {
        return { x: origin.x, y: origin.y };
      }
    }

    return null;
  }

  /**
   * Calculates the X position for the child considering its origin
   * @param cardWidth Total width of the card
   * @param childWidth Width of the child
   * @param childOrigin Origin of the child (null if not available)
   * @returns X position for the child
   */
  private calculateChildX(
    cardWidth: number,
    childWidth: number,
    childOrigin: { x: number; y: number } | null
  ): number {
    if (this.child && childOrigin) {
      // Consider child's origin for centering
      // If child origin is 0.5 (center), we need to offset by half the child width
      // If child origin is 0 (left), we need to offset by the full child width
      const originOffsetX = childWidth * childOrigin.x;
      return -cardWidth / 2 + this.marginPx + originOffsetX;
    } else {
      // Fallback to default centering (assumes child origin is center)
      return -cardWidth / 2 + this.marginPx;
    }
  }

  /**
   * Calculates the Y position for the child considering its origin
   * @param cardHeight Total height of the card
   * @param childHeight Height of the child
   * @param childOrigin Origin of the child (null if not available)
   * @returns Y position for the child
   */
  private calculateChildY(
    cardHeight: number,
    childHeight: number,
    childOrigin: { x: number; y: number } | null
  ): number {
    if (childOrigin) {
      // Consider child's origin for centering
      // If child origin is 0.5 (center), we need to offset by half the child height
      // If child origin is 0 (top), we need to offset by the full child height
      const originOffsetY = childHeight * childOrigin.y;
      return -cardHeight / 2 + this.marginPx + originOffsetY;
    } else {
      // Fallback to default centering (assumes child origin is center)
      return -cardHeight / 2 + this.marginPx;
    }
  }

  private measureChild(child: Phaser.GameObjects.GameObject): { w: number; h: number } {
    const w = getDisplayWidthOf(child);
    const h = getDisplayHeightOf(child);
    return { w, h };
  }

  /**
   * Calculates the card's width and height based on child and margin.
   * @returns Object with width and height.
   */
  private getCardDimensions(): { width: number; height: number } {
    let width = 0;
    let height = 0;

    if (this.hasExplicitSize) {
      // Prefer the cached constructor/setSize dims — `this.width`/`this.height`
      // depend on `hitArea` being wired, which is not the case on the initial
      // texture generation call during `super`/constructor time.
      width = this.explicitWidth ?? this.width;
      height = this.explicitHeight ?? this.height;
    } else if (this.child) {
      const { w: cw, h: ch } = this.measureChild(this.child as GameObjects.GameObject);
      width = cw + this.marginPx * 2;
      height = ch + this.marginPx * 2;
    } else {
      const DEFAULT_SIZE = 100;
      width = this.width || DEFAULT_SIZE;
      height = this.height || DEFAULT_SIZE;
    }

    return { width, height };
  }

  /**
   * Creates a texture for the card's background: a flat filled rounded rect.
   * @param scene Phaser scene.
   * @returns The texture key.
   */
  private createBackgroundTexture(scene: Scene): string {
    const { width, height } = this.getCardDimensions();
    const textureKey = `card_bg_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;

    const padding = TEXTURE_ANTIALIAS_MARGIN;
    const textureWidth = width + padding * 2;
    const textureHeight = height + padding * 2;

    const graphics = scene.add.graphics();

    const maxRadius = Math.floor(Math.min(width / 2, height / 2));
    const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
    const finalRadius = Math.max(0, effectiveRadius);

    graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
    graphics.fillRoundedRect(padding, padding, width, height, finalRadius);

    graphics.generateTexture(textureKey, textureWidth, textureHeight);
    graphics.destroy();

    return textureKey;
  }
}
