import{a as m,H as x,b as t,T as U,c as M}from"./plugin-wWFa2mau.js";import{c as b,n as C,a as y,C as f,P as u,g as d}from"./create-game-DQQ4oOcD.js";import{c as O}from"./theme-manager-C-wrNafm.js";import{S as k}from"./scene-with-hudini-CSj1oFDw.js";import"./webfontloader-BMkCA58-.js";import"./_commonjsHelpers-Cpj98o6Y.js";const o="hudini-card",K=["red","blue","green","yellow","purple","orange","pink","gray"],_=["400","500","600","700","800"],w=[...K.flatMap(n=>_.map(e=>`${n}-${e}`)),"white","black"],F=["none","sm","md","lg","xl","full"],L=["0","1","2","3","4","5","6","8","10","12","16","20"],N=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    Card,
    TextButton
} from 'hudini';

const theme = createTheme({
    // Custom theme configuration
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Create a button to put inside the card
        const button = new TextButton({
            scene: this,
            x: 0,
            y: 0,
            text: 'Click Me!',
            backgroundColor: 'blue-500',
            textColor: 'white',
            borderRadius: 'md',
        });

        // Create a card containing the button
        const card = new Card({
            scene: this,
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            backgroundColor: 'white',
            borderRadius: 'lg',
            margin: '6',
            child: button,
        });
        this.add.existing(card);
    }
}
`,Z={title:"Hudini/components/Card",parameters:{docs:{description:{component:`A flexible card component that adapts to its child content size, using phaser-wind tokens for styling.

${N}

## Features

- 🎯 **Adaptable**: Automatically adjusts to child size
- 🎨 **Stylable**: Uses phaser-wind tokens for colors, border radius, and margins
- 🔄 **Flexible**: Supports any Phaser GameObject as child
- ⚡ **Performance**: Uses Graphics directly (no textures)

## Props

