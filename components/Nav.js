import Link from "next/link";
import { createClient } from "../lib/supabaseServer";

export default async function Nav() {
  let user = null;
  let username = null;
  let avatarUrl = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();
      username = profile?.username || null;
      avatarUrl = profile?.avatar_url || null;
    }
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
        <li><Link href="/forum">Forum</Link></li>
        <li className="nav-dropdown">
          <Link href="/games">Games</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/games/nemesis-command">NEMESIS Command</Link></li>
              <li><Link href="/games/asteroid-belt">Asteroid Belt</Link></li>
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
        <li><Link href="/wiki">Wiki</Link></li>
        <li>
          <Link href={user ? "/account" : "/login"} style={{ display: "flex", alignItems: "center", gap: 6, color: user ? "#B9C0FF" : undefined }}>
            {user && (
              <span style={{
                width: 18, height: 18, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                background: "#1C1F48", border: "1px solid #3A3E75",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span className="mono" style={{ fontSize: 9, color: "#8B95F6" }}>
                    {(username || user.email)[0].toUpperCase()}
                  </span>
                )}
              </span>
            )}
            {user ? (username || user.email) : "Login"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
