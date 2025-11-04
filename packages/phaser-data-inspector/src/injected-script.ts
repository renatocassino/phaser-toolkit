// This script is injected into the page context
// It runs in the actual page, not in the content script isolated context
// Must be standalone - no imports allowed (will be compiled to IIFE)
const EVENT_NAME = 'phaser-data-inspector';

interface PhaserDataInspectorMessage {
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

(function() {
  'use strict';

  (function tryGetPhaser(): void {
    const globalWindow = window as typeof window & { Phaser?: any };
    if (typeof globalWindow.Phaser !== 'undefined') {
      __initDevTools();
    } else {
      setTimeout(tryGetPhaser, 100);
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

      const message: PhaserDataInspectorMessage = {
        source: EVENT_NAME,
        datetime: new Date().toISOString(),
        gameId: gameId,
        sceneKey: sceneKey ?? '-',
        registry: sceneKey ? 'data' : 'registry',
        scope: 'set',
        key: key,
        oldValue: undefined, // TODO: get old value
        newValue: val
      };

      window.postMessage(message, '*');
      // eslint-disable-next-line prefer-rest-params
      return originalSet.apply(this, arguments);
    };
  }
})();