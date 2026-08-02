import { FONT } from "../../ui/theme";

/**
 * CaseCard component for displaying an individual clinical case.
 * Shows specialty category, severity triage level, patient info, time limit, past score, and Start CTA.
 *
 * @param {Object} props
 * @param {Object} props.caseData - Case data object
 * @param {number} props.index - Grid item index for staggered animation
 * @param {Record<string, any>} props.catMeta - Category metadata
 * @param {Record<string, number>} props.caseScores - Map of best scores per case ID
 * @param {Function} props.startGame - Handler to launch simulation case
 * @param {Function} props.t - Translate function
 * @param {Object} props.C - Theme palette
 */
export default function CaseCard({ caseData: c, index, catMeta, caseScores, startGame, t, C }) {
  const cm = catMeta[c.category] || { icon: "🏥", label: c.category, color: C.accent };
  const sc = { critical: C.red, moderate: C.yellow, mild: C.green }[c.severity] || C.yellow;
  const dots = { critical: 3, moderate: 2, mild: 1 }[c.severity] || 2;
  const bestScore = caseScores[c.id];

  return (
    <div
      className="case-card"
      onClick={() => startGame(c.id)}
      style={{
        background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "pointer",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: index != null ? `fadeUp ${0.35 + index * 0.08}s ease` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            flexShrink: 0,
            background: `${cm.color}18`,
            border: `1px solid ${cm.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {cm.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: cm.color, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>
              {cm.label}
            </span>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3].map((d) => (
                <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= dots ? sc : `${sc}30` }} />
              ))}
            </div>
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
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, cursor: "help" }} title={t("cases.timeLimitTooltip")}>
            ⏱ {c.timeLimit} {t("cases.minutes")}
          </span>
          <span style={{ fontSize: 11, color: sc, fontFamily: FONT, background: `${sc}15`, borderRadius: 5, padding: "2px 7px" }}>
            {{ critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[c.severity]}
          </span>
          {bestScore != null && (
            <span style={{ fontSize: 11, color: C.green, fontFamily: FONT, fontWeight: 600, background: `${C.green}15`, borderRadius: 5, padding: "2px 7px" }}>
              ✓ {bestScore}
            </span>
          )}
        </div>
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
      </div>
    </div>
  );
}
