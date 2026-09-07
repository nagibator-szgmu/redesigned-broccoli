import { FONT } from "../../ui/theme";
import { Tooltip } from "../../ui/components";
import { IconClock, IconCheck, IconHospital } from "../../ui/icons";

/**
 * CaseCard component for displaying an individual clinical case.
 * Shows specialty category, severity triage level, patient info, time limit, past score, and Start CTA.
 */
export default function CaseCard({ caseData: c, catMeta, caseScores, startGame, t, C }) {
  const cm = catMeta[c.category] || { icon: <IconHospital size={20} color={C.accent} />, label: c.category, color: C.accent };
  const sc = { critical: C.red, moderate: C.yellow, mild: C.green }[c.severity] || C.yellow;
  const dots = { critical: 3, moderate: 2, mild: 1 }[c.severity] || 2;
  const bestScore = caseScores ? caseScores[c.id] : null;

  const severityTitle = c.severity === "critical" ? "ТЯЖЕЛЫЙ ШОК / КРИТИЧЕСКИЙ КЕЙС" : c.severity === "moderate" ? "СРЕДНЯЯ ТЯЖЕСТЬ / ДЕКОМПЕНСАЦИЯ" : "СТАБИЛЬНОЕ СОСТОЯНИЕ";
  const severityText = c.severity === "critical" ? "Высокий риск жизнеугрожающих осложнений (арест, анафилаксия, кома). Требуется экстренное восстановление гемодинамики." : "Потребуется углубленный дифференциальный поиск и медикаментозный контроль.";

  return (
    <div
      className="case-card"
      onClick={() => startGame(c.id)}
      style={{
        background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: "18px",
        cursor: "pointer",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <Tooltip title={cm.label.toUpperCase()} text={`Клиническая специальность: ${cm.label}.`} position="top">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              flexShrink: 0,
              background: `${cm.color}18`,
              border: `1px solid ${cm.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cm.icon}
          </div>
        </Tooltip>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: cm.color, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {cm.label}
            </span>
            {c.department && (
              <span style={{
                fontSize: 10,
                color: c.department === "admission" ? (C.purple || "#a855f7") : c.department === "outpatient" ? C.accent : c.department === "stationary" ? (C.blue || "#38bdf8") : C.red,
                background: `${c.department === "admission" ? (C.purple || "#a855f7") : c.department === "outpatient" ? C.accent : c.department === "stationary" ? (C.blue || "#38bdf8") : C.red}18`,
                border: `1px solid ${c.department === "admission" ? (C.purple || "#a855f7") : c.department === "outpatient" ? C.accent : c.department === "stationary" ? (C.blue || "#38bdf8") : C.red}35`,
                borderRadius: 5,
                padding: "1px 6px",
                fontFamily: FONT,
                fontWeight: 600,
              }}>
                {c.department === "admission" ? "🏥 Приёмное" : c.department === "outpatient" ? "🩺 Поликлиника" : c.department === "stationary" ? "🛏️ Стационар" : "🚨 ОРИТ"}
              </span>
            )}
            <Tooltip title={severityTitle} text={severityText} position="top">
              <div style={{ display: "flex", gap: 4, cursor: "help" }}>
                {[1, 2, 3].map((d) => (
                  <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= dots ? sc : `${sc}30` }} />
                ))}
              </div>
            </Tooltip>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.white, fontFamily: FONT, marginBottom: 5, lineHeight: 1.3 }}>
            {c.name}, {c.age} {t("cases.ageSuffix") || "л"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              fontFamily: FONT,
              lineHeight: 1.55,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {c.complaint}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(0,230,200,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tooltip title="ЛИМИТ ВРЕМЕНИ" refRange={`Время: ${c.timeLimit} мин.`} text="Максимальное отведённое время на оказание экстренной помощи до фатального коллапса." position="top">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textDim, fontFamily: FONT, cursor: "help" }}>
              <IconClock size={13} color={C.textDim} /> {c.timeLimit} {t("cases.minutes")}
            </span>
          </Tooltip>
          <Tooltip title={severityTitle} text={severityText} position="top">
            <span style={{ fontSize: 11, color: sc, fontFamily: FONT, background: `${sc}15`, borderRadius: 5, padding: "2px 7px", cursor: "help" }}>
              {{ critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[c.severity]}
            </span>
          </Tooltip>
          {bestScore != null && (
            <Tooltip title="ЛУЧШИЙ РЕЗУЛЬТАТ ОСКЭ" refRange={`Рекорд: ${bestScore} б.`} text="Максимальный балл, полученный вами за данный клинический случай." position="top">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.green, fontFamily: FONT, fontWeight: 600, background: `${C.green}15`, borderRadius: 5, padding: "2px 7px", cursor: "help" }}>
                <IconCheck size={12} color={C.green} /> {bestScore}
              </span>
            </Tooltip>
          )}
        </div>
        <Tooltip title="ЗАПУСК КЛИНИЧЕСКОГО СЛУЧАЯ" text="Переход на виртуальную реанимационную станцию для курации пациента." position="top">
          <button
            className="start-btn"
            onClick={(e) => {
              e.stopPropagation();
              startGame(c.id);
            }}
            style={{
              background: C.accent,
              border: "none",
              borderRadius: 9,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 700,
              color: C.bg,
              cursor: "pointer",
              fontFamily: FONT,
              transition: "all 0.2s",
              boxShadow: `0 3px 12px rgba(0,230,200,0.25)`,
            }}
          >
            {t("cases.start")}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
