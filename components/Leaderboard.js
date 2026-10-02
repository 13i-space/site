"use client";

import { useState, useEffect, useRef } from "react";
import { lyraReact } from "../lib/lyraReact";
import { createClient } from "../lib/supabaseBrowser";
import { currentPeriodStart } from "../lib/dailyPeriod";

export default function Leaderboard({ game, limit = 8, refreshKey }) {
  const [rows, setRows] = useState(null);
  const myRank = useRef(null); // your place when the board last loaded

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data } = await supabase
          .from("daily_scores")
          .select("score, user_id, profiles(username)")
          .eq("game", game)
          .eq("period_start", currentPeriodStart())
          .order("score", { ascending: false })
          .limit(limit);
        setRows(data || []);
        // you climbed past someone since the board last loaded: Lyra spins
        if (user) {
          const i = (data || []).findIndex((r) => r.user_id === user.id);
          const rank = i < 0 ? Infinity : i;
          if (myRank.current !== null && rank < myRank.current) lyraReact("spin");
          myRank.current = rank;
        }
      } catch (e) {
        setRows([]);
      }
    })();
  }, [game, limit, refreshKey]);

  if (!rows || rows.length === 0) return null;

  return (
    <div style={styles.wrap}>
      <div className="mono" style={styles.header}>TODAY'S TOP {rows.length}</div>
      {rows.map((r, i) => (
        <div key={i} style={styles.row}>
          <span className="mono" style={styles.rank}>{i + 1}</span>
          <span style={styles.name}>{r.profiles?.username || "unknown"}</span>
          <span className="mono" style={styles.score}>{r.score.toLocaleString()}</span>
        </div>
      ))}
      <div className="mono" style={styles.reset}>resets at 00:00 UTC</div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "rgba(14,16,38,0.6)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "12px 14px",
    marginTop: 14,
  },
  header: { fontSize: 10, letterSpacing: "1px", color: "#565B8F", marginBottom: 8 },
  row: { display: "flex", alignItems: "center", gap: 10, padding: "3px 0" },
  rank: { width: 14, color: "#6E76B8", fontSize: 11 },
  name: { flex: 1, fontSize: 13, color: "#D9DCFF" },
  score: { fontSize: 12.5, color: "#E8CFC0" },
  reset: { fontSize: 9.5, color: "#3A3E75", marginTop: 8, textAlign: "right" },
};
