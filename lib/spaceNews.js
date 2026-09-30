// Space News: headlines pulled from public RSS feeds (no keys, no accounts,
// nothing to sign up for). Server-only - fetched and cached by Next, so the
// browser never talks to these sites until someone clicks a headline.
//
// Each feed fails independently: if one is down or changes format, it just
// contributes nothing, and the page still shows the others. If all of them
// fail, the page shows a quiet "no news right now" message instead of an error.

export const NEWS_SOURCES = [
  { name: "NASA", url: "https://www.nasa.gov/news-release/feed/" },
  { name: "ESA", url: "https://www.esa.int/rssfeed/Our_Activities/Space_Science" },
  { name: "SpaceNews", url: "https://spacenews.com/feed/" },
];

// How long a fetched feed is reused before Next fetches it again (seconds).
export const NEWS_REFRESH_SECONDS = 1800;

const MAX_ITEMS = 30;
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

function parseFeed(xml, source) {
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
      };
    })
    // only ever link out to a real web address
    .filter((a) => a.title && /^https?:\/\//i.test(a.link));
}

async function fetchSource({ name, url }) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "13i.space news reader" },
      next: { revalidate: NEWS_REFRESH_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), name);
  } catch (e) {
    return [];
  }
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
