import type { PhaserSoundStudioPluginData, SoundListConfig } from '../types';

// Define your sound channels (fully type-safe)
export const CHANNELS = {
    HUD: 'hud',
    MUSIC: 'music',
    SFX: 'sfx',
    VOICE: 'voice',
} as const;

// Define your sound keys (fully type-safe)
export const SOUNDS = {
    BUTTON_HOVER: 'button-hover',
    BUTTON_CLICK: 'button-click',
    BACKGROUND_MUSIC: 'bg-music',
    PLAYER_JUMP: 'jump-sfx',
} as const;

// Important types setted here
export type GameChannels = (typeof CHANNELS)[keyof typeof CHANNELS];
export type GameSounds = (typeof SOUNDS)[keyof typeof SOUNDS];

// Your audio configuration
export const audioConfig: PhaserSoundStudioPluginData<GameSounds, GameChannels> = {
    soundList: {
        'button-hover': {
            channel: 'hud', // if pass an invalid value, should have type error
            loop: false, // default is false
            preload: true, // default is true
            path: '/audio/ui/hover.mp3',
        },
        'button-click': {
            channel: 'hud',
            loop: false,
            path: '/audio/ui/click.wav',
        },
        'bg-music': {
            channel: 'music',
            loop: true,
            path: '/audio/music/theme.ogg',
        },
        'jump-sfx': {
            channel: 'sfx',
            loop: false,
            preload: false, // If you don't want load in preloader
            path: '/audio/sfx/jump.m4a',
        },
    } satisfies SoundListConfig<GameSounds, GameChannels>,
    channels: {
        [CHANNELS.HUD]: {
            mode: 'single',
        },
        [CHANNELS.MUSIC]: {
            mode: 'single',
        },
        [CHANNELS.SFX]: {
            mode: 'single',
        },
        [CHANNELS.VOICE]: {
            mode: 'single',
        },
    },
    storage: 'local' as const, // or 'session'
    gameName: 'my-awesome-game', // Optional: for unique storage keys
};
