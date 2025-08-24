# SectionHeader

Um componente de cabeçalho estilizado perfeito para usar no topo de menus, painéis e seções. Oferece sombra vertical, texto com stroke e auto-sizing baseado no conteúdo.

## Funcionalidades

- ✅ **Auto-sizing**: O cabeçalho se ajusta automaticamente ao tamanho do texto + margem
- ✅ **Sombra vertical**: Sombra que projeta apenas para baixo, ideal para headers
- ✅ **Texto com stroke**: Bordas no texto para maior legibilidade e impacto visual
- ✅ **Integração com Phaser Wind**: Usa tokens de design para cores, tamanhos, bordas e espaçamento
- ✅ **Totalmente customizável**: Controle sobre fonte, cores, bordas, stroke e espaçamento
- ✅ **API fluente**: Suporte a method chaining para fácil customização
- ✅ **Fonte em negrito**: Texto em bold por padrão para maior destaque

## Uso Básico

```typescript
import { SectionHeader } from 'hudini';

// Criar um cabeçalho simples
const header = new SectionHeader({
  scene: this,
  x: 400,
  y: 100,
  text: 'Game Settings',
});

// Adicionar à cena
this.add.existing(header);
```

## Propriedades de Construção

```typescript
export type SectionHeaderParams = {
  scene: Scene; // Cena do Phaser
  x: number; // Posição X
  y: number; // Posição Y
  text: string; // Texto do cabeçalho

  // Opcionais com padrões sensatos
  textSize?: FontSizeKey | number; // Tamanho da fonte ('xs', 'sm', 'base', 'lg', 'xl'... ou px) - padrão: 'lg'
  font?: FontKey | string; // Família da fonte ('primary', 'secondary', 'monospace', 'display') - padrão: 'display'
  backgroundColor?: ColorKey | string; // Cor de fundo (tokens ou CSS) - padrão: 'blue-600'
  textColor?: ColorKey | string; // Cor do texto (tokens ou CSS) - padrão: 'white'
  strokeColor?: ColorKey | string; // Cor do stroke do texto (auto-calculada se não fornecida)
  borderRadius?: RadiusKey | number; // Raio da borda ('none', 'sm', 'md', 'lg', 'xl', 'full' ou px) - padrão: 'md'
  margin?: SpacingKey | number; // Margem interna ('0', '1', '2', '3', '4'... ou px) - padrão: '4'
};
```

## Exemplos Avançados

### Cabeçalho Principal de Menu

```typescript
const mainHeader = new SectionHeader({
  scene: this,
  x: 400,
  y: 80,
  text: 'MAIN MENU',
  textSize: 'xl',
  font: 'display',
  backgroundColor: 'slate-700',
  textColor: 'white',
  strokeColor: 'slate-900',
  borderRadius: 'lg',
  margin: '6',
});
```

### Cabeçalho de Seção

```typescript
const sectionHeader = new SectionHeader({
  scene: this,
  x: 200,
  y: 150,
  text: 'Audio Settings',
  textSize: 'lg',
  backgroundColor: 'green-600',
  textColor: 'white',
  borderRadius: 'md',
  margin: '4',
});
```

### Cabeçalho Estilo Pill

```typescript
const pillHeader = new SectionHeader({
  scene: this,
  x: 300,
  y: 200,
  text: '🏆 Achievements',
  textSize: 'lg',
  backgroundColor: 'yellow-600',
  textColor: 'white',
  strokeColor: 'yellow-800',
  borderRadius: 'full',
  margin: '5',
});
```

### Atualização Dinâmica com Method Chaining

```typescript
const dynamicHeader = new SectionHeader({
  scene: this,
  x: 400,
  y: 250,
  text: 'Dynamic Header',
});

// Customizar usando method chaining
dynamicHeader
  .setText('Updated Title')
  .setTextSize('2xl')
  .setBackgroundColor('purple-600')
  .setTextColor('white')
  .setStrokeColor('purple-800')
  .setBorderRadius('full')
  .setMargin('8');
```

## API de Métodos

### Métodos de Configuração

