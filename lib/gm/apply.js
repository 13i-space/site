import { updateClub } from './store';
/** Save a finished run (drafts, leads, log) into a club. Used by the Run button, the auto-run and the cron route. */
export async function applyRun(clubId, res) {
    return updateClub(clubId, c => {
        const maxId = Math.max(0, ...c.queue.map(q => q.id));
        // Ids were assigned from a snapshot; re-key if another run landed in between.
        const clash = res.drafts.some(d => c.queue.some(q => q.id === d.id));
        const shift = clash ? maxId + 1 - Math.min(...res.drafts.map(d => d.id)) : 0;
        for (const d of res.drafts)
            d.id += shift;
        for (const p of res.prospects)
            if (p.draftId != null)
                p.draftId += shift;
        c.queue.push(...res.drafts);
        c.prospects.push(...res.prospects);
        c.logs.unshift(res.log);
        c.logs = c.logs.slice(0, 60);
    });
}
