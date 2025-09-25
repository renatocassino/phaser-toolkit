import{f as d}from"./webfontloader-DxEgiKE1.js";import{l as p}from"./load-font-CylPUwJn.js";import{a as i,H as u,F as g}from"./plugin-DsYJWDHU.js";import{c as m,n as y,a as h,C as b,P as a,g as c}from"./create-game-IT2NM2Nb.js";import{c as k}from"./theme-manager-BFQS-suy.js";import{S as C}from"./scene-with-hudini-EXJR7ZX3.js";import"./_commonjsHelpers-Cpj98o6Y.js";const t="hudini-flat-icon-button",w=["red","blue","green","yellow","purple","orange","pink","gray"],I=["400","500","600","700"],l=[...w.flatMap(o=>I.map(e=>`${o}-${e}`)),"white","black"],x=["none","sm","default","md","lg","xl","2xl","3xl","full"],f=["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"],v=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    FlatIconButton
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private buttons: FlatIconButton[] = [];
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const colors: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];

        let y = 90;
        for (let i = 0; i < colors.length; i++) {
            const color: ColorKey = colors[i] as ColorKey;

            const btn = new FlatIconButton({
                scene: this,
                x: 50 + (i * 65),
                y: y,
                icon: 'plus',
                size: 'xl',
                backgroundColor: \`\${color}-600\`,
                iconColor: 'white',
                borderRadius: 'md',
                onClick: (): void => {
                    console.log('clicked');
                },
            });
            this.add.existing(btn);
            this.buttons.push(btn);
        }
    }
}
`,_={title:"Hudini/Components/FlatIconButton",parameters:{docs:{description:{component:"Flat icon button with customizable radius and colors"},source:{language:"ts",code:v}}}},S=k({});class O extends C{button;constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900));const n=new g({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,icon:"plus",size:"xl",backgroundColor:"gray-600",iconColor:"white",borderRadius:"md",backgroundOpacity:1,iconOpacity:1,onClick:()=>{console.log("clicked")}});this.add.existing(n),this.button=n,this.events.on("props:update",r=>this.applyProps(r))}applyProps(e){this.button&&(this.button.setIcon(e.icon,{iconStyle:e.iconStyle}),this.button.setButtonSize(e.size),this.button.setBackgroundColor(e.backgroundColor),this.button.setIconColor(e.iconColor),this.button.setBorderRadius(e.borderRadius),this.button.setBackgroundOpacity(e.backgroundOpacity),this.button.setIconOpacity(e.iconOpacity))}}const E=async()=>{const o=window;o.__fontLoaded||(await p(),o.__fontLoaded=!0)},s={render:o=>{const e=document.getElementById(t)??document.createElement("div");e.id=t;const n=()=>{const r=c(t);if(!r)return;(r.scene.getScene("preview")??r.scene.getScene("preview")).events.emit("props:update",o)};return c(t)?n():c(t)?.events.once(a.Core.Events.READY,n),e},play:async()=>{m(),await E(),await y(3),h(t,{type:a.AUTO,width:600,height:400,backgroundColor:b.slate(900),parent:document.getElementById(t),scene:[O],plugins:{global:[{key:i,plugin:u,mapping:i,data:{theme:S}}]}})},args:{icon:"house",iconStyle:"regular",size:"xl",backgroundColor:"gray-600",iconColor:"white",borderRadius:"md",backgroundOpacity:1,iconOpacity:1},argTypes:{icon:{control:"select",options:Object.keys(d)},iconStyle:{control:"radio",options:["solid","regular","brands"]},size:{control:"select",options:f},backgroundColor:{control:"select",options:l,description:'Choose a color token (e.g., "gray-600")'},iconColor:{control:"select",options:l,description:"Choose a color token for the icon"},borderRadius:{control:"select",options:x,description:'Choose a color token (e.g., "gray-600")'},backgroundOpacity:{control:{type:"range",min:0,max:1,step:.05}},iconOpacity:{control:{type:"range",min:0,max:1,step:.05}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = (game.scene.getScene('preview') ?? game.scene.getScene('preview')) as PreviewScene;
      scene.events.emit('props:update', args as {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number | string;
        backgroundColor: string;
        iconColor: string;
        borderRadius: string | number;
        backgroundOpacity: number;
        iconOpacity: number;
      });
    };
    if (getGame(ID)) {
      apply();
    } else {
      getGame(ID)?.events.once(Phaser.Core.Events.READY, apply);
    }
    return root;
  },
  play: async (): Promise<void> => {
    cleanGames();
    await ensureFontOnce();
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
  },
  args: {
    icon: 'house',
    iconStyle: 'regular',
    size: 'xl',
    backgroundColor: 'gray-600',
    iconColor: 'white',
    borderRadius: 'md',
    backgroundOpacity: 1,
    iconOpacity: 1
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(fontIcons) as IconKey[]
    },
    iconStyle: {
      control: 'radio',
      options: ['solid', 'regular', 'brands']
    },
    size: {
      control: 'select',
      options: sizeTokens as unknown as string[]
    },
    backgroundColor: {
      control: 'select',
      options: colorTokens,
      description: 'Choose a color token (e.g., "gray-600")'
    },
    iconColor: {
      control: 'select',
      options: colorTokens,
      description: 'Choose a color token for the icon'
    },
    borderRadius: {
      control: 'select',
      options: radiusTokens as unknown as string[],
      description: 'Choose a color token (e.g., "gray-600")'
    },
    backgroundOpacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05
      }
    },
    iconOpacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05
      }
    }
  }
}`,...s.parameters?.docs?.source}}};const K=["FlatIconButtonExample"];export{s as FlatIconButtonExample,K as __namedExportsOrder,_ as default};
