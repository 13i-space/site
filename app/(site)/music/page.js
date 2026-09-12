const BASE = "https://tempogoatstudios.com/wp-content/uploads/2026/09/";

const albums = [
  {
    title: "Signal_Ø",
    year: "Album 1 · Release target April 6, 2027",
    cover: BASE + "Album1-cover-1024x1024.png",
    tracks: [
      "Apprehension",
      "Circadian-Pulse|Circadian Pulse",
      "Disembarkment",
      "Drift|Drift (Can you hear me)",
      "Convergence",
      "Vertigo",
      "Rise",
      "Distant-Moon|Distant Moon",
      "Quantum-Fluctuations|Quantum Fluctuations",
      "Ethereal-Beginnings|Ethereal Beginnings",
      "Introspection",
      "Observer-Effect|Observer Effect",
    ],
  },
  {
    title: "Signal_1",
    year: "Album 2 · Release target April 6, 2028",
    cover: BASE + "Album2-cover-1024x1024.png",
    tracks: [
      "Ominous",
      "Malfunctions-1|Malfunctions",
      "Adaptation",
      "Dark-Energy|Dark Energy",
      "TECHNOlogy",
      "Tranquility|Tranquility (I love you)",
      "Ghost-Particle|Ghost Particle",
      "Proximity-Alert|Proximity Alert",
      "Forbidden",
      "Constellation",
      "Reunification",
      "Sulfuric-Skies|Sulfuric Skies",
    ],
  },
  {
    title: "Signal_∞",
    year: "Album 3 · Release target April 6, 2029",
    cover: BASE + "Album3-cover-1024x1024.png",
    tracks: [
      "Shadow-Operations|Shadow Operations",
      "Autonomous-Covenant|Autonomous Covenant",
      "Rendezvous",
      "Nirvana",
      "Pendulum",
      "Terminal-Lucidity|Terminal Lucidity",
      "Periastron",
      "Untethered",
      "Sentience",
      "Home-World|Home World",
      "Coriolis-Effect|Coriolis Effect",
      "Syntax-Error|Syntax Error",
    ],
  },
];

function parseTrack(entry) {
  const [file, label] = entry.includes("|") ? entry.split("|") : [entry, entry.replace(/-/g, " ")];
  return { file, label };
}

export default function MusicPage() {
  return (
    <div>
      <div className="page-title">The Music</div>
      <div className="page-subtitle">36 signals &middot; 3 years &middot; one per month</div>

      <div className="panel" style={{ marginBottom: 32 }}>
        <p style={{ marginBottom: 14 }}>
          13i is an instrumental electronic music project exploring the
          intersection of science fiction, artificial intelligence,
          consciousness, and emotion. Every composition is 100% human
          written, performed, arranged, and produced. AI is part of the
          narrative in the accompanying 13i sci-fi novel — however AI it is
          not used in the writing/production (novel or music) process.
        </p>
        <p style={{ marginBottom: 14 }}>
          The three (trilogy) pre-release rough draft albums below blend
          cinematic electronic music with melodic synth-wave, progressive
          EDM, ambient textures, and driving rhythms. The result is
          instrumental music designed for late-night drives, headphones,
          science fiction, focus, exploration, and imagination.
        </p>
        <p style={{ margin: 0, fontStyle: "italic", color: "#B7BADF" }}>
          More than sound ~ this is a signal.
          <br />
          More than music ~ this is a message.
        </p>
      </div>

      {albums.map((album) => (
        <div key={album.title} style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <img
              src={album.cover}
              alt={album.title}
              style={{ width: 64, height: 64, borderRadius: 4, objectFit: "cover" }}
            />
            <div>
              <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF" }}>
                {album.title}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "#6E76B8" }}>
                {album.year}
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: "8px 20px" }}>
            {album.tracks.map((entry, i) => {
              const { file, label } = parseTrack(entry);
              return (
                <div
                  key={file}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: i < album.tracks.length - 1 ? "1px solid #21244A" : "none",
                  }}
                >
                  <div className="mono" style={{ fontSize: 12, color: "#565B8F", width: 20 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: "0 0 200px", fontSize: 14, color: "#D9DCFF" }}>
                    {label}
                  </div>
                  <audio controls preload="none" style={{ flex: 1, height: 32 }}>
                    <source src={BASE + file + ".mp3"} type="audio/mpeg" />
                  </audio>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 10 }}>
          COPYRIGHT NOTICE
        </div>
        <p style={{ fontSize: 12.5, color: "#8A8FBF", lineHeight: 1.7, margin: 0 }}>
          All songs on this page are the exclusive property of{" "}
          <a href="https://www.tempogoatstudios.com" target="_blank" rel="noopener noreferrer">
            Tempo Goat Studios
          </a>
          . These tracks are unfinished, unreleased and confidential. They
          may not be copied, distributed, or shared in any form without
          written consent from Tempo Goat Studios. Unauthorized use is
          strictly prohibited.
        </p>
      </div>
    </div>
  );
}
