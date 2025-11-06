/* eslint-disable @typescript-eslint/no-misused-promises */
const btn = document.getElementById('inject-btn') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

btn.addEventListener('click', async () => {
  btn.disabled = true;
  statusEl.textContent = 'Injecting scripts...';
  statusEl.className = '';

  try {
    // Helper to get current tab (works in both Chrome and Firefox)
    const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
      // Try chrome.tabs first (Chrome)
      if (chrome.tabs && chrome.tabs.query) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) return tabs[0];
      }
      
      // Try browser.tabs (Firefox standard)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const browser = (globalThis as any).browser || (globalThis as any).chrome;
      if (browser?.tabs?.query) {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) return tabs[0];
      }
      
      throw new Error('Could not access tabs API');
    };
    
    const tab = await getCurrentTab();
    
    if (!tab?.id) {
      throw new Error('No tab found');
    }

    if (!tab.url?.startsWith('http://') && !tab.url?.startsWith('https://')) {
      throw new Error('Only works on http/https pages');
    }

    // Inject scripts
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injected-script.js'],
      world: 'MAIN',
    });

    // Marca como injetado no background (substitui storage)
    await chrome.runtime.sendMessage({ 
      type: 'MARK_INJECTED', 
      tabId: tab.id 
    });

    statusEl.textContent = '✓ Scripts injected! Open DevTools now.';
    statusEl.className = 'success';

    setTimeout(() => window.close(), 2000);

  } catch (error) {
    console.error('Error injecting:', error);
    statusEl.textContent = `✗ Erro: ${(error as Error).message}`;
    statusEl.className = 'error';
    btn.disabled = false;
  }
});
