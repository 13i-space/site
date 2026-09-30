import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import AlienGallery from "../../../../components/AlienGallery";
import { isAlpha } from "../../../../lib/alpha";

// Aliens of the Galaxy: every species built in the Alien Lab, newest first,
// as collectible cards. Species are public (RLS "viewable by everyone").
export const dynamic = "force-dynamic";

const LIMIT = 60;

export default async function AliensOfTheGalaxy() {
  let species = [];
  let names = {};
  let alphas = {};
  try {
    const supabase = await createClient();
    // "*" so the optional portrait_svg and stats columns come along when present
    const { data } = await supabase
      .from("alien_species")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    species = data || [];
    const ids = [...new Set(species.map((s) => s.user_id))];
    if (ids.length) {
      const { data: profiles } = await supabase.from("profiles").select("*").in("id", ids);
      names = Object.fromEntries((profiles || []).map((p) => [p.id, p.username]));
      alphas = Object.fromEntries((profiles || []).map((p) => [p.id, isAlpha(p)]));
    }
  } catch (e) {
    species = [];
  }

  return (
    <div>
      <Link href="/galaxy" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Galaxy
      </Link>
      <div className="page-title" style={{ marginTop: 20 }}>Aliens of the Galaxy</div>
      <div className="page-subtitle">every species built in the Alien Lab &middot; tap a card to flip it</div>

      <Link href="/create/alien-lab" className="panel" style={styles.cta}>
        <span>
          <span className="mono" style={{ display: "block", fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>THE ALIEN LAB</span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF" }}>
            Create your own alien &rarr;
          </span>
        </span>
        <span style={{ fontSize: 13, color: "#8A8FBF", maxWidth: 380 }}>
          Answer questions about its world and body, spend points on its strengths, name it, and get a portrait drawn from your answers. Save it and it joins the gallery.
        </span>
      </Link>

      {species.length === 0 ? (
        <div className="panel" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#8A8FBF" }}>No species yet. The first card is waiting to be made.</p>
        </div>
      ) : (
        <AlienGallery species={species.map((sp) => ({ ...sp, creator: names[sp.user_id], creatorAlpha: alphas[sp.user_id] }))} />
      )}
    </div>
  );
}

const styles = {
  cta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 28,
    borderColor: "#6B5E3E",
    textDecoration: "none",
  },
};
