import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { seedClub, normalize } from './seed';
import { getSupabaseAdmin } from '../supabaseAdmin';

/**
 * Storage adapter. If the Supabase table `gm_clubs` exists (see docs/gm-demo.md), clubs live there
 * and survive deploys and restarts, which is what makes overnight scheduled runs possible.
 * If it does not, clubs fall back to files in the server's temporary storage, which can reset.
 */
const dir = () => (process.env.VERCEL ? '/tmp/gm-clubs' : path.resolve(process.env.DATA_DIR || '.data', 'clubs'));
const file = (id) => path.join(dir(), `${id.replace(/[^a-z0-9-]/gi, '')}.json`);

let downUntil = 0;
const sb = () => (Date.now() < downUntil ? null : getSupabaseAdmin());
const down = () => { downUntil = Date.now() + 60_000; };

async function dbGet(id) {
  const c = sb();
  if (!c) return undefined;
  try {
    const r = await c.query(`gm_clubs?id=eq.${encodeURIComponent(id)}&select=data`, { cache: 'no-store' });
    if (!r.ok) { down(); return undefined; }
    const rows = await r.json();
    return rows[0]?.data ?? null;
  } catch { down(); return undefined; }
}
async function dbPut(club) {
  const c = sb();
  if (!c) return false;
  try {
    const r = await c.query('gm_clubs?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ id: club.id, data: club, updated_at: new Date().toISOString() }) });
    if (!r.ok) { down(); return false; }
    return true;
  } catch { down(); return false; }
}

export async function loadClub(id) {
  const fromDb = await dbGet(id);
  if (fromDb) return normalize(fromDb);
  try { return normalize(JSON.parse(await fs.readFile(file(id), 'utf8'))); } catch { return null; }
}
export async function saveClub(club) {
  if (await dbPut(club)) return;
  await fs.mkdir(dir(), { recursive: true });
  await fs.writeFile(file(club.id), JSON.stringify(club, null, 2));
}
export async function listClubIds() {
  const c = sb();
  if (c) {
    try {
      const r = await c.query('gm_clubs?select=id', { cache: 'no-store' });
      if (r.ok) return (await r.json()).map(x => x.id);
      down();
    } catch { down(); }
  }
  try { return (await fs.readdir(dir())).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')); } catch { return []; }
}
/** 'database' when the gm_clubs table answers, otherwise 'temporary'. */
export async function storageMode() {
  return (await dbGet('__ping')) === undefined ? 'temporary' : 'database';
}

export const DEMO_ID = 'chupacabras';
export async function currentClubId() {
  const jar = await cookies();
  return jar.get('gm_club')?.value || DEMO_ID;
}
/** The club for this visitor: cookie first, otherwise the seeded Chupacabras demo. */
export async function currentClub() {
  const id = await currentClubId();
  let club = await loadClub(id);
  if (!club) { club = seedClub(); await saveClub(club); }
  return club;
}
export async function updateClub(id, mutator) {
  const club = (await loadClub(id)) ?? seedClub();
  mutator(club);
  await saveClub(club);
  return club;
}
export async function update(mutator) {
  return updateClub(await currentClubId(), mutator);
}
