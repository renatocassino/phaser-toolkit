import { loadFont as loadFontAwesomeForPhaser } from 'font-awesome-for-phaser';

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


export const loadFonts = async (options?: LoadFontsOptions): Promise<void> => {
  const {
    fontAwesomeUrl,
    baseFont = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    baseFontFamily = 'Bebas Neue',
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

