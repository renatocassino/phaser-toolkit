import { type IconKey, fontIcons } from '../constants/icons';

export const getIconHex = (key: IconKey): string => {
  if (!fontIcons[key]) {
    throw new Error(`Icon ${key} not found in fontIcons`);
  }
  return fontIcons[key].hexCode;
};
