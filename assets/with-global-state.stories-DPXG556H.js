import{p as S,F as s,C as a,c as w,n as p,a as f,d as y}from"./create-game-IT2NM2Nb.js";import{R as C,T as g,a as m,H as O}from"./plugin-DsYJWDHU.js";import{w as d}from"./with-global-state-DbwBdne-.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./webfontloader-DxEgiKE1.js";import"./with-state-def-CxFQTzEy.js";class v extends S.Scene{constructor(){super("PreviewScene")}preload(){}create(){const n=d(this,"globalState",10,{debug:!0});n.set(10);const t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-180,"Phaser Wind - Scene 1",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),this.add.text(t,e-120,"Code: withGlobalState<number>(this, 'globalState', 10);").setOrigin(.5,.5);const r=this.add.text(t,e-100,n.get().toString(),{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),c=new C({scene:this,x:t,y:e,gap:16,align:"center",children:[new g({scene:this,x:t,y:e-100,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),r,new g({scene:this,x:t,y:e-100,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]}),o=n.on("change",()=>{r.setText(n.get().toString())});this.add.existing(c),this.add.text(t,e+100,`Global State: ${n.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:s.px("lg")}).setOrigin(.5,.5),this.add.text(t,e+100,"Go to Scene 2",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{o(),this.scene.start("PreviewScene2")})}}class T extends S.Scene{constructor(){super("PreviewScene2")}preload(){}create(){const n=d(this,"globalState",10,{debug:!0}),t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-180,"Phaser Wind - Scene 2",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),this.add.text(t,e-120,"Code: withGlobalState<number>(this, 'globalState', 10);").setOrigin(.5,.5),this.add.text(t,e-80,`Global State value: ${n.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:s.px("lg")}).setOrigin(.5,.5),this.add.text(t,e+20,"Note that in this scene, the globalState preserved the value from the previous scene. Global state persists across scene changes.",{color:a.rgb("slate-400"),align:"center",fontSize:s.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5);const r=this.add.text(t,e+80,n.get().toString(),{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),c=new C({scene:this,x:t,y:e+120,gap:16,align:"center",children:[new g({scene:this,x:t,y:e+120,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),r,new g({scene:this,x:t,y:e+120,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]}),o=n.on("change",()=>{r.setText(n.get().toString())});this.add.existing(c),this.add.text(t,e+180,"Go to Scene 1",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{o(),this.scene.start("PreviewScene")})}}class P extends S.Scene{changeLogText;constructor(){super("PreviewSceneOnChange")}preload(){}create(){const n=d(this,"onChangeState",0,{debug:!0}),t=d(this,"onChangeCount",0,{debug:!0}),e=this.cameras.main.centerX,r=this.cameras.main.centerY;this.add.text(e,r-200,"Phaser Hooks - On Change Example (Global)",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("3xl")}).setOrigin(.5,.5),this.add.text(e,r-130,`Code:
const state = withGlobalState<number>(this, 'onChangeState', 0);
const unsubscribe = state.on('change', callback);
// returns unsubscribe function`).setOrigin(.5,.5);const c=this.add.text(e,r-120,n.get().toString(),{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),o=new C({scene:this,x:e,y:r-60,gap:16,align:"center",children:[new g({scene:this,x:e,y:r-60,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1),t.set(t.get()+1)}}),c,new g({scene:this,x:e,y:r-60,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1),t.set(t.get()+1)}})]}),h=n.on("change",()=>{c.setText(n.get().toString()),this.changeLogText&&this.changeLogText.setText(`Change count: ${t.get()}`)}),k=t.on("change",()=>{this.changeLogText&&this.changeLogText.setText(`Change count: ${t.get()}`)});this.add.existing(o),this.changeLogText=this.add.text(e,r+20,`Change count: ${t.get()}`,{color:a.rgb("slate-300"),align:"center",fontSize:s.px("lg")}).setOrigin(.5,.5);const u=this.add.text(e,r+60,"Unsubscribe from Changes",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0});u.on("pointerdown",()=>{h(),k(),u.setText("Unsubscribed!"),u.setStyle({backgroundColor:"#059669"}),u.disableInteractive()}),this.add.text(e,r+120,"Go to Scene 2",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{h(),this.scene.start("PreviewScene2OnChange")}),this.add.text(e,r+180,`IMPORTANT: Don't forget to unsubscribe
when move to another scene.`,{color:a.rgb("slate-300"),align:"center",fontSize:s.px("lg")}).setOrigin(.5,.5)}}class z extends S.Scene{unsubscribe;changeCount=0;changeLogText;constructor(){super("PreviewScene2OnChange")}preload(){}create(){const n=d(this,"onChangeState",0,{debug:!0}),t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-200,"Phaser Hooks - On Change Example (Scene 2)",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("3xl")}).setOrigin(.5,.5),this.add.text(t,e-160,"Same hook, but different scene with SAME global state").setOrigin(.5,.5);const r=this.add.text(t,e-120,n.get().toString(),{color:a.rgb("slate-200"),align:"center",fontSize:s.px("6xl")}).setOrigin(.5,.5),c=new C({scene:this,x:t,y:e-60,gap:16,align:"center",children:[new g({scene:this,x:t,y:e-60,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),r,new g({scene:this,x:t,y:e-60,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]});this.unsubscribe=n.on("change",()=>{this.changeCount++,r.setText(n.get().toString()),this.updateChangeLog()}),this.add.existing(c),this.changeLogText=this.add.text(t,e+20,`Change count: ${this.changeCount}`,{color:a.rgb("slate-300"),align:"center",fontSize:s.px("lg")}).setOrigin(.5,.5);const o=this.add.text(t,e+60,"Unsubscribe from Changes",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0});o.on("pointerdown",()=>{this.unsubscribe?(this.unsubscribe(),this.unsubscribe=void 0,o.setText("Subscribe to Changes"),o.setStyle({backgroundColor:"#059669"})):(this.unsubscribe=n.on("change",()=>{this.changeCount++,r.setText(n.get().toString()),this.updateChangeLog()}),o.setText("Unsubscribe from Changes"),o.setStyle({backgroundColor:"#DC2626"}))}),this.add.text(t,e+120,"Try unsubscribing and then changing the value. Notice how the change count stops updating.",{color:a.rgb("slate-400"),align:"center",fontSize:s.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5),this.add.text(t,e+180,"Go to Scene 1",{color:a.rgb("slate-200"),align:"center",fontSize:s.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{this.unsubscribe&&this.unsubscribe(),this.scene.start("PreviewSceneOnChange")})}updateChangeLog(){this.changeLogText&&this.changeLogText.setText(`Change count: ${this.changeCount}`)}}const l="phaser-hooks-game-with-global-state",Y={title:"Phaser Hooks/With Global State/Basic Example",parameters:{docs:{description:{component:"Basic example using Phaser Hooks for global state management that persists across scenes"}}}},x={render:()=>{const i=document.createElement("div");return i.id=l,i},play:async()=>{await w(),await p(1),f(l,{type:Phaser.AUTO,width:800,height:600,parent:l,backgroundColor:"#2c3e50",scene:[v,T],plugins:{global:[{key:m,plugin:O,mapping:m,start:!0,data:{theme:y}}]}}),await p(1)}},b={render:()=>{const i=document.createElement("div");return i.id=l,i},play:async()=>{await w(),await p(1),f(l,{type:Phaser.AUTO,width:800,height:600,parent:l,backgroundColor:"#2c3e50",scene:[P,z],plugins:{global:[{key:m,plugin:O,mapping:m,start:!0,data:{theme:y}}]}}),await p(1)}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
      scene: [PreviewSceneOnChange, PreviewScene2OnChange],
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
}`,...b.parameters?.docs?.source}}};const B=["BasicExample","ListenerOnChange"];export{x as BasicExample,b as ListenerOnChange,B as __namedExportsOrder,Y as default};