- \`backgroundColor\`: Background color token or CSS color string
- \`borderRadius\`: Border radius token or pixel value
- \`margin\`: Spacing token or pixel value for internal padding
- \`child\`: Any Phaser GameObject to be contained within the card

## Usage Examples

- **Text Cards**: Simple text content with background
- **Button Cards**: Interactive buttons with card styling
- **Progress Cards**: Progress bars with card containers
- **Header Cards**: Section headers with card backgrounds
- **Custom Cards**: Any combination of components`}}},argTypes:{backgroundColor:{control:"select",options:w,description:'Background color token (e.g., "blue-600")'},borderRadius:{control:"select",options:F,description:"Border radius token or pixel value"},margin:{control:"select",options:L,description:"Margin/spacing token or pixel value"},textColor:{control:"select",options:w,description:"Text color token or CSS color string"}}};class $ extends k{card;emptyCard;text;constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.text=this.add.text(0,0,"Card with child",{color:this.pw.color.rgb("black"),align:"center",fontSize:"18px"}),this.card=new t({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,backgroundColor:"white",borderRadius:"lg",margin:"6",child:this.text}),this.add.existing(this.card),this.emptyCard=new t({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY+130,backgroundColor:"green-500",borderRadius:"lg",margin:"6",width:200,height:100}),this.add.existing(this.emptyCard),this.add.text(this.cameras.main.centerX,this.cameras.main.centerY+200,"Example of empty card",{color:this.pw.color.rgb("white"),align:"center",fontSize:"16px"}).setOrigin(.5,.5),this.events.on("props:update",s=>this.applyProps(s))}applyProps(e){this.card&&(this.card.setBackgroundColor(e.backgroundColor).setBorderRadius(e.borderRadius).setMargin(e.margin),this.text&&this.text.setColor(this.pw.color.rgb(e.textColor)))}}class X extends k{constructor(){super("showcase")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(900)),this.add.text(this.cameras.main.centerX,50,"Card Component Showcase",{color:e.color.slate(200),align:"center",fontSize:"32px"}).setOrigin(.5,.5),["red-500","blue-500","green-500","purple-500","orange-500"].forEach((r,a)=>{const i=this.add.text(0,0,`Card ${a+1}`,{color:"white",align:"center",fontSize:"18px"}),c=new t({scene:this,x:150+a*120,y:120,backgroundColor:r,borderRadius:"md",margin:"4",child:i});this.add.existing(c)}),["none","sm","md","lg","xl"].forEach((r,a)=>{const i=this.add.text(0,0,`Radius ${r}`,{color:"white",align:"center",fontSize:"16px"}),c=new t({scene:this,x:150+a*130,y:200,backgroundColor:"teal-600",borderRadius:r,margin:"4",child:i});this.add.existing(c)}),["2","4","6","8"].forEach((r,a)=>{const i=this.add.text(0,0,`Margin ${r}`,{color:"white",align:"center",fontSize:"16px"}),c=new t({scene:this,x:150+a*150,y:280,backgroundColor:"indigo-600",borderRadius:"md",margin:r,child:i});this.add.existing(c)});const v=new U({scene:this,x:0,y:0,text:"Button Card",backgroundColor:"emerald-500",textColor:"white",borderRadius:"md",margin:"4"}),E=new t({scene:this,x:150,y:360,backgroundColor:"emerald-100",borderRadius:"lg",margin:"6",child:v});this.add.existing(E);const T=new M({scene:this,x:0,y:0,text:"Header Card",fontSize:"lg",backgroundColor:"purple-600",textColor:"white",borderRadius:"md",margin:"4"}),R=new t({scene:this,x:350,y:360,backgroundColor:"purple-50",borderRadius:"lg",margin:"6",child:T});this.add.existing(R);const P=this.add.text(0,0,`Large Content
Multiple Lines
of Text`,{color:"white",align:"center",fontSize:"20px"}),B=new t({scene:this,x:600,y:390,backgroundColor:"orange-600",borderRadius:"xl",margin:"8",child:P});this.add.existing(B);const p=510,H=this.add.text(0,0,`ℹ️ Information
This is an info card
with multiple lines`,{color:"white",align:"center",fontSize:"16px"}),D=new t({scene:this,x:150,y:p,backgroundColor:"blue-600",borderRadius:"lg",margin:"6",child:H});this.add.existing(D);const z=this.add.text(0,0,`✅ Success
Operation completed
successfully!`,{color:"white",align:"center",fontSize:"16px"}),G=new t({scene:this,x:395,y:p,backgroundColor:"green-600",borderRadius:"lg",margin:"6",child:z});this.add.existing(G);const Y=this.add.text(0,0,`⚠️ Warning
Please review your
input carefully`,{color:"white",align:"center",fontSize:"16px"}),A=new t({scene:this,x:630,y:p,backgroundColor:"yellow-600",borderRadius:"lg",margin:"6",child:Y});this.add.existing(A)}}const S=O({}),h={render:n=>{const e=document.getElementById(o)??document.createElement("div");e.id=o;const s=()=>{const l=d(o);if(!l)return;(l.scene.getScene("preview")??l.scene.getScene("preview")).events.emit("props:update",n)};return d(o)?s():d(o)?.events.once(u.Core.Events.READY,s),e},play:async()=>{b(),await C(3),y(o,{type:u.AUTO,width:800,height:600,backgroundColor:f.slate(500),parent:document.getElementById(o),scene:[$],plugins:{global:[{key:m,plugin:x,mapping:m,data:{theme:S}}]}})},args:{backgroundColor:"white",borderRadius:"lg",margin:"6",textColor:"black"},parameters:{docs:{description:{story:"Interactive Card component with customizable background color, border radius, and margin. The card automatically adapts to its child content size."}}}},g={render:()=>{const n="hudini-card-showcase",e=document.getElementById(n)??document.createElement("div");return e.id=n,d(n)||d(n)?.events.once(u.Core.Events.READY,()=>{}),e},play:async()=>{const n="hudini-card-showcase";b(),await C(3),y(n,{type:u.AUTO,width:800,height:600,backgroundColor:f.slate(500),parent:document.getElementById(n),scene:[X],plugins:{global:[{key:m,plugin:x,mapping:m,data:{theme:S}}]}})},parameters:{docs:{description:{story:"Showcase of different Card configurations showing various colors, border radiuses, margins, and real-world usage examples with different child components."}}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = (game.scene.getScene('preview') ?? game.scene.getScene('preview')) as PreviewScene;
      scene.events.emit('props:update', args as {
        backgroundColor: string;
        borderRadius: RadiusKey | number;
        margin: SpacingKey | number;
        textColor: ColorToken;
      });
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
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.slate(500),
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
    backgroundColor: 'white',
    borderRadius: 'lg',
    margin: '6',
    textColor: 'black'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive Card component with customizable background color, border radius, and margin. The card automatically adapts to its child content size.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const showcaseId = 'hudini-card-showcase';
    const root = document.getElementById(showcaseId) ?? document.createElement('div');
    root.id = showcaseId;
    if (!getGame(showcaseId)) {
      getGame(showcaseId)?.events.once(Phaser.Core.Events.READY, () => {
        // Showcase is ready
      });
    }
    return root;
  },
  play: async (): Promise<void> => {
    const showcaseId = 'hudini-card-showcase';
    cleanGames();
    await nextFrames(3);
    createGame(showcaseId, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.slate(500),
      parent: document.getElementById(showcaseId) as HTMLElement,
      scene: [ShowcaseScene],
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
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different Card configurations showing various colors, border radiuses, margins, and real-world usage examples with different child components.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};const ee=["CardExample","CardShowcase"];export{h as CardExample,g as CardShowcase,ee as __namedExportsOrder,Z as default};
