import { ImageResponse } from "next/og";
import { OG_SIZE, publicRows, svgDataUri } from "../../../../lib/og";
import { cardTagline } from "../../../../lib/alienTraits";
import { ALL_STATS, statsFor } from "../../../../lib/alienStats";
import { verdictFor } from "../../../../lib/continuance";

// Link preview for one species' page (/galaxy/aliens/<id>): its portrait,
// name, flavour line, strongest stats and 13i's verdict.
export const runtime = "edge";

export async function GET(request, { params }) {
  const id = String(params.id || "").replace(/[^0-9a-f-]/gi, "");
  const [sp] = await publicRows(`alien_species?id=eq.${id}&select=*`);
  if (!sp) return Response.redirect(new URL("/og", request.url));
  const [profile] = await publicRows(`profiles?id=eq.${sp.user_id}&select=username`);

  const { stats } = statsFor(sp);
  const top = [...ALL_STATS]
    .map((s) => ({ ...s, share: (Number(stats[s.id]) || 0) / s.group.pool, value: String(Math.round(Number(stats[s.id]) || 0)) })) // text: the image renderer rejects bare numbers
    .sort((a, b) => b.share - a.share)
    .slice(0, 3);
  const verdict = verdictFor(sp);
  let portrait = null;
  try { portrait = sp.portrait_svg ? svgDataUri(sp.portrait_svg) : null; } catch (e) { portrait = null; }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", padding: 56, backgroundColor: "#07081A", backgroundImage: "linear-gradient(135deg, #14163A 0%, #07081A 100%)", color: "#DCDFFF" }}>
        <div style={{ display: "flex", padding: 12, borderRadius: 22, backgroundColor: "#07081A", backgroundImage: "linear-gradient(145deg, #C9B98F 0%, #6B5E3E 35%, #8B95F6 70%, #C9B98F 100%)" }}>
          <div style={{ display: "flex", width: 460, height: 460, borderRadius: 14, background: "#0A0B1C", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
            {portrait ? <img src={portrait} width={460} height={460} style={{ objectFit: "cover" }} /> : <div style={{ fontSize: 22, color: "#3A3E75", letterSpacing: 4 }}>NO PORTRAIT YET</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 56, flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#C9B98F" }}>ALIENS OF THE GALAXY</div>
          <div style={{ fontSize: 68, fontStyle: "italic", lineHeight: 1.05, marginTop: 14 }}>{sp.name || "Unnamed species"}</div>
          <div style={{ fontSize: 28, color: "#E8CFC0", fontStyle: "italic", marginTop: 16 }}>{cardTagline(sp.answers) || " "}</div>
          <div style={{ display: "flex", marginTop: 30 }}>
            {top.map((s) => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", marginRight: 26, paddingLeft: 12, borderLeft: `4px solid ${s.group.color}` }}>
                <div style={{ fontSize: 18, color: "#8A8FBF", letterSpacing: 2 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 40, color: "#E4E4EF" }}>{s.value}</div>
              </div>
            ))}
          </div>
          {verdict && (
            <div style={{ display: "flex", marginTop: 30, alignSelf: "flex-start", border: `3px solid ${verdict.color}`, color: verdict.color, borderRadius: 8, padding: "8px 16px", fontSize: 22, letterSpacing: 3 }}>
              {verdict.label.toUpperCase()}
            </div>
          )}
          <div style={{ fontSize: 22, color: "#6E76B8", marginTop: 34 }}>{`by ${profile?.username || "a Kin"} · 13i.space`}</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
