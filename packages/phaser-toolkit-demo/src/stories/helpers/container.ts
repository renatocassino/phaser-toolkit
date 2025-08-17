export const createContainer = (): HTMLDivElement => {
    const root = document.getElementById('phaser-story');
    if (root) {
        return root as HTMLDivElement;
    }

    const container = document.createElement('div');
    container.id = 'phaser-story';
    container.style.width = '600px';
    container.style.height = '400px';
    container.style.border = '1px solid #333';
    container.style.background = '#111';
    return container;
};
