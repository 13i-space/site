"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";

export default function EditProfile({ userId, username, initialBio, initialAvatarUrl }) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Please choose an image under 3MB.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // cache-bust so the new image shows immediately even with the same filename
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: freshUrl }).eq("id", userId);
    setAvatarUrl(freshUrl);
    setUploading(false);
  };

  const saveBio = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("profiles").update({ bio }).eq("id", userId);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
            background: "#1C1F48", border: "1px solid #3A3E75",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span className="mono" style={{ fontSize: 22, color: "#8B95F6" }}>
              {username ? username[0].toUpperCase() : "?"}
            </span>
          )}
        </div>
        <label
          className="mono"
          style={{
            fontSize: 11, color: "#B9C0FF", border: "1px solid #3A3E75", borderRadius: 4,
            padding: "7px 14px", cursor: "pointer", opacity: uploading ? 0.5 : 1,
          }}
        >
          {uploading ? "Uploading..." : "Change avatar"}
          <input type="file" accept="image/*" onChange={onAvatarChange} disabled={uploading} style={{ display: "none" }} />
        </label>
      </div>

      <form onSubmit={saveBio}>
        <label className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px" }}>
          WHAT BROUGHT YOU HERE
        </label>
        <textarea
          rows={2}
          maxLength={140}
          value={bio}
          onChange={(e) => { setBio(e.target.value); setSaved(false); }}
          placeholder="A line other Kin will see on your profile..."
          style={{
            width: "100%", background: "transparent", border: "1px solid #262A55", borderRadius: 3,
            color: "#E4E4EF", fontSize: 13, padding: "9px 10px", outline: "none", resize: "none",
            marginTop: 6, marginBottom: 10, boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
          }}
        />
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "7px 16px",
            cursor: "pointer", opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? "Saving..." : saved ? "Saved" : "Save"}
        </button>
        {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 8 }}>{error}</p>}
      </form>
    </div>
  );
}
