# Apprehension — music video source (Update 5.80)

Everything needed to re-render the 13i Apprehension video that plays at
/music/apprehension (public/video/apprehension.mp4). This folder is not part
of the website build.

The creative plan (music analysis, treatment, shot list, visual bible,
generation plan) lives in the "Apprehension — Music Video Plan" doc in the
13i website project.

## How the film works
- `film.html` draws every frame as a function of time `t` (seconds into the
  song) on the song's measured grid: 116 BPM, first downbeat 8.295 s,
  one bar = 2.069 s. `B(n)` is the start of bar n. Shots S01–S25 are listed in
  order near the bottom, each with its bar range.
- Interface shots (Lyra, Sentinel-X, the network map, the pie chart, the gap,
  UNKNOWN) are drawn in code and are final.
- Character and NovaCore shots are **stand-ins**: crops of Paul's reference
  boards, graded from sunset to 3:33 AM night (`crops.py`, `grade.py`,
  `grade2.py` → `assets/`). To swap in generated footage later, replace the
  stand-in shot's drawing with the clip (or composite it in the edit); the
  timing stays the same.
- `dots.json` is the world map's land dots (made by `dots.mjs`).

## Re-render
1. `npm install` in this folder.
2. Serve the folder: `python3 -m http.server 8765`.
3. `node preview.mjs 12.4 140.8` writes single frames to `prev/` for checking.
4. `node render.mjs 0 5144 video_only.mp4` renders the whole film (24 fps,
   1920×1080, 2.39:1 letterbox). Split into chunks to run in parallel and join
   them with ffmpeg's concat.
5. Mux with the untouched song and encode under 50 MB for the site:
   two-pass H.264 at 1600k video, 160k AAC, `-movflags +faststart`.
