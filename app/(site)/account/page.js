import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import ClaimUsername from "../../../components/ClaimUsername";
import EditProfile from "../../../components/EditProfile";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Your Node</div>
      <div className="page-subtitle">{user.email}</div>

      {/* temporary diagnostic - remove once the profile-lookup issue is confirmed fixed */}
      <div className="mono" style={{ fontSize: 10, color: "#3A3E75", marginBottom: 14, wordBreak: "break-all" }}>
        DEBUG &middot; signed-in user id: {user.id}
        {profileError && (
          <>
            <br />DEBUG &middot; profile lookup error: {profileError.message} (code {profileError.code || "n/a"})
          </>
        )}
      </div>

      <div className="panel">
        {profile?.username ? (
          <>
            <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#DCDFFF", marginBottom: 14 }}>
              {profile.username}
            </p>
            <EditProfile
              userId={user.id}
              username={profile.username}
              initialBio={profile.bio}
              initialAvatarUrl={profile.avatar_url}
            />
            <Link
              href={`/kin/${profile.username}`}
              className="mono"
              style={{ display: "inline-block", marginTop: 16, fontSize: 11, color: "#6E76B8" }}
            >
              view your public profile &rarr;
            </Link>
          </>
        ) : (
          <ClaimUsername />
        )}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            style={{
              background: "none",
              border: "1px solid #3A3E75",
              borderRadius: 4,
              color: "#B9C0FF",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              padding: "9px 20px",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 20 }}>
        Assignment history, high scores, and the rest of your progress will
        show up here as those pieces come online.
      </p>
    </div>
  );
}
