import StarField from "../../components/StarField";

export default function TransmissionPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <StarField density={100} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "2px", marginBottom: 24 }}>
            SECOND TRANSMISSION &middot; PARTIAL DECODE
          </div>
          <p
            className="mono"
            style={{ fontSize: 15, lineHeight: 2, color: "#D9DCFF", textAlign: "left" }}
          >
            You found this because you were willing to turn something three
            times when the first two didn't work.
          </p>
          <p
            className="mono"
            style={{ fontSize: 15, lineHeight: 2, color: "#D9DCFF", textAlign: "left" }}
          >
            That is closer to what we look for than you might think. Not
            speed. Not the first answer. Whether you stay curious after
            being wrong.
          </p>
          <p
            className="mono"
            style={{ fontSize: 15, lineHeight: 2, color: "#8B95F6", textAlign: "left", marginTop: 24 }}
          >
            status: inter&mdash;
          </p>
          <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 40 }}>
            (the rest hasn't arrived yet.)
          </div>
        </div>
      </div>
    </div>
  );
}
