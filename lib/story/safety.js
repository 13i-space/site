// Story of Self: the human safety net. SERVER ONLY.
// When the Champion flags a safety concern, record an alert for the Story team
// (Supabase table story_safety_alerts, see supabase/v5.30-story-founders-safety.sql)
// and, if STORY_SAFETY_WEBHOOK_URL is set, ping it (Slack, Zapier, Make...).
// The webhook never includes what the student wrote, only that a flag happened.

export async function raiseSafetyAlert({ supabase, user, lesson, firstName, excerpt }) {
  try {
    await supabase.from("story_safety_alerts").insert({
      user_id: user.id,
      email: user.email || null,
      first_name: firstName || null,
      lesson: lesson.id,
      lesson_title: `${lesson.unit} · Lesson ${lesson.number}: ${lesson.title}`,
      excerpt: String(excerpt || "").slice(0, 800),
    });
  } catch (e) {
    console.error("Story safety: could not record alert", e);
  }
  const hook = process.env.STORY_SAFETY_WEBHOOK_URL;
  if (!hook) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://13i.space";
  const text = `Story of Self safety flag: ${firstName || "A student"} in ${lesson.unit}, Lesson ${lesson.number} (${lesson.title}). Review it in the Safety desk: ${site}/story/team/safety`;
  try {
    await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, lesson: lesson.id, at: new Date().toISOString() }) });
  } catch (e) {
    console.error("Story safety: webhook failed", e);
  }
}
