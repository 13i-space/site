import "./academy.css";

export const metadata = {
  title: { default: "Champion Academy", template: "%s · Champion Academy" },
  description: "Become a Story Champion: Aaron Donaghy's Champion training, guided by AI.",
  robots: { index: false, follow: false },
};

export default function AcademyLayout({ children }) {
  return (
    <div className="ac">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" />
      {children}
    </div>
  );
}
