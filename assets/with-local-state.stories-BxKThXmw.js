import{p as S,F as a,C as s,c as w,n as b,a as f,d as O}from"./create-game-ukjiax-1.js";import{R as C,T as l,a as m,H as y}from"./plugin-CWmWIBW8.js";import{w as h}from"./with-local-state-MH_iXcZF.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./webfontloader-5Azx9hTn.js";import"./with-state-def-CxFQTzEy.js";class T extends S.Scene{constructor(){super("PreviewScene")}preload(){}create(){const n=h(this,"localState",5,{debug:!0});n.set(5);const t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-180,"Phaser Wind - Scene 1",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(t,e-120,"Code: withLocalState<number>(this, 'localState', 5);").setOrigin(.5,.5);const r=this.add.text(t,e-100,n.get().toString(),{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),c=new C({scene:this,x:t,y:e,gap:16,align:"center",children:[new l({scene:this,x:t,y:e-100,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),r,new l({scene:this,x:t,y:e-100,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]}),i=n.on("change",()=>{r.setText(n.get().toString())});this.add.existing(c),this.add.text(t,e+100,`Local State: ${n.get()}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(t,e+100,"Go to Scene 2",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{i(),this.scene.start("PreviewScene2")})}}class v extends S.Scene{constructor(){super("PreviewScene2")}preload(){}create(){const n=h(this,"localState",5,{debug:!0}),t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-180,"Phaser Wind - Scene 2",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),this.add.text(t,e-120,"Code: withLocalState<number>(this, 'localState', 5);").setOrigin(.5,.5),this.add.text(t,e-80,`Local State value: ${n.get()}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5),this.add.text(t,e+20,"Note that in this scene, the localState did not bring the value from the other scene. The initial value is 5, and in this scene back to 5.",{color:s.rgb("slate-400"),align:"center",fontSize:a.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5)}}class P extends S.Scene{changeLogText;constructor(){super("PreviewSceneOnChange")}preload(){}create(){const n=h(this,"onChangeState",0,{debug:!0}),t=h(this,"onChangeCount",0),e=this.cameras.main.centerX,r=this.cameras.main.centerY;this.add.text(e,r-200,"Phaser Hooks - On Change Example",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("3xl")}).setOrigin(.5,.5),this.add.text(e,r-130,`Code:
const state = withLocalState<number>(this, 'onChangeState', 0);
const unsubscribe = state.on('change', callback);
// returns unsubscribe function`).setOrigin(.5,.5);const c=this.add.text(e,r-120,n.get().toString(),{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),i=new C({scene:this,x:e,y:r-60,gap:16,align:"center",children:[new l({scene:this,x:e,y:r-60,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1),t.set(t.get()+1)}}),c,new l({scene:this,x:e,y:r-60,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1),t.set(t.get()+1)}})]}),d=n.on("change",()=>{c.setText(n.get().toString()),this.changeLogText&&this.changeLogText.setText(`Change count: ${t.get()}`)}),k=t.on("change",()=>{this.changeLogText&&this.changeLogText.setText(`Change count: ${t.get()}`)});this.add.existing(i),this.changeLogText=this.add.text(e,r+20,`Change count: ${t.get()}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5);const u=this.add.text(e,r+60,"Unsubscribe from Changes",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0});u.on("pointerdown",()=>{d(),k(),u.setText("Unsubscribed!"),u.setStyle({backgroundColor:"#059669"}),u.disableInteractive()}),this.add.text(e,r+120,"Go to Scene 2",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{d(),this.scene.start("PreviewScene2OnChange")}),this.add.text(e,r+180,`IMPORTANT: Don't forget to unsubscribe
when move to another scene.`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5)}}class L extends S.Scene{unsubscribe;changeCount=0;changeLogText;constructor(){super("PreviewScene2OnChange")}preload(){}create(){const n=h(this,"onChangeState",0,{debug:!0}),t=this.cameras.main.centerX,e=this.cameras.main.centerY;this.add.text(t,e-200,"Phaser Hooks - On Change Example (Scene 2)",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("3xl")}).setOrigin(.5,.5),this.add.text(t,e-160,"Same hook, but different scene with another state").setOrigin(.5,.5);const r=this.add.text(t,e-120,n.get().toString(),{color:s.rgb("slate-200"),align:"center",fontSize:a.px("6xl")}).setOrigin(.5,.5),c=new C({scene:this,x:t,y:e-60,gap:16,align:"center",children:[new l({scene:this,x:t,y:e-60,text:"-",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()-1)}}),r,new l({scene:this,x:t,y:e-60,text:"+",fontSize:"xl",backgroundColor:"gray-600",onClick:()=>{n.set(n.get()+1)}})]});this.unsubscribe=n.on("change",()=>{this.changeCount++,r.setText(n.get().toString()),this.updateChangeLog()}),this.add.existing(c),this.changeLogText=this.add.text(t,e+20,`Change count: ${this.changeCount}`,{color:s.rgb("slate-300"),align:"center",fontSize:a.px("lg")}).setOrigin(.5,.5);const i=this.add.text(t,e+60,"Unsubscribe from Changes",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("xl"),backgroundColor:"#DC2626",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0});i.on("pointerdown",()=>{this.unsubscribe?(this.unsubscribe(),this.unsubscribe=void 0,i.setText("Subscribe to Changes"),i.setStyle({backgroundColor:"#059669"})):(this.unsubscribe=n.on("change",()=>{this.changeCount++,r.setText(n.get().toString()),this.updateChangeLog()}),i.setText("Unsubscribe from Changes"),i.setStyle({backgroundColor:"#DC2626"}))}),this.add.text(t,e+120,"Try unsubscribing and then changing the value. Notice how the change count stops updating.",{color:s.rgb("slate-400"),align:"center",fontSize:a.px("lg"),wordWrap:{width:600}}).setOrigin(.5,.5),this.add.text(t,e+180,"Go to Scene 1",{color:s.rgb("slate-200"),align:"center",fontSize:a.px("2xl"),backgroundColor:"#4A5568",padding:{x:20,y:10}}).setOrigin(.5).setInteractive({useHandCursor:!0}).on("pointerdown",()=>{this.unsubscribe&&this.unsubscribe(),this.scene.start("PreviewSceneOnChange")})}updateChangeLog(){this.changeLogText&&this.changeLogText.setText(`Change count: ${this.changeCount}`)}}const g="phaser-hooks-game-with-local-state",B={title:"Phaser Hooks/With Local State/Basic Example",parameters:{docs:{description:{component:"Basic example using Phaser Hooks for state management"}}}},x={render:()=>{const o=document.createElement("div");return o.id=g,o},play:async()=>{await w(),await b(1),f(g,{type:Phaser.AUTO,width:800,height:600,parent:g,backgroundColor:"#2c3e50",scene:[T,v],plugins:{global:[{key:m,plugin:y,mapping:m,start:!0,data:{theme:O}}]}}),await b(1)}},p={render:()=>{const o=document.createElement("div");return o.id=g,o},play:async()=>{await w(),await b(1),f(g,{type:Phaser.AUTO,width:800,height:600,parent:g,backgroundColor:"#2c3e50",scene:[P,L],plugins:{global:[{key:m,plugin:y,mapping:m,start:!0,data:{theme:O}}]}}),await b(1)}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const G=["BasicExample","ListenerOnChange"];export{x as BasicExample,p as ListenerOnChange,G as __namedExportsOrder,B as default};
