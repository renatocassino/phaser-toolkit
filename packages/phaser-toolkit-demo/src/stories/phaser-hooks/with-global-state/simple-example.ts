import { Color, FontSize } from "phaser-wind";
import { Row, TextButton } from 'hudini'
import { withGlobalState } from "phaser-hooks";
import { Scene } from "phaser";

export class PreviewScene extends Scene {
    constructor() {
        super('PreviewScene');
    }

    preload(): void { }

    create(): void {
        const state = withGlobalState<number>(this, 'globalState', 10, { debug: true });
        state.set(10);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 1', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        this.add.text(centerX, centerY - 120, 'Code: withGlobalState<number>(this, \'globalState\', 10);').setOrigin(0.5, 0.5);

        const num = this.add.text(centerX, centerY - 100, state.get().toString(), {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('6xl'),
        })
            .setOrigin(0.5, 0.5);

        const row = new Row({
            scene: this,
            x: centerX,
            y: centerY,
            gap: 16,
            align: 'center',
            children: [
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY - 100,
                    text: '-',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() - 1);
                    },
                }),
                num,
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY - 100,
                    text: '+',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() + 1);
                    },
                }),
            ],
        });

        const unsubscribe = state.on('change', () => {
            num.setText(state.get().toString());
        });

        this.add.existing(row);

        // Display global state
        this.add
            .text(centerX, centerY + 100, `Global State: ${state.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        const button = this.add.text(centerX, centerY + 100, 'Go to Scene 2', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('2xl'),
            backgroundColor: '#4A5568',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerdown', () => {
            unsubscribe();
            this.scene.start('PreviewScene2');
        });

    }
}


export class PreviewScene2 extends Scene {
    constructor() {
        super('PreviewScene2');
    }

    preload(): void { }

    create(): void {
        const state = withGlobalState<number>(this, 'globalState', 10, { debug: true });

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 2', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);


        this.add.text(centerX, centerY - 120, 'Code: withGlobalState<number>(this, \'globalState\', 10);').setOrigin(0.5, 0.5);

        // Display global state (will show the value from the previous scene)
        this.add
            .text(centerX, centerY - 80, `Global State value: ${state.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Explanation about global state behavior
        this.add
            .text(
                centerX,
                centerY + 20,
                'Note that in this scene, the globalState preserved the value from the previous scene. Global state persists across scene changes.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);

        // Add controls to modify the global state from this scene too
        const num = this.add.text(centerX, centerY + 80, state.get().toString(), {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('6xl'),
        })
            .setOrigin(0.5, 0.5);

        const row = new Row({
            scene: this,
            x: centerX,
            y: centerY + 120,
            gap: 16,
            align: 'center',
            children: [
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY + 120,
                    text: '-',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() - 1);
                    },
                }),
                num,
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY + 120,
                    text: '+',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() + 1);
                    },
                }),
            ],
        });

        const unsubscribe = state.on('change', () => {
            num.setText(state.get().toString());
        });

        this.add.existing(row);

        const button = this.add.text(centerX, centerY + 180, 'Go to Scene 1', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('2xl'),
            backgroundColor: '#4A5568',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerdown', () => {
            unsubscribe();
            this.scene.start('PreviewScene');
        });
    }
}