```typescript
// Atualizar texto
header.setText('New Title'): SectionHeader

// Atualizar tamanho da fonte
header.setTextSize('xl' | 24): SectionHeader

// Atualizar fonte
header.setFont('display' | 'Arial, sans-serif'): SectionHeader

// Atualizar cor de fundo
header.setBackgroundColor('purple-600' | '#7C3AED'): SectionHeader

// Atualizar cor do texto
header.setTextColor('white' | '#FFFFFF'): SectionHeader

// Atualizar cor do stroke
header.setStrokeColor('purple-800' | '#5B21B6'): SectionHeader

// Atualizar raio da borda
header.setBorderRadius('lg' | 12): SectionHeader

// Atualizar margem interna
header.setMargin('6' | 24): SectionHeader
```

### Propriedades Públicas

```typescript
header.headerText; // GameObjects.Text - elemento de texto
header.backgroundSprite; // GameObjects.Sprite - sprite de fundo
header.shadowSprite; // GameObjects.Sprite - sprite de sombra
```

## Integração com Phaser Wind

O SectionHeader utiliza totalmente os tokens de design do Phaser Wind:

### Cores

- Use tokens como `'blue-600'`, `'green-500'`, `'purple-700'`
- Ou cores CSS como `'#3B82F6'`, `'rgb(59, 130, 246)'`

### Tamanhos de Fonte

- `'xs'` (12px), `'sm'` (14px), `'base'` (16px), `'lg'` (18px), `'xl'` (20px), `'2xl'`, `'3xl'`, etc.
- Ou valores em pixels: `16`, `20`, `28`

### Fontes

- `'primary'` - Inter, system-ui, sans-serif
- `'secondary'` - Roboto, Arial, sans-serif
- `'monospace'` - Fira Code, Consolas, monospace
- `'display'` - Poppins, Inter, sans-serif (padrão para headers)

### Raios de Borda

- `'none'` (0px), `'sm'` (4px), `'md'` (8px), `'lg'` (12px), `'xl'` (16px), `'full'` (máximo possível)

**Nota sobre `'full'`**: Quando você usa `borderRadius: 'full'`, o cabeçalho automaticamente calcula o raio máximo possível baseado nas suas dimensões, criando bordas totalmente arredondadas (estilo pill).

### Espaçamento

- `'0'`, `'1'` (4px), `'2'` (8px), `'3'` (12px), `'4'` (16px), `'5'` (20px), etc.

## Design e Estilo

### Sombra Vertical

- Projeção apenas no eixo Y (4px para baixo)
- Sem deslocamento horizontal
- Opacidade de 25% para sutil profundidade

### Texto com Stroke

- Stroke automático para melhor legibilidade
- Espessura de 2px
- Cor calculada automaticamente (versão mais escura do fundo) ou customizável
- Texto em **negrito** por padrão

### Efeito de Gradiente Sutil

- Highlight branco sutil na parte superior (15% da altura)
- Opacidade de 15% para dar sensação de profundidade
- Mantém o visual clean e profissional

## Casos de Uso Ideais

### 🎮 Interfaces de Jogo

- Cabeçalhos de menus principais
- Títulos de seções em painéis de configuração
- Headers de inventário e status
- Títulos de diálogos e pop-ups

### 📱 Painéis e Modais

- Títulos de janelas de configuração
- Headers de seções em formulários
- Cabeçalhos de listas e categorias
- Títulos de abas e navegação

### 🏆 Sistema de Conquistas

- Títulos de categorias de achievements
- Headers de leaderboards
- Seções de progressão

## Renderização

O SectionHeader é composto por três elementos principais:

1. **Shadow Sprite**: Sombra vertical sutil atrás do cabeçalho
2. **Background Sprite**: Fundo colorido com gradiente sutil e bordas arredondadas
3. **Header Text**: Texto em negrito com stroke centralizado sobre o fundo

O tamanho do fundo é calculado automaticamente baseado nas dimensões do texto mais a margem especificada, garantindo que o cabeçalho sempre se ajuste perfeitamente ao conteúdo.
