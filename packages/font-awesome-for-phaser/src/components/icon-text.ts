import Phaser from 'phaser';

import { type IconKey } from '../constants/icons';
import { getIconChar } from '../utils';

export type IconStyle = 'solid' | 'regular' | 'brands';

export type IconTextParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  icon: IconKey;
  size?: number;
  style?: Phaser.Types.GameObjects.Text.TextStyle;
  iconStyle?: IconStyle;
};

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
  private currentIconStyle: IconStyle = 'solid';

  constructor({
    scene,
    x,
    y,
    icon,
    size = 16,
    style = {},
    iconStyle = 'solid',
  }: IconTextParams) {
    super(scene, x, y, getIconChar(icon), {
      fontSize: `${size}px`,
      ...style,
    });

    this.currentIconStyle = iconStyle;
    this.applyIconStyle(this.currentIconStyle);
    this.setOrigin(0.5, 0.5);
  }

  public setIcon(icon: IconKey, opts?: { iconStyle?: IconStyle }): void {
    this.setText(getIconChar(icon));
    if (opts?.iconStyle) {
      this.applyIconStyle(opts.iconStyle);
    }
  }

  public setIconStyle(iconStyle: IconStyle): void {
    this.applyIconStyle(iconStyle);
  }

  public getIconStyle(): IconStyle {
    return this.currentIconStyle;
  }

  private applyIconStyle(iconStyle: IconStyle): void {
    // Font Awesome v7:
    // - Free Regular (400) and Free Solid (900) share family "Font Awesome 6 Free"
    // - Brands (400) uses family "Font Awesome 6 Brands"
    if (iconStyle === 'brands') {
      this.setFontFamily("'Font Awesome 7 Brands'");
      this.setFontStyle('normal');
    } else {
      this.setFontFamily("'Font Awesome 7 Free'");
      // Use bold for solid, normal for regular. Bold maps to the closest available weight (900 for solid)
      this.setFontStyle(iconStyle === 'solid' ? 'bold' : 'normal');
    }

    this.currentIconStyle = iconStyle;
  }
}
