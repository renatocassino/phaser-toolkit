# @cassinodev/phaser-toolkit-core

Utilitários e tipos principais para desenvolvimento de jogos com Phaser.

## 📦 Instalação

```bash
npm install @cassinodev/phaser-toolkit-core
# ou
pnpm add @cassinodev/phaser-toolkit-core
# ou
yarn add @cassinodev/phaser-toolkit-core
```

## 🚀 Uso

```typescript
import {
  distance,
  normalize,
  clamp,
  lerp,
  degreesToRadians,
  radiansToDegrees
} from '@cassinodev/phaser-toolkit-core';

import type { Position, Velocity, GameConfig } from '@cassinodev/phaser-toolkit-core';

// Calcular distância entre dois pontos
const point1: Position = { x: 0, y: 0 };
const point2: Position = { x: 10, y: 10 };
const dist = distance(point1, point2); // ~14.14

// Normalizar um vetor
const velocity: Velocity = { x: 10, y: 5 };
const normalized = normalize(velocity);

// Interpolar entre valores
const interpolated = lerp(0, 100, 0.5); // 50

// Limitar valores
const clamped = clamp(150, 0, 100); // 100
```

## 📋 API

### Tipos

- `Position` - Posição x,y
- `Size` - Largura e altura  
- `Rectangle` - Retângulo com posição e tamanho
- `Velocity` - Velocidade x,y
- `Direction` - Direções: 'up', 'down', 'left', 'right'
- `GameConfig` - Configuração básica do jogo

### Utilitários

- `distance(point1, point2)` - Calcula distância entre pontos
- `normalize(velocity)` - Normaliza um vetor
- `clamp(value, min, max)` - Limita valor entre min e max
- `lerp(start, end, factor)` - Interpolação linear
- `degreesToRadians(degrees)` - Converte graus para radianos
- `radiansToDegrees(radians)` - Converte radianos para graus

### Constantes

- `DIRECTIONS` - Constantes de direção
- `PHYSICS_TYPES` - Tipos de física disponíveis
- `DEFAULT_GAME_CONFIG` - Configuração padrão do jogo

## 📄 Licença

MIT