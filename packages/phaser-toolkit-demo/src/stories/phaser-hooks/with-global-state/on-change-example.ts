import { Color, FontSize } from "phaser-wind";
import { Row, TextButton } from 'hudini'
import { withGlobalState } from "phaser-hooks";
import { Scene } from "phaser";

export class PreviewSceneOnChange extends Scene {
    private changeLogText?: Phaser.GameObjects.Text;

    constructor() {
        super('PreviewSceneOnChange');
    }

    preload(): void { }

    create(): void {
        const state = withGlobalState<number>(this, 'onChangeState', 0);
        const countState = withGlobalState<number>(this, 'onChangeCount', 0);
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 200, 'Phaser Hooks - On Change Example (Global)', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('3xl'),
            })
            .setOrigin(0.5, 0.5);

        this.add.text(centerX, centerY - 130, 'Code:\nconst state = withGlobalState<number>(this, \'onChangeState\', 0);\nconst unsubscribe = state.on(\'change\', callback);\n// returns unsubscribe function').setOrigin(0.5, 0.5);

        // Display current state value
        const num = this.add.text(centerX, centerY - 120, state.get().toString(), {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('6xl'),
        })
            .setOrigin(0.5, 0.5);

        // Controls to modify state
        const row = new Row({
            scene: this,
            x: centerX,
            y: centerY - 60,
            gap: 16,
            align: 'center',
            children: [
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY - 60,
                    text: '-',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() - 1);
                        countState.set(countState.get() + 1);
                    },
                }),
                num,
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY - 60,
                    text: '+',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() + 1);
                        countState.set(countState.get() + 1);
                    },
                }),
            ],
        });

        // Subscribe to changes
        const unsubscribe = state.on('change', () => {
            num.setText(state.get().toString());
            if (this.changeLogText) {
                this.changeLogText.setText(`Change count: ${countState.get()}`);
            }
        });

        const unsubscribeCount = countState.on('change', () => {
            if (this.changeLogText) {
                this.changeLogText.setText(`Change count: ${countState.get()}`);
            }
        });

        this.add.existing(row);

        // Change log display
        this.changeLogText = this.add
            .text(centerX, centerY + 20, `Change count: ${countState.get()}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Unsubscribe button
        const unsubscribeButton = this.add.text(centerX, centerY + 60, 'Unsubscribe from Changes', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('xl'),
            backgroundColor: '#DC2626',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        unsubscribeButton.on('pointerdown', () => {
            unsubscribe();
            unsubscribeCount();
            unsubscribeButton.setText('Unsubscribed!');
            unsubscribeButton.setStyle({ backgroundColor: '#059669' });
            unsubscribeButton.disableInteractive();
        });

        // Go to next scene button
        const nextSceneButton = this.add.text(centerX, centerY + 120, 'Go to Scene 2', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('2xl'),
            backgroundColor: '#4A5568',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        nextSceneButton.on('pointerdown', () => {
            unsubscribe();
            this.scene.start('PreviewScene2OnChange');
        });

        this.add
            .text(centerX, centerY + 180, 'IMPORTANT: Don\'t forget to unsubscribe\nwhen move to another scene.', {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);
    }
}


export class PreviewScene2OnChange extends Scene {
    private unsubscribe?: () => void;
    private changeCount = 0;
    private changeLogText?: Phaser.GameObjects.Text;

    constructor() {
        super('PreviewScene2OnChange');
    }

    preload(): void { }

    create(): void {
        const state = withGlobalState<number>(this, 'onChangeState', 0);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add
            .text(centerX, centerY - 200, 'Phaser Hooks - On Change Example (Scene 2)', {
                color: Color.rgb('slate-200'),
                align: 'center',
                fontSize: FontSize.px('3xl'),
            })
            .setOrigin(0.5, 0.5);

        this.add.text(centerX, centerY - 160, 'Same hook, but different scene with SAME global state').setOrigin(0.5, 0.5);

        // Display current state value
        const num = this.add.text(centerX, centerY - 120, state.get().toString(), {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('6xl'),
        })
            .setOrigin(0.5, 0.5);

        // Controls to modify state
        const row = new Row({
            scene: this,
            x: centerX,
            y: centerY - 60,
            gap: 16,
            align: 'center',
            children: [
                new TextButton({
                    scene: this,
                    x: centerX,
                    y: centerY - 60,
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
                    y: centerY - 60,
                    text: '+',
                    fontSize: 'xl',
                    backgroundColor: 'gray-600',
                    onClick: () => {
                        state.set(state.get() + 1);
                    },
                }),
            ],
        });

        // Subscribe to changes
        this.unsubscribe = state.on('change', () => {
            this.changeCount++;
            num.setText(state.get().toString());
            this.updateChangeLog();
        });

        this.add.existing(row);

        // Change log display
        this.changeLogText = this.add
            .text(centerX, centerY + 20, `Change count: ${this.changeCount}`, {
                color: Color.rgb('slate-300'),
                align: 'center',
                fontSize: FontSize.px('lg'),
            })
            .setOrigin(0.5, 0.5);

        // Subscribe/Unsubscribe toggle button
        const toggleButton = this.add.text(centerX, centerY + 60, 'Unsubscribe from Changes', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('xl'),
            backgroundColor: '#DC2626',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        toggleButton.on('pointerdown', () => {
            if (this.unsubscribe) {
                // Unsubscribe
                this.unsubscribe();
                this.unsubscribe = undefined;
                toggleButton.setText('Subscribe to Changes');
                toggleButton.setStyle({ backgroundColor: '#059669' });
            } else {
                // Subscribe again
                this.unsubscribe = state.on('change', () => {
                    this.changeCount++;
                    num.setText(state.get().toString());
                    this.updateChangeLog();
                });
                toggleButton.setText('Unsubscribe from Changes');
                toggleButton.setStyle({ backgroundColor: '#DC2626' });
            }
        });

        // Explanation text
        this.add
            .text(
                centerX,
                centerY + 120,
                'Try unsubscribing and then changing the value. Notice how the change count stops updating.',
                {
                    color: Color.rgb('slate-400'),
                    align: 'center',
                    fontSize: FontSize.px('lg'),
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5, 0.5);

        // Go back to first scene button
        const backButton = this.add.text(centerX, centerY + 180, 'Go to Scene 1', {
            color: Color.rgb('slate-200'),
            align: 'center',
            fontSize: FontSize.px('2xl'),
            backgroundColor: '#4A5568',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            // Clean up subscription before changing scenes
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.scene.start('PreviewSceneOnChange');
        });
    }

    private updateChangeLog(): void {
        if (this.changeLogText) {
            this.changeLogText.setText(`Change count: ${this.changeCount}`);
        }
    }
}