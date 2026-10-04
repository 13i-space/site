import { notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabaseServer";
import { isSentinelUser } from "../../../../lib/sentinel";
import { eventsBetween, KINDS } from "../../../../lib/siteCalendar";
import CalendarView from "../../../../components/SiteCalendar";

// Sentinel-X · the 2027 calendar (Update 5.56). Same gate as Sentinel-X:
// anyone else gets a 404. Events come from lib/siteCalendar.js.
export const dynamic = "force-dynamic";
export const metadata = { title: "Calendar · Sentinel-X", robots: { index: false, follow: false } };

export default async function SentinelCalendar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (!isSentinelUser(profile?.username)) notFound();

  const events = eventsBetween(new Date("2027-01-01T00:00:00Z"), new Date("2027-12-31T00:00:00Z"));
  return <CalendarView events={events} kinds={KINDS} year={2027} />;
}
