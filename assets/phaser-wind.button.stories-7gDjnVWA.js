import{P as p,b as d,c as _,C as g,a as f}from"./scene-with-phaser-wind-CFjA4exm.js";import{c as P}from"./theme-manager-BXc8N_UD.js";import{c as y}from"./container-TfoZRbNG.js";import"./_commonjsHelpers-Cpj98o6Y.js";const E={title:"PhaserWind/Button",tags:["autodocs"],parameters:{docs:{description:{component:"Example of button using PhaserWind tokens."},source:{language:"ts",code:`import Phaser from 'phaser';
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
`}}}},S=P({});class G extends f{constructor(){super("preview")}create(){const{pw:e}=this;this.cameras.main.setBackgroundColor(g.slate(900));const s=(m,u,w,n)=>{const r=this.add.text(0,0,w,{fontSize:e.fontSize.css("lg"),color:e.color.rgb("white")}),x=e.spacing.px("6"),C=e.spacing.px("3"),i=r.width+x*2,c=r.height+C*2,o=this.add.rectangle(0,0,i,c,e.color.hex(n));o.setOrigin(.5);const h=this.add.container(m,u,[o,r]);r.setPosition(-r.width/2,-r.height/2),h.setSize(i,c),o.setInteractive();const l=n.replace("-500","-600"),b=n.replace("-500","-700");return o.on("pointerover",()=>o.fillColor=e.color.hex(l)),o.on("pointerout",()=>o.fillColor=e.color.hex(n)),o.on("pointerdown",()=>o.fillColor=e.color.hex(b)),o.on("pointerup",()=>o.fillColor=e.color.hex(l)),h};s(300,120,"Primary","green-500"),s(300,200,"Secondary","blue-500"),s(300,280,"Danger","red-500")}}const k=t=>{const e=window;return e.__phaserGame||(e.__phaserGame=new p.Game({type:p.AUTO,width:600,height:400,backgroundColor:g.slate(900),parent:t,scene:[G],plugins:{global:[{key:d,plugin:_,mapping:d,data:{theme:S}}]}})),e.__phaserGame},a={render:()=>{const t=y();return(async()=>k(t))(),t.destroy=()=>{const e=window;e.__phaserGame&&(e.__phaserGame.destroy(!0),e.__phaserGame=void 0)},t}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    const root = createContainer();
    (async (): Promise<void> => {
      ensureGameOnce(root);
    })();

    // @ts-expect-error Storybook chama no unmount
    root.destroy = (): void => {
      const w = window as unknown as Window & {
        __phaserGame?: Phaser.Game;
      };
      if (w.__phaserGame) {
        w.__phaserGame.destroy(true);
        w.__phaserGame = undefined as unknown as Phaser.Game;
      }
    };
    return root;
  }
}`,...a.parameters?.docs?.source}}};const O=["Basic"];export{a as Basic,O as __namedExportsOrder,E as default};
