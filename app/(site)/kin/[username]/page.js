import { createClient } from "../../../../lib/supabaseServer";

export default async function KinProfilePage({ params }) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url, created_at")
    .eq("username", params.username)
    .single();

  if (!profile) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
        <p style={{ color: "#8A8FBF" }}>No Kin goes by that name.</p>
      </div>
    );
  }

  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          width: 90, height: 90, borderRadius: "50%", overflow: "hidden", margin: "0 auto 18px",
          background: "#1C1F48", border: "1px solid #3A3E75",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span className="mono" style={{ fontSize: 30, color: "#8B95F6" }}>
            {profile.username[0].toUpperCase()}
          </span>
        )}
      </div>

      <div className="page-title" style={{ marginBottom: 4 }}>{profile.username}</div>
      {joined && (
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginBottom: 18 }}>
          KIN SINCE {joined.toUpperCase()}
        </div>
      )}

      {profile.bio && (
        <div className="panel" style={{ fontStyle: "italic", color: "#B7BADF" }}>
          "{profile.bio}"
        </div>
      )}
    </div>
  );
}
