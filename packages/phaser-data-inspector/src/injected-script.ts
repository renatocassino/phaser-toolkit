// This script is injected into the page context
// It runs in the actual page, not in the content script isolated context

import { ContextParams } from "./store/types";

// Must be standalone - no imports allowed (will be compiled to IIFE)
const EVENT_NAME = 'phaser-data-inspector';

interface PhaserDataInspectorMessage {
  source: typeof EVENT_NAME;
  datetime: string;
  gameId: string;
  sceneKey: string;
  registry: 'data' | 'registry' | 'global' | 'local';
  scope: 'set' | 'patch';
  key: string;
  oldValue?: unknown;
  newValue: unknown;
}

(function() {
  'use strict';

  (function tryGetPhaser(times: number = 0): void {
    if (times > 1000) {
      console.warn('Phaser not found');
      return;
    }
    const globalWindow = window as typeof window & { Phaser?: unknown };
    if (typeof globalWindow.Phaser !== 'undefined') {
      __initDevTools();
    } else {
      setTimeout(() => tryGetPhaser(times + 1), 100);
    }
  })();

  function __initDevTools(): void {
    replacePhaserMethods();
  }

  function replacePhaserMethods(): void {
    replacePhaserSet();
  }

  function getGame(): unknown {
    const p = this.parent;
    if (!p) return null;
    if (p?.config && p?.loop) return p; // heurística de Game (registry)
    if (p?.sys?.game) return p.sys.game; // SceneSystems -> Game
    if (p?.scene?.sys?.game) return p.scene.sys.game; // GameObject -> Scene -> Game
    if (p?.game) return p.game;
    return null;
  }

  const gameIds = new WeakMap();
  let nextId = 1;

  function getGameId(game: unknown): string {
    if (!game) return 'unknown';
    if (!gameIds.has(game)) gameIds.set(game, `G${nextId++}`);
    return gameIds.get(game);  
  }

  function getSceneKeyFromDM() {
    return this?.parent?.scene?.key || this?.parent?.sys?.settings?.key || undefined;
  }

  function getContextParams(): ContextParams | undefined {
    const windowContext = window as unknown as { __PHASER_HOOKS_CTX__: unknown[] };
    const ctx = windowContext.__PHASER_HOOKS_CTX__;
    if (!ctx || !Array.isArray(ctx)) {
      return undefined;
    }
    return ctx[ctx.length - 1] as ContextParams;
  }

  function replacePhaserSet(): void {
    const globalWindow = window as typeof window & { Phaser?: any };
    if (!globalWindow.Phaser?.Data?.DataManager?.prototype) {
      console.warn('Phaser Data.DataManager not found');
      return;
    }

    const originalSet = globalWindow.Phaser.Data.DataManager.prototype.set;

    globalWindow.Phaser.Data.DataManager.prototype.set = function (key: string, val: unknown): unknown {
      const game = getGame.call(this);
      const gameId = getGameId(game);
      const sceneKey = getSceneKeyFromDM.call(this);
      const ctx = getContextParams();

      const message: PhaserDataInspectorMessage = {
        source: EVENT_NAME,
        datetime: new Date().toISOString(),
        gameId: gameId,
        sceneKey: sceneKey ?? '-',
        registry: ctx?.registryType ?? (sceneKey ? 'data' : 'registry'),
        scope: ctx?.op ?? 'set',
        key: key,
        oldValue: ctx?.oldValue,
        newValue: val
      };

      window.postMessage(message, '*');
      // eslint-disable-next-line prefer-rest-params
      return originalSet.apply(this, arguments);
    };
  }
})();