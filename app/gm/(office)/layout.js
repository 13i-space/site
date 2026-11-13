import Link from 'next/link';
import { currentClub } from '../../../lib/gm/store';
import Nav from '../_components/Nav';
import { hasKey } from '../../../lib/gm/runner';
export default async function Office({ children }) {
    const club = await currentClub();
    const pending = club.queue.filter(q => q.status === 'pending').length;
    return (<div className="shell">
      <aside className="rail">
        <Link className="brand" href="/gm/brief"><span className="mark">GM</span><b>VIRTUAL GM</b></Link>
        <div className="clubchip"><span className="crest"/><div><b>{club.team}</b><span>{club.real ? 'USL League Two' : 'Your club'}</span></div></div>
        <Nav pending={pending}/>
        <div className="railfoot">{hasKey() ? 'Live agents' : 'Demo mode: add ANTHROPIC_API_KEY to run agents for real.'}</div>
      </aside>
      <main>{children}</main>
    </div>);
}
