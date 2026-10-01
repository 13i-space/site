// The Story of Self as a small, book-style PDF (5.5 × 8.5 in), built entirely in
// the browser so a student's story never leaves their device to make it.
// Fonts: Newsreader and Manrope (SIL Open Font License), in /public/story/fonts.

const PAGE_W = 396, PAGE_H = 612; // 5.5 × 8.5 in
const M_X = 54, M_TOP = 70, M_BOTTOM = 72;
const TEXT_W = PAGE_W - M_X * 2;
const BODY = 11, LEAD = 16.2, CAP = 56;
const NUMBERS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const FONT_FILES = ["Newsreader-Regular.ttf", "Newsreader-Italic.ttf", "Newsreader-SemiBold.ttf", "Manrope-Bold.ttf"];

export const slugify = (t) => String(t || "my-story").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "my-story";

// Turn the Story Write sections + text into book parts.
export function partsFromStoryWrite(storyWrite, text) {
  return storyWrite
    .map((p) => ({
      part: p.part,
      sections: p.sections.filter((s) => (text[s.key] || "").trim()).map((s) => ({ label: s.label, text: text[s.key].trim(), sentence: Boolean(s.sentence) })),
    }))
    .filter((p) => p.sections.length);
}

export async function downloadStoryBook({ title, author, parts }) {
  const [{ PDFDocument, rgb }, fkMod] = await Promise.all([import("pdf-lib"), import("@pdf-lib/fontkit")]);
  const fontkit = fkMod.default || fkMod;
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const bytes = await Promise.all(FONT_FILES.map((f) => fetch(`/story/fonts/${f}`).then((r) => { if (!r.ok) throw new Error("font"); return r.arrayBuffer(); })));
  const [serif, italic, semi, sans] = await Promise.all(bytes.map((b) => doc.embedFont(b, { subset: false, features: { liga: false, clig: false, dlig: false, calt: false } })));

  const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
  const C = { ink: hex("#2A2420"), soft: hex("#5E534B"), muted: hex("#8C7F74"), line: hex("#E2D6C5"), ember: hex("#C25B34"), gold: hex("#C99A3B"), paper: hex("#F7F1E8"), card: hex("#FFFCF7"), night: hex("#231E1B") };

  // Only draw characters the fonts actually have.
  const sets = new Map([serif, italic, semi, sans].map((f) => [f, new Set(f.getCharacterSet())]));
  const smart = (t) => t
    .replace(/(\w)'(\w)/g, "$1’$2").replace(/(^|[\s(\[—–-])'/g, "$1‘").replace(/'/g, "’")
    .replace(/(^|[\s(\[—–-])"/g, "$1“").replace(/"/g, "”");
  const clean = (font, t) => Array.from(smart(String(t || "").replace(/\s+/g, " "))).filter((ch) => sets.get(font).has(ch.codePointAt(0))).join("");

  const w = (font, size, t) => font.widthOfTextAtSize(t, size);
  const text = (page, t, x, y, font, size, color) => { if (t) page.drawText(t, { x, y, font, size, color }); };
  const tracked = (page, t, { y, font, size, color, track = 1.6, x = null }) => {
    const chars = Array.from(t);
    const total = chars.reduce((n, ch) => n + w(font, size, ch), 0) + track * (chars.length - 1);
    let cx = x ?? (PAGE_W - total) / 2;
    for (const ch of chars) { page.drawText(ch, { x: cx, y, font, size, color }); cx += w(font, size, ch) + track; }
  };
  const centered = (page, t, y, font, size, color) => text(page, t, (PAGE_W - w(font, size, t)) / 2, y, font, size, color);
  const mark = (page, cx, cy, s = 1, color = C.ember) => {
    page.drawCircle({ x: cx, y: cy, size: 7 * s, borderColor: color, borderWidth: 1.6 * s });
    page.drawCircle({ x: cx - 1.5 * s, y: cy + 8.2 * s, size: 2.6 * s, color });
  };

  // Greedy line breaking. `narrow` = { lines, by } shortens the first lines (drop cap).
  function wrap(t, font, size, width, { indent = 0, narrow = null } = {}) {
    const words = t.split(" ").filter(Boolean);
    const lines = [];
    const space = w(font, size, " ");
    let cur = [], curW = 0;
    const limit = () => width - (lines.length === 0 ? indent : 0) - (narrow && lines.length < narrow.lines ? narrow.by : 0);
    for (const word of words) {
      const ww = w(font, size, word);
      if (cur.length && curW + space + ww > limit()) { lines.push({ words: cur, w: curW }); cur = [word]; curW = ww; }
      else { curW += (cur.length ? space : 0) + ww; cur.push(word); }
    }
    if (cur.length) lines.push({ words: cur, w: curW, last: true });
    return lines;
  }
  function drawLine(page, line, x, y, width, font, size, color) {
    const space = w(font, size, " ");
    const gaps = line.words.length - 1;
    const extra = gaps ? (width - line.w) / gaps : 0;
    if (line.last || !gaps || extra > space * 1.6) { text(page, line.words.join(" "), x, y, font, size, color); return; }
    let cx = x;
    for (const word of line.words) { text(page, word, cx, y, font, size, color); cx += w(font, size, word) + space + extra; }
  }

  const safeTitle = clean(serif, title) || "My Story of Self";
  const by = clean(italic, author);

  // 1. Cover
  {
    const p = doc.addPage([PAGE_W, PAGE_H]);
    p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.night });
    p.drawRectangle({ x: 18, y: 18, width: PAGE_W - 36, height: PAGE_H - 36, borderColor: hex("#4A3F38"), borderWidth: 0.8 });
    // The story arc: an ordinary world, the fall, the shift, the rise.
    p.drawSvgPath("M 34 392 C 96 392 120 404 150 440 C 178 474 214 486 238 452 C 270 404 300 300 362 262", { x: 0, y: PAGE_H, borderColor: C.gold, borderWidth: 1.4, borderOpacity: 0.85 });
    p.drawSvgPath("M 34 404 C 100 404 126 420 156 452 C 186 488 220 500 246 466 C 278 420 306 322 362 288", { x: 0, y: PAGE_H, borderColor: C.ember, borderWidth: 0.7, borderOpacity: 0.55 });
    p.drawCircle({ x: 362, y: PAGE_H - 262, size: 4.2, color: C.gold });
    p.drawCircle({ x: 34, y: PAGE_H - 392, size: 2.6, color: C.ember });
    tracked(p, "A STORY OF SELF", { y: PAGE_H - 108, font: sans, size: 8.5, color: C.ember, track: 2.6 });
    let size = 34;
    let lines = wrap(safeTitle, serif, size, 290);
    while (lines.length > 3 && size > 22) { size -= 2; lines = wrap(safeTitle, serif, size, 290); }
    let y = PAGE_H - 160 - size;
    for (const l of lines) { centered(p, l.words.join(" "), y, serif, size, C.paper); y -= size * 1.12; }
    if (by) centered(p, `by ${by}`, y - 14, italic, 14, hex("#D8CBBE"));
    mark(p, PAGE_W / 2, 74, 1.1, C.ember);
    tracked(p, "STORYOFSELF.COM", { y: 44, font: sans, size: 6.5, color: hex("#8C7F74"), track: 2 });
  }

  const paperPage = () => {
    const p = doc.addPage([PAGE_W, PAGE_H]);
    p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.card });
    return p;
  };

  // 2. Title page
  {
    const p = paperPage();
    mark(p, PAGE_W / 2, PAGE_H - 150, 1.2);
    let y = PAGE_H - 220;
    for (const l of wrap(safeTitle, serif, 24, 270)) { centered(p, l.words.join(" "), y, serif, 24, C.ink); y -= 28; }
    if (by) centered(p, by, y - 8, italic, 13, C.soft);
    p.drawLine({ start: { x: PAGE_W / 2 - 18, y: y - 30 }, end: { x: PAGE_W / 2 + 18, y: y - 30 }, thickness: 0.8, color: C.ember });
    tracked(p, "STORY OF SELF", { y: 90, font: sans, size: 7.5, color: C.muted, track: 2.2 });
    centered(p, `Written ${new Date().getFullYear()}`, 74, italic, 9.5, C.muted);
  }

  // 3. Epigraph
  {
    const p = paperPage();
    const q = "“You are the only you that has ever existed, in the entire universe, across all of time, who will experience life exactly as you do. You are the only you that will live your story.”";
    let y = PAGE_H / 2 + 50;
    for (const l of wrap(clean(italic, q), italic, 13, 250)) { centered(p, l.words.join(" "), y, italic, 13, C.soft); y -= 19; }
    tracked(p, "AARON DONAGHY · STORY OF SELF", { y: y - 16, font: sans, size: 6.8, color: C.ember, track: 1.6 });
  }

  // 4. Contents (filled in once we know the page numbers)
  const contents = paperPage();
  const starts = [];
  const bodyPages = [];

  // 5. The story
  let page = null, y = 0;
  const newPage = (head = true) => { page = paperPage(); bodyPages.push({ page, head }); y = PAGE_H - M_TOP; };
  const need = (h) => { if (y - h < M_BOTTOM) newPage(); };

  parts.forEach((part, pi) => {
    newPage(false);
    starts.push(doc.getPageCount());
    y = PAGE_H - 150;
    tracked(page, `PART ${NUMBERS[pi] || pi + 1}`.toUpperCase(), { y, font: sans, size: 8, color: C.ember, track: 2.4 });
    y -= 34;
    centered(page, clean(serif, part.part), y, serif, 25, C.ink);
    y -= 22;
    page.drawLine({ start: { x: PAGE_W / 2 - 16, y }, end: { x: PAGE_W / 2 + 16, y }, thickness: 0.8, color: C.ember });
    y -= 40;
    let firstProse = true;

    for (const sec of part.sections) {
      need(30 + LEAD * 2);
      tracked(page, clean(sans, sec.label).toUpperCase(), { x: M_X, y, font: sans, size: 6.8, color: C.muted, track: 1.5 });
      y -= 18;

      if (sec.sentence) {
        const lines = wrap(clean(italic, sec.text), italic, 14.5, TEXT_W - 30);
        need(lines.length * 20 + 26);
        page.drawLine({ start: { x: M_X, y: y + 6 }, end: { x: M_X, y: y - lines.length * 20 + 10 }, thickness: 1.6, color: C.ember });
        for (const l of lines) { text(page, l.words.join(" "), M_X + 14, y - 6, italic, 14.5, C.ink); y -= 20; }
        y -= 18;
        continue;
      }

      const paras = String(sec.text).split(/\n+/).map((t) => clean(serif, t).trim()).filter(Boolean);
      paras.forEach((para, k) => {
        let body = para, cap = null, capW = 0;
        if (firstProse && k === 0) {
          const m = para.match(/^([“"‘']?\S)/);
          cap = m ? m[1] : null;
          if (cap) { body = para.slice(cap.length); capW = w(semi, CAP, cap) + 5; }
        }
        const lines = wrap(body, serif, BODY, TEXT_W, { indent: k > 0 ? 14 : 0, narrow: cap ? { lines: 3, by: capW } : null });
        if (cap) {
          need(LEAD * 3);
          text(page, cap, M_X - 1, y - BODY - LEAD * 2, semi, CAP, C.ember);
        }
        lines.forEach((l, i) => {
          if (y - LEAD < M_BOTTOM) newPage();
          const off = (i === 0 && k > 0 ? 14 : 0) + (cap && i < 3 ? capW : 0);
          drawLine(page, l, M_X + off, y - BODY, TEXT_W - off, serif, BODY, C.ink);
          y -= LEAD;
        });
        y -= 4;
        firstProse = false;
      });
      y -= 12;
    }
  });

  // 6. The last page
  {
    const p = paperPage();
    mark(p, PAGE_W / 2, PAGE_H / 2 + 54, 1.2);
    centered(p, "Own your story.", PAGE_H / 2, italic, 22, C.ink);
    centered(p, "At Story Night: read it, don't perform it. Stick to the script.", PAGE_H / 2 - 30, italic, 9.5, C.muted);
    tracked(p, "STORYOFSELF.COM", { y: 74, font: sans, size: 6.5, color: C.muted, track: 2 });
  }

  // Contents, running heads, page numbers
  tracked(contents, "CONTENTS", { y: PAGE_H - 150, font: sans, size: 8, color: C.ember, track: 2.4 });
  let cy = PAGE_H - 200;
  parts.forEach((part, i) => {
    const name = clean(serif, part.part), num = String(starts[i]);
    text(contents, `${NUMBERS[i] || i + 1}`, M_X + 6, cy, italic, 10, C.muted);
    text(contents, name, M_X + 52, cy, serif, 13, C.ink);
    const nw = w(serif, 11, num);
    text(contents, num, PAGE_W - M_X - nw - 6, cy, serif, 11, C.soft);
    const from = M_X + 58 + w(serif, 13, name), to = PAGE_W - M_X - nw - 14;
    for (let dx = from; dx < to; dx += 5) contents.drawCircle({ x: dx, y: cy + 3, size: 0.45, color: C.muted });
    cy -= 30;
  });
  const runHead = clean(italic, safeTitle);
  bodyPages.forEach(({ page: p, head }) => {
    const n = String(doc.getPages().indexOf(p) + 1);
    if (head) centered(p, runHead, PAGE_H - 40, italic, 8.5, C.muted);
    centered(p, n, 38, sans, 7.5, C.muted);
  });

  doc.setTitle(safeTitle);
  if (by) doc.setAuthor(by);
  doc.setSubject("A Story of Self");
  doc.setCreator("Story of Self");
  const pdf = await doc.save();
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(safeTitle)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
