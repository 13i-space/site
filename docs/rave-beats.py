# Measures each song's beat grid for The Rave (lib/rave/beatData.js). Update 5.68.
import sys, json, os, numpy as np, librosa
out = {}
def fold(t, w, P, bins=96):
    ph = (t % P) / P
    h = np.bincount((ph*bins).astype(int) % bins, weights=w, minlength=bins)
    h = h + np.roll(h,1) + np.roll(h,-1)
    return h
for f in sys.argv[1:]:
    name = os.path.splitext(os.path.basename(f))[0]
    y, sr = librosa.load(f, sr=22050, mono=True)
    dur = len(y)/sr
    hop = 256
    oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop, aggregate=np.median)
    S = np.abs(librosa.stft(y, hop_length=hop, n_fft=2048))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    low = np.log1p(S[(freqs>30)&(freqs<150)].sum(axis=0))
    lowflux = np.maximum(0, np.diff(low, prepend=low[0]))
    t = librosa.frames_to_time(np.arange(len(oenv)), sr=sr, hop_length=hop)
    w = oenv - np.median(oenv); w = np.maximum(w, 0)
    def score(bpm):
        h = fold(t, w, 60/bpm)
        return h.max()/ (h.mean()+1e-9), int(np.argmax(h))
    cands = np.arange(85, 175, 0.05)
    sc = np.array([score(b)[0] for b in cands])
    best = cands[np.argmax(sc)]
    fine = np.arange(best-0.1, best+0.1, 0.002)
    fs = np.array([score(b)[0] for b in fine])
    bpm = fine[np.argmax(fs)]
    # snap to integer / half if nearly identical score
    for snap in (round(bpm), round(bpm*2)/2):
        if abs(snap-bpm) < 0.08 and score(snap)[0] > fs.max()*0.97:
            bpm = snap; break
    conc, b = score(bpm)
    P = 60/bpm
    off = (b + 0.5)/96 * P
    # refine phase precisely
    ph = np.linspace(off - P*0.06, off + P*0.06, 41)
    def phscore(o):
        grid = np.arange(o, dur, P)
        fr = np.clip(np.round(grid*sr/hop).astype(int), 0, len(oenv)-1)
        return w[fr].sum()
    off = ph[np.argmax([phscore(o) for o in ph])] % P
    grid = np.arange(off, dur, P)
    fr = np.clip(np.round(grid*sr/hop).astype(int), 0, len(lowflux)-1)
    st = [lowflux[fr[i::4]].mean() for i in range(4)]
    db = int(np.argmax(st))
    # per-16-beat block: is the grid alive here (onsets line up)?
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    n = int(np.ceil(dur/2)); per = int(2*sr/hop)
    e = np.array([rms[i*per:(i+1)*per].mean() if len(rms[i*per:(i+1)*per]) else 0 for i in range(n)])
    lo, hi = np.percentile(e, 5), np.percentile(e, 98)
    en = np.clip((e-lo)/(hi-lo+1e-9), 0, 1)
    out[name] = dict(dur=round(dur,1), bpm=round(float(bpm),3), offset=round(float((off + db*P) % (4*P)),4), conc=round(float(conc),2), energy="".join(str(int(round(v*9))) for v in en))
    print(name, out[name]['bpm'], out[name]['conc'], file=sys.stderr)
print(json.dumps(out))
