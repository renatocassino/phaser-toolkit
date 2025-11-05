import { EVENT_NAME } from "../constants";

export type ContextParams = {
  lib: 'phaser-hooks';
  store: string;
  op: 'patch' | 'set';
  oldValue: unknown;
  registryType: 'global' | 'local';
  [key: string]: unknown;
};

export type PhaserDataInspectorMessage = {
    source: typeof EVENT_NAME;
    datetime: string;
    gameId: string;
    sceneKey: string;
    registry: 'data' | 'registry';
    scope: 'set';
    key: string;
    oldValue?: unknown;
    newValue: unknown;
    ctx: ContextParams;
}
