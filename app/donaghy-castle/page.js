import { notFound } from "next/navigation";
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
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isFamilyPlayer(profile?.username)) return null;
    return { username: profile.username, id: user.id };
  } catch {
    return null;
  }
}

export default async function DonaghyCastlePage() {
  const player = await getPlayer();
  if (!player) notFound();
  const backHref = isSentinelUser(player.username) ? "/sentinel-x" : "/account";
  return <DonaghyCastle playerName={player.username} pid={player.id} backHref={backHref} />;
}
