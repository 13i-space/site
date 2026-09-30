import { ImageResponse } from "next/og";
import { OG_SIZE, publicRows, absolute } from "../../../../lib/og";
import { assignmentMeta } from "../../../../lib/assignment1";
import { COMICS } from "../../../../lib/comics";

// Link preview for a short story (/assignments/<number>): its cover beside
// the title, the Archive number, and what versions it comes in.
export const runtime = "edge";

const AUDIO = new Set([1, 87, 215783]);

export async function GET(request, { params }) {
  const number = Number(params.number);
  let story = null;
  if (number === 1) {
    story = { title: assignmentMeta.chapter, subtitle: assignmentMeta.subtitle, cover: "/covers/assignment-0000001.jpg" };
  } else if (Number.isFinite(number)) {
    const [row] = await publicRows(`assignment_submissions?assignment_number=eq.${number}&select=designation,name,type,cover_url,status`);
    if (row && ["canon", "archived"].includes(row.status)) {
      story = {
        title: row.designation,
        subtitle: row.type === "ai" ? "An AI-originated Assignment" : `Written by ${row.name || "a Kin"}`,
        cover: row.cover_url,
      };
    }
  }
  if (!story) return Response.redirect(new URL("/og", request.url));
  const extras = ["Read", AUDIO.has(number) && "Listen", COMICS[number] && "Comic"].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#07081A", backgroundImage: "linear-gradient(135deg, #14163A 0%, #07081A 100%)", color: "#DCDFFF" }}>
        {story.cover && <img src={absolute(story.cover)} width={420} height={630} style={{ objectFit: "cover" }} />}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#6E76B8" }}>{`THE ARCHIVE · ASSIGNMENT ${String(number).padStart(7, "0")}`}</div>
          <div style={{ fontSize: 72, fontStyle: "italic", lineHeight: 1.05, marginTop: 18 }}>{story.title}</div>
          <div style={{ fontSize: 28, color: "#B9C0FF", marginTop: 18 }}>{story.subtitle}</div>
          <div style={{ fontSize: 24, color: "#C9B98F", marginTop: 40, letterSpacing: 2 }}>{extras}</div>
          <div style={{ fontSize: 22, color: "#6E76B8", marginTop: 18 }}>a 13i short story · 13i.space</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
