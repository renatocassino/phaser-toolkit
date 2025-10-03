import{a as l,H as f,T as r,b as y,C as d,S as C,R as u,F as c}from"./plugin-CWmWIBW8.js";import{c as k,n as b,a as B,P as I,d as S}from"./create-game-ukjiax-1.js";import{S as M}from"./scene-with-hudini-BITB4cOD.js";import"./webfontloader-5Azx9hTn.js";import"./_commonjsHelpers-Cpj98o6Y.js";const m="phaser-modal-example",P=`
import { Card, Column, Row, TextButton, FlatIconButton, SizedBox } from 'hudini';

// Create a modal card with settings
const modalCard = new Card({
    scene: this,
    x: centerX,
    y: centerY,
    backgroundColor: 'slate-800',
    borderRadius: 'md',
    width: Math.min(width * 0.8, 600),
    child: new Column({
        scene: this,
        x: 0,
        y: 0,
        children: [
            // Audio settings rows
            ...['music', 'ambient', 'fx'].map((channel: string) => 
                buildAudioControlRow(channel)
            ),
            // Action buttons
            new Row({
                scene: this,
                x: 0,
                y: 0,
                children: [
                    new TextButton({
                        scene: this,
                        x: 0,
                        y: 0,
                        text: 'Play again',
                        backgroundColor: 'blue-600',
                        fontSize: '2xl',
                        onClick: () => console.log('Play again clicked'),
                    }),
                    new TextButton({
                        scene: this,
                        x: 0,
                        y: 0,
                        text: 'Back to Main Menu',
                        backgroundColor: 'blue-600',
                        fontSize: '2xl',
                        onClick: () => console.log('Back to menu clicked'),
                    }),
                ],
                gap: 20,
            })
        ],
        gap: 20,
    })
});

// Close button positioned outside the card
const closeButton = new FlatIconButton({
    scene: this,
    x: centerX + Math.min(width * 0.4, 300),
    y: centerY - 240,
    icon: 'xmark',
    size: 'xl',
    onClick: () => console.log('Close modal'),
});
`;class z extends M{constructor(){super("preview")}create(){const{pw:n}=this.hudini,{width:s,centerY:e,centerX:o}=this.cameras.main;this.cameras.main.setBackgroundColor(n.color.slate(900));const a=["music","ambient","fx"].map(w=>this.buildAudioControlRow(w)),h=new r({scene:this,x:0,y:0,text:"Play again",backgroundColor:"blue-600",fontSize:"2xl",font:"monospace",onClick:()=>{console.log("Play again clicked")}}),p=new r({scene:this,x:0,y:0,text:"Back to Main Menu",backgroundColor:"blue-600",fontSize:"2xl",font:"monospace",onClick:()=>{console.log("Back to Main Menu clicked")}}),g=new y({scene:this,x:o,y:e,backgroundColor:"slate-800",borderRadius:"md",child:new d({scene:this,x:0,y:0,children:[...a,new C({scene:this,x:0,y:0,width:0,height:10}),new u({scene:this,x:0,y:0,children:[h,p],gap:20})],gap:20})}),x=new c({scene:this,x:o+Math.min(s*.4,300),y:e-240,icon:"xmark",size:"xl",onClick:()=>{console.log("Close modal clicked")}});this.add.existing(g),this.add.existing(x)}buildAudioControlRow(n){const s=this.add.text(0,0,n.toUpperCase(),{fontSize:24,color:"#ffffff",align:"center",fixedWidth:100}),e=this.add.text(0,0,"5",{fontSize:24,color:"#ffffff",align:"center",fixedWidth:100}),o=new c({scene:this,x:0,y:0,icon:"minus",size:24,onClick:()=>{console.log(`Decrease ${n} volume`),e.text=Math.max(0,parseInt(e.text)-1).toString()}}),a=new c({scene:this,x:0,y:0,icon:"plus",size:24,onClick:()=>{console.log(`Increase ${n} volume`),e.text=Math.min(10,parseInt(e.text)+1).toString()}});return a.here="AQUI",new d({scene:this,x:0,y:0,align:"center",gap:8,children:[s,new u({scene:this,x:0,y:0,children:[o,e,a],gap:10})]})}}const E={title:"Hudini/Advanced/Card Usage Modal",parameters:{docs:{description:{component:"Advanced example showing a modal card with audio controls and action buttons, demonstrating complex layout composition."}}}},t={render:()=>{const i=document.createElement("div");return i.id="phaser-modal-example",i},play:async()=>{await k(),await b(3),B(m,{type:I.AUTO,width:800,height:600,parent:document.getElementById(m),plugins:{global:[{key:l,plugin:f,mapping:l,start:!0,data:{theme:S}}]},scene:[z]})}};t.parameters={docs:{autoplay:!0,story:{inline:!1},source:{code:P}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const root = document.createElement('div');
    root.id = 'phaser-modal-example';
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,E as default};
