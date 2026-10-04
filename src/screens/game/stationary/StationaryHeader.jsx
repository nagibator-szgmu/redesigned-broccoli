import React from "react";
import { FONT } from "../../../ui/theme";
import { HeaderBackBtn } from "../../../ui/components";
import { IconBook, IconBed } from "../../../ui/icons";
import { DAY_COLORS } from "./constants";

/** Header for stationary screen */
export default function StationaryHeader({
  cd,
  cycle,
  setPhase,
  learningMode,
  setShowTheory,
  t,
  C,
  isMobile,
}) {
  const dayColor = DAY_COLORS[cycle.currentDay % 7];
  return (
    <header
      style={{
        flexShrink: 0,
        padding: isMobile ? "0 14px" : "0 20px",
        height: isMobile ? 52 : 54,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 10 : 12,
        background: C.headerBg,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} isMobile={isMobile} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>
          {cd.name} {!isMobile && `· ${cd.age} ${t("cases.ageSuffix")} · ${cd.gender}`}
        </div>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
          <IconBed size={11} color="currentColor" /> {t("department.stationary")} · {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
        </div>
      </div>
      {!isMobile && (
        <span
          style={{
            background: `${dayColor}20`,
            border: `1px solid ${dayColor}44`,
            borderRadius: 5,
            padding: "2px 8px",
            fontSize: 10,
            color: dayColor,
            fontWeight: 700,
            fontFamily: FONT,
          }}
        >
          {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
        </span>
      )}
      {learningMode && (
        <span
          style={{
            fontSize: 9,
            color: C.yellow,
            background: `${C.yellow}15`,
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <IconBook size={10} color="currentColor" /> {t("game.learning")}
        </span>
      )}
      <div
        onClick={() => setShowTheory((v) => !v)}
        style={{ cursor: "pointer", color: C.accent, padding: "2px 6px", display: "flex", alignItems: "center" }}
      >
        <IconBook size={16} color="currentColor" />
      </div>
    </header>
  );
}
