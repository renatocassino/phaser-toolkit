import{f as l,I as m}from"./webfontloader-DPE_tNm0.js";import{l as d}from"./load-font--385G9yf.js";import{c as p,n as y,a as g,C as s,P as c,g as t,F as u}from"./create-game-IT2NM2Nb.js";import"./_commonjsHelpers-Cpj98o6Y.js";const n="font-awesome-for-phaser-basic",f=`import { IconText, loadFont } from 'font-awesome-for-phaser';

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
}`,O={title:"Font Awesome For Phaser/IconText",tags:["autodocs"],parameters:{docs:{description:{component:"Render Font Awesome icons in Phaser via font. Load the fonts with `loadFont()` and use `IconText`."},source:{language:"ts",code:f}}}};class h extends c.Scene{iconGO;constructor(){super("preview")}create(){this.cameras.main.setBackgroundColor(s.slate(900)),this.add.text(300,100,"Icons",{fontSize:u.css("2xl"),color:s.rgb("white")}).setOrigin(.5),this.events.on("props:update",e=>this.applyProps(e))}applyProps(e){this.iconGO?(this.iconGO.setIcon(e.icon,{iconStyle:e.iconStyle}),typeof this.iconGO.setFontSize=="function"&&this.iconGO.setFontSize(e.size),this.iconGO.setColor(e.color)):(this.iconGO=new m({scene:this,x:300,y:200,icon:e.icon,iconStyle:e.iconStyle,size:e.size,style:{color:e.color}}),this.add.existing(this.iconGO))}}const I=async()=>{await d()},o={args:{icon:"house",iconStyle:"regular",size:64,color:"#ffffff"},argTypes:{icon:{control:"select",options:Object.keys(l)},iconStyle:{control:"radio",options:["solid","regular","brands"]},size:{control:{type:"number",min:8,max:256,step:1}},color:{control:{type:"color"}}},render:r=>{const e=document.getElementById(n)??document.createElement("div");e.id=n;const a=()=>{const i=t(n);if(!i)return;i.scene.getScene("preview").events.emit("props:update",r)};return t(n)?a():t(n)?.events.once(c.Core.Events.READY,a),e},play:async()=>{await I(),await p(),await y(3),g(n,{type:c.AUTO,width:600,height:400,backgroundColor:s.slate(900),parent:document.getElementById(n),scene:[h]})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = game.scene.getScene('preview');
      scene.events.emit('props:update', args as {
        icon: IconKey;
        iconStyle: IconStyle;
        size: number;
        color: string;
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
    await ensureFontOnce();
    await cleanGames();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [PreviewScene]
    });
  }
}`,...o.parameters?.docs?.source}}};const F=["Basic"];export{o as Basic,F as __namedExportsOrder,O as default};
