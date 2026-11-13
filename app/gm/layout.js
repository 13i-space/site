// Virtual GM lives at 13i.space/gm but shares nothing with 13i: its own styles, fonts and
// colors. Everything is in app/gm and lib/gm. It is a demo: not indexed, not linked from the
// 13i nav, and optionally behind a passcode (GM_PASSCODE).
import "./gm.css";
import { currentClub } from "../../lib/gm/store";
import { onColor } from "../../lib/gm/text";
import { unlocked } from "../../lib/gm/gate";
import { unlock } from "../../lib/gm/actions";

export const metadata = {
  title: { default: "Virtual GM", template: "%s · Virtual GM" },
  description: "An AI front office for minor-league soccer clubs. Demo.",
  robots: { index: false, follow: false },
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230E8C86'/%3E%3Ctext x='16' y='22' font-family='Arial' font-weight='700' font-size='16' text-anchor='middle' fill='white'%3EGM%3C/text%3E%3C/svg%3E" },
};
export const dynamic = "force-dynamic";

export default async function GmLayout({ children }) {
  const open = await unlocked();
  const club = await currentClub();
  const vars = { "--club": club.colors.secondary, "--club2": club.colors.primary, "--on-club": onColor(club.colors.secondary) };
  return (
    <div className="gm" style={vars}>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Public+Sans:wght@400;500;600&display=swap" />
      {open ? children : (
        <div className="door"><section className="door-l"><span className="brand"><span className="mark">GM</span><b>VIRTUAL GM</b></span><div><h1>Private demo.</h1><p style={{ marginTop: 16 }}>Enter the passcode to continue.</p></div><span /></section>
          <section className="door-r"><form action={unlock} className="grid" style={{ gap: 14 }}>
            <div><label htmlFor="code">Passcode</label><input id="code" name="code" type="password" autoComplete="off" /></div>
            <button className="btn primary" type="submit">Continue</button></form></section></div>
      )}
    </div>
  );
}
