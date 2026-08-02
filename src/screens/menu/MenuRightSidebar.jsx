import { FONT } from "../../ui/theme";
import { CASES } from "../../data/cases";
import { IconTrophy } from "../../ui/icons";

/**
 * MenuRightSidebar component for desktop right statistics & history column.
 */
export default function MenuRightSidebar({
  casesPlayed,
  totalScore,
  sessionHistory,
  catMeta,
  startGame,
  setShowAllCases,
  theme,
  t,
  C,
}) {
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;

  return (
    <div style={{ width: 280, flexShrink: 0, overflowY: "auto", padding: "26px 20px 40px 4px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Player Progress Card */}
      <div style={{ background: C.panelBg, backdropFilter: "blur(16px)", border: "1px solid rgba(0,230,200,0.08)", borderRadius: 18, padding: "18px 14px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: FONT, fontWeight: 600 }}>{t("progress.title")}</span>
          <span style={{ fontSize: 11, color: C.accent, fontFamily: FONT, background: "rgba(0,230,200,0.1)", borderRadius: 5, padding: "2px 8px" }}>{t("progress.streak")}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[
            { value: casesPlayed, max: CASES.length, label: t("progress.cases"), color: C.accent },
            { value: avgScore, max: 100, label: t("progress.avgScore"), color: C.green },
          ].map(({ value, max, label, color }) => {
            const pct = max > 0 ? Math.min(value / max, 1) : 0;
            const r = 30, circ = 2 * Math.PI * r;
            return (
              <div key={label} style={{ textAlign: "center", background: C.btnBg, border: `1px solid ${C.btnBorder}`, borderRadius: 14, padding: "14px 8px" }}>
                <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 10px" }}>
                  <svg width="72" height="72" style={{ transform: "rotate(-90deg)", display: "block" }}>
                    <circle cx="36" cy="36" r={r} fill="none" stroke={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,40,80,0.12)"} strokeWidth="4.5" />
                    <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="4.5" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: "stroke-dashoffset 0.8s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'SF Mono','Menlo',monospace", lineHeight: 1 }}>{value}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.btnBg, border: `1px solid ${C.btnBorder}`, borderRadius: 13, padding: "12px 16px" }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg,${C.yellow}25,${C.orange}15)`, border: `1px solid ${C.yellow}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconTrophy size={22} color={C.yellow} />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.yellow, fontFamily: "'SF Mono','Menlo',monospace", lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 3 }}>{t("progress.totalPoints")}</div>
          </div>
        </div>
      </div>

      {/* Primary New Patient CTA */}
      <button className="start-btn" onClick={startGame} style={{ background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5, width: "100%", boxShadow: `0 6px 24px rgba(0,230,200,0.3)`, transition: "all 0.2s" }}>
        {t("cta.newPatient")}
      </button>

      {/* Recent Sessions List */}
      <div style={{ background: C.panelBg, backdropFilter: "blur(16px)", border: "1px solid rgba(0,230,200,0.08)", borderRadius: 18, padding: "18px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: FONT }}>{t("sessions.recent")}</span>
          <span onClick={() => setShowAllCases(true)} style={{ fontSize: 11, color: C.accent, fontFamily: FONT, background: "rgba(0,230,200,0.08)", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>{t("sessions.allCases")}</span>
        </div>
        {sessionHistory.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 12, fontFamily: FONT, textAlign: "center", padding: "10px 0", lineHeight: 1.6 }}>{t("sessions.empty")}</div>
        ) : (
          sessionHistory.slice(0, 5).map((s) => {
            const cm = catMeta[s.category] || { icon: "🏥", color: C.accent };
            const gradeColor = { excellent: C.green, good: C.accent, satisfactory: C.yellow, unsatisfactory: C.red }[s.gradeId] || C.accent;
            const dateStr = new Date(s.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
            const shortName = s.caseName.split(" ").slice(0, 2).join(" ");
            return (
              <div key={s.id} className="session-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 12, marginBottom: 4, transition: "background 0.15s", cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `${cm.color}15`, border: `1px solid ${cm.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{cm.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.white, fontFamily: FONT, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{shortName}</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{dateStr} · <span style={{ color: gradeColor }}>{s.score} {t("scores.points")}</span></div>
                </div>
                <button onClick={() => startGame(s.caseId)} style={{ background: "transparent", border: "1px solid rgba(0,230,200,0.25)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: C.accent, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>{t("actions.retry")}</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
