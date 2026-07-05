import { loadFont as loadFontAwesomeForPhaser } from 'font-awesome-for-phaser';

/**
 * Options for {@link loadFonts}.
 *
 * @property fontAwesomeUrl - Optional override for the Font Awesome stylesheet URL.
 *   When omitted, `font-awesome-for-phaser` uses its own default.
 * @property baseFont - Stylesheet URL for the base HUD font. Defaults to
 *   Google Fonts' Fredoka (variable, weights 300..700).
 * @property baseFontFamily - Font-family name matching the stylesheet above.
 *   Must be the exact name the browser knows the font by. Defaults to `'Fredoka'`.
 */
type LoadFontsOptions = {
  fontAwesomeUrl?: string;
  baseFont?: string;
  baseFontFamily?: string;
};

const loadStylesheet = (url: string): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = (): void => {
      resolve();
    };
    link.onerror = (): void => {
      reject(new Error(`Failed to load stylesheet: ${url}`));
    };
    document.head.appendChild(link);
  });
};

const ensureBaseFontReady = async (fontFamily: string): Promise<void> => {
  const loads = [
    document.fonts.load(`400 16px "${fontFamily}"`, 'A'),
    document.fonts.load(`700 16px "${fontFamily}"`, 'B'),
  ];
  await Promise.all(loads);
  await (document as unknown as { fonts: { ready: Promise<void> } })['fonts'].ready;
};


/**
 * Loads the fonts Hudini needs at runtime: Font Awesome (for the icon
 * components) and a base HUD font (used by text-based components).
 *
 * By default it pulls Fredoka from Google Fonts. Pass `baseFont` + `baseFontFamily`
 * to swap it for any other web font — just make sure both point to the same
 * font-family name the browser will see.
 *
 * @example
 * // Use the defaults (Font Awesome + Fredoka)
 * await loadFonts();
 *
 * @example
 * // Use a custom base font
 * await loadFonts({
 *   baseFont: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
 *   baseFontFamily: 'Inter',
 * });
 */
export const loadFonts = async (options?: LoadFontsOptions): Promise<void> => {
  const {
    fontAwesomeUrl,
    baseFont = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap',
    baseFontFamily = 'Fredoka',
  } = options ?? {};

  try {
    await loadFontAwesomeForPhaser(fontAwesomeUrl);
    await loadStylesheet(baseFont);
    await ensureBaseFontReady(baseFontFamily);
    await document.fonts.ready;
  } catch (error) {
    throw new Error(`Failed to load fonts: ${error instanceof Error ? error.message : String(error)}`);
  }
};

