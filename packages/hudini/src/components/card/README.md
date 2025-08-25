# Card Component

O componente `Card` é um container flexível que se adapta ao tamanho do seu conteúdo filho, usando tokens do phaser-wind para estilização.

## Características

- 🎯 **Adaptável**: Se ajusta automaticamente ao tamanho do filho
- 🎨 **Estilizável**: Usa tokens do phaser-wind para cores, border radius e margens
- 🔄 **Flexível**: Suporta qualquer componente filho do Phaser
- ⚡ **Performance**: Usa Graphics diretamente (sem texturas)

## Uso Básico

```typescript
import { Card } from 'hudini';

// Criar um card simples
const text = scene.add.text(0, 0, 'Conteúdo do Card');
const card = new Card({
  scene,
  x: 100,
  y: 100,
  child: text,
});

scene.add.existing(card);
```

## Uso Avançado

```typescript
// Card com propriedades customizadas
const card = new Card({
  scene,
  x: 200,
  y: 200,
  backgroundColor: 'blue-500',
  borderRadius: 'lg',
  margin: '6',
  child: scene.add.text(0, 0, 'Card Customizado'),
});

// Métodos encadeáveis
card.setBackgroundColor('green-500').setBorderRadius('xl').setMargin('8');
```

## Propriedades

| Propriedade       | Tipo                   | Padrão          | Descrição        |
| ----------------- | ---------------------- | --------------- | ---------------- |
| `scene`           | `Scene`                | **obrigatório** | Cena do Phaser   |
| `x`               | `number`               | **obrigatório** | Posição X        |
| `y`               | `number`               | **obrigatório** | Posição Y        |
| `backgroundColor` | `ColorKey \| string`   | `'white'`       | Cor de fundo     |
| `borderRadius`    | `RadiusKey \| number`  | `'md'`          | Raio das bordas  |
| `margin`          | `SpacingKey \| number` | `'4'`           | Margem interna   |
| `child`           | `GameObject`           | **obrigatório** | Componente filho |

## Métodos

### `setBackgroundColor(color: ColorKey | string): this`

Define a cor de fundo do card.

### `setBorderRadius(borderRadius: RadiusKey | number): this`

Define o raio das bordas do card.

### `setMargin(margin: SpacingKey | number): this`

Define a margem interna do card.

### `setChild(child: GameObject): this`

Define um novo componente filho para o card.

## Tokens Suportados

### Cores (ColorKey)

- `'red-500'`, `'blue-600'`, `'green-700'`, etc.
- Cores CSS válidas como `'#ff0000'` ou `'rgb(255, 0, 0)'`

### Border Radius (RadiusKey)

- `'none'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'3xl'`, `'full'`
- Números em pixels

### Margens (SpacingKey)

- `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`
- Números em pixels

## Exemplo com Diferentes Filhos

```typescript
// Card com texto
const textCard = new Card({
  scene,
  x: 100,
  y: 100,
  child: scene.add.text(0, 0, 'Texto simples'),
});

// Card com botão
const buttonCard = new Card({
  scene,
  x: 300,
  y: 100,
  child: new IconButton({ scene, x: 0, y: 0, icon: 'plus' }),
});

// Card com progress bar
const progressCard = new Card({
  scene,
  x: 500,
  y: 100,
  child: new LinearProgress({ scene, x: 0, y: 0, width: 200, height: 20 }),
});
```

## Comportamento de Layout

O card automaticamente:

1. Calcula o tamanho do filho usando `getBounds()`
2. Adiciona a margem configurada
3. Centraliza o filho dentro do card
4. Redesenha o background com as dimensões corretas
5. Aplica o border radius limitado às dimensões

## Limitações

- O filho deve implementar o método `getBounds()` para cálculo de dimensões
- O border radius é automaticamente limitado para evitar artefatos visuais
- O filho é sempre centralizado dentro do card
