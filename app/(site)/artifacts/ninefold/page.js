import { redirect } from "next/navigation";

// The Ninefold was retired in Update 5.58; the Wish Engine took its place.
export default function NinefoldPage() {
  redirect("/artifacts/wish-engine");
}
