import{c as s,n as i,a as c,C as l,P as d,e as a,h,b as p}from"./create-game-IT2NM2Nb.js";import{c as m}from"./theme-manager-BFQS-suy.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r="phaser-wind-install-base-scene",y=`
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
`,P={title:"PhaserWind/Install/WithBaseScene",parameters:{docs:{description:{component:"Examples of how to install and use PhaserWind"},source:{language:"ts",code:y}}}},g=m({colors:{primary:"red-500",secondary:"blue-500",tertiary:"green-500"}});class u extends p{constructor(){super("preview")}create(){const{pw:e}=this;this.cameras.main.setBackgroundColor(e.color.slate(900));let t=90;this.add.text(300,t,"Primary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("primary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Secondary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("secondary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Tertiary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("tertiary")}).setOrigin(.5)}}const o={render:()=>{const n=document.getElementById(r)??document.createElement("div");return n.id=r,n},play:async()=>{await s(),await i(3),c(r,{type:d.AUTO,width:600,height:400,backgroundColor:l.slate(900),parent:document.getElementById(r),scene:[u],plugins:{global:[{key:a,plugin:h,mapping:a,data:{theme:g}}]}})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [PreviewScene],
      plugins: {
        global: [{
          key: PHASER_WIND_KEY,
          plugin: PhaserWindPlugin,
          mapping: PHASER_WIND_KEY,
          data: {
            theme
          }
        }]
      }
    });
  }
}`,...o.parameters?.docs?.source}}};const W=["WithBaseScene"];export{o as WithBaseScene,W as __namedExportsOrder,P as default};
