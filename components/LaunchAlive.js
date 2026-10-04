"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SEASONS } from "../lib/seasons";
import { createClient } from "../lib/supabaseBrowser";
import { currentGreatWork } from "../lib/spacecoreStages";
import { albums, nextRelease } from "../lib/musicReleases";
import { cardNumber } from "../lib/alienTraits";

// "What's alive right now" on /launch: a few things that change on their
// own, so the front door shows a universe in motion rather than a list of
// features. Everything comes from data the site already has - the Season
// plan (lib/seasons.js), Lyra's feed (/api/lyra/feed: newest species, next
// song), and the public SpaceCore colony row. Anything that can't load
// simply doesn't appear.
// Update 5.55: the three tiles beside the season are the same size, and
// each carries a picture - the newest species as a mini card, a rocket on
// the pad for the Mars landing base, the album cover for the next song. If
// the live data can't load, the tile still stands with a gentler line.
export default function LaunchAlive() {
  const [feed, setFeed] = useState(null);
  const [work, setWork] = useState(null);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/lyra/feed").then((r) => r.json()).then((f) => { if (!cancelled) setFeed(f); }).catch(() => {});
    (async () => {
      try {
        const { data } = await createClient().from("spacecore_colony").select("stage, have").eq("id", 1).maybeSingle();
        if (!cancelled && data) setWork(currentGreatWork(data));
      } catch (e) { /* SpaceCore not set up - leave it out */ }
      try {
        const { data } = await createClient().from("alien_species").select("id, name, portrait_svg, created_at").order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (!cancelled && data) setLatest(data);
      } catch (e) { /* no species yet */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const season = SEASONS[0];
  const week = season?.weeks?.[0];
  const species = latest || feed?.species?.[0];
  const release = feed?.release || nextRelease();
  const cover = release && albums.find((a) => a.title === release.album)?.cover;
  const date = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <section className="alive" aria-labelledby="alive-title">
      <h2 id="alive-title" className="mono alive-kicker">WHAT&rsquo;S ALIVE RIGHT NOW</h2>
      <p className="alive-sub">Still being built. You arrived early.</p>

      <div className="alive-grid">
        {week && (
          <Link href={`/seasons/${season.number}/${week.week}`} className="alive-feature launch-card">
            <img src={week.cover} alt="" className="alive-cover" loading="lazy" />
            <span className="alive-feature-body">
              <span className="mono alive-label">{season.title.toUpperCase()} &middot; WEEK {week.week} &middot; {season.subtitle.toUpperCase()}</span>
              <span className="wordmark alive-feature-title">{week.title}</span>
              <span className="alive-text">{week.blurb}</span>
              <span className="mono alive-more">one record, six ways in &rarr;</span>
            </span>
          </Link>
        )}

        <div className="alive-side">
          <Link href={species ? `/galaxy/aliens/${species.id}` : "/create/alien-lab"} className="alive-item launch-card alive-tile alive-tile-species">
            <span className="alive-visual" aria-hidden="true">
              <span className="alive-minicard">
                <span className="alive-minicard-art">
                  {species?.portrait_svg ? (
                    <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(species.portrait_svg)}`} alt="" />
                  ) : (
                    <svg viewBox="0 0 40 40"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#2A2F6B" /><ellipse cx="15" cy="21" rx="3" ry="4" fill="#E8CFC0" /><ellipse cx="25" cy="21" rx="3" ry="4" fill="#E8CFC0" /><path d="M14 9 Q17 14 18 14 M26 9 Q23 14 22 14" stroke="#8B95F6" strokeWidth="1.4" fill="none" /></svg>
                  )}
                </span>
                <span className="alive-minicard-name">{species?.name || "?"}</span>
                <span className="mono alive-minicard-no">{species ? cardNumber(species.id) : "No. —"}</span>
              </span>
            </span>
            <span className="alive-tile-body">
              <span className="mono alive-label">NEWEST SPECIES</span>
              <span className="alive-item-title">{species?.name || "The Alien Lab"}</span>
              <span className="alive-text">
                {!species ? "Build a species, card and all." : feed?.speciesCount > 1 ? `The latest of ${feed.speciesCount.toLocaleString()} made by the Kin in the Alien Lab.` : "Made by one of the Kin in the Alien Lab."}
              </span>
            </span>
          </Link>

          <Link href="/create/spacecore" className="alive-item launch-card alive-tile alive-tile-mars">
            <span className="alive-visual" aria-hidden="true">
              <svg viewBox="0 0 80 80" className="alive-rocket">
                <defs>
                  <linearGradient id="aliveMars" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A1E24" /><stop offset="1" stopColor="#7A3A2A" /></linearGradient>
                  <linearGradient id="aliveHull" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9AA0D8" /><stop offset="0.5" stopColor="#F1F2FF" /><stop offset="1" stopColor="#8B91C8" /></linearGradient>
                </defs>
                <rect width="80" height="80" fill="#0D0E24" />
                <circle cx="62" cy="14" r="5" fill="#E8CFC0" opacity="0.8" />
                <circle cx="14" cy="10" r="0.8" fill="#fff" /><circle cx="30" cy="20" r="0.6" fill="#fff" /><circle cx="70" cy="34" r="0.7" fill="#fff" />
                <path d="M0 62 Q20 56 40 60 T80 58 V80 H0 Z" fill="url(#aliveMars)" />
                <rect x="20" y="58" width="2" height="8" fill="#565B8F" /><rect x="18" y="56" width="10" height="2" fill="#565B8F" />
                <g className="alive-rocket-body">
                  <path className="alive-flame" d="M36 56 Q40 70 44 56 Z" fill="#F2B66D" />
                  <path className="alive-flame alive-flame-inner" d="M38 56 Q40 64 42 56 Z" fill="#FFF3D6" />
                  <path d="M40 18 C46 26 47 40 46 56 H34 C33 40 34 26 40 18 Z" fill="url(#aliveHull)" />
                  <circle cx="40" cy="34" r="3.4" fill="#14163A" stroke="#8B95F6" strokeWidth="1.2" />
                  <path d="M34 46 L28 58 L34 56 Z M46 46 L52 58 L46 56 Z" fill="#C97B6E" />
                  <path d="M40 18 C42.5 21 43.5 23 44 25 H36 C36.5 23 37.5 21 40 18 Z" fill="#C97B6E" />
                </g>
              </svg>
            </span>
            <span className="alive-tile-body">
              <span className="mono alive-label">{work ? `MARS · GREAT WORK ${work.index} OF ${work.of}` : "MARS · THE LANDING BASE"}</span>
              <span className="alive-item-title">{work?.name || "SpaceCore"}</span>
              {work && <span className="alive-bar" aria-hidden="true"><span style={{ width: `${work.pct}%` }} /></span>}
              <span className="alive-text">{work ? `${work.pct}% built, by everyone digging on Mars together.` : "Everyone digs on Mars together. Bring something back."}</span>
            </span>
          </Link>

          {release && (
            <Link href="/music" className="alive-item launch-card alive-tile alive-tile-music">
              <span className="alive-visual alive-vinyl" aria-hidden="true">
                <span className="alive-disc" />
                {cover && feed && <img src={cover} alt="" className="alive-album" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.opacity = 0; }} />}
              </span>
              <span className="alive-tile-body">
                <span className="mono alive-label">{release.daysAway > 0 ? `NEXT SIGNAL · IN ${release.daysAway} DAYS` : "NEXT SIGNAL"}</span>
                <span className="alive-item-title">{release.title}</span>
                <span className="alive-text">{release.album}, arriving {date(release.date)}.</span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
