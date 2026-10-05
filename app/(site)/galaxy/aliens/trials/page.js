import { createClient } from "../../../../../lib/supabaseServer";
import { ARCHIVE_SPECIES } from "../../../../../lib/archiveSpecies";
import SurvivalTournament from "../../../../../components/SurvivalTournament";

// THE SURVIVAL TRIALS (Update 5.59): a tournament of every eligible species -
// the Archive's (from the stories) and every one the Kin have made - built
// and run by lib/survivalEngine.js. ?species=<id> marks one as yours.
export const dynamic = "force-dynamic";
export const metadata = { title: "The Survival Trials", description: "Every species in the galaxy, one bracket. 13i is watching." };

const MAX = 1000;

export default async function SurvivalTrialsPage({ searchParams }) {
  let species = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("alien_species").select("*").order("created_at", { ascending: true }).limit(MAX);
    species = data || [];
    const ids = [...new Set(species.map((s) => s.user_id))];
    if (ids.length) {
      const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
      const names = Object.fromEntries((profiles || []).map((p) => [p.id, p.username]));
      species = species.map((s) => ({ ...s, creator: names[s.user_id] }));
    }
  } catch (e) {
    species = [];
  }
  // eligible: has a name (stats are estimated from answers when missing)
  const entrants = [
    ...Object.values(ARCHIVE_SPECIES).map((sp) => ({ ...sp, creator: "13i" })),
    ...species.filter((s) => s.name && s.name.trim()),
  ];
  return <SurvivalTournament entrants={entrants} highlight={searchParams?.species || null} />;
}
