import SetupForm from './_components/SetupForm';
import Pitch from './_components/Pitch';
import { Brand } from './_components/ui';
import { currentClub } from '../../lib/gm/store';
import { hasKey } from '../../lib/gm/runner';

const Icon = ({ d }) => <svg viewBox="0 0 24 24" fill="none" stroke="#C9F23A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

export default async function Door() {
  const club = await currentClub();
  return (
    <div className="home">
      <header className="home-top">
        <Brand href="/gm" />
        <span className="small" style={{ color: '#9FB2C8' }}>Working name · private demo</span>
      </header>

      <section className="hero">
        <div className="turf" aria-hidden="true" />
        <div>
          <span className="kicker">AI front office for soccer clubs</span>
          <h1>Your club.<br /><em>Fully staffed.</em></h1>
          <p className="lede">Eleven agents take the sponsor hunt, the group sales, the paperwork and the match-day grind. Every morning they hand you leads and drafts that are ready to send. You make the calls.</p>
          <div className="proof">
            <div><b>11</b><span>agents on your roster</span></div>
            <div><b>10+</b><span>new sponsor leads each morning</span></div>
            <div><b>0</b><span>messages sent without your yes</span></div>
          </div>
        </div>
        <SetupForm defaultName={club.user} defaultTeam={club.team} live={hasKey()} />
      </section>

      <section className="band">
        <div className="inner">
          <span className="eyebrow">The starting eleven</span>
          <h2 style={{ marginTop: 10 }}>A full squad from day one</h2>
          <p className="sub">Set up your club and the agents that matter most start working at once. Switch the rest on as you need them.</p>
          <div style={{ marginTop: 28 }}><Pitch allOn links={false} /></div>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="inner">
          <div className="feat">
            <div className="f"><span className="ic"><Icon d="M3 17l6-6 4 4 8-8M15 7h6v6" /></span><h3>Sponsors, on repeat</h3><p>Every morning a fresh batch of local businesses, scored, with a named contact, a sourced email and a note written for that person. Tweak a line, press send.</p></div>
            <div className="f"><span className="ic"><Icon d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" /></span><h3>Full stands</h3><p>Youth clubs, academies, select teams, schools and employers. The search starts at your gates and widens ring by ring as your list grows.</p></div>
            <div className="f"><span className="ic"><Icon d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Zm-3 9 2 2 4-4" /></span><h3>You stay in control</h3><p>Agents only draft. Nothing leaves the building without your approval, and prices appear only when you have confirmed them.</p></div>
          </div>
        </div>
      </section>

      <section className="band dark">
        <div className="inner">
          <span className="eyebrow" style={{ color: '#C9F23A' }}>A morning with Virtual GM</span>
          <h2 style={{ marginTop: 10 }}>Show up. The work is done.</h2>
          <div className="morning">
            <div className="m"><span className="t">6:30</span><h3>The sprint</h3><p>Sponsorship and Tickets search side by side and find the day&apos;s new leads.</p></div>
            <div className="m"><span className="t">7:00</span><h3>The brief</h3><p>The GM tells you what moved, what is stuck and what needs your yes.</p></div>
            <div className="m"><span className="t">8:00</span><h3>Your yes</h3><p>Replies and revenue first. Approve, tweak, skip. One screen.</p></div>
            <div className="m"><span className="t">8:10</span><h3>Send</h3><p>One click opens each email in your own inbox, addressed and ready.</p></div>
          </div>
        </div>
      </section>

      <footer className="foot"><span>Virtual GM · working name · demo</span><span>Built for minor-league and lower-division clubs</span></footer>
    </div>
  );
}
