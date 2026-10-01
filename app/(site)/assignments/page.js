import Link from "next/link";
import { createClient } from "../../../lib/supabaseServer";
import AssignmentCard from "../../../components/AssignmentCard";
import InteractiveCard from "../../../components/InteractiveCard";
import { INTERACTIVE_STORIES } from "../../../lib/interactive";
import { SEASONS } from "../../../lib/seasons";

export default async function AssignmentsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("assignment_submissions")
    .select("assignment_number, designation, name, type, thumb_url, status, created_at")
    .in("status", ["canon", "archived"])
    .order("created_at", { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  let readNumbers = new Set();
  if (user) {
    const { data: reading } = await supabase
      .from("reading_progress")
      .select("assignment_number")
      .eq("user_id", user.id);
    readNumbers = new Set((reading || []).map((r) => r.assignment_number));
  }

  const aiRows = (rows || []).filter((r) => r.type === "ai");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-title">Assignments</div>
      <div className="page-subtitle">
        Every Assignment is 13i sent somewhere, uncertain, asked to report back. Some are already told. Some are yours to write.
      </div>

      {(() => {
        const s = SEASONS[SEASONS.length - 1];
        const w = s && s.weeks[s.weeks.length - 1];
        if (!w) return null;
        return (
          <Link href={`/seasons/${s.number}/${w.week}`} className="launch-card" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26, padding: "14px 18px", border: "1px solid #6B5E3E", borderRadius: 4, background: "rgba(14,16,38,0.72)", textDecoration: "none", color: "inherit" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#C9B98F", flexShrink: 0 }}>{s.title.toUpperCase()} · WEEK {w.week}</div>
            <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF" }}>{w.title}</div>
            <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginLeft: "auto" }}>six ways in &rarr;</div>
          </Link>
        );
      })()}

      <div style={{ marginTop: 30 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF" }}>Interactive Assignments</div>
          <Link href="/assignments/interactive" className="mono" style={{ fontSize: 11, color: "#6E76B8" }}>what are these? &rarr;</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {INTERACTIVE_STORIES.map((s) => (
            <InteractiveCard key={s.number} story={s} compact />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginTop: 30 }}>
        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>Human Written 13i Short Stories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AssignmentCard
              number={1}
              title="The First Silence"
              author="Paul Donaghy"
              type="human"
              thumbUrl="/covers/assignment-0000001-thumb.jpg"
              href="/assignments/0000001"
              alreadyRead={readNumbers.has(1)}
            />
          </div>

          <Link
            href="/assignments/write"
            className="launch-card"
            style={{
              display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #3A3E75",
              borderRadius: 4, padding: "20px 22px", textDecoration: "none", color: "inherit", marginTop: 10,
            }}
          >
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 6 }}>
              Write an Assignment
            </div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
              You are 13i. You have been sent somewhere. Tell us what happens.
            </p>
          </Link>
        </div>

        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>AI Written 13i Short Stories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {aiRows.map((r) => (
              <AssignmentCard
                key={r.assignment_number}
                number={r.assignment_number}
                title={r.designation}
                author={r.name}
                type={r.type}
                thumbUrl={r.thumb_url}
                href={`/assignments/${r.assignment_number}`}
                alreadyRead={readNumbers.has(r.assignment_number)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
