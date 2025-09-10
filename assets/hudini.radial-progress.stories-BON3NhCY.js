import{a as d,H as f,d as a}from"./plugin-hGH1kwtW.js";import{f as S,c as C,n as x,a as y,C as k,P as m,g as h,d as A}from"./create-game-IT2NM2Nb.js";import{c as v}from"./theme-manager-BFQS-suy.js";import{S as w}from"./scene-with-hudini-EXJR7ZX3.js";import"./webfontloader-DxEgiKE1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i="hudini-radial-progress",b=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    RadialProgress,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progressCircles: RadialProgress[] = [];
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic determinate radial progress
        const basicProgress = new RadialProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            radius: 48,
            thickness: 12,
            backgroundColor: 'gray-200',
            progressColor: 'blue-500',
            progress: 65,
        });

        this.add.existing(basicProgress);
        this.add.existing(loadingCircle);
        
        this.progressCircles.push(basicProgress, loadingCircle);
    }
}
`,F={title:"Hudini/Components/RadialProgress",parameters:{docs:{description:{component:"RadialProgress is a customizable circular progress indicator that supports determinate modes with phaser-wind styling."},source:{language:"ts",code:b}}}},P=v({});class T extends w{progressCircle;constructor(){super("interactive")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.progressCircle=new a({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,radius:80,thickness:16,backgroundColor:"gray-200",progressColor:"blue-500",progress:50,showText:!0,textColor:"white",fontSize:"base",textAlpha:1}),this.add.existing(this.progressCircle),this.add.text(this.cameras.main.centerX,this.cameras.main.centerY-120,"Interactive RadialProgress Component",{fontSize:"24px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5),this.events.on("props:update",s=>this.applyProps(s))}applyProps(e){this.progressCircle&&(this.progressCircle.setBackgroundColor(e.backgroundColor),this.progressCircle.setProgressColor(e.progressColor),this.progressCircle.setBackgroundAlpha(e.backgroundAlpha),this.progressCircle.setThickness(e.thickness),this.progressCircle.setShowText(e.showText),this.progressCircle.setTextColor(e.textColor),this.progressCircle.setFontSize(e.fontSize),this.progressCircle.setTextAlpha(e.textAlpha),this.progressCircle.setProgress(e.progress,e.animate),this.progressCircle.setRadius(e.radius))}}class I extends w{progressCircles=[];animationTimers=[];constructor(){super("showcase")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.add.text(this.cameras.main.centerX,30,"RadialProgress Showcase",{fontSize:"28px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5),this.createProgressCircleSection("Basic Progress Circles",80,[{backgroundColor:"gray-200",progressColor:"blue-500",progress:25},{backgroundColor:"gray-200",progressColor:"green-500",progress:50},{backgroundColor:"gray-200",progressColor:"red-500",progress:75}]),this.createProgressCircleSection("Thickness Variants",260,[{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,thickness:6},{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,thickness:12},{backgroundColor:"slate-200",progressColor:"cyan-500",progress:60,thickness:20}]),this.createProgressCircleSection("Size Variants",440,[{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,radius:32},{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,radius:48},{backgroundColor:"orange-200",progressColor:"orange-500",progress:40,radius:64}]),this.createRadiusSection("Radius Variants",620),this.createTextSection("Text Examples",800),this.createBackgroundAlphaSection("Background Alpha Examples",980),this.createAnimatedSection("Animated Progress",1160)}createProgressCircleSection(e,r,s){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"}),s.forEach((t,o)=>{const n=new a({scene:this,x:200+o*180,y:r+80,radius:t.radius??48,thickness:t.thickness??12,backgroundColor:t.backgroundColor,progressColor:t.progressColor,progress:t.progress});this.add.existing(n),this.progressCircles.push(n),this.add.text(200+o*180,r+80,`${t.progress}%`,{fontSize:"16px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)})}createAnimatedSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});const s=new a({scene:this,x:400,y:r+80,radius:64,thickness:16,backgroundColor:"gray-300",progressColor:"emerald-500",progress:0});this.add.existing(s),this.progressCircles.push(s);let t=0,o=!0;const n=this.time.addEvent({delay:50,callback:()=>{o?(t+=2,t>=100&&(o=!1)):(t-=2,t<=0&&(o=!0)),s.setProgress(t,!1)},loop:!0});this.animationTimers.push(n)}createTextSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});const s=new a({scene:this,x:300,y:r+80,radius:48,thickness:12,backgroundColor:"purple-200",progressColor:"purple-500",progress:75,showText:!0,textColor:"white",fontSize:"base",textAlpha:1});this.add.existing(s),this.progressCircles.push(s),this.add.text(300,r+80,"With Text (75%)",{fontSize:"14px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5);const t=new a({scene:this,x:500,y:r+80,radius:48,thickness:12,backgroundColor:"yellow-200",progressColor:"yellow-600",progress:60,showText:!0,textColor:"yellow-800",fontSize:"lg",textAlpha:.9});this.add.existing(t),this.progressCircles.push(t),this.add.text(500,r+80,"Colored Text (60%)",{fontSize:"14px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)}createRadiusSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});const s=[32,48,64,80,96,120],t=["blue-500","green-500","red-500","purple-500","orange-500","cyan-500"];s.forEach((o,n)=>{const l=new a({scene:this,x:150+n*100,y:r+80,radius:o,thickness:Math.max(4,o/8),backgroundColor:"gray-200",progressColor:t[n],progress:60,showText:!0,textColor:"white",fontSize:o<48?"sm":o<80?"base":"lg",textAlpha:1});this.add.existing(l),this.progressCircles.push(l),this.add.text(150+n*100,r+80+o+20,`${o}px`,{fontSize:"12px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)})}createBackgroundAlphaSection(e,r){this.add.text(50,r,e,{fontSize:"18px",color:"#ffffff",fontFamily:"Arial"});const s=[.1,.3,.5,.7,.9,1],t=["blue-500","green-500","red-500","purple-500","orange-500","cyan-500"];s.forEach((o,n)=>{const l=new a({scene:this,x:150+n*100,y:r+80,radius:48,thickness:12,backgroundColor:"gray-200",backgroundAlpha:o,progressColor:t[n],progress:60,showText:!0,textColor:"white",fontSize:"base",textAlpha:1});this.add.existing(l),this.progressCircles.push(l),this.add.text(150+n*100,r+80+60,`α: ${o}`,{fontSize:"12px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)})}destroy(){this.animationTimers.forEach(e=>e.destroy())}}const u=["gray-200","gray-300","gray-400","slate-200","slate-300","slate-400","blue-200","blue-300","blue-400","blue-500","blue-600","green-200","green-300","green-400","green-500","green-600","red-200","red-300","red-400","red-500","red-600","purple-200","purple-300","purple-400","purple-500","purple-600","orange-200","orange-300","orange-400","orange-500","orange-600","yellow-200","yellow-300","yellow-400","yellow-500","yellow-600","pink-200","pink-300","pink-400","pink-500","pink-600","cyan-200","cyan-300","cyan-400","cyan-500","cyan-600","emerald-200","emerald-300","emerald-400","emerald-500","emerald-600"],p={render:c=>{const e=document.getElementById(`${i}-interactive`)??document.createElement("div");e.id=`${i}-interactive`;const r=()=>{const s=h(`${i}-interactive`);if(!s)return;s.scene.getScene("interactive").events.emit("props:update",c)};return h(`${i}-interactive`)?r():h(`${i}-interactive`)?.events.once(m.Core.Events.READY,r),e},play:async()=>{C(),await x(3),y(`${i}-interactive`,{type:m.AUTO,width:800,height:500,backgroundColor:k.slate(900),parent:document.getElementById(`${i}-interactive`),scene:[T],plugins:{global:[{key:d,plugin:f,mapping:d,data:{theme:P}}]}})},args:{progress:50,backgroundColor:"gray-200",backgroundAlpha:.2,progressColor:"blue-500",thickness:16,animate:!0,showText:!1,textColor:"white",fontSize:"base",textAlpha:1,radius:80},argTypes:{backgroundColor:{control:"select",options:u,description:"Background color using phaser-wind color tokens"},backgroundAlpha:{control:{type:"range",min:0,max:1,step:.1},description:"Alpha (transparency) of the background circle"},progressColor:{control:"select",options:u,description:"Progress fill color using phaser-wind color tokens"},thickness:{control:{type:"range",min:4,max:32,step:1},description:"Thickness of the progress arc"},animate:{control:"boolean",description:"Whether to animate progress changes"},showText:{control:"boolean",description:"Whether to show the percentage text in the center"},textColor:{control:"select",options:u,description:"Color of the percentage text"},fontSize:{control:"select",options:Object.keys(S),description:"Font size of the percentage text in pixels"},textAlpha:{control:{type:"range",min:0,max:1,step:.1},description:"Alpha (transparency) of the percentage text"},radius:{control:"select",options:[32,48,64,80,96,120,160],description:"Radius of the progress circle in pixels"}}},g={render:()=>{const c=document.createElement("div");return c.id=`${i}-showcase`,c},play:async()=>{await C(),await x(3),y(`${i}-showcase`,{type:m.AUTO,width:800,height:1400,backgroundColor:k.slate(900),parent:document.getElementById(`${i}-showcase`),plugins:{global:[{key:d,plugin:f,mapping:d,start:!0,data:{theme:A}}]},scene:[I]})}};p.parameters={docs:{description:{story:"Interactive RadialProgress component with live controls. Adjust the properties to see real-time changes."}}};g.parameters={docs:{autoplay:!0,story:{inline:!1},description:{story:"Comprehensive showcase of RadialProgress component variations including different colors, sizes, thickness, and animations."},source:{code:b}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
      height: 500,
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
    backgroundAlpha: 0.2,
    progressColor: 'blue-500',
    thickness: 16,
    animate: true,
    showText: false,
    textColor: 'white',
    fontSize: 'base',
    textAlpha: 1,
    radius: 80
  },
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: colorOptions,
      description: 'Background color using phaser-wind color tokens'
    },
    backgroundAlpha: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1
      },
      description: 'Alpha (transparency) of the background circle'
    },
    progressColor: {
      control: 'select',
      options: colorOptions,
      description: 'Progress fill color using phaser-wind color tokens'
    },
    thickness: {
      control: {
        type: 'range',
        min: 4,
        max: 32,
        step: 1
      },
      description: 'Thickness of the progress arc'
    },
    animate: {
      control: 'boolean',
      description: 'Whether to animate progress changes'
    },
    showText: {
      control: 'boolean',
      description: 'Whether to show the percentage text in the center'
    },
    textColor: {
      control: 'select',
      options: colorOptions,
      description: 'Color of the percentage text'
    },
    fontSize: {
      control: 'select',
      options: Object.keys(fontSizeMap) as FontSizeKey[],
      description: 'Font size of the percentage text in pixels'
    },
    textAlpha: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1
      },
      description: 'Alpha (transparency) of the percentage text'
    },
    radius: {
      control: 'select',
      options: [32, 48, 64, 80, 96, 120, 160],
      description: 'Radius of the progress circle in pixels'
    }
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
      height: 1400,
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
}`,...g.parameters?.docs?.source}}};const B=["Interactive","Showcase"];export{p as Interactive,g as Showcase,B as __namedExportsOrder,F as default};
