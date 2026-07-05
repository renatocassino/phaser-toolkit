import { GameObjects, Scene } from 'phaser';

import { Badge } from '../badge';
import { Card } from '../card';
import { IconButton } from '../icon-button';

// Constants for default values
const DEFAULT_BORDER_RADIUS = 8;
const DEFAULT_MARGIN = 16;
const DEFAULT_BACKGROUND_COLOR = 'red-500';
const CLOSE_BUTTON_SIZE = 18;
const CLOSE_BUTTON_MARGIN = 8;

export type PanelParams = {
    scene: Scene;
    x?: number;
    y?: number;
    title?: string;
    backgroundColor?: string;
    borderRadius?: number;
    margin?: number;
    showCloseButton?: boolean;
    onClose?: () => void;
    child: GameObjects.GameObject;
};

export class Panel extends GameObjects.Container {
    private card: Card;
    private badge: Badge | null = null;
    private closeButton: IconButton | null = null;
    private title: string;
    private showCloseButton: boolean;
    private onClose?: (() => void) | undefined;

    constructor(params: PanelParams) {
        super(params.scene, params.x ?? 0, params.y ?? 0);

        this.title = params.title ?? '';
        this.showCloseButton = params.showCloseButton ?? false;
        this.onClose = params.onClose;

        // Create the card first
        this.card = new Card({
            scene: params.scene,
            x: 0,
            y: 0,
            backgroundColor: params.backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
            borderRadius: params.borderRadius ?? DEFAULT_BORDER_RADIUS,
            margin: params.margin ?? DEFAULT_MARGIN,
            child: params.child
        });

        // Add card to container
        this.add(this.card);

        // Create badge (panel title) if title is provided
        if (this.title) {
            this.createBadge();
        }

        // Create close button if requested
        if (this.showCloseButton) {
            this.createCloseButton();
        }

        // Update layout
        this.updateLayout();
    }

    /**
     * Creates the badge that sits on top of the panel as its title.
     */
    private createBadge(): void {
        this.badge = new Badge({
            scene: this.scene,
            x: 0,
            y: 0,
            text: this.title,
            color: DEFAULT_BACKGROUND_COLOR,
            borderRadius: 0,
        });

        this.add(this.badge);
    }

    /**
     * Creates the close button
     */
    private createCloseButton(): void {
        this.closeButton = new IconButton({
            scene: this.scene,
            x: 0,
            y: 0,
            icon: 'x',
            size: CLOSE_BUTTON_SIZE,
            onClick: (): void => {
                if (this.onClose) {
                    this.onClose();
                }
            }
        });

        // Add close button to container
        this.add(this.closeButton);
    }

    /**
     * Updates the layout after property changes
     */
    private updateLayout(): void {
        // Get card size
        const cardSize = { width: this.card.width, height: this.card.height };

        // Calculate badge position (top of the card)
        if (this.badge) {
            const dividerBadge = 4;
            const badgeY = -cardSize.height / 2 - this.badge.height / dividerBadge;
            this.badge.setPosition(0, badgeY);
        }

        // Calculate close button position (top-right corner)
        if (this.closeButton) {
            const buttonX = cardSize.width / 2 - CLOSE_BUTTON_SIZE / 2 + CLOSE_BUTTON_MARGIN;
            const buttonY = -cardSize.height / 2 + CLOSE_BUTTON_SIZE / 2 - CLOSE_BUTTON_MARGIN;
            this.closeButton.setPosition(buttonX, buttonY);
        }
    }

    /**
     * Sets the title of the panel
     */
    setTitle(title: string): this {
        this.title = title;

        if (title && !this.badge) {
            this.createBadge();
        } else if (!title && this.badge) {
            this.remove(this.badge);
            this.badge = null;
        } else if (this.badge) {
            this.badge.setText(title);
        }

        this.updateLayout();
        return this;
    }

    /**
     * Sets whether to show the close button
     */
    setShowCloseButton(show: boolean): this {
        this.showCloseButton = show;

        if (show && !this.closeButton) {
            this.createCloseButton();
        } else if (!show && this.closeButton) {
            this.remove(this.closeButton);
            this.closeButton = null;
        }

        this.updateLayout();
        return this;
    }

    /**
     * Sets the close callback
     */
    setOnClose(callback: () => void): this {
        this.onClose = callback;
        return this;
    }

    /**
     * Sets the background color
     */
    setBackgroundColor(color: string): this {
        this.card.setBackgroundColor(color);
        if (this.badge) {
            this.badge.setColor(color);
        }
        return this;
    }

    /**
     * Sets the border radius
     */
    setBorderRadius(radius: number): this {
        this.card.setBorderRadius(radius);
        this.updateLayout();
        return this;
    }

    /**
     * Sets the margin
     */
    setMargin(margin: number): this {
        this.card.setMargin(margin);
        this.updateLayout();
        return this;
    }

    /**
     * Sets a new child component
     */
    setChild(child: GameObjects.GameObject): this {
        this.card.setChild(child);
        this.updateLayout();
        return this;
    }

    /**
     * Gets the card component
     */
    getCard(): Card {
        return this.card;
    }

    /**
     * Gets the badge (panel title) component.
     */
    getBadge(): Badge | null {
        return this.badge;
    }

    /**
     * Gets the close button component
     */
    getCloseButton(): IconButton | null {
        return this.closeButton;
    }
}
