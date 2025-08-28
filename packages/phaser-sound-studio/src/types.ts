/**
 * Configuration for a single sound.
 *
 * @template TChannel - The type of the channel name (defaults to string).
 * @property {TChannel} channel - The channel this sound belongs to.
 * @property {number} volume - The initial volume of the sound (0.0 to 1.0).
 * @property {boolean} loop - Whether the sound should loop.
 * @property {boolean} preload - Whether the sound should be preloaded.
 * @property {string} path - The path to the audio file.
 */
export type SoundConfig<TChannel extends string = string> = {
  channel: TChannel;
  volume: number;
  loop: boolean;
  preload: boolean;
  path: string;
};

/**
 * Configuration object for a list of sounds.
 *
 * @template TSoundKey - The type of the sound key (defaults to string).
 * @template TChannel - The type of the channel name (defaults to string).
 * @description
 * Maps each sound key to its corresponding SoundConfig.
 */
export type SoundListConfig<
  TSoundKey extends string = string,
  TChannel extends string = string,
> = Record<TSoundKey, SoundConfig<TChannel>>;
