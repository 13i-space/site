// Space News: headlines pulled from public RSS feeds (no keys, no accounts,
// nothing to sign up for). Server-only - fetched and cached by Next, so the
// browser never talks to these sites until someone clicks a headline.
//
// Each feed fails independently: if one is down or changes format, it just
// contributes nothing, and the page still shows the others. If all of them
// fail, the page shows a quiet "no news right now" message instead of an error.

// `section` is the newspaper heading each source gets on /galaxy/news.
export const NEWS_SOURCES = [
  { name: "NASA", section: "The NASA Dispatch", url: "https://www.nasa.gov/news-release/feed/" },
  { name: "ESA", section: "From the European Desk", url: "https://www.esa.int/rssfeed/Our_Activities/Space_Science" },
  { name: "SpaceNews", section: "The Industry Ledger", url: "https://spacenews.com/feed/" },
  { name: "Spaceflight Now", section: "Launch Pad Bulletins", url: "https://spaceflightnow.com/feed/" },
  { name: "Universe Today", section: "Universe Today", url: "https://www.universetoday.com/feed/" },
  { name: "Phys.org", section: "The Science Column", url: "https://phys.org/rss-feed/space-news/" },
  // Space.com's feed was publishing an empty list as of 2026-09-30; it's
  // kept here so their headlines appear as soon as the feed recovers.
  { name: "Space.com", section: "Space.com Wire", url: "https://www.space.com/feeds.xml" },
];

// How long a fetched feed is reused before Next fetches it again (seconds).
export const NEWS_REFRESH_SECONDS = 1800;

const MAX_ITEMS = 60;
const MAX_PER_SOURCE = 9; // so one busy feed can't crowd out the rest
const SUMMARY_LENGTH = 220;

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tagText(item, tag) {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function toPlainText(html) {
  // decode first (some feeds double-encode their HTML), then strip tags
  return decodeEntities(decodeEntities(html).replace(/<[^>]+>/g, " "))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(text) {
  if (text.length <= SUMMARY_LENGTH) return text;
  const cut = text.slice(0, SUMMARY_LENGTH);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "\u2026";
}

// A picture for the story, from whichever place this feed keeps one:
// media:content / media:thumbnail, an image enclosure, or the first <img>
// in the body. Only absolute http(s) addresses are used.
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? decodeEntities(m[1]) : "";
}
function findImage(item) {
  const candidates = [];
  for (const t of item.match(/<media:(content|thumbnail)\b[^>]*>/gi) || []) {
    const type = attr(t, "type"), medium = attr(t, "medium");
    if (type && !type.startsWith("image")) continue;
    if (medium && medium !== "image") continue;
    candidates.push({ url: attr(t, "url"), w: Number(attr(t, "width")) || 0 });
  }
  for (const t of item.match(/<enclosure\b[^>]*>/gi) || []) {
    const type = attr(t, "type");
    if (!type || type.startsWith("image")) candidates.push({ url: attr(t, "url"), w: 0 });
  }
  // biggest first, when a feed lists several sizes
  candidates.sort((a, b) => b.w - a.w);
  const bodies = [tagText(item, "content:encoded"), tagText(item, "description")].map(decodeEntities);
  for (const b of bodies) {
    const img = b.match(/<img\b[^>]*>/i);
    if (img) candidates.push({ url: attr(img[0], "src") });
  }
  const hit = candidates.find((c) => /^https?:\/\//i.test(c.url) && !/\.(gif|svg)(\?|$)/i.test(c.url) && !/(pixel|feedburner|gravatar|emoji)/i.test(c.url));
  return hit ? hit.url.replace(/^http:/i, "https:") : null;
}

export function parseFeed(xml, source) {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  return items
    .map((item) => {
      const link = decodeEntities(tagText(item, "link"));
      const date = new Date(tagText(item, "pubDate"));
      return {
        source,
        title: toPlainText(tagText(item, "title")),
        link,
        summary: shorten(
          toPlainText(tagText(item, "description"))
            .replace(/\s*The post .* appeared first on .*$/, "") // WordPress feed boilerplate
            .replace(/\s*\[(\u2026|\.\.\.)\]\s*$/, "\u2026")
        ),
        date: isNaN(date) ? null : date.toISOString(),
        image: findImage(item),
      };
    })
    // only ever link out to a real web address
    .filter((a) => a.title && /^https?:\/\//i.test(a.link));
}

export async function fetchSource({ name, url }, max = MAX_PER_SOURCE) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "13i.space news reader" },
      next: { revalidate: NEWS_REFRESH_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), name)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, max);
  } catch (e) {
    return [];
  }
}

// For a story whose feed carried no picture, the article page's own
// preview image (og:image). Only tried for a handful of lead stories.
export async function previewImage(link) {
  try {
    const res = await fetch(link, {
      headers: { "User-Agent": "13i.space news reader" },
      next: { revalidate: NEWS_REFRESH_SECONDS * 4 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 120000);
    const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i);
    const url = tag ? attr(tag[0], "content") : "";
    return /^https?:\/\//i.test(url) ? url.replace(/^http:/i, "https:") : null;
  } catch (e) {
    return null;
  }
}

// The paper: every source as its own section (lead story first, with a
// picture wherever one can be found), plus the overall front page.
export async function getSpaceNewspaper() {
  const results = await Promise.all(NEWS_SOURCES.map(fetchSource));
  const seen = new Set();
  const sections = NEWS_SOURCES.map((src, i) => ({
    ...src,
    articles: results[i].filter((a) => (seen.has(a.link) ? false : seen.add(a.link))),
  })).filter((s) => s.articles.length);

  // the first two stories of each section get a picture if at all possible
  const missing = sections.flatMap((s) => s.articles.slice(0, 2).filter((a) => !a.image)).slice(0, 10);
  await Promise.all(missing.map(async (a) => { a.image = await previewImage(a.link); }));

  // put the pictured story at the top of each section
  for (const s of sections) {
    const k = s.articles.findIndex((a) => a.image);
    if (k > 0) s.articles.unshift(...s.articles.splice(k, 1));
  }
  const all = sections.flatMap((s) => s.articles).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const lead = all.find((a) => a.image) || all[0] || null;
  return { sections, lead, count: all.length };
}

export async function getSpaceNews() {
  const results = await Promise.all(NEWS_SOURCES.map(fetchSource));
  const seen = new Set();
  return results
    .flat()
    .filter((a) => (seen.has(a.link) ? false : seen.add(a.link)))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, MAX_ITEMS);
}
