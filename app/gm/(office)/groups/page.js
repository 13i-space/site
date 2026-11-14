import { currentClub } from '../../../../lib/gm/store';
import { RINGS, RING_FILL, LANES } from '../../../../lib/gm/lanes';
import { ringState } from '../../../../lib/gm/runner';
import { Chip } from '../../_components/ui';
import Leads from '../../_components/Leads';

export default async function Groups() {
    const c = await currentClub();
    const rs = ringState(c);
    const extra = (<section className="card"><h3>Reach, ring by ring</h3>
      <p className="small mute" style={{ margin: '6px 0 6px' }}>The search starts at the gates and widens outward as each ring fills ({RING_FILL} leads).</p>
      {RINGS.map((r, i) => (<div key={r.n} className="ring">
        <div className="row spread"><b>{r.label}</b><span className="small num">{rs.counts[i]} / {RING_FILL}{rs.now === r.n ? ' · searching now' : ''}</span></div>
        <div className="small mute">{r.desc}</div>
        <div className="bar"><span style={{ width: `${Math.min(100, rs.counts[i] / RING_FILL * 100)}%` }}/></div></div>))}
    </section>);
    const side = (<section className="card"><h3>Who it looks for</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>Youth clubs, academies and select teams come first.</p><div className="row">{LANES.tickets.filter(l => !l.ring || l.ring === 'now').map(l => <Chip key={l.name}>{l.name}</Chip>)}</div></section>);
    return <Leads club={c} pipe="group" agentId="tickets" title="Tickets & groups" noun="groups" extra={extra} side={side}/>;
}
