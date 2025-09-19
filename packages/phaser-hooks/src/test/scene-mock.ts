import EventEmitter from "node:events";

import { type Scene } from "phaser";
// @ts-expect-error: No type declarations for DataManager, but we only use it for test mocks
import DataManager from 'phaser/src/data/DataManager.js';

export const buildSceneMock = (): Scene => {
  return {
    scene: {
      key: 'test-scene',
    },
    registry: new DataManager({}, new EventEmitter()),
    data: new DataManager({}, new EventEmitter()),
  } as unknown as Scene;
};
