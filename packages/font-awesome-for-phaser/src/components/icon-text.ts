import { Scene } from 'phaser';

import { type IconKey } from '../constants/icons';
import { getIconChar } from '../utils';

export type IconStyle = 'solid' | 'regular' | 'brands';

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

  // Backward compatible constructor with optional IconStyle
  constructor(
    scene: Scene,
    x: number,
    y: number,
    icon: IconKey,
    arg4?: number | IconStyle | Phaser.Types.GameObjects.Text.TextStyle,
    arg5?: number | Phaser.Types.GameObjects.Text.TextStyle
  ) {
    const { resolvedStyle, resolvedSize, resolvedTextStyle } =
      IconText.resolveArgs(arg4, arg5);

    super(scene, x, y, getIconChar(icon), {
      fontSize: `${resolvedSize}px`,
      ...resolvedTextStyle,
    });

    this.currentIconStyle = resolvedStyle;
    this.applyIconStyle(this.currentIconStyle);
    this.setOrigin(0.5, 0.5);
  }

  public setIcon(icon: IconKey, iconStyle?: IconStyle): void {
    this.setText(getIconChar(icon));
    if (iconStyle) {
      this.applyIconStyle(iconStyle);
    }
  }

  public setIconStyle(iconStyle: IconStyle): void {
    this.applyIconStyle(iconStyle);
  }

  public getIconStyle(): IconStyle {
    return this.currentIconStyle;
  }

  private applyIconStyle(iconStyle: IconStyle): void {
    // Font Awesome v6:
    // - Free Regular (400) and Free Solid (900) share family "Font Awesome 6 Free"
    // - Brands (400) uses family "Font Awesome 6 Brands"
    if (iconStyle === 'brands') {
      this.setFontFamily("'Font Awesome 6 Brands'");
      this.setFontStyle('normal');
    } else {
      this.setFontFamily("'Font Awesome 6 Free'");
      // Use bold for solid, normal for regular. Bold maps to the closest available weight (900 for solid)
      this.setFontStyle(iconStyle === 'solid' ? 'bold' : 'normal');
    }

    this.currentIconStyle = iconStyle;
  }

  private static resolveArgs(
    arg4?: number | IconStyle | Phaser.Types.GameObjects.Text.TextStyle,
    arg5?: number | Phaser.Types.GameObjects.Text.TextStyle
  ): {
    resolvedStyle: IconStyle;
    resolvedSize: number;
    resolvedTextStyle: Phaser.Types.GameObjects.Text.TextStyle;
  } {
    let resolvedStyle: IconStyle = 'solid';
    let resolvedSize = 16;
    let resolvedTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {};

    if (typeof arg4 === 'string') {
      resolvedStyle = arg4;
    } else if (typeof arg4 === 'number') {
      resolvedSize = arg4;
    } else if (typeof arg4 === 'object' && arg4 !== null) {
      resolvedTextStyle = arg4;
    }

    if (typeof arg5 === 'number') {
      resolvedSize = arg5;
    } else if (typeof arg5 === 'object' && arg5 !== null) {
      resolvedTextStyle = arg5;
    }

    return { resolvedStyle, resolvedSize, resolvedTextStyle };
  }
}
