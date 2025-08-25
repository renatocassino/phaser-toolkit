export type SoundConfig = {
    channel: string;
    volume: number;
    loop: boolean;
    preload: boolean;
    path: string;
}

export type SoundListConfig = Record<string, SoundConfig>;
