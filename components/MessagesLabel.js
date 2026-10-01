"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabaseBrowser";

// "Messages", or "Messages (2)" when there are unread private messages.
// Used in the Kinship menu and on the Kinship page. Refreshes every minute,
// and straight away when Lyra spots new mail or a conversation is read.
export default function MessagesLabel({ label = "Messages" }) {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) setUnread(0); return; }
        const { count } = await supabase
          .from("direct_messages")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .is("read_at", null);
        if (!cancelled) setUnread(count || 0);
      } catch (e) {
        // messages not switched on yet
      }
    };
    check();
    const id = setInterval(check, 60000);
    window.addEventListener("13i:messages-read", check);
    window.addEventListener("13i:messages-new", check);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("13i:messages-read", check);
      window.removeEventListener("13i:messages-new", check);
    };
  }, []);
  return (
    <>
      {label}
      {unread > 0 && <span style={{ color: "#E8CFC0" }}> ({unread})</span>}
    </>
  );
}
