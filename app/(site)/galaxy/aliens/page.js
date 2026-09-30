import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import AlienCard from "../../../../components/AlienCard";

// Aliens of the Galaxy: every species built in the Alien Lab, newest first,
// as collectible cards. Species are public (RLS "viewable by everyone").
export const dynamic = "force-dynamic";

const LIMIT = 60;

export default async function AliensOfTheGalaxy() {
  let species = [];
  let names = {};
  try {
    const supabase = await createClient();
    let { data, error } = await supabase
      .from("alien_species")
      .select("id, name, answers, portrait_svg, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    if (error) {
      // portrait_svg column not added yet - show the cards without art
      ({ data } = await supabase
        .from("alien_species")
        .select("id, name, answers, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(LIMIT));
    }
    species = data || [];
    const ids = [...new Set(species.map((s) => s.user_id))];
    if (ids.length) {
      const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
      names = Object.fromEntries((profiles || []).map((p) => [p.id, p.username]));
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
      <div className="page-subtitle">every species built in the Alien Lab &middot; newest first</div>

      <Link href="/create/alien-lab" className="panel" style={styles.cta}>
        <span>
          <span className="mono" style={{ display: "block", fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>THE ALIEN LAB</span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF" }}>
            Create your own alien &rarr;
          </span>
        </span>
        <span style={{ fontSize: 13, color: "#8A8FBF", maxWidth: 380 }}>
          Seventeen questions, a name, and a portrait drawn from your answers. Save it and it joins the gallery.
        </span>
      </Link>

      {species.length === 0 ? (
        <div className="panel" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#8A8FBF" }}>No species yet. The first card is waiting to be made.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {species.map((sp) => (
            <div key={sp.id} style={{ display: "flex", justifyContent: "center" }}>
              <AlienCard species={sp} creator={names[sp.user_id]} width={260} />
            </div>
          ))}
        </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 28,
  },
};
