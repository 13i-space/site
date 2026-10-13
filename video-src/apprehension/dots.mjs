import fs from 'fs';
import * as topo from 'topojson-client';
const land = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json'));
const geo = topo.feature(land, land.objects.land);
const polys = [];
for (const f of geo.features) { const g=f.geometry; const P = g.type==='Polygon'?[g.coordinates]:g.coordinates; for (const p of P) polys.push(p); }
function inRing(x,y,r){let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const[xi,yi]=r[i],[xj,yj]=r[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}
function onLand(x,y){for(const p of polys){if(inRing(x,y,p[0])){let hole=false;for(let k=1;k<p.length;k++)if(inRing(x,y,p[k]))hole=true;if(!hole)return true;}}return false;}
let s=7; const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};
const out=[]; const st=1.5;
for(let lat=78;lat>-56;lat-=st) for(let lon=-170;lon<180;lon+=st){
  const x=lon+(rnd()-.5)*st*.6, y=lat+(rnd()-.5)*st*.6;
  if(onLand(x,y)) out.push([+x.toFixed(2),+y.toFixed(2),+rnd().toFixed(3)]);
}
fs.writeFileSync('dots.json', JSON.stringify(out)); console.log('dots',out.length);
