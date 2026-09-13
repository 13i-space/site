export default function ContactPage() {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Contact</div>
      <div className="page-subtitle">questions, feedback, or just saying hello</div>
      <div className="panel">
        <p style={{ marginBottom: 20 }}>
          For now, the simplest way to reach me is by email. I read
          everything, even if it takes me a while to reply.
        </p>
        <a
          href="mailto:pjdonaghy@gmail.com"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}
        >
          pjdonaghy@gmail.com
        </a>
      </div>
    </div>
  );
}
