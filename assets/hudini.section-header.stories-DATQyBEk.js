import{a as g,H as x,S as r}from"./plugin-DsYJWDHU.js";import{c as R,n as f,a as w,C as S,P as p,g as u}from"./create-game-IT2NM2Nb.js";import{c as D}from"./theme-manager-BFQS-suy.js";import{S as b}from"./scene-with-hudini-EXJR7ZX3.js";import"./webfontloader-DxEgiKE1.js";import"./_commonjsHelpers-Cpj98o6Y.js";const a="hudini-section-header",P=["red","blue","green","yellow","purple","orange","pink","gray"],M=["400","500","600","700","800"],m=[...P.flatMap(t=>M.map(e=>`${t}-${e}`)),"white","black"],B=["none","sm","md","lg","xl","full"],A=["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"],F=["0","1","2","3","4","5","6","8","10","12","16","20"],Y=["primary","secondary","monospace","display"],N=`
import Phaser from 'phaser';
import {
    Color,
    createTheme,
    HUDINI_KEY,
    HudiniPlugin,
    SceneWithHudini,
    SectionHeader
} from 'hudini';

const theme = createTheme({
// ...
});
type Theme = typeof theme;

class PreviewScene extends SceneWithHudini<Theme> {
    constructor() {
        super('preview');
    }

    create(): void {
        const { pw } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(900));

        // Main panel header
        const mainHeader = new SectionHeader({
            scene: this,
            x: this.cameras.main.centerX,
            y: 100,
            text: 'Game Settings',
            fontSize: 'xl',
            backgroundColor: 'blue-600',
            textColor: 'white',
            borderRadius: 'lg',
            margin: '6',
        });
        this.add.existing(mainHeader);

        // Sub-section headers
        const sections = [
            { text: 'Audio', color: 'green-600' },
            { text: 'Graphics', color: 'purple-600' },
            { text: 'Controls', color: 'orange-600' }
        ];

        sections.forEach((section, index) => {
            const header = new SectionHeader({
                scene: this,
                x: 200 + (index * 200),
                y: 200,
                text: section.text,
                fontSize: 'lg',
                backgroundColor: section.color,
                textColor: 'white',
                borderRadius: 'md',
                margin: '4',
            });
            this.add.existing(header);
        });
    }
}
`,q={title:"Hudini/Components/SectionHeader",parameters:{docs:{description:{component:"Stylized section header component perfect for panels and menus. Features vertical shadow, text stroke, and auto-sizing based on content."},source:{language:"ts",code:N}}}},y=D({});class U extends b{header;constructor(){super("preview")}create(){const{pw:e}=this.hudini;this.cameras.main.setBackgroundColor(e.color.slate(400));const c=new r({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,text:"Section Title",fontSize:"xl",font:"display",backgroundColor:"blue-600",textColor:"white",strokeColor:"blue-800",borderRadius:"lg",margin:"6"});this.add.existing(c),this.header=c,this.events.on("props:update",i=>this.applyProps(i))}applyProps(e){this.header&&(this.header.setText(e.text),this.header.setFontSize(e.fontSize),this.header.setFont(e.font),this.header.setBackgroundColor(e.backgroundColor),this.header.setTextColor(e.textColor),this.header.setStrokeColor(e.strokeColor),this.header.setBorderRadius(e.borderRadius),this.header.setMargin(e.margin))}}const d={render:t=>{const e=document.getElementById(a)??document.createElement("div");e.id=a;const c=()=>{const i=u(a);if(!i)return;(i.scene.getScene("preview")??i.scene.getScene("preview")).events.emit("props:update",t)};return u(a)?c():u(a)?.events.once(p.Core.Events.READY,c),e},play:async()=>{R(),await f(3),w(a,{type:p.AUTO,width:800,height:600,backgroundColor:S.slate(500),parent:document.getElementById(a),scene:[U],plugins:{global:[{key:g,plugin:x,mapping:g,data:{theme:y}}]}})},args:{text:"Section Title",fontSize:"xl",font:"display",backgroundColor:"blue-600",textColor:"white",strokeColor:"blue-800",borderRadius:"lg",margin:"6"},argTypes:{text:{control:"text",description:"The text content of the section header"},fontSize:{control:"select",options:A,description:"Font size token or pixel value"},font:{control:"select",options:Y,description:"Font family token"},backgroundColor:{control:"select",options:m,description:'Background color token (e.g., "blue-600")'},textColor:{control:"select",options:m,description:"Text color token"},strokeColor:{control:"select",options:m,description:"Text stroke color token"},borderRadius:{control:"select",options:B,description:"Border radius token or pixel value"},margin:{control:"select",options:F,description:"Internal margin/padding token or pixel value"}}},l={render:()=>{const t="hudini-section-header-showcase",e=document.getElementById(t)??document.createElement("div");return e.id=t,e},play:async()=>{const t="hudini-section-header-showcase";class e extends b{constructor(){super("showcase")}create(){const{pw:i}=this.hudini;this.cameras.main.setBackgroundColor(i.color.slate(500)),this.add.text(this.cameras.main.centerX,40,"SectionHeader Showcase",{fontSize:"24px",color:"#ffffff",fontFamily:"Arial, sans-serif"}).setOrigin(.5),["base","lg","xl","2xl"].forEach((n,o)=>{const s=new r({scene:this,x:200+o*150,y:100,text:`Size ${n}`,fontSize:n,backgroundColor:"indigo-600",textColor:"white",borderRadius:"md",margin:"4"});this.add.existing(s)});const C=["blue-600","green-600","purple-600","red-600"],H=["Settings","Inventory","Skills","Combat"];C.forEach((n,o)=>{const s=new r({scene:this,x:200+o*150,y:180,text:H[o],fontSize:"lg",backgroundColor:n,textColor:"white",borderRadius:"lg",margin:"5"});this.add.existing(s)}),["none","sm","lg","full"].forEach((n,o)=>{const s=new r({scene:this,x:200+o*150,y:260,text:n==="full"?"Pill Style":`${n}`,fontSize:"base",backgroundColor:"gray-600",textColor:"white",borderRadius:n,margin:"4"});this.add.existing(s)}),["2","4","6","8"].forEach((n,o)=>{const s=new r({scene:this,x:200+o*150,y:340,text:`Margin ${n}`,fontSize:"base",backgroundColor:"teal-600",textColor:"white",borderRadius:"md",margin:n});this.add.existing(s)});const z=["primary","secondary","display","monospace"],v=["Primary","Secondary","Display","Monospace"];z.forEach((n,o)=>{const s=new r({scene:this,x:200+o*150,y:420,text:v[o],fontSize:"base",font:n,backgroundColor:"orange-600",textColor:"white",borderRadius:"md",margin:"4"});this.add.existing(s)});const h=500,T=new r({scene:this,x:150,y:h,text:"MAIN MENU",fontSize:"xl",font:"display",backgroundColor:"slate-700",textColor:"white",strokeColor:"slate-900",borderRadius:"lg",margin:"6"});this.add.existing(T);const E=new r({scene:this,x:400,y:h,text:"Options",fontSize:"lg",backgroundColor:"blue-500",textColor:"white",borderRadius:"md",margin:"4"});this.add.existing(E);const I=new r({scene:this,x:600,y:h,text:"🏆 Achievements",fontSize:"lg",backgroundColor:"yellow-600",textColor:"white",strokeColor:"yellow-800",borderRadius:"full",margin:"5"});this.add.existing(I)}}await f(3),w(t,{type:p.AUTO,width:800,height:600,backgroundColor:S.slate(500),parent:document.getElementById(t),scene:[e],plugins:{global:[{key:g,plugin:x,mapping:g,data:{theme:y}}]}})},parameters:{docs:{description:{story:"Showcase of different SectionHeader configurations showing various sizes, colors, border radiuses, margins, fonts, and real-world usage examples for panels and menus."}}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
        strokeColor: string;
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
    text: 'Section Title',
    fontSize: 'xl',
    font: 'display',
    backgroundColor: 'blue-600',
    textColor: 'white',
    strokeColor: 'blue-800',
    borderRadius: 'lg',
    margin: '6'
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the section header'
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
    strokeColor: {
      control: 'select',
      options: colorTokens,
      description: 'Text stroke color token'
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
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const showcaseId = 'hudini-section-header-showcase';
    const root = document.getElementById(showcaseId) ?? document.createElement('div');
    root.id = showcaseId;
    return root;
  },
  play: async (): Promise<void> => {
    const showcaseId = 'hudini-section-header-showcase';
    class ShowcaseScene extends SceneWithHudini<Theme> {
      constructor() {
        super('showcase');
      }
      create(): void {
        const {
          pw
        } = this.hudini;
        this.cameras.main.setBackgroundColor(pw.color.slate(500));

        // Title
        const title = this.add.text(this.cameras.main.centerX, 40, 'SectionHeader Showcase', {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        });
        title.setOrigin(0.5);

        // Different sizes
        const sizes: FontSizeKey[] = ['base', 'lg', 'xl', '2xl'];
        sizes.forEach((size, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + index * 150,
            y: 100,
            text: \`Size \${size}\`,
            fontSize: size,
            backgroundColor: 'indigo-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4'
          });
          this.add.existing(header);
        });

        // Different colors - Panel headers
        const panelColors = ['blue-600', 'green-600', 'purple-600', 'red-600'];
        const panelNames = ['Settings', 'Inventory', 'Skills', 'Combat'];
        panelColors.forEach((color, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + index * 150,
            y: 180,
            text: panelNames[index] as string,
            fontSize: 'lg',
            backgroundColor: color,
            textColor: 'white',
            borderRadius: 'lg',
            margin: '5'
          });
          this.add.existing(header);
        });

        // Different border radius
        const radiuses: RadiusKey[] = ['none', 'sm', 'lg', 'full'];
        radiuses.forEach((radius, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + index * 150,
            y: 260,
            text: radius === 'full' ? 'Pill Style' : \`\${radius}\`,
            fontSize: 'base',
            backgroundColor: 'gray-600',
            textColor: 'white',
            borderRadius: radius,
            margin: '4'
          });
          this.add.existing(header);
        });

        // Different margins - showing size adaptation
        const margins: SpacingKey[] = ['2', '4', '6', '8'];
        margins.forEach((margin, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + index * 150,
            y: 340,
            text: \`Margin \${margin}\`,
            fontSize: 'base',
            backgroundColor: 'teal-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: margin
          });
          this.add.existing(header);
        });

        // Different fonts
        const fonts = ['primary', 'secondary', 'display', 'monospace'] as const;
        const fontTexts = ['Primary', 'Secondary', 'Display', 'Monospace'];
        fonts.forEach((font, index) => {
          const header = new SectionHeader({
            scene: this,
            x: 200 + index * 150,
            y: 420,
            text: fontTexts[index] as string,
            fontSize: 'base',
            font: font,
            backgroundColor: 'orange-600',
            textColor: 'white',
            borderRadius: 'md',
            margin: '4'
          });
          this.add.existing(header);
        });

        // Usage examples in panels
        const usageY = 500;

        // Main menu header
        const mainMenuHeader = new SectionHeader({
          scene: this,
          x: 150,
          y: usageY,
          text: 'MAIN MENU',
          fontSize: 'xl',
          font: 'display',
          backgroundColor: 'slate-700',
          textColor: 'white',
          strokeColor: 'slate-900',
          borderRadius: 'lg',
          margin: '6'
        });
        this.add.existing(mainMenuHeader);

        // Sub-menu headers
        const subMenuHeader = new SectionHeader({
          scene: this,
          x: 400,
          y: usageY,
          text: 'Options',
          fontSize: 'lg',
          backgroundColor: 'blue-500',
          textColor: 'white',
          borderRadius: 'md',
          margin: '4'
        });
        this.add.existing(subMenuHeader);

        // Achievement header
        const achievementHeader = new SectionHeader({
          scene: this,
          x: 600,
          y: usageY,
          text: '🏆 Achievements',
          fontSize: 'lg',
          backgroundColor: 'yellow-600',
          textColor: 'white',
          strokeColor: 'yellow-800',
          borderRadius: 'full',
          margin: '5'
        });
        this.add.existing(achievementHeader);
      }
    }
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
        story: 'Showcase of different SectionHeader configurations showing various sizes, colors, border radiuses, margins, fonts, and real-world usage examples for panels and menus.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const J=["SectionHeaderExample","SectionHeaderShowcase"];export{d as SectionHeaderExample,l as SectionHeaderShowcase,J as __namedExportsOrder,q as default};
