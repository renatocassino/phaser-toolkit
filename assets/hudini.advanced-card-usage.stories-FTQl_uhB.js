import"./webfontloader-DPE_tNm0.js";import{l as c}from"./load-font-C-uD1_gu.js";import{H as i,a as d,R as l,I as e,b as m}from"./plugin-B1U0GAQ2.js";import{c as u,n as g,a as h,C as a,P as p}from"./create-game-IT2NM2Nb.js";import{c as w}from"./theme-manager-BFQS-suy.js";import{S as y}from"./scene-with-hudini-EXJR7ZX3.js";import"./_commonjsHelpers-Cpj98o6Y.js";const n="hudini-advanced-card-usage",D={title:"HUDini/Advanced Card Usage",tags:["autodocs"],parameters:{docs:{description:{component:"Advanced card usage with nested layout components. Shows how to create a card containing a column with a row of small icon buttons."}}}};class b extends y{constructor(){super("preview")}create(){this.cameras.main.setBackgroundColor(a.rgb("slate-100")),this.add.text(300,50,"Advanced Card Usage",{fontSize:"24px",color:a.rgb("slate-800")}).setOrigin(.5);const s=new l({scene:this,x:0,y:0,gap:10,align:"center",children:[new e({scene:this,x:0,y:0,icon:"house",size:16,color:"blue"}),new e({scene:this,x:0,y:0,icon:"users",size:16,color:"green"}),new e({scene:this,x:0,y:0,icon:"gear",size:16,color:"purple"}),new e({scene:this,x:0,y:0,icon:"heart-circle-check",size:16,color:"red"}),new e({scene:this,x:0,y:0,icon:"star-of-david",size:16,color:"yellow"})]}),r=new m({scene:this,x:300,y:200,backgroundColor:a.rgb("slate-700"),borderRadius:12,margin:10,child:s});this.add.existing(r),r.layout()}}const x=async()=>{await c()},t={render:()=>{const o=document.getElementById(n)??document.createElement("div");return o.id=n,o},play:async()=>{await x(),await u(),await g(3),h(n,{type:p.AUTO,width:600,height:400,backgroundColor:a.rgb("slate-100"),parent:document.getElementById(n),plugins:{global:[{key:d,plugin:i,start:!0,data:{theme:w({})}}]},scene:[b]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await ensureFontOnce();
    await cleanGames();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      backgroundColor: Color.rgb('slate-100'),
      parent: document.getElementById(ID) as HTMLElement,
      plugins: {
        global: [{
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          start: true,
          data: {
            theme: createTheme({})
          }
        }]
      },
      scene: [PreviewScene]
    });
  }
}`,...t.parameters?.docs?.source}}};const P=["AdvancedCardUsage"];export{t as AdvancedCardUsage,P as __namedExportsOrder,D as default};
