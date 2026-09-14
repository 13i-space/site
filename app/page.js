import "./globals.css";
import Countdown from "../components/Countdown";
import ThemedHero from "../components/ThemedHero";
import EmailSignup from "../components/EmailSignup";

export default function CountdownPage() {
  return (
    <div style={styles.page}>
      <ThemedHero logoWrapStyle={styles.logoWrap} />
      <div style={styles.glow} />
      <div className="mono" style={styles.subtitle}>
        a signal, received
      </div>
      <p style={styles.tagline}>
        We have been watching for some time. What we found, we are about to
        share.
      </p>
      <Countdown />
      <p className="mono" style={styles.footNote}>
        the book and the first signal arrive 4.6.2027
      </p>
      <div style={{ ...styles.signupWrap }}>
        <div className="mono" style={styles.signupLabel}>
          get updates before launch
        </div>
        <EmailSignup />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 500,
    height: 500,
    background:
      "radial-gradient(circle, rgba(139,149,246,0.18) 0%, rgba(139,149,246,0) 70%)",
    pointerEvents: "none",
  },
  logoWrap: {
    width: "min(70vw, 380px)",
    position: "relative",
    zIndex: 1,
    filter: "drop-shadow(0 0 40px rgba(139,149,246,0.25))",
  },
  subtitle: {
    fontSize: 13,
    color: "#6E76B8",
    letterSpacing: "2px",
    marginTop: 20,
    position: "relative",
    zIndex: 1,
  },
  tagline: {
    color: "#B7BADF",
    maxWidth: 480,
    margin: "18px auto 0",
    position: "relative",
    zIndex: 1,
  },
  footNote: {
    fontSize: 12,
    color: "#565B8F",
    marginTop: 8,
    position: "relative",
    zIndex: 1,
  },
  signupWrap: {
    marginTop: 32,
    position: "relative",
    zIndex: 1,
  },
  signupLabel: {
    fontSize: 11,
    color: "#565B8F",
    letterSpacing: "1px",
    marginBottom: 10,
  },
};
