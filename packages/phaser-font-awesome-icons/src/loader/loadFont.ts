import WebFont from 'webfontloader';

export function loadFont(): Promise<void> {
    return new Promise((resolve): void => {
        WebFont.load({
            custom: {
                families: ['FontAwesome'],
                urls: [
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                ]
            },
            active: () => {
                resolve();
            }
        });
    });
}
