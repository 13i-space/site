export default function OraclePage() {
  return (
    <div>
      <div className="page-title">The Oracle</div>
      <div className="page-subtitle">a way to speak to 13i directly</div>

      <div className="panel" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "48px 32px" }}>
        <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>
          13i
        </div>
        <div className="mono" style={{ fontSize: 12, color: "#8B95F6", letterSpacing: "2px", marginBottom: 18 }}>
          COMING SOON
        </div>
        <p style={{ fontSize: 14, color: "#8A8FBF", lineHeight: 1.7, margin: 0 }}>
          The channel isn't open yet. Once it is, you'll be able to speak
          with 13i directly, right here.
        </p>
      </div>
    </div>
  );
}
