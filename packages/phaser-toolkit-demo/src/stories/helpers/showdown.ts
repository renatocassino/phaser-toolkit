const INTERVAL_TIME = 300;

export const loadShowdown = (): void => {
    if (document.getElementById('_showdown_js')) {
        return;
    }

    const url = 'https://cdn.rawgit.com/showdownjs/showdown/1.9.0/dist/showdown.min.js';
    const script = document.createElement('script');
    script.src = url;
    script.id = '_showdown_js';
    document.head.appendChild(script);
};


export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
    if (!document.getElementById('_showdown_js')) {
        loadShowdown();
    }

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            // @ts-ignore
            if (!(window as unknown).showdown) {
                return;
            }

            clearInterval(interval);
            // @ts-ignore
            const converter = new (window as unknown).showdown.Converter();
            const html = converter.makeHtml(markdown);
            resolve(html);
        }, INTERVAL_TIME);
    });
};