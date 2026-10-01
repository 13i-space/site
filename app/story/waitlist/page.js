import WaitlistForm from "../_components/WaitlistForm";

export const metadata = { title: "Join the launch list", description: "Story of Self opens in spring 2027, in time for graduation season. Be first in line." };

const WHY = [
  ["First in line", "When Story of Self opens in spring 2027, the list gets in first, ahead of graduation season."],
  ["Unit 1 free", "Character, the first four sessions with your AI Story Champion, is free for everyone."],
  ["Made for the leap", "Built for the year after high school: college, work, a trade, the military, or a gap year."],
];

export default function WaitlistPage() {
  return (
    <div className="wl-page">
      <section className="wl-hero">
        <div className="sh-wrap wl-hero-grid">
          <div>
            <div className="sos-eyebrow">The launch list</div>
            <h1>Be first in line for <em>your</em> story.</h1>
            <p className="sh-lede">Story of Self opens in spring 2027, just in time for graduation. Join the list and we'll save you a seat, whether it's for you, your graduate, or the students you work with.</p>
            <ul className="wl-why">
              {WHY.map(([h, p]) => <li key={h}><b>{h}</b><span>{p}</span></li>)}
            </ul>
          </div>
          <div className="wl-card"><WaitlistForm variant="page" source="waitlist-page" /></div>
        </div>
      </section>
    </div>
  );
}
