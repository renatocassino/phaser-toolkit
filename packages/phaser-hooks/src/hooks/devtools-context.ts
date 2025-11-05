import { PHASER_HOOKS_VERSION } from '../version.js';

export type ContextParams = {
  store: string;
  op: 'patch' | 'set';
  oldValue: unknown;
  registryType: 'global' | 'local';
  [key: string]: unknown;
};

export const withDevtoolsContext = (meta: ContextParams, fn: () => void): void => {
  // Check if window is available (browser environment)
  if (typeof window !== 'undefined') {
    const windowContext = window as unknown as { __PHASER_HOOKS_CTX__: unknown[] };
    const stack = (windowContext.__PHASER_HOOKS_CTX__ ||= []);

    stack.push({
      lib: 'phaser-hooks',
      version: PHASER_HOOKS_VERSION,
      ...meta,
    });

    try {
      fn();
    } finally {
      stack.pop();
    }
  } else {
    // In non-browser environments (e.g., tests), just execute the function
    fn();
  }
};
