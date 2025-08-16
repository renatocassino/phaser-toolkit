import WebFont from 'webfontloader';

export const loadFont = (): Promise<void> => {
  return new Promise((resolve): void => {
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
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/solid.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/regular.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/brands.min.css',
        ],
      },
      active: (): void => {
        resolve();
      },
    });
  });
};
