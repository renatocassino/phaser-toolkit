// Must repeat to avoid import
const EVENT_NAME = 'phaser-data-inspector';

// Store connections from popup/devtools
const connections = new Map<string, chrome.runtime.Port>();

// Listen for connections from popup/devtools
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  if (port.name === 'phaser-devtools') {
    console.log('Popup/DevTools connected');
    connections.set(port.name as string, port);
    
    port.onDisconnect.addListener(() => {
      console.log('Popup/DevTools disconnected');
      connections.delete(port.name as string);
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source === EVENT_NAME) {
    const payload: PhaserDataInspectorMessage = message.payload;
    console.log('Received from content script:', message.payload);

    // Forward to all connected popup/devtools
    connections.forEach((port) => {
      try {
        port.postMessage(payload);
      } catch (error) {
        console.error('Error sending to popup/devtools:', error);
      }
    });
  } else {
    console.log('Received unknown message:', message);
  }

  return true;
});
