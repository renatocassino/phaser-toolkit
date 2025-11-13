const ensureFA7Ready = async (): Promise<void> => {
  const loads = [
    document.fonts.load('900 16px "Font Awesome 7 Free"', '\uf005'), // Solid (peso 900)
    document.fonts.load('400 16px "Font Awesome 7 Free"', '\uf2b9'), // Regular (peso 400)
    document.fonts.load('400 16px "Font Awesome 7 Brands"', '\uf09b'), // Brands (400)
  ];
  await Promise.all(loads);
  await (document as unknown as { fonts: { ready: Promise<void> } })['fonts'].ready;
}

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
}

export const loadFont = (url?: string): Promise<void> => {
  const fontUrl = url ?? 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css';

  return loadStylesheet(fontUrl)
    .then(() => ensureFA7Ready())
    .catch((error) => {
      throw error;
    });
};
