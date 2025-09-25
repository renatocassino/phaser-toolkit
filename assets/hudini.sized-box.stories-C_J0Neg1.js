import{a as o,H as r,C as c,T as t,e as l}from"./plugin-DsYJWDHU.js";import{c as d,n as u,a as m,P as h,d as p}from"./create-game-IT2NM2Nb.js";import{S as x}from"./scene-with-hudini-EXJR7ZX3.js";import"./webfontloader-DxEgiKE1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i="phaser-sized-box-example",g=`
import { Column, SizedBox, TextButton } from 'hudini';

const column = new Column({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 1',
            backgroundColor: 'red-500',
            textColor: 'white',
            borderRadius: 'lg',
            margin: '4',
            fontSize: 'lg',
        }),
        new SizedBox({
            scene: this,
            x: 0,
            y: 0,
            width: 0,
            height: 20, // Creates vertical spacing between buttons
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 2',
            backgroundColor: 'blue-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 3',
            backgroundColor: 'green-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
        new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Button 4',
            backgroundColor: 'yellow-500',
            textColor: 'white',
            fontSize: 'lg',
        }),
    ]
});

// Other methods:
// sizedBox.setWidth(50);
// sizedBox.setHeight(30);
// sizedBox.setSize(100, 50);
`;class w extends x{constructor(){super("preview")}create(){const{pw:a}=this.hudini;this.cameras.main.setBackgroundColor(a.color.slate(900));const s=new c({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,gap:16,align:"center",children:[new t({scene:this,x:0,y:0,text:"Button 1",backgroundColor:"red-500",textColor:"white",borderRadius:"lg",margin:"4",fontSize:"lg"}),new l({scene:this,x:0,y:0,width:0,height:20}),new t({scene:this,x:0,y:0,text:"Button 2",backgroundColor:"blue-500",textColor:"white",fontSize:"lg"}),new t({scene:this,x:0,y:0,text:"Button 3",backgroundColor:"green-500",textColor:"white",fontSize:"lg"}),new t({scene:this,x:0,y:0,text:"Button 4",backgroundColor:"yellow-500",textColor:"white",fontSize:"lg"})]});this.add.text(this.cameras.main.centerX,this.cameras.main.centerY-200,"Notice the spacing using SizedBox",{fontSize:"24px",color:"#ffffff",fontFamily:"Arial, sans-serif"}).setOrigin(.5),this.add.existing(s)}}const z={title:"Hudini/Components/SizedBox",parameters:{docs:{description:{component:"SizedBox is a simple invisible rectangle component that can be used for spacing and layout purposes. It has no visual appearance but occupies space."}}}},e={render:()=>{const n=document.createElement("div");return n.id="phaser-sized-box-example",n},play:async()=>{await d(),await u(3),m(i,{type:h.AUTO,width:800,height:600,parent:document.getElementById(i),plugins:{global:[{key:o,plugin:r,mapping:o,start:!0,data:{theme:p}}]},scene:[w]})}};e.parameters={docs:{autoplay:!0,story:{inline:!1},source:{code:g}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    const root = document.createElement('div');
    root.id = 'phaser-sized-box-example';
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
}`,...e.parameters?.docs?.source}}};const S=["Default"];export{e as Default,S as __namedExportsOrder,z as default};
