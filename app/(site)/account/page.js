import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Your Account</div>
      <div className="panel">
        {profile?.username && (
          <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#DCDFFF", marginBottom: 4 }}>
            {profile.username}
          </p>
        )}
        <p style={{ color: "#B7BADF", marginBottom: 16 }}>
          {user.email}
        </p>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            style={{
              background: "none",
              border: "1px solid #3A3E75",
              borderRadius: 4,
              color: "#B9C0FF",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              padding: "9px 20px",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 20 }}>
        This is the foundation everything else — submission history, your
        own assignments, the community space — will attach to next.
      </p>
    </div>
  );
}
