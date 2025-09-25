import{f as x}from"./webfontloader-DxEgiKE1.js";import{l as y}from"./load-font-CylPUwJn.js";import{a as l,H as f,c as p}from"./plugin-DsYJWDHU.js";import{c as P,n as S,a as w,C as z,P as d,g as i}from"./create-game-IT2NM2Nb.js";import{c as I}from"./theme-manager-BFQS-suy.js";import{S as v}from"./scene-with-hudini-EXJR7ZX3.js";import"./_commonjsHelpers-Cpj98o6Y.js";const b=["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"],C=["slate","gray","zinc","neutral","stone","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose"].flatMap(n=>[100,200,300,400,500,600,700,800,900,950].map(e=>`${n}-${e}`)),o="hudini-circular-progress",E=`
import Phaser from 'phaser';
import {
    CircularProgress,
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private progress?: CircularProgress;
    
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Basic usage
        this.progress = new CircularProgress({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            icon: 'spinner',
            color: 'blue',
            size: 'xl',
            rotationsPerSecond: 2,
        });
        this.add.existing(this.progress);

        // Multiple examples with different configurations
        const examples = [
            { x: 150, y: 100, icon: 'spinner', color: 'blue', size: 'md', speed: 2 },
            { x: 300, y: 100, icon: 'gear', color: 'red', size: 'lg', speed: 1 },
            { x: 450, y: 100, icon: 'rotate', color: 'green', size: 'xl', speed: 3 },
            { x: 150, y: 250, icon: 'arrows-rotate', color: 'purple', size: '2xl', speed: 0.5 },
        ];

        examples.forEach(({ x, y, icon, color, size, speed }) => {
            const progress = new CircularProgress({
                scene: this,
                x,
                y,
                icon: icon as IconKey,
                color: color as ColorKey,
                size: size as FontSizeKey,
                rotationsPerSecond: speed,
            });
            this.add.existing(progress);
        });
    }
}
`,Y={title:"Hudini/Components/CircularProgress",parameters:{docs:{description:{component:"A customizable circular progress indicator with rotating Font Awesome icons and Phaser Wind color tokens."},source:{language:"ts",code:E}}}},k=I({});class D extends v{progress;multipleProgress=[];constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(500)),this.progress=new p({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,icon:"spinner",color:"blue",size:"xl",rotationsPerSecond:.3}),this.add.existing(this.progress),this.add.text(this.cameras.main.centerX,this.cameras.main.centerY+60,"Interactive CircularProgress",{fontSize:"16px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5),this.createShowcaseExamples(),this.events.on("props:update",s=>this.applyProps(s))}createShowcaseExamples(){[{x:120,y:80,icon:"spinner",color:"blue",size:"sm",speed:2,label:"Default Spinner"},{x:280,y:80,icon:"gear",color:"pink",size:"lg",speed:.2,label:"Slow Gear"},{x:440,y:80,icon:"rotate",color:"green",size:"lg",speed:1.4,label:"Fast Rotate"},{x:120,y:320,icon:"arrows-rotate",color:"purple",size:"xl",speed:.5,label:"Very Slow"},{x:280,y:320,icon:"spinner",color:"yellow",size:"2xl",speed:1.8,label:"Very Fast"},{x:440,y:320,icon:"gear",color:"pink",size:"lg",speed:1,label:"Medium Speed"}].forEach(({x:s,y:r,icon:a,color:g,size:m,speed:u,label:h})=>{const c=new p({scene:this,x:s,y:r,icon:a,color:g,size:m,rotationsPerSecond:u});this.add.existing(c),this.multipleProgress.push(c),this.add.text(s,r+40,h,{fontSize:"12px",color:"#cccccc",fontFamily:"Arial"}).setOrigin(.5)}),this.add.text(this.cameras.main.centerX,30,"CircularProgress Showcase",{fontSize:"20px",color:"#ffffff",fontFamily:"Arial"}).setOrigin(.5)}applyProps(e){this.progress&&(this.progress.setIcon(e.icon),this.progress.setColor(e.color),this.progress.setSize(e.size),this.progress.setRotationsPerSecond(e.rotationsPerSecond),e.isSpinning&&!this.progress.spinning?this.progress.start():!e.isSpinning&&this.progress.spinning&&this.progress.stop())}}const T=async()=>{const n=window;n.__fontLoaded||(await y(),n.__fontLoaded=!0)},t={render:n=>{const e=document.getElementById(o)??document.createElement("div");e.id=o;const s=()=>{const r=i(o);if(!r)return;r.scene.getScene("preview").events.emit("props:update",n)};return i(o)?s():i(o)?.events.once(d.Core.Events.READY,s),e},play:async()=>{P(),await T(),await S(3),w(o,{type:d.AUTO,width:600,height:400,backgroundColor:z.slate(900),parent:document.getElementById(o),scene:[D],plugins:{global:[{key:l,plugin:f,mapping:l,data:{theme:k}}]}})},args:{icon:"spinner",color:"blue",size:"xl",rotationsPerSecond:.2,isSpinning:!0},argTypes:{icon:{control:"select",options:Object.keys(x).filter(n=>["spinner","gear","rotate","arrows-rotate","circle-notch","cog","sync"].includes(n)),description:"Font Awesome icon to display"},color:{control:"select",options:C,description:"Phaser Wind color token"},size:{control:"select",options:[...b,16,24,32,48,64],description:"Size using Phaser Wind token or pixel value"},rotationsPerSecond:{control:{type:"range",min:.1,max:5,step:.1},description:"Rotation speed in rotations per second"},isSpinning:{control:"boolean",description:"Whether the progress indicator is spinning"}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = game.scene.getScene('preview') as PreviewScene;
      scene.events.emit('props:update', args);
    };
    if (getGame(ID)) {
      apply();
    } else {
      getGame(ID)?.events.once(Phaser.Core.Events.READY, apply);
    }
    return root;
  },
  play: async (): Promise<void> => {
    cleanGames();
    await ensureFontOnce();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [PreviewScene],
      plugins: {
        global: [{
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          mapping: HUDINI_KEY,
          data: {
            theme
          }
        }]
      }
    });
  },
  args: {
    icon: 'spinner',
    color: 'blue',
    size: 'xl',
    rotationsPerSecond: 0.2,
    isSpinning: true
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(fontIcons).filter(icon => ['spinner', 'gear', 'rotate', 'arrows-rotate', 'circle-notch', 'cog', 'sync'].includes(icon)) as IconKey[],
      description: 'Font Awesome icon to display'
    },
    color: {
      control: 'select',
      options: colorTokens,
      description: 'Phaser Wind color token'
    },
    size: {
      control: 'select',
      options: [...sizeTokens, 16, 24, 32, 48, 64],
      description: 'Size using Phaser Wind token or pixel value'
    },
    rotationsPerSecond: {
      control: {
        type: 'range',
        min: 0.1,
        max: 5,
        step: 0.1
      },
      description: 'Rotation speed in rotations per second'
    },
    isSpinning: {
      control: 'boolean',
      description: 'Whether the progress indicator is spinning'
    }
  }
}`,...t.parameters?.docs?.source}}};const K=["CircularProgressExample"];export{t as CircularProgressExample,K as __namedExportsOrder,Y as default};
