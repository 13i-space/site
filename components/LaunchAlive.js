"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SEASONS } from "../lib/seasons";
import { createClient } from "../lib/supabaseBrowser";
import { currentGreatWork } from "../lib/spacecoreStages";

// "What's alive right now" on /launch: a few things that change on their
// own, so the front door shows a universe in motion rather than a list of
// features. Everything comes from data the site already has - the Season
// plan (lib/seasons.js), Lyra's feed (/api/lyra/feed: newest species, next
// song), and the public SpaceCore colony row. Anything that can't load
// simply doesn't appear.
export default function LaunchAlive() {
  const [feed, setFeed] = useState(null);
  const [work, setWork] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/lyra/feed").then((r) => r.json()).then((f) => { if (!cancelled) setFeed(f); }).catch(() => {});
    (async () => {
      try {
        const { data } = await createClient().from("spacecore_colony").select("stage, have").eq("id", 1).maybeSingle();
        if (!cancelled && data) setWork(currentGreatWork(data));
      } catch (e) { /* SpaceCore not set up - leave it out */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const season = SEASONS[0];
  const week = season?.weeks?.[0];
  const species = feed?.species?.[0];
  const release = feed?.release;
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
          {species && (
            <Link href={`/galaxy/aliens/${species.id}`} className="alive-item launch-card">
              <span className="mono alive-label">NEWEST SPECIES</span>
              <span className="alive-item-title">{species.name}</span>
              <span className="alive-text">
                {feed.speciesCount > 1 ? `The latest of ${feed.speciesCount.toLocaleString()} made by the Kin in the Alien Lab.` : "Made by one of the Kin in the Alien Lab."}
              </span>
            </Link>
          )}
          {work && (
            <Link href="/create/spacecore" className="alive-item launch-card">
              <span className="mono alive-label">MARS &middot; GREAT WORK {work.index} OF {work.of}</span>
              <span className="alive-item-title">{work.name}</span>
              <span className="alive-bar" aria-hidden="true"><span style={{ width: `${work.pct}%` }} /></span>
              <span className="alive-text">{work.pct}% built, by everyone digging on Mars together.</span>
            </Link>
          )}
          {release && (
            <Link href="/music" className="alive-item launch-card">
              <span className="mono alive-label">{release.daysAway > 0 ? `NEXT SIGNAL · IN ${release.daysAway} DAYS` : "NEXT SIGNAL"}</span>
              <span className="alive-item-title">{release.title}</span>
              <span className="alive-text">{release.album}, arriving {date(release.date)}.</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
