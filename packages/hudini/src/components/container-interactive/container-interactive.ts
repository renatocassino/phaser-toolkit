import { GameObjects, Scene } from 'phaser';

/**
 * 
 * @property {Scene} scene - The Phaser scene where this container will be added.
 * @property {number} [x] - The X position of the container. Optional.
 * @property {number} [y] - The Y position of the container. Optional.
 * 
 * @remarks
 * As the Phaser `Container` does not have its own size or support for pointer events,
 * all interactivity (such as pointer events and hit testing) is delegated to the supplied `hitArea`,
 * which must be declared and configured in the parent component. This pattern ensures that interactive
 * behavior is associated with an explicit display object that can be sized and made interactive.
 */
type ContainerInteractiveParams = {
  scene: Scene;
  x?: number;
  y?: number;
}

/**
 * An interactive Container for Phaser that extends `Phaser.GameObjects.Container`.
 * 
 * @template HitArea The type of the hit area object (e.g., `Phaser.GameObjects.Rectangle`).
 * 
 * @remarks
 * The `Phaser.GameObjects.Container` does not inherently have a size or built-in pointer events.
 * Therefore, all interactive functionality (e.g., pointer events like onPointerDown, onPointerUp, hit testing)
 * must be managed via a `hitArea` object, which is supplied and configured by the parent component.
 * This allows developers to define a custom hit area that determines how and where pointer interactivity
 * occurs within the container.
 */
export class ContainerInteractive<HitArea extends Phaser.GameObjects.GameObject = Phaser.GameObjects.Rectangle> extends GameObjects.Container {
  /**
   * The hit area used for managing interactive pointer events.
   * 
   * @remarks
   * As the container itself does not handle pointer events, all pointer event logic will be forwarded
   * to this hit area, which should be a properly configured and interactive Phaser game object.
   */
  protected hitArea?: HitArea;

  /**
   * Creates a new ContainerInteractive instance.
   * 
   * @param {ContainerInteractiveParams<HitArea>} params - Parameter object.
   * @param {Scene} params.scene - The Phaser scene where the container will be added.
   * @param {number} [params.x] - The X position of the container.
   * @param {number} [params.y] - The Y position of the container.
   * @param {HitArea} params.hitArea - The hit area object to manage all interactivity for this container.
   * 
   * @remarks
   * Since this container does not have its own size or interactivity, all event handling must be attached
   * to the provided hit area.
   */
  constructor({ scene, x, y }: ContainerInteractiveParams) {
    super(scene, x, y);
  }

  public override on(event: string | symbol, fn: (...args: unknown[]) => void, context?: unknown): this {
    if (this.hitArea) {
      (this.hitArea as Phaser.GameObjects.GameObject).on(event, fn, context);
      return this;
    }
    return super.on(event, fn, context);
  }

  public override off(event: string | symbol, fn?: (...args: unknown[]) => void, context?: unknown, once?: boolean): this {
    if (this.hitArea) {
      (this.hitArea as Phaser.GameObjects.GameObject).off(event, fn, context, once);
      return this;
    }
    return super.off(event, fn, context, once);
  }

  public override once(event: string | symbol, fn: (...args: unknown[]) => void, context?: unknown): this {
    if (this.hitArea) {
      (this.hitArea as Phaser.GameObjects.GameObject).once(event, fn, context);
      return this;
    }
    return super.once(event, fn, context);
  }

  public override setInteractive(hitArea?: Phaser.Types.Input.InputConfiguration | unknown, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean): this {
    if (this.hitArea) {
      (this.hitArea as Phaser.GameObjects.GameObject).setInteractive(hitArea, callback, dropZone);
      return this;
    }
    return super.setInteractive(hitArea, callback, dropZone);
  }

  public override setSize(width: number, height: number): this {
    if (this.hitArea && 'setSize' in this.hitArea) {
      (this.hitArea as unknown as { setSize: (width: number, height: number) => void }).setSize(width, height);
      return this;
    }
    return super.setSize(width, height);
  }

  // @ts-expect-error - width is a property in Container, but we override it here
  public override get width(): number {
    if (this.hitArea && 'width' in this.hitArea) {
      return (this.hitArea as unknown as { width: number }).width;
    }
    return 0;
  }

  // @ts-expect-error - height is a property in Container, but we override it here
  public override get height(): number {
    if (this.hitArea && 'height' in this.hitArea) {
      return (this.hitArea as unknown as { height: number }).height;
    }
    return 0;
  }

  public override set width(width: number) {
    if (this.hitArea && 'width' in this.hitArea) {
      (this.hitArea as unknown as { width: number }).width = width;
    }
  }

  public override set height(height: number) {
    if (this.hitArea && 'height' in this.hitArea) {
      (this.hitArea as unknown as { height: number }).height = height;
    }
  }
}
