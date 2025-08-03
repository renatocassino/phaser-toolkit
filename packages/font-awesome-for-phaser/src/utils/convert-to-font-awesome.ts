/**
 * Converts a decimal number to Font Awesome Unicode format
 */
export const convertToFontAwesome = (codeIcon: string): string => {
  return String.fromCharCode(parseInt(codeIcon, 16));
};

/**
 * Converts back from Font Awesome format to decimal
 */
export const convertFromFontAwesome = (fontAwesome: string): number => {
  const hex = fontAwesome.replace('\\uf', '');
  return parseInt(hex, 16);
};

// Usage examples:
// convertToFontAwesome(58) → "\uf03a"
// convertToFontAwesome(4) → "\uf004"
// convertFromFontAwesome("\uf03a") → 58
