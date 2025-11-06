// DevTools panel creation - runs in DevTools context
// This file is loaded by devtools.html (no inline scripts allowed in DevTools)
chrome.devtools.panels.create(
  "Phaser Data Inspector",
  "icon16.png",
  "popup.html",
  (panel) => {
    panel.onShown.addListener(async () => {
      // Check if extension context is still valid
      try {
        if (!chrome.runtime?.id) {
          console.warn('Extension context invalidated - cannot inject script');
          return;
        }

        const tabId = chrome.devtools.inspectedWindow.tabId;
        if (!tabId) {
          console.warn('No tab ID available');
          return;
        }
        
        try {
          // Inject content script and injected script dynamically using activeTab permission
          await Promise.all([
            chrome.scripting.executeScript({
              target: { tabId },
              files: ["content.js"]
            }),
            chrome.scripting.executeScript({
              target: { tabId },
              files: ["injected-script.js"],
              world: 'MAIN', // Inject into page context, not isolated world
            }),
          ]);
          
          // Optional: send message to background to notify that the panel is ready
          try {
            chrome.runtime.sendMessage({ type: "PDI_PANEL_READY", tabId }, (_response) => {
              if (chrome.runtime.lastError) {
                console.warn('Failed to send ready message:', chrome.runtime.lastError);
              }
            });
          } catch (msgError) {
            console.warn('Failed to send ready message:', msgError);
          }
        } catch (err) {
          console.error("Injection failed:", err);
          // Check if it's a context invalidated error
          if (err instanceof Error && err.message.includes('Extension context invalidated')) {
            console.warn('Extension was reloaded - please refresh the DevTools panel');
          }
        }
      } catch (error) {
        console.error('Failed to initialize injection:', error);
      }
    });
  }
);
