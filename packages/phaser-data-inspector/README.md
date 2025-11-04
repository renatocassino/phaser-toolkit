# Phaser Data Inspector

Chrome extension para inspecionar dados e estado de jogos Phaser.

## Development

```bash
# Install dependencies
pnpm install

# Run dev mode with watch (builds to dist continuously)
pnpm dev

# Build for production
pnpm build
```

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The extension should now appear in your extensions list

## Estrutura do Projeto

```
phaser-data-inspector/
├── src/
│   ├── popup.html          # Interface compartilhada (popup e DevTools)
│   ├── inspector.ts        # Lógica compartilhada (vanilla JavaScript)
│   ├── devtools.html       # Página que cria o painel no DevTools
│   ├── background.ts       # Service Worker (background)
│   └── content.ts          # Script injetado nas páginas web
├── public/
│   └── manifest.json       # Manifest do Chrome Extension
└── dist/                   # Build output (para carregar no Chrome)
```

## Arquivos e suas Funções

### `manifest.json` - Configuração do Plugin

O `manifest.json` é o arquivo principal que define como o plugin funciona. Ele contém:

- **`manifest_version: 3`** - Versão do Manifest V3 (padrão atual do Chrome)
- **`permissions`** - Permissões necessárias:
  - `activeTab`: Acesso à aba ativa
  - `scripting`: Permite injetar scripts
- **`host_permissions`** - Permissão para acessar todas as URLs (`<all_urls>`)
- **`background`** - Define o service worker (`background.js`)
- **`content_scripts`** - Scripts injetados automaticamente em todas as páginas
- **`devtools_page`** - Página que cria o painel no DevTools
- **`action`** - Configuração do botão na toolbar do Chrome

### `background.ts` - Service Worker (Background)

**Função**: Roda em background, independente das páginas abertas. É o "cérebro" central do plugin.

**O que faz**:
- Escuta eventos globais do plugin (instalação, cliques no ícone)
- Atua como intermediário na comunicação entre componentes
- Pode receber mensagens de qualquer parte do plugin

**Contexto**: Roda em um ambiente isolado, não tem acesso ao DOM das páginas.

### `content.ts` - Content Script

**Função**: Script injetado diretamente nas páginas web que o usuário visita.

**O que faz**:
- Tem acesso ao DOM da página (pode ler/modificar elementos)
- Escuta mensagens do código da página usando `window.postMessage`
- Envia dados para o `background.ts` via `chrome.runtime.sendMessage`
- Detecta se Phaser está disponível na página

**Contexto**: Roda no contexto da página, mas isolado do código JavaScript da página (não pode acessar variáveis diretamente, mas pode se comunicar via `postMessage`).

### `inspector.ts` - Lógica da Interface

**Função**: Lógica compartilhada entre popup e DevTools panel.

**O que faz**:
- Gerencia a UI usando vanilla JavaScript (sem frameworks devido a CSP)
- Conecta com o background via `chrome.runtime.connect`
- Detecta se está rodando no popup ou no DevTools panel
- Atualiza a UI dinamicamente quando recebe mensagens
- Escuta mensagens do background

**Contexto**: Roda tanto no popup quanto no painel do DevTools.

### `devtools.html` - Criador do Painel DevTools

**Função**: Criar a aba customizada no Chrome DevTools.

**O que faz**:
- Usa `chrome.devtools.panels.create()` para criar uma nova aba "Phaser"
- Define qual HTML usar (`popup.html`) como conteúdo da aba
- Escuta eventos de quando a aba é mostrada/escondida

**Contexto**: Roda no contexto do DevTools quando o DevTools é aberto.

### `popup.html` - Interface do Plugin

**Função**: Interface visual compartilhada entre popup e DevTools.

**O que faz**:
- Carrega `inspector.ts` para adicionar funcionalidade
- Usa vanilla JavaScript para UI reativa (compatível com CSP)
- Pode ser aberto como popup (botão na toolbar) ou como painel do DevTools

**Contexto**: Roda tanto no popup quanto no painel do DevTools.

## Como Funciona a Comunicação

### Fluxo de Comunicação: Página Web → Plugin

