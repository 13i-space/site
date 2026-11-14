import Link from 'next/link';
import { Chip, Pips } from './ui';
import { RunPanel, ScheduleSelect, GoalSelect } from './AgentControls';
import { isToday, nextRun } from '../../../lib/gm/text';
import { hasKey } from '../../../lib/gm/runner';

/** How a lead is doing, read from its draft. */
function leadState(club, p) {
  if (p.sample) return ['', 'Sample'];
  const d = club.queue.find(q => q.id === p.draftId);
  if (d?.status === 'released') return ['sent', 'Sent'];
  if (d?.status === 'approved') return ['ready', 'Approved'];
  if (d?.status === 'skipped') return ['sent', 'Skipped'];
  if (p.email) return ['ready', 'Ready to send'];
  if (p.channel === 'Web form') return ['form', 'Ready to submit'];
  return ['call', 'Call'];
}

export default function Leads({ club, pipe, agentId, title, noun, side, extra }) {
  const all = club.prospects.filter(p => p.pipeline === pipe);
  const real = all.filter(p => !p.sample);
  const rows = (real.length ? [...real].reverse() : all);
  const goal = club.settings.goals[agentId] || 5;
  const todayN = real.filter(p => isToday(p.foundAt)).length;
  const withEmail = real.filter(p => p.email).length;
  const st = real.map(p => leadState(club, p)[1]);
  const on = club.settings.agentsOn[agentId];
  return (<>
    <div className="pagehead">
      <div><h1>{title}</h1><p>Every lead arrives with a score, a contact and a drafted message. The goal: you tweak a line and send.</p></div>
      <Link className="btn primary" href="/gm/approvals">Review drafts</Link>
    </div>

    <section className="card" style={{ marginBottom: 14 }}>
      <div className="runbar spread">
        <div style={{ flex: 1, minWidth: 240 }}>
          <div className="row spread"><b>Today&apos;s goal</b><span className="num"><b style={{ fontSize: 22 }}>{todayN}</b> <span className="mute">of {goal} {noun}</span></span></div>
          <div className="goalbar" style={{ marginTop: 6 }}><span style={{ width: `${Math.min(100, todayN / goal * 100)}%` }}/></div>
          <p className="small mute" style={{ marginTop: 6 }}>Next scheduled run: <b>{nextRun(club, agentId)}</b></p>
        </div>
        <div className="row"><GoalSelect id={agentId} value={goal}/><ScheduleSelect id={agentId} value={club.settings.schedule[agentId]}/><RunPanel id={agentId} on={on} live={hasKey()} label="Run sprint now"/></div>
      </div>
    </section>

    <div className="grid g4" style={{ marginBottom: 14 }}>
      {[['Total leads', real.length], ['With a public email', withEmail], ['Ready to send', st.filter(s => s === 'Ready to send').length], ['Sent', st.filter(s => s === 'Sent').length]].map(([l, n]) => (
        <div key={l} className="card"><div className="eyebrow">{l}</div><div className="num" style={{ font: '700 40px/1 var(--display)', marginTop: 8 }}>{n}</div></div>))}
    </div>
    {all.some(p => p.sample) && !real.length ? <div className="notice"><b>Sample.</b><span>Lead types shown until the agent runs for this club. A run replaces them with real businesses, contacts and emails.</span></div> : null}

    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1fr)' }}>
      <section className="card" style={{ padding: 0 }}><div className="tablewrap"><table>
        <thead><tr><th>Quality</th><th>{pipe === 'sponsor' ? 'Business' : pipe === 'group' ? 'Group' : 'Vendor'}</th><th>Contact</th><th>Email</th><th>Offer</th><th>Status</th></tr></thead>
        <tbody>{rows.length ? rows.map((p, i) => {
          const [k, label] = leadState(club, p);
          return (<tr key={i}>
            <td><Pips n={p.score}/></td>
            <td>{p.draftId ? <Link href={`/gm/approvals?d=${p.draftId}`}><b>{p.name}</b></Link> : <b>{p.name}</b>}
              <div className="small mute">{p.category}{p.city ? ` · ${p.city}` : ''}{p.ring ? ` · Ring ${p.ring}` : ''}</div>
              {p.hook ? <div className="small" style={{ marginTop: 2 }}>{p.hook}</div> : null}</td>
            <td>{p.contact ? <><b>{p.contact}</b><div className="small mute">{p.title}</div></> : <span className="mute">{p.sample ? '—' : 'No name found'}</span>}</td>
            <td className="emailcell">{p.email ? <>{p.email}<div className="small"><a href={p.emailSource} target="_blank" rel="noreferrer">source</a></div></> : <span className="mute">{p.phone || (p.sample ? '—' : p.channel)}</span>}</td>
            <td className="small">{p.pkg || '—'}</td>
            <td><span className={`tag ${k}`}>{label}</span></td></tr>);
        }) : <tr><td colSpan={6} className="mute">No leads yet. Turn the agent on and run a sprint.</td></tr>}</tbody>
      </table></div></section>
      <div className="grid" style={{ alignContent: 'start' }}>
        {extra}
        {side}
        <section className="card"><h3>What counts as ready</h3>
          <ul className="tidy small" style={{ marginTop: 10 }}>
            <li><b>Quality 3 to 5</b> on fit, size, spend and timing. Lower scores are dropped.</li>
            <li><b>A named person</b> and a <b>public email with its source page</b> wherever one exists. Addresses are never guessed.</li>
            <li>No email? A form message or call script, flagged so you know.</li>
            <li>Repeats, exclusive categories and Do Not Contact are filtered out.</li>
          </ul></section>
      </div>
    </div>
  </>);
}
