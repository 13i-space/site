import Link from 'next/link';
import { currentClub } from '../../../../lib/gm/store';
import { EXCLUSIVE, OTHERS } from '../../../../lib/gm/seed-data';
import { Head, Chip } from '../../_components/ui';
export default async function Pipeline() {
    const c = await currentClub();
    return (<>
      <Head title="Sponsor pipeline" sub="Scores run 1 to 5 and only 3 and up get a draft." right={<Link className="btn primary" href="/gm/approvals">Review drafts</Link>}/>
      {c.prospects.some(p => p.sample) ? <div className="notice"><b>Sample.</b><span>Prospect types shown until the Sponsorship agent runs live for this club.</span></div> : null}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)' }}>
        <section className="card" style={{ padding: 0 }}><div className="tablewrap"><table>
          <thead><tr><th>#</th><th>Prospect</th><th>Category</th><th>Score</th><th>Channel</th><th>Status</th></tr></thead>
          <tbody>{c.prospects.length ? c.prospects.map((p, i) => (<tr key={i}><td className="num">{i + 1}</td><td><b>{p.name}</b>{p.hook ? <div className="small mute">{p.hook}</div> : null}</td><td>{p.category}</td><td className="num"><b>{p.score}</b> / 5</td><td>{p.channel}</td>
              <td>{p.channel === 'Email' ? <Chip k="warn">Draft ready</Chip> : <Chip k="bad">Needs contact info</Chip>}</td></tr>)) : <tr><td colSpan={6} className="mute">No prospects yet. Turn on the Sponsorship agent and run it.</td></tr>}</tbody>
        </table></div></section>
        <div className="grid" style={{ alignContent: 'start' }}>
          <section className="card"><h3>Blocked categories</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>The agent will not pitch these.</p><div className="row">{EXCLUSIVE.map(e => <Chip key={e[0]} k="bad">{e[0]} · {e[1]}</Chip>)}</div></section>
          <section className="card"><h3>Already partners</h3><p className="small mute" style={{ margin: '6px 0 10px' }}>From your workbook, public sources.</p><div className="row">{OTHERS.map(o => <Chip key={o}>{o}</Chip>)}</div></section>
        </div>
      </div>
    </>);
}
