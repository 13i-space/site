import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import ClaimUsername from "../../../components/ClaimUsername";
import EditProfile from "../../../components/EditProfile";
import { isSentinelUser } from "../../../lib/sentinel";

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

  // Species from the Alien Lab. Portraits need the portrait_svg column
  // (docs/v5.2-alien-portraits.sql); without it, list the species anyway.
  let { data: species, error: speciesError } = await supabase
    .from("alien_species")
    .select("id, name, answers, portrait_svg, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(24);
  if (speciesError) {
    ({ data: species } = await supabase
      .from("alien_species")
      .select("id, name, answers, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(24));
  }

  const sentinel = isSentinelUser(profile?.username);

  // Both label and the game's own page, so a score in this list can link
  // straight back to where it was earned (same idea as the Stories Read
  // list below).
  const GAMES = {
    "nemesis-command": { label: "NEMESIS Command", href: "/games/nemesis-command" },
    "asteroid-belt": { label: "Asteroid Belt", href: "/games/asteroid-belt" },
    "13i-vs-nemesis": { label: "13i vs NEMESIS", href: "/games/13i-vs-nemesis" },
    "deep-signal": { label: "13i: The Deep Signal", href: "/games/deep-signal" },
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Your Node</div>
      <div className="page-subtitle">{user.email}</div>

      {sentinel && (
        <Link
          href="/sentinel-x"
          className="panel"
          style={{ display: "block", marginBottom: 16, borderColor: "#6B5E3E", textDecoration: "none" }}
        >
          <div className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>SITE DASHBOARD</div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginTop: 4 }}>
            Sentinel-X &rarr;
          </div>
        </Link>
      )}

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
              {GAMES[s.game]?.href ? (
                <Link href={GAMES[s.game].href} style={{ color: "#B9C0FF" }}>
                  {GAMES[s.game].label}
                </Link>
              ) : (
                <span>{GAMES[s.game]?.label || s.game}</span>
              )}
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

      {species && species.length > 0 && (
        <div className="panel" style={{ marginTop: 16, textAlign: "left" }}>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
            YOUR SPECIES
          </div>
          {species.map((sp) => (
            <details key={sp.id} style={{ padding: "8px 0", borderBottom: "1px solid #21244A" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", listStyle: "none" }}>
                {sp.portrait_svg ? (
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sp.portrait_svg)}`}
                    alt=""
                    style={{ width: 56, height: 56, borderRadius: 4, border: "1px solid #262A55", flexShrink: 0 }}
                  />
                ) : (
                  <span style={{ width: 56, height: 56, borderRadius: 4, border: "1px dashed #262A55", flexShrink: 0 }} />
                )}
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 17, color: "#DCDFFF" }}>{sp.name}</span>
                  <span className="mono" style={{ fontSize: 10, color: "#565B8F" }}>
                    {new Date(sp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </span>
              </summary>
              {sp.portrait_svg && (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sp.portrait_svg)}`}
                  alt={`Portrait of ${sp.name}`}
                  style={{ width: "100%", borderRadius: 4, border: "1px solid #262A55", margin: "12px 0 8px", display: "block" }}
                />
              )}
              {Object.entries(sp.answers || {}).map(([q, a]) => (
                <div key={q} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, padding: "4px 0" }}>
                  <span style={{ color: "#565B8F" }}>{q.split(" / ")[0]}</span>
                  <span style={{ color: "#B7BADF", textAlign: "right" }}>{String(a)}</span>
                </div>
              ))}
            </details>
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
