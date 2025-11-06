/* eslint-disable @typescript-eslint/no-misused-promises */
const btn = document.getElementById('inject-btn') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

btn.addEventListener('click', async (): Promise<void> => {
  btn.disabled = true;
  statusEl.textContent = 'Injetando scripts...';
  statusEl.className = '';

  try {
    // Pega a aba ativa
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.id) {
      throw new Error('No tab found');
    }

    // Verifica se é http/https
    if (!tab.url?.startsWith('http://') && !tab.url?.startsWith('https://')) {
      throw new Error('Only works on http/https pages');
    }

    // Injeta os scripts (activeTab está ativo agora!)
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injected-script.js'],
      world: 'MAIN',
    });

    // Salva no storage que essa aba foi injetada
    await chrome.storage.session.set({ [`injected_${tab.id}`]: true });

    statusEl.textContent = '✓ Scripts injected! Open DevTools now.';
    statusEl.className = 'success';

    // Close the popup after 2 seconds
    setTimeout(() => window.close(), 2000);

  } catch (error: unknown) {
    console.error('Error injecting:', error);
    statusEl.textContent = `✗ Error: ${(error as Error).message}`;
    statusEl.className = 'error';
    btn.disabled = false;
  }
});
