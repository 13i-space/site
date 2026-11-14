import { currentClub, storageMode } from '../../../lib/gm/store';
import Nav from '../_components/Nav';
import AutoRun from '../_components/AutoRun';
import { Brand, Crest } from '../_components/ui';
import { hasKey } from '../../../lib/gm/runner';
import { AGENTS } from '../../../lib/gm/seed-data';

export default async function Office({ children }) {
    const club = await currentClub();
    const mode = await storageMode();
    const pending = club.queue.filter(q => q.status === 'pending').length;
    const names = Object.fromEntries(AGENTS.map(a => [a.id, a.name]));
    return (<div className="shell">
      <aside className="rail">
        <Brand />
        <div className="clubchip"><Crest club={club}/><div><b>{club.team}</b><span className="s">{club.real ? 'USL League Two' : 'Your club'}</span></div></div>
        <Nav pending={pending} on={club.settings.agentsOn}/>
        <div className="railfoot">{hasKey() ? 'Live agents' : 'Demo mode: no API key.'} · {mode === 'database' ? 'Saved to database' : 'Temporary storage'}</div>
      </aside>
      <main><AutoRun names={names}/>{children}</main>
    </div>);
}
