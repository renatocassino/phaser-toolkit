import { GameObjects, Scene } from 'phaser';

import { Card } from '../card';
import { FlatIconButton } from '../flat-icon-button';
import { SectionHeader } from '../section-header';

// Constants for default values
const DEFAULT_BORDER_RADIUS = 8;
const DEFAULT_MARGIN = 16;
const DEFAULT_BACKGROUND_COLOR = 'red-500';
const DEFAULT_HEADER_HEIGHT = 60;
const CLOSE_BUTTON_SIZE = 32;
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
    private sectionHeader: SectionHeader | null = null;
    private closeButton: FlatIconButton | null = null;
    private title: string;
    private showCloseButton: boolean;
    private onClose?: (() => void) | undefined;
    private headerHeight: number;

    constructor(params: PanelParams) {
        super(params.scene, params.x ?? 0, params.y ?? 0);

        this.title = params.title ?? '';
        this.showCloseButton = params.showCloseButton ?? false;
        this.onClose = params.onClose;
        this.headerHeight = DEFAULT_HEADER_HEIGHT;

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

        // Create section header if title is provided
        if (this.title) {
            this.createSectionHeader();
        }

        // Create close button if requested
        if (this.showCloseButton) {
            this.createCloseButton();
        }

        // Update layout
        this.updateLayout();
    }

    /**
     * Creates the section header
     */
    private createSectionHeader(): void {
        this.sectionHeader = new SectionHeader({
            scene: this.scene,
            x: 0,
            y: 0,
            text: this.title,
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            borderRadius: 0
        });

        // Add header to container
        this.add(this.sectionHeader);
    }

    /**
     * Creates the close button
     */
    private createCloseButton(): void {
        this.closeButton = new FlatIconButton({
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
        // Get card bounds
        const cardBounds = this.card.getBounds();

        // Calculate header position (top of the card)
        if (this.sectionHeader) {
            const headerY = -cardBounds.height / 2 + this.headerHeight / 2;
            this.sectionHeader.setPosition(0, headerY);

            // Note: SectionHeader doesn't have setWidth, it auto-sizes to content
        }

        // Calculate close button position (top-right corner)
        if (this.closeButton) {
            const buttonX = cardBounds.width / 2 - CLOSE_BUTTON_SIZE / 2 - CLOSE_BUTTON_MARGIN;
            const buttonY = -cardBounds.height / 2 + CLOSE_BUTTON_SIZE / 2 + CLOSE_BUTTON_MARGIN;
            this.closeButton.setPosition(buttonX, buttonY);
        }
    }

    /**
     * Sets the title of the panel
     */
    setTitle(title: string): this {
        this.title = title;

        if (title && !this.sectionHeader) {
            this.createSectionHeader();
        } else if (!title && this.sectionHeader) {
            this.remove(this.sectionHeader);
            this.sectionHeader = null;
        } else if (this.sectionHeader) {
            this.sectionHeader.setText(title);
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
        if (this.sectionHeader) {
            this.sectionHeader.setBackgroundColor(color);
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
     * Gets the section header component
     */
    getSectionHeader(): SectionHeader | null {
        return this.sectionHeader;
    }

    /**
     * Gets the close button component
     */
    getCloseButton(): FlatIconButton | null {
        return this.closeButton;
    }
}
