import { TypographyPicker } from '../../phaser-wind';

export class DemoScene extends Phaser.Scene {
  constructor() {
    super('DemoScene');
  }

  preload() {}

  create() {
    const { pw } = this; // Get PhaserWind theme instance

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Título usando TypographyPicker
    const titleStyle = TypographyPicker.phaserStyle('heading-large');
    this.add
      .text(centerX, centerY - 180, 'Phaser Wind', {
        ...titleStyle,
        color: pw.color.rgb('slate-200'),
        align: 'center',
        fontSize: pw.fontSize.px('6xl'),
      })
      .setOrigin(0.5, 0.5);

    // Subtítulo
    const subtitleStyle = TypographyPicker.phaserStyle('body');
    this.add
      .text(centerX, centerY - 130, 'Design tokens e utilitários', {
        ...subtitleStyle,
        color: '#cbd5e1',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    // Card simples usando Color.hex para preenchimento
    const cardWidth = 520;
    const cardHeight = 260;

    const color = pw.color.hex('primary');
    const g = this.add.graphics();
    g.fillStyle(color, 1);
    const x = centerX - cardWidth / 2;
    const y = centerY - cardHeight / 2 + pw.spacing.px('4');
    const radius = 16;

    g.fillRoundedRect(x, y, cardWidth, cardHeight, radius);

    // Texto dentro do card
    this.add
      .text(centerX, centerY + 10, 'Exemplo básico importando phaser-wind', {
        ...TypographyPicker.phaserStyle('body'),
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: cardWidth - 40 },
      })
      .setOrigin(0.5, 0);

    // Demonstração de cores
    const colors: Array<
      'blue-500' | 'emerald-500' | 'rose-500' | 'amber-500' | 'violet-500'
    > = ['blue-500', 'emerald-500', 'rose-500', 'amber-500', 'violet-500'];
    colors.forEach((token, i) => {
      const cx = centerX - 160 + i * 80;
      const cy = centerY + 110;
      const circle = this.add.circle(cx, cy, 18, pw.color.hex(token));
      circle.setStrokeStyle(2, pw.color.hex('white'));
    });
  }
}
