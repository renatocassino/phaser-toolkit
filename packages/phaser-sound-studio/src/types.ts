export type SoundConfig = {
    channel: string;
    volume: number;
    loop: boolean;
    preload: boolean;
    path: string;
}

export type SoundListConfig<T extends string = string> = Record<T, SoundConfig>;
