import Link from 'next/link';
import { currentClub } from '../../../../lib/gm/store';
import { AGENTS, AG } from '../../../../lib/gm/seed-data';
import { Crest } from '../../_components/ui';
import { RunPanel } from '../../_components/AgentControls';
import { senderMissing, isToday, nextRun, SCHEDULES } from '../../../../lib/gm/text';
import { hasKey } from '../../../../lib/gm/runner';

const Goal = ({ label, n, goal, href }) => (
  <Link href={href} className="goalrow" style={{ textDecoration: 'none' }}>
    <div className="t"><b>{label}</b><span className="num"><b style={{ fontSize: 20 }}>{n}</b> <span className="mute">of {goal}</span></span></div>
    <div className="goalbar"><span style={{ width: `${Math.min(100, n / goal * 100)}%` }}/></div>
  </Link>
);

export default async function Brief() {
    const c = await currentClub();
    const pending = c.queue.filter(q => q.status === 'pending');
    const replies = pending.filter(q => q.kind === 'reply');
    const need = c.profile.filter(r => r[3] === 'need').length;
    const done = c.profile.length - need;
    const on = AGENTS.filter(a => c.settings.agentsOn[a.id]).length;
    const missing = senderMissing(c.sender);
    const real = (pipe) => c.prospects.filter(p => p.pipeline === pipe && !p.sample);
    const today = (pipe) => real(pipe).filter(p => isToday(p.foundAt) && p.status !== 'needs-contact').length;
    const sp = real('sponsor'), gr = real('group');
    const hour = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Chicago' }));
    const hi = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const items = [];
    if (replies.length) items.push(['bad', `${replies.length} repl${replies.length === 1 ? 'y is' : 'ies are'} waiting. Answer these first: they are revenue.`, '/gm/approvals', 'Answer now']);
    items.push(['warn', `${pending.length} drafts are waiting for your approval from ${new Set(pending.map(p => p.agent)).size} agents.`, '/gm/approvals', 'Open approvals']);
    items.push([missing.length ? 'bad' : 'good', missing.length ? `Nothing can be sent yet. Missing: ${missing.join(', ')}.` : 'Sender details are set. Approved emails open in your inbox ready to send.', '/gm/club', 'Sender details']);
    items.push(['bad', `${need} profile fields still say Needed.`, '/gm/club', 'Fill them in']);
    const last = c.logs[0];
    if (last) items.push(['good', `Last run: ${AG[last.agent]?.name}. ${last.summary}`, `/gm/agents/${last.agent}`, 'Open agent']);
    const scheduled = AGENTS.filter(a => c.settings.agentsOn[a.id] && c.settings.schedule[a.id] !== 'manual');
    return (<>
      <section className="teamhero">
        <Crest club={c} big/>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="eyebrow" style={{ color: '#ffffffb0' }}>Front office</div>
          <h1 style={{ marginTop: 8 }}>{c.team}</h1>
          <div className="meta">
            {c.real ? <><span>USL League Two</span><span>Ron Poe Stadium</span><span>McKinney, TX</span></> : <span>{c.profile.find(r => r[1] === 'League')?.[2] || 'Your club'}</span>}
          </div>
        </div>
      </section>
      <p className="hello"><b style={{ fontSize: 17 }}>{hi}, {c.user}.</b> <span className="mute">Here is where your front office stands.</span></p>

      <div className="grid g4">
        <Link href="/gm/approvals" className="card tile hot"><div className="eyebrow">Waiting on you</div><div className="big num">{pending.length}</div><div className="sub">drafts to approve</div><div className="go"><span>Review now</span><span>→</span></div></Link>
        <Link href="/gm/pipeline" className="card tile"><div className="eyebrow">Prospects</div><div className="big num">{c.prospects.filter(p => p.pipeline === 'sponsor').length}</div><div className="sub">{c.prospects.filter(p => p.pipeline === 'sponsor' && p.score >= 3).length} scored 3 or higher</div><div className="go"><span>Open pipeline</span><span>→</span></div></Link>
        <Link href="/gm/club" className="card tile"><div className="eyebrow">Profile complete</div><div className="big num">{done}/{c.profile.length}</div><div className="sub"><div className="bar" style={{ marginTop: 8 }}><span style={{ width: `${done / c.profile.length * 100}%` }}/></div></div><div className="go"><span>Fill in the gaps</span><span>→</span></div></Link>
        <Link href="/gm/team" className="card tile"><div className="eyebrow">Agents on</div><div className="big num">{on}/11</div><div className="sub">switch on from the team page</div><div className="go"><span>Manage the team</span><span>→</span></div></Link>
      </div>

      <div className="grid" style={{ marginTop: 14, gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)' }}>
        <section className="card"><h3>Today&apos;s brief from the GM</h3>
          <div style={{ marginTop: 10 }}>
            {items.map((i, n) => (<div key={n} className="briefitem">
                <div className="row" style={{ flex: 1, minWidth: 220, flexWrap: 'nowrap', alignItems: 'flex-start' }}><span className={`chip ${i[0]}`} style={{ marginTop: 2 }}><i /></span><span>{i[1]}</span></div>
                <Link className="btn sm" href={i[2]}>{i[3]}</Link>
              </div>))}
          </div>
        </section>
        <div className="grid" style={{ alignContent: 'start' }}>
          <section className="card"><h3>Today&apos;s lead goals</h3>
            <p className="small mute" style={{ margin: '4px 0 14px' }}>Ready-to-send leads found today, with a named contact or a way in.</p>
            <div className="grid" style={{ gap: 16 }}>
              {c.settings.agentsOn.sponsorship ? <Goal label="Sponsors" n={today('sponsor')} goal={c.settings.goals.sponsorship} href="/gm/pipeline"/> : null}
              {c.settings.agentsOn.tickets ? <Goal label="Groups" n={today('group')} goal={c.settings.goals.tickets} href="/gm/groups"/> : null}
            </div>
            <div className="row" style={{ marginTop: 16 }}>
              {c.settings.agentsOn.sponsorship ? <RunPanel id="sponsorship" on live={hasKey()} label="Run sponsor sprint"/> : null}
            </div>
            <p className="small mute" style={{ marginTop: 10 }}>{sp.length + gr.length} real leads in the books so far.</p>
          </section>
          <section className="card"><h3>On the schedule</h3>
            <div style={{ marginTop: 8 }}>
              {scheduled.map(a => (<div key={a.id} className="row spread small" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                <span><b>{a.name}</b> · {SCHEDULES[c.settings.schedule[a.id]]}</span><span className={`tag ${nextRun(c, a.id) === 'Due now' ? 'on' : ''}`}>{nextRun(c, a.id)}</span></div>))}
            </div>
          </section>
        </div>
      </div>
    </>);
}
