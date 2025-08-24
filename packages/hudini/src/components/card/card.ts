import { GameObjects, Scene } from 'phaser';
import {
    Color,
    PhaserWindPlugin,
    type ColorKey,
    type RadiusKey,
    type SpacingKey,
} from 'phaser-wind';

import { getPWFromScene } from '../../utils/get-pw-from-scene';

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
    child: GameObjects.GameObject;
};

/**
 * A flexible card component that adapts to its child content size
 */
export class Card extends GameObjects.Container {
    /** The background graphics of the card */
    public backgroundGraphics!: GameObjects.Graphics;
    /** The child component contained within the card */
    public child!: GameObjects.GameObject;

    /** Reference to the PhaserWind plugin */
    private pw: PhaserWindPlugin<{}>;
    /** Margin size in pixels */
    private marginPx!: number;
    /** Border radius in pixels */
    private borderRadiusPx!: number;
    /** Background color value */
    private backgroundColorValue!: string;

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
    }: CardParams) {
        super(scene, x, y);
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

        // Create background and setup container
        this.createBackgroundGraphics(scene);
        this.setupContainer();
    }

    /**
     * Sets the background color of the card
     * @param color Background color token or string
     * @returns this for chaining
     */
    public setBackgroundColor(color: ColorKey | string): this {
        this.backgroundColorValue = Color.rgb(color as ColorKey);
        this.drawBackground();
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
        this.drawBackground();
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
        this.updateLayout();
        return this;
    }

    /**
     * Sets a new child component for the card
     * @param child New child component
     * @returns this for chaining
     */
    public setChild(child: GameObjects.GameObject): this {
        // Remove old child
        this.remove(this.child);

        // Set new child
        this.child = child;

        // Update layout
        this.updateLayout();

        return this;
    }

    /**
     * Creates the background graphics for the card
     * @param scene The scene to add the graphics to
     */
    private createBackgroundGraphics(scene: Scene): void {
        this.backgroundGraphics = scene.add.graphics();
        this.drawBackground();
    }

    /**
     * Sets up the container with background and child
     */
    private setupContainer(): void {
        this.add([this.backgroundGraphics, this.child]);
        this.updateLayout();
    }

    /**
     * Updates the layout after property changes
     */
    private updateLayout(): void {
        // Get child bounds using type assertion
        const childBounds = (this.child as unknown as { getBounds: () => { width: number; height: number } }).getBounds();

        // Calculate card dimensions with margin
        const cardWidth = childBounds.width + this.marginPx * 2;
        const cardHeight = childBounds.height + this.marginPx * 2;

        // Check if child has origin property and get its current origin
        const childOrigin = this.getChildOrigin();

        // Calculate child position considering its origin
        const childX = this.calculateChildX(cardWidth, childBounds.width, childOrigin);
        const childY = this.calculateChildY(cardHeight, childBounds.height, childOrigin);

        // Position child in the center of the card
        (this.child as unknown as { setPosition: (x: number, y: number) => void }).setPosition(childX, childY);

        // Redraw background with new dimensions
        this.drawBackground();
    }

    /**
     * Gets the child's origin if it exists
     * @returns Object with x and y origin values, or null if not available
     */
    private getChildOrigin(): { x: number; y: number } | null {
        // Check if child has origin property
        if ('originX' in this.child && 'originY' in this.child) {
            return {
                x: (this.child as unknown as { originX: number }).originX,
                y: (this.child as unknown as { originY: number }).originY
            };
        }

        // Check if child has getOrigin method
        if (typeof (this.child as unknown as { getOrigin: () => { x: number; y: number } }).getOrigin === 'function') {
            const origin = (this.child as unknown as { getOrigin: () => { x: number; y: number } }).getOrigin();
            if (origin && typeof origin.x === 'number' && typeof origin.y === 'number') {
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
    private calculateChildX(cardWidth: number, childWidth: number, childOrigin: { x: number; y: number } | null): number {
        if (childOrigin) {
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
    private calculateChildY(cardHeight: number, childHeight: number, childOrigin: { x: number; y: number } | null): number {
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

    /**
     * Draws the background graphics
     */
    private drawBackground(): void {
        // Get child bounds for current dimensions
        const childBounds = (this.child as unknown as { getBounds: () => { width: number; height: number } }).getBounds();
        const width = childBounds.width + this.marginPx * 2;
        const height = childBounds.height + this.marginPx * 2;

        this.backgroundGraphics.clear();

        // Limit radius to maximum possible for the card dimensions
        const maxRadius = Math.min(width / 2, height / 2);
        const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);

        // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
        const bgX = -width / 2;
        const bgY = -height / 2;

        // Draw background
        this.backgroundGraphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
        this.backgroundGraphics.fillRoundedRect(bgX, bgY, width, height, effectiveRadius);
    }
}
