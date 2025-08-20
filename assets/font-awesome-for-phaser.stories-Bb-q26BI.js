import{f as i,I as l}from"./webfontloader-C12iJez1.js";import{l as p}from"./load-font-CQ-OvxRm.js";import{P as s,C as r,F as d}from"./scene-with-phaser-wind-CFjA4exm.js";import"./_commonjsHelpers-Cpj98o6Y.js";const h=`import { IconText, loadFont } from 'font-awesome-for-phaser';

await loadFont();

class MyScene extends Phaser.Scene {
  create() {
    const icon = new IconText({
      scene: this,
      x: 300,
      y: 200,
      icon: 'house',
      iconStyle: 'regular', // 'solid' | 'regular' | 'brands'
      size: 64,
      style: { color: '#ffffff' },
    });
    this.add.existing(icon);
  }
}`,G={title:"Font Awesome For Phaser/IconText",tags:["autodocs"],parameters:{docs:{description:{component:"Render Font Awesome icons in Phaser via font. Load the fonts with `loadFont()` and use `IconText`."},source:{language:"ts",code:h}}}};class m extends s.Scene{iconGO;constructor(){super("preview")}create(){this.cameras.main.setBackgroundColor(r.slate(900)),this.add.text(300,100,"Icons",{fontSize:d.css("2xl"),color:r.rgb("white")}).setOrigin(.5),this.events.on("props:update",e=>this.applyProps(e))}applyProps(e){this.iconGO?(this.iconGO.setIcon(e.icon,{iconStyle:e.iconStyle}),typeof this.iconGO.setFontSize=="function"&&this.iconGO.setFontSize(e.size),this.iconGO.setColor(e.color)):(this.iconGO=new l({scene:this,x:300,y:200,icon:e.icon,iconStyle:e.iconStyle,size:e.size,style:{color:e.color}}),this.add.existing(this.iconGO))}}const u=()=>{const n=document.getElementById("phaser-story");if(n)return n;const e=document.createElement("div");return e.id="phaser-story",e.style.width="600px",e.style.height="400px",e.style.border="1px solid #333",e.style.background="#111",e},w=async()=>{const n=window;n.__faLoaded||(await p(),n.__faLoaded=!0)},y=n=>{const e=window;return e.__phaserGame||(e.__phaserGame=new s.Game({type:s.AUTO,width:600,height:400,backgroundColor:r.slate(900),parent:n,scene:[m]}),e.__phaserGame.events.once(s.Core.Events.READY,()=>{e.__phaserScene=e.__phaserGame?.scene.getScene("preview")})),e.__phaserGame},t={args:{icon:"house",iconStyle:"regular",size:64,color:"#ffffff"},argTypes:{icon:{control:"select",options:Object.keys(i)},iconStyle:{control:"radio",options:["solid","regular","brands"]},size:{control:{type:"number",min:8,max:256,step:1}},color:{control:{type:"color"}}},render:n=>{const e=u(),a=window;return(async()=>{await w();const o=y(e),c=()=>{(a.__phaserScene??o.scene.getScene("preview")).events.emit("props:update",n)};a.__phaserScene?c():o.events.once(s.Core.Events.READY,c)})(),e.destroy=()=>{const o=window;o.__phaserGame&&(o.__phaserGame.destroy(!0),o.__phaserGame=void 0,o.__phaserScene=void 0)},e}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
        type: 'number',
        min: 8,
        max: 256,
        step: 1
      }
    },
    color: {
      control: {
        type: 'color'
      }
    }
  },
  render: (args: Args): HTMLElement => {
    const root = createContainer();
    const w = window as unknown as WindowWithPhaser;
    (async (): Promise<void> => {
      await ensureFontOnce();
      const game = ensureGameOnce(root);
      const apply = (): void => {
        const scene = (w.__phaserScene ?? game.scene.getScene('preview')) as PreviewScene;
        scene.events.emit('props:update', args as {
          icon: IconKey;
          iconStyle: IconStyle;
          size: number;
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
  }
}`,...t.parameters?.docs?.source}}};const x=["Basic"];export{t as Basic,x as __namedExportsOrder,G as default};
