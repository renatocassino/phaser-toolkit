import { fontIcons, IconKey } from '../constants/icons';
import { convertToFontAwesome } from './convertToFontAwesome';

export function getIconChar(key: IconKey): string {
    if (!fontIcons[key]) {
        throw new Error(`Icon ${key} not found in fontIcons`);
    }
    return convertToFontAwesome(fontIcons[key].hexCode);
}
