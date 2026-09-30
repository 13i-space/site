"use client";

import { createClient } from "./supabaseBrowser";

// Steps of a Kin's first journey that no other table records (see
// components/FirstAssignment.js and docs/v5.8-continuance-and-milestones.sql).
// Silent no-ops when signed out, already recorded, or the table isn't there.
export async function recordMilestone(milestone) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("kin_milestones").upsert({ user_id: user.id, milestone }, { onConflict: "user_id,milestone", ignoreDuplicates: true });
    window.dispatchEvent(new CustomEvent("13i:milestone", { detail: { milestone } }));
  } catch (e) {
    // ignore
  }
}
