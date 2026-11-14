import { currentClub } from '../../../../lib/gm/store';
import { AG } from '../../../../lib/gm/seed-data';
import { Head } from '../../_components/ui';
import ApprovalsView from '../../_components/ApprovalsView';

const RANK = { sponsorship: 1, tickets: 2, marketing: 3, team: 4, partners: 5, fan: 6, operations: 7, finance: 8, pr: 9, people: 10 };
const STATE = { pending: 0, approved: 1, skipped: 2, released: 3 };
export default async function Approvals({ searchParams }) {
    const c = await currentClub();
    const sp = (await searchParams) || {};
    const items = c.queue.map(q => ({ ...q, rank: q.kind === 'reply' ? 0 : (RANK[q.agent] ?? 11), agentName: AG[q.agent]?.name ?? q.agent, agentNum: AG[q.agent]?.num ?? 0 }))
        .sort((a, b) => (STATE[a.status] ?? 0) - (STATE[b.status] ?? 0) || a.rank - b.rank || (b.score || 0) - (a.score || 0) || b.id - a.id);
    const first = items.find(i => String(i.id) === String(sp.d))?.id;
    return (<>
      <Head title="Approvals" sub="Replies and revenue come first. Every draft is addressed and ready: tweak a line, approve, and open it in your email."/>
      {items.some(q => q.sample) ? <div className="notice"><b>Sample.</b><span>Seed drafts show what the agents hand you. Real runs add their own. Replies will land at the top once your inbox is connected.</span></div> : null}
      {c.outbox.length ? <div className="notice"><b>Outbox.</b><span>{c.outbox.length} drafts have been released or marked as sent.</span></div> : null}
      <ApprovalsView items={items} sender={c.sender} first={first}/>
    </>);
}
