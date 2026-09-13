import Guestbook from "../../../components/Guestbook";

export default function GuestbookPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="page-title">Guestbook</div>
      <div className="page-subtitle">a message wall for anyone passing through</div>
      <Guestbook />
    </div>
  );
}
