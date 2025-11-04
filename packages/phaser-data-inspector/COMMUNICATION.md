# Comunicação entre Contextos da Extensão Chrome

## 📋 Contextos da Extensão

### 1. **Content Script** (`content.ts`)
- ✅ **Roda no contexto da página web** - Tem acesso ao DOM da página
- ✅ **Isolado da página** - Não pode acessar variáveis globais da página diretamente
- ✅ **Pode executar JavaScript** - Mas precisa injetar scripts se quiser acessar contexto da página
- ✅ **Comunica com Background** via `chrome.runtime.sendMessage()`

### 2. **Background Service Worker** (`background.ts`)
- ✅ **Contexto da extensão** - Não tem acesso ao DOM
- ✅ **Recebe mensagens** de content scripts e popup
- ✅ **Envia mensagens** para content scripts e popup
- ✅ **Pode usar `chrome.tabs.sendMessage()`** para enviar para content scripts

### 3. **Popup/DevTools Panel** (`App.tsx` / `popup.html`)
- ✅ **Contexto da UI da extensão** - Não tem acesso ao DOM da página
- ✅ **Comunica via mensagens** - Não pode acessar diretamente a página
- ✅ **Recebe mensagens** via `chrome.runtime.onMessage` ou `chrome.runtime.connect()`

## 🔄 Fluxo de Comunicação

### Content Script → Background

```typescript
// content.ts
chrome.runtime.sendMessage(
  { type: 'PHX_EVENT', payload: data },
  (response) => {
    console.log('Response from background:', response);
  }
);
```

```typescript
// background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PHX_EVENT') {
    console.log('Received from content:', message.payload);
    // Processar e enviar para popup
    sendResponse({ success: true });
  }
});
```

### Background → Popup/DevTools

**Opção 1: sendMessage (one-time)**
```typescript
// background.ts
chrome.runtime.sendMessage({ type: 'UPDATE_DATA', data: data });
```

```typescript
// App.tsx
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_DATA') {
    // Atualizar UI
  }
});
```

**Opção 2: Port (long-lived connection)**
```typescript
// background.ts
const port = chrome.runtime.connect({ name: 'phaser-devtools' });
port.postMessage({ type: 'UPDATE_DATA', data: data });
```

```typescript
// App.tsx
const port = chrome.runtime.connect({ name: 'phaser-devtools' });
port.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_DATA') {
    // Atualizar UI
  }
});
```

### Background → Content Script

```typescript
// background.ts
chrome.tabs.sendMessage(tabId, { type: 'DO_SOMETHING', data: data });
```

```typescript
// content.ts
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DO_SOMETHING') {
    // Executar na página
  }
});
```

## 🎯 Injetar Scripts na Página

Se você precisa acessar o contexto real da página (não o isolado do content script):

```typescript
// content.ts
function injectScript(src: string) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(src);
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

// Ou injetar código diretamente
function injectCode(code: string) {
  const script = document.createElement('script');
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

// Exemplo: Acessar Phaser na página
injectCode(`
  if (window.Phaser) {
    window.postMessage({
      source: 'phaser-inspector',
      type: 'PHASER_FOUND',
      version: window.Phaser.VERSION
    }, '*');
  }
`);
```

## 📝 Resumo

| De | Para | Método |
|----|------|--------|
| Content | Background | `chrome.runtime.sendMessage()` |
| Background | Content | `chrome.tabs.sendMessage()` |
| Background | Popup | `chrome.runtime.sendMessage()` ou `port.postMessage()` |
| Popup | Background | `chrome.runtime.sendMessage()` ou `port.postMessage()` |
| Content → Page | Page | Injeta script ou usa `window.postMessage()` |

## ⚠️ Importante

- **Content Script** roda isolado - não vê variáveis da página
- **Injetar scripts** se precisar acessar contexto real da página
- **Mensagens** são assíncronas - use callbacks ou Promises
- **Ports** são melhores para comunicação contínua
- **sendMessage** é melhor para comunicação one-time
