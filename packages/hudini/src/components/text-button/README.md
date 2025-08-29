# TextButton

Um componente de botão com texto que se adapta automaticamente ao tamanho do conteúdo e oferece total controle sobre estilo e comportamento.

## Funcionalidades

- ✅ **Auto-sizing**: O botão se ajusta automaticamente ao tamanho do texto + margem
- ✅ **Integração com Phaser Wind**: Usa tokens de design para cores, tamanhos, bordas e espaçamento
- ✅ **Comportamentos interativos**: Efeitos de hover e click suaves
- ✅ **Totalmente customizável**: Controle sobre fonte, cores, bordas e espaçamento
- ✅ **API fluente**: Suporte a method chaining para fácil customização

## Uso Básico

```typescript
import { TextButton } from 'hudini';

// Criar um botão simples
const button = new TextButton({
  scene: this,
  x: 400,
  y: 300,
  text: 'Click Me!',
  onClick: () => {
    console.log('Button clicked!');
  },
});

// Adicionar à cena
this.add.existing(button);
```

## Propriedades de Construção

```typescript
export type TextButtonParams = {
  scene: Scene; // Cena do Phaser
  x: number; // Posição X
  y: number; // Posição Y
  text: string; // Texto do botão

  // Opcionais com padrões sensatos
  fontSize?: FontSizeKey | number; // Tamanho da fonte ('xs', 'sm', 'md', 'lg', 'xl' ou px)
  font?: FontKey | string; // Família da fonte ('primary', 'secondary', 'monospace', 'display')
  backgroundColor?: ColorKey | string; // Cor de fundo (tokens ou CSS)
  textColor?: ColorKey | string; // Cor do texto (tokens ou CSS)
  borderRadius?: RadiusKey | number; // Raio da borda ('none', 'sm', 'md', 'lg', 'xl', 'full' ou px)
  margin?: SpacingKey | number; // Margem interna ('0', '1', '2', '3', '4'... ou px)
  onClick?: () => void; // Função de callback do click
};
```

## Exemplos Avançados

### Botão com Estilo Customizado

```typescript
const customButton = new TextButton({
  scene: this,
  x: 200,
  y: 200,
  text: 'Custom Style',
  fontSize: 'lg',
  font: 'display',
  backgroundColor: 'emerald-500',
  textColor: 'white',
  borderRadius: 'lg',
  margin: '6',
  onClick: () => {
    console.log('Custom button clicked!');
  },
});
```

### Botão com Valores em Pixels

```typescript
const pixelButton = new TextButton({
  scene: this,
  x: 300,
  y: 400,
  text: 'Pixel Perfect',
  fontSize: 18,
  backgroundColor: '#3B82F6',
  textColor: '#FFFFFF',
  borderRadius: 12,
  margin: 16,
});
```

### Atualização Dinâmica com Method Chaining

```typescript
const dynamicButton = new TextButton({
  scene: this,
  x: 400,
  y: 500,
  text: 'Dynamic',
});

// Customizar usando method chaining
dynamicButton
  .setText('Updated Text')
  .setFontSize('xl')
  .setBackgroundColor('red-600')
  .setTextColor('white')
  .setBorderRadius('full')
  .setMargin('8');
```

## API de Métodos

### Métodos de Configuração

```typescript
// Atualizar texto
button.setText('New Text'): TextButton

// Atualizar tamanho da fonte
button.setFontSize('lg' | 20): TextButton

// Atualizar fonte
button.setFont('monospace' | 'Arial, sans-serif'): TextButton

// Atualizar cor de fundo
button.setBackgroundColor('blue-500' | '#3B82F6'): TextButton

// Atualizar cor do texto
button.setTextColor('white' | '#FFFFFF'): TextButton

// Atualizar raio da borda
button.setBorderRadius('lg' | 12): TextButton

// Atualizar margem interna
button.setMargin('4' | 16): TextButton
```

### Propriedades Públicas

```typescript
button.buttonText; // GameObjects.Text - elemento de texto
button.backgroundSprite; // GameObjects.Sprite - sprite de fundo
button.shadowSprite; // GameObjects.Sprite - sprite de sombra
```

## Integração com Phaser Wind

O TextButton utiliza totalmente os tokens de design do Phaser Wind:

### Cores

- Use tokens como `'blue-500'`, `'red-600'`, `'emerald-400'`
- Ou cores CSS como `'#3B82F6'`, `'rgb(59, 130, 246)'`

### Tamanhos de Fonte

- `'xs'` (12px), `'sm'` (14px), `'md'` (16px), `'lg'` (18px), `'xl'` (20px)
- Ou valores em pixels: `14`, `18`, `24`

### Fontes

- `'primary'` - Inter, system-ui, sans-serif
- `'secondary'` - Roboto, Arial, sans-serif
- `'monospace'` - Fira Code, Consolas, monospace
- `'display'` - Poppins, Inter, sans-serif

### Raios de Borda

- `'none'` (0px), `'sm'` (4px), `'md'` (8px), `'lg'` (12px), `'xl'` (16px), `'full'` (máximo possível para o botão)

**Nota sobre `'full'`**: Quando você usa `borderRadius: 'full'`, o botão automaticamente calcula o raio máximo possível baseado nas suas dimensões (metade da menor dimensão), criando bordas totalmente arredondadas que se adaptam ao tamanho do conteúdo.

### Espaçamento

- `'0'`, `'1'` (4px), `'2'` (8px), `'3'` (12px), `'4'` (16px), `'5'` (20px), etc.

## Comportamentos Interativos

### Hover

- Escala suavemente para 105% com animação "Back.easeOut"
- Duração de 150ms

### Click

- Move o botão ligeiramente para baixo (2px) durante o pressionamento
- Retorna à posição original no release
- Duração de 100ms
- Executa callback `onClick` se fornecido

## Renderização

O TextButton é composto por três elementos principais:

1. **Shadow Sprite**: Sombra sutil atrás do botão
2. **Background Sprite**: Fundo colorido com bordas arredondadas
3. **Text**: Texto centralizado sobre o fundo

O tamanho do fundo é calculado automaticamente baseado nas dimensões do texto mais a margem especificada, garantindo que o botão sempre se ajuste perfeitamente ao conteúdo.
