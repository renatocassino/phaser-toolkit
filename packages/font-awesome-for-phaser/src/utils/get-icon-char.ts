import { IconStyle } from '../components/icon-text';
import { fontIcons, IconKey } from '../constants/icons';

import { convertToFontAwesome } from './convert-to-font-awesome';

export const getIconChar = (key: IconKey): string => {
  if (!fontIcons[key]) {
    throw new Error(`Icon ${key} not found in fontIcons`);
  }
  return convertToFontAwesome(fontIcons[key].hexCode);
};

export const getIconStyles = (key: IconKey): Set<IconStyle> => {
  if (!fontIcons[key]) {
    throw new Error(`Icon ${key} not found in fontIcons`);
  }
  return new Set(fontIcons[key].acceptedStyles);
};
