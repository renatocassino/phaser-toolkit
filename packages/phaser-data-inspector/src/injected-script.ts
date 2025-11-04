// This script is injected into the page context
// It runs in the actual page, not in the content script isolated context
// Vite will compile this TypeScript to plain JavaScript

(function() {
  'use strict';
  
  // Detect keypress 'p' and send message to content script
  document.addEventListener('keydown', function(event) {
    if (event.key === 'p' || event.key === 'P') {
      // Send message to content script via postMessage
      window.postMessage({
        source: 'phaser-inspector',
        type: 'KEY_PRESSED',
        key: 'p',
        timestamp: new Date().toISOString()
      }, '*');
    }
  });
})();
