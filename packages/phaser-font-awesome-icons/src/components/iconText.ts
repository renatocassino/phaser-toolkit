import { Scene } from "phaser";
import { type IconKey } from "../constants/icons";
import { getIconChar } from "../utils";

/**
 * IconText is a Phaser Text GameObject that displays Font Awesome icons
 * By default, the origin is set to (0.5, 0.5). To change it, use setOrigin() method
 * 
 * @param scene - The Scene to which this IconText belongs
 * @param x - The horizontal position of this IconText in the world
 * @param y - The vertical position of this IconText in the world  
 * @param icon - The Font Awesome icon key to display
 * @param size - The font size in pixels (default: 16)
 * @param style - Additional text style configuration options
 */
export class IconText extends Phaser.GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, icon: IconKey, size: number = 16, style: Phaser.Types.GameObjects.Text.TextStyle = {}) {
        super(scene, x, y, getIconChar(icon), { fontSize: `${size}px`, ...style });
        this.setOrigin(0.5, 0.5);
    }

    public setIcon(icon: IconKey) {
        this.setText(getIconChar(icon));
    }
}
