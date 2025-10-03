import"./webfontloader-5Azx9hTn.js";import{l as s}from"./load-font-CS-eZXpH.js";import{a,H as r,I as c}from"./plugin-CWmWIBW8.js";import{c as u,n as l,a as d,C as p,P as h}from"./create-game-ukjiax-1.js";import{c as m}from"./theme-manager-EhPXZ0nu.js";import{S as f}from"./scene-with-hudini-BITB4cOD.js";import"./_commonjsHelpers-Cpj98o6Y.js";const e="hudini-interactive-events",x=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    IconButton,
    SceneWithHudini
} from 'hudini';

const theme = createTheme({});
type Theme = typeof theme;

class InteractiveEventsScene extends SceneWithHudini<Theme> {
    private button?: IconButton;
    private statusSquare?: Phaser.GameObjects.Rectangle;
    private statusText?: Phaser.GameObjects.Text;

    constructor() {
        super('interactive-events');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create status square
        this.statusSquare = this.add.rectangle(400, 200, 60, 60, 0x666666);
        
        // Create status text
        this.statusText = this.add.text(500, 200, 'Ready', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial'
        });

        // Create button
        this.button = new IconButton({
            scene: this,
            x: 400,
            y: 100,
            icon: 'play',
            size: 'xl',
            color: 'blue',
            onClick: () => {
                this.updateStatus('onClick', 0x00ff00);
            },
        });

        this.add.existing(this.button);

        // Use interactive API for advanced event handling
        // Wait for next frame to ensure button is fully initialized
        this.time.delayedCall(0, () => {
            if (this.button) {
                this.button.on('pointerover', () => {
                    this.updateStatus('pointerover', 0xffff00);
                });

                this.button.on('pointerout', () => {
                    this.updateStatus('pointerout', 0x666666);
                });

                this.button.on('pointerdown', () => {
                    this.updateStatus('pointerdown', 0xff0000);
                });

                this.button.on('pointerup', () => {
                    this.updateStatus('pointerup', 0x00ff00);
                });
            }
        });
    }

    private updateStatus(event: string, color: number): void {
        if (this.statusSquare) {
            this.statusSquare.setFillStyle(color);
        }
        if (this.statusText) {
            this.statusText.setText(event);
        }
    }
}
`,C={title:"Hudini/Components/Interactive Events",parameters:{docs:{description:{component:"Demonstrates the interactive API of IconButton and FlatIconButton components. The square below changes color and the text shows the current event state when interacting with the button."},source:{language:"ts",code:x}}}},v=m({});class S extends f{button;statusSquare;statusText;constructor(){super("interactive-events")}create(){const{pw:o}=this.hudini;this.cameras.main.setBackgroundColor(o.color.slate(900)),this.statusSquare=this.add.rectangle(400,200,60,60,6710886),this.statusText=this.add.text(500,200,"Ready",{fontSize:"16px",color:"#ffffff",fontFamily:"Arial"}),this.button=new c({scene:this,x:400,y:100,icon:"play",size:"xl",color:"blue",onClick:()=>{this.updateStatus("onClick",65280)}}),this.add.existing(this.button),this.button.interactive.on("pointerover",()=>{this.updateStatus("pointerover",16776960)}),this.button.interactive.on("pointerout",()=>{this.updateStatus("pointerout",6710886)}),this.button.interactive.on("pointerdown",()=>{this.updateStatus("pointerdown",16711680)}),this.button.interactive.on("pointerup",()=>{this.updateStatus("pointerup",65280)}),this.add.text(50,300,"Interactive Events Demo",{fontSize:"20px",color:"#ffffff",fontFamily:"Arial"}),this.add.text(50,330,"• Yellow: pointerover (hover)",{fontSize:"14px",color:"#ffff00",fontFamily:"Arial"}),this.add.text(50,350,"• Red: pointerdown (press)",{fontSize:"14px",color:"#ff0000",fontFamily:"Arial"}),this.add.text(50,370,"• Green: pointerup/onClick (release)",{fontSize:"14px",color:"#00ff00",fontFamily:"Arial"}),this.add.text(50,390,"• Gray: pointerout (leave)",{fontSize:"14px",color:"#666666",fontFamily:"Arial"}),this.add.text(50,420,"The button provides direct access to event methods:",{fontSize:"12px",color:"#cccccc",fontFamily:"Arial"}),this.add.text(50,440,"button.on(event, callback)",{fontSize:"12px",color:"#cccccc",fontFamily:"Arial"}),this.add.text(50,460,"button.off(event, callback)",{fontSize:"12px",color:"#cccccc",fontFamily:"Arial"}),this.add.text(50,480,"button.once(event, callback)",{fontSize:"12px",color:"#cccccc",fontFamily:"Arial"})}updateStatus(o,i){this.statusSquare&&this.statusSquare.setFillStyle(i),this.statusText&&this.statusText.setText(o)}}const y=async()=>{const t=window;t.__fontLoaded||(await s(),t.__fontLoaded=!0)},n={render:()=>{const t=document.getElementById(e)??document.createElement("div");return t.id=e,t},play:async()=>{u(),await y(),await l(3),d(e,{type:h.AUTO,width:800,height:600,backgroundColor:p.slate(900),parent:document.getElementById(e),scene:[S],plugins:{global:[{key:a,plugin:r,mapping:a,data:{theme:v}}]}})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    cleanGames();
    await ensureFontOnce();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.slate(900),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [InteractiveEventsScene],
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
  }
}`,...n.parameters?.docs?.source}}};const A=["InteractiveEventsExample"];export{n as InteractiveEventsExample,A as __namedExportsOrder,C as default};
