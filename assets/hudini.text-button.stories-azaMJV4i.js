import{a as u,H as h,T as c}from"./plugin-hGH1kwtW.js";import{c as C,n as x,a as b,C as f,P as m,g}from"./create-game-IT2NM2Nb.js";import{c as S}from"./theme-manager-BFQS-suy.js";import{S as k}from"./scene-with-hudini-EXJR7ZX3.js";import"./webfontloader-DxEgiKE1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r="hudini-text-button",T=["red","blue","green","yellow","purple","orange","pink","gray"],z=["400","500","600","700"],p=[...T.flatMap(t=>z.map(n=>`${t}-${n}`)),"white","black"],E=["none","sm","md","lg","xl","full"],I=["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"],B=["0","1","2","3","4","5","6","8","10","12","16","20"],v=["primary","secondary","monospace","display"],R=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    TextButton
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    private buttons: TextButton[] = [];
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        const colors: ColorKey[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

        let y = 90;
        for (let i = 0; i < colors.length; i++) {
            const color: ColorKey = colors[i] as ColorKey;

            const btn = new TextButton({
                scene: this,
                x: 100 + (i * 120),
                y: y,
                text: 'Click Me!',
                fontSize: 'lg',
                backgroundColor: \`\${color}-600\`,
                textColor: 'white',
                borderRadius: 'md',
                margin: '4',
                onClick: (): void => {
                    console.log('clicked:', color);
                },
            });
            this.add.existing(btn);
            this.buttons.push(btn);
        }
    }
}
`,O={title:"Hudini/Components/TextButton",parameters:{docs:{description:{component:"Text button with auto-sizing and full customization support. The button automatically adjusts its size based on the text content plus margin."},source:{language:"ts",code:R}}}},w=S({});class H extends k{button;constructor(){super("preview")}create(){const{pw:n}=this.hudini;this.cameras.main.setBackgroundColor(n.color.slate(900));const a=new c({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,text:"Hello World!",fontSize:"lg",font:"primary",backgroundColor:"blue-600",textColor:"white",borderRadius:"md",margin:"4",onClick:()=>{console.log("TextButton clicked!")}});this.add.existing(a),this.button=a,this.events.on("props:update",i=>this.applyProps(i))}applyProps(n){this.button&&(this.button.setText(n.text),this.button.setFontSize(n.fontSize),this.button.setFont(n.font),this.button.setBackgroundColor(n.backgroundColor),this.button.setTextColor(n.textColor),this.button.setBorderRadius(n.borderRadius),this.button.setMargin(n.margin))}}const l={render:t=>{const n=document.getElementById(r)??document.createElement("div");n.id=r;const a=()=>{const i=g(r);if(!i)return;(i.scene.getScene("preview")??i.scene.getScene("preview")).events.emit("props:update",t)};return g(r)?a():g(r)?.events.once(m.Core.Events.READY,a),n},play:async()=>{C(),await x(3),b(r,{type:m.AUTO,width:800,height:600,backgroundColor:f.slate(900),parent:document.getElementById(r),scene:[H],plugins:{global:[{key:u,plugin:h,mapping:u,data:{theme:w}}]}})},args:{text:"Hello World!",fontSize:"lg",font:"primary",backgroundColor:"blue-600",textColor:"white",borderRadius:"md",margin:"4"},argTypes:{text:{control:"text",description:"The text content of the button"},fontSize:{control:"select",options:I,description:"Font size token or pixel value"},font:{control:"select",options:v,description:"Font family token"},backgroundColor:{control:"select",options:p,description:'Background color token (e.g., "blue-600")'},textColor:{control:"select",options:p,description:"Text color token"},borderRadius:{control:"select",options:E,description:"Border radius token or pixel value"},margin:{control:"select",options:B,description:"Internal margin/padding token or pixel value"}}},d={render:()=>{const t="hudini-text-button-showcase",n=document.getElementById(t)??document.createElement("div");return n.id=t,n},play:async()=>{const t="hudini-text-button-showcase";class n extends k{constructor(){super("showcase")}create(){const{pw:i}=this.hudini;this.cameras.main.setBackgroundColor(i.color.slate(900)),this.add.text(this.cameras.main.centerX,50,"TextButton Showcase",{fontSize:"24px",color:"#ffffff",fontFamily:"Arial, sans-serif"}).setOrigin(.5),["sm","base","lg","xl"].forEach((e,o)=>{const s=new c({scene:this,x:150+o*150,y:150,text:`Size ${e}`,fontSize:e,backgroundColor:"blue-600",textColor:"white",borderRadius:"md",margin:"3",onClick:()=>console.log(`Size ${e} clicked`)});this.add.existing(s)}),["red-500","green-500","purple-500","orange-500"].forEach((e,o)=>{const s=new c({scene:this,x:150+o*150,y:230,text:e.split("-")[0].toUpperCase(),fontSize:"base",backgroundColor:e,textColor:"white",borderRadius:"lg",margin:"4",onClick:()=>console.log(`${e} clicked`)});this.add.existing(s)}),["none","sm","lg","full"].forEach((e,o)=>{const s=new c({scene:this,x:150+o*150,y:310,text:e==="full"?"Fully Rounded":`${e}`,fontSize:"base",backgroundColor:"gray-600",textColor:"white",borderRadius:e,margin:"4",onClick:()=>console.log(`Radius ${e} clicked`)});this.add.existing(s)}),["2","4","6","8"].forEach((e,o)=>{const s=new c({scene:this,x:150+o*150,y:390,text:`Margin ${e}`,fontSize:"base",backgroundColor:"indigo-600",textColor:"white",borderRadius:"md",margin:e,onClick:()=>console.log(`Margin ${e} clicked`)});this.add.existing(s)}),["primary","secondary","monospace","display"].forEach((e,o)=>{const s=new c({scene:this,x:150+o*150,y:470,text:e,fontSize:"base",font:e,backgroundColor:"teal-600",textColor:"white",borderRadius:"md",margin:"4",onClick:()=>console.log(`Font ${e} clicked`)});this.add.existing(s)})}}await x(3),b(t,{type:m.AUTO,width:800,height:600,backgroundColor:f.slate(900),parent:document.getElementById(t),scene:[n],plugins:{global:[{key:u,plugin:h,mapping:u,data:{theme:w}}]}})},parameters:{docs:{description:{story:"Showcase of different TextButton configurations showing various sizes, colors, border radiuses, margins, and fonts."}}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: (args: Args): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    const apply = (): void => {
      const game = getGame(ID);
      if (!game) return;
      const scene = (game.scene.getScene('preview') ?? game.scene.getScene('preview')) as PreviewScene;
      scene.events.emit('props:update', args as {
        text: string;
        fontSize: number | string;
        font: string;
        backgroundColor: string;
        textColor: string;
        borderRadius: string | number;
        margin: string | number;
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
    text: 'Hello World!',
    fontSize: 'lg',
    font: 'primary',
    backgroundColor: 'blue-600',
    textColor: 'white',
    borderRadius: 'md',
    margin: '4'
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the button'
    },
    fontSize: {
      control: 'select',
      options: sizeTokens as unknown as string[],
      description: 'Font size token or pixel value'
    },
    font: {
      control: 'select',
      options: fontTokens as unknown as string[],
      description: 'Font family token'
    },
    backgroundColor: {
      control: 'select',
      options: colorTokens,
      description: 'Background color token (e.g., "blue-600")'
    },
    textColor: {
      control: 'select',
      options: colorTokens,
      description: 'Text color token'
    },
    borderRadius: {
      control: 'select',
      options: radiusTokens as unknown as string[],
      description: 'Border radius token or pixel value'
    },
    margin: {
      control: 'select',
      options: spacingTokens as unknown as string[],
      description: 'Internal margin/padding token or pixel value'
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const showcaseId = 'hudini-text-button-showcase';
    const root = document.getElementById(showcaseId) ?? document.createElement('div');
    root.id = showcaseId;
    return root;
  },
  play: async (): Promise<void> => {
    const showcaseId = 'hudini-text-button-showcase';
    class ShowcaseScene extends SceneWithHudini<Theme> {
      constructor() {
        super('showcase');
      }
      create(): void {
        const {
          pw
        } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Title
        const title = this.add.text(this.cameras.main.centerX, 50, 'TextButton Showcase', {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        });
        title.setOrigin(0.5);

        // Different sizes
        const sizes: FontSizeKey[] = ['sm', 'base', 'lg', 'xl'];
        sizes.forEach((size, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + index * 150,
            y: 150,
            text: \`Size \${size}\`,
            fontSize: size,
            backgroundColor: 'blue-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '3',
            onClick: () => console.log(\`Size \${size} clicked\`)
          });
          this.add.existing(btn);
        });

        // Different colors
        const colors = ['red-500', 'green-500', 'purple-500', 'orange-500'];
        colors.forEach((color, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + index * 150,
            y: 230,
            text: color.split('-')[0].toUpperCase(),
            fontSize: 'base',
            backgroundColor: color,
            textColor: 'white',
            borderRadius: 'lg',
            margin: '4',
            onClick: () => console.log(\`\${color} clicked\`)
          });
          this.add.existing(btn);
        });

        // Different border radius
        const radiuses: RadiusKey[] = ['none', 'sm', 'lg', 'full'];
        radiuses.forEach((radius, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + index * 150,
            y: 310,
            text: radius === 'full' ? 'Fully Rounded' : \`\${radius}\`,
            fontSize: 'base',
            backgroundColor: 'gray-600',
            textColor: 'white',
            borderRadius: radius,
            margin: '4',
            onClick: () => console.log(\`Radius \${radius} clicked\`)
          });
          this.add.existing(btn);
        });

        // Different margins
        const margins: SpacingKey[] = ['2', '4', '6', '8'];
        margins.forEach((margin, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + index * 150,
            y: 390,
            text: \`Margin \${margin}\`,
            fontSize: 'base',
            backgroundColor: 'indigo-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: margin,
            onClick: () => console.log(\`Margin \${margin} clicked\`)
          });
          this.add.existing(btn);
        });

        // Different fonts
        const fonts = ['primary', 'secondary', 'monospace', 'display'] as const;
        fonts.forEach((font, index) => {
          const btn = new TextButton({
            scene: this,
            x: 150 + index * 150,
            y: 470,
            text: font,
            fontSize: 'base',
            font: font,
            backgroundColor: 'teal-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4',
            onClick: () => console.log(\`Font \${font} clicked\`)
          });
          this.add.existing(btn);
        });
      }
    }
    await nextFrames(3);
    createGame(showcaseId, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.slate(900),
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
        story: 'Showcase of different TextButton configurations showing various sizes, colors, border radiuses, margins, and fonts.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const W=["TextButtonExample","TextButtonShowcase"];export{l as TextButtonExample,d as TextButtonShowcase,W as __namedExportsOrder,O as default};
