// Background service worker - bridges content script and popup/devtools

console.log('Background service worker loaded');

// Store connections from popup/devtools
const connections = new Map<string, chrome.runtime.Port>();

// Listen for connections from popup/devtools
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'phaser-devtools') {
    console.log('Popup/DevTools connected');
    connections.set(port.name, port);
    
    port.onDisconnect.addListener(() => {
      console.log('Popup/DevTools disconnected');
      connections.delete(port.name);
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PHX_EVENT') {
    console.log('Received from content script:', message.payload);
    
    // Forward to all connected popup/devtools
    connections.forEach((port) => {
      try {
        port.postMessage(message.payload);
      } catch (error) {
        console.error('Error sending to popup/devtools:', error);
      }
    });
    
    sendResponse({ success: true });
  }
  
  return true;
});