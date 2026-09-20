import Link from "next/link";
import { createClient } from "../../../lib/supabaseServer";
import AssignmentCard from "../../../components/AssignmentCard";

export default async function AssignmentsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("assignment_submissions")
    .select("assignment_number, designation, name, type, thumb_url, status")
    .in("status", ["canon", "archived"])
    .order("assignment_number", { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();
  let readNumbers = new Set();
  if (user) {
    const { data: reading } = await supabase
      .from("reading_progress")
      .select("assignment_number")
      .eq("user_id", user.id);
    readNumbers = new Set((reading || []).map((r) => r.assignment_number));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-title">Assignments</div>
      <div className="page-subtitle">
        Every Assignment is 13i sent somewhere, uncertain, asked to report back. Some are already told. Some are yours to write.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginTop: 30 }}>
        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>Read</div>
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
            {(rows || []).map((r) => (
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

        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>Write</div>
          <Link
            href="/assignments/write"
            className="launch-card"
            style={{
              display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #3A3E75",
              borderRadius: 4, padding: "20px 22px", textDecoration: "none", color: "inherit",
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
      </div>
    </div>
  );
}
