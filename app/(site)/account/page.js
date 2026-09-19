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

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: reading } = await supabase
    .from("reading_progress")
    .select("assignment_number, read_at")
    .eq("user_id", user.id)
    .order("read_at", { ascending: false });

  const otherNumbers = (reading || []).map((r) => r.assignment_number).filter((n) => n !== 1);
  let titleByNumber = { 1: "The First Silence" };
  if (otherNumbers.length > 0) {
    const { data: titledRows } = await supabase
      .from("assignment_submissions")
      .select("assignment_number, designation")
      .in("assignment_number", otherNumbers);
    (titledRows || []).forEach((r) => { titleByNumber[r.assignment_number] = r.designation; });
  }

  const { data: scores } = await supabase
    .from("high_scores")
    .select("game, score")
    .eq("user_id", user.id)
    .order("score", { ascending: false });

  const GAME_LABELS = {
    "nemesis-command": "NEMESIS Command",
    "asteroid-belt": "Asteroid Belt",
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Your Node</div>
      <div className="page-subtitle">{user.email}</div>

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

      {scores && scores.length > 0 && (
        <div className="panel" style={{ marginTop: 16, textAlign: "left" }}>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
            HIGH SCORES
          </div>
          {scores.map((s) => (
            <div key={s.game} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#D9DCFF", padding: "6px 0", borderBottom: "1px solid #21244A" }}>
              <span>{GAME_LABELS[s.game] || s.game}</span>
              <span className="mono" style={{ color: "#E8CFC0" }}>{s.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {reading && reading.length > 0 && (
        <div className="panel" style={{ marginTop: 16, textAlign: "left" }}>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
            STORIES READ
          </div>
          {reading.map((r) => (
            <Link
              key={r.assignment_number}
              href={r.assignment_number === 1 ? "/assignments/0000001" : `/assignments/${r.assignment_number}`}
              style={{ display: "block", fontSize: 13.5, color: "#B9C0FF", padding: "6px 0", borderBottom: "1px solid #21244A", textDecoration: "none" }}
            >
              {titleByNumber[r.assignment_number] || `Assignment ${r.assignment_number}`}
            </Link>
          ))}
        </div>
      )}

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
        More of your progress will show up here as new pieces come online.
      </p>
    </div>
  );
}
