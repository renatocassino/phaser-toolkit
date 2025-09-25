import{c as P,n as y,a as S,C as g,P as f,b as p,e as E,S as T}from"./create-game-ukjiax-1.js";import{c as I}from"./theme-manager-EhPXZ0nu.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r="phaser-wind-button",_={title:"PhaserWind/Button",tags:["autodocs"],parameters:{docs:{description:{component:"Example of button using PhaserWind tokens."},source:{language:"ts",code:`import Phaser from 'phaser';
import {
  Color,
  ColorToken,
  createTheme,
  PHASER_WIND_KEY,
  PhaserWindPlugin,
  SceneWithPhaserWind,
} from 'phaser-wind';
 
const theme = createTheme({});
type Theme = typeof theme;

class PreviewScene extends SceneWithPhaserWind<Theme> {
  constructor() {
    super('preview');
  }

  create(): void {
    const { pw } = this;
    this.cameras.main.setBackgroundColor(Color.slate(900));

    const createButton = (x: number, y: number, label: string, bgToken: ColorToken): Phaser.GameObjects.Container => {
      const text = this.add.text(0, 0, label, {
        fontSize: pw.fontSize.css('lg'),
        color: pw.color.rgb('white'),
      });

      const padX = pw.spacing.px('6');
      const padY = pw.spacing.px('3');
      const width = text.width + padX * 2;
      const height = text.height + padY * 2;

      const bg = this.add.rectangle(0, 0, width, height, pw.color.hex(bgToken));
      bg.setOrigin(0.5);

      const container = this.add.container(x, y, [bg, text]);
      text.setPosition(-text.width / 2, -text.height / 2);
      container.setSize(width, height);

      bg.setInteractive();

      const highColor = bgToken.replace('-500', '-600') as ColorToken;
      const lowColor = bgToken.replace('-500', '-700') as ColorToken;

      bg.on('pointerover', () => (bg.fillColor = pw.color.hex(highColor)));
      bg.on('pointerout', () => (bg.fillColor = pw.color.hex(bgToken as ColorToken)));
      bg.on('pointerdown', () => (bg.fillColor = pw.color.hex(lowColor)));
      bg.on('pointerup', () => (bg.fillColor = pw.color.hex(highColor)));

      return container;
    };

    createButton(300, 120, 'Primary', 'green-500');
    createButton(300, 200, 'Secondary', 'blue-500');
    createButton(300, 280, 'Danger', 'red-500');
  }
}
`}}}},W=I({});class k extends T{constructor(){super("preview")}create(){const{pw:t}=this;this.cameras.main.setBackgroundColor(g.slate(900));const i=(m,u,w,n)=>{const o=this.add.text(0,0,w,{fontSize:t.fontSize.css("lg"),color:t.color.rgb("white")}),x=t.spacing.px("6"),b=t.spacing.px("3"),c=o.width+x*2,l=o.height+b*2,e=this.add.rectangle(0,0,c,l,t.color.hex(n));e.setOrigin(.5);const h=this.add.container(m,u,[e,o]);o.setPosition(-o.width/2,-o.height/2),h.setSize(c,l),e.setInteractive();const d=n.replace("-500","-600"),C=n.replace("-500","-700");return e.on("pointerover",()=>e.fillColor=t.color.hex(d)),e.on("pointerout",()=>e.fillColor=t.color.hex(n)),e.on("pointerdown",()=>e.fillColor=t.color.hex(C)),e.on("pointerup",()=>e.fillColor=t.color.hex(d)),h};i(300,120,"Primary","green-500"),i(300,200,"Secondary","blue-500"),i(300,280,"Danger","red-500")}}const a={render:()=>{const s=document.getElementById(r)??document.createElement("div");return s.id=r,s},play:async()=>{await P(),await y(3),S(r,{type:f.AUTO,width:600,height:400,backgroundColor:g.slate(900),parent:document.getElementById(r),scene:[k],plugins:{global:[{key:p,plugin:E,mapping:p,data:{theme:W}}]}})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = document.getElementById(ID) ?? document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
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
          key: PHASER_WIND_KEY,
          plugin: PhaserWindPlugin,
          mapping: PHASER_WIND_KEY,
          data: {
            theme
          }
        }]
      }
    });
  }
}`,...a.parameters?.docs?.source}}};const Y=["Basic"];export{a as Basic,Y as __namedExportsOrder,_ as default};
