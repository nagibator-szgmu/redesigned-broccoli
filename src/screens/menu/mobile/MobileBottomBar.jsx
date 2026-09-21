import { RADIUS, FONT, CODE } from "../../../ui/theme";

export default function MobileBottomBar({ casesPlayed, totalScore, startGame, t, C }) {
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;
  const stats = [
    { v: casesPlayed, l: t("progress.cases"), c: C.accent },
    { v: avgScore, l: t("progress.avgScore"), c: C.green },
    { v: totalScore, l: t("progress.totalPoints"), c: C.yellow },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: C.headerBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        padding: "10px 16px calc(10px + env(safe-area-inset-bottom, 10px))",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {stats.map(({ v, l, c }) => (
          <div
            key={l}
            style={{
              flex: 1,
              background: C.btnBg,
              borderRadius: RADIUS.sm,
              padding: "6px 8px",
              textAlign: "center",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              className="tabular-nums"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: c,
                fontFamily: CODE,
                lineHeight: 1,
              }}
            >
              {v}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <button
        className="start-btn"
        onClick={startGame}
        style={{
          background: `linear-gradient(135deg,${C.accent},${C.green})`,
          border: "none",
          borderRadius: RADIUS.sm,
          minHeight: 46,
          padding: "0 16px",
          fontSize: 15,
          fontWeight: 700,
          color: C.bg,
          cursor: "pointer",
          fontFamily: FONT,
          letterSpacing: 0.3,
          width: "100%",
          boxShadow: `0 4px 20px ${C.accent}30`,
        }}
      >
        {t("cta.newPatient")}
      </button>
    </div>
  );
}
