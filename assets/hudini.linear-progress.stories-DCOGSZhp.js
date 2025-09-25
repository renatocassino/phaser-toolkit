import{a as d,H as h,L as g}from"./plugin-DsYJWDHU.js";import{r as v,c as f,n as y,a as b,C,P as m,g as p,d as P}from"./create-game-IT2NM2Nb.js";import{c as B}from"./theme-manager-BFQS-suy.js";import{S as w}from"./scene-with-hudini-EXJR7ZX3.js";import"./webfontloader-DxEgiKE1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const n="hudini-linear-progress",k=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    LinearProgress,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progressBars: LinearProgress[] = [];
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic determinate progress bar
        const basicProgress = new LinearProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            width: 300,
            height: 8,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            borderRadius: 'default',
            progress: 65,
        });

        // Indeterminate progress bar
        const loadingBar = new LinearProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 200,
            width: 300,
            height: 12,
            backgroundColor: 'gray-200',
            progressColor: 'purple-500',
            borderRadius: 'full',
            indeterminate: true,
        });

        this.add.existing(basicProgress);
        this.add.existing(loadingBar);
        
        this.progressBars.push(basicProgress, loadingBar);
    }
}
`,L={title:"Hudini/Components/LinearProgress",parameters:{docs:{description:{component:"LinearProgress is a customizable progress bar component that supports both determinate and indeterminate modes with phaser-wind styling."},source:{language:"ts",code:k}}}},x=B({});class I extends w{progressBar;currentProgress=0;progressTimer;constructor(){super("interactive")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.progressBar=new g({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,width:400,height:16,backgroundColor:"gray-200",progressColor:"blue-500",borderRadius:"default",progress:50}),this.add.existing(this.progressBar),this.add.text(this.cameras.main.centerX,this.cameras.main.centerY-60,"Interactive LinearProgress Component",{fontSize:"24px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5);const o=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY+40,"50%",{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});o.setOrigin(.5),o.setName("progressText"),this.events.on("props:update",s=>this.applyProps(s))}applyProps(e){if(this.progressBar)if(this.progressBar.setBackgroundColor(e.backgroundColor),this.progressBar.setProgressColor(e.progressColor),this.progressBar.setBorderRadius(e.borderRadius),this.progressBar.setIndeterminate(e.indeterminate),e.indeterminate){const r=this.children.getByName("progressText");r&&r.setText("Loading...")}else{this.progressBar.setProgress(e.progress,e.animate);const r=this.children.getByName("progressText");r&&r.setText(`${Math.round(e.progress)}%`)}}}class S extends w{progressBars=[];animationTimers=[];constructor(){super("showcase")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.add.text(this.cameras.main.centerX,30,"LinearProgress Showcase",{fontSize:"28px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5),this.createProgressBarSection("Basic Progress Bars",80,[{backgroundColor:"gray-200",progressColor:"blue-500",progress:25},{backgroundColor:"gray-200",progressColor:"green-500",progress:50},{backgroundColor:"gray-200",progressColor:"red-500",progress:75}]),this.createProgressBarSection("Border Radius Variants",220,[{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,borderRadius:"none"},{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,borderRadius:"sm"},{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,borderRadius:"lg"},{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,borderRadius:"full"}]),this.createProgressBarSection("Size Variants",360,[{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,height:4},{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,height:8},{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,height:16},{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,height:24}]),this.createIndeterminateSection("Indeterminate Progress",500),this.createAnimatedSection("Animated Progress",580)}createProgressBarSection(e,r,o){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"}),o.forEach((s,t)=>{const a=new g({scene:this,x:200+t*120,y:r+30,width:100,height:s.height??8,backgroundColor:s.backgroundColor,progressColor:s.progressColor,borderRadius:s.borderRadius??"default",progress:s.progress});this.add.existing(a),this.progressBars.push(a),this.add.text(200+t*120,r+50,`${s.progress}%`,{fontSize:"12px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)})}createIndeterminateSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"}),[{bg:"gray-200",fill:"blue-500"},{bg:"gray-200",fill:"green-500"},{bg:"gray-200",fill:"purple-500"},{bg:"gray-200",fill:"pink-500"}].forEach((s,t)=>{const a=new g({scene:this,x:200+t*120,y:r+30,width:100,height:8,backgroundColor:s.bg,progressColor:s.fill,borderRadius:"full",indeterminate:!0});this.add.existing(a),this.progressBars.push(a)})}createAnimatedSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});const o=new g({scene:this,x:400,y:r+30,width:300,height:12,backgroundColor:"gray-300",progressColor:"emerald-500",borderRadius:"lg",progress:0});this.add.existing(o),this.progressBars.push(o);let s=0,t=!0;const a=this.time.addEvent({delay:50,callback:()=>{t?(s+=2,s>=100&&(t=!1)):(s-=2,s<=0&&(t=!0)),o.setProgress(s,!1)},loop:!0});this.animationTimers.push(a)}destroy(){this.animationTimers.forEach(e=>e.destroy()),super.destroy()}}const u=["gray-200","gray-300","gray-400","slate-200","slate-300","slate-400","blue-200","blue-300","blue-400","blue-500","blue-600","green-200","green-300","green-400","green-500","green-600","red-200","red-300","red-400","red-500","red-600","purple-200","purple-300","purple-400","purple-500","purple-600","orange-200","orange-300","orange-400","orange-500","orange-600","yellow-200","yellow-300","yellow-400","yellow-500","yellow-600","pink-200","pink-300","pink-400","pink-500","pink-600","cyan-200","cyan-300","cyan-400","cyan-500","cyan-600","emerald-200","emerald-300","emerald-400","emerald-500","emerald-600"],c={render:i=>{const e=document.getElementById(`${n}-interactive`)??document.createElement("div");e.id=`${n}-interactive`;const r=()=>{const o=p(`${n}-interactive`);if(!o)return;o.scene.getScene("interactive").events.emit("props:update",i)};return p(`${n}-interactive`)?r():p(`${n}-interactive`)?.events.once(m.Core.Events.READY,r),e},play:async()=>{f(),await y(3),b(`${n}-interactive`,{type:m.AUTO,width:800,height:400,backgroundColor:C.slate(900),parent:document.getElementById(`${n}-interactive`),scene:[I],plugins:{global:[{key:d,plugin:h,mapping:d,data:{theme:x}}]}})},args:{progress:50,backgroundColor:"gray-200",progressColor:"blue-500",borderRadius:"default",indeterminate:!1,animate:!0},argTypes:{progress:{control:{type:"range",min:0,max:100,step:1},description:"Progress value (0-100). Only applies when indeterminate is false."},backgroundColor:{control:"select",options:u,description:"Background color using phaser-wind color tokens"},progressColor:{control:"select",options:u,description:"Progress fill color using phaser-wind color tokens"},borderRadius:{control:"select",options:Object.keys(v),description:"Border radius using phaser-wind radius tokens"},indeterminate:{control:"boolean",description:"Whether to show indeterminate loading animation"},animate:{control:"boolean",description:"Whether to animate progress changes"}}},l={render:()=>{const i=document.createElement("div");return i.id=`${n}-showcase`,i},play:async()=>{await f(),await y(3),b(`${n}-showcase`,{type:m.AUTO,width:800,height:650,backgroundColor:C.slate(900),parent:document.getElementById(`${n}-showcase`),plugins:{global:[{key:d,plugin:h,mapping:d,start:!0,data:{theme:P}}]},scene:[S]})}};c.parameters={docs:{description:{story:"Interactive LinearProgress component with live controls. Adjust the properties to see real-time changes."}}};l.parameters={docs:{autoplay:!0,story:{inline:!1},description:{story:"Comprehensive showcase of LinearProgress component variations including different colors, sizes, border radius, and animations."},source:{code:k}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(\`\${ID}-interactive\`) ?? document.createElement('div');
    root.id = \`\${ID}-interactive\`;
    const apply = (): void => {
      const game = getGame(\`\${ID}-interactive\`);
      if (!game) return;
      const scene = game.scene.getScene('interactive') as InteractiveScene;
      scene.events.emit('props:update', args);
    };
    if (getGame(\`\${ID}-interactive\`)) {
      apply();
    } else {
      getGame(\`\${ID}-interactive\`)?.events.once(Phaser.Core.Events.READY, apply);
    }
    return root;
  },
  play: async (): Promise<void> => {
    cleanGames();
    await nextFrames(3);
    createGame(\`\${ID}-interactive\`, {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(\`\${ID}-interactive\`) as HTMLElement,
      scene: [InteractiveScene],
      plugins: {
        global: [{
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          mapping: HUDINI_KEY,
          data: {
            theme
          } as HudiniPluginData
        }]
      }
    });
  },
  args: {
    progress: 50,
    backgroundColor: 'gray-200',
    progressColor: 'blue-500',
    borderRadius: 'default',
    indeterminate: false,
    animate: true
  },
  argTypes: {
    progress: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1
      },
      description: 'Progress value (0-100). Only applies when indeterminate is false.'
    },
    backgroundColor: {
      control: 'select',
      options: colorOptions,
      description: 'Background color using phaser-wind color tokens'
    },
    progressColor: {
      control: 'select',
      options: colorOptions,
      description: 'Progress fill color using phaser-wind color tokens'
    },
    borderRadius: {
      control: 'select',
      options: Object.keys(radiusMap) as RadiusKey[],
      description: 'Border radius using phaser-wind radius tokens'
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether to show indeterminate loading animation'
    },
    animate: {
      control: 'boolean',
      description: 'Whether to animate progress changes'
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const root = document.createElement('div');
    root.id = \`\${ID}-showcase\`;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(3);
    createGame(\`\${ID}-showcase\`, {
      type: Phaser.AUTO,
      width: 800,
      height: 650,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(\`\${ID}-showcase\`) as HTMLElement,
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
      scene: [ShowcaseScene]
    });
  }
}`,...l.parameters?.docs?.source}}};const O=["Interactive","Showcase"];export{c as Interactive,l as Showcase,O as __namedExportsOrder,L as default};
