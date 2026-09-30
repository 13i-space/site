"use client";

import { createClient } from "./supabaseBrowser";

// Steps of a Kin's first journey that no other table records (see
// components/FirstAssignment.js and docs/v5.8-continuance-and-milestones.sql).
// Silent no-ops when signed out, already recorded, or the table isn't there.
// `detail` rides along on the "13i:milestone" event (e.g. a review's verdict
// and species name, for Lyra). Repeat milestones in one browser session are
// only announced once - the Oracle records one per reply.
export async function recordMilestone(milestone, detail = {}) {
  try {
    const onceKey = `milestone_${milestone}`;
    if (milestone !== "review") {
      if (sessionStorage.getItem(onceKey)) return;
      sessionStorage.setItem(onceKey, "1");
    }
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("kin_milestones").upsert({ user_id: user.id, milestone }, { onConflict: "user_id,milestone", ignoreDuplicates: true });
    window.dispatchEvent(new CustomEvent("13i:milestone", { detail: { ...detail, milestone } }));
  } catch (e) {
    // ignore
  }
}
