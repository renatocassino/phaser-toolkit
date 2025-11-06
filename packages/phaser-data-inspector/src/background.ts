// Store connections from popup/devtools
const connections = new Map<string, chrome.runtime.Port>();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "phaser-devtools") {
    let tabId: number | undefined;
    
    // Listen for tabId registration from popup/devtools
    port.onMessage.addListener((msg) => {
      if (msg?.type === 'REGISTER_TAB_ID' && msg.tabId) {
        tabId = msg.tabId;
        connections.set(tabId.toString(), port);
      }
    });

    // Try to get tabId from sender (works for devtools via inspectedWindow)
    // @ts-expect-error - tabId is not typed
    const senderTabId: number | undefined = port.sender?.tab?.id || port.sender?.tabId || port.sender?.id;
    if (senderTabId) {
      tabId = senderTabId;
      connections.set(tabId.toString(), port);
    }

    port.onDisconnect.addListener(() => {
      if (tabId) {
        connections.delete(tabId.toString());
      }
    });
  }
});

// Messages from injected script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.source === 'phaser-data-inspector') {
    const tabId: number | undefined = sender.tab?.id;
    const port = tabId ? connections.get(tabId.toString()) : null;
    if (port) {
      try {
        port.postMessage(message.payload);
      } catch (error) {
        console.error('Error sending message to popup/devtools:', error);
      }
    }
    return true;
  } else if (message?.type === 'INJECT_CONTENT_SCRIPT') {
    // Inject content script when popup requests it (using activeTab permission)
    const tabId = message.tabId || sender.tab?.id;
    if (tabId) {
      // Inject both content.js and injected-script.js
      Promise.all([
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js'],
        }),
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['injected-script.js'],
          world: 'MAIN', // Inject into page context, not isolated world
        }),
      ]).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error('Failed to inject scripts:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep channel open for async response
    } else {
      sendResponse({ success: false, error: 'No tab ID available' });
      return false;
    }
  }
  return false;
});
