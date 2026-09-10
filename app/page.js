import Countdown from "../components/Countdown";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div className="page-subtitle">a signal, translated</div>
      <h1 className="wordmark" style={{ fontSize: 56, marginBottom: 0 }}>
        13i
      </h1>
      <p style={{ color: "#B7BADF", maxWidth: 480, margin: "20px auto 0" }}>
        We have been watching for some time. What we found, we are choosing
        to share.
      </p>
      <Countdown />
      <p className="mono" style={{ fontSize: 12, color: "#565B8F" }}>
        the book and the first signal arrive 4.6.2027
      </p>
    </div>
  );
}
