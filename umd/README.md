# Phaser Toolkit UMD Builds

Este diretório contém builds UMD (Universal Module Definition) de todos os packages do Phaser Toolkit, permitindo uso direto no browser via tags `<script>`.

**Localização:** `/umd/` (na raiz do projeto)

## Arquivos Disponíveis

### Packages Individuais
- `phaser-hooks.umd.js` / `phaser-hooks.umd.min.js` - Hooks em estilo React para Phaser
- `phaser-wind.umd.js` / `phaser-wind.umd.min.js` - Sistema de estilos similar ao Tailwind CSS
- `font-awesome-for-phaser.umd.js` / `font-awesome-for-phaser.umd.min.js` - Integração de ícones Font Awesome
- `hudini.umd.js` / `hudini.umd.min.js` - Componentes de UI mágicos para HUD
- `phaser-sound-studio.umd.js` / `phaser-sound-studio.umd.min.js` - Estúdio de som para Phaser
- `phaser-virtual-joystick.umd.js` / `phaser-virtual-joystick.umd.min.js` - Joystick virtual para mobile

### Bundle Completo
- `phaser-toolkit.umd.js` / `phaser-toolkit.umd.min.js` - Todos os packages em um único arquivo

## Como Usar

### 1. Dependências Externas

Certifique-se de incluir as dependências necessárias antes dos arquivos UMD:

```html
<!-- Phaser (obrigatório) -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>

<!-- Lodash (necessário para alguns packages) -->
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>

<!-- WebFont Loader (necessário para font-awesome-for-phaser) -->
<script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js"></script>
```

### 2. Usando Packages Individuais

```html
<!DOCTYPE html>
<html>
<head>
    <title>Meu Jogo Phaser</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
</head>
<body>
    <div id="game-container"></div>
    
    <!-- Incluir apenas os packages que você precisa -->
    <script src="./phaser-hooks.umd.min.js"></script>
    <script src="./phaser-wind.umd.min.js"></script>
    <script src="./hudini.umd.min.js"></script>
    
    <script>
        // Agora você pode usar os packages
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: {
                create() {
                    // Usar PhaserHooks
                    const hooks = new PhaserHooks.useState(0);
                    
                    // Usar PhaserWind
                    const wind = new PhaserWind.WindSystem(this);
                    
                    // Usar Hudini
                    const button = new Hudini.Button(this, 100, 100, 'Click me!');
                }
            }
        };
        
        const game = new Phaser.Game(config);
    </script>
</body>
</html>
```

### 3. Usando o Bundle Completo

```html
<!DOCTYPE html>
<html>
<head>
    <title>Meu Jogo Phaser</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js"></script>
</head>
<body>
    <div id="game-container"></div>
    
    <!-- Incluir o bundle completo -->
    <script src="./phaser-toolkit.umd.min.js"></script>
    
    <script>
        // Usar através do namespace PhaserToolkit
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: {
                create() {
                    // Acessar packages individuais
                    const hooks = new PhaserToolkit.PhaserHooks.useState(0);
                    const wind = new PhaserToolkit.PhaserWind.WindSystem(this);
                    const button = new PhaserToolkit.Hudini.Button(this, 100, 100, 'Click me!');
                    
                    // Ou usar diretamente (se exportado no nível raiz)
                    // const hooks2 = new PhaserHooks.useState(0);
                }
            }
        };
        
        const game = new Phaser.Game(config);
    </script>
</body>
</html>
```

## Variáveis Globais

Cada package UMD cria uma variável global:

- `PhaserHooks` - phaser-hooks
- `PhaserWind` - phaser-wind  
- `FontAwesome` - font-awesome-for-phaser
- `Hudini` - hudini
- `SoundStudio` - phaser-sound-studio
- `VirtualJoystick` - phaser-virtual-joystick
- `PhaserToolkit` - bundle completo (contém todos os packages)

## Exemplo Completo

Veja o arquivo `example.html` para um exemplo completo de uso.

## Builds

Para gerar os builds UMD, execute:

```bash
# Build apenas UMD
pnpm build:umd

# Build completo (TypeScript + UMD)
pnpm build:all

# Servir localmente para teste
pnpm serve:umd
```

Os arquivos UMD são gerados no diretório `umd/` e podem ser servidos diretamente de um servidor web.

## Versionamento

Os arquivos UMD são versionados junto com o repositório e podem ser acessados diretamente via:
- GitHub Pages: `https://cassinodev.github.io/phaser-toolkit/umd/`
- CDN: `https://cdn.jsdelivr.net/gh/cassinodev/phaser-toolkit@main/umd/`