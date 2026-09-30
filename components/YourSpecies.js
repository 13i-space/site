"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";
import AlienCard from "./AlienCard";

// The Node's "Your Species" list: tap one to see its card, delete with a
// second tap to confirm. Deleting also removes it from Aliens of the Galaxy.
export default function YourSpecies({ initial, username }) {
  const [species, setSpecies] = useState(initial || []);
  const [open, setOpen] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState("");

  const remove = async (id) => {
    if (confirming !== id) { setConfirming(id); return; }
    setError("");
    try {
      const supabase = createClient();
      const { error: delError } = await supabase.from("alien_species").delete().eq("id", id);
      if (delError) throw new Error(delError.message);
      setSpecies((list) => list.filter((s) => s.id !== id));
      if (open === id) setOpen(null);
    } catch (e) {
      setError("Couldn't delete that one. Try again.");
    }
    setConfirming(null);
  };

  if (species.length === 0) return null;

  return (
    <div className="panel" style={{ marginTop: 16, textAlign: "left" }}>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
        <span>YOUR SPECIES</span>
        <Link href="/galaxy/aliens" style={{ color: "#6E76B8" }}>gallery &rarr;</Link>
      </div>
      {error && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", margin: "0 0 8px" }}>{error}</p>}
      {species.map((sp) => (
        <div key={sp.id} style={{ padding: "8px 0", borderBottom: "1px solid #21244A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setOpen(open === sp.id ? null : sp.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              {sp.portrait_svg ? (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sp.portrait_svg)}`}
                  alt=""
                  style={{ width: 52, height: 52, borderRadius: 4, border: "1px solid #262A55", flexShrink: 0, objectFit: "cover" }}
                />
              ) : (
                <span style={{ width: 52, height: 52, borderRadius: 4, border: "1px dashed #262A55", flexShrink: 0 }} />
              )}
              <span>
                <span style={{ display: "block", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 17, color: "#DCDFFF" }}>{sp.name}</span>
                <span className="mono" style={{ fontSize: 10, color: "#565B8F" }}>
                  {new Date(sp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}{open === sp.id ? "hide card" : "show card"}
                </span>
              </span>
            </button>
            <button
              onClick={() => remove(sp.id)}
              onBlur={() => confirming === sp.id && setConfirming(null)}
              className="mono"
              style={{
                background: "none",
                border: `1px solid ${confirming === sp.id ? "#C97B6E" : "#262A55"}`,
                borderRadius: 4,
                color: confirming === sp.id ? "#C97B6E" : "#565B8F",
                fontSize: 10.5,
                padding: "5px 9px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {confirming === sp.id ? "Delete for good?" : "Delete"}
            </button>
          </div>
          {open === sp.id && (
            <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
              <AlienCard species={sp} creator={username} width={280} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
