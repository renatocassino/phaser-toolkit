import{p as h,F as a,C as r,c as x,n as l,a as S,d as w}from"./create-game-IT2NM2Nb.js";import{R as b,T as d,a as g,H as f}from"./plugin-hGH1kwtW.js";import{w as m}from"./with-local-state-Dc8nv1dP.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./webfontloader-DxEgiKE1.js";import"./with-state-def-B07kmtJ8.js";class P extends h.Scene{constructor(){super("PreviewScene")}preload(){}create(){const n=m(this,"localState",5);n.set(5);const e=this.cameras.main.centerX,t=this.cameras.main.centerY;this.add.text(e,t-180,"Phaser Wind - Scene 1",{color:r.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(e,t-120,"Code: withLocalState<number>(this, 'localState', 5);").setOrigin(.5,.5);const c=this.add.text(e,t-100,n.get().toString(),{color:r.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),p=new b({scene:this,x:e,y:t,gap:16,align:"center",children:[new d({scene:this,x:e,y:t-100,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),c,new d({scene:this,x:e,y:t-100,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]}),u=n.on("change",()=>{c.setText(n.get().toString())});this.add.existing(p),this.add.text(e,t+100,`Local State: ${n.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(e,t+100,"Go to Scene 2",{color:r.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{u(),this.scene.start("PreviewScene2")})}}class v extends h.Scene{constructor(){super("PreviewScene2")}preload(){}create(){const n=m(this,"localState",5),e=this.cameras.main.centerX,t=this.cameras.main.centerY;this.add.text(e,t-180,"Phaser Wind - Scene 2",{color:r.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(e,t-120,"Code: withLocalState<number>(this, 'localState', 5);").setOrigin(.5,.5),this.add.text(e,t-80,`Local State value: ${n.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(e,t+20,"Note that in this scene, the localState did not bring the value from the other scene. The initial value is 5, and in this scene back to 5.",{color:r.rgb("slate-400"),align:"center",fontSize:a.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}const o="phaser-hooks-game-with-local-state",z={title:"Phaser Hooks/With Local State/Basic Example",parameters:{docs:{description:{component:"Basic example using Phaser Hooks for state management"}}}},i={render:()=>{const s=document.createElement("div");return s.id=o,s},play:async()=>{await x(),await l(1),S(o,{type:Phaser.AUTO,width:800,height:600,parent:o,backgroundColor:"#2c3e50",scene:[P,v],plugins:{global:[{key:g,plugin:f,mapping:g,start:!0,data:{theme:w}}]}}),await l(1)}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const L=["BasicExample"];export{i as BasicExample,L as __namedExportsOrder,z as default};
