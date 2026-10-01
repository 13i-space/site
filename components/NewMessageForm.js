"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";

// Start a conversation: search Kin by username only, pick one, and go to
// your conversation with them. Only public usernames and avatars are
// looked up - never names or emails - and the browser's own autofill is
// switched off, since it otherwise offers saved contacts (real names,
// email addresses) in a box like this.
export default function NewMessageForm() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(0);
  const [note, setNote] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    const term = q.trim();
    setNote("");
    if (!term) { setResults([]); return; }
    if (term.includes("@")) { setResults([]); setNote("Search by username - emails aren't searchable here."); return; }
    timer.current = setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const safe = term.replace(/[%_,()]/g, "");
        const { data } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .ilike("username", `${safe}%`)
          .not("username", "is", null)
          .order("username")
          .limit(6);
        setResults((data || []).filter((p) => p.id !== user?.id));
        setActive(0);
      } catch (e) {
        setResults([]);
      }
    }, 180);
    return () => clearTimeout(timer.current);
  }, [q]);

  const go = (p) => p && router.push(`/messages/${encodeURIComponent(p.username)}`);

  return (
    <div style={{ position: "relative", marginBottom: 22 }}>
      <form
        onSubmit={(e) => { e.preventDefault(); go(results[active]); }}
        autoComplete="off"
        style={{ display: "flex", gap: 8 }}
      >
        <input
          type="search"
          name="kin-handle-lookup"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          }}
          placeholder="Find a Kin to write to..."
          aria-label="Find a Kin by username"
          role="combobox"
          aria-expanded={results.length > 0}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          style={{ flex: 1, background: "transparent", border: "1px solid #262A55", borderRadius: 4, color: "#E4E4EF", fontSize: 13.5, padding: "9px 11px", outline: "none" }}
        />
        <button type="submit" disabled={!results.length} className="mono" style={{ background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF", fontSize: 12, padding: "0 14px", cursor: "pointer", opacity: results.length ? 1 : 0.4 }}>
          write
        </button>
      </form>
      {note && <p className="mono" style={{ fontSize: 11, color: "#8A8FBF", margin: "8px 0 0" }}>{note}</p>}
      {q.trim() && !note && (
        <div role="listbox" style={{ position: "absolute", zIndex: 10, left: 0, right: 0, top: "calc(100% + 4px)", background: "#0C0E24", border: "1px solid #3A3E75", borderRadius: 4, overflow: "hidden" }}>
          {results.length === 0 ? (
            <p style={{ margin: 0, padding: "10px 12px", fontSize: 12.5, color: "#565B8F" }}>No Kin by that username.</p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.id}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(p)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", background: i === active ? "rgba(139,149,246,0.12)" : "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", background: "#1C1F48", border: "1px solid #3A3E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="mono" style={{ fontSize: 11, color: "#8B95F6" }}>{p.username[0].toUpperCase()}</span>}
                </span>
                <span style={{ fontSize: 13.5, color: "#DCDFFF" }}>{p.username}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
