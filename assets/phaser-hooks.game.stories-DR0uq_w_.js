import"./plugin-HFtBARcL.js";import{F as r,C as a,c as w,n as i,a as b}from"./create-game-Dqgfp28j.js";import{S as h}from"./scene-with-hudini-DCgcD6-P.js";import{w as y,a as v,b as f}from"./with-persistent-state-Pci6dusG.js";import"./webfontloader-VUTCp1vF.js";import"./_commonjsHelpers-Cpj98o6Y.js";const C=(o,t,n,e)=>{if(!o)throw new Error("[withLocalState] Scene parameter is required");const l=`phaser-hooks:local:${o.scene?.key||"unknown-scene"}:${t}`;return y(o,l,n,{...e,global:!1})},S="phaser-hooks-game",m="phaser-hooks-session",x="phaser-hooks-local";class L extends h{constructor(){super("PreviewScene")}preload(){}create(){const t=C(this,"localState","Local state defined in preview 1");t.set("Local state defined in preview 1");const n=v(this,"globalState","Global state defined in preview 1");n.set("Global state defined in preview 1");const e=this.cameras.main.centerX,s=this.cameras.main.centerY;this.add.text(e,s-180,"Phaser Wind - Scene 1",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("6xl")}).setOrigin(.5,.5),this.add.text(e,s-100,`Local State: ${t.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("lg")}).setOrigin(.5,.5),this.add.text(e,s-60,`Global State: ${n.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("lg")}).setOrigin(.5,.5),this.add.text(e,s,"Go to Scene 2",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{this.scene.start("PreviewScene2")})}}class T extends h{constructor(){super("PreviewScene2")}preload(){}create(){const t=C(this,"localState"),n=v(this,"globalState"),e=this.cameras.main.centerX,s=this.cameras.main.centerY;this.add.text(e,s-180,"Phaser Wind - Scene 2",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("6xl")}).setOrigin(.5,.5),this.add.text(e,s-100,`Local State: ${t.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("lg")}).setOrigin(.5,.5),this.add.text(e,s-60,`Global State: ${n.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("lg")}).setOrigin(.5,.5),this.add.text(e,s+20,`Note that in this scene, the localState did not bring the value from the other scene,
but the globalState did share the value between scenes.`,{color:a.rgb("slate-400"),align:"center",fontSize:r.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}class P extends h{constructor(){super("SessionStorageScene")}preload(){}create(){const t=f(this,"sessionCounter",0,void 0,"session"),n=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(n,e-180,"SessionStorage Counter",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("6xl")}).setOrigin(.5,.5),this.add.text(n-100,e,"-",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("4xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()-1)}),this.add.text(n+100,e,"+",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("4xl"),backgroundColor:"#059669",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()+1)}),t.onChange(p=>{const c=this.children.getByName("counterText");c&&c.setText(`Counter: ${p}`)}),this.add.text(n,e-100,`Counter: ${t.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("3xl")}).setOrigin(.5,.5).setName("counterText"),this.add.text(n,e+80,`This counter uses sessionStorage.
The value persists during the browser session but is lost when the tab is closed.`,{color:a.rgb("slate-400"),align:"center",fontSize:r.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}class E extends h{constructor(){super("LocalStorageScene")}preload(){}create(){const t=f(this,"localCounter",0,void 0,"local"),n=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(n,e-180,"LocalStorage Counter",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("6xl")}).setOrigin(.5,.5),this.add.text(n-100,e,"-",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("4xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()-1)}),this.add.text(n+100,e,"+",{color:a.rgb("slate-200"),align:"center",fontSize:r.px("4xl"),backgroundColor:"#059669",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()+1)}),t.onChange(p=>{const c=this.children.getByName("counterText");c&&c.setText(`Counter: ${p}`)}),this.add.text(n,e-100,`Counter: ${t.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:r.px("3xl")}).setOrigin(.5,.5).setName("counterText"),this.add.text(n,e+80,`This counter uses localStorage.
The value persists even after closing the browser and will survive page refreshes.`,{color:a.rgb("slate-400"),align:"center",fontSize:r.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}const H={title:"Phaser Hooks/Examples",parameters:{docs:{description:{component:"Examples using Phaser Hooks for state management"}}}},d={render:()=>{const o=document.createElement("div");return o.id=S,o},play:async()=>{await w(),await i(1),b(S,{type:Phaser.AUTO,width:800,height:600,parent:S,backgroundColor:"#2c3e50",scene:[L,T]}),await i(1)}},g={render:()=>{const o=document.createElement("div");return o.id=m,o},play:async()=>{await w(),await i(1),b(m,{type:Phaser.AUTO,width:800,height:600,parent:m,backgroundColor:"#2c3e50",scene:[P]}),await i(1)}},u={render:()=>{const o=document.createElement("div");return o.id=x,o},play:async()=>{await w(),await i(1),b(x,{type:Phaser.AUTO,width:800,height:600,parent:x,backgroundColor:"#2c3e50",scene:[E]}),await i(1)}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
      scene: [PreviewScene, PreviewScene2]
    });
    await nextFrames(1);
  }
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.createElement('div');
    root.id = ID_SESSION;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(1);
    createGame(ID_SESSION, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: ID_SESSION,
      backgroundColor: '#2c3e50',
      scene: [SessionStorageScene]
    });
    await nextFrames(1);
  }
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.createElement('div');
    root.id = ID_LOCAL;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(1);
    createGame(ID_LOCAL, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: ID_LOCAL,
      backgroundColor: '#2c3e50',
      scene: [LocalStorageScene]
    });
    await nextFrames(1);
  }
}`,...u.parameters?.docs?.source}}};const B=["PreviewScene","PreviewScene2","SessionStorageScene","LocalStorageScene","LocalStateVsGlobalState","SessionStorageExample","LocalStorageExample"];export{d as LocalStateVsGlobalState,u as LocalStorageExample,E as LocalStorageScene,L as PreviewScene,T as PreviewScene2,g as SessionStorageExample,P as SessionStorageScene,B as __namedExportsOrder,H as default};
