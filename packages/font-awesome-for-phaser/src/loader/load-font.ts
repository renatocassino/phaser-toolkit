import WebFont from 'webfontloader';

export const loadFont = (): Promise<void> => {
  return new Promise((resolve): void => {
    WebFont.load({
      custom: {
        // Load the specific Font Awesome v6 families we target
        families: ['Font Awesome 6 Free', 'Font Awesome 6 Brands'],
        urls: [
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        ],
      },
      active: (): void => {
        resolve();
      },
    });
  });
};
