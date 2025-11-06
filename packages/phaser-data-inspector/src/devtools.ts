chrome.devtools.panels.create(
  "Phaser Data Inspector",
  "icon16.png",
  "popup.html",
  (panel) => {
    panel.onShown.addListener((): void => {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      if (!tabId) return;

      // Verifica se já foi injetado
      chrome.runtime.sendMessage(
        { type: 'CHECK_INJECTED', tabId },
        (response) => {
          if (!response?.injected) {
            // Mostra mensagem no painel para o usuário clicar no ícone da extensão
            console.warn('Scripts não injetados. Clique no ícone da extensão primeiro!');
            // Você pode mostrar uma UI amigável aqui no seu popup.html
          } else {
            console.log('Scripts já injetados, pronto para inspecionar!');
          }
        }
      );
    });
  }
);
