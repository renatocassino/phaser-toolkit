import { fontIcons, IconKey } from '../constants/icons';

export function getIconHex(key: IconKey): string {
    if (!fontIcons[key]) {
        throw new Error(`Icon ${key} not found in fontIcons`);
    }
    return fontIcons[key].hexCode;
}
