# Guia de Contribuição

Obrigado por seu interesse em contribuir com o @renatocassino/phaser-toolkit!

## 🚀 Configuração do Ambiente

### Pré-requisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/renatocassino/phaser-toolkit.git
cd phaser-toolkit

# Instale as dependências
pnpm install

# Construa todos os pacotes
pnpm build
```

## 📦 Estrutura do Monorepo

```
phaser-toolkit/
├── packages/          # Pacotes principais
│   ├── core/         # Utilitários e tipos básicos
│   ├── ui/           # Componentes de UI
│   └── ...           # Outros pacotes
├── apps/             # Aplicações de exemplo
├── .github/          # Workflows do GitHub Actions
└── .changeset/       # Configuração do Changesets
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolver todos os pacotes em modo watch
pnpm dev

# Construir todos os pacotes
pnpm build

# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm typecheck

# Executar linting
pnpm lint

# Limpar builds anteriores
pnpm clean
```

## 📝 Processo de Contribuição

### 1. Criando uma Nova Feature

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/minha-nova-feature
   ```

### 2. Desenvolvimento

1. **Faça suas alterações** nos pacotes relevantes
2. **Escreva testes** para novas funcionalidades
3. **Execute os testes**:
   ```bash
   pnpm test
   ```
4. **Verifique o lint**:
   ```bash
   pnpm lint
   ```

### 3. Documentação de Mudanças

Usamos [Changesets](https://github.com/changesets/changesets) para gerenciar versioning. Para cada mudança significativa:

```bash
pnpm changeset
```

Siga as instruções para:

- Selecionar os pacotes afetados
- Escolher o tipo de mudança (major, minor, patch)
- Descrever a mudança

### 4. Commit e Push

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
git push origin feature/minha-nova-feature
```

### 5. Pull Request

1. **Abra um PR** no GitHub
2. **Descreva** suas mudanças detalhadamente
3. **Aguarde** a revisão

## 🏗️ Criando um Novo Pacote

Para criar um novo pacote:

1. **Crie a estrutura**:

   ```bash
   mkdir -p packages/meu-pacote/src
   ```

2. **Configure o package.json**:

   ```json
   {
     "name": "@cassinodev/phaser-toolkit-meu-pacote",
     "version": "0.1.0",
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "scripts": {
       "build": "tsc --build",
       "dev": "tsc --build --watch",
       "clean": "rm -rf dist"
     }
   }
   ```

3. **Configure o tsconfig.json**:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src",
       "declaration": true,
       "noEmit": false,
       "composite": true,
       "allowImportingTsExtensions": false
     },
     "include": ["src/**/*"]
   }
   ```

## ✅ Padrões de Código

### TypeScript

- Use **tipos explícitos** sempre que possível
- Documente **funções públicas** com JSDoc
- Use **interfaces** para definir contratos
- Prefira **const assertions** quando apropriado

### Nomenclatura

- **Arquivos**: kebab-case (`button-component.ts`)
- **Classes**: PascalCase (`ButtonComponent`)
- **Funções/Variáveis**: camelCase (`handleClick`)
- **Constantes**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)

### Estrutura de Arquivos

```
src/
├── index.ts          # Exportações principais
├── types/            # Definições de tipos
├── utils/            # Funções utilitárias
├── components/       # Componentes (se aplicável)
└── constants/        # Constantes
```

## 🧪 Testes

- Use **Vitest** para testes unitários
- Mantenha **cobertura alta** (>80%)
- Teste **casos extremos** e **erros**
- Use **mocks** para dependências externas

Exemplo:

```typescript
import { describe, it, expect } from 'vitest';
import { minhaFuncao } from './minha-funcao.js';

describe('minhaFuncao', () => {
  it('deve retornar o resultado esperado', () => {
    expect(minhaFuncao(1, 2)).toBe(3);
  });
});
```

## 📚 Documentação

- **README.md** para cada pacote
- **JSDoc** para APIs públicas
- **Exemplos de uso** práticos
- **Changelog** automático via Changesets

## 🚀 Publicação

A publicação é **automática** via GitHub Actions quando mudanças são merged na branch `main` com changesets.

O processo:

1. **CI** verifica builds e testes
2. **Changesets** detecta mudanças
3. **Release PR** é criado automaticamente
4. **Merge do Release PR** publica no NPM

## ❓ Dúvidas?

- Abra uma **Issue** para discussões
- Use **Discussions** para perguntas gerais
- Mencione **@cassinodev** em PRs complexos

Obrigado por contribuir! 🎉
