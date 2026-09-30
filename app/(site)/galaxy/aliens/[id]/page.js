import Link from "next/link";
import { createClient } from "../../../../../lib/supabaseServer";
import { cardTagline } from "../../../../../lib/alienTraits";
import { verdictFor } from "../../../../../lib/continuance";
import AlienCard from "../../../../../components/AlienCard";
import ContinuanceReview from "../../../../../components/ContinuanceReview";
import ShareLink from "../../../../../components/ShareLink";
import { isAlpha } from "../../../../../lib/alpha";

// One species' own page: its card, 13i's Continuance Review (or, for its
// creator, the button to ask for one), and links to the map and gallery.
// Shared links show the card drawn by app/og/species/[id].
export const dynamic = "force-dynamic";

async function load(id) {
  const supabase = await createClient();
  const { data: species } = await supabase.from("alien_species").select("*").eq("id", id).maybeSingle();
  if (!species) return { species: null };
  const [{ data: profile }, { data: { user } }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", species.user_id).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  return { species, creator: profile?.username, creatorAlpha: isAlpha(profile), isOwner: !!user && user.id === species.user_id };
}

export async function generateMetadata({ params }) {
  try {
    const { species } = await load(params.id);
    if (!species) return {};
    const verdict = verdictFor(species);
    const title = `${species.name} · Aliens of the Galaxy`;
    const description = [cardTagline(species.answers), verdict && `13i: ${verdict.label}.`].filter(Boolean).join(" ") || "A species from the 13i Alien Lab.";
    const image = { url: `/og/species/${species.id}`, width: 1200, height: 630 };
    return { title, description, openGraph: { title, description, images: [image] }, twitter: { card: "summary_large_image", images: [image.url] } };
  } catch (e) {
    return {};
  }
}

export default async function SpeciesPage({ params }) {
  let data = { species: null };
  try { data = await load(params.id); } catch (e) { /* shown as not found below */ }
  const { species, creator, creatorAlpha, isOwner } = data;

  if (!species) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
        <p style={{ color: "#8A8FBF" }}>That species isn't in the gallery. It may have been deleted by its creator.</p>
        <Link href="/galaxy/aliens" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; Aliens of the Galaxy</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Link href="/galaxy/aliens" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Aliens of the Galaxy
      </Link>
      <div className="page-title" style={{ marginTop: 20 }}>{species.name}</div>
      <div className="page-subtitle">created by {creator || "a Kin"} &middot; tap the card to flip it</div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        <AlienCard species={species} creator={creator} creatorAlpha={creatorAlpha} width={300} />
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <ContinuanceReview species={species} isOwner={isOwner} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <Link href={`/galaxy/map?species=${species.id}`} className="mono" style={linkStyle}>find it on the Galaxy Map &rarr;</Link>
            <ShareLink path={`/galaxy/aliens/${species.id}`} title={species.name} style={linkStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

const linkStyle = {
  border: "1px solid #3A3E75",
  borderRadius: 4,
  padding: "8px 14px",
  fontSize: 11.5,
  color: "#B9C0FF",
  textDecoration: "none",
  background: "none",
  cursor: "pointer",
};
