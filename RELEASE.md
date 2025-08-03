# 🚀 Release Workflow

Este documento descreve o processo de release automatizado para o @cassinodev/phaser-toolkit.

## 📋 Visão Geral

O processo de release é **totalmente automatizado** usando:

- **Changesets** para versionamento semântico
- **GitHub Actions** para CI/CD
- **NPM** para publicação dos pacotes

## 🔄 Fluxo de Release

### 1. Desenvolvimento

Durante o desenvolvimento, para cada mudança significativa:

```bash
# Após fazer suas alterações
pnpm changeset
```

Isso irá:

- Perguntar quais pacotes foram alterados
- Solicitar o tipo de mudança (major, minor, patch)
- Pedir uma descrição da mudança

### 2. Commit e Push

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### 3. Automação CI/CD

Quando você faz push para `main`:

1. **CI Workflow** executa:
   - ✅ Instala dependências
   - ✅ Verifica tipos TypeScript
   - ✅ Executa linting
   - ✅ Constrói todos os pacotes
   - ✅ Executa testes

2. **Release Workflow** (se CI passar):
   - 🔍 Detecta se há changesets
   - 📝 Cria/atualiza um Release PR
   - 📦 Ou publica diretamente se não há mudanças pendentes

### 4. Publicação

Quando o **Release PR** é merged:

- 🏷️ Versões são atualizadas automaticamente
- 📦 Pacotes são publicados no NPM
- 📋 Changelog é atualizado
- 🏷️ Git tags são criadas

## 🏷️ Versionamento Semântico

### Major (1.0.0 → 2.0.0)

Breaking changes que quebram compatibilidade:

```bash
# Exemplo de changeset major
---
"@cassinodev/phaser-toolkit-core": major
---

BREAKING: Remove deprecated API methods
```

### Minor (1.0.0 → 1.1.0)

Novas features backwards-compatible:

```bash
# Exemplo de changeset minor
---
"@cassinodev/phaser-toolkit-ui": minor
---

Add new Button component with hover effects
```

### Patch (1.0.0 → 1.0.1)

Bug fixes e melhorias:

```bash
# Exemplo de changeset patch
---
"@cassinodev/phaser-toolkit-core": patch
---

Fix distance calculation for negative coordinates
```

## 📦 Publicação Manual

Em casos especiais, você pode publicar manualmente:

```bash
# 1. Certifique-se que tudo está buildado
pnpm build

# 2. Versione os pacotes
pnpm changeset:version

# 3. Publique
pnpm changeset:publish
```

## 🔐 Configuração de Secrets

Para que o workflow funcione, configure estes secrets no GitHub:

### NPM_TOKEN

1. Acesse https://www.npmjs.com/settings/tokens
2. Crie um **Automation Token**
3. Adicione como secret `NPM_TOKEN` no repo

### Permissions

O `GITHUB_TOKEN` já tem as permissões necessárias configuradas no workflow.

## 📊 Status dos Pacotes

Você pode verificar o status de cada pacote:

```bash
# Ver versões atuais
pnpm changeset status

# Ver quais mudanças estão pendentes
cat .changeset/*.md
```

## 🎯 Exemplo Completo

### Cenário: Adicionando uma nova feature

```bash
# 1. Desenvolva a feature
# ... código ...

# 2. Teste localmente
pnpm test
pnpm build

# 3. Documente a mudança
pnpm changeset
# Selecione: @cassinodev/phaser-toolkit-ui → minor
# Descrição: "Add tooltip component for better UX"

# 4. Commit e push
git add .
git commit -m "feat(ui): add tooltip component"
git push origin main

# 5. CI rodará automaticamente
# 6. Release PR será criado/atualizado
# 7. Merge do Release PR → Publicação automática
```

## 🚨 Troubleshooting

### Build Failing

```bash
# Verifique localmente
pnpm ci
```

### Release Não Sendo Criado

- Verifique se há changesets: `ls .changeset/`
- Confirme que o CI passou
- Verifique os logs do GitHub Actions

### NPM Publish Failing

- Confirme que `NPM_TOKEN` está configurado
- Verifique se você tem permissões na organização @cassinodev
- Confirme que os nomes dos pacotes estão corretos

## 📚 Recursos

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
