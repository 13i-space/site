import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import AlienCreator from "../../../../components/AlienCreator";

export default async function AlienLabPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <Link href="/create" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Create
      </Link>
      <div className="page-title" style={{ marginTop: 14 }}>The Alien Lab</div>
      <div className="page-subtitle">answer as you go &mdash; there's no wrong version of a species</div>
      <p className="mono" style={{ textAlign: "center", fontSize: 11, marginTop: -8, marginBottom: 20 }}>
        <Link href="/galaxy/aliens" style={{ color: "#6E76B8" }}>browse Aliens of the Galaxy &rarr;</Link>
      </p>
      <AlienCreator loggedIn={!!user} />
    </div>
  );
}
