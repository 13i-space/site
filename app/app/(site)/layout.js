import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import StarField from "../../components/StarField";

export default function SiteLayout({ children }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <StarField density={140} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
