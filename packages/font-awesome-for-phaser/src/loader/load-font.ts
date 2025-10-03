import WebFont from 'webfontloader';

const ensureFA7Ready = async (): Promise<void> => {
  const loads = [
    document.fonts.load('900 16px "Font Awesome 7 Free"', '\uf005'), // Solid (peso 900)
    document.fonts.load('400 16px "Font Awesome 7 Free"', '\uf2b9'), // Regular (peso 400)
    document.fonts.load('400 16px "Font Awesome 7 Brands"', '\uf09b'), // Brands (400)
  ];
  await Promise.all(loads);
  await (document as unknown as { fonts: { ready: Promise<void> } })['fonts'].ready;
}

export const loadFont = (url?: string): Promise<void> => {
  return new Promise((resolve, reject): void => {
    WebFont.load({
      custom: {
        families: [
          'Font Awesome 7 Free',
          'Font Awesome 7 Brands',
          'Font Awesome 5 Brands',
          'Font Awesome 5 Free',
          'FontAwesome',
        ],
        urls: [
          url ?? 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
        ],
      },
      active: (): void => {
        ensureFA7Ready().then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      },
      inactive: (): void => {
        reject();
      },
    });
  });
};
