"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../lib/supabaseBrowser";

// Choosing an avatar: upload a photo, or use the portrait of one of your
// Alien Lab species. Then frame it - drag to move, slider / scroll / pinch
// to zoom - inside the circle it'll be shown in. The framed square is
// drawn to a canvas and uploaded to the "avatars" bucket, like before.
//
// initialSpecies: open straight into framing that species (the "Make it my
// avatar" button on a species' page).
const VIEW = 260; // the framing window, px
const OUT = 512; // the saved image, px
const MAX_ZOOM = 5;

// An SVG shown through <img> needs a size to draw onto a canvas in every
// browser - give the portrait one from its viewBox.
function svgSrc(svg) {
  let s = svg;
  const open = s.match(/<svg[^>]*>/i)?.[0] || "";
  if (!/\swidth=/.test(open)) {
    const vb = open.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)/i);
    const w = vb ? Number(vb[1]) : 400;
    const h = vb ? Number(vb[2]) : 400;
    const k = 1024 / Math.max(w, h);
    s = s.replace(/<svg/i, `<svg width="${Math.round(w * k)}" height="${Math.round(h * k)}"`);
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

export default function AvatarPicker({ onClose, onSaved, initialSpecies }) {
  const [step, setStep] = useState(initialSpecies ? "frame" : "choose");
  const [source, setSource] = useState(initialSpecies?.portrait_svg ? { src: svgSrc(initialSpecies.portrait_svg), label: initialSpecies.name } : null);
  const [species, setSpecies] = useState(null);
  const [img, setImg] = useState(null); // loaded HTMLImageElement
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  // your species with portraits
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from("alien_species").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(24);
        setSpecies((data || []).filter((s) => s.portrait_svg));
      } catch (e) {
        setSpecies([]);
      }
    })();
  }, []);

  // load whatever was chosen
  useEffect(() => {
    if (!source) return;
    const image = new Image();
    image.onload = () => { setImg(image); setZoom(1); setPan({ x: 0, y: 0 }); };
    image.onerror = () => setError("That image couldn't be opened. Try another.");
    image.src = source.src;
  }, [source]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // "cover" scale: the smallest that fills the window, then the zoom on top
  const base = img ? Math.max(VIEW / img.naturalWidth, VIEW / img.naturalHeight) : 1;
  const scale = base * zoom;
  const clampPan = (p, s = scale) => {
    if (!img) return p;
    const maxX = Math.max(0, (img.naturalWidth * s - VIEW) / 2);
    const maxY = Math.max(0, (img.naturalHeight * s - VIEW) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) };
  };
  const setZoomClamped = (z) => {
    const nz = Math.max(1, Math.min(MAX_ZOOM, z));
    setZoom(nz);
    setPan((p) => clampPan(p, base * nz));
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      setZoomClamped(pinch.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist));
    } else if (pointers.current.size === 1) {
      setPan((p) => clampPan({ x: p.x + (e.clientX - prev.x), y: p.y + (e.clientY - prev.y) }));
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onWheel = (e) => setZoomClamped(zoom * Math.exp(-e.deltaY * 0.0015));

  const chooseFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 12 * 1024 * 1024) { setError("Please choose an image under 12MB."); return; }
    setError("");
    setSource({ src: URL.createObjectURL(file), label: "your photo" });
    setStep("frame");
  };

  const save = async () => {
    if (!img) return;
    setStatus("saving");
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0A0B1C";
      ctx.fillRect(0, 0, OUT, OUT);
      const k = OUT / VIEW;
      const w = img.naturalWidth * scale * k;
      const h = img.naturalHeight * scale * k;
      ctx.drawImage(img, OUT / 2 + pan.x * k - w / 2, OUT / 2 + pan.y * k - h / 2, w, h);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) throw new Error("That image couldn't be framed. Try another.");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in.");
      const path = `${user.id}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (uploadError) throw new Error(uploadError.message);
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`; // cache-bust: same filename, new picture
      const { error: profileError } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
      if (profileError) throw new Error(profileError.message);
      setStatus("done");
      onSaved && onSaved(url);
    } catch (e) {
      setError(e.message || "Saving didn't work. Try again.");
      setStatus("idle");
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Change your avatar" onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className="panel" style={styles.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>
            {step === "choose" ? "CHANGE YOUR AVATAR" : `FRAME ${String(source?.label || "it").toUpperCase()}`}
          </span>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "#565B8F", fontSize: 18, cursor: "pointer" }}>&times;</button>
        </div>

        {step === "choose" ? (
          <>
            <label className="mono" style={{ ...styles.option, cursor: "pointer" }}>
              <span style={{ fontSize: 14, color: "#DCDFFF", fontFamily: "'Inter', sans-serif" }}>Upload a photo</span>
              <span style={{ fontSize: 11, color: "#6E76B8" }}>then frame it &rarr;</span>
              <input type="file" accept="image/*" onChange={chooseFile} style={{ display: "none" }} />
            </label>

            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", margin: "18px 0 8px" }}>OR BECOME ONE OF YOUR SPECIES</div>
            {species === null ? (
              <p style={{ fontSize: 12.5, color: "#565B8F", margin: 0 }}>Looking for your species...</p>
            ) : species.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#8A8FBF", margin: 0 }}>
                No species with a portrait yet. <a href="/create/alien-lab">Make one in the Alien Lab</a> and it can be your face here.
              </p>
            ) : (
              <div style={styles.speciesGrid}>
                {species.map((sp) => (
                  <button key={sp.id} onClick={() => { setSource({ src: svgSrc(sp.portrait_svg), label: sp.name }); setStep("frame"); }} style={styles.speciesBtn}>
                    <img src={svgSrc(sp.portrait_svg)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "50%", display: "block", border: "1px solid #3A3E75" }} />
                    <span style={{ display: "block", fontSize: 11, color: "#B9C0FF", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sp.name}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
              style={styles.frame}
              aria-label="Drag to move the picture"
            >
              {img && (
                <img
                  src={source.src}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: img.naturalWidth * scale,
                    height: img.naturalHeight * scale,
                    maxWidth: "none",
                    transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              )}
              <div style={styles.mask} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px auto 0", width: VIEW }}>
              <button onClick={() => setZoomClamped(zoom / 1.25)} aria-label="Zoom out" style={styles.zoomBtn}>&minus;</button>
              <input type="range" min={1} max={MAX_ZOOM} step={0.01} value={zoom} onChange={(e) => setZoomClamped(Number(e.target.value))} aria-label="Zoom" style={{ flex: 1, accentColor: "#8B95F6" }} />
              <button onClick={() => setZoomClamped(zoom * 1.25)} aria-label="Zoom in" style={styles.zoomBtn}>+</button>
            </div>
            <p className="mono" style={{ textAlign: "center", fontSize: 10.5, color: "#565B8F", margin: "8px 0 16px" }}>drag to move &middot; scroll or pinch to zoom</p>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <button onClick={() => { setStep("choose"); setImg(null); setSource(null); }} className="mono" style={{ ...styles.btn, opacity: 0.7 }}>&larr; choose another</button>
              <button onClick={save} disabled={!img || status === "saving"} className="mono" style={{ ...styles.btn, borderColor: "#6B5E3E", color: "#E8CFC0" }}>
                {status === "saving" ? "Saving..." : status === "done" ? "Saved" : "Save avatar"}
              </button>
            </div>
          </>
        )}
        {error && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", margin: "12px 0 0" }}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 220,
    background: "rgba(4,5,16,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 380,
    background: "#0C0E24",
    boxSizing: "border-box",
    margin: 0,
    textAlign: "left",
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    padding: "14px 16px",
  },
  speciesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
    gap: 12,
  },
  speciesBtn: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textAlign: "center",
    minWidth: 0,
  },
  frame: {
    position: "relative",
    width: VIEW,
    height: VIEW,
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: 6,
    background: "#0A0B1C",
    cursor: "grab",
    touchAction: "none",
  },
  mask: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    boxShadow: "0 0 0 200px rgba(4,5,16,0.62)",
    border: "1.5px solid rgba(232,207,192,0.7)",
    pointerEvents: "none",
  },
  zoomBtn: {
    width: 30,
    height: 28,
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontSize: 15,
    cursor: "pointer",
  },
  btn: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontSize: 12,
    padding: "9px 14px",
    cursor: "pointer",
  },
};
