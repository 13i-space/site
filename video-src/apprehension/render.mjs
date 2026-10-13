import { chromium } from 'playwright';
import { spawn } from 'child_process';
const FPS=24, DUR=214.296, N=Math.ceil(DUR*FPS);
const start=+process.argv[2]||0, end=Math.min(+process.argv[3]||N, N), out=process.argv[4]||'video_only.mp4';
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-tune','grain',out],{stdio:['pipe','inherit','inherit']});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8765/film.html'); await p.evaluate(()=>window.ready);
const t0=Date.now();
for(let f=start;f<end;f++){
  const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},f/FPS);
  const buf=Buffer.from(d.slice(d.indexOf(',')+1),'base64');
  if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
  if(f%240===0) console.log('frame',f,'/',end,((Date.now()-t0)/1000).toFixed(0)+'s');
}
ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('done',((Date.now()-t0)/1000).toFixed(0)+'s');
