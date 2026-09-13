export default function ThirteenIVsNemesisPage() {
  return (
    <div>
      <div className="page-title">13i vs NEMESIS</div>
      <div className="page-subtitle">five zones &middot; multiple weapons &middot; original prototype</div>
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <iframe
          src="/games/13i-vs-nemesis.html"
          title="13i vs NEMESIS"
          style={{
            width: "100%",
            height: "70vh",
            minHeight: 480,
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
