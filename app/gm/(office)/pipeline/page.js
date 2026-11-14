import { currentClub } from '../../../../lib/gm/store';
import { EXCLUSIVE, OTHERS } from '../../../../lib/gm/seed-data';
import { LANES } from '../../../../lib/gm/lanes';
import { Chip } from '../../_components/ui';
import Leads from '../../_components/Leads';

export default async function Pipeline() {
    const c = await currentClub();
    const side = (<>
      <section className="card"><h3>Where it looks</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>Each sprint searches these segments side by side.</p><div className="row">{LANES.sponsorship.map(l => <Chip key={l.name}>{l.name}</Chip>)}</div></section>
      <section className="card"><h3>Blocked categories</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>The agent will not pitch these.</p><div className="row">{EXCLUSIVE.map(e => <Chip key={e[0]} k="bad">{e[0]} · {e[1]}</Chip>)}</div></section>
      <section className="card"><h3>Already partners</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>From your workbook, public sources.</p><div className="row">{OTHERS.map(o => <Chip key={o}>{o}</Chip>)}</div></section>
    </>);
    return <Leads club={c} pipe="sponsor" agentId="sponsorship" title="Sponsor pipeline" noun="leads" side={side}/>;
}
