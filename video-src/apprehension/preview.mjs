import { chromium } from 'playwright';
import fs from 'fs';
const times = process.argv.slice(2).map(Number);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--disable-web-security'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('http://127.0.0.1:8765/film.html'); await p.evaluate(() => window.ready);
fs.mkdirSync('prev', { recursive: true });
for (const t of times) {
  const d = await p.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', .85); }, t);
  fs.writeFileSync(`prev/${t.toFixed(2)}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
}
await b.close();
