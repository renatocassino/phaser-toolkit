/* eslint-disable @typescript-eslint/no-unsafe-argument */
// Store connections from popup/devtools
const connections = new Map<string, chrome.runtime.Port>();

// Store injection status in memory (substitui chrome.storage.session)
const injectedTabs = new Set<number>();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "phaser-devtools") {
    let tabId: number | undefined;
    
    port.onMessage.addListener((msg) => {
      if (msg?.type === 'REGISTER_TAB_ID' && msg.tabId) {
        tabId = msg.tabId;
        connections.set(tabId?.toString() || '', port);
      }
    });

    // @ts-expect-error - port.sender is not typed
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
  
  // Verifica se a aba já foi injetada (usando Set em memória)
  if (message?.type === 'CHECK_INJECTED') {
    const tabId = message.tabId;
    sendResponse({ injected: injectedTabs.has(tabId as number) });
    return true;
  }
  
  // Marca que a aba foi injetada
  if (message?.type === 'MARK_INJECTED') {
    const tabId = message.tabId;
    if (tabId) {
      injectedTabs.add(tabId as number);
    }
    sendResponse({ success: true });
    return true;
  }
  
  // Get current tab ID (fallback for Firefox popup)
  if (message?.type === 'GET_CURRENT_TAB_ID') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        sendResponse({ tabId: tabs[0].id });
      } else {
        sendResponse({ tabId: null });
      }
    });
    return true; // Keep channel open for async response
  }
  
  return false;
});

// Limpa quando a aba é fechada
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId as number);
  connections.delete(tabId?.toString() || '');
});
