import Link from "next/link";
import { createClient } from "../../../lib/supabaseServer";
import { isAlpha } from "../../../lib/alpha";
import KinRoom from "../../../components/KinRoom";

// Each space gets its own pair of colours for its glyph (Update 5.57)
const GLYPH = [["#E9D29A", "#E8CFC0"], ["#B9C0FF", "#8B95F6"], ["#6FC3A8", "#B9E4D4"], ["#E8B4C8", "#E8CFC0"], ["#C9B8F0", "#8B95F6"]];

export default async function ForumHub() {
  const supabase = await createClient();
  const { data: allSpaces } = await supabase
    .from("forum_spaces")
    .select("*")
    .order("sort_order");

  // the Alpha Users Private Forum is listed only for Alpha Users
  const { data: { user } } = await supabase.auth.getUser();
  let me = null;
  let unread = 0;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    me = data ? { ...data, created_at: data.created_at || user.created_at } : null;
    const { count } = await supabase.from("direct_messages").select("id", { count: "exact", head: true }).eq("recipient_id", user.id).is("read_at", null);
    unread = count || 0;
  }
  const spaces = (allSpaces || []).filter((s) => !(s.alpha_only || s.slug === "alpha") || isAlpha(me));

  // thread counts per space, done as a lightweight second query
  const { data: threads } = await supabase.from("forum_threads").select("space_id");
  const counts = {};
  (threads || []).forEach((t) => { counts[t.space_id] = (counts[t.space_id] || 0) + 1; });

  const { data: spacesWithId } = await supabase.from("forum_spaces").select("id, slug");
  const countBySlug = {};
  (spacesWithId || []).forEach((s) => { countBySlug[s.slug] = counts[s.id] || 0; });

  return (
    <KinRoom room="forum" title="The Forum" line="A meeting place for Kin. New guests are always welcome: pull up a chair." unread={unread}>
      <div className="kr-note">
        <strong style={{ color: "#F5EEDB" }}>New here?</strong> Say hello: tell us what brought you to 13i, or what you&rsquo;d like to see next.
        {!user && <> <Link href="/login?next=/forum">Sign in</Link> to post; anyone can read.</>}
      </div>
      <div className="kr-spaces">
        {(spaces || []).map((s, i) => {
          const [c1, c2] = GLYPH[i % GLYPH.length];
          const n = countBySlug[s.slug] || 0;
          return (
            <Link key={s.slug} href={`/forum/${s.slug}`} className={`kr-card ${s.slug === "alpha" ? "kr-space-alpha" : ""}`}>
              <div className="kr-space-top">
                <span className="kr-space-glyph" style={{ "--c1": c1, "--c2": c2 }}>{s.slug === "alpha" ? "\u03b1" : (s.name || "?").replace(/^the\s+/i, "")[0]}</span>
                <span className="mono kr-count">{n} {n === 1 ? "thread" : "threads"}</span>
              </div>
              <div className="kr-space-name">{s.name}</div>
              <p className="kr-space-desc">{s.description}</p>
              <span className="mono kr-go">step in &rarr;</span>
            </Link>
          );
        })}
      </div>
    </KinRoom>
  );
}
