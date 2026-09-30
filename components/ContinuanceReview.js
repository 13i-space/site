"use client";

import { useState } from "react";
import { VERDICTS } from "../lib/continuance";
import { recordMilestone } from "../lib/milestones";
import AvatarPicker from "./AvatarPicker";

// 13i's Continuance Review of one species. Shows the review when there is
// one; to the species' creator, offers to submit it (or submit it again).
// Written by app/api/alien, action "review".
export default function ContinuanceReview({ species, isOwner, compact }) {
  const [review, setReview] = useState(species.review || null);
  const [status, setStatus] = useState("idle"); // idle | waiting | error
  const [note, setNote] = useState("");
  const [picking, setPicking] = useState(false);
  const [avatarSet, setAvatarSet] = useState(false);

  const request = async () => {
    setStatus("waiting");
    setNote("");
    try {
      const res = await fetch("/api/alien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review", speciesId: species.id }),
      });
      const data = await res.json();
      if (!data.review) throw new Error(data.error || "No review came back. Try again.");
      setReview(data.review);
      if (data.saved === false) setNote(data.error || "");
      else recordMilestone("review", { verdict: data.review.verdict, name: species.name });
      setStatus("idle");
    } catch (e) {
      setNote(e.message);
      setStatus("error");
    }
  };

  const v = review && VERDICTS[review.verdict];

  return (
    <div className="panel" style={{ margin: 0, textAlign: "left", borderColor: v ? `${v.color}66` : undefined }}>
      <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 10 }}>
        13i &middot; CONTINUANCE REVIEW
      </div>

      {review && v ? (
        <>
          <div className="mono" style={{ display: "inline-block", border: `1.5px solid ${v.color}`, color: v.color, borderRadius: 4, padding: "4px 10px", fontSize: 11, letterSpacing: "1.5px", marginBottom: 14 }}>
            {v.label.toUpperCase()}
          </div>
          <p style={{ fontSize: compact ? 14 : 15.5, lineHeight: 1.8, color: "#D9DCFF", margin: "0 0 12px" }}>{review.text}</p>
          {review.learned && (
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#8B95F6", fontStyle: "italic", margin: 0 }}>{review.learned}</p>
          )}
        </>
      ) : (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#8A8FBF", margin: 0 }}>
          {isOwner
            ? "Under the Continuance Rule, a species' survival depends on whether it can work with itself. Submit this species and 13i will decide whether it has earned continuance."
            : "13i has not reviewed this species yet."}
        </p>
      )}

      {isOwner && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <button onClick={request} disabled={status === "waiting"} className="mono" style={btn}>
            {status === "waiting" ? "13i is considering…" : review ? "Submit for review again" : "Submit to 13i for review"}
          </button>
          {status === "waiting" && <span className="mono" style={{ fontSize: 11, color: "#565B8F" }}>usually under half a minute</span>}
          {review && species.portrait_svg && (
            <button onClick={() => setPicking(true)} className="mono" style={{ ...btn, borderColor: "#6B5E3E", color: "#E8CFC0" }}>
              {avatarSet ? "It's your avatar now \u2713" : "Make it my avatar"}
            </button>
          )}
        </div>
      )}
      {picking && (
        <AvatarPicker
          initialSpecies={species}
          onClose={() => setPicking(false)}
          onSaved={() => { setAvatarSet(true); setPicking(false); }}
        />
      )}
      {note && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", margin: "10px 0 0" }}>{note}</p>}
    </div>
  );
}

const btn = {
  background: "none",
  border: "1px solid #3A3E75",
  borderRadius: 4,
  color: "#B9C0FF",
  fontSize: 12,
  padding: "9px 16px",
  cursor: "pointer",
};
