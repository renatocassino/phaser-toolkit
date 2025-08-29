import{H as h,a as p,T as g}from"./plugin-HFtBARcL.js";import{p as f,c as S,n as C,a as E,C as O,P,d as V}from"./create-game-Dqgfp28j.js";import{S as x}from"./scene-with-hudini-DCgcD6-P.js";import{b as d}from"./with-persistent-state-Pci6dusG.js";import"./webfontloader-VUTCp1vF.js";import"./_commonjsHelpers-Cpj98o6Y.js";const u="soundStudio";class y extends f.Plugins.BasePlugin{channelVolumes={};soundList;channels;storage;gameName;sounds={};constructor(e){super(e),this.soundList={},this.channels=[],this.storage="local"}init({soundList:e,channels:t,storage:n,gameName:s}){this.soundList=e,this.channels=t,this.storage=n,this.gameName=s,this.channels.forEach(o=>{this.channelVolumes[o]=1})}loadAll(e){for(const[t,n]of Object.entries(this.soundList))n.preload!==!1&&(e.load.audio(t,n.path),this.sounds[t]=e.sound.add(t,{volume:this.channelVolumes[n.channel]??1,loop:n.loop??!1}));this.loadChannelVolumes(e)}loadByChannel(e,t){Object.entries(this.soundList).filter(n=>n[1].channel===t).forEach(([n,s])=>{e.load.audio(n,s.path)}),this.loadChannelVolumes(e)}loadBySoundKey(e,t){e.cache.audio.has(t)||e.load.audio(t,this.soundList[t]?.path)}play(e,t){if(!e.cache.audio.has(t)){this.lazyLoadPlay(e,t);return}const n=this.soundList[t];if(!n)return;const s=this.channelVolumes[n.channel]??1;e.sound.play(t,{volume:s})}playOnce(e,t){e.sound.get(t)?.isPlaying||this.play(e,t)}lazyLoadPlay(e,t){const n=this.soundList[t]?.path;n&&(e.load.audio(t,n),e.load.once(`filecomplete-audio-${t}`,()=>{this.sounds[t]=e.sound.add(t,{volume:this.channelVolumes[this.soundList[t].channel]??1,loop:this.soundList[t].loop??!1}),e.sound.play(t)}))}setChannelVolume(e,t,n){(n<0||n>1)&&(n=Math.max(0,Math.min(1,n)),console.warn(`Volume must be between 0 and 1. Setting volume to ${n} instead in channel ${t}.`)),this.channelVolumes[t]=n,Object.entries(this.soundList).filter(s=>s[1].channel===t).forEach(([s])=>{const o=this.sounds[s]??e.sound.get(s);o&&"setVolume"in o&&o.setVolume(n)}),this.saveChannelVolumes(e)}getChannelVolume(e){return this.channelVolumes[e]||1}muteChannel(e,t){this.setChannelVolume(e,t,0)}unmuteChannel(e,t){this.setChannelVolume(e,t,1)}getAllChannels(){return this.channels}persistNameKey(){return this.gameName?`phaser-sound-studio-volumes:${this.gameName}`:"phaser-sound-studio-volumes"}saveChannelVolumes(e){d(e,this.persistNameKey(),this.channelVolumes,void 0,this.storage).set(this.channelVolumes)}loadChannelVolumes(e){const t=d(e,this.persistNameKey(),this.channelVolumes,void 0,this.storage);this.channelVolumes=t.get()}}const c=(a,e=u)=>a.plugins.get(e),l="phaser-sound-studio-example",D=`
import { Column } from 'hudini';

const column = new Column({
    scene: this,
    x: 400,
    y: 300,
    gap: 16,
    align: 'center',
    children: [
        this.add.text(0, 0, 'Center Aligned', { fontSize: '24px' }),
        this.add.text(0, 0, 'Multiple', { fontSize: '20px' }),
        this.add.text(0, 0, 'Text Items', { fontSize: '20px' }),
        this.add.rectangle(0, 0, 100, 120, 0xff0000),
        this.add.rectangle(0, 0, 120, 100, 0x0000ff),
        this.add.rectangle(0, 0, 100, 80, 0x00ff00),
    ]
});

// Other methods:
// column.addChild(gameObject);
// column.addChildren([gameObject1, gameObject2]);
// column.setGap(24);
// column.setAlign('left');
`,r={MOUSE_HOVER:"mouse-hover",MOUSE_CLICK:"mouse-click"},m={HUD:"hud"},L={[r.MOUSE_HOVER]:{channel:m.HUD,preload:!0,path:"/sounds/ui-pop.m4a",loop:!1},[r.MOUSE_CLICK]:{channel:m.HUD,preload:!0,path:"/sounds/click.mp3",loop:!1}};class U extends x{constructor(){super("preview")}preload(){c(this).loadAll(this)}create(){this.cameras.main.setBackgroundColor(this.pw.color.rgb("slate-900"));const e=new g({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,backgroundColor:"blue-500",textColor:"white",text:"Click me",onClick:()=>{c(this).play(this,r.MOUSE_CLICK)}});this.add.existing(e)}}const K={title:"Phaser Sound Studio/Components/Play Sound",parameters:{docs:{description:{component:"Column is a layout container that stacks children vertically with configurable gap and alignment."}}}},i={render:()=>{const a=document.createElement("div");return a.id=l,a},play:async()=>{await S(),await C(3),E(l,{type:P.AUTO,width:800,height:600,backgroundColor:O.rgb("slate-900"),parent:document.getElementById(l),scene:[U],plugins:{global:[{key:h,plugin:p,mapping:h,start:!0,data:{theme:V}},{key:u,plugin:y,mapping:u,start:!0,data:{soundList:L,channels:["hud"]}}]}})}};i.parameters={docs:{autoplay:!0,story:{inline:!1},source:{code:D}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const root = document.createElement('div');
    root.id = ID;
    return root;
  },
  play: async (): Promise<void> => {
    await cleanGames();
    await nextFrames(3);
    createGame(ID, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: Color.rgb('slate-900'),
      parent: document.getElementById(ID) as HTMLElement,
      scene: [PreviewScene],
      plugins: {
        global: [{
          key: HUDINI_KEY,
          plugin: HudiniPlugin,
          mapping: HUDINI_KEY,
          start: true,
          data: {
            theme: defaultLightTheme
          } as HudiniPluginData
        }, {
          key: PHASER_SOUND_STUDIO_KEY,
          plugin: PhaserSoundStudioPlugin,
          mapping: PHASER_SOUND_STUDIO_KEY,
          start: true,
          data: {
            soundList: soundKeys,
            channels: ['hud']
          } as PhaserSoundStudioPluginData
        }]
      }
    });
  }
}`,...i.parameters?.docs?.source}}};const v=["Default"];export{i as Default,v as __namedExportsOrder,K as default};
