export default function TermsPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-title">Terms of Use</div>
      <div className="page-subtitle">last updated September 2026</div>

      <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "#C7CAE8" }}>
        <p>
          By using 13i.space, you agree to the following terms. This is a
          personal, independent creative project, not a commercial platform
          — these terms are meant to be straightforward, not restrictive.
        </p>

        <h3 style={sectionStyle}>The content on this site</h3>
        <p>
          The novel, music, artwork, and characters presented on this site
          (collectively, "the 13i universe") are the original creative work
          of Paul Donaghy / Tempo Goat Studios, and are protected by
          copyright. The rough-draft ebook and music are made available for
          free personal enjoyment, reading, and listening — you're welcome
          to share links to this site, but please don't redistribute
          downloaded files, republish the text, or re-upload the music
          elsewhere without permission.
        </p>

        <h3 style={sectionStyle}>Rough drafts</h3>
        <p>
          Material on this site — including the book and the music — is
          shared in early, unfinished form ahead of official release.
          Content may change, be revised, or be removed as the work
          develops toward its final version.
        </p>

        <h3 style={sectionStyle}>The Oracle</h3>
        <p>
          The Oracle is an interactive fictional experience powered by AI.
          Its responses are generated in-character and are not factual,
          medical, legal, or professional advice of any kind, regardless of
          how they're phrased.
        </p>

        <h3 style={sectionStyle}>Games</h3>
        <p>
          Games on this site are early, in-progress builds shared for fun
          and feedback. They may contain bugs, may change significantly, or
          may be unavailable from time to time.
        </p>

        <h3 style={sectionStyle}>User submissions (future)</h3>
        <p>
          If and when this site opens community submissions (short stories,
          fan art, or similar), separate guidelines will apply at that time,
          including how contributions may be credited or featured.
        </p>

        <h3 style={sectionStyle}>No warranties</h3>
        <p>
          This site is provided as-is, without warranties of any kind. As
          an independent, actively-developed project, occasional downtime,
          bugs, or changes should be expected.
        </p>

        <h3 style={sectionStyle}>Changes to these terms</h3>
        <p>
          These terms may be updated as the site and project evolve. The
          "last updated" date above will reflect any meaningful changes.
        </p>

        <h3 style={sectionStyle}>Contact</h3>
        <p>
          Questions about these terms can be sent via the{" "}
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
