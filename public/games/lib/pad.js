/* 13i arcade controller support (Update 6.11).
   One file shared by XenoKlash, XenoKart and XenoWing. It reads any standard game controller (Xbox,
   PlayStation, Switch Pro and most others on a computer) and turns it into the keyboard controls each
   game already understands, so the games themselves need almost no changes.
   - In play: sticks, D-pad, triggers and buttons press and release the game's keys.
   - On any menu screen (a visible ".ov" overlay): the D-pad or stick moves a highlight between buttons
     and cards, A selects, B or Start backs out of a pause.
   - Rumble on hits, if the controller has it.
   Some browsers only report controllers to the main page, not to a game inside a frame, so the site
   page (components/IframeGame.js) also forwards controller state in; this file uses whichever it gets. */
(function(){
"use strict";
const KEYNAME={Space:" ",Escape:"Escape",Enter:"Enter",ShiftLeft:"Shift",ShiftRight:"Shift",ArrowUp:"ArrowUp",ArrowDown:"ArrowDown",ArrowLeft:"ArrowLeft",ArrowRight:"ArrowRight"};
const keyOf=c=>KEYNAME[c]||(c.startsWith("Key")?c.slice(3).toLowerCase():c);
const fire=(type,code)=>{try{window.dispatchEvent(new KeyboardEvent(type,{code,key:keyOf(code),bubbles:true,cancelable:true}))}catch(e){}};
/* standard mapping button indices */
const BTN={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,LS:10,RS:11,UP:12,DOWN:13,LEFT:14,RIGHT:15};
let cache={list:null,t:0,n:0},CFG=null,fwd=null,fwdT=0,held=new Set(),prevB=[],nav={dir:null,t:0,next:0},focusEl=null,shown=false,usedAt=0,raf=0;

function pads(){let list=[];try{list=Array.from(navigator.getGamepads?navigator.getGamepads():[]).filter(p=>p&&p.connected)}catch(e){}
  if(list.length)return list.map(p=>({buttons:p.buttons.map(b=>typeof b==="object"?b.value:b),axes:Array.from(p.axes),real:p}));
  if(fwd&&performance.now()-fwdT<1000)return fwd;return[]}
addEventListener("message",e=>{if(e.origin!==location.origin)return;const d=e.data||{};if(d.source==="13i"&&d.type==="pad"&&Array.isArray(d.pads)){fwd=d.pads;fwdT=performance.now();if(!raf)loop()}});

/* ---------- menus ---------- */
const visible=el=>{if(!el||el.hidden)return false;const cs=getComputedStyle(el);if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity===0)return false;const r=el.getBoundingClientRect();return r.width>2&&r.height>2};
function menus(){return Array.from(document.querySelectorAll(CFG.menus||".ov")).filter(el=>{if(!visible(el))return false;for(let p=el.parentElement;p;p=p.parentElement)if(p.hidden)return false;return true})}
function targets(roots){const out=[];for(const root of roots)for(const el of root.querySelectorAll("button,a[href],[role=button],[tabindex],select,input[type=range],*")){
    if(out.includes(el))continue;const ok=el.tagName==="BUTTON"||el.tagName==="SELECT"||el.tagName==="A"||el.getAttribute("role")==="button"||typeof el.onclick==="function"||(CFG.extra&&el.matches(CFG.extra));
    if(!ok||el.disabled||el.getAttribute("aria-disabled")==="true")continue;if(!visible(el))continue;let hid=false;for(let p=el.parentElement;p&&p!==root.parentElement;p=p.parentElement)if(p.hidden){hid=true;break}if(hid)continue;
    if(out.some(o=>o.contains(el)&&o!==el&&o.tagName!=="DIV"))continue;out.push(el)}return out}
function setFocus(el){if(focusEl)focusEl.classList.remove("xpad-focus");focusEl=el;if(el){el.classList.add("xpad-focus");try{el.focus({preventScroll:true})}catch(e){}try{el.scrollIntoView({block:"nearest",inline:"nearest"})}catch(e){}}}
function pickStart(list){for(const sel of(CFG.primary||[])){const el=list.find(e=>e.matches(sel));if(el)return el}return list[0]||null}
function move(dir,list){if(!focusEl||!list.includes(focusEl)){setFocus(pickStart(list));return}
  const a=focusEl.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,[dx,dy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];let best=null,bs=1e9;
  for(const el of list){if(el===focusEl)continue;const b=el.getBoundingClientRect(),bx=b.left+b.width/2,by=b.top+b.height/2,vx=bx-ax,vy=by-ay,along=vx*dx+vy*dy;if(along<4)continue;const perp=Math.abs(vx*dy-vy*dx),s=along+perp*2.4;if(s<bs){bs=s;best=el}}
  if(best)setFocus(best)}
function press(code){fire("keydown",code);setTimeout(()=>fire("keyup",code),60)}

/* ---------- the loop ---------- */
function loop(){raf=requestAnimationFrame(loop);tick()}
function tick(){if(!CFG)return;const P=pads();if(!P.length){if(held.size){for(const c of held)fire("keyup",c);held.clear()}return}
  const p=P[0],B=p.buttons,AX=p.axes,on=i=>(B[i]||0)>.5,edge=i=>on(i)&&!(prevB[i]>.5),now=performance.now();
  if(B.some(v=>v>.5)||AX.some(v=>Math.abs(v)>.5)){usedAt=now;if(!shown){shown=true;hello()}}
  const M=menus(),inMenu=M.length>0&&!(CFG.playing&&CFG.playing());
  const want=new Set();
  if(inMenu){
    if(!cache.list||now-cache.t>250||cache.n!==M.length){cache.list=targets(M);cache.t=now;cache.n=M.length}const list=cache.list,dir=on(BTN.UP)||AX[1]<-.55?"up":on(BTN.DOWN)||AX[1]>.55?"down":on(BTN.LEFT)||AX[0]<-.55?"left":on(BTN.RIGHT)||AX[0]>.55?"right":null;
    if(focusEl&&!list.includes(focusEl))setFocus(null);if(!focusEl&&list.length&&usedAt)setFocus(pickStart(list));
    if(dir&&(dir!==nav.dir||now>=nav.next)){move(dir,list);nav.next=now+(dir!==nav.dir?320:130)}nav.dir=dir;
    if(edge(BTN.A)&&focusEl){cache.list=null;const el=focusEl;if(el.tagName==="SELECT"){el.selectedIndex=(el.selectedIndex+1)%el.options.length;el.dispatchEvent(new Event("change",{bubbles:true}))}else el.click()}
    if(edge(BTN.B)||edge(BTN.START)){if(CFG.back&&CFG.back())press(CFG.back());else if(edge(BTN.START)&&focusEl)focusEl.click()}
  }else{
    if(focusEl)setFocus(null);nav.dir=null;
    const m=CFG.map;for(const k in m.buttons){if(on(+k))for(const c of[].concat(m.buttons[k]))want.add(c)}
    for(const a of(m.axes||[])){const v=AX[a.axis]||0,th=a.th||.45;if(v<-th&&a.neg)want.add(a.neg);if(v>th&&a.pos)want.add(a.pos)}
    for(const [i,c] of[[BTN.UP,m.up],[BTN.DOWN,m.down],[BTN.LEFT,m.left],[BTN.RIGHT,m.right]])if(c&&on(i))want.add(c);
    if(edge(BTN.START)&&m.start)press(m.start);
  }
  for(const c of want)if(!held.has(c))fire("keydown",c);for(const c of held)if(!want.has(c))fire("keyup",c);held=want;prevB=B.slice()}

/* ---------- connect notice, rumble ---------- */
function hello(){try{const d=document.createElement("div");d.className="xpad-hello";d.innerHTML=`<b>Controller connected</b><span>${CFG.legend||""}</span>`;document.body.appendChild(d);setTimeout(()=>d.classList.add("out"),5200);setTimeout(()=>d.remove(),6000)}catch(e){}}
function rumble(strong,weak,ms){const P=pads();if(!P.length)return;const g=P[0].real;try{if(g&&g.vibrationActuator&&g.vibrationActuator.playEffect){g.vibrationActuator.playEffect("dual-rumble",{duration:ms||160,strongMagnitude:strong??.6,weakMagnitude:weak??.4});return}}catch(e){}
  try{if(window.parent&&window.parent!==window)window.parent.postMessage({source:CFG.game||"game",type:"rumble",strong,weak,ms},location.origin)}catch(e){}}
function start(cfg){CFG=cfg;if(!document.getElementById("xpad-style")){const s=document.createElement("style");s.id="xpad-style";s.textContent=`.xpad-focus{outline:3px solid #5FF0DC!important;outline-offset:3px!important;box-shadow:0 0 0 6px rgba(95,240,220,.18),0 0 22px rgba(95,240,220,.55)!important;position:relative;z-index:2}
.xpad-hello{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99;background:rgba(8,10,28,.92);border:1px solid rgba(95,240,220,.5);border-radius:14px;padding:10px 16px;color:#E8F4FF;font:12px/1.5 ui-monospace,Menlo,monospace;letter-spacing:.04em;text-align:center;max-width:92vw;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .6s,transform .6s}
.xpad-hello b{display:block;color:#5FF0DC;font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:2px}.xpad-hello.out{opacity:0;transform:translateX(-50%) translateY(10px)}`;document.head.appendChild(s)}
  addEventListener("gamepadconnected",()=>{if(!raf)loop()});addEventListener("gamepaddisconnected",()=>{for(const c of held)fire("keyup",c);held.clear()});if(!raf)loop()}
window.XPad={start,rumble,BTN,_tick:tick,get active(){return pads().length>0}};
})();
