export default function LogoWithRipple({ src = "/13i-logo.png", size = 140 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <style>{`
        @keyframes ripple-expand {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
        }
        .ripple-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(232, 207, 192, 0.5);
          transform: translate(-50%, -50%) scale(0.3);
          animation: ripple-expand 4.5s ease-out infinite;
          pointer-events: none;
        }
      `}</style>
      <div className="ripple-ring" style={{ animationDelay: "0s" }} />
      <div className="ripple-ring" style={{ animationDelay: "1.5s" }} />
      <div className="ripple-ring" style={{ animationDelay: "3s" }} />
      <img
        src={src}
        alt="13i"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "auto",
          filter: "drop-shadow(0 0 30px rgba(232,207,192,0.25))",
        }}
      />
    </div>
  );
}
