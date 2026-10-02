import Link from "next/link";
import { archiveStory, storyLabel } from "../../../lib/archiveStories";
import { INTERACTIVE_STORIES } from "../../../lib/interactive";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import ClaimUsername from "../../../components/ClaimUsername";
import EditProfile from "../../../components/EditProfile";
import { isSentinelUser } from "../../../lib/sentinel";
import { isBriefUser } from "../../../lib/story/briefAccess";
import YourSpecies from "../../../components/YourSpecies";
import FirstAssignment from "../../../components/FirstAssignment";
import { gatherVisitor } from "../../../lib/visitorContext";
import { QUIZ } from "../../../lib/universeQuiz";
import { isAlpha, alphaNumber, ALPHA_FORUM } from "../../../lib/alpha";
import AlphaBadge from "../../../components/AlphaBadge";
import SpaceCoreNode from "../../../components/SpaceCoreNode";

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
    .select("*") // includes alpha / alpha_number once docs/v5.10-alpha-users.sql is run
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
  otherNumbers.forEach((n) => { if (!titleByNumber[n] && archiveStory(n)) titleByNumber[n] = archiveStory(n).designation; });

  // Interactive Assignments: which records (endings) this Kin has found.
  // Needs docs/v5.34-interactive-assignments.sql; until then, nothing found.
  let foundByStory = {};
  try {
    const { data: runs, error } = await supabase.from("interactive_runs").select("story, ending").eq("user_id", user.id);
    if (!error) (runs || []).forEach((r) => { (foundByStory[r.story] = foundByStory[r.story] || new Set()).add(r.ending); });
  } catch (e) {
    foundByStory = {};
  }

  const { data: scores } = await supabase
    .from("high_scores")
    .select("game, score")
    .eq("user_id", user.id)
    .order("score", { ascending: false });

  // Species from the Alien Lab. "*" so the optional portrait_svg
  // (docs/v5.2) and stats (docs/v5.7) columns come along when present.
  const { data: species } = await supabase
    .from("alien_species")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(24);

  // Latest Universe Quiz result (needs docs/v5.4-quiz-results.sql)
  const { data: quiz } = await supabase
    .from("quiz_results")
    .select("quiz_id, score, total, grade, taken_at")
    .eq("user_id", user.id)
    .maybeSingle();

  // SpaceCore (needs docs/v5.39-spacecore.sql; until then the panel stays away)
  let spacecore = null;
  try {
    const [{ data: scPlayer, error: e1 }, { data: scColony, error: e2 }] = await Promise.all([
      supabase.from("spacecore_players").select("summary").eq("user_id", user.id).maybeSingle(),
      supabase.from("spacecore_colony").select("stage, have").eq("id", 1).maybeSingle(),
    ]);
    if (!e1 && !e2) spacecore = { player: scPlayer, colony: scColony };
  } catch (e) {
    spacecore = null;
  }

  const sentinel = isSentinelUser(profile?.username);
  // Aaron's Story of Self briefing (lib/story/briefAccess.js): a hidden panel
  // that only shows for the usernames listed there.
  const storyBrief = isBriefUser(profile?.username);

  // Both label and the game's own page, so a score in this list can link
  // straight back to where it was earned (same idea as the Stories Read
  // list below).
  const GAMES = {
    "nemesis-command": { label: "NEMESIS Command", href: "/games/nemesis-command" },
    "asteroid-belt": { label: "Asteroid Belt", href: "/games/asteroid-belt" },
    "13i-vs-nemesis": { label: "13i vs NEMESIS", href: "/games/13i-vs-nemesis" },
    "deep-signal": { label: "13i: The Deep Signal", href: "/games/deep-signal" },
    sixteen: { label: "SIXTEEN", href: "/games/sixteen" },
    tacet: { label: "TACET", href: "/games/tacet" },
  };

  const alphaProfile = { ...profile, created_at: profile?.created_at || user.created_at };
  const alpha = isAlpha(alphaProfile);

  // unread private messages (docs/v5.12-forum-order-and-messages.sql)
  const { count: unread } = await supabase
    .from("direct_messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  // Lyra's bond with this Kin (lib/lyraBond.js), for the vitals row
  let bondName = null;
  try { bondName = (await gatherVisitor(supabase))?.bond?.name || null; } catch (e) { bondName = null; }

  const vitals = [
    { label: "STORIES READ", value: (reading || []).length, href: "/assignments" },
    { label: "SPECIES", value: (species || []).length, href: "/galaxy/aliens" },
    { label: "GAMES SCORED", value: (scores || []).length, href: "/games" },
    { label: "QUIZ", value: quiz?.grade || "\u2014", href: "/quiz" },
    spacecore && { label: "MARS", value: spacecore.player ? `Lv ${spacecore.player.summary?.level || 1}` : "\u2014", href: "/create/spacecore" },
    { label: "MESSAGES", value: unread ? `${unread} new` : "\u2709", href: "/messages", hot: !!unread },
    bondName && { label: "LYRA", value: bondName, small: true },
  ].filter(Boolean);

  return (
    <div className="node">
      <div style={{ textAlign: "center" }}>
        <div className="page-title">Your Node</div>
        <div className="page-subtitle">{user.email}</div>
        {sentinel && (
          <Link
            href="/sentinel-x"
            className="panel"
            style={{ display: "block", maxWidth: 420, margin: "0 auto 18px", borderColor: "#6B5E3E", textDecoration: "none" }}
          >
            <div className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>SITE DASHBOARD</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginTop: 4 }}>
              Sentinel-X &rarr;
            </div>
          </Link>
        )}
        {storyBrief && (
          <Link
            href="/story/aaron"
            className="panel"
            style={{ display: "block", maxWidth: 420, margin: "0 auto 18px", borderColor: "#C25B34", background: "rgba(194,91,52,0.07)", textDecoration: "none" }}
          >
            <div className="mono" style={{ fontSize: 10, color: "#E8CFC0", letterSpacing: "1.5px" }}>TOP SECRET &middot; SOMETHING I BUILT FOR YOU</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#F2DDD0", marginTop: 4 }}>
              Story of Self &rarr;
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "#B7A398", marginTop: 6 }}>for your eyes only</div>
          </Link>
        )}
      </div>

      <div className="node-vitals">
        {vitals.map((v) => {
          const inner = (
            <>
              <span className="mono" style={{ display: "block", fontSize: 9.5, letterSpacing: "1.5px", color: "#565B8F" }}>{v.label}</span>
              <span style={{ display: "block", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: v.small ? 18 : 26, color: v.hot ? "#E8CFC0" : "#DCDFFF", marginTop: 4, lineHeight: 1.1 }}>{v.value}</span>
            </>
          );
          return v.href ? (
            <Link key={v.label} href={v.href} className="node-tile launch-card">{inner}</Link>
          ) : (
            <div key={v.label} className="node-tile">{inner}</div>
          );
        })}
      </div>

      <div className="node-grid">
        {/* left: who you are, and what 13i has asked of you */}
        <div className="node-col">
          <div className="panel">
            <div className="mono node-label">KIN</div>
            {profile?.username ? (
              <>
                <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#DCDFFF", margin: "0 0 14px" }}>
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

          {alpha && (
            <div className="panel" style={{ borderColor: "#6B5E3E", background: "rgba(201,185,143,0.05)" }}>
              <AlphaBadge profile={alphaProfile} variant="full" />
              <p style={{ fontSize: 13.5, color: "#B7BADF", lineHeight: 1.65, margin: "12px 0 10px" }}>
                You found 13i before Beta. You're one of the people testing it and
                shaping what it becomes{alphaNumber(profile) ? `, Alpha ${alphaNumber(profile)}` : ""}. Thank you.
              </p>
              <Link href={ALPHA_FORUM} className="mono" style={{ fontSize: 11.5, color: "#E8CFC0" }}>
                suggest a change in the Alpha Users Private Forum &rarr;
              </Link>
            </div>
          )}

          <FirstAssignment variant="node" />
        </div>

        {/* right: what you've done here */}
        <div className="node-col">
          {spacecore && <SpaceCoreNode player={spacecore.player} colony={spacecore.colony} />}

          {scores && scores.length > 0 && (
            <div className="panel">
              <div className="mono node-label">HIGH SCORES</div>
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

          {quiz && (
            <Link href="/quiz" className="panel" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 38, color: "#DCDFFF", lineHeight: 1, minWidth: 56 }}>{quiz.grade}</span>
              <span style={{ flex: 1 }}>
                <span className="mono" style={{ display: "block", fontSize: 10, color: "#565B8F", letterSpacing: "1px" }}>UNIVERSE QUIZ &middot; LATEST</span>
                <span style={{ display: "block", fontSize: 13.5, color: "#D9DCFF", marginTop: 2 }}>
                  {quiz.score} of {quiz.total} &middot; {new Date(quiz.taken_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "#8B95F6" }}>
                  {quiz.quiz_id === QUIZ.id ? "retake the quiz \u2192" : "a new quiz is up \u2192"}
                </span>
              </span>
            </Link>
          )}

          <YourSpecies initial={species || []} username={profile?.username} />

          {reading && reading.length > 0 && (
            <div className="panel">
              <div className="mono node-label">STORIES READ</div>
              {reading.map((r) => (
                <Link
                  key={r.assignment_number}
                  href={r.assignment_number === 1 ? "/assignments/0000001" : `/assignments/${r.assignment_number}`}
                  className="mono"
                  style={{ display: "block", fontSize: 11, color: "#6E76B8", padding: "6px 0", borderBottom: "1px solid #21244A", textDecoration: "none" }}
                >
                  {storyLabel(titleByNumber[r.assignment_number], r.assignment_number)} &rarr;
                </Link>
              ))}
            </div>
          )}

          <div className="panel">
            <div className="mono node-label">INTERACTIVE ASSIGNMENTS</div>
            {INTERACTIVE_STORIES.map((st) => {
              const endings = Object.entries(st.endings).sort((a, b) => a[1].order - b[1].order);
              const found = foundByStory[st.number] || new Set();
              return (
                <Link
                  key={st.number}
                  href={`/assignments/${st.number}/interactive`}
                  className="mono"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 11, color: "#6E76B8", padding: "7px 0", borderBottom: "1px solid #21244A", textDecoration: "none" }}
                >
                  <span>{storyLabel(st.title, st.number)} &rarr;</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} title={`${found.size} of ${endings.length} records found`}>
                    {endings.map(([id, e]) => (
                      <span key={id} style={{ width: 7, height: 7, borderRadius: 1, background: found.has(id) ? (e.canon ? "#E8CFC0" : "#8B95F6") : "transparent", border: `1px solid ${found.has(id) ? (e.canon ? "#E8CFC0" : "#8B95F6") : "#3A3E75"}` }} />
                    ))}
                    <span style={{ marginLeft: 6, color: found.size ? "#B9C0FF" : "#565B8F" }}>{found.size}/{endings.length}</span>
                  </span>
                </Link>
              );
            })}
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", marginTop: 10 }}>each square is a record · the warm one is canon</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
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
        <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16 }}>
          More of your progress will show up here as new pieces come online.
        </p>
      </div>
    </div>
  );
}
