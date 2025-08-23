export const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

export const nextTick = async (): Promise<void> => {
    await nextFrame();
    await nextFrame();
};

export const nextFrames = async (frames: number): Promise<void> => {
    for (let i = 0; i < frames; i++) {
        await nextFrame();
    }
};
