import { currentClub } from '../../../../lib/gm/store';
import { AG } from '../../../../lib/gm/seed-data';
import { Head } from '../../_components/ui';
import ApprovalsView from '../../_components/ApprovalsView';
export default async function Approvals() {
    const c = await currentClub();
    const items = c.queue.map(q => ({ ...q, agentName: AG[q.agent]?.name ?? q.agent, agentNum: AG[q.agent]?.num ?? 0 }));
    return (<>
      <Head title="Approvals" sub="Every draft from every agent lands here. Nothing leaves until you approve it and confirm the batch."/>
      {c.queue.some(q => q.sample) ? <div className="notice"><b>Sample.</b><span>Seed drafts show what the agents hand you. Real runs add their own.</span></div> : null}
      {c.outbox.length ? <div className="notice"><b>Outbox.</b><span>{c.outbox.length} released drafts are waiting to be sent from your own email, because no email system is connected.</span></div> : null}
      <ApprovalsView items={items} sender={c.sender}/>
    </>);
}
