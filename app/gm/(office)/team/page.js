import Link from 'next/link';
import { currentClub } from '../../../../lib/gm/store';
import { AG } from '../../../../lib/gm/seed-data';
import { Head, Chip, Jersey } from '../../_components/ui';
import Pitch from '../../_components/Pitch';
import { SCHEDULES } from '../../../../lib/gm/text';

const GROUPS = [
    ['The wings', 'Sponsors and tickets are the lifeline. They get equal billing, a morning sprint each, and the first call on your attention.', ['sponsorship', 'tickets']],
    ['The attack', 'Tell the story, work the crowd and build the squad. Players generate revenue too, through tryouts.', ['marketing', 'fan', 'team']],
    ['Midfield and defense', 'The keeper sees the whole field. The rest run logistics, money, legal and reputation.', ['gm', 'partners', 'operations', 'finance', 'pr', 'people']],
];
export default async function Team() {
    const c = await currentClub();
    const on = c.settings.agentsOn;
    return (<>
      <Head title="Meet the team" sub="Eleven agents in a 4-4-2. Lit circles are working for you now. Each has a saved skill and its own tabs of the club workbook."/>
      <Pitch on={on} schedule={c.settings.schedule}/>
      <div className="legend small mute"><span><i className="jersey on"/>On and working</span><span><i className="jersey"/>Off</span><span>Click a player to open that agent. Tags show how often each runs by itself.</span></div>
      {GROUPS.map(g => (<section key={g[0]} style={{ marginTop: 28 }}>
          <h2>{g[0]}</h2><p className="mute small" style={{ maxWidth: '70ch' }}>{g[1]}</p>
          <div className="grid g3" style={{ marginTop: 12 }}>
            {g[2].map(id => {
                const a = AG[id];
                const isOn = on[id];
                return (<Link key={id} className="card acard" href={`/gm/agents/${id}`}>
                <div className="row" style={{ flexWrap: 'nowrap' }}><Jersey a={a} on={isOn}/><div style={{ flex: 1 }}><b>{a.name}</b><div className="small mute">{a.pos}</div></div></div>
                <p className="small">{a.line}</p>
                <div className="row spread"><div className="row" style={{ gap: 6 }}><Chip k={isOn ? 'good' : ''}>{isOn ? 'On' : 'Off'}</Chip>{isOn ? <span className="tag">{SCHEDULES[c.settings.schedule[id]]}</span> : null}</div><span className="skilltag">{a.skills.length} skills</span></div>
              </Link>);
            })}
          </div>
        </section>))}
    </>);
}
