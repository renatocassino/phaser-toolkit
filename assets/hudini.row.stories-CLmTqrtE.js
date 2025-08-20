import{H as i,a as c,R as n}from"./plugin-Bg5paU74.js";import{P as r,d as h}from"./scene-with-phaser-wind-CFjA4exm.js";import{S as m}from"./scene-with-hudini-8Sr3uDpY.js";import{c as p}from"./container-TfoZRbNG.js";import"./webfontloader-C12iJez1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=`
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
`;class g extends m{constructor(){super("preview")}create(){const{pw:t}=this.hudini;this.cameras.main.setBackgroundColor(t.color.slate(900));const s=new n({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,gap:16,align:"center",children:[this.add.text(0,0,"Center",{fontSize:"20px"}).setOrigin(.5,.5),this.add.text(0,0,"Aligned",{fontSize:"20px"}).setOrigin(.5,.5),this.add.rectangle(0,0,50,80,16711680),this.add.rectangle(0,0,80,50,255)]}),o=new n({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY-200,gap:16,align:"top",children:[this.add.text(0,0,"Top",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]}),d=new n({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY+200,gap:16,align:"bottom",children:[this.add.text(0,0,"Bottom",{fontSize:"24px"}),this.add.text(0,0,"Text",{fontSize:"20px"}),this.add.text(0,0,"Items",{fontSize:"20px"}),this.add.rectangle(0,0,100,120,16711680),this.add.rectangle(0,0,120,100,255),this.add.rectangle(0,0,100,80,65280)]});this.add.existing(s),this.add.existing(o),this.add.existing(d)}}const _={title:"Hudini/Components/Row",parameters:{docs:{description:{component:"Row horizontally arranges children with configurable gap and vertical alignment."}}}},x=e=>{const t=window;t.__phaserGame&&t.__phaserGame.destroy(!0),t.__phaserGame=new r.Game({type:r.AUTO,width:800,height:600,parent:e,plugins:{global:[{key:i,plugin:c,mapping:i,data:{theme:h}}]},scene:[g]})},a={render:()=>{const e=p("phaser-row-example");return x(e),e}};a.parameters={docs:{source:{code:l}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const container = createContainer('phaser-row-example');
    createGame(container);
    return container;
  }
}`,...a.parameters?.docs?.source}}};const y=["Default"];export{a as Default,y as __namedExportsOrder,_ as default};
