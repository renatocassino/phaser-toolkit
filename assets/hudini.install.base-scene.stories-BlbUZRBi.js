import{H as i,a}from"./plugin-DsuDsUl7.js";import{c as s,n as c,a as l,C as d,P as m}from"./create-game-C3tE16Ml.js";import{c as p}from"./theme-manager-DiU4aH8F.js";import{S as h}from"./scene-with-hudini-BeRRzC1m.js";import"./webfontloader-CriEp546.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r="hudini-install-base-scene",u=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
    colors: {
        primary: 'red-500',
        secondary: 'blue-500',
        tertiary: 'green-500',
    }
});
type Theme = typeof theme;


class PreviewScene extends SceneWithHudini<Theme> { // Inherit from SceneWithHudini to get the pw property
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini; // Don't need to cast to SceneWithPhaserWind<Theme> because we're using the generic type
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
`,z={title:"Hudini/Install/WithBaseScene",parameters:{docs:{description:{component:"Examples of how to install and use Hudini"},source:{language:"ts",code:u}}}},y=p({colors:{primary:"red-500",secondary:"blue-500",tertiary:"green-500"}});class g extends h{constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900));let t=90;this.add.text(300,t,"Primary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("primary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Secondary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("secondary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Tertiary color",{fontSize:e.fontSize.css("2xl"),color:e.color.rgb("tertiary")}).setOrigin(.5)}}const o={render:()=>{const n=document.getElementById(r)??document.createElement("div");return n.id=r,n},play:async()=>{await s(),await c(3),l(r,{type:m.AUTO,width:600,height:400,backgroundColor:d.slate(900),parent:document.getElementById(r),scene:[g],plugins:{global:[{key:i,plugin:a,mapping:i,data:{theme:y}}]}})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          mapping: HUDINI_KEY,
          data: {
            theme
          }
        }]
      }
    });
  }
}`,...o.parameters?.docs?.source}}};const H=["WithBaseScene"];export{o as WithBaseScene,H as __namedExportsOrder,z as default};
