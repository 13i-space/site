import { notFound, redirect } from "next/navigation";
import { createClient } from "../../lib/supabaseServer";
import { isFamilyPlayer } from "../../lib/familyGame";
import { isSentinelUser } from "../../lib/sentinel";
import DonaghyCastle from "../../components/castle/DonaghyCastle";

// Murder in the Donaghy Castle: the Donaghy family's game. Hidden - only the
// usernames in lib/familyGame.js can open it; everyone else gets the
// ordinary 404. Full screen, so it lives outside the (site) layout.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Murder in the Donaghy Castle", robots: { index: false, follow: false } };

async function getPlayer() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { signedOut: true };
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isFamilyPlayer(profile?.username)) return null;
    return { username: profile.username, id: user.id };
  } catch {
    return null;
  }
}

export default async function DonaghyCastlePage({ searchParams }) {
  const found = await getPlayer();
  const player = found && !found.signedOut ? found : null;
  if (!player) {
    // an invite link (?room=ABCD) lets anyone join that one game, no account
    // needed; without a code the page still doesn't exist
    const code = String(searchParams?.room || "").toUpperCase();
    if (/^[A-Z]{4}$/.test(code)) return <DonaghyCastle playerName="" guestCode={code} backHref="/" />;
    // not signed in (Aaron on a new browser, say): sign in, then straight back here
    if (found?.signedOut) redirect("/login?next=/donaghy-castle");
    notFound();
  }
  const backHref = isSentinelUser(player.username) ? "/sentinel-x" : "/account";
  return <DonaghyCastle playerName={player.username} pid={player.id} backHref={backHref} />;
}
