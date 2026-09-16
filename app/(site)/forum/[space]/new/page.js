import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabaseServer";
import NewThreadForm from "../../../../../components/NewThreadForm";

export default async function NewThreadPage({ params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: space } = await supabase
    .from("forum_spaces")
    .select("id, name")
    .eq("slug", params.space)
    .single();

  if (!space) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
      </div>
    );
  }

  return (
    <div>
      <Link href={`/forum/${params.space}`} className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to {space.name}
      </Link>
      <div className="page-title" style={{ marginTop: 14 }}>New Thread</div>
      <div className="page-subtitle">{space.name}</div>
      <NewThreadForm spaceId={space.id} spaceSlug={params.space} />
    </div>
  );
}
