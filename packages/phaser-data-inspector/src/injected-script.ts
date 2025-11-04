// This script is injected into the page context
// It runs in the actual page, not in the content script isolated context
// Vite will compile this TypeScript to plain JavaScript
import type Phaser from 'phaser';

const globalWindow = window as typeof window & { Phaser: typeof Phaser };

(function() {
  'use strict';

  (function tryGetPhaser(): void {
    if (typeof globalWindow.Phaser !== 'undefined') {
      // A variável global Phaser existe, retorne
      __initDevTools();
    } else {
      // Tenta novamente após 100ms
      setTimeout(tryGetPhaser, 100);
    }
  })();

  function __initDevTools(): void {
    console.log('Phaser Data Inspector initialized');
    replacePhaserMethods();
  }

  function replacePhaserMethods(): void {
    replacePhaserSet();
  }

  function replacePhaserSet(): void {
    const originalSet = window.Phaser.Data.DataManager.prototype.set

    globalWindow.Phaser.Data.DataManager.prototype.set = function (key, val): unknown {
      window.postMessage({ source:'phaser-data-inspector', type: 'maoe', key, val }, '*');
      return originalSet.apply(this, arguments);
    }
  }
})();
