import{H as i,a as c,R as a}from"./plugin-D_XOWmjq.js";import{c as m,n as h,a as l,P as p,d as g}from"./create-game-C3tE16Ml.js";import{S as x}from"./scene-with-hudini-BeRRzC1m.js";import"./webfontloader-CriEp546.js";import"./_commonjsHelpers-Cpj98o6Y.js";const t="phaser-row-example",u=`
import { Row } from 'hudini';

const row = new Row({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        this.add.text(0, 0, 'Center', { fontSize: '20px' }),
        this.add.text(0, 0, 'Aligned', { fontSize: '20px' }),
        this.add.rectangle(0, 0, 50, 80, 0xff0000),
        this.add.rectangle(0, 0, 80, 50, 0x0000ff),
    ]
});

// Other methods:
// row.addChild(gameObject);
// row.addChildren([gameObject1, gameObject2]);
// row.setGap(24);
// row.setAlign('top');
`;class w extends x{constructor(){super("preview")}create(){const{pw:s}=this.hudini;this.cameras.main.setBackgroundColor(s.color.slate(900));const r=new a({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,gap:16,align:"center",children:[this.add.text(0,0,"Center",{fontSize:"20px"}).setOrigin(.5,.5),this.add.text(0,0,"Aligned",{fontSize:"20px"}).setOrigin(.5,.5),this.add.rectangle(0,0,50,80,16711680),this.add.rectangle(0,0,80,50,255)]}),d=new a({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY-200,gap:16,align:"top",children:[this.add.text(0,0,"Top",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),o=new a({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY+200,gap:16,align:"bottom",children:[this.add.text(0,0,"Bottom",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]});this.add.existing(r),this.add.existing(d),this.add.existing(o)}}const z={title:"Hudini/Components/Row",parameters:{docs:{description:{component:"Row horizontally arranges children with configurable gap and vertical alignment."}}}},e={render:()=>{const n=document.getElementById(t)??document.createElement("div");return n.id=t,n},play:async()=>{await m(),await h(3),l(t,{type:p.AUTO,width:800,height:600,parent:document.getElementById(t),plugins:{global:[{key:i,plugin:c,mapping:i,data:{theme:g}}]},scene:[w]})}};e.parameters={docs:{source:{code:u}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
      width: 800,
      height: 600,
      parent: document.getElementById(ID) as HTMLElement,
      plugins: {
        global: [{
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          mapping: HUDINI_KEY,
          data: {
            theme: defaultLightTheme
          }
        }]
      },
      scene: [PreviewScene]
    });
  }
}`,...e.parameters?.docs?.source}}};const D=["Default"];export{e as Default,D as __namedExportsOrder,z as default};
