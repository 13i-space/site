import Link from 'next/link';
import { currentClub } from '../../../../lib/gm/store';
import { AGENTS, AG } from '../../../../lib/gm/seed-data';
import { Head, Chip, Jersey } from '../../_components/ui';
const GROUPS = [
    ['Revenue', 'The forwards. They bring money and crowds in.', ['sponsorship', 'tickets', 'marketing']],
    ['Run the club', 'The midfield. They organize people and information.', ['gm', 'fan', 'team']],
    ['Protect the club', 'The defense and the keeper. Logistics, money, legal and reputation.', ['operations', 'partners', 'finance', 'pr', 'people']],
];
export default async function Team() {
    const c = await currentClub();
    return (<>
      <Head title="Meet the team" sub="Eleven agents in a 4-3-3. Each has a saved skill and reads its own tabs of the club workbook."/>
      <div className="pitch">
        <svg viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="#ffffff55" strokeWidth=".5">
          <rect x="3" y="3" width="154" height="84"/><line x1="80" y1="3" x2="80" y2="87"/><circle cx="80" cy="45" r="11"/>
          <rect x="3" y="22" width="20" height="46"/><rect x="3" y="33" width="7" height="24"/><rect x="137" y="22" width="20" height="46"/><rect x="150" y="33" width="7" height="24"/>
        </svg>
        {AGENTS.map(a => (<Link key={a.id} className="pos" style={{ left: `${a.x}%`, top: `${a.y}%` }} href={`/gm/agents/${a.id}`}>
            <span className="jersey" style={c.settings.agentsOn[a.id] ? {} : { opacity: .75 }}>{a.num}</span><span className="nm">{a.name}</span>
          </Link>))}
      </div>
      <div className="legend small mute"><span>Click a player to open that agent. Faded numbers are switched off.</span></div>
      {GROUPS.map(g => (<section key={g[0]} style={{ marginTop: 28 }}>
          <h2>{g[0]}</h2><p className="mute small">{g[1]}</p>
          <div className="grid g3" style={{ marginTop: 12 }}>
            {g[2].map(id => {
                const a = AG[id];
                const on = c.settings.agentsOn[id];
                return (<Link key={id} className="card acard" href={`/gm/agents/${id}`}>
                <div className="row"><Jersey a={a}/><div style={{ flex: 1 }}><b>{a.name}</b><div className="small mute">{a.pos}</div></div></div>
                <p className="small">{a.line}</p>
                <div className="row spread"><Chip k={on ? 'good' : ''}>{on ? 'On' : 'Off'}</Chip><span className="skilltag">{a.skills.length} skills</span></div>
              </Link>);
            })}
          </div>
        </section>))}
    </>);
}
