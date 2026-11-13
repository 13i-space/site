'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentClub, loadClub, saveClub, update, DEMO_ID } from './store';
import { blankClub, seedClub } from './seed';
import { researchClub } from './setup';
import { allow } from './limits';
import { unlocked, tokenFor } from './gate';
import { runAgent } from './runner';
import { senderMissing } from './text';
export async function unlock(formData) {
    const t = tokenFor(String(formData.get('code') || ''));
    if (t)
        (await cookies()).set('gm_pass', t, { httpOnly: true, sameSite: 'lax', path: '/gm', maxAge: 60 * 60 * 24 * 30 });
    redirect('/gm');
}
export async function startSetup(formData) {
    if (!(await unlocked()))
        redirect('/gm');
    const user = String(formData.get('name') || '').trim() || 'Paul';
    const team = String(formData.get('team') || '').trim() || 'My Team';
    const website = String(formData.get('website') || '').trim() || undefined;
    const jar = await cookies();
    let club;
    if (/chupa/i.test(team)) {
        club = (await loadClub(DEMO_ID)) ?? seedClub();
        club.user = user;
    }
    else {
        const id = team.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) + '-' + Math.random().toString(36).slice(2, 6);
        club = blankClub(id, user, team);
        if (await allow('setup')) await researchClub(club, website);
    }
    await saveClub(club);
    jar.set('gm_club', club.id, { httpOnly: true, sameSite: 'lax', path: '/gm', maxAge: 60 * 60 * 24 * 30 });
    redirect('/gm/brief');
}
export async function switchToDemo() {
    (await cookies()).set('gm_club', DEMO_ID, { path: '/gm' });
    redirect('/gm/brief');
}
export async function setDraftStatus(id, status) {
    await update(c => { const d = c.queue.find(x => x.id === id); if (d && d.status !== 'released')
        d.status = status; });
    revalidatePath('/gm', 'layout');
}
export async function editDraft(id, body) {
    await update(c => { const d = c.queue.find(x => x.id === id); if (d && d.status !== 'released') {
        d.body = body;
        d.status = 'pending';
    } });
    revalidatePath('/gm', 'layout');
}
/**
 * The one confirmation. Blocked until sender details exist. With no email system
 * connected the drafts move to the outbox for a person to send; connecting Gmail
 * or Outlook is a separate step that needs the club's own sign-in.
 */
export async function sendApproved() {
    const club = await currentClub();
    const missing = senderMissing(club.sender);
    if (missing.length)
        return { ok: false, message: `Sending is blocked. Missing: ${missing.join(', ')}.` };
    const batch = club.queue.filter(d => d.status === 'approved' && d.kind === 'out');
    if (!batch.length)
        return { ok: false, message: 'No approved outbound drafts.' };
    await update(c => {
        for (const d of c.queue.filter(x => x.status === 'approved' && x.kind === 'out')) {
            d.status = 'released';
            c.outbox.push({ at: new Date().toISOString(), draftId: d.id, to: d.to, subj: d.subj, via: c.settings.emailSystem === 'None' ? 'Outbox (no email system connected)' : c.settings.emailSystem });
        }
    });
    revalidatePath('/gm', 'layout');
    const via = club.settings.emailSystem === 'None' ? 'No email system is connected, so nothing left the app. They are in the outbox for you to send.' : `Queued for ${club.settings.emailSystem}.`;
    return { ok: true, message: `${batch.length} drafts released. ${via}` };
}
export async function saveSender(formData) {
    await update(c => {
        c.sender = { name: String(formData.get('name') || ''), email: String(formData.get('email') || ''), addr: String(formData.get('addr') || '') };
    });
    revalidatePath('/gm', 'layout');
}
export async function toggleAgent(id, on) {
    await update(c => { c.settings.agentsOn[id] = on; });
    revalidatePath('/gm', 'layout');
}
export async function setRating(i, k, v) {
    await update(c => { if (c.players[i])
        c.players[i].r[k] = Math.max(40, Math.min(99, v)); });
    revalidatePath('/gm/roster');
}
export async function runAgentAction(id) {
    try {
        if (!(await unlocked()))
            return { ok: false, error: 'Enter the demo passcode first.' };
        if (!(await allow('run')))
            return { ok: false, error: 'The demo has reached its hourly limit. Try again in a bit.' };
        const club = await currentClub();
        const res = await runAgent(club, id);
        await update(c => {
            c.queue.push(...res.drafts);
            c.prospects.push(...res.prospects);
            c.logs.unshift(res.log);
            c.logs = c.logs.slice(0, 50);
        });
        revalidatePath('/gm', 'layout');
        return { ok: true };
    }
    catch (e) {
        return { ok: false, error: String(e?.message || e) };
    }
}
