# CircularProgress Component

O componente `CircularProgress` é um indicador de carregamento animado que usa ícones do Font Awesome e tokens de cor do Phaser Wind.

## Características

- Ícone rotativo customizável (padrão: `spinner`)
- Cores baseadas nos tokens do Phaser Wind (padrão: `blue`)
- Velocidade de rotação configurável (padrão: 60 rotações por minuto = 1 rotação por segundo)
- Tamanho configurável usando tokens do Phaser Wind ou valores em pixels
- Controles para iniciar/parar a animação

## Uso Básico

```typescript
import { CircularProgress } from 'hudini';

// Uso básico com configurações padrão
const progress = new CircularProgress({
  scene: this,
  x: 400,
  y: 300,
});

// Adicionar à cena
this.add.existing(progress);
```

## Configuração Avançada

```typescript
// Com configurações customizadas
const customProgress = new CircularProgress({
  scene: this,
  x: 400,
  y: 300,
  icon: 'gear',                    // Ícone personalizado
  color: 'red',                    // Cor personalizada
  size: 'lg',                      // Tamanho usando token do Phaser Wind
  rotationsPerMinute: 90,         // 90 RPM = 1.5 rotações por segundo
});

// Ou usando tamanho em pixels
const pixelSizedProgress = new CircularProgress({
  scene: this,
  x: 400,
  y: 300,
  size: 32,              // 32 pixels
});
```

## Métodos Disponíveis

### Controle de Animação

```typescript
// Iniciar animação
progress.start();

// Parar animação
progress.stop();

// Verificar se está girando
if (progress.spinning) {
  console.log('Está girando!');
}
```

### Configuração Dinâmica

```typescript
// Alterar velocidade
progress.setRotationsPerMinute(180); // 180 RPM = 3 rotações por segundo

// Alterar ícone
progress.setIcon('rotate');

// Alterar cor
progress.setColor('green');

// Alterar tamanho
progress.setSize('xl'); // ou progress.setSize(48)
```

## Parâmetros

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|---------|-----------|
| `scene` | `Scene` | - | Cena do Phaser (obrigatório) |
| `x` | `number` | - | Posição X (obrigatório) |
| `y` | `number` | - | Posição Y (obrigatório) |
| `icon` | `IconKey` | `'spinner'` | Ícone do Font Awesome |
| `size` | `FontSizeKey \| number` | `'md'` | Tamanho do ícone |
| `color` | `ColorKey` | `'blue'` | Cor do ícone |
| `rotationsPerMinute` | `number` | `60` | Velocidade em rotações por minuto (RPM) |

## Ícones Recomendados

Alguns ícones que funcionam bem para indicadores de progresso:
- `spinner` (padrão)
- `gear`
- `rotate`
- `arrows-rotate`
- `circle-notch` (se disponível)

## Cores Disponíveis

Use qualquer token de cor do Phaser Wind:
- `blue` (padrão)
- `red`
- `green`
- `yellow`
- `purple`
- `pink`
- `gray`
- E muitas outras...

## Limpeza

```typescript
// Limpar o componente quando não precisar mais
progress.destroy();
```