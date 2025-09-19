import { Color, FontSize } from "phaser-wind";
import { Row, TextButton } from 'hudini'
import { withLocalState } from "phaser-hooks";
import { Scene } from "phaser";

export class PreviewScene extends Scene {
    constructor() {
        super('PreviewScene');
    }

    preload(): void { }

    create(): void {
        const state = withLocalState<number>(this, 'localState', 5);
        state.set(5);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 1', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);

        this.add.text(centerX, centerY - 120, 'Code: withLocalState<number>(this, \'localState\', 5);').setOrigin(0.5, 0.5);

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

        // Display local state
        this.add
            .text(centerX, centerY + 100, `Local State: ${state.get()}`, {
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
        const state = withLocalState<number>(this, 'localState', 5);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 180, 'Phaser Wind - Scene 2', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('6xl'),
            })
            .setOrigin(0.5, 0.5);


        this.add.text(centerX, centerY - 120, 'Code: withLocalState<number>(this, \'localState\', 5);').setOrigin(0.5, 0.5);

        // Display local state (will show undefined as it's not shared between scenes)
        this.add
            .text(centerX, centerY - 80, `Local State value: ${state.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Explanation about local and global state behavior
        this.add
            .text(
                centerX,
                centerY + 20,
                'Note that in this scene, the localState did not bring the value from the other scene. The initial value is 5, and in this scene back to 5.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);
    }
}
