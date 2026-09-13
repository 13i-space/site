export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-title">Privacy Policy</div>
      <div className="page-subtitle">last updated September 2026</div>

      <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "#C7CAE8" }}>
        <p>
          13i.space is an independent creative project. This policy explains,
          in plain language, what information this site collects and how
          it's used.
        </p>

        <h3 style={sectionStyle}>What we collect</h3>
        <p>
          <strong>Email address:</strong> if you choose to sign up for
          updates, we collect your email address in order to send you news
          about the book, music, and site. You can unsubscribe at any time
          using the link in any email you receive.
        </p>
        <p>
          <strong>Oracle conversations:</strong> if you use the Oracle
          (the interactive chatbot on this site), the messages you type are
          sent to Anthropic, the company that provides the underlying AI
          model, in order to generate a response. We don't separately
          store a transcript of these conversations ourselves beyond what's
          needed to keep the conversation coherent while you're actively
          using it.
        </p>
        <p>
          <strong>Basic site analytics:</strong> like most websites, this
          site's hosting provider may collect standard technical
          information (such as approximate location, browser type, and
          pages visited) for the purpose of understanding traffic and
          keeping the site running reliably.
        </p>

        <h3 style={sectionStyle}>What we don't do</h3>
        <p>
          We don't sell your information to anyone. We don't use your email
          address for anything beyond updates about this project. We don't
          run third-party advertising on this site.
        </p>

        <h3 style={sectionStyle}>Third-party services</h3>
        <p>
          This site relies on a small number of third-party services to
          function — including hosting (Vercel), AI responses (Anthropic),
          and audio hosting for music (Tempo Goat Studios). Each of these
          providers has its own privacy practices governing the technical
          data necessary to provide their service.
        </p>

        <h3 style={sectionStyle}>Your choices</h3>
        <p>
          You can unsubscribe from email updates at any time. You can use
          this site without ever providing an email address — none of the
          core content (the book, the music, the games) requires signing up
          for anything.
        </p>

        <h3 style={sectionStyle}>Changes to this policy</h3>
        <p>
          If this policy changes in any meaningful way, the "last updated"
          date at the top of this page will change accordingly.
        </p>

        <h3 style={sectionStyle}>Contact</h3>
        <p>
          Questions about this policy can be sent via the{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}

const sectionStyle = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontStyle: "italic",
  fontSize: 19,
  color: "#DCDFFF",
  marginTop: 28,
  marginBottom: 6,
};
