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
        <li><Link href="/explore">Explore</Link></li>
        <li><Link href="/play">Play</Link></li>
        <li><Link href="/create">Create</Link></li>
        <li><Link href="/kinship">Kinship</Link></li>
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
