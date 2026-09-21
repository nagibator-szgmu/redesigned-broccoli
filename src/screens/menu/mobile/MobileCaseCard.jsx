import { RADIUS, FONT } from "../../../ui/theme";
import { IconClock, IconCheck } from "../../../ui/icons";

export default function MobileCaseCard({ c, catMeta, caseScores, startGame, t, C }) {
  const cm = catMeta[c.category] || { label: c.category, color: C.accent };
  const sc = { critical: C.red, moderate: C.yellow, mild: C.green }[c.severity] || C.yellow;
  const dots = { critical: 3, moderate: 2, mild: 1 }[c.severity] || 2;

  return (
    <div
      key={c.id}
      className="case-card"
      onClick={() => startGame(c.id)}
      style={{
        background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        borderRadius: RADIUS.md,
        padding: "16px",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                color: cm.color,
                fontFamily: FONT,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              {cm.label}
            </span>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: RADIUS.full,
                    background: d <= dots ? sc : `${sc}30`,
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.white,
              fontFamily: FONT,
              marginBottom: 4,
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {c.name}, {c.age} л
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              fontFamily: FONT,
              lineHeight: 1.5,
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconClock size={12} color={C.textDim} /> {c.timeLimit} {t("cases.minutes")}
          </span>
          <span
            style={{
              fontSize: 11,
              color: sc,
              fontFamily: FONT,
              background: `${sc}15`,
              borderRadius: RADIUS.xs,
              padding: "2px 7px",
              fontWeight: 500,
            }}
          >
            {
              {
                critical: t("severity.critical"),
                moderate: t("severity.moderate"),
                mild: t("severity.mild"),
              }[c.severity]
            }
          </span>
          {caseScores[c.id] != null && (
            <span
              style={{
                fontSize: 11,
                color: C.green,
                fontFamily: FONT,
                fontWeight: 600,
                background: `${C.green}15`,
                borderRadius: RADIUS.xs,
                padding: "2px 7px",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconCheck size={11} color={C.green} /> {caseScores[c.id]}
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
            borderRadius: RADIUS.sm,
            minHeight: 36,
            padding: "0 18px",
            fontSize: 13,
            fontWeight: 700,
            color: C.bg,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          {t("cases.start")}
        </button>
      </div>
    </div>
  );
}
