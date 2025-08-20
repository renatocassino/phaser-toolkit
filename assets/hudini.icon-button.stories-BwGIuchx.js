import{f as p}from"./webfontloader-C12iJez1.js";import{l as d}from"./load-font-CQ-OvxRm.js";import{H as l,a as u,I as m}from"./plugin-Bg5paU74.js";import{P as c,C as h}from"./scene-with-phaser-wind-CFjA4exm.js";import{c as w}from"./theme-manager-BXc8N_UD.js";import{S as g}from"./scene-with-hudini-8Sr3uDpY.js";import{c as y}from"./container-TfoZRbNG.js";import"./_commonjsHelpers-Cpj98o6Y.js";const _=`
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
`,T={title:"Hudini/Components/IconButton",parameters:{docs:{description:{component:"Examples of how to install and use Hudini"},source:{language:"ts",code:_}}}},f=w({});class x extends g{buttons=[];constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900));const n=["red","blue","green","yellow","purple","orange","pink","gray"];let s=90;for(let o=0;o<n.length;o++){const i=n[o],a=new m({scene:this,x:50+o*65,y:s,icon:"plus",size:"xl",color:i,onClick:()=>{console.log("clicked")}});this.add.existing(a),this.buttons.push(a)}this.events.on("props:update",o=>this.applyProps(o))}applyProps(e){console.log(e);for(const n of this.buttons)n.iconText.setIcon(e.icon,{iconStyle:e.iconStyle})}}const S=async()=>{const t=window;t.__fontLoaded||(await d(),t.__fontLoaded=!0)},v=t=>{const e=window;return e.__phaserGame||(e.__phaserGame=new c.Game({type:c.AUTO,width:600,height:400,backgroundColor:h.slate(900),parent:t,scene:[x],plugins:{global:[{key:l,plugin:u,mapping:l,data:{theme:f}}]}}),e.__phaserGame.events.once(c.Core.Events.READY,()=>{e.__phaserScene=e.__phaserGame?.scene.getScene("preview")})),e.__phaserGame},r={render:t=>{const e=y("hudini-icon-button");return(async()=>{await S();const n=v(e),s=window,o=()=>{(s.__phaserScene??n.scene.getScene("preview")).events.emit("props:update",t)};s.__phaserScene?o():n.events.once(c.Core.Events.READY,o)})(),e.destroy=()=>{const n=window;n.__phaserGame&&(n.__phaserGame.destroy(!0),n.__phaserGame=void 0,n.__phaserScene=void 0)},e},args:{icon:"house",iconStyle:"regular",size:64,color:"#ffffff"},argTypes:{icon:{control:"select",options:Object.keys(p)},iconStyle:{control:"radio",options:["solid","regular","brands"]},size:{control:{type:"radio",options:["xs","sm","md","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl","10xl"]}},color:{control:{type:"color"}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = createContainer('hudini-icon-button');
    (async (): Promise<void> => {
      await ensureFontOnce();
      const game = ensureGameOnce(root);
      const w = window as unknown as WindowWithPhaser;
      const apply = (): void => {
        const scene = (w.__phaserScene ?? game.scene.getScene('preview')) as PreviewScene;
        scene.events.emit('props:update', args as {
          icon: IconKey;
          iconStyle: IconStyle;
          size: number | string;
          color: string;
        });
      };
      if (w.__phaserScene) apply();else game.events.once(Phaser.Core.Events.READY, apply);
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
  },
  args: {
    icon: 'house',
    iconStyle: 'regular',
    size: 64,
    color: '#ffffff'
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
      control: {
        type: 'radio',
        options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl']
      }
    },
    color: {
      control: {
        type: 'color'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const B=["IconButtonExample"];export{r as IconButtonExample,B as __namedExportsOrder,T as default};
