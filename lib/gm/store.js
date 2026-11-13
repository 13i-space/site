import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { seedClub } from './seed';
/**
 * Storage adapter. Files on disk keep the prototype simple and work locally.
 * Vercel's filesystem is ephemeral, so before deploying replace these two
 * functions with Postgres (one row per club, `data` as jsonb). Nothing else
 * in the app touches storage.
 */
const dir = () => (process.env.VERCEL ? '/tmp/gm-clubs' : path.resolve(process.env.DATA_DIR || '.data', 'clubs'));
const file = (id) => path.join(dir(), `${id.replace(/[^a-z0-9-]/gi, '')}.json`);
export async function loadClub(id) {
    try {
        return JSON.parse(await fs.readFile(file(id), 'utf8'));
    }
    catch {
        return null;
    }
}
export async function saveClub(club) {
    await fs.mkdir(dir(), { recursive: true });
    await fs.writeFile(file(club.id), JSON.stringify(club, null, 2));
}
export const DEMO_ID = 'chupacabras';
/** The club for this visitor: cookie first, otherwise the seeded Chupacabras demo. */
export async function currentClub() {
    const jar = await cookies();
    const id = jar.get('gm_club')?.value || DEMO_ID;
    let club = await loadClub(id);
    if (!club && id === DEMO_ID) {
        club = seedClub();
        await saveClub(club);
    }
    if (!club) {
        club = seedClub();
        await saveClub(club);
    }
    return club;
}
export async function update(mutator) {
    const club = await currentClub();
    mutator(club);
    await saveClub(club);
    return club;
}
