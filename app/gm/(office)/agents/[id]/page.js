import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentClub } from '../../../../../lib/gm/store';
import { AG } from '../../../../../lib/gm/seed-data';
import { Chip, Jersey } from '../../../_components/ui';
import { AgentSwitch, RunPanel, ScheduleSelect, GoalSelect } from '../../../_components/AgentControls';
import { nextRun } from '../../../../../lib/gm/text';
import { hasKey } from '../../../../../lib/gm/runner';
export default async function AgentPage({ params }) {
    const { id } = await params;
    const a = AG[id];
    if (!a)
        notFound();
    const c = await currentClub();
    const on = !!c.settings.agentsOn[id];
    const logs = c.logs.filter(l => l.agent === id).slice(0, 3);
    const modeLbl = { draft: 'Drafts only', ask: 'Asks first', internal: 'Internal only' };
    const pane = (t, l) => <section className="card"><h3>{t}</h3><ul className="tidy small" style={{ marginTop: 10 }}>{l.map((x, i) => <li key={i}>{x}</li>)}</ul></section>;
    return (<>
      <p className="small"><Link href="/gm/team">&larr; Meet the team</Link></p>
      <div style={{ marginTop: 14 }}>
        <div className="pagehead">
          <div className="row" style={{ flexWrap: 'nowrap', gap: 16 }}><Jersey a={a} lg on={on}/><div><h1>{a.name}</h1><p style={{ marginTop: 4 }}>{a.pos}</p></div></div>
          <div className="row"><Chip k="good">Skill saved</Chip><span className="small mute">Agent on</span><AgentSwitch id={id} name={a.name} on={on}/></div>
        </div>
        <p style={{ maxWidth: '70ch', marginBottom: 18 }}>{a.line}</p>
        <section className="card">
          <div className="row spread"><h3>Skills</h3><span className="small mute">{a.skills.length} skills</span></div>
          <div className="tablewrap"><table><thead><tr><th>Skill</th><th>Works how</th><th>Status</th></tr></thead><tbody>
            {a.skills.map((k, i) => (<tr key={i}><td><b>{k[0]}</b><div className="small mute">{k[1]}</div></td><td><span className={`mode ${k[2] === 'internal' ? 'int' : ''}`}>{modeLbl[k[2]]}</span></td><td>{k[3] === 'saved' ? <Chip k="good">Saved</Chip> : <Chip>Planned</Chip>}</td></tr>))}
          </tbody></table></div>
        </section>
        <div className="grid g2" style={{ marginTop: 14 }}>{pane('Reads from', a.reads)}{pane('Hands off to', a.hands)}{pane('Never does', a.never)}{pane('Needs from you', a.needs)}</div>
        <section className="card" style={{ marginTop: 14 }}>
          <div className="row spread"><h3>Skill and workbook tabs</h3><Chip k="good">{a.skill}</Chip></div>
          <div className="row" style={{ marginTop: 10 }}>{a.tabs.map(t => <Chip key={t}>{t}</Chip>)}</div>
        </section>
        <section className="card" style={{ marginTop: 14 }}>
          <div className="row spread"><h3>Schedule</h3><div className="row"><span className="small mute">Next run: <b>{nextRun(c, id)}</b></span><ScheduleSelect id={id} value={c.settings.schedule[id] || 'manual'}/>{a.id === 'sponsorship' || a.id === 'tickets' ? <GoalSelect id={id} value={c.settings.goals[id]}/> : null}</div></div>
          <p className="small mute" style={{ marginTop: 8 }}>Scheduled agents run by themselves. Today that happens when you open the office; once the club is saved to the database they also run overnight.</p>
        </section>
        <section className="card" style={{ marginTop: 14 }}>
          <div className="row spread"><h3>Run</h3><RunPanel id={id} on={on} live={hasKey()}/></div>
          <p className="small mute" style={{ marginTop: 8 }}>A run reads the club workbook and prepares drafts. It never sends. {hasKey() ? '' : 'Demo mode replays this agent’s steps without calling Claude.'}</p>
          <div className="log" style={{ marginTop: 12 }}>
            {logs.length ? logs.map(l => `${new Date(l.at).toLocaleString()} · ${l.mode}\n${l.summary}\n${l.steps.map(s => '→ ' + s).join('\n')}${l.blocked.length ? '\nBlocked: ' + l.blocked.join('; ') : ''}\nDrafts: ${l.drafts}`).join('\n\n') : 'No run yet.'}
          </div>
        </section>
      </div>
    </>);
}
