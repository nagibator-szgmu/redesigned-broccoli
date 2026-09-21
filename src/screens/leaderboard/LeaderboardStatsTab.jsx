import React from "react";
import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { CASES } from "../../data/cases";
import { IconAlertTriangle, IconHospital } from "../../ui/icons";
import { CAT_META, getErrorAnalysis } from "./leaderboardUtils";
import LeaderboardEmptyState from "./LeaderboardEmptyState";
import LeaderboardTopCases from "./LeaderboardTopCases";

/** Вкладка достижений, глобального ранга и прогресса по специальностям */
export default function LeaderboardStatsTab({
  rank,
  totalCases,
  avgScore,
  bestScore,
  survivalRate,
  catStats,
  topCases,
  uniqueCases,
  t,
  isMobile = false,
  sessionHistory = [],
  setPhase,
}) {
  const C = useTheme();

  if (totalCases === 0) {
    return <LeaderboardEmptyState setPhase={setPhase} isMobile={isMobile} />;
  }

  const cardStyle = {
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: isMobile ? 12 : 14,
    padding: isMobile ? 14 : 16,
    marginBottom: 10,
  };

  const sectionTitle = (icon, label, color = C.accent) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: 1, color, textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${color}55,transparent)` }} />
    </div>
  );

  const errors = getErrorAnalysis(sessionHistory, t);

  return (
    <>
      {/* Global rank banner */}
      {rank && (
        <div style={{ ...cardStyle, background: C.heroGrad, textAlign: "center", padding: isMobile ? "20px 16px" : "28px 24px", marginBottom: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{rank.icon}</div>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: rank.color, fontFamily: FONT, marginBottom: 4 }}>
            {rank.title}
          </div>
          <div style={{ fontSize: 12, color: C.heroText, fontFamily: FONT }}>Средний балл: {avgScore}/100</div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ ...cardStyle }}>
        {sectionTitle("📊", "Общая статистика")}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 8 : 12 }}>
          {[
            { v: totalCases, l: "Случаев", c: C.accent, icon: "🏥" },
            { v: `${avgScore}`, l: "Ср. балл", c: C.green, icon: "📈" },
            { v: `${bestScore}`, l: "Лучший", c: C.yellow, icon: "⭐" },
            { v: `${survivalRate}%`, l: "Выживаемость", c: survivalRate > 80 ? C.green : survivalRate > 50 ? C.yellow : C.red, icon: "💓" },
          ].map(({ v, l, c, icon }) => (
            <div key={l} style={{ background: C.btnBg, border: `1px solid ${C.btnBorder}`, borderRadius: isMobile ? 10 : 12, padding: isMobile ? "10px 8px" : "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 11 : 12, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: c, fontFamily: CODE, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, fontFamily: FONT, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Analysis */}
      {errors && errors.length > 0 && (
        <div style={{ ...cardStyle, background: `${C.yellow}0a`, border: `1px solid ${C.yellow}33` }}>
          {sectionTitle(<IconAlertTriangle size={14} color={C.yellow} />, "Рекомендации по пробелам", C.yellow)}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {errors.map((err, idx) => (
              <div
                key={idx}
                style={{
                  background: err.type === "warning" ? `${C.red}0d` : `${C.yellow}0d`,
                  border: `1px solid ${err.type === "warning" ? `${C.red}3b` : `${C.yellow}2b`}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12.5,
                  color: C.text,
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: err.type === "warning" ? C.red : C.yellow, display: "block", marginBottom: 3 }}>{err.title}</strong>
                {err.desc}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-category progress */}
      <div style={{ ...cardStyle }}>
        {sectionTitle(<IconHospital size={14} color={C.accent} />, "Прогресс по специальностям")}
        {Object.entries(CAT_META).map(([cat, cm]) => {
          const st = catStats[cat];
          const catCases = CASES.filter((c) => c.category === cat).length;
          const pct = catCases > 0 ? Math.round(((st?.played || 0) / catCases) * 100) : 0;
          const catAvg = st && st.played > 0 ? Math.round(st.totalScore / st.played) : 0;
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, padding: isMobile ? "7px 0" : "9px 0", borderBottom: `1px solid ${C.border}22` }}>
              <span style={{ fontSize: isMobile ? 16 : 18, width: 28, textAlign: "center" }}>{cm.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: isMobile ? 12 : 13, color: C.white, fontFamily: FONT, fontWeight: 500 }}>{t(`spec.${cat}`) || cat}</span>
                  <span style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, fontFamily: FONT }}>{st?.played || 0}/{catCases}</span>
                </div>
                <div style={{ height: 5, background: `${C.border}`, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: cm.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
              </div>
              {st && <span style={{ fontSize: isMobile ? 10 : 11, color: catAvg >= 70 ? C.green : catAvg >= 50 ? C.yellow : C.red, fontFamily: CODE, minWidth: 32, textAlign: "right" }}>{catAvg}</span>}
            </div>
          );
        })}
      </div>

      {/* Top scores list */}
      <LeaderboardTopCases topCases={topCases} isMobile={isMobile} />

      {/* Unique cases explored */}
      <div style={{ ...cardStyle, textAlign: "center", padding: isMobile ? "16px" : "20px" }}>
        <div style={{ fontSize: isMobile ? 13 : 14, color: C.textDim, fontFamily: FONT, marginBottom: 6 }}>Уникальных случаев пройдено</div>
        <div style={{ fontSize: isMobile ? 28 : 32, fontWeight: 700, color: C.accent, fontFamily: CODE }}>
          {uniqueCases}<span style={{ fontSize: isMobile ? 14 : 16, color: C.textDim }}>/{CASES.length}</span>
        </div>
      </div>
    </>
  );
}
