import Link from "next/link";
import InteractiveCard from "../../../../components/InteractiveCard";
import { INTERACTIVE_STORIES } from "../../../../lib/interactive";

export const metadata = {
  title: "Interactive Assignments",
  description: "13i's short stories, told so you choose. You are 13i: observe, communicate, intervene - and live with the record that results.",
};

export default function InteractiveIndexPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-title">Interactive Assignments</div>
      <div className="page-subtitle">the archive, and you inside it</div>

      <p style={{ color: "#A9AEDB", fontSize: 15, lineHeight: 1.7, maxWidth: 680, marginTop: -8 }}>
        Every Assignment is 13i sent somewhere, uncertain, choosing as it goes. In these, the choosing is yours. You can
        observe, communicate, analyze or intervene, and some choices stay closed until 13i has learned enough to make
        them. One record is the story as written. The others are what might have happened instead.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
        {INTERACTIVE_STORIES.map((s) => (
          <InteractiveCard key={s.number} story={s} />
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#565B8F", marginTop: 32, fontStyle: "italic" }}>
        Every interactive record starts as a short story.{" "}
        <Link href="/assignments" style={{ color: "#8B95F6" }}>Read the Archive</Link>.
      </p>
    </div>
  );
}
