import{H as s,a as l,C as a}from"./plugin-Bg5paU74.js";import{P as r,d as m,S as i}from"./scene-with-phaser-wind-CFjA4exm.js";import{S as h}from"./scene-with-hudini-8Sr3uDpY.js";import{c as p}from"./container-TfoZRbNG.js";import"./webfontloader-C12iJez1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const g=`
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
`;class x extends h{constructor(){super("preview")}create(){const{pw:t}=this.hudini;this.cameras.main.setBackgroundColor(t.color.slate(900));const d=new a({scene:this,x:this.cameras.main.centerX,y:i.px("4"),gap:16,align:"center",children:[this.add.text(0,0,"Center Aligned",{fontSize:"24px"}),this.add.text(0,0,"Multiple",{fontSize:"20px"}),this.add.text(0,0,"Text Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),o=new a({scene:this,x:this.cameras.main.centerX-300,y:i.px("4"),gap:16,align:"left",children:[this.add.text(0,0,"Left",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),c=new a({scene:this,x:this.cameras.main.centerX+300,y:i.px("4"),gap:16,align:"right",children:[this.add.text(0,0,"Right Aligned",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]});this.add.existing(d),this.add.existing(o),this.add.existing(c)}}const _={title:"Hudini/Components/Column",parameters:{docs:{description:{component:"Column is a layout container that stacks children vertically with configurable gap and alignment."}}}},u=e=>{const t=window;t.__phaserGame&&t.__phaserGame.destroy(!0),t.__phaserGame=new r.Game({type:r.AUTO,width:800,height:600,parent:e,plugins:{global:[{key:s,plugin:l,mapping:s,data:{theme:m}}]},scene:[x]})},n={render:()=>{const e=p("phaser-column-example");return u(e),e}};n.parameters={docs:{source:{code:g}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const container = createContainer('phaser-column-example');
    createGame(container);
    return container;
  }
}`,...n.parameters?.docs?.source}}};const G=["Default"];export{n as Default,G as __namedExportsOrder,_ as default};
