import{c as n,P as s,a,C as i,S as c}from"./scene-with-phaser-wind-DKcG0Mp4.js";import{c as h,a as l}from"./container-staG4HwT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const p=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    PHASER_WIND_KEY,
    PhaserWindPlugin,
    SceneWithPhaserWind
} from 'phaser-wind';

const theme = createTheme({
    colors: {
        primary: 'red-500',
        secondary: 'blue-500',
        tertiary: 'green-500',
    }
});
type Theme = typeof theme;


class PreviewScene extends SceneWithPhaserWind<Theme> { // Inherit from SceneWithPhaserWind to get the pw property
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this; // Don't need to cast to SceneWithPhaserWind<Theme> because we're using the generic type
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        let y = 90;
        this.add
            .text(300, y, 'Primary color', {
                fontSize: pw.fontSize.css('2xl'), // use the pw property to get the font size
                color: pw.color.rgb('primary'), // use the pw property to get the color with type safety
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Secondary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('secondary'),
            })
            .setOrigin(0.5);
        y += 100;
        this.add
            .text(300, y, 'Tertiary color', {
                fontSize: pw.fontSize.css('2xl'),
                color: pw.color.rgb('tertiary'),
            })
            .setOrigin(0.5);

        // if you try to use a color that is not in the theme, it will throw an error
        // ❌ pw.color.rgb('invalid-color')
        // ✅ pw.color.rgb('primary') -> Defined in the theme

        // if you try to use a font size that is not in the theme, it will throw an error
        // ❌ pw.fontSize.css('invalid-size')
        // ✅ pw.fontSize.css('2xl')

        // if you try to use a color that is not in the theme, it will throw an error
        // ❌ pw.color.rgb('invalid-color')
    }
}
`,S={title:"PhaserWind/Install/WithBaseScene",parameters:{docs:{description:{component:"Examples of how to install and use PhaserWind"},source:{language:"ts",code:p}}}},d=l({colors:{primary:"red-500",secondary:"blue-500",tertiary:"green-500"}});class m extends c{constructor(){super("preview")}create(){const{pw:e}=this;this.cameras.main.setBackgroundColor(e.color.slate(900));let t=90;this.add.text(300,t,"Primary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("primary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Secondary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("secondary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Tertiary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("tertiary")}).setOrigin(.5)}}const w=r=>{const e=window;return e.__phaserGame||(e.__phaserGame=new n.Game({type:n.AUTO,width:600,height:400,backgroundColor:i.slate(900),parent:r,scene:[m],plugins:{global:[{key:s,plugin:a,mapping:s,data:{theme:d}}]}}),e.__phaserGame.events.once(n.Core.Events.READY,()=>{e.__phaserScene=e.__phaserGame?.scene.getScene("preview")})),e.__phaserGame},o={render:()=>{const r=h();return(async()=>w(r))(),r.destroy=()=>{const e=window;e.__phaserGame&&(e.__phaserGame.destroy(!0),e.__phaserGame=void 0,e.__phaserScene=void 0)},r}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = createContainer();
    (async (): Promise<void> => {
      ensureGameOnce(root);
    })();

    // @ts-expect-error Storybook will call this on unmount if present
    root.destroy = (): void => {
      const w = window as unknown as WindowWithPhaser;
      if (w.__phaserGame) {
        w.__phaserGame.destroy(true);
        w.__phaserGame = undefined as unknown as Phaser.Game;
        w.__phaserScene = undefined as unknown as PreviewScene;
      }
    };
    return root;
  }
}`,...o.parameters?.docs?.source}}};const f=["WithBaseScene"];export{o as WithBaseScene,f as __namedExportsOrder,S as default};
