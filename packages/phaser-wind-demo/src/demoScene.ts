import { Color, TypographyPicker } from "../../phaser-wind";

export class DemoScene extends Phaser.Scene {
    constructor() {
        super('DemoScene');
    }

    preload() { }

    create() {
        const localColor = Color;
        console.log(this.pw.getTheme().colors.terciary, '<<<<<');

        this.pw.color.rgb('primary');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Título usando TypographyPicker
        const titleStyle = TypographyPicker.phaserStyle('heading-large');
        this.add.text(centerX, centerY - 180, 'Phaser Wind', {
            ...titleStyle,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Subtítulo
        const subtitleStyle = TypographyPicker.phaserStyle('body');
        this.add.text(centerX, centerY - 130, 'Design tokens e utilitários', {
            ...subtitleStyle,
            color: '#cbd5e1',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Card simples usando Color.hex para preenchimento
        const cardWidth = 520;
        const cardHeight = 260;

        const g = this.add.graphics();
        g.fillStyle(localColor.hex('primary'), 1);
        const x = centerX - cardWidth / 2;
        const y = centerY - cardHeight / 2 + 20;
        const radius = 16;

        g.fillRoundedRect(x, y, cardWidth, cardHeight, radius);

        // Texto dentro do card
        const body = this.add.text(centerX, centerY + 10, 'Exemplo básico importando phaser-wind', {
            ...TypographyPicker.phaserStyle('body'),
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: cardWidth - 40 }
        }).setOrigin(0.5, 0);

        // Demonstração de cores
        const colors = ['blue-500', 'emerald-500', 'rose-500', 'amber-500', 'violet-500'];
        colors.forEach((token, i) => {
            const cx = centerX - 160 + i * 80;
            const cy = centerY + 110;
            const circle = this.add.circle(cx, cy, 18, localColor.hex(token as any));
            circle.setStrokeStyle(2, localColor.hex('white'));
        });
    }
}
