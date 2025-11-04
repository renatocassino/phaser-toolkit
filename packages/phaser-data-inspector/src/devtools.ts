// DevTools panel creation - runs in DevTools context
// This file is loaded by devtools.html (no inline scripts allowed in DevTools)

chrome.devtools.panels.create(
  'Phaser Data Inspector', // Title of the panel (appears in the tab)
  'icon16.png', // Icon path (relative to extension root)
  'popup.html', // HTML file for the panel content (same as popup)
  (panel) => {
    panel.onShown.addListener((_window) => {
      console.log('Phaser panel shown');
    });

    panel.onHidden.addListener(() => {
      console.log('Phaser panel hidden');
    });
  }
);
