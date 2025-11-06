// Must repeat to avoid import
const EVENT_NAME = 'phaser-data-inspector';

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init(): void {  
  // The injected-script.js is now injected directly via chrome.scripting.executeScript
  // with world: 'MAIN', so we don't need to inject it here via script tag
  
  // Listen for messages from injected script
  window.addEventListener('message', (event) => {
    // Only accept messages from our injected script
    if (event.source !== window || event.data?.source !== EVENT_NAME) {
      return;
    }

    // Check if extension context is still valid
    try {
      if (!chrome.runtime?.id) {
        console.warn('Extension context invalidated - cannot send message');
        return;
      }

      // Send to background service worker
      chrome.runtime.sendMessage(
        {
          source: EVENT_NAME,
          payload: event.data
        },
        (_response) => {
          if (chrome.runtime.lastError) {
            // Handle extension context invalidated error
            if (chrome.runtime.lastError.message?.includes('Extension context invalidated')) {
              console.warn('Extension context invalidated - extension may have been reloaded');
            } else {
              console.error('Error sending message:', chrome.runtime.lastError);
            }
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  });
}