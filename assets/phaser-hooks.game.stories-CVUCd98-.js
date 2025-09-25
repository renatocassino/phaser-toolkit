import"./plugin-B2MFCD_T.js";import{F as n,C as r,c as x,n as i,a as w}from"./create-game-ukjiax-1.js";import{S as u}from"./scene-with-hudini-BITB4cOD.js";import{w as v}from"./with-local-state-MH_iXcZF.js";import{w as f}from"./with-global-state-DbwBdne-.js";import{w as C}from"./with-persistent-state-y4lJursh.js";import"./webfontloader-5Azx9hTn.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./with-state-def-CxFQTzEy.js";const h="phaser-hooks-game",S="phaser-hooks-session",m="phaser-hooks-local";class y extends u{constructor(){super("PreviewScene")}preload(){}create(){const t=v(this,"localState","Local state defined in preview 1");t.set("Local state defined in preview 1");const a=f(this,"globalState","Global state defined in preview 1");a.set("Global state defined in preview 1");const e=this.cameras.main.centerX,s=this.cameras.main.centerY;this.add.text(e,s-180,"Phaser Wind - Scene 1",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("6xl")}).setOrigin(.5,.5),this.add.text(e,s-100,`Local State: ${t.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("lg")}).setOrigin(.5,.5),this.add.text(e,s-60,`Global State: ${a.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("lg")}).setOrigin(.5,.5),this.add.text(e,s,"Go to Scene 2",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{this.scene.start("PreviewScene2")})}}class L extends u{constructor(){super("PreviewScene2")}preload(){}create(){const t=v(this,"localState"),a=f(this,"globalState"),e=this.cameras.main.centerX,s=this.cameras.main.centerY;this.add.text(e,s-180,"Phaser Wind - Scene 2",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("6xl")}).setOrigin(.5,.5),this.add.text(e,s-100,`Local State: ${t.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("lg")}).setOrigin(.5,.5),this.add.text(e,s-60,`Global State: ${a.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("lg")}).setOrigin(.5,.5),this.add.text(e,s+20,`Note that in this scene, the localState did not bring the value from the other scene,
but the globalState did share the value between scenes.`,{color:r.rgb("slate-400"),align:"center",fontSize:n.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}class T extends u{constructor(){super("SessionStorageScene")}preload(){}create(){const t=C(this,"sessionCounter",0,void 0,"session"),a=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(a,e-180,"SessionStorage Counter",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("6xl")}).setOrigin(.5,.5),this.add.text(a-100,e,"-",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("4xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()-1)}),this.add.text(a+100,e,"+",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("4xl"),backgroundColor:"#059669",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()+1)}),t.onChange(p=>{const c=this.children.getByName("counterText");c&&c.setText(`Counter: ${p}`)}),this.add.text(a,e-100,`Counter: ${t.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("3xl")}).setOrigin(.5,.5).setName("counterText"),this.add.text(a,e+80,`This counter uses sessionStorage.
The value persists during the browser session but is lost when the tab is closed.`,{color:r.rgb("slate-400"),align:"center",fontSize:n.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}class P extends u{constructor(){super("LocalStorageScene")}preload(){}create(){const t=C(this,"localCounter",0,void 0,"local"),a=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(a,e-180,"LocalStorage Counter",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("6xl")}).setOrigin(.5,.5),this.add.text(a-100,e,"-",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("4xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()-1)}),this.add.text(a+100,e,"+",{color:r.rgb("slate-200"),align:"center",fontSize:n.px("4xl"),backgroundColor:"#059669",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{t.set(t.get()+1)}),t.onChange(p=>{const c=this.children.getByName("counterText");c&&c.setText(`Counter: ${p}`)}),this.add.text(a,e-100,`Counter: ${t.get()}`,{color:r.rgb("slate-300"),align:"center",fontSize:n.px("3xl")}).setOrigin(.5,.5).setName("counterText"),this.add.text(a,e+80,`This counter uses localStorage.
The value persists even after closing the browser and will survive page refreshes.`,{color:r.rgb("slate-400"),align:"center",fontSize:n.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}const _={title:"Phaser Hooks/Examples",parameters:{docs:{description:{component:"Examples using Phaser Hooks for state management"}}}},l={render:()=>{const o=document.createElement("div");return o.id=h,o},play:async()=>{await x(),await i(1),w(h,{type:Phaser.AUTO,width:800,height:600,parent:h,backgroundColor:"#2c3e50",scene:[y,L]}),await i(1)}},d={render:()=>{const o=document.createElement("div");return o.id=S,o},play:async()=>{await x(),await i(1),w(S,{type:Phaser.AUTO,width:800,height:600,parent:S,backgroundColor:"#2c3e50",scene:[T]}),await i(1)}},g={render:()=>{const o=document.createElement("div");return o.id=m,o},play:async()=>{await x(),await i(1),w(m,{type:Phaser.AUTO,width:800,height:600,parent:m,backgroundColor:"#2c3e50",scene:[P]}),await i(1)}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const F=["PreviewScene","PreviewScene2","SessionStorageScene","LocalStorageScene","LocalStateVsGlobalState","SessionStorageExample","LocalStorageExample"];export{l as LocalStateVsGlobalState,g as LocalStorageExample,P as LocalStorageScene,y as PreviewScene,L as PreviewScene2,d as SessionStorageExample,T as SessionStorageScene,F as __namedExportsOrder,_ as default};
