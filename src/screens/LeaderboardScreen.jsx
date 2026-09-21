import React, { useState } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import useIsMobile from "../hooks/useIsMobile";
import {
  computeEarnedCertificates,
  CERTIFICATE_THRESHOLDS,
  SCORE_THRESHOLDS,
  MODE_CERTIFICATES,
  SPEC_CERTIFICATES,
} from "../data/certificates";
import {
  getGlobalRank,
  aggregateStats,
  LeaderboardNavbar,
  LeaderboardTabSwitcher,
  LeaderboardStatsTab,
  LeaderboardCertsTab,
} from "./leaderboard";

/** Главный экран лидерборда, персональной статистики и дипломов врача */
export default function LeaderboardScreen({ setPhase, sessionHistory = [], initialTab = "stats" }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState(initialTab);

  const history = Array.isArray(sessionHistory) ? sessionHistory : [];
  const rank = getGlobalRank(history);
  const catStats = aggregateStats(history);
  const totalCases = history.length;
  const scores = history.map((s) => (typeof s?.score === "number" ? s.score : 0));
  const avgScore = totalCases ? Math.round(scores.reduce((a, b) => a + b, 0) / totalCases) : 0;
  const bestScore = totalCases ? Math.max(...scores) : 0;
  const totalDeaths = history.filter((s) => s?.died).length;
  const survivalRate = totalCases ? Math.round(((totalCases - totalDeaths) / totalCases) * 100) : 100;

  const topCases = [...history].sort((a, b) => (b?.score || 0) - (a?.score || 0)).slice(0, 10);
  const uniqueCases = new Set(history.filter((s) => s?.caseId).map((s) => s.caseId)).size;

  const earned = computeEarnedCertificates(history);
  const totalCerts =
    CERTIFICATE_THRESHOLDS.length +
    SCORE_THRESHOLDS.length +
    MODE_CERTIFICATES.length +
    SPEC_CERTIFICATES.length;

  const certSections = [
    { title: "Общие достижения", items: CERTIFICATE_THRESHOLDS },
    { title: "Серия и результаты", items: SCORE_THRESHOLDS },
    { title: "Режимы игры", items: MODE_CERTIFICATES },
    { title: "Специальности", items: SPEC_CERTIFICATES },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: C.bg, fontFamily: FONT }}>
      <LeaderboardNavbar setPhase={setPhase} isMobile={isMobile} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "14px 14px 80px" : "24px 20px 80px" }}>
        <LeaderboardTabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          earnedCount={earned.size}
          totalCerts={totalCerts}
        />
        {activeTab === "stats" ? (
          <LeaderboardStatsTab
            rank={rank}
            totalCases={totalCases}
            avgScore={avgScore}
            bestScore={bestScore}
            survivalRate={survivalRate}
            catStats={catStats}
            topCases={topCases}
            uniqueCases={uniqueCases}
            t={t}
            isMobile={isMobile}
            sessionHistory={history}
            setPhase={setPhase}
          />
        ) : (
          <LeaderboardCertsTab
            earned={earned}
            totalCerts={totalCerts}
            certSections={certSections}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
