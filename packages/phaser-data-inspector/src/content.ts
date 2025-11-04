// Content script for Phaser Data Inspector
// Runs in isolated context - injects script into page to access page's JavaScript

console.log('Phaser Data Inspector content script loaded');

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init(): void {
  console.log('Content script initialized');
  
  // Inject script into page context to detect keypress
  // Use external file instead of inline script to avoid CSP violations
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected-script.js');
  script.onload = (): void => {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
  
  // Listen for messages from injected script
  window.addEventListener('message', (event) => {
    // Only accept messages from our injected script
    if (event.source !== window || event.data?.source !== 'phaser-inspector') {
      return;
    }

    console.log('Received from page:', event.data);

    // Check if extension context is still valid
    try {
      if (!chrome.runtime?.id) {
        console.warn('Extension context invalidated - cannot send message');
        return;
      }

      // Send to background service worker
      chrome.runtime.sendMessage(
        {
          type: 'PHX_EVENT',
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