// Alpha Users: everyone who joined in 2026, before Beta - the site's first
// testers - plus Paul's two accounts. The database marks them
// (profiles.alpha / alpha_number, docs/v5.10-alpha-users.sql); until that's
// run, the join date decides.
export const ALPHA_FORUM = "/forum/alpha";
const ALWAYS = ["paul", "13i"];

export function isAlpha(profile) {
  if (!profile) return false;
  if (ALWAYS.includes(String(profile.username || "").toLowerCase())) return true;
  if (typeof profile.alpha === "boolean") return profile.alpha;
  return !!profile.created_at && profile.created_at < "2027-01-01";
}

export const alphaNumber = (profile) =>
  profile?.alpha_number ? `No. ${String(profile.alpha_number).padStart(3, "0")}` : null;
