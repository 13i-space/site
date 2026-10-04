import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabaseServer";
import NewThreadForm from "../../../../../components/NewThreadForm";
import { isAlpha } from "../../../../../lib/alpha";
import KinRoom from "../../../../../components/KinRoom";

export default async function NewThreadPage({ params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: space } = await supabase
    .from("forum_spaces")
    .select("*")
    .eq("slug", params.space)
    .single();

  if (!space) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
      </div>
    );
  }

  if (space.alpha_only || params.space === "alpha") {
    const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (!isAlpha(me ? { ...me, created_at: me.created_at || user.created_at } : null)) redirect(`/forum/${params.space}`);
  }

  return (
    <KinRoom room="forum" title="Start a thread" line={`In ${space.name}. Ask a question, share an idea, or just say hello.`} back={{ href: `/forum/${params.space}`, label: space.name }}>
      <NewThreadForm spaceId={space.id} spaceSlug={params.space} />
    </KinRoom>
  );
}
