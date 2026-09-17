const PAGE_CHAR_TARGET = 2200;

function looksLikeHeading(paragraph) {
  const p = paragraph.trim();
  if (p.length === 0 || p.length > 40) return false;
  if (/[.!?]$/.test(p)) return false; // real sentences end with punctuation
  return true;
}

export function paginateStory(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pages = [];
  let current = { heading: undefined, paragraphs: [] };
  let currentLen = 0;

  const pushPage = () => {
    if (current.paragraphs.length > 0) pages.push(current);
    current = { heading: undefined, paragraphs: [] };
    currentLen = 0;
  };

  paragraphs.forEach((p) => {
    if (looksLikeHeading(p)) {
      pushPage();
      current.heading = p;
      return;
    }
    if (currentLen + p.length > PAGE_CHAR_TARGET && current.paragraphs.length > 0) {
      pushPage();
    }
    current.paragraphs.push(p);
    currentLen += p.length;
  });
  pushPage();

  return pages;
}
