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
        <li className="nav-dropdown">
          <Link href="/explore">Explore</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/book">Book</Link></li>
              <li><Link href="/music">Music</Link></li>
              <li><Link href="/assignments">Short Stories</Link></li>
              <li><Link href="/galaxy">Galaxy</Link></li>
              <li><Link href="/wiki">Wiki</Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/play">Play</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/oracle">Oracle</Link></li>
              <li><Link href="/games">Games</Link></li>
              <li><Link href="/artifacts">Artifacts</Link></li>
              <li><Link href="/galaxy/quiz">Galaxy Quiz</Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/create">Create</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/assignments/write">Write an Assignment</Link></li>
              <li><Link href="/create/alien-lab">The Alien Lab</Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/kinship">Kinship</Link>
          <div className="nav-dropdown-menu">
            <ul className="nav-dropdown-menu-inner">
              <li><Link href="/forum">Forum</Link></li>
              <li><Link href="/guestbook">Guestbook</Link></li>
            </ul>
          </div>
        </li>
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
