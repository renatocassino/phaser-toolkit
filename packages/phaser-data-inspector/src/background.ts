// Store connections from popup/devtools
const connections = new Map<string, chrome.runtime.Port>();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "phaser-devtools") {
    let tabId: number | undefined;
    
    port.onMessage.addListener((msg) => {
      if (msg?.type === 'REGISTER_TAB_ID' && msg.tabId) {
        tabId = msg.tabId;
        connections.set(tabId.toString(), port);
      }
    });

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

// Messages from injected script
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
  }
  
  // Verifica se a aba já foi injetada
  if (message?.type === 'CHECK_INJECTED') {
    const tabId = message.tabId;
    chrome.storage.session.get([`injected_${tabId}`]).then((result) => {
      sendResponse({ injected: !!result[`injected_${tabId}`] });
    });
    return true;
  }
  
  return false;
});

// Limpa o storage quando a aba é fechada
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove([`injected_${tabId}`]);
  connections.delete(tabId.toString());
});
