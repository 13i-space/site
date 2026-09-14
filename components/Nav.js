import Link from "next/link";
import { createClient } from "../lib/supabaseServer";

export default async function Nav() {
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (e) {
    // Auth not configured yet, or a transient error - nav should never
    // break the whole site over this, just show the signed-out state.
    user = null;
  }

  return (
    <nav className="site-nav">
      <Link href="/launch" className="logo wordmark">
        13i
      </Link>
      <ul>
        <li><Link href="/book">Book</Link></li>
        <li><Link href="/music">Music</Link></li>
        <li><Link href="/oracle">Oracle</Link></li>
        <li className="nav-dropdown">
          <Link href="/games">Games</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/games/nemesis-command">NEMESIS Command</Link></li>
              <li><Link href="/games/13i-vs-nemesis">13i vs NEMESIS</Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/artifacts">Artifacts</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/artifacts/ninefold">The Ninefold</Link></li>
              <li><Link href="/artifacts/cryptex">The Cryptex</Link></li>
            </ul>
          </div>
        </li>
        <li><Link href="/wiki">Wiki</Link></li>
        <li><Link href="/assignments">Assignments</Link></li>
        <li className="nav-dropdown">
          <Link href="/galaxy">Galaxy</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/galaxy/map">The Map</Link></li>
              <li><Link href="/galaxy/facts">Galaxy Facts</Link></li>
              <li><Link href="/galaxy/quiz">Galaxy Quiz</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Link href="/account" style={user ? { color: "#B9C0FF" } : undefined}>
            {user ? `Signed in \u2013 ${user.email}` : "Account"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
