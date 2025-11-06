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
    
    if (!tab.id) {
      throw new Error('Nenhuma aba encontrada');
    }

    // Verifica se é http/https
    if (!tab.url?.startsWith('http://') && !tab.url?.startsWith('https://')) {
      throw new Error('Só funciona em páginas http/https');
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

    statusEl.textContent = '✓ Scripts injetados! Abra o DevTools agora.';
    statusEl.className = 'success';

    // Fecha o popup após 2 segundos
    setTimeout(() => window.close(), 2000);

  } catch (error) {
    console.error('Erro ao injetar:', error);
    statusEl.textContent = `✗ Erro: ${(error as Error).message}`;
    statusEl.className = 'error';
    btn.disabled = false;
  }
});
