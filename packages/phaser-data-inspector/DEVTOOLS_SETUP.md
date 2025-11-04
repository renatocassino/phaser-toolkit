# DevTools Setup - Propriedades do Manifest

## 📋 Propriedades Necessárias no manifest.json

### 1. **`devtools_page`** (String)
- **O que é**: Especifica o arquivo HTML que será carregado no contexto do DevTools
- **Valor**: `"devtools.html"`
- **Função**: Este arquivo é carregado quando o DevTools é aberto e cria a aba customizada

```json
{
  "devtools_page": "devtools.html"
}
```

### 2. **`permissions`** (Array)
- **O que é**: Permissões necessárias para a extensão funcionar
- **Importante**: Não é necessário adicionar `"devtools"` nas permissões! Apenas ter `devtools_page` já dá acesso à API do DevTools automaticamente
- **Outras permissões**: `"activeTab"`, `"scripting"` para funcionalidades básicas

```json
{
  "permissions": [
    "activeTab",
    "scripting"
  ]
}
```

> **⚠️ Nota**: A permissão `"devtools"` não existe na API do Chrome Extensions. Quando você declara `devtools_page`, você automaticamente tem acesso à API `chrome.devtools.*` sem precisar de permissões adicionais.

### 3. **`action.default_popup`** (String)
- **O que é**: Define o popup que aparece quando o usuário clica no ícone da extensão na barra de ferramentas
- **Valor**: `"popup.html"`
- **Função**: Abre uma janela popup quando o botão da extensão é clicado

```json
{
  "action": {
    "default_popup": "popup.html",
    "default_title": "Phaser Data Inspector",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  }
}
```

## 🔧 Como Funciona

### Fluxo do DevTools:

1. **`devtools.html`** → Carregado quando DevTools abre
   - Este arquivo cria a aba usando `chrome.devtools.panels.create()`
   - Define o título, ícone e conteúdo da aba

2. **`popup.html`** → Conteúdo da aba customizada (mesmo arquivo usado no popup)
   - Este é o HTML que aparece dentro da aba "Phaser" no DevTools
   - Funciona como uma página normal dentro do contexto do DevTools
   - Compartilha o mesmo código com o popup (igual ao Redux DevTools)

### Fluxo do Popup:

1. **`popup.html`** → Abre quando o usuário clica no ícone da extensão
   - Aparece como um popup ao lado da barra de pesquisa
   - Funciona independentemente do DevTools

## 📝 Resumo das Propriedades

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `devtools_page` | String | HTML que cria a aba no DevTools (automaticamente dá acesso à API do DevTools) |
| `permissions` | Array | Permissões básicas (`activeTab`, `scripting`) - **NÃO precisa de `"devtools"`** |
| `action.default_popup` | String | Popup quando clica no ícone da extensão |
| `action.default_icon` | Object | Ícones da extensão (16x16, 48x48, 128x128) |

## 🎯 Resultado

- ✅ **Aba no DevTools**: Aparece ao lado de Elements, Console, Sources, etc.
- ✅ **Botão na barra**: Ícone clicável que abre popup
- ✅ **Funciona igual ao Redux DevTools**: Mesma estrutura e comportamento
