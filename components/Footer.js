import Link from "next/link";
import EmailSignup from "./EmailSignup";
import { createClient } from "../lib/supabaseServer";

export default async function Footer() {
  let signedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    signedIn = !!user;
  } catch (e) {
    signedIn = false;
  }

  return (
    <footer className="site-footer">
      {!signedIn && (
        <div style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 11, color: "#8A8FBF", marginBottom: 10 }}>
            Get updates as the launch approaches
          </div>
          <EmailSignup />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
        <Link href="/guestbook" style={{ color: "#6E76B8" }}>Guestbook</Link>
        <Link href="/about" style={{ color: "#6E76B8" }}>About</Link>
        <Link href="/contact" style={{ color: "#6E76B8" }}>Contact</Link>
      </div>

      <div>
        13i &middot; a signal, translated &middot; launching 4.6.2027
      </div>
      <div style={{ marginTop: 8 }}>
        Copyright &copy; Paul Donaghy. All Rights Reserved.{" "}
        <Link href="/privacy" style={{ color: "#565B8F" }}>Privacy Policy</Link>
        {" | "}
        <Link href="/terms" style={{ color: "#565B8F" }}>Terms of Use</Link>
      </div>
    </footer>
  );
}
