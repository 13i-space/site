import AlienPlaceholder from "../../../components/AlienPlaceholder";

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
      <AlienPlaceholder size={180} />
      <div style={{ marginTop: 20 }}>
        <div className="page-title" style={{ marginBottom: 4 }}>
          Paul Donaghy
        </div>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F" }}>
          writer &middot; composer &middot; the person behind 13i
        </div>
      </div>

      <div style={{ textAlign: "left", marginTop: 36, fontSize: 15, lineHeight: 1.85, color: "#C7CAE8" }}>
        <p style={{ fontStyle: "italic", color: "#6E76B8", fontSize: 13, marginBottom: 24 }}>
          (a first draft, written to see what landed — the real version, in
          my own words, is coming)
        </p>

        <p>
          I'm the person writing the 13i trilogy, composing and producing
          its music, and — slowly, one page at a time — building this site
          by hand.
        </p>
        <p>
          I run Tempo Goat Studios, where the music for this project takes
          shape. Every track is written, performed, and produced without
          AI involved in the composition itself — even though AI is very
          much part of the story the book and the music are telling
          together.
        </p>
        <p>
          The idea at the center of 13i — that we share far more with each
          other than the things that seem to divide us — isn't just a plot
          point. It's the reason this project exists at all, and the reason
          the book and the music are being given away rather than sold.
          If this makes even a small dent in that direction for someone,
          that matters more to me than anything this project could earn.
        </p>
        <p>
          I'm not a web developer by trade, which means every page on this
          site has been a small, hard-won lesson — DNS records, GitHub,
          deployment pipelines, all of it learned in service of getting
          this universe into a shape other people can actually visit. If
          you're reading this, it worked.
        </p>
        <p>
          More of my own story will go here soon. For now, this is what
          the process looked like from the inside.
        </p>
      </div>
    </div>
  );
}
