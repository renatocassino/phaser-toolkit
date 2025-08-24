import{f as l}from"./webfontloader-CriEp546.js";import{l as u}from"./load-font-DZqMqhA4.js";import{H as a,a as d,I as p}from"./plugin-DsuDsUl7.js";import{r as m,c as g,n as h,a as y,C as f,P as c,g as i}from"./create-game-C3tE16Ml.js";import{c as b}from"./theme-manager-DiU4aH8F.js";import{S as I}from"./scene-with-hudini-BeRRzC1m.js";import"./_commonjsHelpers-Cpj98o6Y.js";const x=["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"],o="hudini-icon-button",w=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private buttons: IconButton[] = [];
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

            const btn = new IconButton({
                scene: this,
                x: 50 + (i * 65),
                y: y,
                icon: 'plus',
                size: 'xl',
                color: color,
                onClick: (): void => {
                    console.log('clicked');
                },
            });
            this.add.existing(btn);
            this.buttons.push(btn);
        }
    }
}
`,K={title:"Hudini/Components/IconButton",parameters:{docs:{description:{component:"Examples of how to install and use Hudini"},source:{language:"ts",code:w}}}},k=b({});class v extends I{button;constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900));const n=new p({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,icon:"plus",size:"xl",color:"red",onClick:()=>{console.log("clicked")}});this.add.existing(n),this.button=n,this.events.on("props:update",s=>this.applyProps(s))}applyProps(e){this.button&&(this.button.iconText.setIcon(e.icon,{iconStyle:e.iconStyle}),this.button.setBorderRadius(e.borderRadius),this.button.setButtonSize(e.size))}}const S=async()=>{const t=window;t.__fontLoaded||(await u(),t.__fontLoaded=!0)},r={render:t=>{const e=document.getElementById(o)??document.createElement("div");e.id=o;const n=()=>{const s=i(o);if(!s)return;s.scene.getScene("preview").events.emit("props:update",t)};return i(o)?n():i(o)?.events.once(c.Core.Events.READY,n),e},play:async()=>{g(),await S(),await h(3),y(o,{type:c.AUTO,width:600,height:400,backgroundColor:f.slate(900),parent:document.getElementById(o),scene:[v],plugins:{global:[{key:a,plugin:d,mapping:a,data:{theme:k}}]}})},args:{icon:"house",iconStyle:"regular",size:"xl",color:"#ffffff",borderRadius:"full"},argTypes:{icon:{control:"select",options:Object.keys(l)},iconStyle:{control:"radio",options:["solid","regular","brands"]},size:{control:"select",options:x},color:{control:{type:"color",description:'Phaser-wind color token (e.g. "red", "blue", "green", "yellow", "purple", "orange", "pink", "gray") or rgb/hex string'}},borderRadius:{control:"select",options:Object.keys(m),description:'Phaser Wind radius token (e.g. "none", "sm", "lg", "full") or a number (px).',defaultValue:"full"}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = game.scene.getScene('preview') as PreviewScene;
      scene.events.emit('props:update', args as {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number | string;
        color: string;
        borderRadius: string | number;
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
    color: '#ffffff',
    borderRadius: 'full'
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
      options: sizeTokens
    },
    color: {
      control: {
        type: 'color',
        description: 'Phaser-wind color token (e.g. "red", "blue", "green", "yellow", "purple", "orange", "pink", "gray") or rgb/hex string'
      }
    },
    borderRadius: {
      control: 'select',
      options: Object.keys(radiusMap) as RadiusKey[],
      description: 'Phaser Wind radius token (e.g. "none", "sm", "lg", "full") or a number (px).',
      defaultValue: 'full'
    }
  }
}`,...r.parameters?.docs?.source}}};const R=["IconButtonExample"];export{r as IconButtonExample,R as __namedExportsOrder,K as default};
