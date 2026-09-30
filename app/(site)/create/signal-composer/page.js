import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import MusicLab from "../../../../components/MusicLab";

export default async function SignalComposerPage() {
  let loggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    loggedIn = !!user;
  } catch (e) {
    loggedIn = false;
  }

  return (
    <div>
      <Link href="/create" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Create
      </Link>
      <div className="page-title" style={{ marginTop: 14 }}>Signal Composer</div>
      <div className="page-subtitle">prototype &middot; every sound synthesized in your browser</div>
      <MusicLab loggedIn={loggedIn} />
      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 20, textAlign: "center" }}>
        Pick a mood and press play, then change anything. Nothing here is a recording: drone, pads,
        arpeggio, bass, drums and signal are all generated live.
      </p>
    </div>
  );
}