```
┌─────────────────┐
│  Página Web     │
│  (seu jogo)     │
└────────┬────────┘
         │ window.postMessage()
         │ { source: 'phaser-data-hook', ... }
         ▼
┌─────────────────┐
│  content.ts     │ ◄─── Injeta scripts na página
│  (content.js)   │
└────────┬────────┘
         │ chrome.runtime.sendMessage()
         │ { type: 'PHX_EVENT', payload: ... }
         ▼
┌─────────────────┐
│  background.ts  │ ◄─── Service Worker central
│  (background.js)│
└────────┬────────┘
         │ chrome.runtime.connect()
         │ ou chrome.runtime.sendMessage()
         ▼
┌─────────────────┐
│  inspector.ts   │ ◄─── UI (popup ou DevTools)
│  (popup.html)   │
└─────────────────┘
```

### Como Enviar Dados da Página HTML para o Plugin

Para enviar dados da sua página HTML/jogo Phaser para o plugin, você precisa usar `window.postMessage()`:

#### 1. Na sua página HTML (onde roda o jogo Phaser):

```javascript
// Enviar dados para o plugin
window.postMessage({
  source: 'phaser-data-hook',  // IMPORTANTE: deve ter este campo
  type: 'GAME_STATE',
  data: {
    scene: 'MenuScene',
    score: 100,
    player: { x: 100, y: 200 }
  }
}, '*'); // '*' permite enviar para qualquer origem
```

#### 2. O `content.ts` já está configurado para escutar:

```typescript
// content.ts já tem este listener:
window.addEventListener('message', (e) => {
  if (e.data?.source === 'phaser-data-hook') {
    // Envia para o background
    chrome.runtime.sendMessage({ 
      type: 'PHX_EVENT', 
      payload: e.data 
    });
  }
});
```

#### 3. Para receber no popup/DevTools (`inspector.ts`):

Você precisa adicionar um listener no `background.ts` e depois enviar para o `inspector.ts`:

**Exemplo completo de comunicação**:

```typescript
// 1. Na sua página HTML
window.postMessage({
  source: 'phaser-data-hook',
  type: 'SCENE_CHANGED',
  sceneName: 'GameScene',
  timestamp: Date.now()
}, '*');

// 2. No background.ts (adicionar listener)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PHX_EVENT') {
    // Enviar para todas as conexões abertas (popup/DevTools)
    // Você precisaria manter um registro das conexões
    console.log('Received from content:', message.payload);
  }
});

// 3. No inspector.ts (já conectado via port)
port.onMessage.addListener((payload) => {
  console.log('Received in UI:', payload);
  // Atualizar UI com JavaScript vanilla
});
```

### Tipos de Comunicação Disponíveis

1. **`window.postMessage()`** - Comunicação entre página e content script
   - Usado quando a página quer enviar dados para o plugin
   - O content script escuta no `window`

2. **`chrome.runtime.sendMessage()`** - Comunicação unidirecional
   - Content script → Background
   - Popup → Background
   - Não mantém conexão aberta

3. **`chrome.runtime.connect()`** - Comunicação bidirecional (porta)
   - Mantém conexão aberta entre componentes
   - Permite enviar múltiplas mensagens
   - Usado no `inspector.ts` para conectar com background

4. **`chrome.runtime.onMessage.addListener()`** - Escutar mensagens
   - Usado no background para receber mensagens de qualquer componente

### Exemplo Prático: Enviar Estado do Phaser

```javascript
// No seu código Phaser (página HTML)
function sendPhaserDataToInspector(gameInstance) {
  const data = {
    source: 'phaser-data-hook',  // OBRIGATÓRIO
    type: 'PHASER_STATE',
    phaser: {
      version: Phaser.VERSION,
      scenes: gameInstance.scene.scenes.map(s => ({
        key: s.scene.key,
        active: s.scene.isActive(),
        visible: s.scene.isVisible()
      })),
      gameObjects: gameInstance.scene.scenes
        .filter(s => s.scene.isActive())
        .flatMap(s => s.children.list.map(child => ({
          type: child.constructor.name,
          active: child.active,
          visible: child.visible
        })))
    }
  };
  
  window.postMessage(data, '*');
}

// Chamar periodicamente ou em eventos específicos
setInterval(() => {
  if (window.game) { // assumindo que você expõe a instância do Phaser
    sendPhaserDataToInspector(window.game);
  }
}, 1000); // a cada segundo
```

## Features

- **DevTools Tab**: Aba customizada no Chrome DevTools (como Redux DevTools)
- **Popup Button**: Botão clicável na toolbar que abre popup
- **TypeScript**: Type safety completo
- **Vanilla JavaScript**: UI reativa sem frameworks (compatível com CSP)

## Technologies

- **TypeScript** - Desenvolvimento type-safe
- **Vite** - Build tool rápido com watch mode
- **Vanilla JavaScript** - UI reativa sem frameworks (compatível com CSP do Chrome)
