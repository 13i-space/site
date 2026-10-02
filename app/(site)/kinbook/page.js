import Guestbook from "../../../components/Guestbook";

export const metadata = { title: "Kinbook", description: "An ongoing message list from the Kin, outside the forum." };

export default function KinbookPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="page-title">Kinbook</div>
      <div className="page-subtitle">messages from the Kin, outside the forum</div>
      <Guestbook />
    </div>
  );
}
