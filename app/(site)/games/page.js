import NemesisCommand from "../../../components/NemesisCommand";
import ThirteenIVsNemesis from "../../../components/ThirteenIVsNemesis";

export default function GamesPage() {
  return (
    <div>
      <div className="page-title">Games</div>
      <div className="page-subtitle">two ways to play</div>

      <div style={{ marginBottom: 44 }}>
        <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>
          NEMESIS Command
        </div>
        <p style={{ fontSize: 13, color: "#8A8FBF", marginBottom: 16 }}>
          Aim and fire. A fast, arcade take on NEMESIS's threat-elimination logic.
        </p>
        <NemesisCommand />
      </div>

      <div>
        <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>
          13i vs NEMESIS
        </div>
        <p style={{ fontSize: 13, color: "#8A8FBF", marginBottom: 16 }}>
          Defend Earth across five zones of approach. Only the Asteroid Belt
          encounter (kinetic interceptors vs. gravitic deflection) is live
          so far — the rest of the zones build on this same foundation.
        </p>
        <ThirteenIVsNemesis />
      </div>
    </div>
  );
}
