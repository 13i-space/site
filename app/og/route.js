import { ImageResponse } from "next/og";
import { OG_SIZE, absolute } from "../../lib/og";

// The default link preview for any 13i.space page without its own.
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#07081A", backgroundImage: "radial-gradient(circle at 50% 40%, #1A1D4A 0%, #07081A 70%)", color: "#DCDFFF" }}>
        <img src={absolute("/13i-logo.png")} width={260} height={260} style={{ objectFit: "contain" }} />
        <div style={{ marginTop: 28, fontSize: 40, fontStyle: "italic", color: "#B9C0FF" }}>a signal, translated</div>
        <div style={{ marginTop: 18, fontSize: 24, letterSpacing: 6, color: "#6E76B8" }}>13I.SPACE</div>
      </div>
    ),
    OG_SIZE
  );
}
