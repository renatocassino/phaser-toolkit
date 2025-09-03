import{a as d,H as m,T as p}from"./plugin-B1U0GAQ2.js";import{p as y,c as S,n as f,a as C,C as P,P as E,d as L}from"./create-game-IT2NM2Nb.js";import{S as K}from"./scene-with-hudini-EXJR7ZX3.js";import{b as h}from"./with-persistent-state-Pci6dusG.js";import"./webfontloader-DPE_tNm0.js";import"./_commonjsHelpers-Cpj98o6Y.js";const O=10;class x{constructor(e){this.plugin=e,this.plugin=e}get game(){return this.plugin.getGame()}loadBySoundKey(e,n){const{game:t,plugin:s}=this;t.cache.audio.has(n)||e.load.audio(n,s.soundList[n]?.path)}loadByChannel(e,n){const{plugin:t}=this;Object.entries(t.soundList).filter(s=>s[1].channel===n).forEach(([s])=>{this.loadBySoundKey(e,s)})}}class V{constructor(e){this.plugin=e,this.plugin=e}get game(){return this.plugin.getGame()}get soundRegistry(){return this.plugin.soundRegistry}play(e){const n=this.soundRegistry.getChannelBySoundKey(e);switch(n.mode){case"single":this.playSingleMode(e);break;case"multiple":this.playMultipleMode(e,n.maxInstances);break}}playSingleMode(e){const n=this.soundRegistry.getSoundBySoundKey(e);if(n){n.isPlaying||n.play();return}const t=this.soundRegistry.getSoundConfigBySoundKey(e);this.game.sound.add(e,{volume:t?.channel?this.plugin.getChannelVolume(t.channel):1,loop:t?.loop??!1}).play()}playMultipleMode(e,n=O){const t=this.soundRegistry.fetchSoundsBySoundKey(e),s=t.find(o=>!o.isPlaying);if(s){s.play();return}if(t.length<n){const o=this.soundRegistry.getSoundConfigBySoundKey(e);this.game.sound.add(e,{volume:o?.channel?this.plugin.getChannelVolume(o.channel):1,loop:o?.loop??!1}).play()}}}class b{constructor(e){this.plugin=e,this.plugin=e}get game(){return this.plugin.getGame()}get soundPlayer(){return this.plugin.soundPlayer}get channels(){return this.plugin.channels}get soundList(){return this.plugin.soundList}getSoundConfigBySoundKey(e){return this.soundList[e]??null}getSoundBySoundKey(e){const n=this.fetchSoundsBySoundKey(e);return n.length>0?n[0]:null}fetchSoundsBySoundKey(e){return this.game.sound.getAll(e)}getChannelBySoundKey(e){const n=this.soundList[e];return this.channels[n.channel]}}const u="soundStudio";class D extends y.Plugins.BasePlugin{channelVolumes={};soundPlayer;soundLoader;soundRegistry;soundList;channels;storage;gameName;getGame(){return this.game}constructor(e){super(e),this.soundList={},this.soundLoader=new x(this),this.channels={},this.storage="local",this.soundPlayer=new V(this),this.soundRegistry=new b(this)}init({soundList:e,channels:n,storage:t,gameName:s}){this.soundList=e,this.channels=n,this.storage=t,this.gameName=s,Object.keys(n).forEach(o=>{this.channelVolumes[o]=1})}loadAll(e){const n=Object.entries(this.soundList).filter(t=>t[1].preload!==!1);for(const[t,s]of n)e.load.audio(t,s.path);this.loadChannelVolumes(e)}loadByChannel(e,n){this.soundLoader.loadByChannel(e,n),this.loadChannelVolumes(e)}loadBySoundKey(e,n){this.soundLoader.loadBySoundKey(e,n)}play(e){this.soundPlayer.play(e)}playOnce(e,n){e.sound.get(n)?.isPlaying||this.play(n)}lazyLoadPlay(e,n){const t=this.soundList[n]?.path;t&&(e.load.audio(n,t),e.load.once(`filecomplete-audio-${n}`,()=>{this.play(n)}))}setChannelVolume(e,n,t){(t<0||t>1)&&(t=Math.max(0,Math.min(1,t)),console.warn(`Volume must be between 0 and 1. Setting volume to ${t} instead in channel ${n}.`)),this.channelVolumes[n]=t,Object.entries(this.soundList).filter(s=>s[1].channel===n).forEach(([s])=>{const o=e.sound.get(s);o&&"setVolume"in o&&o.setVolume(t)}),this.saveChannelVolumes(e)}getChannelVolume(e){return this.channelVolumes[e]||1}muteChannel(e,n){this.setChannelVolume(e,n,0)}unmuteChannel(e,n){this.setChannelVolume(e,n,1)}getAllChannels(){return this.channels}persistNameKey(){return this.gameName?`phaser-sound-studio-volumes:${this.gameName}`:"phaser-sound-studio-volumes"}saveChannelVolumes(e){h(e,this.persistNameKey(),this.channelVolumes,void 0,this.storage).set(this.channelVolumes)}loadChannelVolumes(e){const n=h(e,this.persistNameKey(),this.channelVolumes,void 0,this.storage);this.channelVolumes=n.get()}}const c=(a,e=u)=>a.plugins.get(e),l="phaser-sound-studio-example",_=`
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
`,r={MOUSE_HOVER:"mouse-hover",MOUSE_CLICK:"mouse-click"},g={HUD:"hud"},B={[r.MOUSE_HOVER]:{channel:g.HUD,preload:!0,path:"/sounds/ui-pop.m4a",loop:!1},[r.MOUSE_CLICK]:{channel:g.HUD,preload:!0,path:"/sounds/click.mp3",loop:!1}};class I extends K{constructor(){super("preview")}preload(){c(this).loadAll(this)}create(){this.cameras.main.setBackgroundColor(this.pw.color.rgb("slate-900"));const e=new p({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY,backgroundColor:"blue-500",textColor:"white",text:"Click me",onClick:()=>{c(this).play(this,r.MOUSE_CLICK)}});this.add.existing(e)}}const R={title:"Phaser Sound Studio/Components/Play Sound",parameters:{docs:{description:{component:"Column is a layout container that stacks children vertically with configurable gap and alignment."}}}},i={render:()=>{const a=document.createElement("div");return a.id=l,a},play:async()=>{await S(),await f(3),C(l,{type:E.AUTO,width:800,height:600,backgroundColor:P.rgb("slate-900"),parent:document.getElementById(l),scene:[I],plugins:{global:[{key:d,plugin:m,mapping:d,start:!0,data:{theme:L}},{key:u,plugin:D,mapping:u,start:!0,data:{soundList:B,channels:["hud"]}}]}})}};i.parameters={docs:{autoplay:!0,story:{inline:!1},source:{code:_}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const T=["Default"];export{i as Default,T as __namedExportsOrder,R as default};
