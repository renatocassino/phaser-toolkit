import { EVENT_NAME } from "../constants";

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
}

/**
 * function set<T>(registry: DataManager, key: string, next: T, meta: HookMeta) {
  return withDevtoolsContext({ lib:'phaser-hooks', store: meta.store, op:'set' }, () => {
    registry.set(key, next);
  });
}

function patch<T>(registry: DataManager, key: string, partial: DeepPartial<T>, meta: HookMeta) {
  return withDevtoolsContext({ lib:'phaser-hooks', store: meta.store, op:'patch' }, () => {
    const curr = registry.get(key) as T;
    registry.set(key, deepMerge(curr, partial));
  });
}

withDevtoolsContext({
  lib: 'phaser-hooks',
  version: '0.3.1',
  store: 'Player',
  op: 'patch',
  path: 'stats.hp',
  updaterType: typeof value === 'function' ? 'fn' : 'value',
  debug,
  listeners: getListenerCountFor(key),
  // diff: [... opcional se você calcular aqui],
}, () => {
  registry.set(key, nextValue); // aqui seu patch real
});
 Usar no ctx valores como path: stats.hp

 declare global { interface Window { __PHX_CTX__?: any[] } }

export function withDevtoolsContext<T>(meta: any, fn: () => T): T {
  const stack = (window.__PHX_CTX__ ||= []);
  stack.push(meta);
  try { return fn(); } finally { stack.pop(); }
}
 */