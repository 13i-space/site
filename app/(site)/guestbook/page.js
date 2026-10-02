import { redirect } from "next/navigation";

// The Guestbook became the Kinbook (Update 5.51)
export default function GuestbookPage() {
  redirect("/kinbook");
}
