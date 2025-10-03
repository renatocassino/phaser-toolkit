import{a,H as o,C as n}from"./plugin-CWmWIBW8.js";import{c as l,n as m,a as h,P as p,d as u}from"./create-game-ukjiax-1.js";import{S as g}from"./scene-with-hudini-BITB4cOD.js";import"./webfontloader-5Azx9hTn.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i="phaser-column-example",x=`
import { Column } from 'hudini';

const column = new Column({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        this.add.text(0, 0, 'Center Aligned', { fontSize: '24px' }),
        this.add.text(0, 0, 'Multiple', { fontSize: '20px' }),
        this.add.text(0, 0, 'Text Items', { fontSize: '20px' }),
        this.add.rectangle(0, 0, 100, 120, 0xff0000),
        this.add.rectangle(0, 0, 120, 100, 0x0000ff),
        this.add.rectangle(0, 0, 100, 80, 0x00ff00),
    ]
});

// Other methods:
// column.addChild(gameObject);
// column.addChildren([gameObject1, gameObject2]);
// column.setGap(24);
// column.setAlign('left');
`;class f extends g{constructor(){super("preview")}create(){const{pw:s}=this.hudini;this.cameras.main.setBackgroundColor(s.color.slate(900));const r=new n({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,gap:16,align:"center",children:[this.add.text(0,0,"Center Aligned",{fontSize:"24px"}),this.add.text(0,0,"Multiple",{fontSize:"20px"}),this.add.text(0,0,"Text Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),d=new n({scene:this,x:this.cameras.main.centerX-300,y:this.cameras.main.centerY,gap:16,align:"left",children:[this.add.text(0,0,"Left",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),c=new n({scene:this,x:this.cameras.main.centerX+300,y:this.cameras.main.centerY,gap:16,align:"right",children:[this.add.text(0,0,"Right Aligned",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]});this.add.existing(r),this.add.existing(d),this.add.existing(c)}}const z={title:"Hudini/Components/Column",parameters:{docs:{description:{component:"Column is a layout container that stacks children vertically with configurable gap and alignment."}}}},e={render:()=>{const t=document.createElement("div");return t.id="phaser-column-example",t},play:async()=>{await l(),await m(3),h(i,{type:p.AUTO,width:800,height:600,parent:document.getElementById(i),plugins:{global:[{key:a,plugin:o,mapping:a,start:!0,data:{theme:u}}]},scene:[f]})}};e.parameters={docs:{autoplay:!0,story:{inline:!1},source:{code:x}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    const root = document.createElement('div');
    root.id = 'phaser-column-example';
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
          start: true,
          data: {
            theme: defaultLightTheme
          } as HudiniPluginData
        }]
      },
      scene: [PreviewScene]
    });
  }
}`,...e.parameters?.docs?.source}}};const H=["Default"];export{e as Default,H as __namedExportsOrder,z as default};
