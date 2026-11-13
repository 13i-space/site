import SetupForm from './_components/SetupForm';
import { currentClub } from '../../lib/gm/store';
import { hasKey } from '../../lib/gm/runner';
export default async function Door() {
    const club = await currentClub();
    return (<div className="door">
      <section className="door-l">
        <span className="brand"><span className="mark">GM</span><b>VIRTUAL GM</b></span>
        <div>
          <h1>Your front office, staffed.</h1>
          <p style={{ marginTop: 16 }}>Tell us your name and your team. Eleven agents set up the club, find local sponsors and draft the work. You approve everything before it goes out.</p>
        </div>
        <div className="small" style={{ color: '#7A8D90' }}>Working name. {hasKey() ? 'Live agents are on.' : 'Demo mode: no API key, so setup stays blank for new clubs.'}</div>
      </section>
      <SetupForm defaultName={club.user} defaultTeam={club.team} live={hasKey()}/>
    </div>);
}
