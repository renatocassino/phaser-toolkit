import{p as x,F as a,C as s,c as b,n as h,a as w,d as f}from"./create-game-IT2NM2Nb.js";import{R as u,T as c,a as p,H as y}from"./plugin-hGH1kwtW.js";import{w as m}from"./with-global-state-BNlMQWCR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./webfontloader-DxEgiKE1.js";import"./with-state-def-B07kmtJ8.js";class C extends x.Scene{constructor(){super("PreviewScene")}preload(){}create(){const e=m(this,"globalState",10);e.set(10);const t=this.cameras.main.centerX,n=this.cameras.main.centerY;this.add.text(t,n-180,"Phaser Wind - Scene 1",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(t,n-120,"Code: withGlobalState<number>(this, 'globalState', 10);").setOrigin(.5,.5);const r=this.add.text(t,n-100,e.get().toString(),{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),l=new u({scene:this,x:t,y:n,gap:16,align:"center",children:[new c({scene:this,x:t,y:n-100,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{e.set(e.get()-1)}}),r,new c({scene:this,x:t,y:n-100,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{e.set(e.get()+1)}})]}),g=e.on("change",()=>{r.setText(e.get().toString())});this.add.existing(l),this.add.text(t,n+100,`Global State: ${e.get()}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(t,n+100,"Go to Scene 2",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{g(),this.scene.start("PreviewScene2")})}}class P extends x.Scene{constructor(){super("PreviewScene2")}preload(){}create(){const e=m(this,"globalState",10),t=this.cameras.main.centerX,n=this.cameras.main.centerY;this.add.text(t,n-180,"Phaser Wind - Scene 2",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(t,n-120,"Code: withGlobalState<number>(this, 'globalState', 10);").setOrigin(.5,.5),this.add.text(t,n-80,`Global State value: ${e.get()}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(t,n+20,"Note that in this scene, the globalState preserved the value from the previous scene. Global state persists across scene changes.",{color:s.rgb("slate-400"),align:"center",fontSize:a.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5);const r=this.add.text(t,n+80,e.get().toString(),{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),l=new u({scene:this,x:t,y:n+120,gap:16,align:"center",children:[new c({scene:this,x:t,y:n+120,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{e.set(e.get()-1)}}),r,new c({scene:this,x:t,y:n+120,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{e.set(e.get()+1)}})]}),g=e.on("change",()=>{r.setText(e.get().toString())});this.add.existing(l),this.add.text(t,n+180,"Go to Scene 1",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{g(),this.scene.start("PreviewScene")})}}const d="phaser-hooks-game-with-global-state",I={title:"Phaser Hooks/With Global State/Basic Example",parameters:{docs:{description:{component:"Basic example using Phaser Hooks for global state management that persists across scenes"}}}},i={render:()=>{const o=document.createElement("div");return o.id=d,o},play:async()=>{await b(),await h(1),w(d,{type:Phaser.AUTO,width:800,height:600,parent:d,backgroundColor:"#2c3e50",scene:[C,P],plugins:{global:[{key:p,plugin:y,mapping:p,start:!0,data:{theme:f}}]}}),await h(1)}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(1);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: ID,
      backgroundColor: '#2c3e50',
      scene: [PreviewScene, PreviewScene2],
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
      }
    });
    await nextFrames(1);
  }
}`,...i.parameters?.docs?.source}}};const E=["BasicExample"];export{i as BasicExample,E as __namedExportsOrder,I as default};
