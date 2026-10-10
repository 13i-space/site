// Songs with something of their own in Rave Mode (Update 5.70).
//
// "Apprehension (Megan Halloween Remix)": Halloween colours, bats, jack-o'-
// lanterns, and a creepy little alien girl who appears when the voice in the
// track speaks (at the start, and in the breakdown right in the middle) and
// mouths the words. The voice was found by listening for speech in the file
// (a voice-activity model plus the spectrogram, checked by eye) and her mouth
// follows the voice's loudness, 30 steps a second, 0-9:
//   intro  0.5-13.4 s (clear from 0.6 to 8.2, then under the music)
//   middle 165.4-174.2 s
// To add a song: its file name, a theme and/or voice windows like these.
export const SPECIALS = {
  "apprehension-megan-halloween-remix": {
    theme: "halloween",
    voice: [
      { start: 0.5, end: 13.4, fps: 30, mouth: "000000000000002333330000233320003542000004555544220000000000000000000000000279999999878876652024336865542000003677666665200023444333320000000000000000000000000000000000246665300003555664320024778765443220022333333222200000000000000000000000000000000000002003400000023000002430000000000200000000000000000000000000000232243002220022222003000220233200000000000000022202300000000000200020000" },
      { start: 165.4, end: 174.2, fps: 30, mouth: "000000000000000000000344444444300000334333334330033333300000030000033300333300000464330000000000000000000000000000000000334333444443000479740346666764300030033300000000000000000000000000000034444333667633444300000004643467777666999974699667976644300000000000000000" },
    ],
  },
};

export const THEMES = {
  halloween: { palettes: [[28, 275], [95, 28], [282, 22], [15, 120], [30, 300]] },
};

export function specialFor(file) {
  return (file && SPECIALS[file]) || null;
}

// is she here (0-1, fading in before the words and out after), and how open
// is her mouth right now (0-1)
export function voiceAt(sp, s) {
  if (!sp || !sp.voice) return { on: 0, mouth: 0 };
  let on = 0, mouth = 0;
  for (const v of sp.voice) {
    const pre = 1.2, post = 1.4;
    if (s < v.start - pre || s > v.end + post) continue;
    const k = Math.min(1, (s - (v.start - pre)) / pre, (v.end + post - s) / post);
    on = Math.max(on, Math.max(0, k));
    const i = (s - v.start) * v.fps;
    if (i >= 0 && i < v.mouth.length - 1) {
      const a = +v.mouth[Math.floor(i)], b = +v.mouth[Math.floor(i) + 1];
      mouth = (a + (b - a) * (i - Math.floor(i))) / 9;
    }
  }
  return { on, mouth };
}
