import Link from 'next/link';
import { currentClub } from '../../../../lib/gm/store';
import { AGENTS } from '../../../../lib/gm/seed-data';
import { Head } from '../../_components/ui';
import { senderMissing } from '../../../../lib/gm/text';
export default async function Brief() {
    const c = await currentClub();
    const pending = c.queue.filter(q => q.status === 'pending');
    const need = c.profile.filter(r => r[3] === 'need').length;
    const done = c.profile.length - need;
    const on = AGENTS.filter(a => c.settings.agentsOn[a.id]).length;
    const missing = senderMissing(c.sender);
    const items = [
        [missing.length ? 'bad' : 'good', missing.length ? `Nothing can be sent yet. Missing: ${missing.join(', ')}.` : 'Sender details are set. Approved drafts can be released.', '/gm/club', 'Sender details'],
        ['warn', `${pending.length} drafts are waiting for your approval from ${new Set(pending.map(p => p.agent)).size} agents.`, '/gm/approvals', 'Open approvals'],
        ['bad', `${need} profile fields still say Needed.`, '/gm/club', 'Review questions'],
    ];
    const last = c.logs[0];
    if (last)
        items.push(['good', `Last run: ${AGENTS.find(a => a.id === last.agent)?.name}. ${last.summary}`, `/gm/agents/${last.agent}`, 'Open agent']);
    const funnel = [['Found', c.prospects.length], ['Drafted', c.queue.filter(q => q.agent === 'sponsorship').length], ['Approved', c.queue.filter(q => q.agent === 'sponsorship' && (q.status === 'approved' || q.status === 'released')).length], ['Released', c.queue.filter(q => q.agent === 'sponsorship' && q.status === 'released').length]];
    const max = Math.max(1, ...funnel.map(f => f[1]));
    return (<>
      <Head title={`Good afternoon, ${c.user}`} sub={`Here is where the ${c.team} front office stands.`}/>
      <div className="grid g4">
        <div className="card tile"><div className="eyebrow">Waiting on you</div><div className="big num">{pending.length}</div><div className="sub">drafts to approve</div></div>
        <div className="card tile"><div className="eyebrow">Prospects</div><div className="big num">{c.prospects.length}</div><div className="sub">{c.prospects.filter(p => p.score >= 3).length} scored 3 or higher</div></div>
        <div className="card tile"><div className="eyebrow">Profile complete</div><div className="big num">{done}/{c.profile.length}</div><div className="sub"><div className="bar" style={{ marginTop: 8 }}><span style={{ width: `${done / c.profile.length * 100}%` }}/></div></div></div>
        <div className="card tile"><div className="eyebrow">Agents on</div><div className="big num">{on}/11</div><div className="sub">switch on from the team page</div></div>
      </div>
      <div className="grid" style={{ marginTop: 14, gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)' }}>
        <section className="card"><h3>Today&apos;s brief from the GM</h3>
          <div style={{ marginTop: 12 }}>
            {items.map((i, n) => (<div key={n} className="row spread" style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                <div className="row" style={{ flex: 1, minWidth: 220, flexWrap: 'nowrap', alignItems: 'flex-start' }}><span className={`chip ${i[0]}`} style={{ marginTop: 2 }}><i /></span><span>{i[1]}</span></div>
                <Link className="btn sm" href={i[2]}>{i[3]}</Link>
              </div>))}
          </div>
        </section>
        <section className="card"><h3>Sponsor funnel</h3>
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            {funnel.map(f => (<div key={f[0]}><div className="row spread small"><span>{f[0]}</span><b className="num">{f[1]}</b></div><div className="bar"><span style={{ width: `${f[1] / max * 100}%` }}/></div></div>))}
          </div>
          {c.prospects.some(p => p.sample) ? <p className="small mute" style={{ marginTop: 12 }}>Seed data: sample prospects until the Sponsorship agent runs live.</p> : null}
        </section>
      </div>
    </>);
}
