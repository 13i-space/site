'use client';
import { useState, useTransition } from 'react';
import { setRating } from '../../../lib/gm/actions';
import { ovr } from '../../../lib/gm/text';
export default function Ratings({ players, weights }) {
    const [ps, setPs] = useState(players);
    const [sel, setSel] = useState(0);
    const [, go] = useTransition();
    const order = ps.map((p, i) => ({ p, i, o: ovr(p.r, weights) })).sort((a, b) => b.o - a.o);
    const cur = ps[sel];
    if (!cur)
        return <div className="card"><h3>No players yet</h3><p className="mute" style={{ marginTop: 6 }}>Run the Team &amp; Tryouts agent after tryout forms come in.</p></div>;
    const labels = ['Technical', 'Physical', 'Mental'];
    return (<div className="split" style={{ gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)' }}>
      <section className="card" style={{ padding: 0 }}><div className="tablewrap"><table>
        <thead><tr><th>Player</th><th>Pos</th><th>TEC</th><th>PHY</th><th>MEN</th><th>OVR</th></tr></thead>
        <tbody>{order.map(({ p, i, o }) => (<tr key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer', background: i === sel ? 'var(--soft)' : undefined }}>
            <td><b>{p.name}</b></td><td>{p.pos}</td><td className="num">{p.r[0]}</td><td className="num">{p.r[1]}</td><td className="num">{p.r[2]}</td><td className="num"><b>{o}</b></td></tr>))}</tbody>
      </table></div></section>
      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <div className="row spread"><div><div className="eyebrow">{cur.pos}</div><h3 style={{ marginTop: 4 }}>{cur.name}</h3></div><div className="ovr num">{ovr(cur.r, weights)}</div></div>
        {labels.map((l, k) => (<div className="rate" key={l}><label htmlFor={`r${k}`} style={{ margin: 0 }}>{l}</label>
            <input id={`r${k}`} type="range" min={40} max={99} value={cur.r[k]} onChange={e => { const v = +e.target.value; setPs(ps.map((p, i) => i === sel ? { ...p, r: p.r.map((x, j) => j === k ? v : x) } : p)); }} onMouseUp={() => go(() => setRating(sel, k, ps[sel].r[k]))} onTouchEnd={() => go(() => setRating(sel, k, ps[sel].r[k]))} onKeyUp={() => go(() => setRating(sel, k, ps[sel].r[k]))}/>
            <b className="num">{cur.r[k]}</b></div>))}
        <p className="small mute">Weights {weights.map(w => Math.round(w * 100) + '%').join(' / ')}. League eligibility is checked separately. The agent flags, a person decides.</p>
      </section>
    </div>);
}
