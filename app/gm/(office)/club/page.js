import { currentClub } from '../../../../lib/gm/store';
import { QUESTIONS } from '../../../../lib/gm/seed-data';
import { Head, Chip, stat } from '../../_components/ui';
import { saveSender, saveLogo } from '../../../../lib/gm/actions';
export default async function Club() {
    const c = await currentClub();
    return (<>
      <Head title="Club workbook" sub="The facts every agent reads. Public facts carry their source. Prices appear only when Confirmed."/>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)' }}>
        <section className="card" style={{ padding: 0 }}><div className="tablewrap"><table>
          <thead><tr><th>Section</th><th>Field</th><th>Value</th><th>Status</th></tr></thead>
          <tbody>{c.profile.map((r, i) => {
            const s = stat[r[3]];
            return (<tr key={i}><td className="small mute">{r[0]}</td><td>{r[1]}</td><td>{r[2] || <span className="mute">Not set</span>}</td><td><Chip k={s[0]}>{s[1]}</Chip></td></tr>);
        })}</tbody>
        </table></div></section>
        <div className="grid" style={{ alignContent: 'start' }}>
          <section className="card">
            <h3>Sender details</h3>
            <p className="small mute" style={{ margin: '6px 0 12px' }}>Every outbound message needs these. Sending stays blocked until all three are set.</p>
            <form action={saveSender} className="grid" style={{ gap: 12 }}>
              <div><label htmlFor="s-name">Sender name</label><input id="s-name" name="name" type="text" defaultValue={c.sender.name} placeholder="Name and title"/></div>
              <div><label htmlFor="s-email">Sender email</label><input id="s-email" name="email" type="text" defaultValue={c.sender.email} placeholder="name@club.com"/></div>
              <div><label htmlFor="s-addr">Club mailing address</label><input id="s-addr" name="addr" type="text" defaultValue={c.sender.addr} placeholder="Street, city, state, ZIP"/></div>
              <button className="btn primary" type="submit">Save sender details</button>
            </form>
          </section>
          <section className="card">
            <h3>Club logo</h3>
            <p className="small mute" style={{ margin: '6px 0 12px' }}>Paste a link to the logo image (https). It shows on the Daily Brief and in the menu.</p>
            <form action={saveLogo} className="grid" style={{ gap: 12 }}>
              <div><label htmlFor="logo">Logo image link</label><input id="logo" name="logo" type="text" defaultValue={c.logo} placeholder="https://…/logo.png"/></div>
              <button className="btn" type="submit">Save logo</button>
            </form>
          </section>
          <section className="card"><h3>Questions for the club</h3><ul className="tidy small" style={{ marginTop: 10 }}>{QUESTIONS.map(q => <li key={q[0]}><b>{q[0]}:</b> {q[1]}</li>)}</ul></section>
        </div>
      </div>
    </>);
}
