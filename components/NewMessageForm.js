"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Start a conversation: type a Kin's name and go to your conversation with them.
export default function NewMessageForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (n) router.push(`/messages/${encodeURIComponent(n)}`); }}
      style={{ display: "flex", gap: 8, marginBottom: 22 }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Write to a Kin by name..."
        aria-label="Username to message"
        style={{ flex: 1, background: "transparent", border: "1px solid #262A55", borderRadius: 4, color: "#E4E4EF", fontSize: 13.5, padding: "9px 11px", outline: "none" }}
      />
      <button type="submit" className="mono" style={{ background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF", fontSize: 12, padding: "0 14px", cursor: "pointer" }}>
        new message
      </button>
    </form>
  );
}
