import{a as i,H as a}from"./plugin-CWmWIBW8.js";import{c as s,n as c,a as l,C as p}from"./create-game-ukjiax-1.js";import{c as d}from"./theme-manager-EhPXZ0nu.js";import"./webfontloader-5Azx9hTn.js";import"./_commonjsHelpers-Cpj98o6Y.js";const o="hudini-install-cast-type",m=`
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


class PreviewScene extends Phaser.Scene {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = (this as unknown as SceneWithHudini<Theme>); // cast to get the pw property
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
`,x={title:"Hudini/Install/WithCastType",parameters:{docs:{description:{component:"Examples of how to install and use Hudini"}}}},h=d({colors:{primary:"red-500",secondary:"blue-500",tertiary:"green-500"}});class u extends Phaser.Scene{constructor(){super("preview")}create(){const{hudini:e}=this;this.cameras.main.setBackgroundColor(e.pw.color.slate(800));let t=90;this.add.text(300,t,"Primary color",{fontSize:e.pw.fontSize.css("2xl"),color:e.pw.color.rgb("primary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Secondary color",{fontSize:e.pw.fontSize.css("2xl"),color:e.pw.color.rgb("secondary")}).setOrigin(.5),t+=100,this.add.text(300,t,"Tertiary color",{fontSize:e.pw.fontSize.css("2xl"),color:e.pw.color.rgb("tertiary")}).setOrigin(.5)}}const r={parameters:{docs:{description:{component:"Examples of how to install and use Hudini"},source:{language:"ts",code:m}}},render:()=>{const n=document.getElementById(o)??document.createElement("div");return n.id=o,n},play:async()=>{await s(),await c(2),l(o,{type:Phaser.AUTO,width:600,height:400,backgroundColor:p.slate(900),parent:document.getElementById(o),scene:[u],plugins:{global:[{key:i,plugin:a,mapping:i,data:{theme:h}}]}})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        component: 'Examples of how to install and use Hudini'
      },
      source: {
        language: 'ts',
        code: usageSnippet
      }
    }
  },
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(2);
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
}`,...r.parameters?.docs?.source}}};const I=["WithCastType"];export{r as WithCastType,I as __namedExportsOrder,x as default};
